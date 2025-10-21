# 🌐 Carrier Page Label Translation - MD5-Based Implementation Plan

**Date**: October 21, 2025  
**Status**: Planning Phase  
**System Architecture**: MD5 hash-based translation keys (NOT predefined keys)

---

## 🔍 Current System Architecture (Confirmed)

### How Your Translation System Works

```typescript
// Your ACTUAL system (MD5-based)
const text = "Add Carrier";
const md5Hash = crypto.createHash('md5').update(text).digest('hex');
// md5Hash = "a1b2c3d4..." (32-character hash)

// Translation lookup
const translation = await translationService.translate({
  text: "Add Carrier",        // Original English text
  targetLanguage: "fr",       // French
  sourceLanguage: "en"        // English
});
// Returns: "Ajouter un transporteur"
```

### Database Structure
```typescript
// LanguageValue entity
{
  key: string;           // MD5 hash of original text
  languageCode: string;  // "en", "fr", "es"
  value: string;         // Actual translation
  originalText: string;  // Original English text
}
```

### Existing API Endpoints
✅ Already implemented:
- `POST /api/v1/translation/translate` - Single text translation
- `POST /api/v1/translation/translate/batch` - Batch text translation

---

## ✅ What This Means for Label Translation

### Good News! 🎉
Your existing batch translation API **already supports label translation**!

**You don't need**:
- ❌ New label-specific endpoints
- ❌ Predefined translation keys like `t('page.title')`
- ❌ Special label management system
- ❌ Separate label seeds

**You just need**:
- ✅ Use existing `translateBatch()` API
- ✅ Pass English label strings
- ✅ Get back translated labels
- ✅ Cache results in React Query

---

## 🎯 Simplified Implementation Approach

### Current: Content Translation Only
```typescript
// Translates carrier data (names, descriptions)
const carrierTexts = carriers.map(c => c.name);
const translated = await translateBatch({
  texts: carrierTexts,
  targetLanguage: 'fr'
});
```

### Proposed: Content + Label Translation
```typescript
// 1. Collect ALL texts (content + labels)
const allTexts = [
  // Labels
  "Carriers",
  "Add Carrier", 
  "Name",
  "Status",
  "Active",
  // Content
  ...carriers.map(c => c.name),
  ...carriers.map(c => c.description)
];

// 2. Translate in ONE batch call
const translated = await translateBatch({
  texts: allTexts,
  targetLanguage: 'fr'
});

// 3. Map results back
const labels = {
  pageTitle: translated[0],        // "Transporteurs"
  addButton: translated[1],        // "Ajouter un transporteur"
  nameHeader: translated[2],       // "Nom"
  statusHeader: translated[3],     // "Statut"
  activeStatus: translated[4]      // "Actif"
};
```

---

## 🏗️ Revised Architecture

### Simple Label Translation Hook

```typescript
// useLabels.ts - Generic label translation hook
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { translationApiClient } from '../../translations/services/translationApiClient';

interface UseLabelsOptions {
  module: string;              // e.g., "carrier"
  labels: Record<string, string>;  // English labels
}

export const useLabels = ({ module, labels }: UseLabelsOptions) => {
  const { currentLanguage } = useLanguage();
  const languageCode = currentLanguage?.code || 'en';

  const { data: translatedLabels, isLoading } = useQuery({
    queryKey: ['labels', module, languageCode],
    queryFn: async () => {
      // Skip translation for English
      if (languageCode === 'en') {
        return labels;
      }

      // Extract all label values
      const labelTexts = Object.values(labels);
      const labelKeys = Object.keys(labels);

      // Batch translate all labels
      const response = await translationApiClient.translateBatch({
        texts: labelTexts,
        targetLanguage: languageCode,
        sourceLanguage: 'en'
      });

      // Map translations back to keys
      const translated: Record<string, string> = {};
      labelKeys.forEach((key, index) => {
        translated[key] = response.translations[index].translatedText;
      });

      return translated;
    },
    staleTime: 5 * 60 * 1000,      // 5 minutes
    cacheTime: 10 * 60 * 1000,     // 10 minutes
    enabled: !!languageCode,
  });

  return {
    labels: translatedLabels || labels,  // Fallback to English
    isLoading,
  };
};
```

