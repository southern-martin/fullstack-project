# Forms Components

This directory contains all form-related components organized by their purpose and functionality.

## Directory Structure

```
forms/
├── elements/          # Form element showcases and examples
├── layouts/           # Form layout patterns and templates
├── wizards/           # Multi-step form wizards
├── validation/        # Form validation examples and patterns
├── business/          # Business-specific forms (AddProduct, CreateInvoice)
└── index.ts          # Main export file
```

## Components

### Form Elements (`elements/`)
- **FormElements**: Comprehensive showcase of all form input types
  - Basic inputs (text, email, password, number, etc.)
  - Text areas with character limits
  - Select dropdowns and multi-selects
  - Checkboxes and radio buttons
  - Date and time pickers
  - File upload components
  - Range sliders and toggles
  - Rating components
  - Tag inputs

### Form Layouts (`layouts/`)
- **FormLayouts**: Different form layout patterns
  - Vertical form layouts
  - Horizontal form layouts
  - Inline form layouts
  - Multi-column forms
  - Responsive form designs
  - Form sections and grouping

### Form Wizards (`wizards/`)
- **FormWizards**: Multi-step form implementations
  - Step-by-step form progression
  - Progress indicators
  - Step validation
  - Navigation between steps
  - Data persistence across steps
  - Completion tracking

### Form Validation (`validation/`)
- **FormValidation**: Validation patterns and examples
  - Real-time validation
  - Field-level validation
  - Form-level validation
  - Custom validation rules
  - Error message display
  - Validation feedback

### Business Forms (`business/`)
- **AddProduct**: Product creation form
  - Product information fields
  - Category selection
  - Pricing and inventory
  - Image upload
  - SEO settings
  - Product variants

- **CreateInvoice**: Invoice creation form
  - Customer selection
  - Product/service selection
  - Pricing calculations
  - Tax calculations
  - Payment terms
  - Invoice details

## Usage Examples

### Using Form Elements
```typescript
import { FormElements } from '../components/forms';

function FormElementsPage() {
  return <FormElements />;
}
```

### Using Form Layouts
```typescript
import { FormLayouts } from '../components/forms';

function FormLayoutsPage() {
  return <FormLayouts />;
}
```

### Using Form Wizards
```typescript
import { FormWizards } from '../components/forms';

function FormWizardsPage() {
  return <FormWizards />;
}
```

### Using Business Forms
```typescript
import { AddProduct, CreateInvoice } from '../components/forms';

function ProductManagement() {
  return (
    <div>
      <AddProduct />
      <CreateInvoice />
    </div>
  );
}
```

## Form Patterns

### 1. Controlled Components
All forms use controlled components with React state management:
```typescript
const [formData, setFormData] = useState({
  field1: '',
  field2: '',
});

const handleInputChange = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

### 2. Validation Patterns
Forms implement comprehensive validation:
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const validateField = (field: string, value: any) => {
  // Validation logic
  if (!value) {
    setErrors(prev => ({ ...prev, [field]: 'This field is required' }));
  }
};
```

### 3. Error Handling
Consistent error handling across all forms:
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate form
  const newErrors = validateForm(formData);
  
  if (Object.keys(newErrors).length === 0) {
    // Submit form
    onSubmit(formData);
  } else {
    setErrors(newErrors);
  }
};
```

## Styling

All forms use Tailwind CSS classes for consistent styling:
- Form containers with proper spacing
- Input fields with focus states
- Error states with red borders and messages
- Success states with green indicators
- Responsive design for mobile and desktop

## Accessibility

Forms include proper accessibility features:
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- Error announcements
- Required field indicators

## Integration with Enterprise Architecture

Forms integrate with the enterprise architecture:
- **Type Safety**: All forms use TypeScript interfaces
- **Validation**: Integration with validation utilities
- **Error Handling**: Consistent error handling patterns
- **State Management**: Integration with custom hooks
- **API Integration**: Forms connect to service layer
- **Configuration**: Forms respect application configuration

## Best Practices

1. **Consistent Naming**: Use consistent naming conventions for form fields
2. **Validation**: Implement both client-side and server-side validation
3. **Error Messages**: Provide clear, actionable error messages
4. **Loading States**: Show loading states during form submission
5. **Success Feedback**: Provide clear success feedback
6. **Accessibility**: Ensure forms are accessible to all users
7. **Mobile Responsive**: Design forms to work on all devices
8. **Performance**: Optimize forms for performance with proper memoization

## Future Enhancements

- Form builder component for dynamic forms
- Advanced validation with schema validation
- Form analytics and tracking
- A/B testing for form optimization
- Integration with form libraries (Formik, React Hook Form)
- Advanced field types (rich text, file upload with preview)
- Form templates and presets
