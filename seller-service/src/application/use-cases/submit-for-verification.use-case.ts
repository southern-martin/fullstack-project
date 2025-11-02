import { Injectable, BadRequestException } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerTypeOrmEntity, VerificationStatus } from '../../infrastructure/database/typeorm/entities/seller.entity';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerValidationService } from '../services/seller-validation.service';
import { GetSellerByIdUseCase } from './get-seller-by-id.use-case';

/**
 * Submit For Verification Use Case
 * Seller submits their account for admin verification
 *
 * Business Rules:
 * - Cannot submit if already pending
 * - Cannot submit if already verified
 * - Must have all required fields filled
 */
@Injectable()
export class SubmitForVerificationUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerValidationService: SellerValidationService,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(SubmitForVerificationUseCase.name);
  }

  async execute(sellerId: number): Promise<SellerTypeOrmEntity> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Validate seller can submit for verification
    if (seller.verificationStatus === VerificationStatus.PENDING) {
      throw new BadRequestException('Verification is already pending');
    }

    if (seller.verificationStatus === VerificationStatus.VERIFIED) {
      throw new BadRequestException('Seller is already verified');
    }

    // Validate all required fields are filled
    this.sellerValidationService.validateForVerification(seller);

    // Update verification status
    const updated = await this.sellerRepository.update(sellerId, {
      verificationStatus: VerificationStatus.PENDING,
    });

    this.logger.log(`Seller ${sellerId} submitted for verification`);

    return updated;
  }
}
