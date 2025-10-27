# Translation Labels Coding Standard

## Quick Reference Guide

This document provides a quick reference for the standardized translation label pattern used across all modules in the React Admin application.

---

## 📋 Standard Pattern Summary

### File Structure
```
features/[module]/
├── labels/
│   └── [module]-labels.ts          # TypeScript interface + default labels
├── hooks/
│   └── use[Module]Labels.ts        # Custom hook wrapper
└── components/
    └── Component.tsx                # Uses the hook
```

---

## ✅ Complete Example: User Module

### 1. Labels File: `features/users/labels/user-labels.ts`

```typescript
export interface UserLabels {
  page: {
    title: string;
    subtitle: string;
  };
  table: {
    firstName: string;
    email: string;
    status: string;
    emptyMessage: string;
  };
  buttons: {
    createUser: string;
    exportCsv: string;
    cancel: string;
    delete: string;
  };
  messages: {
    createSuccess: string;
    createError: string;
    deleteSuccess: string;
  };
  form: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const userLabels: UserLabels = {
  page: {
    title: 'Users',
    subtitle: 'Manage your user database',
  },
  table: {
    firstName: 'Full Name',
    email: 'Email',
    status: 'Status',
    emptyMessage: 'No users found',
  },
  buttons: {
    createUser: 'Create User',
    exportCsv: 'Export CSV',
    cancel: 'Cancel',
    delete: 'Delete',
  },
  messages: {
    createSuccess: 'User created successfully',
    createError: 'Failed to create user',
    deleteSuccess: 'User deleted successfully',
  },
  form: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
  },
};
```

### 2. Hook File: `features/users/hooks/useUserLabels.ts`

```typescript
import { useLabels } from '../../../shared/hooks/useLabels';
import { UserLabels, userLabels } from '../labels/user-labels';

export const useUserLabels = () => {
  const result = useLabels<UserLabels>(userLabels, 'user');
  
  return {
    ...result,
    L: result.labels,
  };
};
```

### 3. Component Usage: `features/users/components/Users.tsx`

```typescript
import { useUserLabels } from '../hooks/useUserLabels';

const Users: React.FC = () => {
  const { L, isLoading } = useUserLabels();
  
  if (isLoading) return <Spinner />;
  
  return (
    <div>
      <h1>{L.page.title}</h1>
      <p>{L.page.subtitle}</p>
      
      <Button onClick={handleCreate}>
        {L.buttons.createUser}
      </Button>
      
      <Table>
        <th>{L.table.firstName}</th>
        <th>{L.table.email}</th>
        <th>{L.table.status}</th>
      </Table>
      
      {users.length === 0 && <p>{L.table.emptyMessage}</p>}
    </div>
  );
};
```

---

## 🎯 Standard Category Names

### Required Categories

Every module should have these:

```typescript
export interface ModuleLabels {
  page: {
    title: string;
    subtitle: string;
  };
  buttons: {
    // action buttons
  };
  messages: {
    createSuccess: string;
    createError: string;
    updateSuccess: string;
    updateError: string;
    deleteSuccess: string;
    deleteError: string;
  };
}
```

### Optional Categories

Include if applicable:

| Category | When to Use | Example Keys |
|----------|-------------|--------------|
| `table` | Has data tables | `firstName`, `email`, `status`, `emptyMessage` |
| `search` | Has search functionality | `placeholder` |
| `status` | Has status fields | `active`, `inactive`, `pending` |
| `actions` | Has dropdown menus | `view`, `edit`, `delete`, `activate` |
| `modals` | Has modal dialogs | `create`, `edit`, `delete`, `confirm` |
| `form` | Has forms | Field labels: `firstName`, `email`, etc. |
| `placeholders` | Has input fields | `enterEmail`, `enterPassword`, etc. |
| `validation` | Has form validation | `emailRequired`, `emailInvalid`, etc. |
| `details` | Has detail views | `personalInfo`, `accountInfo`, etc. |

---

## 🚫 Anti-Patterns (Avoid These)

### ❌ DON'T: Flat SCREAMING_SNAKE_CASE

```typescript
// BAD - Don't do this
export const CUSTOMER_LABELS = {
  PAGE_TITLE: 'Customers',
  PAGE_SUBTITLE: 'Manage customers',
  BUTTON_ADD: 'Add Customer',
  LABEL_FIRST_NAME: 'First Name',
  ERROR_CREATE_FAILED: 'Failed to create',
  SUCCESS_CREATED: 'Customer created',
  // 100+ more flat keys...
}

// Component usage is messy
<h1>{CUSTOMER_LABELS.PAGE_TITLE}</h1>
<Input label={CUSTOMER_LABELS.LABEL_FIRST_NAME} />
```

**Problems:**
- No type safety
- Hard to navigate (100+ keys)
- Verbose usage
- No logical grouping
- Naming collisions require prefixes

### ❌ DON'T: Missing TypeScript Interface

```typescript
// BAD - No interface
export const roleLabels = {
  PAGE_TITLE: 'Roles',
  FORM: {
    NAME: 'Role Name',
  },
}
```

**Problems:**
- No IntelliSense
- No compile-time checking
- Prone to typos

### ❌ DON'T: Mixed Patterns

```typescript
// BAD - Inconsistent structure
export const labels = {
  PAGE_TITLE: 'Title',           // Flat at root
  BUTTONS: {                      // Nested
    CREATE: 'Create',
  },
  MODAL_TITLE_CREATE: 'Create',  // Flat again
}
```

**Problems:**
- Confusing to use
- Inconsistent access patterns
- Hard to maintain

