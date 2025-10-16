// Enterprise-grade configuration management

import { AppConfig } from '../types';

// Environment-based configuration
const getEnvConfig = (): Partial<AppConfig> => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';

  return {
    api: {
      baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
      timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
      retries: parseInt(process.env.REACT_APP_API_RETRIES || '3'),
    },
    features: {
      darkMode: process.env.REACT_APP_FEATURE_DARK_MODE === 'true',
      notifications: process.env.REACT_APP_FEATURE_NOTIFICATIONS === 'true',
      analytics: process.env.REACT_APP_FEATURE_ANALYTICS === 'true',
      multiLanguage: process.env.REACT_APP_FEATURE_MULTI_LANGUAGE === 'true',
    },
    limits: {
      maxFileSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE || '10485760'), // 10MB
      maxUploadFiles: parseInt(process.env.REACT_APP_MAX_UPLOAD_FILES || '5'),
      sessionTimeout: parseInt(process.env.REACT_APP_SESSION_TIMEOUT || '3600000'), // 1 hour
    },
  };
};

// Default configuration
const defaultConfig: AppConfig = {
  api: {
    baseUrl: 'http://localhost:3001',
    timeout: 30000,
    retries: 3,
  },
  features: {
    darkMode: true,
    notifications: true,
    analytics: true,
    multiLanguage: false,
  },
  limits: {
    maxFileSize: 10485760, // 10MB
    maxUploadFiles: 5,
    sessionTimeout: 3600000, // 1 hour
  },
};

// Configuration class for enterprise-grade config management
class ConfigManager {
  private config: AppConfig;
  private listeners: Map<string, Set<(value: any) => void>> = new Map();

  constructor() {
    this.config = { ...defaultConfig, ...getEnvConfig() };
  }

  // Get configuration value
  get<T = any>(key: string, defaultValue?: T): T {
    const keys = key.split('.');
    let value: any = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue as T;
      }
    }

    return value as T;
  }

  // Set configuration value
  set<T = any>(key: string, value: T): void {
    const keys = key.split('.');
    let current: any = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }

    const lastKey = keys[keys.length - 1];
    const oldValue = current[lastKey];
    current[lastKey] = value;

    // Notify listeners
    this.notifyListeners(key, value, oldValue);
  }

  // Check if configuration key exists
  has(key: string): boolean {
    const keys = key.split('.');
    let current: any = this.config;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return false;
      }
    }

    return true;
  }

  // Remove configuration key
  remove(key: string): void {
    const keys = key.split('.');
    let current: any = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return;
      }
    }

    const lastKey = keys[keys.length - 1];
    if (current && lastKey in current) {
      const oldValue = current[lastKey];
      delete current[lastKey];
      this.notifyListeners(key, undefined, oldValue);
    }
  }

  // Get all configuration
  getAll(): AppConfig {
    return { ...this.config };
  }

  // Subscribe to configuration changes
  subscribe(key: string, callback: (value: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  // Notify listeners of configuration changes
  private notifyListeners(key: string, newValue: any, oldValue: any): void {
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(newValue);
        } catch (error) {
          console.error('Error in configuration listener:', error);
        }
      });
    }

    // Also notify wildcard listeners
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach(callback => {
        try {
          callback({ key, newValue, oldValue });
        } catch (error) {
          console.error('Error in wildcard configuration listener:', error);
        }
      });
    }
  }

  // Reset to default configuration
  reset(): void {
    this.config = { ...defaultConfig, ...getEnvConfig() };
    this.notifyListeners('*', this.config, null);
  }

  // Validate configuration
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate API configuration
    if (!this.config.api.baseUrl) {
      errors.push('API base URL is required');
    }

    if (this.config.api.timeout <= 0) {
      errors.push('API timeout must be greater than 0');
    }

    if (this.config.api.retries < 0) {
      errors.push('API retries must be non-negative');
    }

    // Validate limits
    if (this.config.limits.maxFileSize <= 0) {
      errors.push('Max file size must be greater than 0');
    }

    if (this.config.limits.maxUploadFiles <= 0) {
      errors.push('Max upload files must be greater than 0');
    }

    if (this.config.limits.sessionTimeout <= 0) {
      errors.push('Session timeout must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Load configuration from external source
  async loadFromSource(source: string): Promise<void> {
    try {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to load configuration: ${response.statusText}`);
      }

      const externalConfig = await response.json();
      this.config = { ...this.config, ...externalConfig };
      this.notifyListeners('*', this.config, null);
    } catch (error) {
      console.error('Failed to load external configuration:', error);
      throw error;
    }
  }

  // Save configuration to external source
  async saveToSource(source: string): Promise<void> {
    try {
      const response = await fetch(source, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.config),
      });

      if (!response.ok) {
        throw new Error(`Failed to save configuration: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
      throw error;
    }
  }
}

// Create singleton instance
const configManager = new ConfigManager();

// Export configuration utilities
export const config = {
  get: <T = any>(key: string, defaultValue?: T) => configManager.get<T>(key, defaultValue),
  set: <T = any>(key: string, value: T) => configManager.set<T>(key, value),
  has: (key: string) => configManager.has(key),
  remove: (key: string) => configManager.remove(key),
  getAll: () => configManager.getAll(),
  subscribe: (key: string, callback: (value: any) => void) => configManager.subscribe(key, callback),
  reset: () => configManager.reset(),
  validate: () => configManager.validate(),
  loadFromSource: (source: string) => configManager.loadFromSource(source),
  saveToSource: (source: string) => configManager.saveToSource(source),
};

// Environment-specific configurations
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// Feature flags
export const features = {
  darkMode: config.get('features.darkMode', true),
  notifications: config.get('features.notifications', true),
  analytics: config.get('features.analytics', true),
  multiLanguage: config.get('features.multiLanguage', false),
};

// API configuration
export const apiConfig = {
  baseUrl: config.get('api.baseUrl', 'http://localhost:3001'),
  timeout: config.get('api.timeout', 30000),
  retries: config.get('api.retries', 3),
};

// Application limits
export const limits = {
  maxFileSize: config.get('limits.maxFileSize', 10485760),
  maxUploadFiles: config.get('limits.maxUploadFiles', 5),
  sessionTimeout: config.get('limits.sessionTimeout', 3600000),
};

// Export default configuration
export default config;
