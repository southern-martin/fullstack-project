import { Injectable, BadRequestException } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import {
  SellerTypeOrmEntity,
  SellerStatus,
  VerificationStatus,
} from '../../infrastructure/database/typeorm/entities/seller.entity';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerCacheService } from '../services/seller-cache.service';
import { GetSellerByIdUseCase } from './get-seller-by-id.use-case';

/**
 * Approve Seller Use Case
 * Admin approves seller verification
 *
 * Business Rules:
 * - Seller must be in PENDING verification status
 * - Changes verification status to VERIFIED
 * - Changes status to ACTIVE
 * - Records verification timestamp and admin ID
 */
@Injectable()
export class ApproveSellerUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerCacheService: SellerCacheService,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(ApproveSellerUseCase.name);
  }

  async execute(sellerId: number, approvedBy: number): Promise<SellerTypeOrmEntity> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Validate seller is in pending verification status
    if (seller.verificationStatus !== VerificationStatus.PENDING) {
      throw new BadRequestException('Seller must be in pending verification status');
    }

    // Approve seller
    const updated = await this.sellerRepository.update(sellerId, {
      verificationStatus: VerificationStatus.VERIFIED,
      status: SellerStatus.ACTIVE,
      verifiedAt: new Date(),
      verifiedBy: approvedBy,
      rejectionReason: null,
    });

    // Invalidate cache
    await this.sellerCacheService.invalidate(updated);

    // Log business event
    this.logger.logEvent(
      'seller_approved',
      {
        sellerId: updated.id,
        userId: updated.userId,
        businessName: updated.businessName,
        approvedBy,
        verifiedAt: updated.verifiedAt,
      },
      approvedBy.toString(),
    );

    this.logger.log(`Seller ${sellerId} approved by admin ${approvedBy}`);

    return updated;
  }
}
