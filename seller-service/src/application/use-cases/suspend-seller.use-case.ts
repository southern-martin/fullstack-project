import { Injectable, BadRequestException } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerTypeOrmEntity, SellerStatus } from '../../infrastructure/database/typeorm/entities/seller.entity';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerCacheService } from '../services/seller-cache.service';
import { GetSellerByIdUseCase } from './get-seller-by-id.use-case';

/**
 * Suspend Seller Use Case
 * Admin suspends seller account
 *
 * Business Rules:
 * - Cannot suspend if already suspended
 * - Suspension reason is required
 * - Suspended sellers cannot perform any actions
 */
@Injectable()
export class SuspendSellerUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerCacheService: SellerCacheService,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(SuspendSellerUseCase.name);
  }

  async execute(sellerId: number, reason: string): Promise<SellerTypeOrmEntity> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Validate seller is not already suspended
    if (seller.status === SellerStatus.SUSPENDED) {
      throw new BadRequestException('Seller is already suspended');
    }

    // Validate suspension reason provided
    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException('Suspension reason is required');
    }

    // Suspend seller
    const updated = await this.sellerRepository.update(sellerId, {
      status: SellerStatus.SUSPENDED,
      suspensionReason: reason,
    });

    // Invalidate cache
    await this.sellerCacheService.invalidate(updated);

    // Log business event
    this.logger.logEvent('seller_suspended', {
      sellerId: updated.id,
      userId: updated.userId,
      businessName: updated.businessName,
      reason,
    });

    this.logger.warn(`Seller ${sellerId} suspended: ${reason}`);

    return updated;
  }
}
