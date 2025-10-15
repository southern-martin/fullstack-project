// Enterprise-grade service layer for API communication

import { 
  ApiResponse, 
  QueryParams, 
  User, 
  Product, 
  Order, 
  Customer,
  PaginationMeta 
} from '../types';
import { 
  IBaseService, 
  IUserService, 
  IProductService, 
  IOrderService, 
  ICustomerService 
} from '../interfaces';
import { API_CONFIG } from '../constants';

// Base HTTP client for enterprise-grade API communication
class HttpClient {
  private baseURL: string;
  private timeout: number;
  private retries: number;
  private retryDelay: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retries = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.retries) {
          await this.delay(this.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
    const url = params ? this.buildUrlWithParams(endpoint, params) : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  private buildUrlWithParams(endpoint: string, params: QueryParams): string {
    const url = new URL(endpoint, this.baseURL);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, String(v)));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });

    return url.pathname + url.search;
  }
}

// Create singleton HTTP client instance
const httpClient = new HttpClient();

// Base service implementation
abstract class BaseService<T> implements IBaseService<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(params?: QueryParams): Promise<ApiResponse<T[]>> {
    return httpClient.get<T[]>(this.endpoint, params);
  }

  async getById(id: string | number): Promise<ApiResponse<T>> {
    return httpClient.get<T>(`${this.endpoint}/${id}`);
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    return httpClient.post<T>(this.endpoint, data);
  }

  async update(id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
    return httpClient.put<T>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string | number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`${this.endpoint}/${id}`);
  }

  async search(query: string, params?: QueryParams): Promise<ApiResponse<T[]>> {
    const searchParams = { ...params, search: query };
    return httpClient.get<T[]>(`${this.endpoint}/search`, searchParams);
  }
}

// User service implementation
class UserService extends BaseService<User> implements IUserService {
  constructor() {
    super(API_CONFIG.ENDPOINTS.USERS.BASE);
  }

  async getByEmail(email: string): Promise<ApiResponse<User>> {
    return httpClient.get<User>(`${this.endpoint}/email/${email}`);
  }

  async updatePassword(id: string | number, password: string): Promise<ApiResponse<void>> {
    return httpClient.patch<void>(`${this.endpoint}/${id}/password`, { password });
  }

  async updatePermissions(id: string | number, permissions: string[]): Promise<ApiResponse<void>> {
    return httpClient.patch<void>(`${this.endpoint}/${id}/permissions`, { permissions });
  }

  async getAuditLogs(id: string | number): Promise<ApiResponse<any[]>> {
    return httpClient.get<any[]>(`${this.endpoint}/${id}/audit-logs`);
  }
}

// Product service implementation
class ProductService extends BaseService<Product> implements IProductService {
  constructor() {
    super(API_CONFIG.ENDPOINTS.PRODUCTS.BASE);
  }

  async getByCategory(categoryId: string): Promise<ApiResponse<Product[]>> {
    return httpClient.get<Product[]>(`${this.endpoint}/category/${categoryId}`);
  }

  async getByStatus(status: string): Promise<ApiResponse<Product[]>> {
    return httpClient.get<Product[]>(`${this.endpoint}/status/${status}`);
  }

  async updateStock(id: string | number, quantity: number): Promise<ApiResponse<Product>> {
    return httpClient.patch<Product>(`${this.endpoint}/${id}/stock`, { quantity });
  }

  async getLowStock(threshold: number = 10): Promise<ApiResponse<Product[]>> {
    return httpClient.get<Product[]>(`${this.endpoint}/low-stock`, { threshold });
  }

  async bulkUpdate(products: Partial<Product>[]): Promise<ApiResponse<Product[]>> {
    return httpClient.post<Product[]>(`${this.endpoint}/bulk-update`, { products });
  }
}

// Order service implementation
class OrderService extends BaseService<Order> implements IOrderService {
  constructor() {
    super(API_CONFIG.ENDPOINTS.ORDERS.BASE);
  }

  async getByCustomer(customerId: string): Promise<ApiResponse<Order[]>> {
    return httpClient.get<Order[]>(`${this.endpoint}/customer/${customerId}`);
  }

