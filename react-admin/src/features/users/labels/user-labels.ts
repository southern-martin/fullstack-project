/**
 * User Module Translation Labels
 *
 * This file contains all static UI labels used in the Users module.
 * Labels are organized by category for better maintainability.
 *
 * Usage with useUserLabels hook:
 * const { L } = useUserLabels();
 * <h1>{L.page.title}</h1>
 */

export interface UserLabels {
  // Page Header
  page: {
    title: string;
    subtitle: string;
  };

  // Table Headers
  table: {
    firstName: string;
    email: string;
    roles: string;
    status: string;
    created: string;
    actions: string;
    emptyMessage: string;
  };

  // Buttons
  buttons: {
    createUser: string;
    exportCsv: string;
    refresh: string;
    cancel: string;
    delete: string;
  };

  // Search & Sorting
  search: {
    placeholder: string;
  };

  sortOptions: {
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    status: string;
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
    createUser: string;
    editUser: string;
    deleteUser: string;
    userDetails: string;
  };

  // Delete Confirmation
  delete: {
    confirmMessage: string;
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
    exportSuccess: string;
    exportError: string;
  };

  // User Details View Labels
  details: {
    personalInfo: string;
    accountInfo: string;
    rolesPermissions: string;
    firstName: string;
    lastName: string;
    email: string;
    userId: string;
    status: string;
    created: string;
    lastUpdated: string;
    noRoles: string;
  };

  // Form Field Labels
  form: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: string;
    isActive: string;
    selectAll: string;
    deselectAll: string;
  };
}

/**
 * English labels (source text)
 * These are the default labels used when language is English
 * or when translations are not available
 */
export const userLabels: UserLabels = {
  page: {
    title: 'Users',
    subtitle: 'Manage your user database',
  },

  table: {
    firstName: 'Full Name',
    email: 'Email',
    roles: 'Roles',
    status: 'Status',
    created: 'Created',
    actions: 'Actions',
    emptyMessage: 'No users found',
  },

  buttons: {
    createUser: 'Create User',
    exportCsv: 'Export CSV',
    refresh: 'Refresh',
    cancel: 'Cancel',
    delete: 'Delete',
  },

  search: {
    placeholder: 'Search users by name, email, or role...',
  },

  sortOptions: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    createdAt: 'Created Date',
    status: 'Status',
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
    createUser: 'Create New User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    userDetails: 'User Details',
  },

  delete: {
    confirmMessage:
      'Are you sure you want to delete this user? This action cannot be undone.',
  },

  messages: {
    createSuccess: 'User created successfully',
    createError: 'Failed to create user',
    updateSuccess: 'User updated successfully',
    updateError: 'Failed to update user',
    deleteSuccess: 'User deleted successfully',
    deleteError: 'Failed to delete user',
    activateSuccess: 'User activated',
    deactivateSuccess: 'User deactivated',
    toggleStatusError: 'Failed to toggle user status',
    exportSuccess: 'Users exported as {format}',
    exportError: 'Failed to export users',
  },

  details: {
    personalInfo: 'Personal Information',
    accountInfo: 'Account Information',
    rolesPermissions: 'Roles & Permissions',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    userId: 'User ID',
    status: 'Status',
    created: 'Created',
    lastUpdated: 'Last Updated',
    noRoles: 'No roles assigned',
  },

  form: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    password: 'Password',
    roles: 'Roles',
    isActive: 'Is Active',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
  },
};
