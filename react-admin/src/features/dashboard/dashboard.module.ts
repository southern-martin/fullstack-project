// Dashboard module exports
export { default as Dashboard } from './components/Dashboard';
export { default as EcommerceDashboard } from './components/EcommerceDashboard';

// Services
export { dashboardService } from './services/dashboardService';
export { ecommerceDashboardService } from './services/ecommerceDashboardService';

// Hooks
export * from './hooks/useEcommerceDashboardQueries';

// Types
export type { DashboardStats } from './services/dashboardService';
export type {
  EcommerceDashboardData,
  EcommerceStats,
  RecentOrder,
  RevenueByCategory,
  SalesData,
  SellerPerformance,
  TopProduct,
} from './services/ecommerceDashboardService';
