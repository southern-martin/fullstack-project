/**
 * User Module - Centralized Label Constants
 *
 * This file contains all static UI text labels for User Management module.
 * Labels are organized by category for easy maintenance.
 *
 * These labels will be translated using the MD5-based Translation Service.
 */

export interface UserLabels {
  // Page labels
  page: {
    title: string;
    subtitle: string;
  };

  // Tab labels
  tabs: {
    details: string;
    profile: string;
    roles: string;
  };

  // Section titles
  sections: {
    basicInfo: string;
    address: string;
    socialLinks: string;
    preferences: string;
    metadata: string;
  };

  // Details section
  details: {
    personalInfo: string;
    contactInfo: string;
    accountInfo: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userId: string;
    status: string;
    created: string;
    lastUpdated: string;
    rolesPermissions: string;
    noRoles: string;
  };

  // Status labels
  status: {
    active: string;
    inactive: string;
  };

  // Sort options
  sortOptions: {
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    status: string;
  };

  // Form field labels
  fields: {
    dateOfBirth: string;
    age: string;
    bio: string;
    avatar: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    linkedin: string;
    github: string;
    twitter: string;
    website: string;
    preferences: string;
    createdAt: string;
    updatedAt: string;
  };

  // Placeholders
  placeholders: {
    enterBio: string;
    enterAvatarUrl: string;
    enterStreet: string;
    enterCity: string;
    enterState: string;
    enterZipCode: string;
    enterCountry: string;
    enterLinkedinUrl: string;
    enterGithubUrl: string;
    enterTwitterUrl: string;
    enterWebsiteUrl: string;
    selectDate: string;
  };

  // Action buttons
  actions: {
    createProfile: string;
    editProfile: string;
    updateProfile: string;
    cancel: string;
    save: string;
    close: string;
    viewDetails: string;
    edit: string;
    deactivate: string;
    activate: string;
    delete: string;
  };

  // Button labels
  buttons: {
    createUser: string;
    editUser: string;
    deleteUser: string;
    saveUser: string;
    cancelEdit: string;
    confirmDelete: string;
    activateUser: string;
    deactivateUser: string;
    exportUsers: string;
    exportCsv: string;
    importUsers: string;
    refresh: string;
    filter: string;
    search: string;
    clear: string;
    back: string;
    next: string;
    previous: string;
    cancel: string;
    delete: string;
  };

  // Search labels
  search: {
    placeholder: string;
    label: string;
    noResults: string;
    searching: string;
  };

  // Delete labels
  delete: {
    confirmMessage: string;
    confirmTitle: string;
    successMessage: string;
    errorMessage: string;
    cantUndo: string;
  };

  // Form labels
  form: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    roleIds: string;
    isActive: string;
    roles: string;
    selectAll: string;
    deselectAll: string;
  };

  // Modal labels
  modals: {
    userDetails: string;
    createUser: string;
    editUser: string;
    deleteUser: string;
    confirmDelete: string;
  };

  // Table labels
  table: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
    created: string;
    actions: string;
    view: string;
    edit: string;
    delete: string;
    activate: string;
    deactivate: string;
    roles: string;
    emptyMessage: string;
  };

  // Messages
  messages: {
    noProfile: string;
    loadingProfile: string;
    createSuccess: string;
    updateSuccess: string;
    deleteSuccess: string;
    activateSuccess: string;
    deactivateSuccess: string;
    saveError: string;
    createError: string;
    updateError: string;
    deleteError: string;
    toggleStatusError: string;
    characterCount: string;
    characterLimit: string;
    exportSuccess: string;
    exportError: string;
  };

  // Error messages (user-facing)
  errors: {
    network: string;
    generic: string;
    validation: string;
    permission: string;
    notFound: string;
    serverError: string;
  };

  // Success messages (user-facing)
  success: {
    created: string;
    updated: string;
    deleted: string;
    activated: string;
    deactivated: string;
    rolesAssigned: string;
  };

  // Validation messages
  validation: {
    invalidUrl: string;
    invalidDate: string;
    bioTooLong: string;
    required: string;
  };

  // Helper text
  help: {
    bioHint: string;
    avatarHint: string;
    dobHint: string;
    addressHint: string;
    socialLinksHint: string;
  };
}

/**
 * Default English labels
 * These serve as the base text that will be translated via MD5-based Translation Service
 */
