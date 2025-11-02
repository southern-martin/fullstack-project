import { Injectable, BadRequestException } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerCacheService } from '../services/seller-cache.service';
import { GetSellerByIdUseCase } from './get-seller-by-id.use-case';

/**
 * Update Rating Use Case
 * Updates seller's average rating
 * Called by Review Service when a seller review is added/updated
 */
@Injectable()
export class UpdateRatingUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerCacheService: SellerCacheService,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(UpdateRatingUseCase.name);
  }

  async execute(sellerId: number, newRating: number): Promise<void> {
    // Validate rating is between 0 and 5
    if (newRating < 0 || newRating > 5) {
      throw new BadRequestException('Rating must be between 0 and 5');
    }

    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Update rating
    await this.sellerRepository.update(sellerId, {
      rating: newRating,
    });

    // Invalidate cache
    await this.sellerCacheService.invalidateById(sellerId, seller.userId);

    this.logger.log(`Seller ${sellerId} rating updated to ${newRating}`);
  }
}
