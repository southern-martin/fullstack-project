import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerCacheService } from '../services/seller-cache.service';
import { GetSellerByIdUseCase } from './get-seller-by-id.use-case';

/**
 * Record Sale Use Case
 * Records a sale for a seller
 * Called by Order Service when an order is completed
 *
 * Updates:
 * - totalSales: Increment by 1
 * - totalRevenue: Increment by sale amount
 */
@Injectable()
export class RecordSaleUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly sellerCacheService: SellerCacheService,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(RecordSaleUseCase.name);
  }

  async execute(sellerId: number, saleAmount: number): Promise<void> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Update sales and revenue
    const newSalesCount = seller.totalSales + 1;
    const newRevenue = seller.totalRevenue + saleAmount;

    await this.sellerRepository.update(sellerId, {
      totalSales: newSalesCount,
      totalRevenue: newRevenue,
    });

    // Invalidate cache
    await this.sellerCacheService.invalidateById(sellerId, seller.userId);

    this.logger.log(
      `Seller ${sellerId} sale recorded: ${saleAmount}, total sales: ${newSalesCount}, total revenue: ${newRevenue}`,
    );
  }
}
