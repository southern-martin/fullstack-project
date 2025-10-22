/**
 * Customer Module Labels
 * All translatable strings for the Customer module
 */

export const CUSTOMER_LABELS = {
    // Page Titles & Headers
    PAGE_TITLE: 'Customers',
    PAGE_SUBTITLE: 'Manage your customer database',
    
    // Buttons
    ADD_CUSTOMER: 'Add Customer',
    
    // Modal Titles
    MODAL_TITLE_CREATE: 'Create New Customer',
    MODAL_TITLE_EDIT: 'Edit Customer',
    MODAL_TITLE_VIEW: 'Customer Details',
    MODAL_TITLE_DELETE: 'Delete Customer',
    
    // Form Labels
    LABEL_FIRST_NAME: 'First Name',
    LABEL_LAST_NAME: 'Last Name',
    LABEL_EMAIL: 'Email',
    LABEL_PHONE: 'Phone',
    LABEL_COMPANY: 'Company',
    LABEL_NAME: 'Name',
    LABEL_ADDRESS: 'Address',
    LABEL_CUSTOMER_ID: 'Customer ID',
    LABEL_STATUS: 'Status',
    LABEL_CREATED: 'Created',
    LABEL_LAST_UPDATED: 'Last Updated',
    
    // Form Placeholders
    PLACEHOLDER_FIRST_NAME: 'Enter first name',
    PLACEHOLDER_LAST_NAME: 'Enter last name',
    PLACEHOLDER_EMAIL: 'Enter email address',
    PLACEHOLDER_PHONE: 'Enter phone number',
    PLACEHOLDER_COMPANY: 'Enter company name',
    PLACEHOLDER_SEARCH: 'Search customers by name, email, or company...',
    
    // Form Validation Messages
    ERROR_FIRST_NAME_REQUIRED: 'First name is required',
    ERROR_LAST_NAME_REQUIRED: 'Last name is required',
    ERROR_EMAIL_REQUIRED: 'Email is required',
    ERROR_EMAIL_INVALID: 'Please enter a valid email address',
    
    // Toast Success Messages
    SUCCESS_CREATED: 'Customer created successfully',
    SUCCESS_UPDATED: 'Customer updated successfully',
    SUCCESS_DELETED: 'Customer deleted successfully',
    SUCCESS_ACTIVATED: 'Customer activated',
    SUCCESS_DEACTIVATED: 'Customer deactivated',
    
    // Toast Error Messages
    ERROR_CREATE_FAILED: 'Failed to create customer',
    ERROR_UPDATE_FAILED: 'Failed to update customer',
    ERROR_DELETE_FAILED: 'Failed to delete customer',
    ERROR_TOGGLE_STATUS_FAILED: 'Failed to toggle customer status',
    ERROR_EXPORT_FAILED: 'Failed to export customers',
    ERROR_SAVE_FAILED: 'An error occurred while saving the customer',
    ERROR_UNKNOWN: 'Unknown error',
    
    // Table Headers
    TABLE_HEADER_FIRST_NAME: 'First Name',
    TABLE_HEADER_LAST_NAME: 'Last Name',
    TABLE_HEADER_EMAIL: 'Email',
    TABLE_HEADER_CREATED_DATE: 'Created Date',
    TABLE_HEADER_ACTIONS: 'Actions',
    
    // Table Empty State
    EMPTY_MESSAGE: 'No customers found',
    
    // Delete Confirmation
    DELETE_CONFIRMATION_MESSAGE: 'Are you sure you want to delete this customer? This action cannot be undone.',
    
    // Section Titles
    SECTION_CONTACT_INFO: 'Contact Information',
    SECTION_ACCOUNT_INFO: 'Account Information',
    
    // Other
    NOT_PROVIDED: 'Not provided',
    
    // Dropdown Actions
    ACTION_VIEW_DETAILS: 'View Details',
    ACTION_EDIT: 'Edit',
    ACTION_ACTIVATE: 'Activate',
    ACTION_DEACTIVATE: 'Deactivate',
    ACTION_DELETE: 'Delete',
    
    // Common Buttons
    BUTTON_CANCEL: 'Cancel',
    BUTTON_DELETE: 'Delete',
    BUTTON_EXPORT_CSV: 'Export CSV',
    BUTTON_REFRESH: 'Refresh',
    BUTTON_SAVE: 'Save',
    BUTTON_SAVING: 'Saving...',
    BUTTON_UPDATE_CUSTOMER: 'Update Customer',
    BUTTON_CREATE_CUSTOMER: 'Create Customer',
    BUTTON_CLOSE: 'Close',
    
    // Status Labels
    STATUS_ACTIVE: 'Active',
    STATUS_INACTIVE: 'Inactive',
} as const;

export type CustomerLabelKey = keyof typeof CUSTOMER_LABELS;
