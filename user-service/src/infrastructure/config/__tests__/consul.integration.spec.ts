/**
 * Consul Integration Tests
 * 
 * Integration tests that connect to actual Consul instance
 * Tests end-to-end configuration loading
 * 
 * Prerequisites:
 * - Consul running at localhost:8500
 * - Configuration seeded via consul/seed-consul-config.sh
 */

import { ConsulConfigService } from '../consul.config';
import { createTypeOrmConsulConfig } from '../typeorm-consul.config';
import { createRedisConsulConfig } from '../redis-consul.config';

describe('Consul Integration Tests', () => {
  let consulService: ConsulConfigService;

  beforeAll(() => {
    consulService = ConsulConfigService.getInstance();
  });

  afterAll(() => {
    consulService.clearCache();
  });

  describe('Consul Health Check', () => {
    it('should verify Consul is running and accessible', async () => {
      const isHealthy = await consulService.healthCheck();
      
      expect(isHealthy).toBe(true);
    }, 10000);
  });

  describe('Service-Specific Configuration', () => {
    it('should load user-service port from Consul', async () => {
      const port = await consulService.getNumber('port');
      
      expect(port).toBe(3003);
      expect(typeof port).toBe('number');
    }, 10000);

    it('should load user-service service name from Consul', async () => {
      const serviceName = await consulService.get('service_name');
      
      expect(serviceName).toBe('user-service');
    }, 10000);

    it('should load user-service redis key prefix from Consul', async () => {
      const keyPrefix = await consulService.get('redis_key_prefix');
      
      expect(keyPrefix).toBe('user');
    }, 10000);
  });

  describe('Shared Infrastructure Configuration', () => {
    it('should load shared Redis host from Consul', async () => {
      const redisHost = await consulService.getShared('redis/host');
      
      expect(redisHost).toBe('shared-redis');
    }, 10000);

    it('should load shared Redis port from Consul', async () => {
      const redisPort = await consulService.getSharedNumber('redis/port');
      
      expect(redisPort).toBe(6379);
      expect(typeof redisPort).toBe('number');
    }, 10000);

    it('should load shared Redis password from Consul', async () => {
      const redisPassword = await consulService.getShared('redis/password');
      
      expect(redisPassword).toBe('shared_redis_password_2024');
    }, 10000);

    it('should load shared database host from Consul', async () => {
      const dbHost = await consulService.getShared('database/shared_user_db/host');
      
      expect(dbHost).toBe('shared-user-db');
    }, 10000);

    it('should load shared database port from Consul', async () => {
      const dbPort = await consulService.getSharedNumber('database/shared_user_db/port');
      
      expect(dbPort).toBe(3306);
      expect(typeof dbPort).toBe('number');
    }, 10000);

    it('should load shared database username from Consul', async () => {
      const dbUsername = await consulService.getShared('database/shared_user_db/username');
      
      expect(dbUsername).toBe('shared_user');
    }, 10000);

    it('should load shared database password from Consul', async () => {
      const dbPassword = await consulService.getShared('database/shared_user_db/password');
      
      expect(dbPassword).toBe('shared_password_2024');
    }, 10000);

    it('should load shared database name from Consul', async () => {
      const dbName = await consulService.getShared('database/shared_user_db/database');
      
      expect(dbName).toBe('shared_user_db');
    }, 10000);
  });

  describe('TypeORM Configuration from Consul', () => {
    it('should create TypeORM configuration from Consul', async () => {
      const typeOrmConfig = await createTypeOrmConsulConfig();
      
      expect(typeOrmConfig).toBeDefined();
      expect(typeOrmConfig.type).toBe('mysql');
      expect(typeOrmConfig.host).toBe('shared-user-db');
      expect(typeOrmConfig.port).toBe(3306);
      expect(typeOrmConfig.username).toBe('shared_user');
      expect(typeOrmConfig.password).toBe('shared_password_2024');
      expect(typeOrmConfig.database).toBe('shared_user_db');
      expect(typeOrmConfig.synchronize).toBe(false);
      expect(typeOrmConfig.entities).toBeDefined();
      expect(typeOrmConfig.entities?.length).toBeGreaterThan(0);
    }, 10000);
  });

  describe('Redis Configuration from Consul', () => {
    it('should create Redis configuration from Consul', async () => {
      const redisConfig = await createRedisConsulConfig();
      
      expect(redisConfig).toBeDefined();
      expect(redisConfig.host).toBe('shared-redis');
      expect(redisConfig.port).toBe(6379);
      expect(redisConfig.password).toBe('shared_redis_password_2024');
      expect(redisConfig.keyPrefix).toBe('user:');
      expect(redisConfig.db).toBe(0);
    }, 10000);
  });

  describe('Configuration Caching', () => {
    it('should cache configuration values', async () => {
      consulService.clearCache();
      
      // First load
      await consulService.get('service_name');
      const cachedKeys1 = consulService.getCachedKeys();
      
      expect(cachedKeys1.length).toBeGreaterThan(0);
      expect(cachedKeys1).toContain('config/user-service/service_name');
    }, 10000);

    it('should maintain cache across multiple reads', async () => {
      consulService.clearCache();
      
      await consulService.get('service_name');
      await consulService.getNumber('port');
      await consulService.getShared('redis/host');
      
      const cachedKeys = consulService.getCachedKeys();
      
      expect(cachedKeys.length).toBeGreaterThanOrEqual(3);
      expect(cachedKeys).toContain('config/user-service/service_name');
      expect(cachedKeys).toContain('config/user-service/port');
      expect(cachedKeys).toContain('config/shared/redis/host');
    }, 10000);
  });

  describe('Initialization', () => {
    it('should initialize and preload configurations', async () => {
      consulService.clearCache();
      
      await consulService.initialize();
      
      const cachedKeys = consulService.getCachedKeys();
      
      // Should have preloaded some configurations
      expect(cachedKeys.length).toBeGreaterThan(0);
      
      // Should include service-specific configs
      expect(cachedKeys.some(key => key.includes('user-service'))).toBe(true);
      
      // Should include shared configs
      expect(cachedKeys.some(key => key.includes('shared'))).toBe(true);
    }, 10000);
  });

  describe('Error Handling', () => {
    it('should return default value for non-existent key', async () => {
      const value = await consulService.get('nonexistent-key', 'default-value');
      
      expect(value).toBe('default-value');
    }, 10000);

    it('should handle invalid number gracefully', async () => {
      const value = await consulService.getNumber('service_name', 9999);
      
      // service_name is not a number, should return default
      expect(value).toBe(9999);
    }, 10000);
  });

  describe('Refresh Configuration', () => {
    it('should refresh specific configuration key', async () => {
      // Initial load
      const initialValue = await consulService.get('service_name');
      expect(initialValue).toBe('user-service');
      
      // Refresh the key
      const refreshedValue = await consulService.refresh('service_name');
      expect(refreshedValue).toBe('user-service');
      
      // Should still be cached
      const cachedKeys = consulService.getCachedKeys();
      expect(cachedKeys).toContain('config/user-service/service_name');
    }, 10000);
  });
});
