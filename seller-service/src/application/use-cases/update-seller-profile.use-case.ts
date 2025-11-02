import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { UpdateSellerProfileDto } from '../dto/update-seller.dto';
import { SellerTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/seller.entity';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerCacheService } from '../services/seller-cache.service';
import { SellerValidationService } from '../services/seller-validation.service';
import { GetSellerByIdUseCase } from './get-seller-by-id.use-case';

/**
 * Update Seller Profile Use Case
 * Allows sellers to update their profile information
 * Cannot update while suspended
 */
@Injectable()
export class UpdateSellerProfileUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerCacheService: SellerCacheService,
    private readonly sellerValidationService: SellerValidationService,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(UpdateSellerProfileUseCase.name);
  }

  async execute(
    sellerId: number,
    updateDto: UpdateSellerProfileDto,
  ): Promise<SellerTypeOrmEntity> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Validate seller is not suspended
    this.sellerValidationService.validateNotSuspended(seller);

    // Update profile
    const updated = await this.sellerRepository.update(sellerId, updateDto);

    // Invalidate cache
    await this.sellerCacheService.invalidate(updated);

    this.logger.log(`Seller ${sellerId} profile updated`);

    return updated;
  }
}