  async getByStatus(status: string): Promise<ApiResponse<Order[]>> {
    return httpClient.get<Order[]>(`${this.endpoint}/status/${status}`);
  }

  async updateStatus(id: string | number, status: string): Promise<ApiResponse<Order>> {
    return httpClient.patch<Order>(`${this.endpoint}/${id}/status`, { status });
  }

  async getRevenueStats(period: string): Promise<ApiResponse<any>> {
    return httpClient.get<any>(`${this.endpoint}/revenue-stats`, { period });
  }

  async exportOrders(filters: any): Promise<Blob> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${this.endpoint}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...httpClient['getAuthHeaders'](),
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error('Failed to export orders');
    }

    return response.blob();
  }
}

// Customer service implementation
class CustomerService extends BaseService<Customer> implements ICustomerService {
  constructor() {
    super(API_CONFIG.ENDPOINTS.CUSTOMERS.BASE);
  }

  async getByEmail(email: string): Promise<ApiResponse<Customer>> {
    return httpClient.get<Customer>(`${this.endpoint}/email/${email}`);
  }

  async getLoyaltyStats(customerId: string): Promise<ApiResponse<any>> {
    return httpClient.get<any>(`${this.endpoint}/${customerId}/loyalty-stats`);
  }

  async updatePreferences(customerId: string, preferences: any): Promise<ApiResponse<Customer>> {
    return httpClient.patch<Customer>(`${this.endpoint}/${customerId}/preferences`, preferences);
  }

  async getOrderHistory(customerId: string): Promise<ApiResponse<Order[]>> {
    return httpClient.get<Order[]>(`${this.endpoint}/${customerId}/orders`);
  }
}

// Analytics service
class AnalyticsService {
  private endpoint = API_CONFIG.ENDPOINTS.ANALYTICS.DASHBOARD;

  async getDashboardStats(): Promise<ApiResponse<any>> {
    return httpClient.get<any>(this.endpoint);
  }

  async getReports(type: string, filters: any): Promise<ApiResponse<any>> {
    return httpClient.get<any>(`${this.endpoint}/reports/${type}`, filters);
  }

  async exportReport(type: string, filters: any): Promise<Blob> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${this.endpoint}/export/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...httpClient['getAuthHeaders'](),
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error('Failed to export report');
    }

    return response.blob();
  }
}

// Notification service
class NotificationService {
  private endpoint = API_CONFIG.ENDPOINTS.NOTIFICATIONS.BASE;

  async getAll(params?: QueryParams): Promise<ApiResponse<any[]>> {
    return httpClient.get<any[]>(this.endpoint, params);
  }

  async markAsRead(id: string): Promise<ApiResponse<void>> {
    return httpClient.patch<void>(`${this.endpoint}/${id}/read`);
  }

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return httpClient.patch<void>(`${this.endpoint}/mark-all-read`);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`${this.endpoint}/${id}`);
  }
}

// Authentication service
class AuthService {
  private endpoint = API_CONFIG.ENDPOINTS.AUTH;

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return httpClient.post<{ user: User; token: string }>(this.endpoint.LOGIN, {
      email,
      password,
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return httpClient.post<void>(this.endpoint.LOGOUT);
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return httpClient.post<{ token: string }>(this.endpoint.REFRESH);
  }

  async register(userData: Partial<User>): Promise<ApiResponse<{ user: User; token: string }>> {
    return httpClient.post<{ user: User; token: string }>(this.endpoint.REGISTER, userData);
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return httpClient.post<void>(this.endpoint.FORGOT_PASSWORD, { email });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    return httpClient.post<void>(this.endpoint.RESET_PASSWORD, { token, password });
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return httpClient.post<void>(this.endpoint.VERIFY_EMAIL, { token });
  }
}

// Create service instances
export const userService = new UserService();
export const productService = new ProductService();
export const orderService = new OrderService();
export const customerService = new CustomerService();
export const analyticsService = new AnalyticsService();
export const notificationService = new NotificationService();
export const authService = new AuthService();

// Export all services
export default {
  userService,
  productService,
  orderService,
  customerService,
  analyticsService,
  notificationService,
  authService,
  httpClient,
};
