import { Injectable } from '@nestjs/common';
import { Carrier } from '../entities/carrier.entity';

/**
 * Domain service for carrier business logic
 * Contains pure business rules without infrastructure concerns
 */
@Injectable()
export class CarrierDomainService {

  /**
   * Validates carrier creation data
   * Business rule: All required fields must be present and valid
   */
  validateCarrierCreationData(carrierData: {
    name: string;
    description?: string;
    contactEmail?: string;
    contactPhone?: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Name validation
    if (!carrierData.name || carrierData.name.trim().length < 2) {
      errors.push('Carrier name must be at least 2 characters');
    }

    if (carrierData.name && carrierData.name.length > 100) {
      errors.push('Carrier name must not exceed 100 characters');
    }

    // Description validation
    if (carrierData.description && carrierData.description.length > 500) {
      errors.push('Carrier description must not exceed 500 characters');
    }

    // Email validation
    if (carrierData.contactEmail && !this.isValidEmail(carrierData.contactEmail)) {
      errors.push('Contact email format is invalid');
    }

    // Phone validation
    if (carrierData.contactPhone && !this.isValidPhone(carrierData.contactPhone)) {
      errors.push('Contact phone format is invalid');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates carrier update data
   * Business rule: Cannot update certain fields after creation
   */
  validateCarrierUpdateData(updateData: Partial<Carrier>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Name validation
    if (updateData.name !== undefined) {
      if (!updateData.name || updateData.name.trim().length < 2) {
        errors.push('Carrier name must be at least 2 characters');
      }
      if (updateData.name.length > 100) {
        errors.push('Carrier name must not exceed 100 characters');
      }
    }

    // Description validation
    if (updateData.description !== undefined && updateData.description.length > 500) {
      errors.push('Carrier description must not exceed 500 characters');
    }

    // Email validation
    if (updateData.contactEmail !== undefined && !this.isValidEmail(updateData.contactEmail)) {
      errors.push('Contact email format is invalid');
    }

    // Phone validation
    if (updateData.contactPhone !== undefined && !this.isValidPhone(updateData.contactPhone)) {
      errors.push('Contact phone format is invalid');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Determines if carrier can be deactivated
   * Business rule: Cannot deactivate carrier if it has active shipments
   */
  canDeactivateCarrier(carrier: Carrier, hasActiveShipments: boolean): boolean {
    if (!hasActiveShipments) {
      return true;
    }

    // Business rule: Cannot deactivate carrier with active shipments
    return false;
  }

  /**
   * Determines if carrier can be deleted
   * Business rule: Cannot delete carrier if it has any shipments
   */
  canDeleteCarrier(carrier: Carrier, hasAnyShipments: boolean): boolean {
    if (!hasAnyShipments) {
      return true;
    }

    // Business rule: Cannot delete carrier with shipments
    return false;
  }

  /**
   * Calculates carrier performance score
   * Business rule: Performance based on delivery success rate
   */
  calculatePerformanceScore(
    totalDeliveries: number,
    successfulDeliveries: number
  ): number {
    if (totalDeliveries === 0) {
      return 0;
    }

    const successRate = (successfulDeliveries / totalDeliveries) * 100;
    
    // Business rule: Performance score based on success rate
    if (successRate >= 95) return 5; // Excellent
    if (successRate >= 90) return 4; // Good
    if (successRate >= 80) return 3; // Average
    if (successRate >= 70) return 2; // Below Average
    return 1; // Poor
  }

  /**
   * Determines if carrier is eligible for premium status
   * Business rule: Premium status based on performance and volume
   */
  isEligibleForPremiumStatus(
    performanceScore: number,
    monthlyVolume: number
  ): boolean {
    // Business rule: Premium status requires high performance and volume
    return performanceScore >= 4 && monthlyVolume >= 1000;
  }

  /**
   * Validates carrier metadata
   * Business rule: Metadata must be valid JSON and within size limits
   */
  validateMetadata(metadata: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (metadata === null || metadata === undefined) {
      return { isValid: true, errors: [] };
    }

    try {
      const metadataString = JSON.stringify(metadata);
      if (metadataString.length > 1000) {
        errors.push('Metadata must not exceed 1000 characters');
      }
    } catch (error) {
      errors.push('Metadata must be valid JSON');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Private helper methods

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }
}
