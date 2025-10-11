# React Admin Project - Coding Standards & Naming Conventions

## 📁 File Naming Conventions

### **React Components (.tsx)**
- **PascalCase** for component files
- **Descriptive names** that indicate the component's purpose
- **Suffix with component type** when applicable

```bash
# ✅ Good Examples
UserForm.tsx
LoginForm.tsx
Dashboard.tsx
ProtectedRoute.tsx
AuthProvider.tsx

# ❌ Bad Examples
userForm.tsx
login-form.tsx
dashboard.tsx
protected_route.tsx
```

### **TypeScript Files (.ts)**
- **camelCase** for utility files, services, and configurations
- **Descriptive names** that indicate the file's purpose

```bash
# ✅ Good Examples
api.ts
authService.ts
userApiService.ts
dashboardService.ts
useAuth.ts

# ❌ Bad Examples
API.ts
AuthService.ts
user_api_service.ts
dashboard-service.ts
```

### **CSS Files**
- **PascalCase** for CSS modules
- **kebab-case** for global CSS files

```bash
# ✅ Good Examples
UserForm.module.css
components.css
index.css

# ❌ Bad Examples
userForm.module.css
Components.css
index.CSS
```

### **Configuration Files**
- **camelCase** with descriptive suffixes

```bash
# ✅ Good Examples
auth.api.ts
users.api.ts
customers.api.ts

# ❌ Bad Examples
auth-api.ts
usersApi.ts
customers_config.ts
```

## 🏗️ Directory Structure Standards

### **Feature-Based Organization**
```
src/features/[feature-name]/
├── components/          # React components
├── services/           # API services and business logic
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── config/             # Feature-specific configuration
└── tests/              # Feature-specific tests
```

### **Shared Resources**
```
src/shared/
├── components/         # Reusable UI components
│   ├── ui/            # Basic UI components (Button, Input, etc.)
│   ├── layout/        # Layout components
│   └── table/         # Table-related components
├── utils/             # Utility functions
├── types/             # Shared type definitions
└── styles/            # Global styles and CSS modules
```

## 🎯 Component Naming Standards

### **React Components**
- **PascalCase** for component names
- **Descriptive and specific** names
- **Avoid abbreviations** unless widely understood

```tsx
// ✅ Good Examples
const UserForm: React.FC = () => { ... }
const LoginForm: React.FC = () => { ... }
const Dashboard: React.FC = () => { ... }

// ❌ Bad Examples
const userForm: React.FC = () => { ... }
const Login: React.FC = () => { ... }
const Dash: React.FC = () => { ... }
```

### **Props Interfaces**
- **PascalCase** with descriptive suffix
- **Include "Props" suffix** for component props

```tsx
// ✅ Good Examples
interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserRequest) => Promise<void>;
  onCancel: () => void;
}

interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

// ❌ Bad Examples
interface userFormProps { ... }
interface tableColumn { ... }
interface Props { ... }
```

## 🔧 Function and Variable Naming

### **Functions**
- **camelCase** for function names
- **Descriptive verbs** that indicate the action
- **Async functions** should indicate their asynchronous nature

```tsx
// ✅ Good Examples
const handleSubmit = async (e: React.FormEvent) => { ... }
const loadUsers = useCallback(async () => { ... })
const validateForm = (data: FormData) => { ... }

// ❌ Bad Examples
const submit = (e: React.FormEvent) => { ... }
const load = useCallback(async () => { ... })
const validate = (data: FormData) => { ... }
```

### **Variables**
- **camelCase** for variable names
- **Descriptive names** that indicate the variable's purpose
- **Boolean variables** should start with `is`, `has`, `can`, `should`

```tsx
// ✅ Good Examples
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);
const [canSubmit, setCanSubmit] = useState(false);
const [shouldValidate, setShouldValidate] = useState(true);

// ❌ Bad Examples
const [loading, setLoading] = useState(false);
const [error, setError] = useState(false);
const [submit, setSubmit] = useState(false);
```

