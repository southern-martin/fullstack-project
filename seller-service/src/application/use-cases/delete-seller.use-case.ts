import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerValidationService } from '../services/seller-validation.service';
import { GetSellerByIdUseCase } from './get-seller-by-id.use-case';

/**
 * Delete Seller Use Case
 * Deletes a seller account
 *
 * Business Rules:
 * - Cannot delete if seller has existing products
 * - Cannot delete if seller has sales history
 */
@Injectable()
export class DeleteSellerUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerValidationService: SellerValidationService,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(DeleteSellerUseCase.name);
  }

  async execute(sellerId: number): Promise<void> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Validate seller can be deleted
    this.sellerValidationService.validateCanDelete(seller);

    // Delete seller
    await this.sellerRepository.delete(sellerId);

    this.logger.log(`Seller ${sellerId} deleted`);
  }
}
