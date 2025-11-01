# API Configuration Refactoring - Module Separation

**Date:** November 1, 2025  
**Status:** ✅ Complete

## Overview

Refactored the centralized API configuration to follow a modular architecture where each feature module owns its API endpoint definitions.

## Changes Made

### 1. Created Module-Specific API Config Files

Created new API configuration files following the existing pattern:

#### **Pricing Module**
- **File:** `features/pricing/config/pricingApi.ts`
- **Exports:** `PRICING_API_CONFIG`, `PRICING_ROUTES`
- **Endpoints:** LIST, CREATE, UPDATE, DELETE, BY_CARRIER, BY_ZONE, CALCULATE, BULK_UPDATE

#### **Seller Module**
- **File:** `features/sellers/config/sellerApi.ts`
- **Exports:** `SELLER_API_CONFIG`, `SELLER_ROUTES`
- **Endpoints:**
  - CRUD: LIST, CREATE, BY_ID, UPDATE, DELETE
  - Profile: MY_PROFILE, BY_USER, UPDATE_PROFILE, UPDATE_BANKING
  - Verification: PENDING_VERIFICATION, VERIFY, APPROVE, REJECT
  - Status: SUSPEND, REACTIVATE
  - Analytics: ANALYTICS_OVERVIEW, ANALYTICS_SALES_TREND, ANALYTICS_PRODUCTS, ANALYTICS_REVENUE

#### **Translation Module**
- **File:** `features/translations/config/translationApi.ts`
- **Exports:** `TRANSLATION_API_CONFIG`, `TRANSLATION_ROUTES`
- **Endpoints:** LIST, CREATE, UPDATE, DELETE, BY_LANGUAGE, TRANSLATE, BATCH_TRANSLATE, LANGUAGES

### 2. Updated Central API Configuration

**File:** `src/config/api.ts`

**Before:**
- Contained individual configs for all modules (AUTH, USER, CUSTOMER, CARRIER, PRICING, TRANSLATION, SELLER)
- Each config duplicated the same BASE_URL, HEADERS, TIMEOUT

**After:**
- Single `SHARED_API_CONFIG` with common configuration
- Deprecated exports for backward compatibility
- Clear documentation pointing to module-specific configs
- Added JSDoc `@deprecated` tags

```typescript
export const SHARED_API_CONFIG = {
  BASE_URL: KONG_GATEWAY_URL + '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000,
} as const;

/** @deprecated Use features/sellers/config/sellerApi.ts */
export const SELLER_API_CONFIG = SHARED_API_CONFIG;
```

### 3. Updated Seller API Client

**File:** `features/sellers/services/sellerApiClient.ts`

**Changes:**
- Imports `SHARED_API_CONFIG` from central config
- Imports `SELLER_API_CONFIG` from module-specific config
- Updated all endpoint references to use config constants
- Removed hardcoded endpoint strings

**Before:**
```typescript
return this.request<Seller>(`/sellers/${id}`);
```

**After:**
```typescript
return this.request<Seller>(SELLER_API_CONFIG.ENDPOINTS.BY_ID(id));
```

## Benefits

### 1. **Better Separation of Concerns**
- Each module owns its API configuration
- Changes to endpoints only affect the specific module
- Easier to locate and update endpoint definitions

### 2. **Reduced Code Duplication**
- Single source of truth for shared configuration
- Module-specific configs only define endpoints
- No repeated BASE_URL, HEADERS, TIMEOUT across configs

### 3. **Improved Maintainability**
- Clear structure: `features/[module]/config/[module]Api.ts`
- Self-documenting with JSDoc deprecation warnings
- Easier to add new modules following the pattern

### 4. **Type Safety**
- Endpoint functions ensure correct parameter types
- TypeScript autocomplete for all endpoints
- Compile-time validation of endpoint usage

### 5. **Backward Compatibility**
- Old imports still work (deprecated but functional)
- Gradual migration path for other modules
- No breaking changes to existing code

## Migration Pattern

For existing modules that still use centralized config:

1. **Create module config file:**
   ```typescript
   // features/[module]/config/[module]Api.ts
   export const [MODULE]_API_CONFIG = {
     ENDPOINTS: {
       LIST: '/[module]',
       CREATE: '/[module]',
       UPDATE: (id: number) => `/[module]/${id}`,
       // ... other endpoints
     },
   } as const;
   ```

2. **Update service/client:**
   ```typescript
   import { SHARED_API_CONFIG } from '../../../config/api';
   import { [MODULE]_API_CONFIG } from '../config/[module]Api';
   
   // Use SHARED_API_CONFIG for BASE_URL and HEADERS
   // Use [MODULE]_API_CONFIG.ENDPOINTS for all endpoints
   ```

3. **Replace hardcoded strings:**
   ```typescript
   // Before
   this.request(`/[module]/${id}`)
   
   // After
   this.request([MODULE]_API_CONFIG.ENDPOINTS.UPDATE(id))
   ```

## File Structure

```
react-admin/src/
├── config/
│   └── api.ts                           # Shared config + deprecated exports
└── features/
    ├── auth/
    │   └── config/
    │       └── authApi.ts               # ✅ Existing
    ├── users/
    │   └── config/
    │       └── usersApi.ts              # ✅ Existing
    ├── customers/
    │   └── config/
    │       └── customersApi.ts          # ✅ Existing
    ├── carriers/
    │   └── config/
    │       └── carriersApi.ts           # ✅ Existing
    ├── roles/
    │   └── config/
    │       └── rolesApi.ts              # ✅ Existing
    ├── pricing/
    │   └── config/
    │       └── pricingApi.ts            # 🆕 Created
    ├── sellers/
    │   ├── config/
    │   │   ├── sellerApi.ts             # 🆕 Created
    │   │   └── seller.types.ts          # ✅ Existing
    │   └── services/
    │       └── sellerApiClient.ts       # ✅ Updated to use config
    └── translations/
        └── config/
            └── translationApi.ts        # 🆕 Created
```

## Testing

✅ **Compilation:** No TypeScript errors  
✅ **Seller Module:** Working correctly with new config  
✅ **Backward Compatibility:** Old imports still functional  
✅ **Type Safety:** All endpoint functions properly typed

## Next Steps

Optional follow-up improvements:

1. **Migrate remaining modules** to use their own config files
2. **Remove deprecated exports** after all modules migrated
3. **Add endpoint documentation** in config files
4. **Create shared types** for common API patterns (pagination, filters, etc.)

## Related Files

- ✅ `src/config/api.ts` - Updated
- 🆕 `features/pricing/config/pricingApi.ts` - Created
- 🆕 `features/sellers/config/sellerApi.ts` - Created
- 🆕 `features/translations/config/translationApi.ts` - Created
- ✅ `features/sellers/services/sellerApiClient.ts` - Updated

---

**Author:** GitHub Copilot  
**Review Status:** Ready for Review
