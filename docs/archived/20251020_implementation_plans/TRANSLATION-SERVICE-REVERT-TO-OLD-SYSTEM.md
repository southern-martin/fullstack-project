# Translation Service - Revert to Old PHP System Method

## ⚠️ IMPORTANT: Breaking Changes

This document tracks the reversion from the new NestJS implementation back to the old PHP system's translation method.

## 🔄 Changes Made So Far

### ✅ Completed Changes:

1. **LanguageTypeOrmEntity** - Reverted to old structure:
   - ✅ Removed `id` (auto-increment)
   - ✅ Changed `code` to PRIMARY KEY
   - ✅ Renamed `nativeName` → `localName`
   - ✅ Renamed `isActive` (boolean) → `status` (string: 'active'/'inactive')
   - ✅ Moved `flag` from `metadata.flag` → separate column
   - ✅ Updated indexes to remove `id` and use `code` as primary

2. **LanguageValueTypeOrmEntity** - Reverted to old structure:
   - ✅ Changed `languageId` (integer FK) → `languageCode` (string FK)
   - ✅ Updated foreign key to reference `languages.code` instead of `languages.id`
   - ✅ Renamed `originalText` → `original`
   - ✅ Renamed `translatedText` → `destination`
   - ✅ Updated indexes to use `languageCode` instead of `languageId`

3. **Language Domain Entity** - Updated to match:
   - ✅ Removed `id` property
   - ✅ Changed `code` to primary identifier
   - ✅ Renamed `nativeName` → `localName`
   - ✅ Changed `isActive` (boolean) → `status` (string)
   - ✅ Added `isActive` getter method for backward compatibility
   - ✅ Moved `flag` from `metadata.flag` → separate property

4. **LanguageValue Domain Entity** - Updated to match:
   - ✅ Changed `languageId` → `languageCode`
   - ✅ Renamed `originalText` → `original`
   - ✅ Renamed `translatedText` → `destination`

## 🔴 Files That Still Need Updates

### High Priority (Required for system to work):

1. **language.repository.ts** (~10 occurrences)
   - Update all references to `isActive` → check `status === 'active'`
   - Update all references to `nativeName` → `localName`
   - Remove `id` handling in CRUD operations

2. **language-value.repository.ts** (~20 occurrences)
   - Change all `languageId` → `languageCode`
   - Change all `originalText` → `original`
   - Change all `translatedText` → `destination`
   - Update foreign key lookups

3. **DTOs** (Data Transfer Objects):
   - `create-language.dto.ts`
   - `update-language.dto.ts`
   - `language-response.dto.ts`
   - `create-translation.dto.ts`
   - `update-translation.dto.ts`
   - `translation-response.dto.ts`
   - `translate-text.dto.ts`

4. **Use Cases**:
   - `manage-language.use-case.ts`
   - `manage-translation.use-case.ts`
   - `translate-text.use-case.ts`

5. **Domain Service**:
   - `translation.domain.service.ts`

6. **Controllers**:
   - `translation.controller.ts`

7. **Seed Scripts**:
   - `scripts/seed-data.ts` - Update to use new field names

### Medium Priority:

8. **Repository Interfaces**:
   - `language.repository.interface.ts`
   - `language-value.repository.interface.ts`

## 📋 Systematic Update Checklist

### Step 1: Repository Layer
- [ ] Update `language.repository.ts`
- [ ] Update `language-value.repository.ts`
- [ ] Update repository interfaces

### Step 2: DTO Layer
- [ ] Update all DTOs to match new field names
- [ ] Update response DTOs

### Step 3: Use Case Layer
- [ ] Update `manage-language.use-case.ts`
- [ ] Update `manage-translation.use-case.ts`
- [ ] Update `translate-text.use-case.ts`

### Step 4: Domain Service Layer
- [ ] Update `translation.domain.service.ts`
- [ ] Update validation methods

### Step 5: Controller Layer
- [ ] Update `translation.controller.ts`
- [ ] Update health checks if needed

### Step 6: Seed Scripts
- [ ] Update `scripts/seed-data.ts`
- [ ] Test seed script with new structure

### Step 7: Testing
- [ ] Run TypeScript compilation
- [ ] Check for any remaining errors
- [ ] Test CRUD operations
- [ ] Test translation lookups

