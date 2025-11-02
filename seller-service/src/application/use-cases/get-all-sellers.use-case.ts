import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/seller.entity';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerFilterDto } from '../dto/seller-filter.dto';

/**
 * Get All Sellers Use Case
 * Retrieves paginated list of sellers with optional filters
 */
@Injectable()
export class GetAllSellersUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(GetAllSellersUseCase.name);
  }

  async execute(
    filters: SellerFilterDto,
  ): Promise<{ sellers: SellerTypeOrmEntity[]; total: number }> {
    const sellers = await this.sellerRepository.findAll(filters);
    const total = await this.sellerRepository.count(filters);

    this.logger.debug(`Retrieved ${sellers.length} sellers (total: ${total})`, { filters });

    return { sellers, total };
  }
}
