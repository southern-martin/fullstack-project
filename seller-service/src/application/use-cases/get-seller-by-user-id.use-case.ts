import { Injectable, NotFoundException } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/seller.entity';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerCacheService } from '../services/seller-cache.service';

/**
 * Get Seller By User ID Use Case
 * Retrieves seller by user ID with caching
 */
@Injectable()
export class GetSellerByUserIdUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerCacheService: SellerCacheService,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(GetSellerByUserIdUseCase.name);
  }

  async execute(userId: number): Promise<SellerTypeOrmEntity> {
    // Try cache first
    const cached = await this.sellerCacheService.getByUserId(userId);

    if (cached) {
      this.logger.debug(`Cache hit for seller with user ID ${userId}`);
      return cached;
    }

    // Fetch from database
    const seller = await this.sellerRepository.findByUserId(userId);
    if (!seller) {
      throw new NotFoundException(`Seller not found for user ${userId}`);
    }

    // Cache the result
    await this.sellerCacheService.setByUserId(userId, seller);

    return seller;
  }
}