---

## 📝 Implementation Steps (Revised)

### Phase 1: Create Generic Label Hook (2 hours)

#### Step 1.1: Create `useLabels.ts` Hook
**File**: `react-admin/src/shared/hooks/useLabels.ts` (NEW)

```typescript
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../../app/providers/LanguageProvider';
import { translationApiClient } from '../../features/translations/services/translationApiClient';

interface UseLabelsOptions {
  module: string;
  labels: Record<string, string>;
}

export const useLabels = ({ module, labels }: UseLabelsOptions) => {
  const { currentLanguage } = useLanguage();
  const languageCode = currentLanguage?.code || 'en';

  const { data: translatedLabels, isLoading, error } = useQuery({
    queryKey: ['labels', module, languageCode],
    queryFn: async () => {
      if (languageCode === 'en') {
        return labels;
      }

      const labelTexts = Object.values(labels);
      const labelKeys = Object.keys(labels);

      const response = await translationApiClient.translateBatch({
        texts: labelTexts,
        targetLanguage: languageCode,
        sourceLanguage: 'en'
      });

      const translated: Record<string, string> = {};
      labelKeys.forEach((key, index) => {
        translated[key] = response.translations[index].translatedText;
      });

      return translated;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!languageCode,
  });

  return {
    labels: translatedLabels || labels,
    isLoading,
    error,
  };
};
```

**Estimated Time**: 1 hour

#### Step 1.2: Create Carrier-Specific Labels
**File**: `react-admin/src/features/carriers/constants/carrier-labels.ts` (NEW)

```typescript
// All English labels for Carrier module
export const CARRIER_LABELS = {
  // Page
  pageTitle: 'Carriers',
  pageSubtitle: 'Manage your carrier partners',
  
  // Actions
  addCarrier: 'Add Carrier',
  edit: 'Edit',
  view: 'View',
  delete: 'Delete',
  exportCsv: 'Export CSV',
  refresh: 'Refresh',
  close: 'Close',
  save: 'Save',
  cancel: 'Cancel',
  
  // Table headers
  headerName: 'Name',
  headerPhone: 'Phone',
  headerCode: 'Code',
  headerDescription: 'Description',
  headerStatus: 'Status',
  headerCreated: 'Created',
  headerActions: 'Actions',
  
  // Status
  statusActive: 'Active',
  statusInactive: 'Inactive',
  
  // Sections
  sectionCarrierInfo: 'Carrier Information',
  sectionContactInfo: 'Contact Information',
  sectionAccountInfo: 'Account Information',
  
  // Field labels
  fieldName: 'Name',
  fieldCode: 'Code',
  fieldDescription: 'Description',
  fieldContactEmail: 'Contact Email',
  fieldContactPhone: 'Contact Phone',
  fieldCarrierId: 'Carrier ID',
  fieldStatus: 'Status',
  fieldCreated: 'Created',
  fieldLastUpdated: 'Last Updated',
  
  // Placeholders
  searchPlaceholder: 'Search carriers by name, email, or code...',
  notProvided: 'Not provided',
  noDescription: 'No description provided',
  emptyState: 'No carriers found',
  
  // Modal titles
  modalCreate: 'Create New Carrier',
  modalEdit: 'Edit Carrier',
  modalView: 'Carrier Details',
  modalDelete: 'Delete Carrier',
  
  // Messages
  msgCreateSuccess: 'Carrier created successfully',
  msgCreateError: 'Failed to create carrier',
  msgUpdateSuccess: 'Carrier updated successfully',
  msgUpdateError: 'Failed to update carrier',
  msgDeleteSuccess: 'Carrier deleted successfully',
  msgDeleteError: 'Failed to delete carrier',
  msgActivateSuccess: 'Carrier activated',
  msgDeactivateSuccess: 'Carrier deactivated',
  msgStatusError: 'Failed to toggle carrier status',
  msgExportSuccess: 'Carriers exported as {format}',
  msgExportError: 'Failed to export carriers',
  
  // Sort options
  sortName: 'Name',
  sortEmail: 'Email',
  sortPhone: 'Phone',
  sortStatus: 'Status',
  sortCreatedDate: 'Created Date',
} as const;

export type CarrierLabelKey = keyof typeof CARRIER_LABELS;
```

