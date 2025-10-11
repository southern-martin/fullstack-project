import { PaginatedResponse, PaginationParams } from '../../../shared/types';
import { apiClient } from '../../../shared/utils/api';
import { CUSTOMERS_API_CONFIG } from '../config/customersApi';

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    company?: string;
    industry?: string;
    preferredContact?: string;
    newsletter?: boolean;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    company?: string;
    industry?: string;
    preferredContact?: string;
    newsletter?: boolean;
  };
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    company?: string;
    industry?: string;
    preferredContact?: string;
    newsletter?: boolean;
  };
  isActive?: boolean;
}

class CustomerApiService {
  private readonly basePath = CUSTOMERS_API_CONFIG.ENDPOINTS.LIST;

  async getCustomers(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Customer>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = queryParams.toString()
      ? `${this.basePath}?${queryParams}`
      : this.basePath;
    return apiClient.get<PaginatedResponse<Customer>>(url);
  }

  async getCustomerById(id: number): Promise<Customer> {
    return apiClient.get<Customer>(`${this.basePath}/${id}`);
  }

  async getCustomerByEmail(email: string): Promise<Customer> {
    return apiClient.get<Customer>(
      CUSTOMERS_API_CONFIG.ENDPOINTS.BY_EMAIL(email)
    );
  }

  async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    return apiClient.post<Customer>(
      CUSTOMERS_API_CONFIG.ENDPOINTS.CREATE,
      customerData
    );
  }

  async updateCustomer(
    id: number,
    customerData: UpdateCustomerRequest
  ): Promise<Customer> {
    return apiClient.patch<Customer>(
      CUSTOMERS_API_CONFIG.ENDPOINTS.UPDATE(id),
      customerData
    );
  }

  async deleteCustomer(id: number): Promise<void> {
    return apiClient.delete<void>(CUSTOMERS_API_CONFIG.ENDPOINTS.DELETE(id));
  }

  async getActiveCustomers(): Promise<Customer[]> {
    return apiClient.get<Customer[]>(CUSTOMERS_API_CONFIG.ENDPOINTS.ACTIVE);
  }
}

export const customerApiService = new CustomerApiService();
