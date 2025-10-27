/**
 * Customer Module Translation Labels
 *
 * This file contains all static UI labels used in the Customer module.
 * Labels are organized by category for better maintainability.
 *
 * Usage with useCustomerLabels hook:
 * const { L } = useCustomerLabels();
 * <h1>{L.page.title}</h1>
 */

export interface CustomerLabels {
  // Page Header
  page: {
    title: string;
    subtitle: string;
  };

  // Buttons & Actions
  buttons: {
    add: string;
    cancel: string;
    delete: string;
    exportCsv: string;
    refresh: string;
    save: string;
    saving: string;
    update: string;
    create: string;
    close: string;
  };

  // Toast Messages
  messages: {
    createSuccess: string;
    createError: string;
    updateSuccess: string;
    updateError: string;
    deleteSuccess: string;
    deleteError: string;
    activateSuccess: string;
    deactivateSuccess: string;
    toggleStatusError: string;
    exportError: string;
    saveError: string;
    unknownError: string;
  };

  // Table Headers & Display
  table: {
    firstName: string;
    lastName: string;
    email: string;
    createdDate: string;
    actions: string;
    emptyMessage: string;
  };

  // Search & Filters
  search: {
    placeholder: string;
  };

  // Status Values
  status: {
    active: string;
    inactive: string;
  };

  // Dropdown Actions
  actions: {
    viewDetails: string;
    edit: string;
    activate: string;
    deactivate: string;
    delete: string;
  };

  // Modal Titles
  modals: {
    create: string;
    edit: string;
    view: string;
    delete: string;
    deleteConfirm: string;
  };

  // Form Fields
  form: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    name: string;
    address: string;
    customerId: string;
    status: string;
    created: string;
    lastUpdated: string;
  };

  // Form Placeholders
  placeholders: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    search: string;
    notProvided: string;
  };

  // Validation Messages
  validation: {
    firstNameRequired: string;
    lastNameRequired: string;
    emailRequired: string;
    emailInvalid: string;
  };

  // Section Titles
  sections: {
    contactInfo: string;
    accountInfo: string;
  };
}

/**
 * Default English labels for the Customer module
 */
export const customerLabels: CustomerLabels = {
  page: {
    title: 'Customers',
    subtitle: 'Manage your customer database',
  },

  buttons: {
    add: 'Add Customer',
    cancel: 'Cancel',
    delete: 'Delete',
    exportCsv: 'Export CSV',
    refresh: 'Refresh',
    save: 'Save',
    saving: 'Saving...',
    update: 'Update Customer',
    create: 'Create Customer',
    close: 'Close',
  },

  messages: {
    createSuccess: 'Customer created successfully',
    createError: 'Failed to create customer',
    updateSuccess: 'Customer updated successfully',
    updateError: 'Failed to update customer',
    deleteSuccess: 'Customer deleted successfully',
    deleteError: 'Failed to delete customer',
    activateSuccess: 'Customer activated',
    deactivateSuccess: 'Customer deactivated',
    toggleStatusError: 'Failed to toggle customer status',
    exportError: 'Failed to export customers',
    saveError: 'An error occurred while saving the customer',
    unknownError: 'Unknown error',
  },

  table: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    createdDate: 'Created Date',
    actions: 'Actions',
    emptyMessage: 'No customers found',
  },

  search: {
    placeholder: 'Search customers by name, email, or company...',
  },

  status: {
    active: 'Active',
    inactive: 'Inactive',
  },

  actions: {
    viewDetails: 'View Details',
    edit: 'Edit',
    activate: 'Activate',
    deactivate: 'Deactivate',
    delete: 'Delete',
  },

  modals: {
    create: 'Create New Customer',
    edit: 'Edit Customer',
    view: 'Customer Details',
    delete: 'Delete Customer',
    deleteConfirm:
      'Are you sure you want to delete this customer? This action cannot be undone.',
  },

  form: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company',
    name: 'Name',
    address: 'Address',
    customerId: 'Customer ID',
    status: 'Status',
    created: 'Created',
    lastUpdated: 'Last Updated',
  },

  placeholders: {
    firstName: 'Enter first name',
    lastName: 'Enter last name',
    email: 'Enter email address',
    phone: 'Enter phone number',
    company: 'Enter company name',
    search: 'Search customers by name, email, or company...',
    notProvided: 'Not provided',
  },

  validation: {
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email address',
  },

  sections: {
    contactInfo: 'Contact Information',
    accountInfo: 'Account Information',
  },
};
