import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { PRICING_API_CONFIG } from '../../config/api';

// Pricing API Client
class PricingApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: PRICING_API_CONFIG.BASE_URL,
      timeout: PRICING_API_CONFIG.TIMEOUT,
      headers: PRICING_API_CONFIG.HEADERS,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Pricing Rules Management
  async getPricingRules(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AxiosResponse<any>> {
    return this.client.get('/pricing/rules', { params });
  }

  async getPricingRule(id: number): Promise<AxiosResponse<any>> {
    return this.client.get(`/pricing/rules/${id}`);
  }

  async createPricingRule(data: any): Promise<AxiosResponse<any>> {
    return this.client.post('/pricing/rules', data);
  }

  async updatePricingRule(id: number, data: any): Promise<AxiosResponse<any>> {
    return this.client.patch(`/pricing/rules/${id}`, data);
  }

  async deletePricingRule(id: number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/pricing/rules/${id}`);
  }

  async getPricingRuleCount(): Promise<AxiosResponse<any>> {
    return this.client.get('/pricing/rules/count');
  }

  // Price Calculation
  async calculatePrice(data: {
    carrierId: number;
    serviceType: string;
    weight: number;
    distance?: number;
    originCountry: string;
    destinationCountry: string;
    customerType?: string;
    customerId?: number;
  }): Promise<AxiosResponse<any>> {
    return this.client.post('/pricing/calculate', data);
  }

  // Price Calculation History
  async getPriceCalculationHistory(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AxiosResponse<any>> {
    return this.client.get('/pricing/calculations', { params });
  }

  async getPriceCalculationCount(): Promise<AxiosResponse<any>> {
    return this.client.get('/pricing/calculations/count');
  }

  // Health check
  async healthCheck(): Promise<AxiosResponse<any>> {
    return this.client.get('/health');
  }
}

// Export singleton instance
export const pricingApiClient = new PricingApiClient();
export default pricingApiClient;
