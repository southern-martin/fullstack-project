import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CUSTOMER_API_CONFIG } from '../../config/api';

// Customer API Client
class CustomerApiClient {
  private client: AxiosInstance;

  constructor() {
    try {
      console.log('CustomerApiClient constructor called');
      console.log('CUSTOMER_API_CONFIG:', CUSTOMER_API_CONFIG);
      this.client = axios.create({
        baseURL: CUSTOMER_API_CONFIG.BASE_URL,
        timeout: CUSTOMER_API_CONFIG.TIMEOUT,
        headers: CUSTOMER_API_CONFIG.HEADERS,
      });

      this.setupInterceptors();
      console.log('CustomerApiClient initialized successfully');
    } catch (error) {
      console.error('Error initializing CustomerApiClient:', error);
      console.error('Error stack:', error.stack);
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

  // Customer CRUD operations
  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AxiosResponse<any>> {
    return this.client.get('/customers', { params });
  }

  async getCustomer(id: number): Promise<AxiosResponse<any>> {
    return this.client.get(`/customers/${id}`);
  }

  async createCustomer(data: any): Promise<AxiosResponse<any>> {
    return this.client.post('/customers', data);
  }

  async updateCustomer(id: number, data: any): Promise<AxiosResponse<any>> {
    return this.client.patch(`/customers/${id}`, data);
  }

  async deleteCustomer(id: number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/customers/${id}`);
  }

  async getCustomerCount(): Promise<AxiosResponse<any>> {
    return this.client.get('/customers/count');
  }

  // Address operations
  async getCustomerAddresses(customerId: number): Promise<AxiosResponse<any>> {
    return this.client.get(`/customers/${customerId}/addresses`);
  }

  async addCustomerAddress(
    customerId: number,
    data: any
  ): Promise<AxiosResponse<any>> {
    return this.client.post(`/customers/${customerId}/addresses`, data);
  }

  async updateCustomerAddress(
    customerId: number,
    addressId: number,
    data: any
  ): Promise<AxiosResponse<any>> {
    return this.client.patch(
      `/customers/${customerId}/addresses/${addressId}`,
      data
    );
  }

  async deleteCustomerAddress(
    customerId: number,
    addressId: number
  ): Promise<AxiosResponse<any>> {
    return this.client.delete(
      `/customers/${customerId}/addresses/${addressId}`
    );
  }

  // Health check
  async healthCheck(): Promise<AxiosResponse<any>> {
    return this.client.get('/health');
  }
}

// Export singleton instance
export const customerApiClient = new CustomerApiClient();
export default customerApiClient;
