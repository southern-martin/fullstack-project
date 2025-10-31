import { SELLER_API_CONFIG } from '../../../config/api';
import type {
  Seller,
  CreateSellerRequest,
  UpdateSellerProfileRequest,
  UpdateSellerBankingRequest,
  SellerAnalyticsOverview,
  SellerSalesTrend,
  SellerProductAnalytics,
  SellerRevenueAnalytics,
} from '../config/seller.types';

class SellerApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = SELLER_API_CONFIG.BASE_URL;
    this.defaultHeaders = SELLER_API_CONFIG.HEADERS;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    // Get current language from localStorage
    const currentLanguage =
      localStorage.getItem('current_language') ||
      localStorage.getItem('preferred_language') ||
      'en';

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        'Accept-Language': currentLanguage,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle validation errors (400 Bad Request)
        if (response.status === 400 && errorData.fieldErrors) {
          const validationError = new Error('Validation failed');
          (validationError as any).validationErrors = errorData.fieldErrors;
          (validationError as any).status = response.status;
          throw validationError;
        }

        // Handle custom rule errors (400 Bad Request)
        if (response.status === 400 && errorData.customRuleErrors) {
          const customRuleError = new Error('Custom rule validation failed');
          (customRuleError as any).customRuleErrors =
            errorData.customRuleErrors;
          (customRuleError as any).status = response.status;
          throw customRuleError;
        }

        // Handle other HTTP errors
        const errorMessage =
          errorData.message || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }

      const responseData = await response.json();
      // Unwrap the standardized API response format
      // Backend returns: { data: {...}, message: "Success", statusCode: 200, success: true }
      return responseData.data || responseData;
    } catch (error) {
      if (!(error as any).validationErrors && (error as any).status !== 404) {
        console.error('Seller API request failed:', error);
      }
      throw error;
    }
  }

  // CRUD Operations
  async getSellers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    verificationStatus?: string;
  }): Promise<{ items: Seller[]; total: number; page: number; limit: number; totalPages: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.verificationStatus) queryParams.append('verificationStatus', params.verificationStatus);

    return this.request<{ items: Seller[]; total: number; page: number; limit: number; totalPages: number }>(
      `/sellers?${queryParams.toString()}`
    );
  }

  async getSeller(id: number): Promise<Seller> {
    return this.request<Seller>(`/sellers/${id}`);
  }

  async getSellerByUserId(userId: number): Promise<Seller> {
    return this.request<Seller>(`/sellers/user/${userId}`);
  }

  async getPendingVerificationSellers(): Promise<Seller[]> {
    return this.request<Seller[]>('/sellers/pending-verification');
  }

  async getMySellerProfile(): Promise<Seller> {
    return this.request<Seller>('/sellers/me');
  }

  async createSeller(data: CreateSellerRequest): Promise<Seller> {
    return this.request<Seller>('/sellers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSellerProfile(id: number, data: UpdateSellerProfileRequest): Promise<Seller> {
    return this.request<Seller>(`/sellers/${id}/profile`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateSellerBanking(id: number, data: UpdateSellerBankingRequest): Promise<Seller> {
    return this.request<Seller>(`/sellers/${id}/banking`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateSeller(id: number, data: Partial<Seller>): Promise<Seller> {
    return this.request<Seller>(`/sellers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSeller(id: number): Promise<void> {
    return this.request<void>(`/sellers/${id}`, {
      method: 'DELETE',
    });
  }

  // Verification & Status Management
  async verifySeller(id: number): Promise<Seller> {
    return this.request<Seller>(`/sellers/${id}/verify`, {
      method: 'POST',
    });
  }

  async approveSeller(id: number, notes?: string): Promise<Seller> {
    return this.request<Seller>(`/sellers/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async rejectSeller(id: number, reason: string): Promise<Seller> {
    return this.request<Seller>(`/sellers/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async suspendSeller(id: number, reason: string): Promise<Seller> {
    return this.request<Seller>(`/sellers/${id}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async reactivateSeller(id: number): Promise<Seller> {
    return this.request<Seller>(`/sellers/${id}/reactivate`, {
      method: 'POST',
    });
  }

  // Analytics
  async getSellerAnalyticsOverview(id: number): Promise<SellerAnalyticsOverview> {
    return this.request<SellerAnalyticsOverview>(`/sellers/${id}/analytics/overview`);
  }

  async getSellerSalesTrend(
    id: number,
    params?: { startDate?: string; endDate?: string; interval?: 'day' | 'week' | 'month' }
  ): Promise<SellerSalesTrend[]> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.interval) queryParams.append('interval', params.interval);

    return this.request<SellerSalesTrend[]>(
      `/sellers/${id}/analytics/sales-trend?${queryParams.toString()}`
    );
  }

  async getSellerProductAnalytics(id: number, limit: number = 10): Promise<SellerProductAnalytics[]> {
    return this.request<SellerProductAnalytics[]>(
      `/sellers/${id}/analytics/products?limit=${limit}`
    );
  }

  async getSellerRevenueAnalytics(
    id: number,
    params?: { startDate?: string; endDate?: string; period?: 'day' | 'week' | 'month' }
  ): Promise<SellerRevenueAnalytics[]> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.period) queryParams.append('period', params.period);

    return this.request<SellerRevenueAnalytics[]>(
      `/sellers/${id}/analytics/revenue?${queryParams.toString()}`
    );
  }
}

export const sellerApiClient = new SellerApiClient();
