# Module Standardization Action Plan

**Date:** November 1, 2025  
**Status:** Ready for Implementation  
**Estimated Effort:** 2-3 days

---

## Overview

Based on the comprehensive analysis in `MODULE-CONSISTENCY-ANALYSIS.md`, this document provides a step-by-step action plan to standardize all feature modules.

## Reference Standards

### Primary Reference: **Users Module**
- Complete folder structure
- Best practices for labels (TypeScript interface)
- Proper API configuration pattern

### Secondary Reference: **Sellers Module** (Most Recent)
- Latest implementation following all standards
- Barrel exports in config/
- Clean separation of concerns

---

## Priority Order

### 🔴 Phase 1: Critical Issues (Day 1)

#### 1.1 Pricing Module - Complete Missing Structure
**Current State:** Only has config/, hooks/, services/ (4 files total)  
**Missing:** components/, labels/

**Actions:**
1. Create `components/Pricing.tsx` (main list component)
2. Create `labels/pricing-labels.ts` with TypeScript interface
3. Create `hooks/usePricingLabels.ts` custom hook
4. Update pricing service to use labels

**Files to Create:**
```
pricing/
├── components/
│   └── Pricing.tsx                 [NEW] Main list component
├── labels/
│   └── pricing-labels.ts           [NEW] Interface + implementation
└── hooks/
    └── usePricingLabels.ts         [NEW] Custom label hook
```

**Template Reference:** See Appendix A - Pricing Module Templates

---

#### 1.2 Carriers Module - Migrate from Old Pattern
**Current State:** Using `constants/carrier-labels.ts` (old SCREAMING_SNAKE_CASE pattern)  
**Issue:** Not following TypeScript interface pattern

**Actions:**
1. ✅ **Already has:** Proper TypeScript interface in constants file
2. ❌ **Wrong location:** Should be in `labels/` folder, not `constants/`
3. ⚠️ **Hook check:** Verify `useCarrierLabels.ts` uses proper pattern

**Migration Steps:**
1. Move `constants/carrier-labels.ts` → `labels/carrier-labels.ts`
2. Verify interface pattern matches UserLabels structure
3. Update imports in:
   - `hooks/useCarrierLabels.ts`
   - All carrier components
4. Delete `constants/` folder once migration complete

**Verification:**
```bash
# Before
features/carriers/constants/carrier-labels.ts

# After
features/carriers/labels/carrier-labels.ts
```

---

### 🟡 Phase 2: Structural Improvements (Day 2)

#### 2.1 Roles Module - Restructure Pages
**Current State:** Has separate `pages/` folder with RoleCreate.tsx, RoleEdit.tsx  
**Issue:** Inconsistent with other modules (only module with pages/)

**Analysis:**
```
roles/
├── components/
│   ├── Roles.tsx              ✅ Main list component (correct location)
│   ├── RoleForm.tsx           ✅ Shared form component
│   ├── RoleDetails.tsx        ✅ Details view
│   └── PermissionSelector.tsx ✅ Sub-component
├── pages/
│   ├── RoleCreate.tsx         ⚠️ Could be in components/
│   └── RoleEdit.tsx           ⚠️ Could be in components/
```

**Decision Required:**
- **Option A (Recommended):** Keep pages/ for route-level components, move to components/ if they're just form wrappers
- **Option B:** Standardize on components/ only (like all other modules)

**Actions if Option B chosen:**
1. Move `pages/RoleCreate.tsx` → `components/RoleCreate.tsx`
2. Move `pages/RoleEdit.tsx` → `components/RoleEdit.tsx`
3. Update imports in routing files
4. Delete empty `pages/` folder

---

#### 2.2 Dashboard Module - Add Missing Config
**Current State:** No `config/` folder  
**Issue:** If dashboard calls APIs, should have dashboardApi.ts

**Investigation Needed:**
1. Check if Dashboard makes API calls
2. If yes, create `config/dashboardApi.ts`
3. Review `dashboard.module.ts` - determine if it's necessary

**Actions:**
1. Search dashboard services for API endpoints
2. If found, create config file following standard pattern
3. Document or remove `dashboard.module.ts` if redundant

---

#### 2.3 Auth Module - Type File Cleanup
**Current State:** `types.ts` at module root level  
**Standard:** Types should be in `config/` or separate `types/` folder

**Actions:**
1. Move `auth/types.ts` → `auth/config/auth.types.ts`
2. Update imports across auth module
3. Consider creating `auth/types/index.ts` if many type definitions

