import { PaginatedResponse, PaginationParams } from '../../../shared/types';
import { apiClient } from '../../../shared/utils/api';
import { CARRIERS_API_CONFIG } from '../config/carriersApi';

export interface Carrier {
  id: number;
  name: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: {
    code?: string;
    [key: string]: any;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarrierRequest {
  name: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: {
    code?: string;
    [key: string]: any;
  };
}

export interface UpdateCarrierRequest {
  name?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: {
    code?: string;
    [key: string]: any;
  };
  isActive?: boolean;
}

class CarrierApiService {
  private readonly basePath: string;

  constructor() {
    try {
      console.log('CarrierApiService constructor called');
      console.log('CARRIERS_API_CONFIG:', CARRIERS_API_CONFIG);
      this.basePath = CARRIERS_API_CONFIG?.ENDPOINTS?.LIST || '/carriers';
      console.log('CarrierApiService initialized with basePath:', this.basePath);
    } catch (error) {
      console.error('Error initializing CarrierApiService:', error);
      console.error('Error stack:', error.stack);
      this.basePath = '/carriers'; // Fallback
    }
  }

  async getCarriers(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Carrier>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = queryParams.toString()
      ? `${this.basePath}?${queryParams}`
      : this.basePath;
    return apiClient.get<PaginatedResponse<Carrier>>(url);
  }

  async getCarrierById(id: number): Promise<Carrier> {
    return apiClient.get<Carrier>(`${this.basePath}/${id}`);
  }

  async createCarrier(carrierData: CreateCarrierRequest): Promise<Carrier> {
    return apiClient.post<Carrier>(
      CARRIERS_API_CONFIG.ENDPOINTS.CREATE,
      carrierData
    );
  }

  async updateCarrier(
    id: number,
    carrierData: UpdateCarrierRequest
  ): Promise<Carrier> {
    return apiClient.patch<Carrier>(
      CARRIERS_API_CONFIG.ENDPOINTS.UPDATE(id),
      carrierData
    );
  }

  async deleteCarrier(id: number): Promise<void> {
    return apiClient.delete<void>(CARRIERS_API_CONFIG.ENDPOINTS.DELETE(id));
  }

  async getActiveCarriers(): Promise<Carrier[]> {
    return apiClient.get<Carrier[]>(CARRIERS_API_CONFIG.ENDPOINTS.ACTIVE);
  }
}

export const carrierApiService = new CarrierApiService();
