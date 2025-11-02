import { Injectable, NotFoundException } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/seller.entity';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerCacheService } from '../services/seller-cache.service';

/**
 * Get Seller By ID Use Case
 * Retrieves seller by ID with caching for improved performance
 */
@Injectable()
export class GetSellerByIdUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerCacheService: SellerCacheService,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(GetSellerByIdUseCase.name);
  }

  async execute(id: number): Promise<SellerTypeOrmEntity> {
    // Try cache first
    const cached = await this.sellerCacheService.getById(id);

    if (cached) {
      this.logger.debug(`Cache hit for seller ID ${id}`);
      return cached;
    }

    // Fetch from database
    const seller = await this.sellerRepository.findById(id);
    if (!seller) {
      throw new NotFoundException(`Seller with id ${id} not found`);
    }

    // Cache the result
    await this.sellerCacheService.setById(id, seller);

    return seller;
  }
}
