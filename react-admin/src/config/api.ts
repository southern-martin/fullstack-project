// ============================================
// KONG API GATEWAY CONFIGURATION
// ============================================
// All services now route through Kong Gateway (port 8000)
// This provides centralized:
// - JWT Authentication & Authorization
// - Rate Limiting (300/min public, 50/min protected)
// - CORS handling
// - Request logging and monitoring
// - Load balancing (when scaled)
// ============================================

// Kong Gateway Base URL
const KONG_GATEWAY_URL = process.env.REACT_APP_KONG_GATEWAY_URL || 'http://localhost:8000';

// Service-specific API configurations
// All services use Kong Gateway as the entry point
export const AUTH_API_CONFIG = {
  BASE_URL: KONG_GATEWAY_URL + '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

export const USER_API_CONFIG = {
  BASE_URL: KONG_GATEWAY_URL + '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

export const CUSTOMER_API_CONFIG = {
  BASE_URL: KONG_GATEWAY_URL + '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

export const CARRIER_API_CONFIG = {
  BASE_URL: KONG_GATEWAY_URL + '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

export const PRICING_API_CONFIG = {
  BASE_URL: KONG_GATEWAY_URL + '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

export const TRANSLATION_API_CONFIG = {
  // Translation service accessed through Kong Gateway
  BASE_URL: process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8000/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

export const SELLER_API_CONFIG = {
  BASE_URL: KONG_GATEWAY_URL + '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

// Default API config (for backward compatibility)
// IMPORTANT: Auth requests should go to AUTH_API_CONFIG, not USER_API_CONFIG
export const SHARED_API_CONFIG = AUTH_API_CONFIG;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  CUSTOMERS: '/customers',
  CARRIERS: '/carriers',
  PRICING: '/pricing',
  SELLERS: '/sellers',
  TRANSLATIONS: '/translations',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;