**Estimated Time**: 1 hour

---

### Phase 2: Update Carriers.tsx Component (3 hours)

**File**: `react-admin/src/features/carriers/components/Carriers.tsx` (MODIFY)

```typescript
import { useLabels } from '../../../shared/hooks/useLabels';
import { CARRIER_LABELS } from '../constants/carrier-labels';

const Carriers: React.FC = () => {
  // Add labels hook
  const { labels: L, isLoading: labelsLoading } = useLabels({
    module: 'carrier',
    labels: CARRIER_LABELS
  });
  
  // ... existing code ...

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {L.pageTitle} {/* Was: 'Carriers' */}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {L.pageSubtitle} {/* Was: 'Manage your carrier partners' */}
            </p>
          </div>
          {isTranslated && currentLanguage && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              🌐 {currentLanguage.code.toUpperCase()}
            </span>
          )}
        </div>
        <Button
          onClick={() => {
            setModalTitle(L.modalCreate); // Was: 'Create New Carrier'
            setModalFooter(null);
            setShowCreateModal(true);
          }}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          {L.addCarrier} {/* Was: 'Add Carrier' */}
        </Button>
      </div>

      {/* Table configuration */}
      const tableConfig: TableConfig<Carrier> = useMemo(() => ({
        columns: [
          {
            key: 'name',
            label: L.headerName, // Was: 'Name'
            sortable: true,
            // ... render function
          },
          {
            key: 'contactPhone',
            label: L.headerPhone, // Was: 'Phone'
            sortable: true,
            // ...
          },
          {
            key: 'metadata',
            label: L.headerCode, // Was: 'Code'
            sortable: true,
            // ...
          },
          {
            key: 'description',
            label: L.headerDescription, // Was: 'Description'
            sortable: true,
            // ...
          },
          {
            key: 'isActive',
            label: L.headerStatus, // Was: 'Status'
            sortable: true,
            render: (isActive: boolean) => (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isActive
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
              }`}>
                {isActive ? L.statusActive : L.statusInactive} {/* Was: 'Active' / 'Inactive' */}
              </span>
            ),
          },
          {
            key: 'createdAt',
            label: L.headerCreated, // Was: 'Created'
            sortable: true,
            // ...
          },
          {
            key: 'actions',
            label: L.headerActions, // Was: 'Actions'
            sortable: false,
            // ...
          },
        ],
        selection: {
          enabled: true,
          multiSelect: true,
        },
        emptyMessage: L.emptyState, // Was: 'No carriers found'
      }), [openDropdownId, L, DROPDOWN_OFFSET, DROPDOWN_WIDTH]);

      // Toast messages with labels
      const createCarrier = useCallback(async (carrierData: CreateCarrierRequest | UpdateCarrierRequest) => {
        try {
          await createCarrierMutation.mutateAsync(carrierData as CreateCarrierRequest);
          toast.success(L.msgCreateSuccess); // Was: 'Carrier created successfully'
          setShowCreateModal(false);
          setModalFooter(null);
        } catch (error) {
          toast.error(L.msgCreateError + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
          throw error;
        }
      }, [createCarrierMutation, L]);

      // Sort options with labels
      const sortOptions: SortOption[] = [
        { key: 'name', label: L.sortName, defaultOrder: 'asc' },           // Was: 'Name'
        { key: 'contactEmail', label: L.sortEmail, defaultOrder: 'asc' },  // Was: 'Email'
        { key: 'contactPhone', label: L.sortPhone, defaultOrder: 'asc' },  // Was: 'Phone'
        { key: 'isActive', label: L.sortStatus, defaultOrder: 'desc' },    // Was: 'Status'
        { key: 'createdAt', label: L.sortCreatedDate, defaultOrder: 'desc' }, // Was: 'Created Date'
      ];

      // ... rest of component with all L.xxx replacements
    </div>
  );
};
```

**Key Changes**:
- Add `useLabels` hook with `CARRIER_LABELS`
- Replace all hardcoded strings with `L.labelKey`
- `L` is memoized and cached by React Query
- No dependencies on label keys

**Estimated Time**: 3 hours

---

### Phase 3: Update CarrierDetails.tsx (2 hours)

**File**: `react-admin/src/features/carriers/components/CarrierDetails.tsx` (MODIFY)

```typescript
import { useLabels } from '../../../shared/hooks/useLabels';
import { CARRIER_LABELS } from '../constants/carrier-labels';

