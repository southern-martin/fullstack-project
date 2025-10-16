import { apiClient } from '../../../shared/utils/api';
import { CARRIERS_API_CONFIG } from '../config/carriersApi';

export interface Carrier {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: {
    code?: string;
    website?: string;
    coverage?: string[];
    trackingUrl?: string;
    serviceTypes?: string[];
    pricing?: {
      baseRate?: number;
      perKgRate?: number;
      currency?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarrierDto {
  name: string;
  description?: string;
  isActive?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: {
    code?: string;
    website?: string;
    coverage?: string[];
    trackingUrl?: string;
    serviceTypes?: string[];
    pricing?: {
      baseRate?: number;
      perKgRate?: number;
      currency?: string;
    };
  };
}

export interface UpdateCarrierDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: {
    code?: string;
    website?: string;
    coverage?: string[];
    trackingUrl?: string;
    serviceTypes?: string[];
    pricing?: {
      baseRate?: number;
      perKgRate?: number;
      currency?: string;
    };
  };
}

export interface PaginatedResponse<T> {
  carriers: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CarrierService {
  async getCarriers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Carrier>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);

      const endpoint = `${CARRIERS_API_CONFIG.ENDPOINTS.LIST}${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      const response = await apiClient.get<PaginatedResponse<Carrier>>(
        endpoint
      );
      return response;
    } catch (error) {
      console.error('Error fetching carriers:', error);
      throw error;
    }
  }

  async getCarrier(id: number): Promise<Carrier> {
    try {
      const response = await apiClient.get<Carrier>(
        CARRIERS_API_CONFIG.ENDPOINTS.UPDATE(id)
      );
      return response;
    } catch (error) {
      console.error(`Error fetching carrier ${id}:`, error);
      throw error;
    }
  }

  async createCarrier(data: CreateCarrierDto): Promise<Carrier> {
    try {
      const response = await apiClient.post<Carrier>(
        CARRIERS_API_CONFIG.ENDPOINTS.CREATE,
        data
      );
      return response;
    } catch (error) {
      console.error('Error creating carrier:', error);
      throw error;
    }
  }

  async updateCarrier(id: number, data: UpdateCarrierDto): Promise<Carrier> {
    try {
      const response = await apiClient.patch<Carrier>(
        CARRIERS_API_CONFIG.ENDPOINTS.UPDATE(id),
        data
      );
      return response;
    } catch (error) {
      console.error(`Error updating carrier ${id}:`, error);
      throw error;
    }
  }

  async deleteCarrier(id: number): Promise<void> {
    try {
      await apiClient.delete(CARRIERS_API_CONFIG.ENDPOINTS.DELETE(id));
    } catch (error) {
      console.error(`Error deleting carrier ${id}:`, error);
      throw error;
    }
  }

  async getCarrierCount(): Promise<{ count: number }> {
    try {
      const response = await apiClient.get<{ count: number }>(
        '/carriers/count'
      );
      return response;
    } catch (error) {
      console.error('Error fetching carrier count:', error);
      throw error;
    }
  }

  async getActiveCarriers(): Promise<Carrier[]> {
    try {
      const response = await apiClient.get<Carrier[]>(
        CARRIERS_API_CONFIG.ENDPOINTS.ACTIVE
      );
      return response;
    } catch (error) {
      console.error('Error fetching active carriers:', error);
      throw error;
    }
  }

  async getCarrierByName(name: string): Promise<Carrier> {
    try {
      const response = await apiClient.get<Carrier>(
        `/carriers/name/${encodeURIComponent(name)}`
      );
      return response;
    } catch (error) {
      console.error(`Error fetching carrier by name ${name}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await apiClient.get('/health');
      return true;
    } catch (error) {
      console.error('Carrier service health check failed:', error);
      return false;
    }
  }
}

export const carrierService = new CarrierService();
export default carrierService;
