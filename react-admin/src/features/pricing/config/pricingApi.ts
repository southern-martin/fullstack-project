/**
 * Pricing API Configuration
 * 
 * This file contains all API endpoint definitions for the Pricing module.
 * All requests go through Kong Gateway at http://localhost:8000
 */

export const PRICING_API_CONFIG = {
  ENDPOINTS: {
    LIST: '/pricing',
    CREATE: '/pricing',
    UPDATE: (id: number) => `/pricing/${id}`,
    DELETE: (id: number) => `/pricing/${id}`,
    BY_CARRIER: (carrierId: number) => `/pricing/carrier/${carrierId}`,
    BY_ZONE: (zone: string) => `/pricing/zone/${zone}`,
    CALCULATE: '/pricing/calculate',
    BULK_UPDATE: '/pricing/bulk',
  },
} as const;

export const PRICING_ROUTES = {
  PRICING: '/pricing',
} as const;