const CarrierDetails: React.FC<CarrierDetailsProps> = ({ carrier, onClose }) => {
  const { labels: L } = useLabels({
    module: 'carrier',
    labels: CARRIER_LABELS
  });
  
  const isTranslated = carrier._isTranslated || false;
  const originalCarrier = carrier._original || carrier;

  return (
    <div className="p-6">
      {/* ... */}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
        <TruckIcon className="h-5 w-5 mr-2" />
        {L.sectionCarrierInfo} {/* Was: 'Carrier Information' */}
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
          {L.fieldName} {/* Was: 'Name' */}
        </label>
        {/* ... */}
      </div>

      {/* Status badge */}
      {carrier.isActive ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          {L.statusActive} {/* Was: 'Active' */}
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
          <XCircleIcon className="h-3 w-3 mr-1" />
          {L.statusInactive} {/* Was: 'Inactive' */}
        </span>
      )}

      {/* Close button */}
      <Button variant="secondary" onClick={onClose}>
        {L.close} {/* Was: 'Close' */}
      </Button>
    </div>
  );
};
```

**Estimated Time**: 2 hours

---

### Phase 4: Update CarrierForm.tsx (2 hours)

Similar pattern - replace all hardcoded labels with `L.xxx` from `useLabels` hook.

**Estimated Time**: 2 hours

---

### Phase 5: Seed Translations in Database (2 hours)

Since your system uses MD5-based keys, you need to **seed the translated labels** into the database.

#### Step 5.1: Create Seed Script
**File**: `translation-service/seeds/carrier-labels.seed.ts` (NEW)

```typescript
// Seed translations for carrier labels
export const carrierLabelTranslations = [
  // French translations
  {
    originalText: 'Carriers',
    languageCode: 'fr',
    value: 'Transporteurs',
    key: crypto.createHash('md5').update('Carriers').digest('hex')
  },
  {
    originalText: 'Add Carrier',
    languageCode: 'fr',
    value: 'Ajouter un transporteur',
    key: crypto.createHash('md5').update('Add Carrier').digest('hex')
  },
  {
    originalText: 'Name',
    languageCode: 'fr',
    value: 'Nom',
    key: crypto.createHash('md5').update('Name').digest('hex')
  },
  {
    originalText: 'Status',
    languageCode: 'fr',
    value: 'Statut',
    key: crypto.createHash('md5').update('Status').digest('hex')
  },
  {
    originalText: 'Active',
    languageCode: 'fr',
    value: 'Actif',
    key: crypto.createHash('md5').update('Active').digest('hex')
  },
  // ... 55 more labels for French
  
  // Spanish translations
  {
    originalText: 'Carriers',
    languageCode: 'es',
    value: 'Transportistas',
    key: crypto.createHash('md5').update('Carriers').digest('hex')
  },
  {
    originalText: 'Add Carrier',
    languageCode: 'es',
    value: 'Agregar transportista',
    key: crypto.createHash('md5').update('Add Carrier').digest('hex')
  },
  // ... 58 more labels for Spanish
];
```

#### Step 5.2: Run Seed Script
```bash
cd translation-service
npm run seed:carrier-labels
```

**Estimated Time**: 2 hours (including getting professional translations)

---

## ⏱️ Revised Time Estimates

| Phase | Task | Time |
|-------|------|------|
| **Phase 1** | Generic label hook + constants | **2 hours** |
| **Phase 2** | Update Carriers.tsx | **3 hours** |
| **Phase 3** | Update CarrierDetails.tsx | **2 hours** |
| **Phase 4** | Update CarrierForm.tsx | **2 hours** |
| **Phase 5** | Seed translations | **2 hours** |
| **Phase 6** | Testing | **3 hours** |
| **Docs** | Update documentation | **1 hour** |
| | **TOTAL** | **15 hours** |

**Estimated Duration**: **2 working days** (vs. 3 days in previous plan)

---

## 🎯 Key Advantages of This Approach

### 1. Uses Existing Infrastructure ✅
```
No new endpoints needed!
✅ POST /translate/batch already works
✅ MD5-based caching already implemented
✅ Redis caching already optimized
```

### 2. Simple Implementation ✅
```
Before: Needed label management system
After:  Just use translateBatch() with English text
```

### 3. Automatic Translation ✅
```
First request: Translates and caches
Second request: Instant (100% cache hit)
```

### 4. Easy to Maintain ✅
```
// Add new label? Just add to CARRIER_LABELS constant
export const CARRIER_LABELS = {
  // ... existing labels
  newLabel: 'My New Label',  // ← Add here
};

