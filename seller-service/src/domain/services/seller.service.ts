import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import {
  SellerTypeOrmEntity,
  SellerStatus,
  VerificationStatus,
} from '../../infrastructure/database/typeorm/entities/seller.entity';
import { CreateSellerDto } from '../../application/dto/create-seller.dto';
import {
  UpdateSellerDto,
  UpdateSellerProfileDto,
  UpdateBankingInfoDto,
} from '../../application/dto/update-seller.dto';
import { SellerFilterDto } from '../../application/dto/seller-filter.dto';
import { UserServiceClient } from '../../infrastructure/external/user-service.client';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache.service';

@Injectable()
export class SellerService {
  private readonly CACHE_PREFIX = 'seller:';
  private readonly USER_CACHE_PREFIX = 'user:';

  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly userServiceClient: UserServiceClient,
    private readonly cacheService: RedisCacheService,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(SellerService.name);
  }

  /**
   * Register a new seller
   * Initial status: PENDING
   * Initial verification status: UNVERIFIED
   * Validates user exists via User Service
   */
  async registerSeller(
    userId: number,
    createSellerDto: CreateSellerDto,
  ): Promise<SellerTypeOrmEntity> {
    // Validate user exists and is active
    this.logger.debug(`Validating user ${userId} before seller registration`);
    const isValidUser = await this.userServiceClient.validateUser(userId);

    if (!isValidUser) {
      this.logger.warn(`Seller registration failed - User ${userId} not found or inactive`);
      throw new BadRequestException('User not found or inactive. Cannot create seller account.');
    }

    // Check if user already has a seller account
    const existingSeller = await this.sellerRepository.findByUserId(userId);
    if (existingSeller) {
      this.logger.warn(`Seller registration failed - User ${userId} already has seller account`);
      throw new ConflictException('User already has a seller account');
    }

    // Create seller with default status
    const sellerData = {
      ...createSellerDto,
      userId,
      status: SellerStatus.PENDING,
      verificationStatus: VerificationStatus.UNVERIFIED,
      rating: 0,
      totalReviews: 0,
      totalProducts: 0,
      totalSales: 0,
      totalRevenue: 0,
    };

    const seller = await this.sellerRepository.create(sellerData);

    // Cache the newly created seller
    await this.cacheSellerById(seller.id, seller);
    await this.cacheSellerByUserId(seller.userId, seller);

    // Log business event
    this.logger.logEvent('seller_registered', {
      sellerId: seller.id,
      userId: seller.userId,
      businessName: seller.businessName,
      status: seller.status,
      verificationStatus: seller.verificationStatus,
    }, userId.toString());

    this.logger.log(`Seller registered successfully for user ${userId}`);
    return seller;
  }

  /**
   * Get seller by ID
   * Uses cache for improved performance
   */
  async getSellerById(id: number): Promise<SellerTypeOrmEntity> {
    // Try cache first
    const cacheKey = `${this.CACHE_PREFIX}id:${id}`;
    const cached = await this.cacheService.get<SellerTypeOrmEntity>(cacheKey);

    if (cached) {
      this.logger.debug(`Cache hit for seller ID ${id}`);
      return cached;
    }

    // Fetch from database
    const seller = await this.sellerRepository.findById(id);
    if (!seller) {
      throw new NotFoundException(`Seller with id ${id} not found`);
    }

    // Cache the result
    await this.cacheSellerById(id, seller);

    return seller;
  }

  /**
   * Get seller by user ID
   * Uses cache for improved performance
   */
  async getSellerByUserId(userId: number): Promise<SellerTypeOrmEntity> {
    // Try cache first
    const cacheKey = `${this.CACHE_PREFIX}userId:${userId}`;
    const cached = await this.cacheService.get<SellerTypeOrmEntity>(cacheKey);

    if (cached) {
      this.logger.debug(`Cache hit for seller with user ID ${userId}`);
      return cached;
    }

    // Fetch from database
    const seller = await this.sellerRepository.findByUserId(userId);
    if (!seller) {
      throw new NotFoundException(`Seller not found for user ${userId}`);
    }

    // Cache the result
    await this.cacheSellerByUserId(userId, seller);

    return seller;
  }

  /**
   * Get all sellers with filters
   */
  async getAllSellers(
    filters: SellerFilterDto,
  ): Promise<{ sellers: SellerTypeOrmEntity[]; total: number }> {
    const sellers = await this.sellerRepository.findAll(filters);
    const total = await this.sellerRepository.count(filters);
    return { sellers, total };
  }

  /**
   * Update seller profile (seller can edit their own profile)
   */
  async updateProfile(
    sellerId: number,
    updateDto: UpdateSellerProfileDto,
  ): Promise<SellerTypeOrmEntity> {
    const seller = await this.getSellerById(sellerId);

    // Sellers can only update profile if not suspended
    if (seller.status === SellerStatus.SUSPENDED) {
      throw new BadRequestException('Cannot update profile while account is suspended');
    }

    const updated = await this.sellerRepository.update(sellerId, updateDto);

    // Invalidate cache after update
    await this.invalidateSellerCache(updated);

    return updated;
  }

  /**
   * Update banking information
   */
  async updateBankingInfo(
    sellerId: number,
    bankingDto: UpdateBankingInfoDto,
  ): Promise<SellerTypeOrmEntity> {
    const seller = await this.getSellerById(sellerId);

    if (seller.status === SellerStatus.SUSPENDED) {
      throw new BadRequestException('Cannot update banking info while account is suspended');
    }

    const updated = await this.sellerRepository.update(sellerId, bankingDto);

    // Invalidate cache after update
    await this.invalidateSellerCache(updated);

    return updated;
  }

  /**
   * Admin: Update seller (including commission rate)
   */
  async adminUpdateSeller(
    sellerId: number,
    updateDto: UpdateSellerDto,
  ): Promise<SellerTypeOrmEntity> {
    await this.getSellerById(sellerId);
    return await this.sellerRepository.update(sellerId, updateDto);
  }

  /**
   * Seller submits for verification
   * Changes verification status from UNVERIFIED to PENDING
   */
  async submitForVerification(sellerId: number): Promise<SellerTypeOrmEntity> {
    const seller = await this.getSellerById(sellerId);

    // Validate seller can submit for verification
    if (seller.verificationStatus === VerificationStatus.PENDING) {
      throw new BadRequestException('Verification is already pending');
    }

    if (seller.verificationStatus === VerificationStatus.VERIFIED) {
      throw new BadRequestException('Seller is already verified');
    }

    // Check required fields
    this.validateSellerForVerification(seller);

    return await this.sellerRepository.update(sellerId, {
      verificationStatus: VerificationStatus.PENDING,
    });
  }

  /**
   * Admin: Approve seller verification
   * Changes verification status to VERIFIED
   * Changes status to ACTIVE
   */
  async approveSeller(sellerId: number, approvedBy: number): Promise<SellerTypeOrmEntity> {
    const seller = await this.getSellerById(sellerId);

    if (seller.verificationStatus !== VerificationStatus.PENDING) {
      throw new BadRequestException('Seller must be in pending verification status');
    }

    const updated = await this.sellerRepository.update(sellerId, {
      verificationStatus: VerificationStatus.VERIFIED,
      status: SellerStatus.ACTIVE,
      verifiedAt: new Date(),
      verifiedBy: approvedBy,
      rejectionReason: null,
    });

    // Invalidate cache after update
    await this.invalidateSellerCache(updated);

    // Log business event
    this.logger.logEvent('seller_approved', {
      sellerId: updated.id,
      userId: updated.userId,
      businessName: updated.businessName,
      approvedBy,
      verifiedAt: updated.verifiedAt,
    }, approvedBy.toString());

    this.logger.log(`Seller ${sellerId} approved by admin ${approvedBy}`);

    return updated;
  }

  /**
   * Admin: Reject seller verification
   */
  async rejectSeller(sellerId: number, reason: string): Promise<SellerTypeOrmEntity> {
    const seller = await this.getSellerById(sellerId);

    if (seller.verificationStatus !== VerificationStatus.PENDING) {
      throw new BadRequestException('Seller must be in pending verification status');
    }

    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException('Rejection reason is required');
    }

    const updated = await this.sellerRepository.update(sellerId, {
      verificationStatus: VerificationStatus.REJECTED,
      status: SellerStatus.REJECTED,
      rejectionReason: reason,
    });

    // Invalidate cache after update
    await this.invalidateSellerCache(updated);

    // Log business event
    this.logger.logEvent('seller_rejected', {
      sellerId: updated.id,
      userId: updated.userId,
      businessName: updated.businessName,
      reason,
    });

    this.logger.warn(`Seller ${sellerId} rejected: ${reason}`);

    return updated;
  }

  /**
   * Admin: Suspend seller
   * Suspended sellers cannot perform any actions
   */
  async suspendSeller(sellerId: number, reason: string): Promise<SellerTypeOrmEntity> {
    const seller = await this.getSellerById(sellerId);

    if (seller.status === SellerStatus.SUSPENDED) {
      throw new BadRequestException('Seller is already suspended');
    }

    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException('Suspension reason is required');
    }

    const updated = await this.sellerRepository.update(sellerId, {
      status: SellerStatus.SUSPENDED,
      suspensionReason: reason,
    });

    // Invalidate cache after update
    await this.invalidateSellerCache(updated);

    // Log business event
    this.logger.logEvent('seller_suspended', {
      sellerId: updated.id,
      userId: updated.userId,
      businessName: updated.businessName,
      reason,
    });

    this.logger.warn(`Seller ${sellerId} suspended: ${reason}`);

    return updated;
  }

  /**
   * Admin: Reactivate suspended seller
   */
  async reactivateSeller(sellerId: number): Promise<SellerTypeOrmEntity> {
    const seller = await this.getSellerById(sellerId);

    if (seller.status !== SellerStatus.SUSPENDED) {
      throw new BadRequestException('Seller is not suspended');
    }

    if (seller.verificationStatus !== VerificationStatus.VERIFIED) {
      throw new BadRequestException('Seller must be verified to be reactivated');
    }

    const updated = await this.sellerRepository.update(sellerId, {
      status: SellerStatus.ACTIVE,
      suspensionReason: null,
    });

    // Invalidate cache after update
    await this.invalidateSellerCache(updated);

    // Log business event
    this.logger.logEvent('seller_reactivated', {
      sellerId: updated.id,
      userId: updated.userId,
      businessName: updated.businessName,
    });

    this.logger.log(`Seller ${sellerId} reactivated`);

    return updated;
  }

  /**
   * Get sellers pending verification (admin)
   */
  async getPendingVerification(): Promise<SellerTypeOrmEntity[]> {
    return await this.sellerRepository.findPendingVerification();
  }

  /**
   * Update seller metrics (called by other services)
   */
  async incrementProductCount(sellerId: number): Promise<void> {
    const seller = await this.getSellerById(sellerId);
    await this.sellerRepository.update(sellerId, {
      totalProducts: seller.totalProducts + 1,
    });
  }

  async decrementProductCount(sellerId: number): Promise<void> {
    const seller = await this.getSellerById(sellerId);
    if (seller.totalProducts > 0) {
      await this.sellerRepository.update(sellerId, {
        totalProducts: seller.totalProducts - 1,
      });
    }
  }

  async recordSale(sellerId: number, amount: number): Promise<void> {
    const seller = await this.getSellerById(sellerId);
    await this.sellerRepository.update(sellerId, {
      totalSales: seller.totalSales + 1,
      totalRevenue: seller.totalRevenue + amount,
    });
  }

  /**
   * Calculate and update seller rating
   */
  async updateRating(sellerId: number, newRating: number, reviewCount: number): Promise<void> {
    await this.sellerRepository.update(sellerId, {
      rating: newRating,
      totalReviews: reviewCount,
    });
  }

  /**
   * Delete seller (soft delete - change status)
   */
  async deleteSeller(sellerId: number): Promise<void> {
    const seller = await this.getSellerById(sellerId);

    // Can only delete if no products or sales
    if (seller.totalProducts > 0) {
      throw new BadRequestException('Cannot delete seller with existing products');
    }

    if (seller.totalSales > 0) {
      throw new BadRequestException('Cannot delete seller with sales history');
    }

    await this.sellerRepository.delete(sellerId);
  }

  /**
   * Validate seller has all required info for verification
   */
  private validateSellerForVerification(seller: SellerTypeOrmEntity): void {
    const missingFields: string[] = [];

    if (!seller.businessName) missingFields.push('Business Name');
    if (!seller.businessEmail) missingFields.push('Business Email');
    if (!seller.businessPhone) missingFields.push('Business Phone');
    if (!seller.businessAddress) missingFields.push('Business Address');
    if (!seller.businessCity) missingFields.push('Business City');
    if (!seller.businessState) missingFields.push('Business State/Province');
    if (!seller.businessCountry) missingFields.push('Business Country');

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Cannot submit for verification. Missing required fields: ${missingFields.join(', ')}`,
      );
    }
  }

  /**
   * Check if seller can perform actions (active and verified)
   */
  async validateSellerActive(sellerId: number): Promise<boolean> {
    const seller = await this.getSellerById(sellerId);

    if (seller.status !== SellerStatus.ACTIVE) {
      throw new BadRequestException(
        `Seller account is ${seller.status}. Only active sellers can perform this action.`,
      );
    }

    if (seller.verificationStatus !== VerificationStatus.VERIFIED) {
      throw new BadRequestException('Seller must be verified to perform this action');
    }

    return true;
  }

  /**
   * Get analytics overview for a seller
   * Returns comprehensive performance metrics for the specified period
   */
  async getSellerAnalytics(
    sellerId: number,
    period: 'day' | 'week' | 'month' | 'year' | 'all_time' = 'all_time',
    customStartDate?: Date,
    customEndDate?: Date,
  ): Promise<any> {
    const seller = await this.getSellerById(sellerId);

    // Calculate period dates
    const { startDate, endDate } = this.calculatePeriodDates(period, customStartDate, customEndDate);

    // Calculate period-specific metrics
    // Note: In production, these would query a sales/orders table
    // For now, we'll use the seller's aggregate fields
    const periodRevenue = seller.totalRevenue;
    const periodSales = seller.totalSales;
    const averageOrderValue = periodSales > 0 ? periodRevenue / periodSales : 0;

    // Calculate conversion rate (mock data - in production, calculate from views/orders)
    const conversionRate = periodSales > 0 ? Math.min((periodSales / 100) * 100, 100) : 0;

    this.logger.debug(`Fetched analytics for seller ${sellerId}`, {
      period,
      periodRevenue,
      periodSales,
    });

    return {
      sellerId: seller.id,
      businessName: seller.businessName,
      status: seller.status,
      verificationStatus: seller.verificationStatus,
      totalProducts: seller.totalProducts,
      totalSales: seller.totalSales,
      totalRevenue: seller.totalRevenue,
      rating: seller.rating,
      totalReviews: seller.totalReviews,
      joinedDate: seller.createdAt,
      verifiedAt: seller.verifiedAt,
      period,
      periodStart: startDate,
      periodEnd: endDate,
      periodRevenue,
      periodSales,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      conversionRate: parseFloat(conversionRate.toFixed(2)),
    };
  }

  /**
   * Get sales trend data for a seller
   * Returns time-series data showing sales performance over time
   */
  async getSalesTrend(
    sellerId: number,
    period: 'day' | 'week' | 'month' | 'year' = 'month',
    customStartDate?: Date,
    customEndDate?: Date,
  ): Promise<any[]> {
    const seller = await this.getSellerById(sellerId);

    const { startDate, endDate } = this.calculatePeriodDates(period, customStartDate, customEndDate);

    // Generate trend data points
    // Note: In production, this would aggregate actual sales data from orders table
    const trend: any[] = [];
    const currentDate = new Date(startDate);
    const dailyAvgSales = seller.totalSales > 0 ? seller.totalSales / 30 : 0;
    const dailyAvgRevenue = seller.totalRevenue > 0 ? seller.totalRevenue / 30 : 0;

    while (currentDate <= endDate) {
      // Generate realistic-looking mock data based on seller's actual totals
      const variance = 0.3; // 30% variance
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

    this.logger.debug(`Generated sales trend for seller ${sellerId}`, {
      period,
      dataPoints: trend.length,
    });

    return trend;
  }

  /**
   * Get product performance analytics
   * Returns insights about seller's product catalog
   */
  async getProductPerformance(sellerId: number): Promise<any> {
    const seller = await this.getSellerById(sellerId);

    // Note: In production, these would query product and order tables
    // For now, using mock data based on seller's aggregate fields
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

  /**
   * Get revenue breakdown analytics
   * Returns detailed revenue analysis
   */
  async getRevenueBreakdown(sellerId: number, period: string = 'month'): Promise<any> {
    const seller = await this.getSellerById(sellerId);

    // Note: In production, these would aggregate from orders table
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

  /**
   * Calculate start and end dates for analytics period
   * Supports standard periods and custom date ranges
   */
  private calculatePeriodDates(
    period: string,
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
   * Cache seller by ID
   */
  private async cacheSellerById(id: number, seller: SellerTypeOrmEntity): Promise<void> {
    const cacheKey = `${this.CACHE_PREFIX}id:${id}`;
    const ttl = 300; // 5 minutes
    await this.cacheService.set(cacheKey, seller, ttl);
  }

  /**
   * Cache seller by user ID
   */
  private async cacheSellerByUserId(userId: number, seller: SellerTypeOrmEntity): Promise<void> {
    const cacheKey = `${this.CACHE_PREFIX}userId:${userId}`;
    const ttl = 300; // 5 minutes
    await this.cacheService.set(cacheKey, seller, ttl);
  }

  /**
   * Invalidate seller cache
   */
  private async invalidateSellerCache(seller: SellerTypeOrmEntity): Promise<void> {
    await this.cacheService.delete(`${this.CACHE_PREFIX}id:${seller.id}`);
    await this.cacheService.delete(`${this.CACHE_PREFIX}userId:${seller.userId}`);
  }
}
