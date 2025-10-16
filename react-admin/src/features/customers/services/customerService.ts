import { PaginatedResponse } from '../../../shared/types';
import { apiClient } from '../../../shared/utils/api';

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  isActive: boolean;
  addresses?: CustomerAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id: number;
  customerId: number;
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  isActive?: boolean;
}

export interface UpdateCustomerDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  isActive?: boolean;
}

export interface CreateAddressDto {
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto {
  type?: 'billing' | 'shipping';
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
}

// Using shared PaginatedResponse interface

class CustomerService {
  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Customer>> {
    try {
      const response = await apiClient.getCustomers(params);
      // Transform the API response to match shared PaginatedResponse format
      return {
        data: response.data.customers,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomer(id: number): Promise<Customer> {
    try {
      const response = await apiClient.getCustomer(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  }

  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    try {
      const response = await apiClient.createCustomer(data);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async updateCustomer(id: number, data: UpdateCustomerDto): Promise<Customer> {
    try {
      const response = await apiClient.updateCustomer(id, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  }

  async deleteCustomer(id: number): Promise<void> {
    try {
      await apiClient.deleteCustomer(id);
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  }

  async getCustomerCount(): Promise<{ count: number }> {
    try {
      const response = await apiClient.getCustomerCount();
      return response.data;
    } catch (error) {
      console.error('Error fetching customer count:', error);
      throw error;
    }
  }

  // Address operations
  async getCustomerAddresses(customerId: number): Promise<CustomerAddress[]> {
    try {
      const response = await apiClient.getCustomerAddresses(customerId);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching addresses for customer ${customerId}:`,
        error
      );
      throw error;
    }
  }

  async addCustomerAddress(
    customerId: number,
    data: CreateAddressDto
  ): Promise<CustomerAddress> {
    try {
      const response = await apiClient.addCustomerAddress(customerId, data);
      return response.data;
    } catch (error) {
      console.error(`Error adding address for customer ${customerId}:`, error);
      throw error;
    }
  }

  async updateCustomerAddress(
    customerId: number,
    addressId: number,
    data: UpdateAddressDto
  ): Promise<CustomerAddress> {
    try {
      const response = await apiClient.updateCustomerAddress(
        customerId,
        addressId,
        data
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating address ${addressId} for customer ${customerId}:`,
        error
      );
      throw error;
    }
  }

  async deleteCustomerAddress(
    customerId: number,
    addressId: number
  ): Promise<void> {
    try {
      await apiClient.deleteCustomerAddress(customerId, addressId);
    } catch (error) {
      console.error(
        `Error deleting address ${addressId} for customer ${customerId}:`,
        error
      );
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await apiClient.healthCheck();
      return true;
    } catch (error) {
      console.error('Customer service health check failed:', error);
      return false;
    }
  }
}

export const customerService = new CustomerService();
export default customerService;
