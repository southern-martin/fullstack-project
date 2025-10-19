# React Admin - Carrier List Actions Update

## Overview
Updated the carrier list component to use the same dropdown actions pattern as the user and customer lists, providing consistent UI/UX across the React Admin dashboard.

## Changes Made

### Files Modified
1. **react-admin/src/features/carriers/components/Carriers.tsx** - Dropdown actions implementation
2. **react-admin/src/features/carriers/services/carrierApiClient.ts** - Fixed HTTP method for update (PUT → PATCH)

### Implementation Details

#### 1. **Updated Imports**
Added new icons and React hooks:
- `CheckIcon`, `ChevronDownIcon`, `XMarkIcon` from `@heroicons/react/24/outline`
- `useEffect`, `useRef` from React
- `createPortal` from `react-dom`

#### 2. **Dropdown State Management**
Added state for managing dropdown menu:
```typescript
const DROPDOWN_WIDTH = 192; // w-48 in pixels
const DROPDOWN_OFFSET = 4; // gap between button and dropdown
const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
```

#### 3. **Selected Dropdown Carrier**
Added useMemo to track which carrier's dropdown is open:
```typescript
const selectedDropdownCarrier = useMemo(() => {
    if (openDropdownId === null) return null;
    return carriers.find(carrier => carrier.id === openDropdownId) || null;
}, [openDropdownId, carriers]);
```

#### 4. **Click Outside Handler**
Added useEffect to close dropdown when clicking outside:
- Detects clicks on dropdown portal
- Detects clicks on trigger button
- Closes dropdown for all other clicks

#### 5. **Toggle Status Handler**
Added handler to activate/deactivate carriers:
```typescript
const toggleCarrierStatus = useCallback(async (id: number, status: boolean) => {
    await updateCarrierMutation.mutateAsync({ id, data: { isActive: status } });
    toast.success(status ? 'Carrier activated' : 'Carrier deactivated');
}, [updateCarrierMutation]);
```

#### 6. **Dropdown Action Handlers**
Added four handler functions:
- `handleViewCarrier` - Opens carrier details modal
- `handleEditCarrier` - Opens edit carrier modal
- `handleToggleCarrierStatus` - Activates/deactivates carrier
- `handleDeleteCarrier` - Opens delete confirmation modal

All handlers close the dropdown after executing.

#### 7. **Actions Column in Table Config**
Replaced old `actions` array with new `actions` column:
- ChevronDownIcon button in each row
- Positioned absolutely using getBoundingClientRect()
- Button ref stored for positioning calculations
- Active state styling when dropdown is open

#### 8. **Portal Dropdown Rendering**
Added dropdown menu rendered via React portal:
- Positioned absolutely at calculated coordinates
- Four action buttons:
  1. **View Details** (EyeIcon)
  2. **Edit** (PencilIcon)
  3. **Activate/Deactivate** (CheckIcon/XMarkIcon - conditional)
  4. **Delete** (TrashIcon - red text)
- Dark mode support
- Hover transitions

#### 9. **Performance Optimization**
Wrapped `carriers` in useMemo to prevent unnecessary re-renders:
```typescript
const carriers = useMemo(() => carriersResponse?.carriers || [], [carriersResponse?.carriers]);
```

#### 10. **Bug Fix: HTTP Method Mismatch**
Fixed `updateCarrier` method in `carrierApiClient.ts`:
- **Before**: `method: 'PUT'`
- **After**: `method: 'PATCH'`
- **Reason**: Carrier Service controller uses `@Patch` decorator, not `@Put`
- **Impact**: Update operations now work correctly (prevents 404 errors)

## Pattern Consistency

### Before
- Used Table component's built-in row actions
- Actions appeared as separate buttons in each row
- Different pattern from user/customer lists

### After
- Dropdown menu triggered by ChevronDownIcon
- Portal rendering for proper positioning
- Identical pattern to user and customer lists
- Consistent UI/UX across all entity lists

## Features

### Dropdown Behavior
- ✅ Click button to open dropdown
- ✅ Click outside to close
- ✅ Click button again to toggle
- ✅ Auto-closes after action selection
- ✅ Proper positioning relative to button
- ✅ Portal rendering (not clipped by parent containers)

### Actions Available
1. **View Details** - Read-only view of carrier information
2. **Edit** - Modify carrier data
3. **Activate/Deactivate** - Toggle carrier status (conditional icon/label)
4. **Delete** - Remove carrier with confirmation

### Styling
- ✅ Dark mode support
- ✅ Hover effects
- ✅ Active state for open dropdown
- ✅ Red text for delete action
- ✅ Smooth transitions

## Technical Details

### Positioning Algorithm
1. Get trigger button's bounding rectangle
2. Calculate top: `button.bottom + scrollY + DROPDOWN_OFFSET`
3. Calculate left: `button.right - DROPDOWN_WIDTH + scrollX`
4. Apply as inline styles to portal div

### State Management Flow
1. User clicks ChevronDownIcon button
2. Button ref captured for positioning
3. Calculate dropdown position
4. Set `openDropdownId` and `dropdownPosition`
5. Render dropdown via portal
6. User clicks action or outside
7. Execute handler and close dropdown

## Testing Checklist

- [ ] Dropdown opens when clicking ChevronDownIcon
- [ ] Dropdown closes when clicking outside
- [ ] Dropdown closes when clicking button again
- [ ] View Details action opens modal correctly
- [ ] Edit action opens modal with carrier data
- [ ] **Edit action saves changes successfully (PATCH method)**
- [ ] Activate/Deactivate toggles status correctly
- [ ] Delete action opens confirmation modal
- [ ] Dropdown auto-closes after action
- [ ] Positioning correct at all scroll positions
- [ ] Dark mode rendering correct
- [ ] No console errors
- [ ] No 404 errors on update operations

## Related Files
- User list pattern: `react-admin/src/features/users/components/Users.tsx`
- Customer list pattern: `react-admin/src/features/customers/components/Customers.tsx`
- Carrier details: `react-admin/src/features/carriers/components/CarrierDetails.tsx`
- Carrier form: `react-admin/src/features/carriers/components/CarrierForm.tsx`

## API Alignment

### Carrier Service Endpoints
```typescript
POST   /carriers           -> Create
GET    /carriers           -> List all
GET    /carriers/active    -> List active
GET    /carriers/count     -> Count
GET    /carriers/:id       -> Get by ID
PATCH  /carriers/:id       -> Update (PATCH, not PUT!)
DELETE /carriers/:id       -> Delete
```

### React Admin Client Methods
```typescript
createCarrier()   -> POST
getCarriers()     -> GET
getCarrier()      -> GET
updateCarrier()   -> PATCH ✅ (fixed from PUT)
deleteCarrier()   -> DELETE
```

## Version
- Feature: React Admin Carrier List Actions Update
- Pattern: Dropdown Actions (matching User and Customer Lists)
- Date: October 19, 2025