// useLabels() hook automatically translates it!
```

---

## 📊 Performance Profile

### Label Translation Performance

```
First Load (English):
├─ Label lookup: 0ms (no translation needed)
└─ Total: ~0ms ⚡

First Load (French):
├─ Batch API call: ~200ms (60 labels)
├─ Redis cache: ~50ms
└─ Total: ~250ms ✅

Second Load (French):
├─ React Query cache: <10ms
└─ Total: <10ms ⚡⚡⚡
```

### Combined Content + Label Performance

```
Carrier Page Load (French):
├─ Labels batch: ~250ms (first) / <10ms (cached)
├─ Content batch: ~500ms (10 carriers)
└─ Total: ~750ms (first) / ~500ms (cached) ✅

Still under 1 second! Perfect UX!
```

---

## 🔄 How It Works End-to-End

### Step-by-Step Flow

```
1. User opens Carrier page
   ↓
2. useLabels() hook initializes
   ↓
3. Checks currentLanguage (e.g., "fr")
   ↓
4. Checks React Query cache
   ├─ Cache hit? → Return cached labels ⚡
   └─ Cache miss? → Continue
   ↓
5. Extract all label texts from CARRIER_LABELS
   texts = ["Carriers", "Add Carrier", "Name", ...]
   ↓
6. Call translateBatch() API
   POST /translate/batch
   { texts: [...], targetLanguage: "fr" }
   ↓
7. Translation Service checks Redis cache
   ├─ For each text, generate MD5 key
   ├─ Check Redis: fr:md5hash
   ├─ Hit? Return cached translation
   └─ Miss? Translate and cache
   ↓
8. Return translations to frontend
   ["Transporteurs", "Ajouter un transporteur", "Nom", ...]
   ↓
9. Map back to label keys
   { pageTitle: "Transporteurs", addCarrier: "Ajouter...", ... }
   ↓
10. Cache in React Query (5 min)
   ↓
