import { apiClient } from '../../../shared/utils/api';

// Types for ecommerce dashboard data
export interface EcommerceStats {
  totalRevenue: number;
  totalOrders: number;
  totalSellers: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  sellersChange: number;
  customersChange: number;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  color: string;
}

export interface SellerPerformance {
  name: string;
  sellers: number;
  activeSellers: number;
}

export interface RevenueByCategory {
  name: string;
  value: number;
  color: string;
}

export interface RecentOrder {
  id: string;
  customer: string;
  seller: string;
  amount: number;
  status: 'completed' | 'shipped' | 'processing' | 'pending';
}

export interface EcommerceDashboardData {
  stats: EcommerceStats;
  salesData: SalesData[];
  topProducts: TopProduct[];
  sellerPerformance: SellerPerformance[];
  revenueByCategory: RevenueByCategory[];
  recentOrders: RecentOrder[];
}

class EcommerceDashboardService {
  private baseUrl = '/api/dashboard/ecommerce';

  async getEcommerceStats(): Promise<EcommerceStats> {
    try {
      const data = await apiClient.get<EcommerceStats>(`${this.baseUrl}/stats`);
      return data;
    } catch (error) {
      console.error('Error fetching ecommerce stats:', error);
      // Return mock data for development
      return {
        totalRevenue: 1250000,
        totalOrders: 15420,
        totalSellers: 245,
        totalCustomers: 12580,
        revenueChange: 12.5,
        ordersChange: 8.3,
        sellersChange: 15.2,
        customersChange: 6.7,
      };
    }
  }

  async getSalesData(days: number = 7): Promise<SalesData[]> {
    try {
      const data = await apiClient.get<SalesData[]>(`${this.baseUrl}/sales`);
      return data;
    } catch (error) {
      console.error('Error fetching sales data:', error);
      // Return mock data for development
      return [
        { date: '2024-01-01', sales: 2400, orders: 120, revenue: 48000 },
        { date: '2024-01-02', sales: 1398, orders: 98, revenue: 27960 },
        { date: '2024-01-03', sales: 9800, orders: 245, revenue: 196000 },
        { date: '2024-01-04', sales: 3908, orders: 156, revenue: 78160 },
        { date: '2024-01-05', sales: 4800, orders: 200, revenue: 96000 },
        { date: '2024-01-06', sales: 3800, orders: 158, revenue: 76000 },
        { date: '2024-01-07', sales: 4300, orders: 180, revenue: 86000 },
      ];
    }
  }

  async getTopProducts(limit: number = 5): Promise<TopProduct[]> {
    try {
      const data = await apiClient.get<TopProduct[]>(
        `${this.baseUrl}/top-products`
      );
      return data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      // Return mock data for development
      return [
        { name: 'Electronics', sales: 400, revenue: 120000, color: '#8884d8' },
        { name: 'Clothing', sales: 300, revenue: 90000, color: '#82ca9d' },
        { name: 'Home & Garden', sales: 200, revenue: 60000, color: '#ffc658' },
        { name: 'Sports', sales: 150, revenue: 45000, color: '#ff7300' },
        { name: 'Books', sales: 100, revenue: 30000, color: '#00ff00' },
      ];
    }
  }

  async getSellerPerformance(months: number = 6): Promise<SellerPerformance[]> {
    try {
      const data = await apiClient.get<SellerPerformance[]>(
        `${this.baseUrl}/seller-performance`
      );
      return data;
    } catch (error) {
      console.error('Error fetching seller performance:', error);
      // Return mock data for development
      return [
        { name: 'Jan', sellers: 45, activeSellers: 38 },
        { name: 'Feb', sellers: 52, activeSellers: 44 },
        { name: 'Mar', sellers: 48, activeSellers: 41 },
        { name: 'Apr', sellers: 61, activeSellers: 55 },
        { name: 'May', sellers: 55, activeSellers: 48 },
        { name: 'Jun', sellers: 67, activeSellers: 59 },
      ];
    }
  }

  async getRevenueByCategory(): Promise<RevenueByCategory[]> {
    try {
      const data = await apiClient.get<RevenueByCategory[]>(
        `${this.baseUrl}/revenue-by-category`
      );
      return data;
    } catch (error) {
      console.error('Error fetching revenue by category:', error);
      // Return mock data for development
      return [
        { name: 'Electronics', value: 35, color: '#8884d8' },
        { name: 'Clothing', value: 25, color: '#82ca9d' },
        { name: 'Home & Garden', value: 20, color: '#ffc658' },
        { name: 'Sports', value: 12, color: '#ff7300' },
        { name: 'Books', value: 8, color: '#00ff00' },
      ];
    }
  }

  async getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    try {
      const data = await apiClient.get<RecentOrder[]>(
        `${this.baseUrl}/recent-orders`
      );
      return data;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      // Return mock data for development
      return [
        {
          id: '#12345',
          customer: 'John Doe',
          seller: 'TechStore',
          amount: 299.99,
          status: 'completed',
        },
        {
          id: '#12346',
          customer: 'Jane Smith',
          seller: 'FashionHub',
          amount: 149.5,
          status: 'shipped',
        },
        {
          id: '#12347',
          customer: 'Bob Johnson',
          seller: 'HomeGoods',
          amount: 89.99,
          status: 'processing',
        },
        {
          id: '#12348',
          customer: 'Alice Brown',
          seller: 'SportsWorld',
          amount: 199.99,
          status: 'completed',
        },
        {
          id: '#12349',
          customer: 'Charlie Wilson',
          seller: 'BookStore',
          amount: 24.99,
          status: 'pending',
        },
      ];
    }
  }

  async getDashboardData(): Promise<EcommerceDashboardData> {
    try {
      const [
        stats,
        salesData,
        topProducts,
        sellerPerformance,
        revenueByCategory,
        recentOrders,
      ] = await Promise.all([
        this.getEcommerceStats(),
        this.getSalesData(),
        this.getTopProducts(),
        this.getSellerPerformance(),
        this.getRevenueByCategory(),
        this.getRecentOrders(),
      ]);

      return {
        stats,
        salesData,
        topProducts,
        sellerPerformance,
        revenueByCategory,
        recentOrders,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}

export const ecommerceDashboardService = new EcommerceDashboardService();
