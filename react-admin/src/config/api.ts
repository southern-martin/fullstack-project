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

// ============================================
// SHARED API CONFIGURATION
// ============================================
// Shared configuration used across all modules
// Module-specific configs are now in their respective feature folders:
// - features/auth/config/authApi.ts
// - features/users/config/usersApi.ts
// - features/customers/config/customersApi.ts
// - features/carriers/config/carriersApi.ts
// - features/pricing/config/pricingApi.ts
// - features/sellers/config/sellerApi.ts
// - features/translations/config/translationApi.ts
// - features/roles/config/rolesApi.ts
// ============================================

export const SHARED_API_CONFIG = {
  BASE_URL: KONG_GATEWAY_URL + '/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

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

