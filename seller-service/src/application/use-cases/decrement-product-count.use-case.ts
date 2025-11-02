import { Injectable, BadRequestException } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerCacheService } from '../services/seller-cache.service';
import { GetSellerByIdUseCase } from './get-seller-by-id.use-case';

/**
 * Decrement Product Count Use Case
 * Decrements the total product count for a seller
 * Called by Product Service when a product is deleted
 */
@Injectable()
export class DecrementProductCountUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerCacheService: SellerCacheService,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(DecrementProductCountUseCase.name);
  }

  async execute(sellerId: number): Promise<void> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Validate product count is not zero
    if (seller.totalProducts === 0) {
      throw new BadRequestException('Product count is already zero');
    }

    // Decrement product count
    const newCount = seller.totalProducts - 1;
    await this.sellerRepository.update(sellerId, {
      totalProducts: newCount,
    });

    // Invalidate cache
    await this.sellerCacheService.invalidateById(sellerId, seller.userId);

    this.logger.log(`Seller ${sellerId} product count decremented to ${newCount}`);
  }
}
