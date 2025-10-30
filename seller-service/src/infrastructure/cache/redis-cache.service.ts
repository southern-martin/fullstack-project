import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Redis Cache Service
 *
 * Provides caching functionality using Redis.
 * Handles connection management and basic cache operations.
 */
@Injectable()
export class RedisCacheService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly client: Redis;
  private readonly defaultTtl: number;
  private readonly isEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isEnabled = this.configService.get<boolean>('CACHE_ENABLED', true);
    this.defaultTtl = this.configService.get<number>('REDIS_TTL', 3600);

    if (this.isEnabled) {
      this.client = new Redis({
        host: this.configService.get<string>('REDIS_HOST', 'localhost'),
        port: this.configService.get<number>('REDIS_PORT', 6379),
        password: this.configService.get<string>('REDIS_PASSWORD'),
        db: this.configService.get<number>('REDIS_DB', 0),
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          this.logger.warn(`Redis connection retry attempt ${times}`);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });

      this.client.on('connect', () => {
        this.logger.log('Redis client connected');
      });

      this.client.on('error', (error) => {
        this.logger.error(`Redis client error: ${error.message}`);
      });

      this.client.on('ready', () => {
        this.logger.log('Redis client ready');
      });
    } else {
      this.logger.warn('Redis cache is disabled');
    }
  }

  /**
   * Get value from cache
   *
   * @param key - Cache key
   * @returns Promise<T | null> - Cached value or null
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isEnabled) return null;

    try {
      const value = await this.client.get(key);
      if (!value) return null;

      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Failed to get cache key ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * Set value in cache
   *
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in seconds (optional)
   * @returns Promise<boolean> - True if successful
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    if (!this.isEnabled) return false;

    try {
      const serialized = JSON.stringify(value);
      const expiration = ttl || this.defaultTtl;

      await this.client.setex(key, expiration, serialized);
      return true;
    } catch (error) {
      this.logger.error(`Failed to set cache key ${key}: ${error.message}`);
      return false;
    }
  }

  /**
   * Delete value from cache
   *
   * @param key - Cache key
   * @returns Promise<boolean> - True if key was deleted
   */
  async delete(key: string): Promise<boolean> {
    if (!this.isEnabled) return false;

    try {
      const result = await this.client.del(key);
      return result > 0;
    } catch (error) {
      this.logger.error(`Failed to delete cache key ${key}: ${error.message}`);
      return false;
    }
  }

  /**
   * Delete multiple keys matching a pattern
   *
   * @param pattern - Pattern to match (e.g., 'user:*')
   * @returns Promise<number> - Number of keys deleted
   */
  async deleteByPattern(pattern: string): Promise<number> {
    if (!this.isEnabled) return 0;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;

      const result = await this.client.del(...keys);
      this.logger.debug(`Deleted ${result} keys matching pattern: ${pattern}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete keys by pattern ${pattern}: ${error.message}`);
      return 0;
    }
  }

  /**
   * Check if key exists in cache
   *
   * @param key - Cache key
   * @returns Promise<boolean> - True if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isEnabled) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to check existence of key ${key}: ${error.message}`);
      return false;
    }
  }

  /**
   * Clear all cache
   *
   * @returns Promise<boolean> - True if successful
   */
  async clear(): Promise<boolean> {
    if (!this.isEnabled) return false;

    try {
      await this.client.flushdb();
      this.logger.log('Cache cleared');
      return true;
    } catch (error) {
      this.logger.error(`Failed to clear cache: ${error.message}`);
      return false;
    }
  }

  /**
   * Get cache statistics
   *
   * @returns Promise<object> - Cache statistics
   */
  async getStats(): Promise<any> {
    if (!this.isEnabled) {
      return { enabled: false };
    }

    try {
      const info = await this.client.info('stats');
      const dbSize = await this.client.dbsize();

      return {
        enabled: true,
        dbSize,
        info,
      };
    } catch (error) {
      this.logger.error(`Failed to get cache stats: ${error.message}`);
      return { enabled: true, error: error.message };
    }
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy() {
    if (this.isEnabled && this.client) {
      await this.client.quit();
      this.logger.log('Redis client disconnected');
    }
  }
}
