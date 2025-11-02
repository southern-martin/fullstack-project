import { Injectable } from '@nestjs/common';

/**
 * Analytics Helper Service
 * Shared utilities for calculating analytics periods and date ranges
 */
@Injectable()
export class AnalyticsHelperService {
  /**
   * Calculate start and end dates for analytics period
   * Supports standard periods (day, week, month, year, all_time) and custom date ranges
   */
  calculatePeriodDates(
    period: 'day' | 'week' | 'month' | 'year' | 'all_time',
    customStartDate?: Date,
    customEndDate?: Date,
  ): { startDate: Date; endDate: Date } {
    // If custom dates provided, use them
    if (customStartDate && customEndDate) {
      return {
        startDate: new Date(customStartDate),
        endDate: new Date(customEndDate),
      };
    }

    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'all_time':
      default:
        startDate.setFullYear(2020, 0, 1); // Arbitrary start date
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    return { startDate, endDate };
  }

  /**
   * Generate mock trend data points
   * Note: In production, this would aggregate actual sales data
   */
  generateTrendData(
    startDate: Date,
    endDate: Date,
    period: 'day' | 'week' | 'month' | 'year',
    dailyAvgSales: number,
    dailyAvgRevenue: number,
  ): any[] {
    const trend: any[] = [];
    const currentDate = new Date(startDate);
    const variance = 0.3; // 30% variance for realistic-looking data

    while (currentDate <= endDate) {
      const randomFactor = 1 + (Math.random() - 0.5) * variance;

      const sales = Math.max(0, Math.floor(dailyAvgSales * randomFactor));
      const revenue = Math.max(0, parseFloat((dailyAvgRevenue * randomFactor).toFixed(2)));
      const orders = sales;
      const avgOrderValue = orders > 0 ? parseFloat((revenue / orders).toFixed(2)) : 0;

      trend.push({
        date: currentDate.toISOString().split('T')[0],
        sales,
        revenue,
        orders,
        averageOrderValue: avgOrderValue,
      });

      // Increment date based on period
      if (period === 'day') {
        currentDate.setHours(currentDate.getHours() + 1);
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Safety limit to prevent infinite loops
      if (trend.length > 365) break;
    }

    return trend;
  }

  /**
   * Calculate conversion rate
   * Mock implementation - in production, calculate from actual views/orders data
   */
  calculateConversionRate(sales: number): number {
    return sales > 0 ? Math.min((sales / 100) * 100, 100) : 0;
  }
}
