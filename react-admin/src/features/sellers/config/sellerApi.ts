/**
 * Seller API Configuration
 * 
 * This file contains all API endpoint definitions for the Seller module.
 * All requests go through Kong Gateway at http://localhost:8000
 */

export const SELLER_API_CONFIG = {
  ENDPOINTS: {
    LIST: '/sellers',
    CREATE: '/sellers',
    BY_ID: (id: number) => `/sellers/${id}`,
    UPDATE: (id: number) => `/sellers/${id}`,
    DELETE: (id: number) => `/sellers/${id}`,
    
    // Profile Management
    MY_PROFILE: '/sellers/me',
    BY_USER: (userId: number) => `/sellers/user/${userId}`,
    UPDATE_PROFILE: (id: number) => `/sellers/${id}/profile`,
    UPDATE_BANKING: (id: number) => `/sellers/${id}/banking`,
    
    // Verification
    PENDING_VERIFICATION: '/sellers/pending-verification',
    VERIFY: (id: number) => `/sellers/${id}/verify`,
    APPROVE: (id: number) => `/sellers/${id}/approve`,
    REJECT: (id: number) => `/sellers/${id}/reject`,
    
    // Status Management
    SUSPEND: (id: number) => `/sellers/${id}/suspend`,
    REACTIVATE: (id: number) => `/sellers/${id}/reactivate`,
    
    // Analytics
    ANALYTICS_OVERVIEW: (id: number) => `/sellers/${id}/analytics/overview`,
    ANALYTICS_SALES_TREND: (id: number) => `/sellers/${id}/analytics/sales-trend`,
    ANALYTICS_PRODUCTS: (id: number) => `/sellers/${id}/analytics/products`,
    ANALYTICS_REVENUE: (id: number) => `/sellers/${id}/analytics/revenue`,
  },
} as const;

export const SELLER_ROUTES = {
  SELLERS: '/sellers',
} as const;
