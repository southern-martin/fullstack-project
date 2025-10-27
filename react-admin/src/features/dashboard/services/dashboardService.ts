import { User } from '../../../shared/types';
import { carrierApiClient } from '../../carriers/services/carrierApiClient';
import { customerApiClient } from '../../customers/services/customerApiClient';
import { userApiService } from '../../users/services/userApiService';

export interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalCarriers: number;
  activeUsers: number;
  recentUsers: User[];
  systemHealth: {
    status: 'healthy' | 'warning' | 'error';
    uptime: string;
    lastCheck: string;
  };
}

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      console.log('DashboardService: Starting to fetch dashboard stats...');

      // Fetch data from multiple services in parallel with error handling
      const [usersResponse, customersResponse, carriersResponse] =
        await Promise.allSettled([
          userApiService.getUsers({ page: 1, limit: 1 }),
          customerApiClient.getCustomers({ page: 1, limit: 1 }),
          carrierApiClient.getCarriers({ page: 1, limit: 1 }),
        ]);

      console.log('DashboardService: API responses received:', {
        users: usersResponse,
        customers: customersResponse,
        carriers: carriersResponse,
      });

      // Extract data from settled promises with safe navigation
      // Note: userApiService.getUsers() already returns PaginatedResponse<User> with {data, total, page, limit, totalPages}
      // customerApiClient and carrierApiClient return standardized API responses with {data: {items, total}, ...}
      const usersData =
        usersResponse.status === 'fulfilled' && usersResponse.value
          ? usersResponse.value
          : { total: 0, data: [] };
      const customersData =
        customersResponse.status === 'fulfilled' &&
        customersResponse.value?.data
          ? customersResponse.value.data
          : { total: 0 };
      const carriersData =
        carriersResponse.status === 'fulfilled' && carriersResponse.value?.data
          ? carriersResponse.value.data
          : { total: 0 };

      // Get recent users with error handling
      let recentUsersData: User[] = [];
      try {
        const recentUsersResponse = await userApiService.getUsers({
          page: 1,
          limit: 5,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });
        recentUsersData = recentUsersResponse.data || [];
      } catch (error) {
        console.warn('Failed to fetch recent users:', error);
        recentUsersData = [];
      }

      return {
        totalUsers: usersData.total || 0,
        totalCustomers: customersData.total || 0,
        totalCarriers: carriersData.total || 0,
        activeUsers: usersData.total || 0, // Use total users as active users for now
        recentUsers: recentUsersData,
        systemHealth: {
          status: 'healthy',
          uptime: this.calculateUptime(),
          lastCheck: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats in case of error
      return {
        totalUsers: 0,
        totalCustomers: 0,
        totalCarriers: 0,
        activeUsers: 0,
        recentUsers: [],
        systemHealth: {
          status: 'error',
          uptime: '0h 0m',
          lastCheck: new Date().toISOString(),
        },
      };
    }
  }

  private calculateUptime(): string {
    // This is a mock calculation - in a real app, you'd track actual uptime
    const startTime = new Date('2024-01-01T00:00:00Z');
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
}

export const dashboardService = new DashboardService();
