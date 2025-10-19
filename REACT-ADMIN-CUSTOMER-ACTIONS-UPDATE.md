# React Admin - Customer List Actions Update

## Overview
Updated the customer list component to use the same dropdown actions pattern as the user list, providing consistent UI/UX across the React Admin dashboard.

## Changes Made

### File Modified
- **react-admin/src/features/customers/components/Customers.tsx**

### Implementation Details

#### 1. **Updated Imports**
Added new icons and React hooks:
- `CheckIcon`, `ChevronDownIcon`, `XMarkIcon` from `@heroicons/react/24/outline`
- `useEffect`, `useRef` from React
- `createPortal` from `react-dom`
- Removed: `UserMinusIcon`, `UserPlusIcon` (no longer needed)

#### 2. **Dropdown State Management**
Added state for managing dropdown menu:
```typescript
const DROPDOWN_WIDTH = 192; // w-48 in pixels
const DROPDOWN_OFFSET = 4; // gap between button and dropdown
const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
```

#### 3. **Selected Dropdown Customer**
Added useMemo to track which customer's dropdown is open:
```typescript
const selectedDropdownCustomer = useMemo(() => {
    if (openDropdownId === null) return null;
    return customers.find(customer => customer.id === openDropdownId) || null;
}, [openDropdownId, customers]);
```

#### 4. **Click Outside Handler**
Added useEffect to close dropdown when clicking outside:
- Detects clicks on dropdown portal
- Detects clicks on trigger button
- Closes dropdown for all other clicks

#### 5. **Dropdown Action Handlers**
Added four handler functions:
- `handleViewCustomer` - Opens customer details modal
- `handleEditCustomer` - Opens edit customer modal
- `handleToggleCustomerStatus` - Activates/deactivates customer
- `handleDeleteCustomer` - Opens delete confirmation modal

All handlers close the dropdown after executing.

#### 6. **Actions Column in Table Config**
Replaced old `actions` array with new `actions` column:
- ChevronDownIcon button in each row
- Positioned absolutely using getBoundingClientRect()
- Button ref stored for positioning calculations
- Active state styling when dropdown is open

#### 7. **Portal Dropdown Rendering**
Added dropdown menu rendered via React portal:
- Positioned absolutely at calculated coordinates
- Four action buttons:
  1. **View Details** (EyeIcon)
  2. **Edit** (PencilIcon)
  3. **Activate/Deactivate** (CheckIcon/XMarkIcon - conditional)
  4. **Delete** (TrashIcon - red text)
- Dark mode support
- Hover transitions

#### 8. **Performance Optimization**
Wrapped `customers` in useMemo to prevent unnecessary re-renders:
```typescript
const customers = useMemo(() => customersResponse?.data || [], [customersResponse?.data]);
```

## Pattern Consistency

### Before
- Used Table component's built-in row actions
- Actions appeared as separate buttons in each row
- Different pattern from user list

### After
- Dropdown menu triggered by ChevronDownIcon
- Portal rendering for proper positioning
- Identical pattern to user list
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
1. **View Details** - Read-only view of customer information
2. **Edit** - Modify customer data
3. **Activate/Deactivate** - Toggle customer status (conditional icon/label)
4. **Delete** - Remove customer with confirmation

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
- [ ] Edit action opens modal with customer data
- [ ] Activate/Deactivate toggles status correctly
- [ ] Delete action opens confirmation modal
- [ ] Dropdown auto-closes after action
- [ ] Positioning correct at all scroll positions
- [ ] Dark mode rendering correct
- [ ] No console errors

## Next Steps

1. ✅ Update customer list component
2. ⏳ Test dropdown functionality
3. ⏳ Git Flow execution
4. ⏳ Documentation update

## Related Files
- User list pattern: `react-admin/src/features/users/components/Users.tsx`
- Customer details: `react-admin/src/features/customers/components/CustomerDetails.tsx`
- Customer form: `react-admin/src/features/customers/components/CustomerForm.tsx`

## Version
- Feature: React Admin Customer List Actions Update
- Pattern: Dropdown Actions (matching User List)
- Date: 2025
