# Role/Permission Management - Quick Reference

## 🚀 Quick Start

### Access the Feature
```
Navigate to: http://localhost:3000/roles
OR click "Roles" in the sidebar (ShieldCheckIcon)
```

### Test the UI (Frontend Only - No Backend Yet)
The UI is complete and will show:
- Empty state when no data
- Loading states when fetching
- Error states when API calls fail

**Note**: All API calls will fail until backend is implemented.

---

## 📁 File Locations

### Main Components
- **List View**: `/features/roles/components/Roles.tsx`
- **Details View**: `/features/roles/components/RoleDetails.tsx`
- **Form**: `/features/roles/components/RoleForm.tsx`
- **Permission Selector**: `/features/roles/components/PermissionSelector.tsx`

### Page Components
- **Create Page**: `/features/roles/pages/RoleCreate.tsx`
- **Edit Page**: `/features/roles/pages/RoleEdit.tsx`

### State Management
- **Hooks**: `/features/roles/hooks/useRoleQueries.ts`
- **API Service**: `/features/roles/services/roleApiService.ts`
- **API Client**: `/features/roles/services/roleApiClient.ts`

### Configuration
- **API Endpoints**: `/features/roles/config/rolesApi.ts`
- **Types**: `/features/roles/types/index.ts`
- **Labels**: `/features/roles/labels/role-labels.ts`

### Routing
- **Routes**: `/app/routes/AppRoutes.tsx` (lines with `/roles`)
- **Navigation**: `/shared/components/layout/Navigation.tsx` (Roles item)

---

## 🎯 Component Props

### Roles (List View)
```typescript
// No props - uses hooks internally
<Roles />
```

### RoleDetails
```typescript
// Gets roleId from URL params
// Usage: /roles/:id
<RoleDetails />
```

### RoleForm
```typescript
interface RoleFormProps {
  mode: 'create' | 'edit';
  initialData?: Role;  // For edit mode
  onSubmit: (data: RoleFormData) => Promise<void>;
  isSubmitting?: boolean;
}

// Example
<RoleForm 
  mode="create" 
  onSubmit={handleSubmit} 
/>
```

### PermissionSelector
```typescript
interface PermissionSelectorProps {
  permissions: Permission[];
  selectedPermissionIds: number[];
  onChange: (selectedIds: number[]) => void;
  disabled?: boolean;
}

// Example
<PermissionSelector
  permissions={allPermissions}
  selectedPermissionIds={selectedIds}
  onChange={setSelectedIds}
/>
```

---

## 🔧 API Endpoints (Backend TODO)

### Base URL
```
http://localhost:3003/api/v1
```

### Role Endpoints
```typescript
GET    /roles                      // List (paginated, searchable)
GET    /roles/:id                  // Get by ID
GET    /roles/name/:name           // Get by name
GET    /roles/active               // Active roles only
GET    /roles/count                // Total count
GET    /roles/stats                // Statistics
POST   /roles                      // Create
PUT    /roles/:id                  // Update
DELETE /roles/:id                  // Delete
POST   /roles/:id/permissions      // Assign permissions
GET    /roles/:id/users            // Users with role
```

### Permission Endpoints
```typescript
GET    /permissions                        // All permissions
GET    /permissions/category/:category     // By category
GET    /permissions/categories             // All categories
```

---

## 📊 Data Types

### Role
```typescript
interface Role {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  permissions: Permission[];
  userCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### Permission
```typescript
interface Permission {
  id: number;
  name: string;
  description?: string;
  category: PermissionCategory;
}
```

### PermissionCategory (Enum)
```typescript
enum PermissionCategory {
  USERS = 'USERS',
  ROLES = 'ROLES',
  SYSTEM = 'SYSTEM',
  CONTENT = 'CONTENT',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS',
  CARRIERS = 'CARRIERS',
  CUSTOMERS = 'CUSTOMERS',
  PRICING = 'PRICING',
}
```

### RoleFormData
```typescript
interface RoleFormData {
  name: string;
  description?: string;
  permissionIds: number[];
  isActive: boolean;
}
```

---

## 🎨 Styling Classes

### Status Badges
```typescript
// Active
className="bg-green-100 text-green-800"

