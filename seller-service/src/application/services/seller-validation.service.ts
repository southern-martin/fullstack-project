import { Injectable, BadRequestException } from '@nestjs/common';
import {
  SellerTypeOrmEntity,
  SellerStatus,
  VerificationStatus,
} from '../../infrastructure/database/typeorm/entities/seller.entity';

/**
 * Seller Validation Service
 * Centralized business rule validation logic
 * Reusable across multiple use cases
 */
@Injectable()
export class SellerValidationService {
  /**
   * Validate seller has all required fields for verification submission
   */
  validateForVerification(seller: SellerTypeOrmEntity): void {
    const missingFields: string[] = [];

    if (!seller.businessName) missingFields.push('Business Name');
    if (!seller.businessEmail) missingFields.push('Business Email');
    if (!seller.businessPhone) missingFields.push('Business Phone');
    if (!seller.businessAddress) missingFields.push('Business Address');
    if (!seller.businessCity) missingFields.push('Business City');
    if (!seller.businessState) missingFields.push('Business State/Province');
    if (!seller.businessCountry) missingFields.push('Business Country');

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Cannot submit for verification. Missing required fields: ${missingFields.join(', ')}`,
      );
    }
  }

  /**
   * Validate seller can perform actions (active and verified)
   */
  validateActive(seller: SellerTypeOrmEntity): void {
    if (seller.status !== SellerStatus.ACTIVE) {
      throw new BadRequestException(
        `Seller account is ${seller.status}. Only active sellers can perform this action.`,
      );
    }

    if (seller.verificationStatus !== VerificationStatus.VERIFIED) {
      throw new BadRequestException('Seller must be verified to perform this action');
    }
  }

  /**
   * Validate seller is not suspended
   */
  validateNotSuspended(seller: SellerTypeOrmEntity): void {
    if (seller.status === SellerStatus.SUSPENDED) {
      throw new BadRequestException('Cannot perform this action while account is suspended');
    }
  }

  /**
   * Validate seller can be deleted
   */
  validateCanDelete(seller: SellerTypeOrmEntity): void {
    if (seller.totalProducts > 0) {
      throw new BadRequestException('Cannot delete seller with existing products');
    }

    if (seller.totalSales > 0) {
      throw new BadRequestException('Cannot delete seller with sales history');
    }
  }

  /**
   * Validate seller status transition
   */
  validateStatusTransition(
    currentStatus: SellerStatus,
    newStatus: SellerStatus,
  ): void {
    // Define allowed transitions
    const allowedTransitions: Record<SellerStatus, SellerStatus[]> = {
      [SellerStatus.PENDING]: [SellerStatus.ACTIVE, SellerStatus.REJECTED, SellerStatus.SUSPENDED],
      [SellerStatus.ACTIVE]: [SellerStatus.SUSPENDED],
      [SellerStatus.SUSPENDED]: [SellerStatus.ACTIVE],
      [SellerStatus.REJECTED]: [SellerStatus.PENDING],
    };

    const allowed = allowedTransitions[currentStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  /**
   * Validate verification status transition
   */
  validateVerificationTransition(
    currentStatus: VerificationStatus,
    newStatus: VerificationStatus,
  ): void {
    // Define allowed transitions
    const allowedTransitions: Record<VerificationStatus, VerificationStatus[]> = {
      [VerificationStatus.UNVERIFIED]: [VerificationStatus.PENDING],
      [VerificationStatus.PENDING]: [VerificationStatus.VERIFIED, VerificationStatus.REJECTED],
      [VerificationStatus.VERIFIED]: [],
      [VerificationStatus.REJECTED]: [VerificationStatus.PENDING],
    };

    const allowed = allowedTransitions[currentStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid verification status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
