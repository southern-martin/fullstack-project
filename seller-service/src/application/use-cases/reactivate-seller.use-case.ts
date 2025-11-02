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
 * Reactivate Seller Use Case
 * Admin reactivates a suspended seller account
 *
 * Business Rules:
 * - Seller must be suspended
 * - Seller must be verified to be reactivated
 */
@Injectable()
export class ReactivateSellerUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerCacheService: SellerCacheService,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(ReactivateSellerUseCase.name);
  }

  async execute(sellerId: number): Promise<SellerTypeOrmEntity> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Validate seller is suspended
    if (seller.status !== SellerStatus.SUSPENDED) {
      throw new BadRequestException('Seller is not suspended');
    }

    // Validate seller is verified
    if (seller.verificationStatus !== VerificationStatus.VERIFIED) {
      throw new BadRequestException('Seller must be verified to be reactivated');
    }

    // Reactivate seller
    const updated = await this.sellerRepository.update(sellerId, {
      status: SellerStatus.ACTIVE,
      suspensionReason: null,
    });

    // Invalidate cache
    await this.sellerCacheService.invalidate(updated);

    // Log business event
    this.logger.logEvent('seller_reactivated', {
      sellerId: updated.id,
      userId: updated.userId,
      businessName: updated.businessName,
    });

    this.logger.log(`Seller ${sellerId} reactivated`);

    return updated;
  }
}
