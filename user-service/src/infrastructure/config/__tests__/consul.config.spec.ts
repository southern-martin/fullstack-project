/**
 * Consul Configuration Service Tests
 * 
 * Tests the ConsulConfigService for proper functionality including:
 * - Singleton pattern
 * - Configuration retrieval
 * - Caching behavior
 * - Error handling and fallbacks
 * - Health checks
 */

import axios from 'axios';
import { ConsulConfigService } from '../consul.config';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ConsulConfigService', () => {
  let consulService: ConsulConfigService;
  let mockAxiosInstance: any;

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();

    // Mock axios.create to return a mock instance
    mockAxiosInstance = {
      get: jest.fn(),
      defaults: {
        baseURL: 'http://localhost:8500/v1/kv',
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    mockedAxios.get.mockResolvedValue({ status: 200, data: '' } as any);

    // Get fresh instance for each test
    consulService = ConsulConfigService.getInstance();
  });

  afterEach(() => {
    // Clear cache after each test
    if (consulService) {
      consulService.clearCache();
    }
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance when getInstance is called multiple times', () => {
      const instance1 = ConsulConfigService.getInstance();
      const instance2 = ConsulConfigService.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should create axios client with correct configuration', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'http://localhost:8500/v1/kv',
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  describe('Configuration Retrieval', () => {
    it('should retrieve service-specific configuration value', async () => {
      const mockValue = 'user-service';
      const encodedValue = Buffer.from(mockValue).toString('base64');

      mockAxiosInstance.get.mockResolvedValue({
        data: [{ Key: 'config/user-service/service_name', Value: encodedValue }],
      });

      const result = await consulService.get('service_name');

      expect(result).toBe(mockValue);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/config/user-service/service_name');
    });

    it('should retrieve shared infrastructure configuration value', async () => {
      const mockValue = 'shared-redis';
      const encodedValue = Buffer.from(mockValue).toString('base64');

      mockAxiosInstance.get.mockResolvedValue({
        data: [{ Key: 'config/shared/redis/host', Value: encodedValue }],
      });

      const result = await consulService.getShared('redis/host');

      expect(result).toBe(mockValue);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/config/shared/redis/host');
    });

    it('should retrieve number configuration value', async () => {
      const mockValue = '3003';
      const encodedValue = Buffer.from(mockValue).toString('base64');

      mockAxiosInstance.get.mockResolvedValue({
        data: [{ Key: 'config/user-service/port', Value: encodedValue }],
      });

      const result = await consulService.getNumber('port');

      expect(result).toBe(3003);
      expect(typeof result).toBe('number');
    });

    it('should retrieve shared number configuration value', async () => {
      const mockValue = '6379';
      const encodedValue = Buffer.from(mockValue).toString('base64');

      mockAxiosInstance.get.mockResolvedValue({
        data: [{ Key: 'config/shared/redis/port', Value: encodedValue }],
      });

      const result = await consulService.getSharedNumber('redis/port');

      expect(result).toBe(6379);
      expect(typeof result).toBe('number');
    });

    it('should retrieve boolean configuration value (true)', async () => {
      const mockValue = 'true';
      const encodedValue = Buffer.from(mockValue).toString('base64');

      mockAxiosInstance.get.mockResolvedValue({
        data: [{ Key: 'config/user-service/enabled', Value: encodedValue }],
      });

      const result = await consulService.getBoolean('enabled');

      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it('should retrieve boolean configuration value (false)', async () => {
      const mockValue = 'false';
      const encodedValue = Buffer.from(mockValue).toString('base64');

      mockAxiosInstance.get.mockResolvedValue({
        data: [{ Key: 'config/user-service/enabled', Value: encodedValue }],
      });

      const result = await consulService.getBoolean('enabled');

      expect(result).toBe(false);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Caching Behavior', () => {
    it('should cache configuration values after first retrieval', async () => {
      const mockValue = 'user-service';
      const encodedValue = Buffer.from(mockValue).toString('base64');

      mockAxiosInstance.get.mockResolvedValue({
        data: [{ Key: 'config/user-service/service_name', Value: encodedValue }],
      });

      // First call should hit Consul
      const result1 = await consulService.get('service_name');
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const result2 = await consulService.get('service_name');
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1); // Still only 1 call
      expect(result1).toBe(result2);
    });

    it('should return cached keys', async () => {
      const mockValue = 'user-service';
      const encodedValue = Buffer.from(mockValue).toString('base64');

      mockAxiosInstance.get.mockResolvedValue({
        data: [{ Key: 'config/user-service/service_name', Value: encodedValue }],
      });

      await consulService.get('service_name');
      const cachedKeys = consulService.getCachedKeys();

      expect(cachedKeys).toContain('config/user-service/service_name');
      expect(cachedKeys.length).toBeGreaterThan(0);
    });

    it('should clear cache when clearCache is called', async () => {
      const mockValue = 'user-service';
      const encodedValue = Buffer.from(mockValue).toString('base64');

      mockAxiosInstance.get.mockResolvedValue({
        data: [{ Key: 'config/user-service/service_name', Value: encodedValue }],
      });

      await consulService.get('service_name');
      expect(consulService.getCachedKeys().length).toBeGreaterThan(0);

      consulService.clearCache();
      expect(consulService.getCachedKeys().length).toBe(0);
    });

    it('should refresh specific configuration key', async () => {
      const mockValue1 = 'value1';
      const mockValue2 = 'value2';
      const encodedValue1 = Buffer.from(mockValue1).toString('base64');
      const encodedValue2 = Buffer.from(mockValue2).toString('base64');

      // First call
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: [{ Key: 'config/user-service/test', Value: encodedValue1 }],
      });

      const result1 = await consulService.get('test');
      expect(result1).toBe(mockValue1);

      // Refresh call should fetch new value
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: [{ Key: 'config/user-service/test', Value: encodedValue2 }],
      });

      const result2 = await consulService.refresh('test');
      expect(result2).toBe(mockValue2);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling and Fallbacks', () => {
    it('should return default value when key not found', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: [] });

      const result = await consulService.get('nonexistent', 'default-value');

      expect(result).toBe('default-value');
    });

    it('should throw error when key not found and no default provided', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: [] });

      await expect(consulService.get('nonexistent')).rejects.toThrow(
        'Configuration key not found: config/user-service/nonexistent'
      );
    });

    it('should return default value on network error', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      const result = await consulService.get('test', 'fallback-value');

      expect(result).toBe('fallback-value');
    });

    it('should throw error on network error when no default provided', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      await expect(consulService.get('test')).rejects.toThrow();
    });

    it('should return default number value when parsing fails', async () => {
      const mockValue = 'not-a-number';
      const encodedValue = Buffer.from(mockValue).toString('base64');

      mockAxiosInstance.get.mockResolvedValue({
        data: [{ Key: 'config/user-service/port', Value: encodedValue }],
      });

      const result = await consulService.getNumber('port', 3000);

      expect(result).toBe(3000);
    });

    it('should throw error when number parsing fails and no default provided', async () => {
      const mockValue = 'not-a-number';
      const encodedValue = Buffer.from(mockValue).toString('base64');

      mockAxiosInstance.get.mockResolvedValue({
        data: [{ Key: 'config/user-service/port', Value: encodedValue }],
      });

      await expect(consulService.getNumber('port')).rejects.toThrow(
        'Configuration value is not a valid number'
      );
    });
  });

  describe('Health Check', () => {
    it('should return true when Consul is available', async () => {
      mockedAxios.get.mockResolvedValue({ status: 200, data: '""' } as any);

      const isHealthy = await consulService.healthCheck();

      expect(isHealthy).toBe(true);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8500/v1/status/leader',
        { timeout: 2000 }
      );
    });

    it('should return false when Consul is unavailable', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Connection refused'));

      const isHealthy = await consulService.healthCheck();

      expect(isHealthy).toBe(false);
    });
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      const mockConfigs = [
        { key: 'port', value: '3003' },
        { key: 'service_name', value: 'user-service' },
        { key: 'redis/host', value: 'shared-redis' },
      ];

      mockAxiosInstance.get.mockImplementation((url: string) => {
        const key = url.replace('/', '');
        const config = mockConfigs.find((c) => key.includes(c.key));
        if (config) {
          const encodedValue = Buffer.from(config.value).toString('base64');
          return Promise.resolve({
            data: [{ Key: key, Value: encodedValue }],
          });
        }
        return Promise.resolve({ data: [] });
      });

      await expect(consulService.initialize()).resolves.not.toThrow();
    });

    it('should not initialize twice', async () => {
      const mockValue = '3003';
      const encodedValue = Buffer.from(mockValue).toString('base64');

      mockAxiosInstance.get.mockResolvedValue({
        data: [{ Key: 'config/user-service/port', Value: encodedValue }],
      });

      await consulService.initialize();
      const callCount1 = mockAxiosInstance.get.mock.calls.length;

      await consulService.initialize();
      const callCount2 = mockAxiosInstance.get.mock.calls.length;

      // Should not make additional calls on second initialization
      expect(callCount2).toBe(callCount1);
    });
  });
});
