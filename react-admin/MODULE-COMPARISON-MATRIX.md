# Module Comparison Matrix

Quick visual reference for module structure comparison.

---

## Folder Structure Comparison

| Module | components/ | config/ | constants/ | hooks/ | labels/ | services/ | Other | Status |
|--------|-------------|---------|------------|--------|---------|-----------|-------|--------|
| **users** (ref) | ✅ (7) | ✅ | ⚠️ legacy | ✅ (3) | ✅ | ✅ (4) | - | 🟢 100% |
| **sellers** (ref) | ✅ (1) | ✅ | - | ✅ (1) | ✅ | ✅ (1) | index.ts | 🟢 100% |
| **auth** | ✅ (2) | ✅ | - | ✅ (2) | ✅ | ✅ (1) | types.ts | 🟢 95% |
| **customers** | ✅ (3) | ✅ | - | ✅ (1) | ✅ | ✅ (1) | - | 🟢 90% |
| **translations** | ✅ | ✅ | - | ✅ (1) | ✅ | ✅ (1) | - | 🟡 85% |
| **roles** | ✅ (5) | ✅ | - | ✅ (2) | ✅ | ✅ (2) | pages/, types/, index.ts | 🟡 80% |
| **dashboard** | ✅ | ❌ | - | ✅ (1) | ✅ | ✅ | dashboard.module.ts | 🟡 70% |
| **carriers** | ✅ (3) | ✅ | ❌ wrong | ✅ (1) | ❌ | ✅ (1) | - | 🟠 60% |
| **pricing** | ❌ | ✅ | - | ✅ (1) | ❌ | ✅ (2) | - | 🔴 40% |
| **analytics** | ✅ (1) | ❌ | - | ❌ | ❌ | ❌ | - | 🔴 20% |

**Legend:**
- ✅ Folder exists and correct
- ❌ Missing or incorrect
- ⚠️ Exists but being phased out
- (n) Number of files in folder

---

## Label Pattern Comparison

| Module | Interface | Implementation | Hook | Location | Pattern Score |
|--------|-----------|----------------|------|----------|---------------|
| users | ✅ UserLabels | ✅ userLabels | ✅ useUserLabels | labels/ | 🟢 100% |
| sellers | ✅ SellerLabels | ✅ sellerLabels | ✅ useSellerLabels | labels/ | 🟢 100% |
| dashboard | ✅ DashboardLabels | ✅ dashboardLabels | ✅ useDashboardLabels | labels/ | 🟢 100% |
| customers | ✅ CustomerLabels | ✅ customerLabels | ✅ useCustomerLabels | labels/ | 🟢 100% |
| carriers | ✅ CarrierLabels | ✅ carrierLabels | ✅ useCarrierLabels | ❌ constants/ | 🟡 80% |
| auth | ⚠️ verify | ⚠️ verify | ✅ useAuthLabels | labels/ | 🟡 80% |
| roles | ⚠️ verify | ⚠️ verify | ✅ useRoleLabels | labels/ | 🟡 80% |
| translations | ⚠️ verify | ⚠️ verify | ✅ useTranslationLabels | labels/ | 🟡 80% |
| pricing | ❌ | ❌ | ❌ | - | 🔴 0% |
| analytics | ❌ | ❌ | ❌ | - | 🔴 0% |

---

## API Configuration Status

