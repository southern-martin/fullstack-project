/**
 * Role Management Labels
 * Labels for role and permission management UI
 */
export const roleLabels = {
  // Page Titles
  PAGE_TITLE: 'Roles & Permissions',
  PAGE_SUBTITLE: 'Manage user roles and access permissions',
  LIST_TITLE: 'Roles',
  CREATE_TITLE: 'Create New Role',
  EDIT_TITLE: 'Edit Role',
  DETAILS_TITLE: 'Role Details',

  // Table Headers
  TABLE: {
    NAME: 'Role Name',
    DESCRIPTION: 'Description',
    PERMISSIONS: 'Permissions',
    USERS: 'Users',
    STATUS: 'Status',
    CREATED_AT: 'Created',
    UPDATED_AT: 'Last Updated',
    ACTIONS: 'Actions',
  },

  // Form Labels
  FORM: {
    NAME: 'Role Name',
    NAME_PLACEHOLDER: 'Enter role name (e.g., Admin, Manager)',
    DESCRIPTION: 'Description',
    DESCRIPTION_PLACEHOLDER: 'Describe the purpose of this role',
    PERMISSIONS: 'Permissions',
    SELECT_PERMISSIONS: 'Select permissions for this role',
    IS_ACTIVE: 'Active',
    IS_ACTIVE_HELP: 'Inactive roles cannot be assigned to users',
  },

  // Buttons
  BUTTONS: {
    CREATE_ROLE: 'Create Role',
    EDIT_ROLE: 'Edit Role',
    DELETE_ROLE: 'Delete Role',
    SAVE: 'Save Role',
    CANCEL: 'Cancel',
    VIEW_DETAILS: 'View Details',
    ASSIGN_PERMISSIONS: 'Assign Permissions',
    MANAGE_USERS: 'Manage Users',
    BACK_TO_LIST: 'Back to Roles',
  },

  // Status
  STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
  },

  // Permissions
  PERMISSIONS: {
    TITLE: 'Permissions',
    SELECT_ALL: 'Select All',
    DESELECT_ALL: 'Deselect All',
    SELECTED_COUNT: (count: number) => `${count} permission(s) selected`,
    NO_PERMISSIONS: 'No permissions assigned',
    
    // Categories
    CATEGORIES: {
      USERS: 'User Management',
      ROLES: 'Role Management',
      SYSTEM: 'System Administration',
      CONTENT: 'Content Management',
      ANALYTICS: 'Analytics & Reports',
      SETTINGS: 'Settings',
      CARRIERS: 'Carrier Management',
      CUSTOMERS: 'Customer Management',
      PRICING: 'Pricing Management',
    },
    
    // Common Permissions
    READ: 'View',
    CREATE: 'Create',
    UPDATE: 'Update',
    DELETE: 'Delete',
    MANAGE: 'Full Management',
  },

  // Messages
  MESSAGES: {
    CREATE_SUCCESS: 'Role created successfully',
    UPDATE_SUCCESS: 'Role updated successfully',
    DELETE_SUCCESS: 'Role deleted successfully',
    DELETE_CONFIRM: 'Are you sure you want to delete this role?',
    DELETE_WARNING: (userCount: number) =>
      `This role is assigned to ${userCount} user(s). Deleting it will remove the role from all users.`,
    NO_ROLES: 'No roles found',
    LOADING: 'Loading roles...',
    ERROR_LOADING: 'Failed to load roles',
    ERROR_CREATING: 'Failed to create role',
    ERROR_UPDATING: 'Failed to update role',
    ERROR_DELETING: 'Failed to delete role',
    PERMISSION_ASSIGNED: 'Permissions assigned successfully',
    PERMISSION_ERROR: 'Failed to assign permissions',
  },

  // Validation
  VALIDATION: {
    NAME_REQUIRED: 'Role name is required',
    NAME_MIN_LENGTH: 'Role name must be at least 2 characters',
    NAME_MAX_LENGTH: 'Role name must not exceed 50 characters',
    NAME_ALREADY_EXISTS: 'A role with this name already exists',
    DESCRIPTION_MAX_LENGTH: 'Description must not exceed 200 characters',
    AT_LEAST_ONE_PERMISSION: 'Please select at least one permission',
  },

  // Details View
  DETAILS: {
    INFORMATION: 'Role Information',
    PERMISSIONS_LIST: 'Assigned Permissions',
    USERS_LIST: 'Users with this Role',
    STATISTICS: 'Statistics',
    TOTAL_PERMISSIONS: 'Total Permissions',
    TOTAL_USERS: 'Total Users',
    CREATED_BY: 'Created By',
    LAST_MODIFIED_BY: 'Last Modified By',
    NO_USERS: 'No users assigned to this role yet',
  },

  // Stats
  STATS: {
    TOTAL_ROLES: 'Total Roles',
    ACTIVE_ROLES: 'Active Roles',
    INACTIVE_ROLES: 'Inactive Roles',
    TOTAL_PERMISSIONS: 'Total Permissions',
    ROLES_WITH_USERS: 'Roles in Use',
  },

  // Search & Filters
  SEARCH: {
    PLACEHOLDER: 'Search roles by name or description...',
    NO_RESULTS: 'No roles match your search',
    FILTER_BY_STATUS: 'Filter by Status',
    FILTER_ALL: 'All Roles',
    FILTER_ACTIVE: 'Active Only',
    FILTER_INACTIVE: 'Inactive Only',
    SORT_BY: 'Sort By',
    SORT_NAME_ASC: 'Name (A-Z)',
    SORT_NAME_DESC: 'Name (Z-A)',
    SORT_CREATED_DESC: 'Newest First',
    SORT_CREATED_ASC: 'Oldest First',
    SORT_USERS_DESC: 'Most Users',
  },

  // Empty States
  EMPTY: {
    NO_ROLES_TITLE: 'No Roles Yet',
    NO_ROLES_MESSAGE: 'Get started by creating your first role',
    NO_PERMISSIONS_TITLE: 'No Permissions Available',
    NO_PERMISSIONS_MESSAGE: 'Contact your system administrator',
  },
} as const;
