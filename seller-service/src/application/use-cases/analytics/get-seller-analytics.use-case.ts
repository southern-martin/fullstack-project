import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { GetSellerByIdUseCase } from '../get-seller-by-id.use-case';
import { AnalyticsHelperService } from '../../services/analytics-helper.service';

/**
 * Get Seller Analytics Use Case
 * Returns comprehensive analytics overview for a seller
 *
 * Includes:
 * - Total products, sales, revenue
 * - Average order value
 * - Conversion rate
 * - Performance metrics
 */
@Injectable()
export class GetSellerAnalyticsUseCase {
  constructor(
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly analyticsHelper: AnalyticsHelperService,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(GetSellerAnalyticsUseCase.name);
  }

  async execute(
    sellerId: number,
    period: 'day' | 'week' | 'month' | 'year' | 'all_time' = 'month',
    customStartDate?: Date,
    customEndDate?: Date,
  ): Promise<any> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Calculate period dates
    const { startDate, endDate } = this.analyticsHelper.calculatePeriodDates(
      period,
      customStartDate,
      customEndDate,
    );

    // Calculate metrics
    const avgOrderValue = seller.totalSales > 0 ? seller.totalRevenue / seller.totalSales : 0;
    const conversionRate = this.analyticsHelper.calculateConversionRate(seller.totalSales);

    this.logger.debug(`Fetched analytics for seller ${sellerId}`, {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    return {
      sellerId: seller.id,
      businessName: seller.businessName,
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      overview: {
        totalProducts: seller.totalProducts,
        totalSales: seller.totalSales,
        totalRevenue: parseFloat(seller.totalRevenue.toFixed(2)),
        averageOrderValue: parseFloat(avgOrderValue.toFixed(2)),
        rating: seller.rating,
        conversionRate,
      },
      performance: {
        status: seller.status,
        verificationStatus: seller.verificationStatus,
        accountAge: this.calculateAccountAge(seller.createdAt),
        lastSaleDate: this.estimateLastSaleDate(seller.totalSales),
      },
    };
  }

  private calculateAccountAge(createdAt: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // days
  }

  private estimateLastSaleDate(totalSales: number): string {
    if (totalSales === 0) {
      return 'No sales yet';
    }
    // Mock: assume last sale was within the last 7 days
    const daysAgo = Math.floor(Math.random() * 7);
    const lastSale = new Date();
    lastSale.setDate(lastSale.getDate() - daysAgo);
    return lastSale.toISOString();
  }
}