| Module | Config File | Endpoints Defined | Service Uses Config | Migration Score |
|--------|-------------|-------------------|---------------------|-----------------|
| sellers | ✅ sellerApi.ts | ✅ 23 endpoints | ✅ Fully migrated | 🟢 100% |
| users | ✅ usersApi.ts | ✅ ~10 endpoints | ✅ In use | 🟢 100% |
| auth | ✅ authApi.ts | ✅ ~8 endpoints | ✅ In use | 🟢 100% |
| carriers | ✅ carriersApi.ts | ✅ ~8 endpoints | ✅ In use | 🟢 100% |
| customers | ✅ customersApi.ts | ✅ ~8 endpoints | ✅ In use | 🟢 100% |
| roles | ✅ rolesApi.ts | ✅ ~8 endpoints | ✅ In use | 🟢 100% |
| pricing | ✅ pricingApi.ts | ✅ 8 endpoints | ❌ Not migrated | 🟡 60% |
| translations | ✅ translationApi.ts | ✅ 8 endpoints | ❌ Not migrated | 🟡 60% |
| dashboard | ⚠️ TBD | ⚠️ TBD | ⚠️ TBD | 🟡 50% |
| analytics | ❌ | ❌ | ❌ | 🔴 0% |

---

## Component File Count

| Module | Main List | Form | Details | Other | Total | Complete? |
|--------|-----------|------|---------|-------|-------|-----------|
| users | Users.tsx | UserForm.tsx | UserDetails.tsx | 4 more | 7 | ✅ |
| roles | Roles.tsx | RoleForm.tsx | RoleDetails.tsx | 2 more | 5 | ✅ |
| carriers | Carriers.tsx | CarrierForm.tsx | CarrierDetails.tsx | - | 3 | ✅ |
| customers | Customers.tsx | CustomerForm.tsx | CustomerDetails.tsx | - | 3 | ✅ |
| auth | Login.tsx | - | - | PrivateRoute | 2 | ⚠️ |
| sellers | Sellers.tsx | - | - | - | 1 | ⚠️ |
| translations | ? | ? | ? | ? | ? | ⚠️ |
| dashboard | Multiple widgets | - | - | - | ? | ⚠️ |
| pricing | ❌ MISSING | ❌ | ❌ | ❌ | 0 | ❌ |
| analytics | Analytics.tsx | - | - | - | 1 | ⚠️ |

---

## Service File Organization

| Module | API Client | API Service | Business Service | Other | Pattern |
|--------|------------|-------------|------------------|-------|---------|
| users | ✅ userApiClient.ts | ✅ userApiService.ts | ✅ userService.ts | profileApiService | 🟢 Complete |
| sellers | ✅ sellerApiClient.ts | - | - | - | 🟢 Minimal |
| pricing | ✅ pricingApiClient.ts | - | ✅ pricingService.ts | - | 🟢 Good |
| roles | ✅ roleApiClient.ts | ✅ roleApiService.ts | - | - | 🟢 Good |
| carriers | - | - | ✅ carrierService.ts | - | 🟡 Basic |
| customers | - | ✅ customerApiService.ts | - | - | 🟡 Basic |
| auth | - | - | ✅ authService.ts | - | 🟡 Basic |
| translations | - | - | ✅ translationService.ts | - | 🟡 Basic |
| dashboard | - | - | ✅ dashboardService.ts | - | 🟡 Basic |
| analytics | ❌ | ❌ | ❌ | - | ❌ None |

---

## Priority Action Matrix

### 🔴 Critical Priority (Blocking Issues)

| Module | Issue | Impact | Effort | Priority Rank |
|--------|-------|--------|--------|---------------|
| pricing | Missing components/ and labels/ | Cannot navigate to /pricing | 4-6h | #1 |
| carriers | Labels in wrong location (constants/) | Inconsistent pattern | 1-2h | #2 |

### 🟡 Medium Priority (Structural Issues)

| Module | Issue | Impact | Effort | Priority Rank |
|--------|-------|--------|--------|---------------|
| roles | Unique pages/ folder | Structure inconsistency | 2-3h | #3 |
| dashboard | Missing config/ | No API config pattern | 1-2h | #4 |
| pricing | Service not using config | Hardcoded endpoints | 1h | #5 |
| translations | Service not using config | Hardcoded endpoints | 1h | #6 |

### 🟢 Low Priority (Minor Issues)

| Module | Issue | Impact | Effort | Priority Rank |
|--------|-------|--------|--------|---------------|
| auth | types.ts at root | Minor organization issue | 30min | #7 |
| all | Pattern verification needed | Ensure consistency | 2-3h | #8 |

