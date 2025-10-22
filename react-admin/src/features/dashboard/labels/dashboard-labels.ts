/**
 * Dashboard Module - Translatable Labels
 * 
 * This file contains all user-facing strings for the Dashboard module.
 * Labels are organized into logical categories for easy maintenance.
 * 
 * Total Labels: 85
 * Categories: 12
 * - Page Titles & Headers
 * - Dashboard Type Buttons
 * - Navigation Cards
 * - Stats & Metrics
 * - Chart Titles
 * - System Status
 * - Table Headers
 * - Status Labels
 * - Time & Performance
 * - Messages & Notifications
 * - Buttons & Actions
 * - Ecommerce Specific
 */

export const dashboardLabels = {
  // ========================================
  // Page Titles & Headers (6)
  // ========================================
  PAGE_TITLE: 'Dashboard',
  PAGE_WELCOME: 'Welcome back',
  PAGE_SUBTITLE: 'Manage your application with ease',
  ECOMMERCE_TITLE: 'Ecommerce Dashboard',
  ECOMMERCE_SUBTITLE: 'Multi-seller platform analytics and insights',
  ADMIN_DASHBOARD_TITLE: '🚀 React Admin Dashboard',

  // ========================================
  // Dashboard Type Buttons (2)
  // ========================================
  BUTTON_ADMIN_DASHBOARD: 'Admin Dashboard',
  BUTTON_ECOMMERCE_DASHBOARD: 'Ecommerce Dashboard',

  // ========================================
  // Navigation Cards (15)
  // ========================================
  CARD_USERS_TITLE: 'Users',
  CARD_USERS_DESCRIPTION: 'Manage user accounts and permissions',
  CARD_USERS_BUTTON: 'View Users',
  
  CARD_CUSTOMERS_TITLE: 'Customers',
  CARD_CUSTOMERS_DESCRIPTION: 'Manage customer accounts and information',
  CARD_CUSTOMERS_BUTTON: 'View Customers',
  
  CARD_CARRIERS_TITLE: 'Carriers',
  CARD_CARRIERS_DESCRIPTION: 'Manage shipping carriers and logistics',
  CARD_CARRIERS_BUTTON: 'View Carriers',
  
  CARD_ANALYTICS_TITLE: 'Analytics',
  CARD_ANALYTICS_DESCRIPTION: 'View system analytics and reports',
  CARD_ANALYTICS_BUTTON: 'View Analytics',
  
  CARD_SETTINGS_TITLE: 'Settings',
  CARD_SETTINGS_DESCRIPTION: 'Configure system settings',
  CARD_SETTINGS_BUTTON: 'View Settings',

  // ========================================
  // Stats & Metrics (14)
  // ========================================
  STATS_TOTAL: 'Total',
  STATS_TOTAL_USERS: 'Total Users',
  STATS_TOTAL_CUSTOMERS: 'Total Customers',
  STATS_TOTAL_CARRIERS: 'Total Carriers',
  STATS_SYSTEM_STATUS: 'System Status',
  STATS_UPTIME: 'Uptime',
  STATS_VS_LAST_MONTH: 'vs last month',
  STATS_REPORTS: 'Reports',
  STATS_CONFIG: 'Config',
  STATS_TOTAL_REVENUE: 'Total Revenue',
  STATS_TOTAL_ORDERS: 'Total Orders',
  STATS_ACTIVE_SELLERS: 'Active Sellers',
  STATS_AVG_DELIVERY_TIME: 'Avg. Delivery Time',
  STATS_CONVERSION_RATE: 'Conversion Rate',
  STATS_AVG_ORDER_VALUE: 'Avg. Order Value',

  // ========================================
  // Chart Titles (6)
  // ========================================
  CHART_SALES_TREND: 'Sales Trend',
  CHART_ORDERS_TREND: 'Orders Trend',
  CHART_TOP_PRODUCTS: 'Top Selling Products',
  CHART_REVENUE_BY_CATEGORY: 'Revenue by Category',
  CHART_SELLER_PERFORMANCE: 'Seller Performance',
  CHART_RECENT_ORDERS: 'Recent Orders',

  // ========================================
  // System Status (6)
  // ========================================
  SECTION_SYSTEM_OVERVIEW: 'System Overview',
  SECTION_RECENT_USERS: 'Recent Users',
  SYSTEM_STATUS_HEALTHY: 'healthy',
  SYSTEM_STATUS_WARNING: 'warning',
  SYSTEM_STATUS_CRITICAL: 'critical',
  LAST_UPDATED: 'Last updated',

  // ========================================
  // Table Headers (4)
  // ========================================
  TABLE_HEADER_NAME: 'Name',
  TABLE_HEADER_EMAIL: 'Email',
  TABLE_HEADER_STATUS: 'Status',
  TABLE_HEADER_CREATED: 'Created',

  // ========================================
  // Status Labels (6)
  // ========================================
  STATUS_ACTIVE: 'Active',
  STATUS_INACTIVE: 'Inactive',
  STATUS_COMPLETED: 'completed',
  STATUS_SHIPPED: 'shipped',
  STATUS_PROCESSING: 'processing',
  STATUS_PENDING: 'pending',

  // ========================================
  // Time & Performance (3)
  // ========================================
  TIME_DAYS: 'days',
  CHART_LEGEND_REVENUE: 'Revenue',
  CHART_LEGEND_ORDERS: 'Orders',

  // ========================================
  // Messages & Notifications (6)
  // ========================================
  MESSAGE_LOADING_STATS: 'Loading dashboard statistics...',
  MESSAGE_FAILED_LOAD: 'Failed to load dashboard statistics',
  MESSAGE_FAILED_LOAD_STATS: 'Failed to load statistics',
  MESSAGE_NO_STATS: 'No statistics available',
  MESSAGE_API_CONNECTIVITY: 'This might be due to API connectivity issues.',
  MESSAGE_SUCCESS: '✅ React + TypeScript + Modern Architecture is working perfectly!',

  // ========================================
  // Buttons & Actions (2)
  // ========================================
  BUTTON_RETRY: 'Retry',
  BUTTON_VIEW: 'View',

  // ========================================
  // Ecommerce Specific (15)
  // ========================================
  ECOMMERCE_CHART_TOTAL_SELLERS: 'Total Sellers',
  ECOMMERCE_CHART_ACTIVE_SELLERS: 'Active Sellers',
  ECOMMERCE_CHART_SALES: 'Sales',
  ECOMMERCE_CHART_PRODUCT: 'Product',
  ECOMMERCE_DATE: 'Date',
  ECOMMERCE_CATEGORY_ELECTRONICS: 'Electronics',
  ECOMMERCE_CATEGORY_CLOTHING: 'Clothing',
  ECOMMERCE_CATEGORY_HOME_GARDEN: 'Home & Garden',
  ECOMMERCE_CATEGORY_SPORTS: 'Sports',
  ECOMMERCE_CATEGORY_BOOKS: 'Books',
  ECOMMERCE_MONTH_JAN: 'Jan',
  ECOMMERCE_MONTH_FEB: 'Feb',
  ECOMMERCE_MONTH_MAR: 'Mar',
  ECOMMERCE_MONTH_APR: 'Apr',
  ECOMMERCE_MONTH_MAY: 'May',
  ECOMMERCE_MONTH_JUN: 'Jun',
} as const;

export type DashboardLabels = typeof dashboardLabels;
