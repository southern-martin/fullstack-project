import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { UpdateBankingInfoDto } from '../dto/update-seller.dto';
import { SellerTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/seller.entity';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerCacheService } from '../services/seller-cache.service';
import { SellerValidationService } from '../services/seller-validation.service';
import { GetSellerByIdUseCase } from './get-seller-by-id.use-case';

/**
 * Update Banking Info Use Case
 * Allows sellers to update their banking information
 * Cannot update while suspended
 */
@Injectable()
export class UpdateBankingInfoUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerCacheService: SellerCacheService,
    private readonly sellerValidationService: SellerValidationService,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(UpdateBankingInfoUseCase.name);
  }

  async execute(
    sellerId: number,
    bankingDto: UpdateBankingInfoDto,
  ): Promise<SellerTypeOrmEntity> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Validate seller is not suspended
    this.sellerValidationService.validateNotSuspended(seller);

    // Update banking info
    const updated = await this.sellerRepository.update(sellerId, bankingDto);

    // Invalidate cache
    await this.sellerCacheService.invalidate(updated);

    this.logger.log(`Seller ${sellerId} banking info updated`);

    return updated;
  }
}
