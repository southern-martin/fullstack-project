import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache.service';
import { SellerTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/seller.entity';

/**
 * Seller Cache Service
 * Handles caching logic for seller entities
 * Centralized cache management for reuse across use cases
 */
@Injectable()
export class SellerCacheService {
  private readonly CACHE_PREFIX = 'seller:';
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(private readonly cacheService: RedisCacheService) {}

  /**
   * Get seller from cache by ID
   */
  async getById(id: number): Promise<SellerTypeOrmEntity | null> {
    const cacheKey = `${this.CACHE_PREFIX}id:${id}`;
    return await this.cacheService.get<SellerTypeOrmEntity>(cacheKey);
  }

  /**
   * Get seller from cache by user ID
   */
  async getByUserId(userId: number): Promise<SellerTypeOrmEntity | null> {
    const cacheKey = `${this.CACHE_PREFIX}userId:${userId}`;
    return await this.cacheService.get<SellerTypeOrmEntity>(cacheKey);
  }

  /**
   * Cache seller by ID
   */
  async setById(id: number, seller: SellerTypeOrmEntity): Promise<void> {
    const cacheKey = `${this.CACHE_PREFIX}id:${id}`;
    await this.cacheService.set(cacheKey, seller, this.CACHE_TTL);
  }

  /**
   * Cache seller by user ID
   */
  async setByUserId(userId: number, seller: SellerTypeOrmEntity): Promise<void> {
    const cacheKey = `${this.CACHE_PREFIX}userId:${userId}`;
    await this.cacheService.set(cacheKey, seller, this.CACHE_TTL);
  }

  /**
   * Cache seller (both by ID and user ID)
   */
  async cacheSeller(seller: SellerTypeOrmEntity): Promise<void> {
    await Promise.all([
      this.setById(seller.id, seller),
      this.setByUserId(seller.userId, seller),
    ]);
  }

  /**
   * Invalidate seller cache
   */
  async invalidate(seller: SellerTypeOrmEntity): Promise<void> {
    await Promise.all([
      this.cacheService.delete(`${this.CACHE_PREFIX}id:${seller.id}`),
      this.cacheService.delete(`${this.CACHE_PREFIX}userId:${seller.userId}`),
    ]);
  }

  /**
   * Invalidate by seller ID
   */
  async invalidateById(id: number, userId: number): Promise<void> {
    await Promise.all([
      this.cacheService.delete(`${this.CACHE_PREFIX}id:${id}`),
      this.cacheService.delete(`${this.CACHE_PREFIX}userId:${userId}`),
    ]);
  }
}