## 🔍 Search & Replace Patterns

### Field Name Changes:
```bash
# Language entity
nativeName → localName
isActive (boolean) → status (string: 'active'/'inactive')
metadata.flag → flag

# LanguageValue entity
languageId → languageCode
originalText → original
translatedText → destination
```

### Logic Changes:
```typescript
// Old (boolean):
where: { isActive: true }

// New (string comparison):
where: { status: 'active' }
```

```typescript
// Old (integer FK):
languageId: 1

// New (string FK):
languageCode: 'en'
```

```typescript
// Old (ID-based join):
@JoinColumn({ name: "languageId" })

// New (code-based join):
@JoinColumn({ name: "languageCode", referencedColumnName: "code" })
```

## 💡 Why This Reversion?

### Advantages of Old PHP Method:
1. ✅ **Simpler Lookups**: No need to join with languages table to get code
2. ✅ **Human Readable**: Language codes ('en', 'es') are meaningful
3. ✅ **Backward Compatible**: Matches existing PHP system
4. ✅ **URL Friendly**: Can use language code in URLs directly
5. ✅ **Stable**: Language codes rarely change (ISO 639-1 standard)

### Trade-offs:
1. ⚠️ **Performance**: String FKs slightly slower than integer FKs
2. ⚠️ **Storage**: Slightly more storage (VARCHAR vs INT)
3. ⚠️ **Consistency**: If language code changes, need to update all translations
4. ⚠️ **Index Size**: String indexes larger than integer indexes

## 🎯 Migration Plan

### Option A: Complete All Changes Now (Recommended)
**Estimated Time**: 2-3 hours
- Update all ~50 files systematically
- Run comprehensive tests
- Update documentation
- Commit as single feature

### Option B: Partial Migration (Not Recommended)
- Mix of old and new methods will cause confusion
- Type errors and runtime errors likely
- Difficult to debug

### Option C: Revert Back to Original (Alternative)
- If this reversion is causing too many issues
- Can keep the new improved system
- Add compatibility layer for old PHP system

## 📝 Next Steps

**Recommendation**: I suggest we proceed with **Option A** - complete all changes systematically.

Would you like me to:
1. ✅ **Continue with full reversion** - Update all remaining ~50 files
2. ❌ **Revert these changes** - Go back to the new improved system
3. ⏸️ **Create compatibility layer** - Support both old and new methods

Please confirm which approach you prefer before I proceed further.

---

## 🔧 Technical Notes

### Database Migration Script (MySQL)
```sql
-- Step 1: Alter languages table
ALTER TABLE languages 
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (code),
  DROP COLUMN id,
  CHANGE COLUMN nativeName localName VARCHAR(100),
  CHANGE COLUMN isActive status VARCHAR(20) DEFAULT 'active',
  ADD COLUMN flag VARCHAR(10) AFTER localName;

-- Step 2: Update flag data from metadata
UPDATE languages 
SET flag = JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.flag'))
WHERE metadata IS NOT NULL AND JSON_EXTRACT(metadata, '$.flag') IS NOT NULL;

-- Step 3: Alter language_values table
ALTER TABLE language_values
  DROP FOREIGN KEY FK_language_values_languageId,
  ADD COLUMN languageCode VARCHAR(5) AFTER id,
  CHANGE COLUMN originalText original TEXT,
  CHANGE COLUMN translatedText destination TEXT;

-- Step 4: Populate languageCode from languageId
UPDATE language_values lv
JOIN languages l ON lv.languageId = l.id
SET lv.languageCode = l.code;

-- Step 5: Drop old languageId and create new FK
ALTER TABLE language_values
  DROP COLUMN languageId,
  ADD CONSTRAINT FK_language_values_languageCode 
    FOREIGN KEY (languageCode) REFERENCES languages(code)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- Step 6: Update indexes
DROP INDEX IDX_languageId ON language_values;
CREATE INDEX IDX_languageCode ON language_values(languageCode);
DROP INDEX IDX_isActive ON languages;
CREATE INDEX IDX_status ON languages(status);
```

---

**Status**: ⚠️ PARTIAL - Entities updated, remaining files need changes
**Impact**: 🔴 HIGH - Breaking changes to database schema and API
**Estimated Remaining Work**: 2-3 hours for complete reversion