---

### 🟢 Phase 3: Pattern Verification (Day 3)

#### 3.1 Verify Label Patterns
**Goal:** Ensure all label files use TypeScript interface pattern

**Modules to Check:**
- ✅ **Users:** Confirmed perfect pattern
- ✅ **Sellers:** Confirmed perfect pattern
- ✅ **Dashboard:** Has proper interface (verified)
- ✅ **Customers:** Has proper interface (verified)
- ✅ **Carriers:** Has interface but wrong location
- ⚠️ **Auth:** Need to verify
- ⚠️ **Roles:** Need to verify
- ⚠️ **Translations:** Need to verify
- ❌ **Pricing:** Doesn't exist yet (Phase 1)

**Verification Script:**
```bash
# Check each label file for interface export
for module in auth roles translations; do
  echo "=== $module ==="
  grep -n "export interface" features/$module/labels/*.ts
done
```

**Required Pattern:**
```typescript
export interface [Module]Labels {
  page: { title: string; subtitle: string };
  table: { /* ... */ };
  buttons: { /* ... */ };
  messages: { /* ... */ };
  // ... organized categories
}

export const [module]Labels: [Module]Labels = {
  // ... implementation
};
```

---

#### 3.2 Verify Custom Hook Patterns
**Goal:** Ensure all modules have custom label hooks

**Required Files:**
- `auth/hooks/useAuthLabels.ts` ✅ Exists
- `carriers/hooks/useCarrierLabels.ts` ✅ Exists
- `customers/hooks/useCustomerLabels.ts` ✅ Exists
- `dashboard/hooks/useDashboardLabels.ts` ✅ Exists
- `pricing/hooks/usePricingLabels.ts` ❌ Need to create (Phase 1)
- `roles/hooks/useRoleLabels.ts` ✅ Exists
- `sellers/hooks/useSellerLabels.ts` ✅ Exists
- `translations/hooks/useTranslationLabels.ts` ⚠️ Need to verify
- `users/hooks/useUserLabels.ts` ✅ Exists (reference)

**Required Pattern:**
```typescript
import { useLabels } from '../../../shared/hooks/useLabels';
import { [Module]Labels, [module]Labels } from '../labels/[module]-labels';

export const use[Module]Labels = () => {
  const result = useLabels<[Module]Labels>([module]Labels, '[module]');
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
```

---

#### 3.3 Verify API Configuration Migration
**Goal:** Ensure all modules use module-specific API configs

**Status:**
- ✅ **Pricing:** `pricingApi.ts` created (not yet used in service)
- ✅ **Sellers:** `sellerApi.ts` created and fully integrated
- ✅ **Translations:** `translationApi.ts` created (not yet used)
- ✅ **Users:** `usersApi.ts` exists and in use
- ✅ **Carriers:** `carriersApi.ts` exists
- ✅ **Customers:** `customersApi.ts` exists
- ✅ **Roles:** `rolesApi.ts` exists
- ✅ **Auth:** `authApi.ts` exists
- ⚠️ **Dashboard:** Need to check if APIs exist

**Action Items:**
1. Update pricing service to use `PRICING_API_CONFIG.ENDPOINTS`
2. Update translation service to use `TRANSLATION_API_CONFIG.ENDPOINTS`
3. Verify all other services use their config files

---

## Implementation Checklists

### ✅ Pricing Module Completion Checklist

- [ ] Create `components/Pricing.tsx`
  - [ ] Import `usePricingLabels` hook
  - [ ] Fetch data using `pricingApiClient`
  - [ ] Display table with pricing data
  - [ ] Add pagination support
  
- [ ] Create `labels/pricing-labels.ts`
  - [ ] Define `PricingLabels` interface
  - [ ] Implement `pricingLabels` object
  - [ ] Organize into categories: page, table, buttons, messages
  
- [ ] Create `hooks/usePricingLabels.ts`
  - [ ] Import `useLabels` from shared
  - [ ] Wrap with correct types
  - [ ] Export `L` alias
  
- [ ] Update `services/pricingApiClient.ts`
  - [ ] Import `PRICING_API_CONFIG` from config
  - [ ] Replace hardcoded URLs with config endpoints
  - [ ] Test all API methods
  
- [ ] Create seeding script
  - [ ] Create `scripts/seed-pricing-translations.ts`
  - [ ] Add npm script: `seed:pricing-translations`
  
- [ ] Test implementation
  - [ ] Navigate to /pricing route
  - [ ] Verify translations load
  - [ ] Test CRUD operations
  - [ ] Verify no console errors

