// Service-specific API configurations
export const AUTH_API_CONFIG = {
  BASE_URL:
    (process.env.REACT_APP_AUTH_API_URL || 'http://localhost:3001') + '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

export const USER_API_CONFIG = {
  BASE_URL:
    (process.env.REACT_APP_USER_API_URL || 'http://localhost:3003') + '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

export const CUSTOMER_API_CONFIG = {
  BASE_URL:
    (process.env.REACT_APP_CUSTOMER_API_URL || 'http://localhost:3001') +
    '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

export const CARRIER_API_CONFIG = {
  BASE_URL:
    (process.env.REACT_APP_CARRIER_API_URL || 'http://localhost:3001') +
    '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

export const PRICING_API_CONFIG = {
  BASE_URL:
    (process.env.REACT_APP_PRICING_API_URL || 'http://localhost:3001') +
    '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

export const TRANSLATION_API_CONFIG = {
  BASE_URL:
    (process.env.REACT_APP_TRANSLATION_API_URL || 'http://localhost:3001') +
    '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

// Default API config (for backward compatibility)
export const SHARED_API_CONFIG = USER_API_CONFIG;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  CUSTOMERS: '/customers',
  CARRIERS: '/carriers',
  PRICING: '/pricing',
  TRANSLATIONS: '/translations',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;
