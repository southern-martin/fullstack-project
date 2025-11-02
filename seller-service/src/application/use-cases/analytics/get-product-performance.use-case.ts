import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { GetSellerByIdUseCase } from '../get-seller-by-id.use-case';

/**
 * Get Product Performance Use Case
 * Returns insights about seller's product catalog
 *
 * Note: In production, these would query product and order tables
 * Currently uses seller's aggregate totals to generate mock data
 */
@Injectable()
export class GetProductPerformanceUseCase {
  constructor(
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(GetProductPerformanceUseCase.name);
  }

  async execute(sellerId: number): Promise<any> {
    // Get seller
    const seller = await this.getSellerByIdUseCase.execute(sellerId);

    // Calculate product metrics
    const totalProducts = seller.totalProducts;
    const activeProducts = Math.floor(totalProducts * 0.85); // Assume 85% active
    const outOfStockProducts = totalProducts - activeProducts;

    // Generate mock top products
    const topProducts = [];
    const topProductCount = Math.min(5, totalProducts);
    for (let i = 0; i < topProductCount; i++) {
      topProducts.push({
        productId: 1000 + i,
        productName: `Product ${i + 1}`,
        unitsSold: Math.floor(Math.random() * 100) + 10,
        revenue: parseFloat((Math.random() * 10000 + 1000).toFixed(2)),
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
        reviewCount: Math.floor(Math.random() * 50) + 5,
      });
    }

    // Sort by revenue
    topProducts.sort((a, b) => b.revenue - a.revenue);

    this.logger.debug(`Fetched product performance for seller ${sellerId}`, {
      totalProducts,
      activeProducts,
    });

    return {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      topProducts,
      averageRating: seller.rating,
      totalViews: Math.floor(seller.totalSales * 10), // Mock: 10x sales
      newProductsThisPeriod: Math.floor(totalProducts * 0.1), // Mock: 10% new
    };
  }
}