11. Render component with translated labels ✅
```

---

## 🎨 Visual Example

### Component Usage

```typescript
// Carriers.tsx
const Carriers: React.FC = () => {
  // 1. Define English labels
  const LABELS = {
    title: 'Carriers',
    add: 'Add Carrier',
    name: 'Name',
    active: 'Active'
  };

  // 2. Get translated labels
  const { labels: L } = useLabels({
    module: 'carrier',
    labels: LABELS
  });

  // 3. Use in JSX
  return (
    <div>
      <h1>{L.title}</h1>              {/* "Transporteurs" (FR) */}
      <button>{L.add}</button>         {/* "Ajouter un transporteur" (FR) */}
      <th>{L.name}</th>                {/* "Nom" (FR) */}
      <span>{L.active}</span>          {/* "Actif" (FR) */}
    </div>
  );
};
```

### Database After Seeding

```sql
-- language_values table
id | key (MD5)              | languageCode | originalText  | value
---|------------------------|--------------|---------------|-------------------
1  | a1b2c3...              | fr           | Carriers      | Transporteurs
2  | d4e5f6...              | fr           | Add Carrier   | Ajouter un transp...
3  | g7h8i9...              | fr           | Name          | Nom
4  | j0k1l2...              | fr           | Active        | Actif
5  | a1b2c3...              | es           | Carriers      | Transportistas
6  | d4e5f6...              | es           | Add Carrier   | Agregar transport...
```

---

## ✅ Implementation Checklist

### Phase 1: Generic Hook
- [ ] Create `useLabels.ts` hook in `shared/hooks/`
- [ ] Create `carrier-labels.ts` constants file
- [ ] Test hook in isolation
- [ ] Verify TypeScript types

### Phase 2: Update Components
- [ ] Update `Carriers.tsx` with `useLabels`
- [ ] Replace all hardcoded strings with `L.xxx`
- [ ] Test English (no translation)
- [ ] Test loading states

### Phase 3: Update Detail/Form Components
- [ ] Update `CarrierDetails.tsx` with `useLabels`
- [ ] Update `CarrierForm.tsx` with `useLabels`
- [ ] Verify all labels replaced

### Phase 4: Seed Translations
- [ ] Get professional French translations (60 labels)
- [ ] Get professional Spanish translations (60 labels)
- [ ] Create seed script with MD5 keys
- [ ] Run seed script
- [ ] Verify database entries

### Phase 5: Testing
- [ ] Test English labels (no API call)
- [ ] Test French labels (first load)
- [ ] Test French labels (cached)
- [ ] Test Spanish labels
- [ ] Test language switching
- [ ] Test cache performance
- [ ] Verify combined content + label translation

### Phase 6: Documentation
- [ ] Update implementation progress
- [ ] Document useLabels hook
- [ ] Create usage examples
- [ ] Update testing guide

---

## 🚀 Quick Start Commands

```bash
# 1. Create label hook
touch react-admin/src/shared/hooks/useLabels.ts

# 2. Create carrier labels
touch react-admin/src/features/carriers/constants/carrier-labels.ts

# 3. Create seed script
touch translation-service/seeds/carrier-labels.seed.ts

# 4. Run seed
cd translation-service
npm run seed:carrier-labels

# 5. Test
cd react-admin
npm run dev
# Open http://localhost:3000/carriers
# Switch language to French
# Verify labels translate
```

---

## 💡 Key Takeaways

1. **Your System Already Supports This! ✅**
   - No new backend endpoints needed
   - MD5-based caching already optimized
   - Just use existing `translateBatch()` API

2. **Simpler Than Expected 🎉**
   - One generic `useLabels()` hook
   - One constants file per module
   - Automatic translation via React Query

3. **Performance is Excellent ⚡**
   - Labels cached for 5 minutes
   - MD5 Redis cache for database
   - <10ms on subsequent loads

4. **Easy to Scale 📈**
   - Add Customer module: Create `CUSTOMER_LABELS`
   - Add Pricing module: Create `PRICING_LABELS`
   - Same `useLabels()` hook works everywhere

5. **Maintainable 🔧**
   - English labels in constants (single source)
   - Translations in database (professional)
   - No hardcoded strings in components

---

## ❓ Questions Before Starting

1. **Seed Strategy**: Should I create a seed script, or do you want to add translations manually via admin UI?

2. **Scope**: Start with Carrier module only, or also prepare for Customer/Pricing?

3. **Languages**: English + French only, or also Spanish immediately?

4. **Translations**: Professional translation service, or Google Translate for MVP?

5. **Timeline**: Need this completed in 2 days, or can take longer for quality?

---

**Ready to implement with your actual MD5-based system!** 🚀

This approach is **much simpler** than the original plan because we're working **with** your existing architecture, not against it!

---

**Last Updated**: October 21, 2025  
**System**: MD5-based translation with batch API
