/**
 * Carrier Module Translation Labels
 *
 * This file contains all static UI labels used in the Carrier module.
 * Labels are organized by category for better maintainability.
 *
 * Usage with useCarrierLabels hook:
 * const { L } = useCarrierLabels();
 * <h1>{L.page.title}</h1>
 */

export interface CarrierLabels {
  // Page titles and headers
  page: {
    title: string;
    subtitle: string;
  };

  // Action buttons
  actions: {
    add: string;
    edit: string;
    view: string;
    delete: string;
    activate: string;
    deactivate: string;
    export: string;
    refresh: string;
    close: string;
    save: string;
    cancel: string;
    saving: string;
    create: string;
    update: string;
  };

  // Table headers and labels
  table: {
    name: string;
    phone: string;
    code: string;
    description: string;
    status: string;
    created: string;
    actions: string;
    email: string;
    lastUpdated: string;
    emptyMessage: string;
    showing: string;
    of: string;
  };

  // Status labels
  status: {
    active: string;
    inactive: string;
  };

  // Section titles
  sections: {
    carrierInfo: string;
    contactInfo: string;
    accountInfo: string;
  };

  // Form field labels
  fields: {
    name: string;
    code: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    carrierId: string;
    status: string;
    created: string;
    lastUpdated: string;
    isActive: string;
  };

  // Placeholders
  placeholders: {
    search: string;
    notProvided: string;
    noDescription: string;
    enterName: string;
    enterCode: string;
    enterEmail: string;
    enterPhone: string;
    enterDescription: string;
  };

  // Modal titles
  modals: {
    create: string;
    edit: string;
    view: string;
    delete: string;
    deleteConfirm: string;
  };

  // Toast/notification messages
  messages: {
    createSuccess: string;
    createError: string;
    updateSuccess: string;
    updateError: string;
    deleteSuccess: string;
    deleteError: string;
    activateSuccess: string;
    deactivateSuccess: string;
    statusError: string;
    exportSuccess: string;
    exportError: string;
    loadError: string;
  };

  // Sort options
  sorting: {
    name: string;
    email: string;
    phone: string;
    status: string;
    createdDate: string;
  };

  // Validation messages
  validation: {
    nameRequired: string;
    codeRequired: string;
    codeFormat: string;
    emailInvalid: string;
    phoneInvalid: string;
  };
}

/**
 * Default English labels for the Carrier module
 */
export const carrierLabels: CarrierLabels = {
  page: {
    title: 'Carriers',
    subtitle: 'Manage your carrier partners',
  },

  actions: {
    add: 'Add Carrier',
    edit: 'Edit',
    view: 'View',
    delete: 'Delete',
    activate: 'Activate',
    deactivate: 'Deactivate',
    export: 'Export CSV',
    refresh: 'Refresh',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    saving: 'Saving...',
    create: 'Create Carrier',
    update: 'Update Carrier',
  },

  table: {
    name: 'Name',
    phone: 'Phone',
    code: 'Code',
    description: 'Description',
    status: 'Status',
    created: 'Created',
    actions: 'Actions',
    email: 'Email',
    lastUpdated: 'Last Updated',
    emptyMessage: 'No carriers found',
    showing: 'Showing',
    of: 'of',
  },

  status: {
    active: 'Active',
    inactive: 'Inactive',
  },

  sections: {
    carrierInfo: 'Carrier Information',
    contactInfo: 'Contact Information',
    accountInfo: 'Account Information',
  },

  fields: {
    name: 'Name',
    code: 'Code',
    description: 'Description',
    contactEmail: 'Contact Email',
    contactPhone: 'Contact Phone',
    carrierId: 'Carrier ID',
    status: 'Status',
    created: 'Created',
    lastUpdated: 'Last Updated',
    isActive: 'Active',
  },

  placeholders: {
    search: 'Search carriers by name, email, or code...',
    notProvided: 'Not provided',
    noDescription: 'No description provided',
    enterName: 'Enter carrier name',
    enterCode: 'Enter carrier code (e.g., UPS, FEDEX)',
    enterEmail: 'Enter contact email',
    enterPhone: 'Enter contact phone',
    enterDescription: 'Enter description (optional)',
  },

  modals: {
    create: 'Create New Carrier',
    edit: 'Edit Carrier',
    view: 'Carrier Details',
    delete: 'Delete Carrier',
    deleteConfirm: 'Are you sure you want to delete this carrier?',
  },

  messages: {
    createSuccess: 'Carrier created successfully',
    createError: 'Failed to create carrier',
    updateSuccess: 'Carrier updated successfully',
    updateError: 'Failed to update carrier',
    deleteSuccess: 'Carrier deleted successfully',
    deleteError: 'Failed to delete carrier',
    activateSuccess: 'Carrier activated',
    deactivateSuccess: 'Carrier deactivated',
    statusError: 'Failed to toggle carrier status',
    exportSuccess: 'Carriers exported successfully',
    exportError: 'Failed to export carriers',
    loadError: 'Failed to load carriers',
  },

  sorting: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    status: 'Status',
    createdDate: 'Created Date',
  },

  validation: {
    nameRequired: 'Name is required',
    codeRequired: 'Code is required',
    codeFormat:
      'Code must contain only uppercase letters, numbers, and hyphens',
    emailInvalid: 'Invalid email format',
    phoneInvalid: 'Invalid phone format',
  },
};

/**
 * Get all label texts as a flat array for batch translation
 * This is used by the translation hook to fetch all translations at once
 */
export const getAllLabelTexts = (labels: CarrierLabels): string[] => {
  const texts: string[] = [];

  // Helper to recursively extract all string values
  const extractStrings = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        texts.push(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        extractStrings(obj[key]);
      }
    }
  };

  extractStrings(labels);
  return texts;
};

/**
 * Get label count for documentation and debugging
 */
export const getLabelCount = (labels: CarrierLabels): number => {
  return getAllLabelTexts(labels).length;
};
