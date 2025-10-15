// Enterprise-grade constants for maintainability and consistency

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      REGISTER: '/auth/register',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
    },
    USERS: {
      BASE: '/users',
      PROFILE: '/users/profile',
      PERMISSIONS: '/users/permissions',
      AUDIT_LOGS: '/users/audit-logs',
    },
    PRODUCTS: {
      BASE: '/products',
      CATEGORIES: '/products/categories',
      INVENTORY: '/products/inventory',
      BULK_UPDATE: '/products/bulk-update',
    },
    ORDERS: {
      BASE: '/orders',
      STATS: '/orders/stats',
      EXPORT: '/orders/export',
    },
    CUSTOMERS: {
      BASE: '/customers',
      LOYALTY: '/customers/loyalty',
      PREFERENCES: '/customers/preferences',
    },
    ANALYTICS: {
      DASHBOARD: '/analytics/dashboard',
      REPORTS: '/analytics/reports',
      EXPORT: '/analytics/export',
    },
    NOTIFICATIONS: {
      BASE: '/notifications',
      MARK_READ: '/notifications/mark-read',
      MARK_ALL_READ: '/notifications/mark-all-read',
    },
  },
} as const;

// Application Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // E-commerce
  PRODUCTS: '/products',
  ORDERS: '/orders',
  CUSTOMERS: '/customers',
  INVENTORY: '/inventory',
  
  // Analytics
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  
  // Administration
  USERS: '/admin/users',
  ROLES: '/admin/roles',
  PERMISSIONS: '/admin/permissions',
  AUDIT_LOGS: '/admin/audit-logs',
  
  // UI Components
  UI: {
    BUTTONS: '/ui/buttons',
    FORMS: '/ui/forms',
    TABLES: '/ui/tables',
    MODALS: '/ui/modals',
    CHARTS: '/ui/charts',
  },
  
  // Error Pages
  ERROR_404: '/404',
  ERROR_500: '/500',
  MAINTENANCE: '/maintenance',
} as const;

// User Roles and Permissions
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  GUEST: 'guest',
} as const;

export const PERMISSIONS = {
  // User Management
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  
  // Product Management
  PRODUCTS_READ: 'products:read',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',
  PRODUCTS_INVENTORY: 'products:inventory',
  
  // Order Management
  ORDERS_READ: 'orders:read',
  ORDERS_CREATE: 'orders:create',
  ORDERS_UPDATE: 'orders:update',
  ORDERS_DELETE: 'orders:delete',
  ORDERS_EXPORT: 'orders:export',
  
  // Customer Management
  CUSTOMERS_READ: 'customers:read',
  CUSTOMERS_CREATE: 'customers:create',
  CUSTOMERS_UPDATE: 'customers:update',
  CUSTOMERS_DELETE: 'customers:delete',
  
  // Analytics
  ANALYTICS_READ: 'analytics:read',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Administration
  ADMIN_ACCESS: 'admin:access',
  AUDIT_LOGS_READ: 'audit_logs:read',
  SYSTEM_SETTINGS: 'system:settings',
} as const;

// Status Constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  
  // Table
  MAX_TABLE_ROWS: 1000,
  DEFAULT_SORT_ORDER: 'desc',
  
  // Modal
  MODAL_SIZES: {
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
    FULL: 'full',
  },
  
  // Form
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  
  // Animation
  TRANSITION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  
  // Breakpoints
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
} as const;

