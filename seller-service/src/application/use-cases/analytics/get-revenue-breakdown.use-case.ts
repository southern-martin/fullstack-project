import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { GetSellerByIdUseCase } from '../get-seller-by-id.use-case';

/**
 * Get Revenue Breakdown Use Case
 * Returns detailed revenue analysis
 *
 * Note: In production, these would aggregate from orders table
 * Currently uses seller's aggregate totals to generate mock data
 */
@Injectable()
export class GetRevenueBreakdownUseCase {
  constructor(
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(GetRevenueBreakdownUseCase.name);
  }

  async execute(sellerId: number, period: string = 'month'): Promise<any> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Calculate revenue metrics
    const totalRevenue = seller.totalRevenue;
    const completedRevenue = totalRevenue * 0.95; // 95% completed
    const pendingRevenue = totalRevenue * 0.05; // 5% pending
    const refundedAmount = totalRevenue * 0.02; // 2% refunded
    const avgOrderValue = seller.totalSales > 0 ? totalRevenue / seller.totalSales : 0;

    // Mock revenue by category
    const revenueByCategory = {
      Electronics: parseFloat((totalRevenue * 0.4).toFixed(2)),
      Clothing: parseFloat((totalRevenue * 0.3).toFixed(2)),
      'Home & Garden': parseFloat((totalRevenue * 0.2).toFixed(2)),
      Other: parseFloat((totalRevenue * 0.1).toFixed(2)),
    };

    this.logger.debug(`Fetched revenue breakdown for seller ${sellerId}`, {
      totalRevenue,
      completedRevenue,
    });

    return {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      completedRevenue: parseFloat(completedRevenue.toFixed(2)),
      pendingRevenue: parseFloat(pendingRevenue.toFixed(2)),
      refundedAmount: parseFloat(refundedAmount.toFixed(2)),
      averageOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      highestOrderValue: parseFloat((avgOrderValue * 5).toFixed(2)), // Mock
      lowestOrderValue: parseFloat((avgOrderValue * 0.2).toFixed(2)), // Mock
      revenueByCategory,
    };
  }
}