### ⚪ Future Consideration

| Module | Issue | Impact | Effort | Priority Rank |
|--------|-------|--------|--------|---------------|
| analytics | Minimal structure | Incomplete module | 6-8h | #9 |
| users | Legacy constants/ folder | Old pattern | 1h | #10 |

---

## File Count Summary

| Module | Total Files | TypeScript Files | Components | Services | Config Files |
|--------|-------------|------------------|------------|----------|--------------|
| users | 15 | 15 | 7 | 4 | 1 |
| roles | 16 | 16 | 5 | 2 | 1 |
| carriers | ~8 | ~8 | 3 | 1 | 1 |
| customers | ~6 | ~6 | 3 | 1 | 1 |
| sellers | 6 | 6 | 1 | 1 | 3 |
| auth | ~6 | ~6 | 2 | 1 | 1 |
| pricing | 4 | 4 | 0 | 2 | 1 |
| translations | ~6 | ~6 | ? | 1 | 1 |
| dashboard | ~6 | ~6 | ? | 1 | 0 |
| analytics | 1 | 1 | 1 | 0 | 0 |

---

## Pattern Adoption Rates

### Label Pattern (Interface + Hook)
- ✅ Fully Adopted: 4/10 modules (40%)
- ⚠️ Partial (needs verification): 4/10 modules (40%)
- ❌ Not Adopted: 2/10 modules (20%)

### API Configuration Pattern
- ✅ Config Created & Used: 6/10 modules (60%)
- ⚠️ Config Created, Not Used: 2/10 modules (20%)
- ❌ No Config: 2/10 modules (20%)

### Component Structure
- ✅ Complete (List + Form + Details): 3/10 modules (30%)
- ⚠️ Partial: 5/10 modules (50%)
- ❌ Missing: 2/10 modules (20%)

### Folder Organization
- ✅ Follows Standard: 6/10 modules (60%)
- ⚠️ Minor Deviations: 2/10 modules (20%)
- ❌ Major Issues: 2/10 modules (20%)

---

## Estimated Standardization Effort

| Phase | Modules | Tasks | Estimated Hours | Priority |
|-------|---------|-------|-----------------|----------|
| Phase 1 | pricing, carriers | Complete structure, migrate labels | 6-8h | 🔴 Critical |
| Phase 2 | roles, dashboard, auth | Restructure, add config, cleanup | 4-6h | 🟡 Medium |
| Phase 3 | All modules | Pattern verification, testing | 2-3h | 🟢 Low |
| **Total** | **9 modules** | **Standardization** | **12-17h** | **~2 days** |

---

## Module Readiness for Production

| Module | Structure | Patterns | Testing | Documentation | Production Ready? |
|--------|-----------|----------|---------|---------------|-------------------|
| users | ✅ | ✅ | ⚠️ | ✅ | 🟢 Yes |
| sellers | ✅ | ✅ | ⚠️ | ✅ | 🟢 Yes |
| auth | ✅ | ✅ | ⚠️ | ⚠️ | 🟢 Yes |
| customers | ✅ | ✅ | ⚠️ | ⚠️ | 🟢 Yes |
| carriers | ⚠️ | ⚠️ | ⚠️ | ⚠️ | 🟡 Almost |
| roles | ⚠️ | ✅ | ⚠️ | ⚠️ | 🟡 Almost |
| translations | ✅ | ⚠️ | ⚠️ | ⚠️ | 🟡 Almost |
| dashboard | ⚠️ | ⚠️ | ⚠️ | ⚠️ | 🟡 Almost |
| pricing | ❌ | ⚠️ | ❌ | ⚠️ | 🔴 No |
| analytics | ❌ | ❌ | ❌ | ❌ | 🔴 No |

---

**Last Updated:** November 1, 2025  
**Status:** Complete Analysis  
**Next Action:** Begin Phase 1 Implementation
