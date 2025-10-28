/**
 * Consul Configuration Module
 * 
 * This module provides centralized configuration management using HashiCorp Consul.
 * It replaces environment variable reads with Consul KV store lookups.
 * 
 * Week 2 Implementation: Service Integration
 * 
 * Usage:
 *   import { ConsulConfigService } from './consul.config';
 *   const configService = ConsulConfigService.getInstance();
 *   await configService.initialize();
 *   const dbHost = await configService.get('database/host');
 */

import axios from 'axios';

type AxiosInstance = ReturnType<typeof axios.create>;

export interface ConsulConfig {
  host: string;
  port: number;
  scheme: string;
}

export interface ConfigValue {
  key: string;
  value: string;
  timestamp: Date;
}

/**
 * Consul Configuration Service
 * 
 * Singleton service for managing configuration from Consul KV store.
 * Provides caching and error handling for configuration reads.
 */
export class ConsulConfigService {
  private static instance: ConsulConfigService;
  private consulClient: AxiosInstance;
  private configCache: Map<string, ConfigValue> = new Map();
  private servicePrefix: string = 'config/carrier-service';
  private sharedPrefix: string = 'config/shared';
  private initialized: boolean = false;

  private constructor(config?: ConsulConfig) {
    const consulHost = config?.host || process.env.CONSUL_HOST || 'localhost';
    const consulPort = config?.port || parseInt(process.env.CONSUL_PORT || '8500');
    const consulScheme = config?.scheme || process.env.CONSUL_SCHEME || 'http';

    this.consulClient = axios.create({
      baseURL: `${consulScheme}://${consulHost}:${consulPort}/v1/kv`,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get singleton instance of ConsulConfigService
   */
  public static getInstance(config?: ConsulConfig): ConsulConfigService {
    if (!ConsulConfigService.instance) {
      ConsulConfigService.instance = new ConsulConfigService(config);
    }
    return ConsulConfigService.instance;
  }

  /**
   * Initialize the Consul configuration service
   * Preloads critical configuration values into cache
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('[Consul] Already initialized');
      return;
    }

    try {
      console.log('[Consul] Initializing configuration service...');
      
      // Preload critical service-specific configs
      await this.preloadServiceConfigs();
      
      // Preload shared infrastructure configs
      await this.preloadSharedConfigs();
      
      this.initialized = true;
      console.log(`[Consul] Initialized successfully with ${this.configCache.size} cached configs`);
    } catch (error) {
      console.error('[Consul] Initialization failed:', error);
      throw new Error('Failed to initialize Consul configuration service');
    }
  }

  /**
   * Preload service-specific configurations
   */
  private async preloadServiceConfigs(): Promise<void> {
    const serviceKeys = [
      'port',
      'service_name',
      'redis_key_prefix',
    ];

    for (const key of serviceKeys) {
      try {
        await this.get(key);
      } catch (error) {
        console.warn(`[Consul] Failed to preload service config: ${key}`, error);
      }
    }
  }

  /**
   * Preload shared infrastructure configurations
   */
  private async preloadSharedConfigs(): Promise<void> {
    const sharedKeys = [
      'redis/host',
      'redis/port',
      'redis/password',
      'database/shared_user_db/host',
      'database/shared_user_db/port',
      'database/shared_user_db/username',
      'database/shared_user_db/password',
      'database/shared_user_db/database',
    ];

    for (const key of sharedKeys) {
      try {
        await this.getShared(key);
      } catch (error) {
        console.warn(`[Consul] Failed to preload shared config: ${key}`, error);
      }
    }
  }

  /**
   * Get a service-specific configuration value from Consul
   * 
   * @param key - Configuration key (e.g., 'port', 'database/host')
   * @param defaultValue - Optional default value if key not found
   * @returns Configuration value as string
   */
  public async get(key: string, defaultValue?: string): Promise<string> {
    const fullKey = `${this.servicePrefix}/${key}`;
    return this.getFromConsul(fullKey, defaultValue);
  }

  /**
   * Get a shared infrastructure configuration value from Consul
   * 
   * @param key - Configuration key (e.g., 'redis/host', 'database/shared_user_db/host')
   * @param defaultValue - Optional default value if key not found
   * @returns Configuration value as string
   */
  public async getShared(key: string, defaultValue?: string): Promise<string> {
    const fullKey = `${this.sharedPrefix}/${key}`;
    return this.getFromConsul(fullKey, defaultValue);
  }

  /**
   * Get configuration value from Consul KV store with caching
   */
  private async getFromConsul(fullKey: string, defaultValue?: string): Promise<string> {
    // Check cache first
    const cached = this.configCache.get(fullKey);
    if (cached) {
      return cached.value;
    }

    try {
      const response = await this.consulClient.get(`/${fullKey}`);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const consulData = response.data[0] as any;
        const value = Buffer.from(consulData.Value, 'base64').toString('utf-8');
        
        // Cache the value
        this.configCache.set(fullKey, {
          key: fullKey,
          value,
          timestamp: new Date(),
        });
        
        return value;
      }
      
      if (defaultValue !== undefined) {
        console.warn(`[Consul] Key not found: ${fullKey}, using default: ${defaultValue}`);
        return defaultValue;
      }
      
      throw new Error(`Configuration key not found: ${fullKey}`);
    } catch (error) {
      if (defaultValue !== undefined) {
        console.warn(`[Consul] Error fetching ${fullKey}, using default:`, defaultValue);
        return defaultValue;
      }
      
      console.error(`[Consul] Error fetching configuration for ${fullKey}:`, error);
      throw error;
    }
  }

  /**
   * Get configuration value as number
   */
  public async getNumber(key: string, defaultValue?: number): Promise<number> {
    const value = await this.get(key, defaultValue?.toString());
    const parsed = parseInt(value, 10);
    
    if (isNaN(parsed)) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Configuration value is not a valid number: ${key} = ${value}`);
    }
    
    return parsed;
  }

  /**
   * Get shared configuration value as number
   */
  public async getSharedNumber(key: string, defaultValue?: number): Promise<number> {
    const value = await this.getShared(key, defaultValue?.toString());
    const parsed = parseInt(value, 10);
    
    if (isNaN(parsed)) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Shared configuration value is not a valid number: ${key} = ${value}`);
    }
    
    return parsed;
  }

