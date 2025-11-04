# React Admin User Module - Standard Structure Guide

## Overview
This document outlines the standardized structure and patterns implemented for the User Management module in React Admin. This serves as a template for future module development.

## Directory Structure

```
src/features/{moduleName}/
├── constants/
│   └── {moduleName}Labels.ts          # Centralized translation constants
├── hooks/
│   └── use{ModuleName}Management.ts   # Business logic hook
├── components/
│   ├── {ModuleName}Page.tsx            # Main page component
│   ├── {ModuleName}Table.tsx           # Data table component
│   ├── {moduleName}Form.tsx            # Form component
│   └── {moduleName}Modal.tsx          # Modal component
├── types/
│   └── {moduleName}.ts                # TypeScript interfaces
├── utils/
│   └── {moduleName}Utils.ts           # Utility functions
└── services/
    └── {moduleName}Api.ts             # API service layer
```

## Core Components

### 1. Translation Constants (`constants/{moduleName}Labels.ts`)

**Purpose**: Centralized UI text labels with translation support

**Key Structure**:
```typescript
export interface {ModuleName}Labels {
  page: { title: string; subtitle: string; };
  tabs: { details: string; profile: string; roles: string; };
  sections: { basicInfo: string; address: string; socialLinks: string; };
  details: { personalInfo: string; contactInfo: string; [fieldName]: string; };
  status: { active: string; inactive: string; };
  sortOptions: { [fieldName]: string; createdAt: string; status: string; };
  fields: { [allFormFieldNames]: string; createdAt: string; updatedAt: string; };
  placeholders: { [allFormPlaceholders]: string; selectDate: string; };
  actions: { createProfile: string; editProfile: string; viewDetails: string; edit: string; deactivate: string; activate: string; delete: string; };
  buttons: { create{ModuleName}: string; edit{ModuleName}: string; delete{ModuleName}: string; exportCsv: string; };
  search: { placeholder: string; label: string; noResults: string; };
  delete: { confirmMessage: string; confirmTitle: string; };
  form: { [allFormFields]: string; selectAll: string; };
  modals: { {moduleName}Details: string; create{ModuleName}: string; };
  table: { [tableColumnNames]: string; actions: string; emptyMessage: string; };
  messages: { createSuccess: string; updateSuccess: string; deleteError: string; };
  errors: { network: string; generic: string; validation: string; };
  success: { created: string; updated: string; deleted: string; };
  validation: { invalidUrl: string; required: string; };
  help: { bioHint: string; avatarHint: string; };
}

export const {MODULE_NAME}_LABELS: {ModuleName}Labels = {
  // Implementation with English defaults
};
```

### 2. Business Logic Hook (`hooks/use{ModuleName}Management.ts`)

**Purpose**: Centralize business logic, API calls, and state management

**Key Features**:
- API integration with centralized error handling
- Translation service integration
- CRUD operations with optimistic updates
- Search, filtering, and pagination
- Export functionality (CSV, Excel)
- Loading states and error management

**Structure**:
```typescript
export const use{ModuleName}Management = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => { ... });
  const createItem = useCallback(async (item) => { ... });
  const updateItem = useCallback(async (id, item) => { ... });
  const deleteItem = useCallback(async (id) => { ... });
  const toggleStatus = useCallback(async (id) => { ... });
  const handleSearch = useCallback((query) => { ... });
  const handleExport = useCallback((format) => { ... });

  return { data, loading, error, fetchData, createItem, updateItem, deleteItem, toggleStatus, handleSearch, handleExport };
};
```

### 3. Main Page Component (`components/{ModuleName}Page.tsx`)

**Purpose**: Main container component managing layout and integration

**Features**:
- Integration with business logic hook
- Modal management
- Search and filtering UI
- Data table integration
- Export functionality
- Responsive design

### 4. Table Component (`components/{ModuleName}Table.tsx`)

**Purpose**: Reusable data table with standardized features

**Features**:
- Server-side sorting and pagination
- Inline actions (view, edit, delete)
- Status toggles
- Bulk operations
- Responsive design

### 5. API Service Layer (`services/{moduleName}Api.ts`)

**Purpose**: HTTP client with centralized configuration

**Features**:
- Axios configuration with interceptors
- Request/response transformation
- Error handling
- Retry logic
- Caching integration

## Key Patterns and Standards

### 1. Translation Integration
- Use centralized labels from constants file
- All UI text must be translatable via MD5-based Translation Service
- No hardcoded strings in components
- Use `L.labelCategory.propertyName` pattern

### 2. Error Handling
- Centralized error messages in labels
- User-friendly error descriptions
- Network error handling with retry logic
- Validation error display

### 3. State Management
- Custom hooks for complex state logic
- Local state for UI concerns
- Optimistic updates for better UX
- Loading states for all async operations

### 4. TypeScript Standards
- Strict typing for all interfaces
- No `any` types allowed
- Comprehensive type definitions
- Generic types where appropriate

### 5. Component Standards
- Functional components with hooks
- Props interfaces for all components
- Default props where applicable
- Responsive design with Tailwind CSS

## Translation System Integration

### MD5-Based Translation Service
```typescript
// Translation hook usage
const { t } = useTranslation();
const L = useLabels(USER_LABELS, t);

// Usage in components
<L.page.title>  // Gets translated via MD5 hash
```

### Label Categories
- **Page Level**: Titles, subtitles, navigation
- **Forms**: Labels, placeholders, validation messages
- **Actions**: Button labels, operation descriptions
- **Messages**: Success, error, informational text
- **UI Elements**: Table headers, modal titles, tooltips

## Module Implementation Checklist

When creating new modules based on this structure:

### 1. Setup Phase
- [ ] Create directory structure following template
- [ ] Set up TypeScript interfaces
- [ ] Create translation constants file
- [ ] Configure API service layer

### 2. Development Phase
- [ ] Implement business logic hook
- [ ] Create main page component
- [ ] Build reusable components
- [ ] Integrate translation system

### 3. Quality Assurance
- [ ] Add comprehensive error handling
- [ ] Implement loading states
- [ ] Add form validation
- [ ] Test responsive design

### 4. Integration Phase
- [ ] Test API integration
- [ ] Verify translation system
- [ ] Test user flows
- [ ] Performance optimization

### 5. Deployment Phase
- [ ] Build production bundle
- [ ] Test deployment environment
- [ ] Verify all functionality
- [ ] Monitor for issues

## Best Practices

### 1. Consistency
- Follow naming conventions strictly
- Use consistent patterns across modules
- Maintain same file structure
- Standardize error messages

### 2. Maintainability
- Comment complex logic
- Use descriptive variable names
- Break down large components
- Document custom hooks

### 3. Performance
- Implement proper caching
- Use React.memo appropriately
- Optimize re-renders
- Monitor bundle size

### 4. User Experience
- Provide immediate feedback
- Handle errors gracefully
- Implement loading states
- Ensure responsive design

## Template Usage

To create a new module:
1. Copy the directory structure
2. Replace `{moduleName}` with actual module name
3. Replace `{ModuleName}` with PascalCase version
4. Update field names specific to your module
5. Customize validation rules
6. Add module-specific features

This structure has been proven to work effectively in production and provides a solid foundation for future module development.
