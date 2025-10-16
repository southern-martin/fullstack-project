import { apiClient } from '../../../shared/utils/api';

export interface PricingRule {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  conditions: {
    carrierId?: number;
    serviceType?: string;
    weightRange?: {
      min: number;
      max: number;
    };
    distanceRange?: {
      min: number;
      max: number;
    };
    originCountry?: string;
    destinationCountry?: string;
    customerType?: string;
  };
  pricing: {
    baseRate: number;
    currency: string;
    perKgRate?: number;
    perKmRate?: number;
    minimumCharge?: number;
    maximumCharge?: number;
    surcharges?: Array<{
      type: string;
      amount?: number;
      percentage?: number;
    }>;
    discounts?: Array<{
      type: string;
      amount?: number;
      percentage?: number;
    }>;
  };
  priority: number;
  validFrom?: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceCalculation {
  id: number;
  requestId: string;
  request: {
    carrierId: number;
    serviceType: string;
    weight: number;
    distance?: number;
    originCountry: string;
    destinationCountry: string;
    customerType?: string;
    customerId?: number;
  };
  calculation: {
    baseRate: number;
    weightRate: number;
    distanceRate?: number;
    surcharges: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
    discounts: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
    subtotal: number;
    total: number;
    currency: string;
  };
  appliedRules: Array<{
    ruleId: number;
    ruleName: string;
    priority: number;
  }>;
  calculatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePricingRuleDto {
  name: string;
  description?: string;
  isActive?: boolean;
  conditions: {
    carrierId?: number;
    serviceType?: string;
    weightRange?: {
      min: number;
      max: number;
    };
    distanceRange?: {
      min: number;
      max: number;
    };
    originCountry?: string;
    destinationCountry?: string;
    customerType?: string;
  };
  pricing: {
    baseRate: number;
    currency: string;
    perKgRate?: number;
    perKmRate?: number;
    minimumCharge?: number;
    maximumCharge?: number;
    surcharges?: Array<{
      type: string;
      amount?: number;
      percentage?: number;
    }>;
    discounts?: Array<{
      type: string;
      amount?: number;
      percentage?: number;
    }>;
  };
  priority?: number;
  validFrom?: string;
  validTo?: string;
}

export interface UpdatePricingRuleDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  conditions?: {
    carrierId?: number;
    serviceType?: string;
    weightRange?: {
      min: number;
      max: number;
    };
    distanceRange?: {
      min: number;
      max: number;
    };
    originCountry?: string;
    destinationCountry?: string;
    customerType?: string;
  };
  pricing?: {
    baseRate?: number;
    currency?: string;
    perKgRate?: number;
    perKmRate?: number;
    minimumCharge?: number;
    maximumCharge?: number;
    surcharges?: Array<{
      type: string;
      amount?: number;
      percentage?: number;
    }>;
    discounts?: Array<{
      type: string;
      amount?: number;
      percentage?: number;
    }>;
  };
  priority?: number;
  validFrom?: string;
  validTo?: string;
}

export interface CalculatePriceDto {
  carrierId: number;
  serviceType: string;
  weight: number;
  distance?: number;
  originCountry: string;
  destinationCountry: string;
  customerType?: string;
  customerId?: number;
}

export interface PaginatedResponse<T> {
  pricingRules: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedCalculationResponse<T> {
  priceCalculations: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class PricingService {
  // Pricing Rules Management
  async getPricingRules(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<PricingRule>> {
    try {
      const response = await apiClient.getPricingRules(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
      throw error;
    }
  }

  async getPricingRule(id: number): Promise<PricingRule> {
    try {
      const response = await apiClient.getPricingRule(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pricing rule ${id}:`, error);
      throw error;
    }
  }

  async createPricingRule(data: CreatePricingRuleDto): Promise<PricingRule> {
    try {
      const response = await apiClient.createPricingRule(data);
      return response.data;
    } catch (error) {
      console.error('Error creating pricing rule:', error);
      throw error;
    }
  }

  async updatePricingRule(
    id: number,
    data: UpdatePricingRuleDto
  ): Promise<PricingRule> {
    try {
      const response = await apiClient.updatePricingRule(id, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating pricing rule ${id}:`, error);
      throw error;
    }
  }

  async deletePricingRule(id: number): Promise<void> {
    try {
      await apiClient.deletePricingRule(id);
    } catch (error) {
      console.error(`Error deleting pricing rule ${id}:`, error);
      throw error;
    }
  }

  async getPricingRuleCount(): Promise<{ count: number }> {
    try {
      const response = await apiClient.getPricingRuleCount();
      return response.data;
    } catch (error) {
      console.error('Error fetching pricing rule count:', error);
      throw error;
    }
  }

  // Price Calculation
  async calculatePrice(data: CalculatePriceDto): Promise<PriceCalculation> {
    try {
      const response = await apiClient.calculatePrice(data);
      return response.data;
    } catch (error) {
      console.error('Error calculating price:', error);
      throw error;
    }
  }

  // Price Calculation History
  async getPriceCalculationHistory(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedCalculationResponse<PriceCalculation>> {
    try {
      const response = await apiClient.getPriceCalculationHistory(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching price calculation history:', error);
      throw error;
    }
  }

  async getPriceCalculationCount(): Promise<{ count: number }> {
    try {
      const response = await apiClient.getPriceCalculationCount();
      return response.data;
    } catch (error) {
      console.error('Error fetching price calculation count:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await apiClient.healthCheck();
      return true;
    } catch (error) {
      console.error('Pricing service health check failed:', error);
      return false;
    }
  }
}

export const pricingService = new PricingService();
export default pricingService;
