import { Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

export interface CacheSetOptions {
  ttl?: number; // seconds
}

/**
 * Cache Error Handling Strategy
 * Defines how the service should handle Redis errors
 */
export enum CacheErrorStrategy {
  /**
   * Throw exceptions when errors occur
   * Use in critical paths where cache must work
   */
  THROW = 'throw',
  
  /**
   * Log errors and continue (default)
   * Best for most use cases - degrades gracefully
   */
  LOG_AND_CONTINUE = 'log_continue',
  
  /**
   * Return fallback values on error
   * Useful when you want to provide default values
   */
  FALLBACK = 'fallback'
}

export interface CacheServiceOptions {
  prefix?: string;
  errorStrategy?: CacheErrorStrategy;
  redisUrl?: string;
}

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);
  private client: RedisClientType;
  private readonly prefix: string;
  private readonly errorStrategy: CacheErrorStrategy;

  constructor(options: CacheServiceOptions = {}) {
    this.prefix = options.prefix || 'cache:';
    this.errorStrategy = options.errorStrategy || CacheErrorStrategy.LOG_AND_CONTINUE;
    
    this.client = createClient({
      url: options.redisUrl || process.env.REDIS_URL || 'redis://shared-redis:6379',
    });
    
    this.client.on('error', (err) => this.handleError('Redis connection error', err));
    this.client.connect().catch((err) => this.handleError('Redis connect error', err));
  }

  /**
   * Handle errors based on configured strategy
   */
  private handleError(message: string, error: any, throwError = false): void {
    const errorMessage = `${message}: ${error?.message || error}`;
    
    switch (this.errorStrategy) {
      case CacheErrorStrategy.THROW:
        this.logger.error(errorMessage, error?.stack);
        if (throwError) {
          throw new Error(errorMessage);
        }
        break;
        
      case CacheErrorStrategy.LOG_AND_CONTINUE:
        this.logger.warn(errorMessage);
        break;
        
      case CacheErrorStrategy.FALLBACK:
        this.logger.debug(errorMessage);
        break;
        
      default:
        this.logger.warn(errorMessage);
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Get a value from cache
   * @param key - Cache key
   * @returns Cached value or null
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(this.getKey(key));
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (err) {
      this.handleError(`Redis get error for key: ${key}`, err, this.errorStrategy === CacheErrorStrategy.THROW);
      return null;
    }
  }

  /**
   * Set a value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param options - Cache options (TTL, etc.)
   */
  async set<T = any>(key: string, value: T, options?: CacheSetOptions): Promise<void> {
    try {
      const str = JSON.stringify(value);
      if (options?.ttl) {
        await this.client.set(this.getKey(key), str, { EX: options.ttl });
      } else {
        await this.client.set(this.getKey(key), str);
      }
    } catch (err) {
      this.handleError(`Redis set error for key: ${key}`, err, this.errorStrategy === CacheErrorStrategy.THROW);
    }
  }

  /**
   * Delete a specific key from cache
   * @param key - Cache key to delete
   */
  async del(key: string): Promise<void> {
    try {
      await this.client.del(this.getKey(key));
    } catch (err) {
      this.handleError(`Redis del error for key: ${key}`, err, this.errorStrategy === CacheErrorStrategy.THROW);
    }
  }

  /**
   * Invalidate all keys matching a pattern
   * @param pattern - Pattern to match (supports wildcards)
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(this.getKey(pattern));
      if (keys.length > 0) {
        await this.client.del(keys);
        this.logger.debug(`Invalidated ${keys.length} keys matching pattern: ${pattern}`);
      }
    } catch (err) {
      this.handleError(`Redis invalidatePattern error for pattern: ${pattern}`, err, this.errorStrategy === CacheErrorStrategy.THROW);
    }
  }

  /**
   * Check if cache is healthy/connected
   * @returns true if connected, false otherwise
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (err) {
      this.handleError('Redis health check failed', err, false);
      return false;
    }
  }

  /**
   * Get cache statistics
   * @returns Cache info and statistics
   */
  async getStats(): Promise<Record<string, any>> {
    try {
      const info = await this.client.info();
      return { 
        connected: true,
        info: info.split('\r\n').reduce((acc, line) => {
          const [key, value] = line.split(':');
          if (key && value) acc[key] = value;
          return acc;
        }, {} as Record<string, string>)
      };
    } catch (err) {
      this.handleError('Redis stats error', err, false);
      return { connected: false, error: err?.message };
    }
  }

  /**
   * Gracefully disconnect from Redis
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.quit();
      this.logger.log('Redis client disconnected gracefully');
    } catch (err) {
      this.handleError('Redis disconnect error', err, false);
    }
  }
}
