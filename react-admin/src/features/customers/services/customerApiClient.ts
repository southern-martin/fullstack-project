import { CUSTOMER_API_CONFIG } from '../../../config/api';

class CustomerApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = CUSTOMER_API_CONFIG.BASE_URL;
    this.defaultHeaders = CUSTOMER_API_CONFIG.HEADERS;
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
        console.error('Customer API request failed:', error);
      }
      throw error;
    }
  }

  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = `/customers${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    return this.request<any>(endpoint, { method: 'GET' });
  }

  async getCustomer(id: number): Promise<any> {
    return this.request<any>(`/customers/${id}`, { method: 'GET' });
  }

  async createCustomer(data: any): Promise<any> {
    return this.request<any>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: number, data: any): Promise<any> {
    return this.request<any>(`/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: number): Promise<any> {
    return this.request<any>(`/customers/${id}`, { method: 'DELETE' });
  }

  async getCustomerCount(): Promise<any> {
    return this.request<any>('/customers/count', { method: 'GET' });
  }

  async getCustomerAddresses(customerId: number): Promise<any> {
    return this.request<any>(`/customers/${customerId}/addresses`, {
      method: 'GET',
    });
  }

  async addCustomerAddress(customerId: number, data: any): Promise<any> {
    return this.request<any>(`/customers/${customerId}/addresses`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomerAddress(
    customerId: number,
    addressId: number,
    data: any
  ): Promise<any> {
    return this.request<any>(
      `/customers/${customerId}/addresses/${addressId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  async deleteCustomerAddress(
    customerId: number,
    addressId: number
  ): Promise<any> {
    return this.request<any>(
      `/customers/${customerId}/addresses/${addressId}`,
      { method: 'DELETE' }
    );
  }

  async healthCheck(): Promise<any> {
    return this.request<any>('/customers/health', { method: 'GET' });
  }
}

export const customerApiClient = new CustomerApiClient();
export default customerApiClient;