  /**
   * Get configuration value as boolean
   */
  public async getBoolean(key: string, defaultValue?: boolean): Promise<boolean> {
    const value = await this.get(key, defaultValue?.toString());
    return value.toLowerCase() === 'true';
  }

  /**
   * Clear configuration cache
   */
  public clearCache(): void {
    this.configCache.clear();
    console.log('[Consul] Configuration cache cleared');
  }

  /**
   * Refresh a specific configuration key
   */
  public async refresh(key: string): Promise<string> {
    const fullKey = `${this.servicePrefix}/${key}`;
    this.configCache.delete(fullKey);
    return this.get(key);
  }

  /**
   * Refresh a shared configuration key
   */
  public async refreshShared(key: string): Promise<string> {
    const fullKey = `${this.sharedPrefix}/${key}`;
    this.configCache.delete(fullKey);
    return this.getShared(key);
  }

  /**
   * Get all cached configuration keys
   */
  public getCachedKeys(): string[] {
    return Array.from(this.configCache.keys());
  }

  /**
   * Check if Consul is available
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(
        this.consulClient.defaults.baseURL!.replace('/v1/kv', '/v1/status/leader'),
        { timeout: 2000 }
      );
      return response.status === 200;
    } catch (error) {
      console.error('[Consul] Health check failed:', error);
      return false;
    }
  }
}

/**
 * Helper function to get Consul config service instance
 */
export function getConsulConfig(): ConsulConfigService {
  return ConsulConfigService.getInstance();
}

/**
 * Initialize Consul configuration with error handling
 * Falls back to environment variables if Consul is unavailable
 */
export async function initializeConsulConfig(): Promise<ConsulConfigService> {
  const configService = ConsulConfigService.getInstance();
  
  try {
    await configService.initialize();
    console.log('[Consul] Configuration service initialized successfully');
    return configService;
  } catch (error) {
    console.error('[Consul] Failed to initialize, falling back to environment variables');
    console.error('[Consul] Error:', error);
    throw error;
  }
}
