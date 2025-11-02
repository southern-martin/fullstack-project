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
 * Reject Seller Use Case
 * Admin rejects seller verification
 *
 * Business Rules:
 * - Seller must be in PENDING verification status
 * - Rejection reason is required
 * - Changes verification status to REJECTED
 * - Changes status to REJECTED
 */
@Injectable()
export class RejectSellerUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerCacheService: SellerCacheService,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(RejectSellerUseCase.name);
  }

  async execute(sellerId: number, reason: string): Promise<SellerTypeOrmEntity> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Validate seller is in pending verification status
    if (seller.verificationStatus !== VerificationStatus.PENDING) {
      throw new BadRequestException('Seller must be in pending verification status');
    }

    // Validate rejection reason provided
    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException('Rejection reason is required');
    }

    // Reject seller
    const updated = await this.sellerRepository.update(sellerId, {
      verificationStatus: VerificationStatus.REJECTED,
      status: SellerStatus.REJECTED,
      rejectionReason: reason,
    });

    // Invalidate cache
    await this.sellerCacheService.invalidate(updated);

    // Log business event
    this.logger.logEvent('seller_rejected', {
      sellerId: updated.id,
      userId: updated.userId,
      businessName: updated.businessName,
      reason,
    });

    this.logger.warn(`Seller ${sellerId} rejected: ${reason}`);

    return updated;
  }
}