---

### ✅ Carriers Module Migration Checklist

- [ ] Backup current implementation
  - [ ] `git checkout -b feature/carriers-label-migration`
  
- [ ] Create new labels file
  - [ ] Create `labels/` folder
  - [ ] Copy `constants/carrier-labels.ts` → `labels/carrier-labels.ts`
  - [ ] Verify interface pattern (already correct ✅)
  
- [ ] Update hook
  - [ ] Open `hooks/useCarrierLabels.ts`
  - [ ] Update import path: `../labels/carrier-labels`
  - [ ] Verify pattern matches reference
  
- [ ] Update component imports
  - [ ] Search for: `import.*from.*constants/carrier-labels`
  - [ ] Replace with: `import.*from.*labels/carrier-labels`
  
- [ ] Remove old file
  - [ ] Delete `constants/carrier-labels.ts`
  - [ ] Delete empty `constants/` folder
  
- [ ] Test
  - [ ] Run TypeScript compiler
  - [ ] Test carriers page functionality
  - [ ] Verify translations still work
  
- [ ] Commit
  - [ ] `git add .`
  - [ ] `git commit -m "refactor: migrate carriers to new label pattern"`

---

### ✅ Roles Module Restructure Checklist

**Decision:** Move pages/ to components/ for consistency

- [ ] Move files
  - [ ] `git mv pages/RoleCreate.tsx components/RoleCreate.tsx`
  - [ ] `git mv pages/RoleEdit.tsx components/RoleEdit.tsx`
  
- [ ] Update routing
  - [ ] Find route definitions importing from `pages/`
  - [ ] Update to `components/`
  
- [ ] Update index exports
  - [ ] Update `index.ts` if it re-exports page components
  
- [ ] Remove pages folder
  - [ ] Delete `pages/index.ts`
  - [ ] Remove empty `pages/` folder
  
- [ ] Test
  - [ ] Navigate to role create route
  - [ ] Navigate to role edit route
  - [ ] Verify no import errors

---

## Testing Strategy

### After Each Module Update:

1. **TypeScript Compilation:**
   ```bash
   cd react-admin
   npm run build
   ```

2. **Runtime Testing:**
   - Navigate to module route
   - Test list view
   - Test create/edit forms
   - Verify translations load
   - Check browser console for errors

3. **Translation Testing:**
   - Switch languages (EN → FR → ES)
   - Verify all labels translate correctly
   - Check for missing translations

### Full Integration Test:

```bash
# After all modules updated
npm run build
npm run lint
npm test
```

---

## Rollback Plan

For each phase, create a feature branch:
```bash
git checkout -b feature/standardize-pricing-module
# Make changes
git commit -m "feat: complete pricing module structure"
```

If issues arise:
```bash
git checkout develop
git branch -D feature/standardize-pricing-module
```

---

## Appendix A: Templates

### A.1 Pricing Module Component Template

```typescript
// components/Pricing.tsx
import React, { useState, useEffect } from 'react';
import { usePricingLabels } from '../hooks/usePricingLabels';
import { pricingApiClient } from '../services/pricingApiClient';
import { Pricing } from '../config/pricing.types';

export const PricingList: React.FC = () => {
  const { L, isLoading: labelsLoading } = usePricingLabels();
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      setLoading(true);
      const response = await pricingApiClient.getPricing();
      setPricing(response.items || []);
    } catch (error) {
      console.error('Error loading pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (labelsLoading || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pricing-module">
      <div className="page-header">
        <h1>{L.page.title}</h1>
        <p>{L.page.subtitle}</p>
      </div>

      <div className="pricing-table">
        <table>
          <thead>
            <tr>
              <th>{L.table.carrier}</th>
              <th>{L.table.zone}</th>
              <th>{L.table.baseRate}</th>
              <th>{L.table.actions}</th>
            </tr>
          </thead>
          <tbody>
            {pricing.length === 0 ? (
              <tr>
                <td colSpan={4}>{L.table.emptyMessage}</td>
              </tr>
            ) : (
              pricing.map((price) => (
                <tr key={price.id}>
                  <td>{price.carrierName}</td>
                  <td>{price.zone}</td>
                  <td>${price.baseRate}</td>
                  <td>
                    <button>{L.buttons.edit}</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### A.2 Pricing Labels Template

```typescript
// labels/pricing-labels.ts
/**
 * Pricing Module Translation Labels
 * 
 * This file contains all static UI labels used in the Pricing module.
 * Labels are organized by category for better maintainability.
 * 
 * Usage with usePricingLabels hook:
 * const { L } = usePricingLabels();
 * <h1>{L.page.title}</h1>
 */

