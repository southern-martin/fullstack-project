/**
 * Dashboard Module Translation Labels
 * 
 * This file contains all static UI labels used in the Dashboard module.
 * Labels are organized by category for better maintainability.
 * 
 * Usage with useDashboardLabels hook:
 * const { L } = useDashboardLabels();
 * <h1>{L.page.title}</h1>
 */

export interface DashboardLabels {
  // Page Header
  page: {
    title: string;
    welcome: string;
    subtitle: string;
    ecommerceTitle: string;
    ecommerceSubtitle: string;
    adminDashboardTitle: string;
  };

  // Buttons & Actions
  buttons: {
    adminDashboard: string;
    ecommerceDashboard: string;
    retry: string;
    view: string;
  };

  // Navigation Cards
  cards: {
    usersTitle: string;
    usersDescription: string;
    usersButton: string;
    customersTitle: string;
    customersDescription: string;
    customersButton: string;
    carriersTitle: string;
    carriersDescription: string;
    carriersButton: string;
    analyticsTitle: string;
    analyticsDescription: string;
    analyticsButton: string;
    settingsTitle: string;
    settingsDescription: string;
    settingsButton: string;
  };

  // Stats & Metrics
  stats: {
    total: string;
    totalUsers: string;
    totalCustomers: string;
    totalCarriers: string;
    systemStatus: string;
    uptime: string;
    vsLastMonth: string;
    reports: string;
    config: string;
    totalRevenue: string;
    totalOrders: string;
    activeSellers: string;
    avgDeliveryTime: string;
    conversionRate: string;
    avgOrderValue: string;
  };

  // Charts
  charts: {
    salesTrend: string;
    ordersTrend: string;
    topProducts: string;
    revenueByCategory: string;
    sellerPerformance: string;
    recentOrders: string;
    revenue: string;
    orders: string;
    totalSellers: string;
    activeSellers: string;
    sales: string;
    product: string;
  };

  // System Status
  system: {
    overview: string;
    recentUsers: string;
    statusHealthy: string;
    statusWarning: string;
    statusCritical: string;
    lastUpdated: string;
  };

  // Table
  table: {
    name: string;
    email: string;
    status: string;
    created: string;
  };

  // Status Values
  status: {
    active: string;
    inactive: string;
    completed: string;
    shipped: string;
    processing: string;
    pending: string;
  };

  // Time & Performance
  time: {
    days: string;
  };

  // Toast Messages
  messages: {
    loadingStats: string;
    failedLoad: string;
    failedLoadStats: string;
    noStats: string;
    apiConnectivity: string;
    success: string;
  };

  // Ecommerce Specific
  ecommerce: {
    date: string;
    categoryElectronics: string;
    categoryClothing: string;
    categoryHomeGarden: string;
    categorySports: string;
    categoryBooks: string;
    monthJan: string;
    monthFeb: string;
    monthMar: string;
    monthApr: string;
    monthMay: string;
    monthJun: string;
  };
}

/**
 * Default English labels for the Dashboard module
 */
export const dashboardLabels: DashboardLabels = {
  page: {
    title: 'Dashboard',
    welcome: 'Welcome back',
    subtitle: 'Manage your application with ease',
    ecommerceTitle: 'Ecommerce Dashboard',
    ecommerceSubtitle: 'Multi-seller platform analytics and insights',
    adminDashboardTitle: '🚀 React Admin Dashboard',
  },

  buttons: {
    adminDashboard: 'Admin Dashboard',
    ecommerceDashboard: 'Ecommerce Dashboard',
    retry: 'Retry',
    view: 'View',
  },

  cards: {
    usersTitle: 'Users',
    usersDescription: 'Manage user accounts and permissions',
    usersButton: 'View Users',
    customersTitle: 'Customers',
    customersDescription: 'Manage customer accounts and information',
    customersButton: 'View Customers',
    carriersTitle: 'Carriers',
    carriersDescription: 'Manage shipping carriers and logistics',
    carriersButton: 'View Carriers',
    analyticsTitle: 'Analytics',
    analyticsDescription: 'View system analytics and reports',
    analyticsButton: 'View Analytics',
    settingsTitle: 'Settings',
    settingsDescription: 'Configure system settings',
    settingsButton: 'View Settings',
  },

  stats: {
    total: 'Total',
    totalUsers: 'Total Users',
    totalCustomers: 'Total Customers',
    totalCarriers: 'Total Carriers',
    systemStatus: 'System Status',
    uptime: 'Uptime',
    vsLastMonth: 'vs last month',
    reports: 'Reports',
    config: 'Config',
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    activeSellers: 'Active Sellers',
    avgDeliveryTime: 'Avg. Delivery Time',
    conversionRate: 'Conversion Rate',
    avgOrderValue: 'Avg. Order Value',
  },

  charts: {
    salesTrend: 'Sales Trend',
    ordersTrend: 'Orders Trend',
    topProducts: 'Top Selling Products',
    revenueByCategory: 'Revenue by Category',
    sellerPerformance: 'Seller Performance',
    recentOrders: 'Recent Orders',
    revenue: 'Revenue',
    orders: 'Orders',
    totalSellers: 'Total Sellers',
    activeSellers: 'Active Sellers',
    sales: 'Sales',
    product: 'Product',
  },

  system: {
    overview: 'System Overview',
    recentUsers: 'Recent Users',
    statusHealthy: 'healthy',
    statusWarning: 'warning',
    statusCritical: 'critical',
    lastUpdated: 'Last updated',
  },

  table: {
    name: 'Name',
    email: 'Email',
    status: 'Status',
    created: 'Created',
  },

  status: {
    active: 'Active',
    inactive: 'Inactive',
    completed: 'completed',
    shipped: 'shipped',
    processing: 'processing',
    pending: 'pending',
  },

  time: {
    days: 'days',
  },

  messages: {
    loadingStats: 'Loading dashboard statistics...',
    failedLoad: 'Failed to load dashboard statistics',
    failedLoadStats: 'Failed to load statistics',
    noStats: 'No statistics available',
    apiConnectivity: 'This might be due to API connectivity issues.',
    success: '✅ React + TypeScript + Modern Architecture is working perfectly!',
  },

  ecommerce: {
    date: 'Date',
    categoryElectronics: 'Electronics',
    categoryClothing: 'Clothing',
    categoryHomeGarden: 'Home & Garden',
    categorySports: 'Sports',
    categoryBooks: 'Books',
    monthJan: 'Jan',
    monthFeb: 'Feb',
    monthMar: 'Mar',
    monthApr: 'Apr',
    monthMay: 'May',
    monthJun: 'Jun',
  },
};
