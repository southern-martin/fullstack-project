import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CARRIER_API_CONFIG } from '../../config/api';

// Carrier API Client
class CarrierApiClient {
  private client: AxiosInstance;

  constructor() {
    try {
      console.log('CarrierApiClient constructor called');
      console.log('CARRIER_API_CONFIG:', CARRIER_API_CONFIG);
      this.client = axios.create({
        baseURL: CARRIER_API_CONFIG.BASE_URL,
        timeout: CARRIER_API_CONFIG.TIMEOUT,
        headers: CARRIER_API_CONFIG.HEADERS,
      });

      this.setupInterceptors();
      console.log('CarrierApiClient initialized successfully');
    } catch (error) {
      console.error('Error initializing CarrierApiClient:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
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

  // Carrier CRUD operations
  async getCarriers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AxiosResponse<any>> {
    return this.client.get('/carriers', { params });
  }

  async getCarrier(id: number): Promise<AxiosResponse<any>> {
    return this.client.get(`/carriers/${id}`);
  }

  async createCarrier(data: any): Promise<AxiosResponse<any>> {
    return this.client.post('/carriers', data);
  }

  async updateCarrier(id: number, data: any): Promise<AxiosResponse<any>> {
    return this.client.patch(`/carriers/${id}`, data);
  }

  async deleteCarrier(id: number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/carriers/${id}`);
  }

  async getCarrierCount(): Promise<AxiosResponse<any>> {
    return this.client.get('/carriers/count');
  }

  async getActiveCarriers(): Promise<AxiosResponse<any>> {
    return this.client.get('/carriers/active');
  }

  async getCarrierByName(name: string): Promise<AxiosResponse<any>> {
    return this.client.get(`/carriers/name/${encodeURIComponent(name)}`);
  }

  // Health check
  async healthCheck(): Promise<AxiosResponse<any>> {
    return this.client.get('/health');
  }
}

// Export singleton instance
export const carrierApiClient = new CarrierApiClient();
export default carrierApiClient;