// Theme Constants
export const THEME = {
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#6B7280',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#06B6D4',
    BACKGROUND: '#FFFFFF',
    SURFACE: '#F9FAFB',
    TEXT: '#111827',
    TEXT_SECONDARY: '#6B7280',
  },
  DARK_COLORS: {
    PRIMARY: '#60A5FA',
    SECONDARY: '#9CA3AF',
    SUCCESS: '#34D399',
    WARNING: '#FBBF24',
    ERROR: '#F87171',
    INFO: '#22D3EE',
    BACKGROUND: '#111827',
    SURFACE: '#1F2937',
    TEXT: '#F9FAFB',
    TEXT_SECONDARY: '#D1D5DB',
  },
  TYPOGRAPHY: {
    FONT_FAMILY: 'Inter, system-ui, sans-serif',
    FONT_SIZES: {
      XS: '0.75rem',
      SM: '0.875rem',
      BASE: '1rem',
      LG: '1.125rem',
      XL: '1.25rem',
      '2XL': '1.5rem',
      '3XL': '1.875rem',
    },
    FONT_WEIGHTS: {
      NORMAL: 400,
      MEDIUM: 500,
      SEMIBOLD: 600,
      BOLD: 700,
    },
  },
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    '2XL': '3rem',
  },
  BORDER_RADIUS: {
    SM: '0.25rem',
    MD: '0.375rem',
    LG: '0.5rem',
    XL: '0.75rem',
    FULL: '9999px',
  },
} as const;

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  SKU_REGEX: /^[A-Z0-9\-_]+$/,
  URL_REGEX: /^https?:\/\/.+/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  PASSWORD_WEAK: 'Password must contain uppercase, lowercase, number and special character',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_URL: 'Please enter a valid URL',
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  INVALID_FILE_TYPE: 'Invalid file type',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully',
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  UPLOADED: 'File uploaded successfully',
  EXPORTED: 'Data exported successfully',
  EMAIL_SENT: 'Email sent successfully',
  PASSWORD_RESET: 'Password reset email sent',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebar_state',
  TABLE_PREFERENCES: 'table_preferences',
  FORM_DRAFTS: 'form_drafts',
} as const;

// Event Names
export const EVENTS = {
  // Authentication
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  USER_REGISTER: 'user:register',
  
  // Data Changes
  PRODUCT_CREATED: 'product:created',
  PRODUCT_UPDATED: 'product:updated',
  PRODUCT_DELETED: 'product:deleted',
  ORDER_CREATED: 'order:created',
  ORDER_UPDATED: 'order:updated',
  CUSTOMER_CREATED: 'customer:created',
  CUSTOMER_UPDATED: 'customer:updated',
  
  // UI Events
  THEME_CHANGED: 'theme:changed',
  LANGUAGE_CHANGED: 'language:changed',
  SIDEBAR_TOGGLED: 'sidebar:toggled',
  MODAL_OPENED: 'modal:opened',
  MODAL_CLOSED: 'modal:closed',
  
  // System Events
  ERROR_OCCURRED: 'error:occurred',
  NOTIFICATION_SENT: 'notification:sent',
  CACHE_CLEARED: 'cache:cleared',
} as const;

// Feature Flags
export const FEATURES = {
  DARK_MODE: process.env.REACT_APP_FEATURE_DARK_MODE === 'true',
  MULTI_LANGUAGE: process.env.REACT_APP_FEATURE_MULTI_LANGUAGE === 'true',
  ANALYTICS: process.env.REACT_APP_FEATURE_ANALYTICS === 'true',
  NOTIFICATIONS: process.env.REACT_APP_FEATURE_NOTIFICATIONS === 'true',
  FILE_UPLOAD: process.env.REACT_APP_FEATURE_FILE_UPLOAD === 'true',
  EXPORT: process.env.REACT_APP_FEATURE_EXPORT === 'true',
  AUDIT_LOGS: process.env.REACT_APP_FEATURE_AUDIT_LOGS === 'true',
} as const;

// Date and Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  TIME_ONLY: 'HH:mm',
  DATE_ONLY: 'YYYY-MM-DD',
} as const;

// Currency Configuration
export const CURRENCY = {
  DEFAULT: 'USD',
  SYMBOL: '$',
  DECIMAL_PLACES: 2,
  THOUSAND_SEPARATOR: ',',
  DECIMAL_SEPARATOR: '.',
} as const;

// Export this as default for easy importing
export default {
  API_CONFIG,
  ROUTES,
  USER_ROLES,
  PERMISSIONS,
  ORDER_STATUS,
  PRODUCT_STATUS,
  PAYMENT_STATUS,
  UI_CONSTANTS,
  THEME,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  EVENTS,
  FEATURES,
  DATE_FORMATS,
  CURRENCY,
};