export interface PricingLabels {
  // Page Header
  page: {
    title: string;
    subtitle: string;
  };

  // Table Headers & Display
  table: {
    carrier: string;
    zone: string;
    baseRate: string;
    perKgRate: string;
    minWeight: string;
    maxWeight: string;
    effectiveDate: string;
    expiryDate: string;
    actions: string;
    emptyMessage: string;
  };

  // Buttons & Actions
  buttons: {
    create: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    calculate: string;
    bulkUpdate: string;
  };

  // Toast Messages
  messages: {
    createSuccess: string;
    createError: string;
    updateSuccess: string;
    updateError: string;
    deleteSuccess: string;
    deleteError: string;
    calculateSuccess: string;
    calculateError: string;
  };

  // Form Fields
  form: {
    carrier: string;
    zone: string;
    baseRate: string;
    perKgRate: string;
    minWeight: string;
    maxWeight: string;
    effectiveDate: string;
    expiryDate: string;
  };
}

/**
 * Default English labels for the Pricing module
 */
export const pricingLabels: PricingLabels = {
  page: {
    title: 'Pricing Management',
    subtitle: 'Manage carrier pricing zones and rates',
  },
  
  table: {
    carrier: 'Carrier',
    zone: 'Zone',
    baseRate: 'Base Rate',
    perKgRate: 'Per Kg Rate',
    minWeight: 'Min Weight',
    maxWeight: 'Max Weight',
    effectiveDate: 'Effective Date',
    expiryDate: 'Expiry Date',
    actions: 'Actions',
    emptyMessage: 'No pricing data available',
  },
  
  buttons: {
    create: 'Add Pricing',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    calculate: 'Calculate',
    bulkUpdate: 'Bulk Update',
  },
  
  messages: {
    createSuccess: 'Pricing created successfully',
    createError: 'Failed to create pricing',
    updateSuccess: 'Pricing updated successfully',
    updateError: 'Failed to update pricing',
    deleteSuccess: 'Pricing deleted successfully',
    deleteError: 'Failed to delete pricing',
    calculateSuccess: 'Price calculated successfully',
    calculateError: 'Failed to calculate price',
  },
  
  form: {
    carrier: 'Select Carrier',
    zone: 'Zone',
    baseRate: 'Base Rate ($)',
    perKgRate: 'Rate per Kg ($)',
    minWeight: 'Minimum Weight (kg)',
    maxWeight: 'Maximum Weight (kg)',
    effectiveDate: 'Effective Date',
    expiryDate: 'Expiry Date',
  },
};
```

### A.3 Pricing Hook Template

```typescript
// hooks/usePricingLabels.ts
import { useLabels } from '../../../shared/hooks/useLabels';
import { PricingLabels, pricingLabels } from '../labels/pricing-labels';

/**
 * Pricing Module Labels Hook
 * 
 * Provides translated labels for the Pricing module.
 * Wraps the generic useLabels hook with module-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full PricingLabels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = usePricingLabels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{L.page.title}</h1>
 *     <button>{L.buttons.create}</button>
 *   </div>
 * );
 */
export const usePricingLabels = () => {
  const result = useLabels<PricingLabels>(pricingLabels, 'pricing');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
```

---

## Success Metrics

### Completion Criteria:

✅ **Structure:**
- All modules have: components/, config/, hooks/, labels/, services/
- No modules using old constants/ pattern
- Consistent folder organization

✅ **Labels:**
- All modules have TypeScript interface pattern
- All modules have custom label hooks
- All labels organized into standard categories

✅ **API Config:**
- All modules have module-specific API config files
- All services use config (no hardcoded URLs)
- Central api.ts only exports SHARED_API_CONFIG

✅ **Quality:**
- No TypeScript compilation errors
- All modules tested and working
- Documentation updated

---

## Timeline

**Day 1 (Phase 1):**
- Morning: Pricing module creation
- Afternoon: Carriers migration

**Day 2 (Phase 2):**
- Morning: Roles restructure
- Afternoon: Dashboard config + Auth cleanup

**Day 3 (Phase 3):**
- Morning: Pattern verification across all modules
- Afternoon: Testing and documentation

---

**Prepared by:** GitHub Copilot  
**Status:** Ready for Review  
**Next Step:** Get approval to proceed with Phase 1
