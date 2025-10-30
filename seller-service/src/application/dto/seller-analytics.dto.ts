import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Analytics Period Enum
 * Defines time periods for analytics aggregation
 */
export enum AnalyticsPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL_TIME = 'all_time',
}

/**
 * Seller Analytics Overview DTO
 * Comprehensive analytics data for a seller account
 */
export class SellerAnalyticsDto {
  @ApiProperty({ description: 'Seller ID' })
  sellerId: number;

  @ApiProperty({ description: 'Business name' })
  businessName: string;

  @ApiProperty({ description: 'Current seller status' })
  status: string;

  @ApiProperty({ description: 'Verification status' })
  verificationStatus: string;

  @ApiProperty({ description: 'Total number of products listed' })
  totalProducts: number;

  @ApiProperty({ description: 'Total number of sales completed' })
  totalSales: number;

  @ApiProperty({ description: 'Total revenue generated (USD)' })
  totalRevenue: number;

  @ApiProperty({ description: 'Average rating (0-5)' })
  rating: number;

  @ApiProperty({ description: 'Total number of reviews received' })
  totalReviews: number;

  @ApiProperty({ description: 'Account creation date' })
  joinedDate: Date;

  @ApiProperty({ description: 'Last verification date', required: false })
  verifiedAt?: Date;

  @ApiProperty({ description: 'Analytics period', enum: AnalyticsPeriod })
  period: AnalyticsPeriod;

  @ApiProperty({ description: 'Period start date' })
  periodStart: Date;

  @ApiProperty({ description: 'Period end date' })
  periodEnd: Date;

  @ApiProperty({ description: 'Revenue during the period' })
  periodRevenue: number;

  @ApiProperty({ description: 'Sales during the period' })
  periodSales: number;

  @ApiProperty({ description: 'Average order value during the period' })
  averageOrderValue: number;

  @ApiProperty({ description: 'Conversion rate percentage (0-100)' })
  conversionRate: number;
}

/**
 * Sales Trend Data Point DTO
 * Represents sales data for a specific date
 */
export class SalesTrendDto {
  @ApiProperty({ description: 'Date for this data point (YYYY-MM-DD)' })
  date: string;

  @ApiProperty({ description: 'Number of sales on this date' })
  sales: number;

  @ApiProperty({ description: 'Revenue generated on this date (USD)' })
  revenue: number;

  @ApiProperty({ description: 'Number of orders on this date' })
  orders: number;

  @ApiProperty({ description: 'Average order value for this date' })
  averageOrderValue: number;
}

/**
 * Top Product DTO
 * Represents a seller's top-performing product
 */
export class TopProductDto {
  @ApiProperty({ description: 'Product ID' })
  productId: number;

  @ApiProperty({ description: 'Product name' })
  productName: string;

  @ApiProperty({ description: 'Number of units sold' })
  unitsSold: number;

  @ApiProperty({ description: 'Total revenue from this product (USD)' })
  revenue: number;

  @ApiProperty({ description: 'Product rating (0-5)' })
  rating: number;

  @ApiProperty({ description: 'Number of reviews' })
  reviewCount: number;
}

/**
 * Query Parameters for Analytics Endpoints
 */
export class AnalyticsQueryDto {
  @ApiProperty({
    description: 'Analytics period',
    enum: AnalyticsPeriod,
    default: AnalyticsPeriod.MONTH,
    required: false,
  })
  @IsEnum(AnalyticsPeriod)
  @IsOptional()
  period?: AnalyticsPeriod = AnalyticsPeriod.MONTH;

  @ApiProperty({
    description: 'Custom start date (ISO 8601 format)',
    required: false,
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'Custom end date (ISO 8601 format)',
    required: false,
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

/**
 * Product Performance DTO
 * Detailed analytics for seller's product catalog
 */
export class ProductPerformanceDto {
  @ApiProperty({ description: 'Total products listed' })
  totalProducts: number;

  @ApiProperty({ description: 'Active products' })
  activeProducts: number;

  @ApiProperty({ description: 'Out of stock products' })
  outOfStockProducts: number;

  @ApiProperty({ description: 'Top selling products', type: [TopProductDto] })
  topProducts: TopProductDto[];

  @ApiProperty({ description: 'Average product rating' })
  averageRating: number;

  @ApiProperty({ description: 'Total product views' })
  totalViews: number;

  @ApiProperty({ description: 'Products added this period' })
  newProductsThisPeriod: number;
}

/**
 * Revenue Breakdown DTO
 * Detailed revenue analytics by category, payment method, etc.
 */
export class RevenueBreakdownDto {
  @ApiProperty({ description: 'Total revenue (USD)' })
  totalRevenue: number;

  @ApiProperty({ description: 'Revenue from completed orders' })
  completedRevenue: number;

  @ApiProperty({ description: 'Revenue from pending orders' })
  pendingRevenue: number;

  @ApiProperty({ description: 'Refunded amount' })
  refundedAmount: number;

  @ApiProperty({ description: 'Average order value' })
  averageOrderValue: number;

  @ApiProperty({ description: 'Highest order value' })
  highestOrderValue: number;

  @ApiProperty({ description: 'Lowest order value' })
  lowestOrderValue: number;

  @ApiProperty({
    description: 'Revenue by category',
    example: { Electronics: 5000, Clothing: 3000 },
  })
  revenueByCategory: Record<string, number>;
}
