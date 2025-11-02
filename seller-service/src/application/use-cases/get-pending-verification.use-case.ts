import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/seller.entity';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';

/**
 * Get Pending Verification Use Case
 * Retrieves all sellers pending verification (admin use)
 */
@Injectable()
export class GetPendingVerificationUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(GetPendingVerificationUseCase.name);
  }

  async execute(): Promise<SellerTypeOrmEntity[]> {
    const sellers = await this.sellerRepository.findPendingVerification();

    this.logger.debug(`Retrieved ${sellers.length} sellers pending verification`);

    return sellers;
  }
}
