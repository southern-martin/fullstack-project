import { useQuery } from '@tanstack/react-query';
import { ecommerceDashboardService } from '../services/ecommerceDashboardService';

// Query keys for ecommerce dashboard
export const ecommerceDashboardKeys = {
  all: ['ecommerce-dashboard'] as const,
  stats: () => [...ecommerceDashboardKeys.all, 'stats'] as const,
  salesData: (days?: number) =>
    [...ecommerceDashboardKeys.all, 'sales-data', days] as const,
  topProducts: (limit?: number) =>
    [...ecommerceDashboardKeys.all, 'top-products', limit] as const,
  sellerPerformance: (months?: number) =>
    [...ecommerceDashboardKeys.all, 'seller-performance', months] as const,
  revenueByCategory: () =>
    [...ecommerceDashboardKeys.all, 'revenue-by-category'] as const,
  recentOrders: (limit?: number) =>
    [...ecommerceDashboardKeys.all, 'recent-orders', limit] as const,
  dashboardData: () =>
    [...ecommerceDashboardKeys.all, 'dashboard-data'] as const,
};

// Hook to get ecommerce stats
export const useEcommerceStats = () => {
  return useQuery({
    queryKey: ecommerceDashboardKeys.stats(),
    queryFn: () => ecommerceDashboardService.getEcommerceStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// Hook to get sales data
export const useSalesData = (days: number = 7) => {
  return useQuery({
    queryKey: ecommerceDashboardKeys.salesData(days),
    queryFn: () => ecommerceDashboardService.getSalesData(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// Hook to get top products
export const useTopProducts = (limit: number = 5) => {
  return useQuery({
    queryKey: ecommerceDashboardKeys.topProducts(limit),
    queryFn: () => ecommerceDashboardService.getTopProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  });
};

// Hook to get seller performance
export const useSellerPerformance = (months: number = 6) => {
  return useQuery({
    queryKey: ecommerceDashboardKeys.sellerPerformance(months),
    queryFn: () => ecommerceDashboardService.getSellerPerformance(months),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  });
};

// Hook to get revenue by category
export const useRevenueByCategory = () => {
  return useQuery({
    queryKey: ecommerceDashboardKeys.revenueByCategory(),
    queryFn: () => ecommerceDashboardService.getRevenueByCategory(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  });
};

// Hook to get recent orders
export const useRecentOrders = (limit: number = 5) => {
  return useQuery({
    queryKey: ecommerceDashboardKeys.recentOrders(limit),
    queryFn: () => ecommerceDashboardService.getRecentOrders(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Hook to get all dashboard data at once
export const useEcommerceDashboardData = () => {
  return useQuery({
    queryKey: ecommerceDashboardKeys.dashboardData(),
    queryFn: () => ecommerceDashboardService.getDashboardData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};