// Inactive
className="bg-gray-100 text-gray-800"
```

### Button Variants
```typescript
variant="primary"    // Blue
variant="secondary"  // Gray
variant="danger"     // Red
variant="success"    // Green
```

### Icon Sizes
```typescript
className="h-4 w-4"  // Small (buttons)
className="h-5 w-5"  // Medium (list items)
className="h-6 w-6"  // Large (headers)
className="h-12 w-12" // XL (empty states)
```

---

## 🔍 Search & Filter

### Current Implementation
- **Search**: Server-side search by role name/description
- **Pagination**: Server-side with configurable page size (10, 25, 50, 100)
- **Sorting**: Client-side (can be extended to server-side)

### Usage
```typescript
const { data } = useRoles({
  page: 1,
  limit: 10,
  search: 'admin',  // Optional
  sortBy: 'name',   // Optional
  sortOrder: 'asc', // Optional
});
```

---

## 🧪 Mock Data for Testing

### Create Mock Permissions
```typescript
const mockPermissions: Permission[] = [
  { id: 1, name: 'users.create', description: 'Create users', category: 'USERS' },
  { id: 2, name: 'users.read', description: 'View users', category: 'USERS' },
  { id: 3, name: 'users.update', description: 'Edit users', category: 'USERS' },
  { id: 4, name: 'users.delete', description: 'Delete users', category: 'USERS' },
  { id: 5, name: 'roles.create', description: 'Create roles', category: 'ROLES' },
  { id: 6, name: 'roles.read', description: 'View roles', category: 'ROLES' },
];
```

### Create Mock Roles
```typescript
const mockRoles: Role[] = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access',
    isActive: true,
    permissions: mockPermissions,
    userCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'User',
    description: 'Basic user access',
    isActive: true,
    permissions: [mockPermissions[1]], // Only read
    userCount: 50,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];
```

---

## 🐛 Debugging

### React Query DevTools
```typescript
// Already included in QueryProvider
// Access at bottom-right icon in dev mode
```

### Check Hook State
```typescript
const { data, isLoading, error } = useRoles();

console.log('Data:', data);
console.log('Loading:', isLoading);
console.log('Error:', error);
```

### Check API Calls
```typescript
// Open browser DevTools > Network tab
// Filter by "roles" or "permissions"
// Check request/response
```

### Common Issues

1. **"No roles" showing but API working**
   - Check data structure: `data.data` vs `data`
   - Verify pagination: `data.total` should exist

2. **Permissions not loading**
   - Check `usePermissions()` hook
   - Verify API endpoint: `/api/v1/permissions`

3. **Form not submitting**
   - Check validation errors in console
   - Verify required fields: name, permissionIds

4. **Navigation not working**
   - Check route definitions in AppRoutes.tsx
   - Verify navigation item in Navigation.tsx

---

## 📱 Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm: '640px'   // Small devices
md: '768px'   // Medium devices
lg: '1024px'  // Large devices
xl: '1280px'  // Extra large
2xl: '1536px' // 2X Extra large
```

### Component Responsiveness
- **Roles List**: Table scrolls horizontally on mobile
- **RoleDetails**: Two columns on desktop, stacks on mobile
- **RoleForm**: Single column always
- **Modals**: Full screen on mobile, centered on desktop

---

## 🎯 Validation Rules

### Role Name
- Required: ✅
- Min length: 2 characters
- Max length: 50 characters
- Pattern: Alphanumeric + spaces/hyphens/underscores

### Description
- Required: ❌
- Max length: 200 characters

### Permissions
- Required: ✅
- Min count: 1 permission

### Active Status
- Type: Boolean
- Default: `true`

---

## 🔐 Permission Categories

| Category | Description | Example Permissions |
|----------|-------------|---------------------|
| USERS | User management | users.create, users.read, users.update, users.delete |
| ROLES | Role & permission management | roles.create, roles.assign, roles.delete |
| SYSTEM | System settings | system.config, system.logs |
| CONTENT | Content management | content.create, content.publish |
| ANALYTICS | Analytics & reports | analytics.view, analytics.export |
| SETTINGS | App settings | settings.update, settings.view |
| CARRIERS | Carrier management | carriers.create, carriers.update |
| CUSTOMERS | Customer management | customers.create, customers.view |
| PRICING | Pricing management | pricing.update, pricing.view |

---

## ⚡ Performance Tips

### Optimize Re-renders
```typescript
// Use React.memo for expensive components
export const RoleList = React.memo(Roles);
```

### Cache Configuration
```typescript
// Already configured in hooks
staleTime: 5 * 60 * 1000,  // 5 minutes
cacheTime: 10 * 60 * 1000, // 10 minutes
```

### Pagination Best Practices
```typescript
// Start with small page size
pageSize: 10

// Allow users to increase if needed
pageSizeOptions: [10, 25, 50, 100]
```

---

## 📖 Further Reading

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Router v6 Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Heroicons](https://heroicons.com)

---

**Last Updated**: Phase 2A Completion  
**Status**: ✅ Frontend Complete, ⏳ Backend Pending
