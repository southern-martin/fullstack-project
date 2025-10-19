# Translation Service - MD5 Key Generation Flow

## Overview
The translation service uses MD5 hashing to create unique keys for caching translations, matching the old PHP system's approach.

## Request Flow

### 1. Client Sends Translation Request
```json
POST /api/v1/translations/translate
{
  "text": "my text",
  "targetLanguage": "en"
}
```

### 2. MD5 Key Generation
The service generates an MD5 hash key using:
- **Input Text**: "my text" (trimmed)
- **Language Code**: "en" (string, not ID)
- **Combined**: `"my text_en"`
- **MD5 Hash**: `crypto.createHash("md5").update("my text_en").digest("hex")`

#### Example:
```typescript
// Input
text = "my text"
languageCode = "en"

// Key generation
keyData = "my text_en"
key = MD5(keyData) // e.g., "7f8b9e4a3c2d1e0f9a8b7c6d5e4f3a2b"
```

### 3. Cache Lookup
```typescript
// Check if translation exists with this key
const existingTranslation = await languageValueRepository.findByKeyAndLanguage(
  key,        // "7f8b9e4a3c2d1e0f9a8b7c6d5e4f3a2b"
  "en"        // languageCode (string)
);
```

### 4. Response Scenarios

#### A. Cache Hit (Translation Exists)
```json
{
  "translatedText": "mi texto",
  "fromCache": true
}
```
- Increments `usageCount`
- Updates `lastUsedAt` timestamp

#### B. Cache Miss (New Translation)
1. Performs translation (placeholder/API call)
2. Saves new `LanguageValue`:
```typescript
{
  key: "7f8b9e4a3c2d1e0f9a8b7c6d5e4f3a2b",  // MD5 hash
  original: "my text",                      // Source text
  destination: "mi texto",                  // Translated text
  languageCode: "en",                       // Language code (string FK)
  isApproved: false,                        // Pending approval
  usageCount: 0,
  context: { ... }
}
```
3. Returns:
```json
{
  "translatedText": "mi texto",
  "fromCache": false
}
```

## Old System Compatibility

### Field Mapping (PHP → NestJS)
| Old PHP System | New NestJS System | Type Change |
|----------------|-------------------|-------------|
| `language_code` | `languageCode` | `VARCHAR(5)` (FK) |
| `original` | `original` | `TEXT` |
| `destination` | `destination` | `TEXT` |
| `key` | `key` | `VARCHAR(255)` (MD5 hash) |

### Foreign Key Strategy
- **Old System**: String-based FK (`language_code → languages.code`)
- **New System (Reverted)**: String-based FK (`languageCode → languages.code`)
- **Advantage**: Direct language code in cache key without database lookup

## Database Schema

### languages table
```sql
CREATE TABLE languages (
  code VARCHAR(5) PRIMARY KEY,          -- 'en', 'es', 'fr'
  name VARCHAR(100) NOT NULL,           -- 'English'
  localName VARCHAR(100),               -- 'English' (native)
  status VARCHAR(20) DEFAULT 'active',  -- 'active' | 'inactive'
  flag VARCHAR(10),                     -- '🇺🇸'
  isDefault BOOLEAN DEFAULT FALSE,
  metadata JSON,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### language_values table
```sql
CREATE TABLE language_values (
  id INT PRIMARY KEY AUTO_INCREMENT,
  `key` VARCHAR(255) NOT NULL,               -- MD5 hash
  original TEXT NOT NULL,                    -- Source text
  destination TEXT NOT NULL,                 -- Translated text
  languageCode VARCHAR(5) NOT NULL,          -- FK to languages.code
  context JSON,
  isApproved BOOLEAN DEFAULT FALSE,
  approvedBy VARCHAR(255),
  approvedAt TIMESTAMP,
  usageCount INT DEFAULT 0,
  lastUsedAt TIMESTAMP,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  
  FOREIGN KEY (languageCode) REFERENCES languages(code),
  INDEX idx_key (`key`),
  INDEX idx_languageCode (languageCode),
  UNIQUE INDEX idx_key_language (`key`, languageCode)
);
```

## Implementation Files

### Core MD5 Logic
**File**: `src/domain/services/translation.domain.service.ts`
```typescript
generateTranslationKey(text: string, languageCode: string): string {
  const keyData = `${text.trim()}_${languageCode}`;
  return this.createMD5Hash(keyData);
}

private createMD5Hash(data: string): string {
  const crypto = require("crypto");
  return crypto.createHash("md5").update(data).digest("hex");
}
```

### Usage in Use Case
**File**: `src/application/use-cases/translate-text.use-case.ts`
```typescript
// Generate key using language code (not ID)
const key = this.translationDomainService.generateTranslationKey(
  translateTextDto.text,    // "my text"
  targetLanguage.code       // "en"
);

// Look up by key and language code
const existingTranslation = 
  await this.languageValueRepository.findByKeyAndLanguage(key, targetLanguage.code);
```

## Performance Benefits

1. **Fast Lookups**: MD5 hash + language code creates unique composite index
2. **No ID Resolution**: Language code is directly used (no lookup from ID)
3. **Consistent Keys**: Same text + language = same MD5 hash (deterministic)
4. **Cache Efficiency**: Redis can use the MD5 hash as cache key directly

## Example Workflow

```
POST {"text": "Hello World", "targetLanguage": "es"}
  ↓
Generate MD5: MD5("Hello World_es") = "abc123..."
  ↓
Query: SELECT * FROM language_values 
       WHERE `key` = 'abc123...' AND languageCode = 'es'
  ↓
IF FOUND:
  - Return cached destination
  - Increment usageCount
ELSE:
  - Call translation API/service
  - Save new record with key 'abc123...'
  - Return new translation
```

## Reversion Status
✅ **Complete** - All components updated to match old PHP system:
- Entity fields reverted
- Repository methods use `languageCode` (string)
- Domain service validates string codes
- Use cases generate MD5 with language code
- DTOs accept/return language codes

## Next Steps
Remaining files to update:
1. ~~`translate-text.use-case.ts`~~ ✅ Complete
2. `manage-language.use-case.ts`
3. `manage-translation.use-case.ts`
4. `translation.controller.ts`
5. Seed scripts

---
**Last Updated**: October 19, 2025  
**Status**: MD5 flow fully implemented and documented
