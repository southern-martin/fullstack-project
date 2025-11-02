import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { GetSellerByIdUseCase } from '../get-seller-by-id.use-case';
import { AnalyticsHelperService } from '../../services/analytics-helper.service';

/**
 * Get Sales Trend Use Case
 * Returns time-series sales data for trend analysis
 *
 * Note: In production, this would aggregate actual sales data from orders table
 * Currently uses seller's aggregate totals to generate realistic mock data
 */
@Injectable()
export class GetSalesTrendUseCase {
  constructor(
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly analyticsHelper: AnalyticsHelperService,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(GetSalesTrendUseCase.name);
  }

  async execute(
    sellerId: number,
    period: 'day' | 'week' | 'month' | 'year' = 'day',
    customStartDate?: Date,
    customEndDate?: Date,
  ): Promise<any[]> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Calculate period dates
    const { startDate, endDate } = this.analyticsHelper.calculatePeriodDates(
      period,
      customStartDate,
      customEndDate,
    );

    // Calculate average sales and revenue
    const dailyAvgSales = seller.totalSales > 0 ? seller.totalSales / 30 : 0;
    const dailyAvgRevenue = seller.totalRevenue > 0 ? seller.totalRevenue / 30 : 0;

    // Generate trend data
    const trend = this.analyticsHelper.generateTrendData(
      startDate,
      endDate,
      period,
      dailyAvgSales,
      dailyAvgRevenue,
    );

    this.logger.debug(`Generated sales trend for seller ${sellerId}`, {
      period,
      dataPoints: trend.length,
    });

    return trend;
  }
}