### **Constants**
- **UPPER_SNAKE_CASE** for constants
- **Descriptive names** that indicate the constant's purpose

```tsx
// ✅ Good Examples
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 10;

// ❌ Bad Examples
const apiBaseUrl = 'https://api.example.com';
const maxRetryAttempts = 3;
const defaultPageSize = 10;
```

## 📦 Import/Export Standards

### **Import Order**
1. **React and React-related imports**
2. **Third-party libraries**
3. **Internal imports (absolute paths)**
4. **Relative imports**
5. **Type-only imports**

```tsx
// ✅ Good Examples
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '../../../app/providers/AuthProvider';
import { User } from '../../../shared/types';
import { CreateUserRequest } from '../services/userApiService';
import type { UserFormProps } from './types';
```

### **Export Standards**
- **Named exports** for utilities and types
- **Default exports** for React components
- **Barrel exports** (index.ts) for clean imports

```tsx
// ✅ Good Examples
// Component file
export default UserForm;

// Utility file
export const formatDate = (date: Date) => { ... }
export const validateEmail = (email: string) => { ... }

// Types file
export interface User { ... }
export type UserRole = 'admin' | 'user';
```

## 🎨 CSS and Styling Standards

### **CSS Modules**
- **PascalCase** for CSS module files
- **camelCase** for CSS class names
- **Descriptive class names** that indicate the element's purpose

```css
/* ✅ Good Examples */
.formContainer { ... }
.inputField { ... }
.errorMessage { ... }
.submitButton { ... }

/* ❌ Bad Examples */
.form-container { ... }
.input_field { ... }
.error-message { ... }
```

### **Tailwind CSS Classes**
- **Use utility classes** for consistent styling
- **Group related classes** logically
- **Use responsive prefixes** when needed

```tsx
// ✅ Good Examples
className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"

// ❌ Bad Examples
className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md w-full px-3 py-2"
```

## 🧪 Testing Standards

### **Test File Naming**
- **ComponentName.test.tsx** for component tests
- **utilityName.test.ts** for utility tests
- **featureName.test.ts** for integration tests

```bash
# ✅ Good Examples
UserForm.test.tsx
authService.test.ts
userApiService.test.ts

# ❌ Bad Examples
userForm.test.tsx
AuthService.test.ts
user_api_service.test.ts
```

## 📝 Documentation Standards

### **Component Documentation**
- **JSDoc comments** for complex components
- **Prop descriptions** for component interfaces
- **Usage examples** for reusable components

```tsx
/**
 * UserForm component for creating and editing users
 * 
 * @param user - Optional user object for editing mode
 * @param onSubmit - Callback function called when form is submitted
 * @param onCancel - Callback function called when form is cancelled
 * 
 * @example
 * <UserForm
 *   user={selectedUser}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 */
const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  // Component implementation
};
```

## 🔍 Current Project Analysis

### **✅ Consistent Patterns Found:**
- React components use PascalCase (UserForm.tsx, LoginForm.tsx)
- Services use camelCase with descriptive names (userApiService.ts)
- Hooks use camelCase with "use" prefix (useAuth.ts)
- CSS modules use PascalCase (UserForm.module.css)

### **⚠️ Areas for Improvement:**
- Some config files use inconsistent naming (auth.api.ts vs users.api.ts)
- Mixed use of camelCase and kebab-case in some areas
- Some components could benefit from more descriptive names

### **📋 Recommendations:**
1. **Standardize config file naming** to use consistent pattern
2. **Add JSDoc comments** to complex components
3. **Create barrel exports** for cleaner imports
4. **Add TypeScript strict mode** configuration
5. **Implement ESLint rules** for naming conventions

## 🚀 Implementation Checklist

- [ ] Update config file naming conventions
- [ ] Add JSDoc comments to all components
- [ ] Create barrel exports for shared components
- [ ] Update ESLint configuration for naming rules
- [ ] Add Prettier configuration for consistent formatting
- [ ] Create component documentation templates
- [ ] Add TypeScript strict mode configuration

