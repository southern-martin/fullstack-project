import { carrierApiClient } from './carrierApiClient';

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
      const response = await carrierApiClient.getCarriers(params);
      return response;
    } catch (error) {
      console.error('Error fetching carriers:', error);
      throw error;
    }
  }

  async getCarrier(id: number): Promise<Carrier> {
    try {
      const response = await carrierApiClient.getCarrier(id);
      return response;
    } catch (error) {
      console.error(`Error fetching carrier ${id}:`, error);
      throw error;
    }
  }

  async createCarrier(data: CreateCarrierDto): Promise<Carrier> {
    try {
      const response = await carrierApiClient.createCarrier(data);
      return response;
    } catch (error) {
      console.error('Error creating carrier:', error);
      throw error;
    }
  }

  async updateCarrier(id: number, data: UpdateCarrierDto): Promise<Carrier> {
    try {
      const response = await carrierApiClient.updateCarrier(id, data);
      return response;
    } catch (error) {
      console.error(`Error updating carrier ${id}:`, error);
      throw error;
    }
  }

  async deleteCarrier(id: number): Promise<void> {
    try {
      await carrierApiClient.deleteCarrier(id);
    } catch (error) {
      console.error(`Error deleting carrier ${id}:`, error);
      throw error;
    }
  }

  async getCarrierCount(): Promise<{ count: number }> {
    try {
      const response = await carrierApiClient.getCarrierCount();
      return response;
    } catch (error) {
      console.error('Error fetching carrier count:', error);
      throw error;
    }
  }

  async getActiveCarriers(): Promise<Carrier[]> {
    try {
      const response = await carrierApiClient.getActiveCarriers();
      return response;
    } catch (error) {
      console.error('Error fetching active carriers:', error);
      throw error;
    }
  }

  async getCarrierByName(name: string): Promise<Carrier> {
    try {
      const response = await carrierApiClient.getCarrierByName(name);
      return response;
    } catch (error) {
      console.error(`Error fetching carrier by name ${name}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await carrierApiClient.healthCheck();
      return true;
    } catch (error) {
      console.error('Carrier service health check failed:', error);
      return false;
    }
  }
}

export const carrierService = new CarrierService();
export default carrierService;
