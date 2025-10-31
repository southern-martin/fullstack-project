/**
 * Redis Configuration with Consul Integration
 *
 * This module provides Redis configuration that reads from Consul KV store
 * instead of environment variables.
 *
 * Week 2 Implementation: Redis Configuration from Consul
 */

import { WinstonLoggerService } from '@shared/infrastructure/logging';
import { ConsulConfigService } from './consul.config';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

/**
 * Create Redis configuration from Consul
 *
 * This function creates Redis client options by reading configuration
 * from Consul KV store. Falls back to environment variables if Consul
 * is unavailable.
 */
export async function createRedisConsulConfig(): Promise<RedisConfig> {
  const consulConfig = ConsulConfigService.getInstance();
  const logger = new WinstonLoggerService();
  logger.setContext('RedisConsulConfig');

  try {
    // Initialize Consul if not already initialized
    if (!consulConfig['initialized']) {
      await consulConfig.initialize();
    }

    // Read Redis configuration from Consul (shared infrastructure)
    const redisHost = await consulConfig.getShared(
      'redis/host',
      process.env.REDIS_HOST || 'localhost',
    );
    const redisPort = await consulConfig.getSharedNumber(
      'redis/port',
      parseInt(process.env.REDIS_PORT || '6379'),
    );
    const redisPassword = await consulConfig.getShared(
      'redis/password',
      process.env.REDIS_PASSWORD || '',
    );

    // Read service-specific Redis key prefix
    const keyPrefix = await consulConfig.get(
      'redis_key_prefix',
      process.env.REDIS_KEY_PREFIX || 'user',
    );

    logger.log('Configuration loaded from Consul', {
      host: redisHost,
      port: redisPort,
      keyPrefix: keyPrefix,
    });

    return {
      host: redisHost,
      port: redisPort,
      password: redisPassword || undefined,
      db: 0,
      keyPrefix: `${keyPrefix}:`,
    };
  } catch (error) {
    logger.error(
      'Failed to load configuration from Consul, falling back to environment variables',
      error instanceof Error ? error.stack : String(error),
    );

    // Fallback to environment variables
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: 0,
      keyPrefix: `${process.env.REDIS_KEY_PREFIX || 'user'}:`,
    };
  }
}

/**
 * Get Redis configuration synchronously (for compatibility)
 */
export function getRedisConfigSync(): RedisConfig {
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    db: 0,
    keyPrefix: `${process.env.REDIS_KEY_PREFIX || 'user'}:`,
  };
}
