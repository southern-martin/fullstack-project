/**
 * Translation Module Translation Labels
 * 
 * This file contains all static UI labels used in the Translation module.
 * Labels are organized by category for better maintainability.
 * 
 * Usage with useTranslationLabels hook:
 * const { L } = useTranslationLabels();
 * <h1>{L.page.title}</h1>
 */

export interface TranslationLabels {
  // Page Header
  page: {
    title: string;
    subtitle: string;
    languageManagement: string;
  };

  // Table Headers & Display
  table: {
    original: string;
    destination: string;
    language: string;
    languageCode: string;
    key: string;
    context: string;
    status: string;
    approved: string;
    approvedBy: string;
    createdAt: string;
    updatedAt: string;
    emptyMessage: string;
    showing: string;
    of: string;
    entries: string;
  };

  // Buttons & Actions
  buttons: {
    create: string;
    createTranslation: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    refresh: string;
    manageLanguages: string;
    approve: string;
    export: string;
    import: string;
    translate: string;
  };

  // Search & Filters
  search: {
    placeholder: string;
    searchByOriginal: string;
    searchByDestination: string;
    searchByKey: string;
  };

  // Status Values
  status: {
    active: string;
    inactive: string;
    pending: string;
    approved: string;
    rejected: string;
  };

  // Dropdown Actions
  actions: {
    view: string;
    edit: string;
    delete: string;
    approve: string;
    toggleStatus: string;
    duplicate: string;
  };

  // Modal Titles
  modals: {
    createTranslation: string;
    editTranslation: string;
    deleteTranslation: string;
    viewTranslation: string;
    manageLanguages: string;
    importTranslations: string;
    exportTranslations: string;
  };

  // Toast Messages
  messages: {
    createSuccess: string;
    createError: string;
    updateSuccess: string;
    updateError: string;
    deleteSuccess: string;
    deleteError: string;
    approveSuccess: string;
    approveError: string;
    importSuccess: string;
    importError: string;
    exportSuccess: string;
    exportError: string;
    loadError: string;
  };

  // Form Fields
  form: {
    original: string;
    destination: string;
    languageCode: string;
    key: string;
    context: string;
    category: string;
    module: string;
    component: string;
    field: string;
    isApproved: string;
    approvedBy: string;
  };

  // Form Placeholders
  placeholders: {
    original: string;
    destination: string;
    selectLanguage: string;
    key: string;
    category: string;
    module: string;
    component: string;
    field: string;
  };

  // Validation Messages
  validation: {
    originalRequired: string;
    destinationRequired: string;
    languageRequired: string;
    keyRequired: string;
    invalidFormat: string;
  };

  // Detail View Labels
  details: {
    translationInfo: string;
    contextInfo: string;
    approvalInfo: string;
    usageInfo: string;
    usageCount: string;
    lastUsed: string;
    createdAt: string;
    updatedAt: string;
  };

  // Language Management
  languages: {
    title: string;
    subtitle: string;
    code: string;
    name: string;
    localName: string;
    flag: string;
    status: string;
    isDefault: string;
    direction: string;
    ltr: string;
    rtl: string;
  };
}

/**
 * Default English labels for the Translation module
 */
export const translationLabels: TranslationLabels = {
  page: {
    title: 'Translations',
    subtitle: 'Manage translations and language settings',
    languageManagement: 'Language Management',
  },

  table: {
    original: 'Original Text',
    destination: 'Translation',
    language: 'Language',
    languageCode: 'Language Code',
    key: 'Translation Key',
    context: 'Context',
    status: 'Status',
    approved: 'Approved',
    approvedBy: 'Approved By',
    createdAt: 'Created',
    updatedAt: 'Updated',
    emptyMessage: 'No translations found',
    showing: 'Showing',
    of: 'of',
    entries: 'entries',
  },

  buttons: {
    create: 'Create',
    createTranslation: 'Create Translation',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    refresh: 'Refresh',
    manageLanguages: 'Manage Languages',
    approve: 'Approve',
    export: 'Export',
    import: 'Import',
    translate: 'Translate',
  },

  search: {
    placeholder: 'Search translations...',
    searchByOriginal: 'Search by original text',
    searchByDestination: 'Search by translation',
    searchByKey: 'Search by key',
  },

  status: {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  },

  actions: {
    view: 'View Details',
    edit: 'Edit',
    delete: 'Delete',
    approve: 'Approve',
    toggleStatus: 'Toggle Status',
    duplicate: 'Duplicate',
  },

  modals: {
    createTranslation: 'Create New Translation',
    editTranslation: 'Edit Translation',
    deleteTranslation: 'Delete Translation',
    viewTranslation: 'Translation Details',
    manageLanguages: 'Manage Languages',
    importTranslations: 'Import Translations',
    exportTranslations: 'Export Translations',
  },

  messages: {
    createSuccess: 'Translation created successfully',
    createError: 'Failed to create translation',
    updateSuccess: 'Translation updated successfully',
    updateError: 'Failed to update translation',
    deleteSuccess: 'Translation deleted successfully',
    deleteError: 'Failed to delete translation',
    approveSuccess: 'Translation approved successfully',
    approveError: 'Failed to approve translation',
    importSuccess: 'Translations imported successfully',
    importError: 'Failed to import translations',
    exportSuccess: 'Translations exported successfully',
    exportError: 'Failed to export translations',
    loadError: 'Failed to load translations',
  },

  form: {
    original: 'Original Text',
    destination: 'Translation',
    languageCode: 'Language',
    key: 'Translation Key',
    context: 'Context',
    category: 'Category',
    module: 'Module',
    component: 'Component',
    field: 'Field',
    isApproved: 'Approved',
    approvedBy: 'Approved By',
  },

  placeholders: {
    original: 'Enter original text',
    destination: 'Enter translation',
    selectLanguage: 'Select language',
    key: 'Auto-generated key',
    category: 'e.g., ui-labels, messages',
    module: 'e.g., users, customers',
    component: 'e.g., UserList, UserForm',
    field: 'e.g., firstName, email',
  },

  validation: {
    originalRequired: 'Original text is required',
    destinationRequired: 'Translation is required',
    languageRequired: 'Language selection is required',
    keyRequired: 'Translation key is required',
    invalidFormat: 'Invalid format',
  },

  details: {
    translationInfo: 'Translation Information',
    contextInfo: 'Context Information',
    approvalInfo: 'Approval Information',
    usageInfo: 'Usage Information',
    usageCount: 'Usage Count',
    lastUsed: 'Last Used',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
  },

  languages: {
    title: 'Languages',
    subtitle: 'Manage supported languages',
    code: 'Code',
    name: 'Name',
    localName: 'Local Name',
    flag: 'Flag',
    status: 'Status',
    isDefault: 'Default',
    direction: 'Direction',
    ltr: 'Left to Right',
    rtl: 'Right to Left',
  },
};
