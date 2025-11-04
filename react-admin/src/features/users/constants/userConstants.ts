/**
 * User Module Constants
 *
 * Centralized constants for user-related UI and business logic
 */

export const USER_CONSTANTS = {
  // Dropdown constants
  DROPDOWN: {
    WIDTH: 192, // w-48 in pixels
    OFFSET: 4, // gap between button and dropdown
    Z_INDEX: 50,
    ANIMATION_DURATION: 200, // ms
  },

  // Pagination constants
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
    MAX_VISIBLE_PAGES: 5,
    MIN_PAGE: 1,
  },

  // Form validation constants
  VALIDATION: {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  // Avatar and display constants
  AVATAR: {
    SIZE: 32, // w-8 h-8 in pixels
    FALLBACK_COLOR: '#gray',
    INITIALS_LENGTH: 1,
  },

  // Cache constants
  CACHE: {
    STALE_TIME: 2 * 60 * 1000, // 2 minutes in ms
    RETRY_DELAY: 1000, // 1 second in ms
    BACKGROUND_REFETCH_INTERVAL: 5 * 60 * 1000, // 5 minutes in ms
  },

  // UI constants
  UI: {
    TOAST_DURATION: 3000, // 3 seconds
    MODAL_SIZES: {
      SM: 'sm',
      MD: 'md',
      LG: 'lg',
      XL: 'xl',
    },
    LOADING_MIN_DELAY: 500, // ms, minimum time to show loading state
  },

  // Business logic constants
  BUSINESS: {
    MAX_ROLES_PER_USER: 10,
    DEFAULT_USER_STATUS: true, // active by default
    BULK_DELETE_LIMIT: 100,
    EXPORT_LIMIT: 1000,
  },

  // API constants (excluding endpoints - those are in usersApi.ts)
  API: {
    METHODS: {
      GET: 'GET',
      POST: 'POST',
      PUT: 'PUT',
      DELETE: 'DELETE',
    },
    STATUS_CODES: {
      OK: 200,
      CREATED: 201,
      NO_CONTENT: 204,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      INTERNAL_ERROR: 500,
    },
  },

  // Error messages
  ERRORS: {
    NETWORK: 'Network error. Please check your connection.',
    GENERIC: 'An error occurred. Please try again.',
    VALIDATION: 'Please check your input and try again.',
    PERMISSION: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested user was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },

  // Success messages
  SUCCESS: {
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    ACTIVATED: 'User activated successfully',
    DEACTIVATED: 'User deactivated successfully',
    ROLES_ASSIGNED: 'Roles assigned successfully',
  },

  // Animation constants
  ANIMATION: {
    FADE_IN: 'animate-fade-in',
    SLIDE_UP: 'animate-slide-up',
    SCALE_IN: 'animate-scale-in',
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500,
    },
  },
} as const;

// Type exports for better TypeScript support
export type DropdownConstants = typeof USER_CONSTANTS.DROPDOWN;
export type PaginationConstants = typeof USER_CONSTANTS.PAGINATION;
export type ValidationConstants = typeof USER_CONSTANTS.VALIDATION;
export type AvatarConstants = typeof USER_CONSTANTS.AVATAR;
export type CacheConstants = typeof USER_CONSTANTS.CACHE;
export type UIConstants = typeof USER_CONSTANTS.UI;
export type BusinessConstants = typeof USER_CONSTANTS.BUSINESS;
export type APIConstants = typeof USER_CONSTANTS.API;
export type ErrorConstants = typeof USER_CONSTANTS.ERRORS;
export type SuccessConstants = typeof USER_CONSTANTS.SUCCESS;
export type AnimationConstants = typeof USER_CONSTANTS.ANIMATION;
