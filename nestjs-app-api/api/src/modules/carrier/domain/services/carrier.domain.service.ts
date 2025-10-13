import { Injectable } from '@nestjs/common';
import { Carrier } from '../entities/carrier.entity';

/**
 * CarrierDomainService
 * 
 * This service encapsulates the core business logic and rules related to carriers.
 * It operates on Carrier entities and ensures that business rules are enforced
 * independently of application-specific concerns (like data storage or UI).
 */
@Injectable()
export class CarrierDomainService {
  /**
   * Validates carrier creation data against business rules.
   * @param carrierData Partial carrier data for creation.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateCarrierCreationData(carrierData: Partial<Carrier>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Name validation
    if (!carrierData.name || carrierData.name.trim().length < 2) {
      errors.push('Carrier name must be at least 2 characters');
    }

    if (carrierData.name && carrierData.name.length > 100) {
      errors.push('Carrier name must not exceed 100 characters');
    }

    // Code validation (if provided)
    if (carrierData.metadata?.code && !this.isValidCarrierCode(carrierData.metadata.code)) {
      errors.push('Carrier code must contain only uppercase letters, numbers, hyphens, and underscores');
    }

    // Contact email validation (if provided)
    if (carrierData.contactEmail && !this.isValidEmail(carrierData.contactEmail)) {
      errors.push('Contact email must be a valid email address');
    }

    // Contact phone validation (if provided)
    if (carrierData.contactPhone && !this.isValidPhone(carrierData.contactPhone)) {
      errors.push('Contact phone must be in valid format');
    }

    // Description validation (if provided)
    if (carrierData.description && carrierData.description.length > 500) {
      errors.push('Description must not exceed 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates carrier update data against business rules.
   * @param updateData Partial carrier data for update.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateCarrierUpdateData(updateData: Partial<Carrier>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Name validation (if being updated)
    if (updateData.name !== undefined) {
      if (!updateData.name || updateData.name.trim().length < 2) {
        errors.push('Carrier name must be at least 2 characters');
      }
      if (updateData.name.length > 100) {
        errors.push('Carrier name must not exceed 100 characters');
      }
    }

    // Code validation (if being updated)
    if (updateData.metadata?.code && !this.isValidCarrierCode(updateData.metadata.code)) {
      errors.push('Carrier code must contain only uppercase letters, numbers, hyphens, and underscores');
    }

    // Contact email validation (if being updated)
    if (updateData.contactEmail !== undefined && updateData.contactEmail && !this.isValidEmail(updateData.contactEmail)) {
      errors.push('Contact email must be a valid email address');
    }

    // Contact phone validation (if being updated)
    if (updateData.contactPhone !== undefined && updateData.contactPhone && !this.isValidPhone(updateData.contactPhone)) {
      errors.push('Contact phone must be in valid format');
    }

    // Description validation (if being updated)
    if (updateData.description !== undefined && updateData.description && updateData.description.length > 500) {
      errors.push('Description must not exceed 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Normalizes carrier data for consistent storage.
   * @param carrierData Carrier data to normalize.
   * @returns Normalized carrier data.
   */
  normalizeCarrierData(carrierData: Partial<Carrier>): Partial<Carrier> {
    const normalized = { ...carrierData };

    // Normalize name
    if (normalized.name) {
      normalized.name = normalized.name.trim();
    }

    // Normalize code (if provided)
    if (normalized.metadata?.code) {
      normalized.metadata = {
        ...normalized.metadata,
        code: normalized.metadata.code.toUpperCase().trim(),
      };
    }

    // Normalize contact email
    if (normalized.contactEmail) {
      normalized.contactEmail = normalized.contactEmail.toLowerCase().trim();
    }

    // Normalize contact phone
    if (normalized.contactPhone) {
      normalized.contactPhone = normalized.contactPhone.trim();
    }

    // Normalize description
    if (normalized.description) {
      normalized.description = normalized.description.trim();
    }

    return normalized;
  }

  /**
   * Determines if a carrier can be deleted.
   * @param carrier The carrier entity.
   * @param hasActiveShipments True if carrier has active shipments, false otherwise.
   * @returns True if carrier can be deleted, false otherwise.
   */
  canDeleteCarrier(carrier: Carrier, hasActiveShipments: boolean): boolean {
    // Business rule: Cannot delete carriers with active shipments
    if (hasActiveShipments) {
      return false;
    }

    // Business rule: Cannot delete default carriers
    if (carrier.metadata?.isDefault) {
      return false;
    }

    return true;
  }

  /**
   * Determines if a carrier can be deactivated.
   * @param carrier The carrier entity.
   * @param hasActiveShipments True if carrier has active shipments, false otherwise.
   * @returns True if carrier can be deactivated, false otherwise.
   */
  canDeactivateCarrier(carrier: Carrier, hasActiveShipments: boolean): boolean {
    // Business rule: Cannot deactivate carriers with active shipments
    if (hasActiveShipments) {
      return false;
    }

    // Business rule: Cannot deactivate default carriers
    if (carrier.metadata?.isDefault) {
      return false;
    }

    return true;
  }

  /**
   * Determines if a carrier can be activated.
   * @param carrier The carrier entity.
   * @returns True if carrier can be activated, false otherwise.
   */
  canActivateCarrier(carrier: Carrier): boolean {
    // Business rule: Can always activate carriers (unless they're already active)
    return !carrier.isActive;
  }

  /**
   * Calculates carrier performance score.
   * @param carrier The carrier entity.
   * @param metrics Performance metrics.
   * @returns Performance score (0-100).
   */
  calculatePerformanceScore(
    carrier: Carrier,
    metrics: {
      onTimeDeliveries: number;
      totalDeliveries: number;
      customerRating: number;
    },
  ): number {
    let score = 0;

    // On-time delivery rate (40% of score)
    if (metrics.totalDeliveries > 0) {
      const onTimeRate = (metrics.onTimeDeliveries / metrics.totalDeliveries) * 100;
      score += (onTimeRate * 0.4);
    }

    // Customer rating (60% of score)
    score += (metrics.customerRating * 0.6);

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Determines if a carrier is suitable for a specific shipment.
   * @param carrier The carrier entity.
   * @param shipmentRequirements Shipment requirements.
   * @returns True if carrier is suitable, false otherwise.
   */
  isSuitableForShipment(
    carrier: Carrier,
    shipmentRequirements: {
      weight: number;
      dimensions: { length: number; width: number; height: number };
      destination: string;
      serviceType: string;
    },
  ): boolean {
    // Business rule: Carrier must be active
    if (!carrier.isActive) {
      return false;
    }

    // Business rule: Check weight capacity (if defined in metadata)
    if (carrier.metadata?.maxWeight && shipmentRequirements.weight > carrier.metadata.maxWeight) {
      return false;
    }

    // Business rule: Check service type compatibility (if defined in metadata)
    if (carrier.metadata?.supportedServices && 
        !carrier.metadata.supportedServices.includes(shipmentRequirements.serviceType)) {
      return false;
    }

    // Business rule: Check destination coverage (if defined in metadata)
    if (carrier.metadata?.serviceAreas && 
        !carrier.metadata.serviceAreas.includes(shipmentRequirements.destination)) {
      return false;
    }

    return true;
  }

  // --- Private Helper Methods for Validation ---

  private isValidCarrierCode(code: string): boolean {
    // Carrier codes should be uppercase letters, numbers, hyphens, and underscores
    const codeRegex = /^[A-Z0-9_-]+$/;
    return codeRegex.test(code);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    // Basic phone validation - can be enhanced based on requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
}