---

## ✅ DO: Follow This Pattern

### Step-by-Step Template

#### 1. Create Interface

```typescript
export interface [Module]Labels {
  page: {
    title: string;
    subtitle: string;
  };
  buttons: {
    create: string;
    save: string;
    cancel: string;
  };
  messages: {
    createSuccess: string;
    createError: string;
  };
  // Add more categories as needed
}
```

#### 2. Create Constant

```typescript
export const [module]Labels: [Module]Labels = {
  page: {
    title: 'Module Title',
    subtitle: 'Description',
  },
  buttons: {
    create: 'Create',
    save: 'Save',
    cancel: 'Cancel',
  },
  messages: {
    createSuccess: 'Created successfully',
    createError: 'Failed to create',
  },
};
```

#### 3. Create Hook

```typescript
export const use[Module]Labels = () => {
  const result = useLabels<[Module]Labels>([module]Labels, '[module]');
  return { ...result, L: result.labels };
};
```

#### 4. Use in Components

```typescript
const { L, isLoading } = use[Module]Labels();

return <h1>{L.page.title}</h1>;
```

---

## 🔄 Migration Guide

### Converting from Old Pattern

#### Before (Flat Pattern):
```typescript
export const CUSTOMER_LABELS = {
  PAGE_TITLE: 'Customers',
  ADD_CUSTOMER: 'Add Customer',
  LABEL_FIRST_NAME: 'First Name',
  ERROR_CREATE_FAILED: 'Failed to create customer',
}

// Component
<h1>{CUSTOMER_LABELS.PAGE_TITLE}</h1>
<Button>{CUSTOMER_LABELS.ADD_CUSTOMER}</Button>
<Input label={CUSTOMER_LABELS.LABEL_FIRST_NAME} />
```

#### After (Standard Pattern):
```typescript
export interface CustomerLabels {
  page: { title: string };
  buttons: { add: string };
  form: { firstName: string };
  messages: { createError: string };
}

export const customerLabels: CustomerLabels = {
  page: { title: 'Customers' },
  buttons: { add: 'Add Customer' },
  form: { firstName: 'First Name' },
  messages: { createError: 'Failed to create customer' },
};

// Component
const { L } = useCustomerLabels();
<h1>{L.page.title}</h1>
<Button>{L.buttons.add}</Button>
<Input label={L.form.firstName} />
```

---

## 📦 npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "seed:auth-translations": "ts-node scripts/seed-auth-translations.ts",
    "seed:user-translations": "ts-node scripts/seed-user-translations.ts",
    "seed:customer-translations": "ts-node scripts/seed-customer-translations.ts",
    "seed:all-translations": "npm run seed:auth-translations && npm run seed:user-translations && npm run seed:customer-translations"
  }
}
```

---

## 🧪 Testing Translations

### 1. Verify Compilation
```bash
cd react-admin
npm run build
```

### 2. Seed Translations
```bash
npm run seed:[module]-translations
```

### 3. Test Language Switching
1. Start react-admin app
2. Use LanguageSwitcher component
3. Switch to French/Spanish
4. Verify labels translate correctly

---

## 📚 Reference Files

### ✅ Good Examples (Follow These)
- `features/users/labels/user-labels.ts`
- `features/users/hooks/useUserLabels.ts`
- `features/auth/labels/auth-labels.ts`
- `features/auth/hooks/useAuthLabels.ts`

### ❌ Bad Examples (Don't Follow)
- `features/customers/labels/customer-labels.ts` (flat pattern)
- `features/dashboard/labels/dashboard-labels.ts` (flat pattern)

### 📖 Documentation
- Complete Analysis: `LABEL-STRUCTURE-ANALYSIS.md`
- Copilot Instructions: `.github/copilot-instructions.md`
- Shared Hook: `src/shared/hooks/useLabels.ts`

---

## 🎓 Best Practices

### DO ✅
- Use TypeScript interfaces for type safety
- Organize labels into logical categories
- Use camelCase for all keys
- Create custom hooks for each module
- Use the `L` alias in components
- Handle loading states
- Seed translations for all languages
- Keep labels organized by feature

### DON'T ❌
- Use SCREAMING_SNAKE_CASE
- Create flat label objects
- Skip TypeScript interfaces
- Mix naming conventions
- Hardcode strings in components
- Forget to seed translations
- Put label files in wrong directories

---

## 🔧 Troubleshooting

### TypeScript Errors
```typescript
// Error: Property 'title' does not exist
const { L } = useModuleLabels();
console.log(L.page.title); // ❌

// Fix: Check interface definition
export interface ModuleLabels {
  page: {
    title: string; // ✅ Make sure this exists
  };
}
```

### Translation Not Updating
1. Check if seeding script ran successfully
2. Verify translation service is running (port 3007)
3. Clear React Query cache
4. Check browser console for errors
5. Verify language is not 'en' (English bypasses API)

### Missing Categories
```typescript
// Error: Property 'form' does not exist
const { L } = useModuleLabels();
console.log(L.form.email); // ❌

// Fix: Add category to interface and constant
export interface ModuleLabels {
  form: {
    email: string;
  };
}
```

---

## 📞 Support

For questions or issues:
1. Check `LABEL-STRUCTURE-ANALYSIS.md` for detailed analysis
2. Review reference examples (Users, Auth modules)
3. Check `.github/copilot-instructions.md` for AI agent guidance
4. Verify translation service is running: `docker ps | grep translation`

---

**Last Updated:** October 27, 2025  
**Version:** 1.0  
**Status:** ✅ Active Standard
