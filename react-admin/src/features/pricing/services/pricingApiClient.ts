import { PRICING_API_CONFIG } from '../../../config/api';

class PricingApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = PRICING_API_CONFIG.BASE_URL;
    this.defaultHeaders = PRICING_API_CONFIG.HEADERS;
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

      const data = await response.json();
      return data;
    } catch (error) {
      // Don't log connection errors (service not running) or validation errors or 404s
      const isConnectionError = error instanceof TypeError && error.message.includes('fetch');
      if (!isConnectionError && !(error as any).validationErrors && (error as any).status !== 404) {
        console.error('Pricing API request failed:', error);
      }
      throw error;
    }
  }

  async getPricingRules(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = `/pricing-rules${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    return this.request<any>(endpoint, { method: 'GET' });
  }

  async getPricingRule(id: number): Promise<any> {
    return this.request<any>(`/pricing-rules/${id}`, { method: 'GET' });
  }

  async createPricingRule(data: any): Promise<any> {
    return this.request<any>('/pricing-rules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePricingRule(id: number, data: any): Promise<any> {
    return this.request<any>(`/pricing-rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePricingRule(id: number): Promise<any> {
    return this.request<any>(`/pricing-rules/${id}`, { method: 'DELETE' });
  }

  async getPricingRuleCount(): Promise<any> {
    return this.request<any>('/pricing-rules/count', { method: 'GET' });
  }

  async calculatePrice(data: any): Promise<any> {
    return this.request<any>('/pricing/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPriceCalculationHistory(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = `/price-calculations${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    return this.request<any>(endpoint, { method: 'GET' });
  }

  async getPriceCalculationCount(): Promise<any> {
    return this.request<any>('/price-calculations/count', { method: 'GET' });
  }

  async healthCheck(): Promise<any> {
    return this.request<any>('/health', { method: 'GET' });
  }
}

export const pricingApiClient = new PricingApiClient();
export default pricingApiClient;