export const USER_LABELS: UserLabels = {
  page: {
    title: 'User Management',
    subtitle: 'Manage users, roles, and permissions',
  },

  tabs: {
    details: 'User Details',
    profile: 'Profile',
    roles: 'Roles & Permissions',
  },

  sections: {
    basicInfo: 'Basic Information',
    address: 'Address',
    socialLinks: 'Social Links',
    preferences: 'Preferences',
    metadata: 'Metadata',
  },

  details: {
    personalInfo: 'Personal Information',
    contactInfo: 'Contact Information',
    accountInfo: 'Account Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    phone: 'Phone Number',
    userId: 'User ID',
    status: 'Status',
    created: 'Created',
    lastUpdated: 'Last Updated',
    rolesPermissions: 'Roles & Permissions',
    noRoles: 'No roles assigned',
  },

  status: {
    active: 'Active',
    inactive: 'Inactive',
  },

  sortOptions: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    createdAt: 'Created Date',
    status: 'Status',
  },

  fields: {
    dateOfBirth: 'Date of Birth',
    age: 'Age',
    bio: 'Biography',
    avatar: 'Avatar URL',
    street: 'Street Address',
    city: 'City',
    state: 'State/Province',
    zipCode: 'ZIP/Postal Code',
    country: 'Country',
    linkedin: 'LinkedIn Profile',
    github: 'GitHub Profile',
    twitter: 'Twitter Handle',
    website: 'Website',
    preferences: 'Preferences',
    createdAt: 'Created',
    updatedAt: 'Last Updated',
  },

  placeholders: {
    enterBio: 'Tell us about yourself...',
    enterAvatarUrl: 'https://example.com/avatar.jpg',
    enterStreet: '123 Main Street',
    enterCity: 'San Francisco',
    enterState: 'California',
    enterZipCode: '94105',
    enterCountry: 'United States',
    enterLinkedinUrl: 'https://linkedin.com/in/username',
    enterGithubUrl: 'https://github.com/username',
    enterTwitterUrl: 'https://twitter.com/username',
    enterWebsiteUrl: 'https://yourwebsite.com',
    selectDate: 'Select date',
  },

  actions: {
    createProfile: 'Create Profile',
    editProfile: 'Edit Profile',
    updateProfile: 'Update Profile',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    viewDetails: 'View Details',
    edit: 'Edit',
    deactivate: 'Deactivate',
    activate: 'Activate',
    delete: 'Delete',
  },

  // Button labels
  buttons: {
    createUser: 'Create User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    saveUser: 'Save User',
    cancelEdit: 'Cancel',
    confirmDelete: 'Confirm Delete',
    activateUser: 'Activate User',
    deactivateUser: 'Deactivate User',
    exportUsers: 'Export Users',
    exportCsv: 'Export CSV',
    importUsers: 'Import Users',
    refresh: 'Refresh',
    filter: 'Filter',
    search: 'Search',
    clear: 'Clear',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    cancel: 'Cancel',
    delete: 'Delete',
  },

  // Search labels
  search: {
    placeholder: 'Search users by name, email, or ID...',
    label: 'Search Users',
    noResults: 'No users found matching your search',
    searching: 'Searching...',
  },

  // Delete labels
  delete: {
    confirmMessage: 'Are you sure you want to delete this user? This action cannot be undone.',
    confirmTitle: 'Confirm User Deletion',
    successMessage: 'User deleted successfully',
    errorMessage: 'Failed to delete user',
    cantUndo: 'This action cannot be undone.',
  },

  // Form labels
  form: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    phone: 'Phone Number',
    roleIds: 'Roles',
    isActive: 'Active Status',
    roles: 'Roles',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
  },

  // Modal labels
  modals: {
    userDetails: 'User Details',
    createUser: 'Create User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    confirmDelete: 'Confirm Delete',
  },

  // Table labels
  table: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    status: 'Status',
    createdAt: 'Created',
    created: 'Created',
    actions: 'Actions',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    activate: 'Activate',
    deactivate: 'Deactivate',
    roles: 'Roles',
    emptyMessage: 'No users found',
  },

  messages: {
    noProfile: 'No profile information yet',
    loadingProfile: 'Loading profile...',
    createSuccess: 'Profile created successfully',
    updateSuccess: 'Profile updated successfully',
    deleteSuccess: 'User deleted successfully',
    activateSuccess: 'User activated successfully',
    deactivateSuccess: 'User deactivated successfully',
    saveError: 'Failed to save profile',
    createError: 'Failed to create user',
    updateError: 'Failed to update user',
    deleteError: 'Failed to delete user',
    toggleStatusError: 'Failed to toggle user status',
    characterCount: 'characters',
    characterLimit: 'Character limit:',
    exportSuccess: 'Users exported successfully in {format} format',
    exportError: 'Failed to export users',
  },

  // User-facing error messages (should be translated)
  errors: {
    network: 'Network error. Please check your connection.',
    generic: 'An error occurred. Please try again.',
    validation: 'Please check your input and try again.',
    permission: 'You do not have permission to perform this action.',
    notFound: 'The requested user was not found.',
    serverError: 'Server error. Please try again later.',
  },

  // User-facing success messages (should be translated)
  success: {
    created: 'User created successfully',
    updated: 'User updated successfully',
    deleted: 'User deleted successfully',
    activated: 'User activated successfully',
    deactivated: 'User deactivated successfully',
    rolesAssigned: 'Roles assigned successfully',
  },

  validation: {
    invalidUrl: 'Please enter a valid URL',
    invalidDate: 'Please enter a valid date',
    bioTooLong: 'Biography must be 500 characters or less',
    required: 'This field is required',
  },

  help: {
    bioHint: 'Share a brief description about yourself (max 500 characters)',
    avatarHint: 'Enter a URL to your profile picture',
    dobHint: 'Your date of birth will be used to calculate your age',
    addressHint: 'Your physical address for contact purposes',
    socialLinksHint: 'Connect your professional social media profiles',
  },
};
