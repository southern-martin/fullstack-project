# Translation Service Integration Guide

## Overview
This document describes the integration between React Admin and the Translation Service backend.

## Backend Structure (Translation Service)
- **Port**: 3007
- **Base URL**: `http://localhost:3007/api/v1/translation`
- **Primary Key**: `code` (string) for languages, not numeric `id`
- **Field Mappings**: Old PHP system compatibility

### Language Entity Structure
```typescript
{
  code: string;           // Primary key (e.g., "en", "es", "fr")
  name: string;           // English name (e.g., "English", "Spanish")
  localName: string;      // Native name (e.g., "English", "Español")
  status: string;         // 'active' or 'inactive'
  flag: string;           // Flag emoji (e.g., "🇺🇸", "🇪🇸")
  isDefault: boolean;     // Is this the default language
  metadata: {
    direction?: 'ltr' | 'rtl';
    region?: string;
    currency?: string;
    dateFormat?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Translation Entity Structure
```typescript
{
  id: number;             // Auto-increment ID
  key: string;            // Translation key (MD5 hash in old system)
  original: string;       // Original text
  destination: string;    // Translated text
  languageCode: string;   // Foreign key to language.code
  language: {
    code: string;
    name: string;
  };
  context: {
    category?: string;
    module?: string;
    component?: string;
    field?: string;
  };
  isApproved: boolean;
  approvedBy: string;
  approvedAt: Date;
  usageCount: number;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Language Management
- `POST /api/v1/translation/languages` - Create language
- `GET /api/v1/translation/languages` - Get all languages
- `GET /api/v1/translation/languages/active` - Get active languages only
- `GET /api/v1/translation/languages/count` - Get language count
- `GET /api/v1/translation/languages/:code` - Get language by code (primary key)
- `GET /api/v1/translation/languages/code/:code` - Get language by code (alternate endpoint)
- `PATCH /api/v1/translation/languages/:code` - Update language
- `DELETE /api/v1/translation/languages/:code` - Delete language

### Translation Management
- `POST /api/v1/translation/translations` - Create translation
- `GET /api/v1/translation/translations` - Get all translations (paginated)
- `GET /api/v1/translation/translations/count` - Get translation count
- `GET /api/v1/translation/translations/pending` - Get pending approvals
- `GET /api/v1/translation/translations/:id` - Get translation by ID
- `PATCH /api/v1/translation/translations/:id` - Update translation
- `DELETE /api/v1/translation/translations/:id` - Delete translation

### Translation Operations
- `POST /api/v1/translation/translate` - Translate text
- `POST /api/v1/translation/translate/batch` - Batch translate
- `GET /api/v1/translation/stats/:languageCode` - Get translation stats

### Health Check
- `GET /api/v1/health` - Service health check

## Frontend Updates

### Updated Interfaces
The following interfaces have been updated to match the backend structure:

1. **Language Interface**: Changed from numeric `id` to string `code` as primary key
2. **Translation Interface**: Changed field names to match backend (`original`, `destination`, `languageCode`)
3. **DTOs**: Updated create/update DTOs with backward compatibility

### Key Changes
- `nativeName` → `localName`
- `isActive` (boolean) → `status` ('active' | 'inactive')
- `isRTL` (boolean) → `metadata.direction` ('ltr' | 'rtl')
- `languageId` (number) → `languageCode` (string)
- `value` → `destination`
- Added `original` field
- Added `flag` field for emoji flags

### Backward Compatibility
The TypeScript interfaces include deprecated fields for backward compatibility:
- Components can still use `isActive`, `isRTL`, `nativeName` (will be transformed)
- Old field names are marked as deprecated with comments

### API Client Updates
- Language endpoints now use `code` instead of `id`
- Update methods changed from `PUT` to `PATCH`
- Added data transformation layer in `translationService.ts`

## Configuration

### Environment Variables
Add to React Admin `.env`:
```bash
REACT_APP_TRANSLATION_API_URL=http://localhost:3007
```

### API Config
Already configured in `/src/config/api.ts`:
```typescript
export const TRANSLATION_API_CONFIG = {
  BASE_URL: 'http://localhost:3007/api/v1/translation',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000,
};
```

## Testing

### 1. Check Backend Health
```bash
curl http://localhost:3007/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "translation-service",
  "version": "1.0.0"
}
```

### 2. Test Language Creation
```bash
curl -X POST http://localhost:3007/api/v1/translation/languages \
  -H "Content-Type: application/json" \
  -d '{
    "code": "en",
    "name": "English",
    "localName": "English",
    "status": "active",
    "flag": "🇺🇸",
    "isDefault": true,
    "metadata": {
      "direction": "ltr",
      "region": "US",
      "currency": "USD"
    }
  }'
```

### 3. Test Translation Creation
```bash
curl -X POST http://localhost:3007/api/v1/translation/translations \
  -H "Content-Type: application/json" \
  -d '{
    "key": "hello_world",
    "languageCode": "en",
    "original": "Hello World",
    "destination": "Hello World"
  }'
```

### 4. Test Translation Operation
```bash
curl -X POST http://localhost:3007/api/v1/translation/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello World",
    "targetLanguage": "es",
    "sourceLanguage": "en"
  }'
```

## Next Steps

1. **Seed Database**: Run seed script to populate 30 languages with flags
   ```bash
   cd /opt/cursor-project/fullstack-project/translation-service
   npm run seed
   ```

2. **Start React Admin**: 
   ```bash
   cd /opt/cursor-project/fullstack-project/react-admin
   npm start
   ```

3. **Test in Browser**:
   - Navigate to `http://localhost:3000/translations`
   - Try creating, editing, and deleting languages
   - Try creating and managing translations
   - Verify flag emojis display correctly

4. **Verify Data Transformation**:
   - Check browser console for any transformation errors
   - Verify API responses are correctly transformed
   - Test backward compatibility with old field names

## Troubleshooting

### Issue: Languages not loading
**Solution**: Check browser console for errors, verify backend is running on port 3007

### Issue: Field name errors
**Solution**: The transformation layer should handle this. Check `translationService.ts` transform methods

### Issue: CORS errors
**Solution**: Verify CORS is enabled in Translation Service backend

### Issue: 404 on language endpoints
**Solution**: Verify you're using `code` (string) not `id` (number) for language operations

## Files Modified

### Backend (Translation Service)
- All DTOs updated for old PHP system compatibility
- All entities using correct field names
- Controller using `code` as primary key for languages

### Frontend (React Admin)
- `/src/features/translations/services/translationService.ts` - Updated interfaces and added transformations
- `/src/features/translations/services/translationApiClient.ts` - Updated to use `code` and `PATCH`
- `/src/features/translations/hooks/useTranslationQueries.ts` - Updated mutation to use `code`

## Migration Notes

If you have existing components using the old structure:
1. Update `languageId` references to `languageCode`
2. Update `value` references to `destination`
3. Update `nativeName` to `localName`
4. Update `isActive` checks to use `status === 'active'`
5. Update `isRTL` checks to use `metadata.direction === 'rtl'`

The transformation layer will handle API responses, but your component code should use the new field names for consistency.
