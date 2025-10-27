/**
 * Role Module Translation Labels
 * 
 * This file contains all static UI labels used in the Role module.
 * Labels are organized by category for better maintainability.
 * 
 * Usage with useRoleLabels hook:
 * const { L } = useRoleLabels();
 * <h1>{L.page.title}</h1>
 */

export interface RoleLabels {
  // Page Header
  page: {
    title: string;
    subtitle: string;
    listTitle: string;
    createTitle: string;
    editTitle: string;
    detailsTitle: string;
  };

  // Table Headers
  table: {
    name: string;
    description: string;
    permissions: string;
    users: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    actions: string;
  };

  // Form Fields
  form: {
    name: string;
    namePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    permissions: string;
    selectPermissions: string;
    isActive: string;
    isActiveHelp: string;
  };

  // Buttons
  buttons: {
    createRole: string;
    editRole: string;
    deleteRole: string;
    save: string;
    cancel: string;
    viewDetails: string;
    assignPermissions: string;
    manageUsers: string;
    backToList: string;
  };

  // Status
  status: {
    active: string;
    inactive: string;
  };

  // Permissions Section
  permissions: {
    title: string;
    selectAll: string;
    deselectAll: string;
    selectedCount: string;
    noPermissions: string;
    read: string;
    create: string;
    update: string;
    delete: string;
    manage: string;
  };

  // Permission Categories
  categories: {
    users: string;
    roles: string;
    system: string;
    content: string;
    analytics: string;
    settings: string;
    carriers: string;
    customers: string;
    pricing: string;
  };

  // Toast Messages
  messages: {
    createSuccess: string;
    updateSuccess: string;
    deleteSuccess: string;
    deleteConfirm: string;
    deleteWarning: string;
    noRoles: string;
    loading: string;
    errorLoading: string;
    errorCreating: string;
    errorUpdating: string;
    errorDeleting: string;
    permissionAssigned: string;
    permissionError: string;
  };

  // Validation
  validation: {
    nameRequired: string;
    nameMinLength: string;
    nameMaxLength: string;
    nameAlreadyExists: string;
    descriptionMaxLength: string;
    atLeastOnePermission: string;
    permissionsRequired: string;
  };

  // Details View
  details: {
    information: string;
    permissionsList: string;
    usersList: string;
    statistics: string;
    totalPermissions: string;
    totalUsers: string;
    createdBy: string;
    lastModifiedBy: string;
    noUsers: string;
  };

  // Stats
  stats: {
    totalRoles: string;
    activeRoles: string;
    inactiveRoles: string;
    totalPermissions: string;
    rolesWithUsers: string;
  };

  // Search & Filters
  search: {
    placeholder: string;
    noResults: string;
    filterByStatus: string;
    filterAll: string;
    filterActive: string;
    filterInactive: string;
    sortBy: string;
    sortNameAsc: string;
    sortNameDesc: string;
    sortCreatedDesc: string;
    sortCreatedAsc: string;
    sortUsersDesc: string;
  };

  // Empty States
  empty: {
    noRolesTitle: string;
    noRolesMessage: string;
    noPermissionsTitle: string;
    noPermissionsMessage: string;
  };
}

/**
 * Default English labels for the Role module
 */
export const roleLabels: RoleLabels = {
  page: {
    title: 'Roles & Permissions',
    subtitle: 'Manage user roles and access permissions',
    listTitle: 'Roles',
    createTitle: 'Create New Role',
    editTitle: 'Edit Role',
    detailsTitle: 'Role Details',
  },

  table: {
    name: 'Role Name',
    description: 'Description',
    permissions: 'Permissions',
    users: 'Users',
    status: 'Status',
    createdAt: 'Created',
    updatedAt: 'Last Updated',
    actions: 'Actions',
  },

  form: {
    name: 'Role Name',
    namePlaceholder: 'Enter role name (e.g., Admin, Manager)',
    description: 'Description',
    descriptionPlaceholder: 'Describe the purpose of this role',
    permissions: 'Permissions',
    selectPermissions: 'Select permissions for this role',
    isActive: 'Active',
    isActiveHelp: 'Inactive roles cannot be assigned to users',
  },

  buttons: {
    createRole: 'Create Role',
    editRole: 'Edit Role',
    deleteRole: 'Delete Role',
    save: 'Save Role',
    cancel: 'Cancel',
    viewDetails: 'View Details',
    assignPermissions: 'Assign Permissions',
    manageUsers: 'Manage Users',
    backToList: 'Back to Roles',
  },

  status: {
    active: 'Active',
    inactive: 'Inactive',
  },

  permissions: {
    title: 'Permissions',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    selectedCount: 'permission(s) selected',
    noPermissions: 'No permissions assigned',
    read: 'View',
    create: 'Create',
    update: 'Update',
    delete: 'Delete',
    manage: 'Full Management',
  },

  categories: {
    users: 'User Management',
    roles: 'Role Management',
    system: 'System Administration',
    content: 'Content Management',
    analytics: 'Analytics & Reports',
    settings: 'Settings',
    carriers: 'Carrier Management',
    customers: 'Customer Management',
    pricing: 'Pricing Management',
  },

  messages: {
    createSuccess: 'Role created successfully',
    updateSuccess: 'Role updated successfully',
    deleteSuccess: 'Role deleted successfully',
    deleteConfirm: 'Are you sure you want to delete this role?',
    deleteWarning: 'This role is assigned to users. Deleting it will remove the role from all users.',
    noRoles: 'No roles found',
    loading: 'Loading roles...',
    errorLoading: 'Failed to load roles',
    errorCreating: 'Failed to create role',
    errorUpdating: 'Failed to update role',
    errorDeleting: 'Failed to delete role',
    permissionAssigned: 'Permissions assigned successfully',
    permissionError: 'Failed to assign permissions',
  },

  validation: {
    nameRequired: 'Role name is required',
    nameMinLength: 'Role name must be at least 2 characters',
    nameMaxLength: 'Role name must not exceed 50 characters',
    nameAlreadyExists: 'A role with this name already exists',
    descriptionMaxLength: 'Description must not exceed 200 characters',
    atLeastOnePermission: 'Please select at least one permission',
    permissionsRequired: 'Please select at least one permission',
  },

  details: {
    information: 'Role Information',
    permissionsList: 'Assigned Permissions',
    usersList: 'Users with this Role',
    statistics: 'Statistics',
    totalPermissions: 'Total Permissions',
    totalUsers: 'Total Users',
    createdBy: 'Created By',
    lastModifiedBy: 'Last Modified By',
    noUsers: 'No users assigned to this role yet',
  },

  stats: {
    totalRoles: 'Total Roles',
    activeRoles: 'Active Roles',
    inactiveRoles: 'Inactive Roles',
    totalPermissions: 'Total Permissions',
    rolesWithUsers: 'Roles in Use',
  },

  search: {
    placeholder: 'Search roles by name or description...',
    noResults: 'No roles match your search',
    filterByStatus: 'Filter by Status',
    filterAll: 'All Roles',
    filterActive: 'Active Only',
    filterInactive: 'Inactive Only',
    sortBy: 'Sort By',
    sortNameAsc: 'Name (A-Z)',
    sortNameDesc: 'Name (Z-A)',
    sortCreatedDesc: 'Newest First',
    sortCreatedAsc: 'Oldest First',
    sortUsersDesc: 'Most Users',
  },

  empty: {
    noRolesTitle: 'No Roles Yet',
    noRolesMessage: 'Get started by creating your first role',
    noPermissionsTitle: 'No Permissions Available',
    noPermissionsMessage: 'Contact your system administrator',
  },
};
