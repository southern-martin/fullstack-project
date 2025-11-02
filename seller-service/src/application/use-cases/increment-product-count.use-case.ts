import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerCacheService } from '../services/seller-cache.service';
import { GetSellerByIdUseCase } from './get-seller-by-id.use-case';

/**
 * Increment Product Count Use Case
 * Increments the total product count for a seller
 * Called by Product Service when a new product is created
 */
@Injectable()
export class IncrementProductCountUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerCacheService: SellerCacheService,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(IncrementProductCountUseCase.name);
  }

  async execute(sellerId: number): Promise<void> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Increment product count
    const newCount = seller.totalProducts + 1;
    await this.sellerRepository.update(sellerId, {
      totalProducts: newCount,
    });

    // Invalidate cache
    await this.sellerCacheService.invalidateById(sellerId, seller.userId);

    this.logger.log(`Seller ${sellerId} product count incremented to ${newCount}`);
  }
}
