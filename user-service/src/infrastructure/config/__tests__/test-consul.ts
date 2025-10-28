#!/usr/bin/env ts-node

/**
 * Consul Configuration Test Script
 * 
 * End-to-end test to verify Consul configuration is working properly
 * This script connects to Consul and validates all configuration values
 * 
 * Usage: npx ts-node src/infrastructure/config/__tests__/test-consul.ts
 */

import { ConsulConfigService } from '../consul.config';
import { createTypeOrmConsulConfig } from '../typeorm-consul.config';
import { createRedisConsulConfig } from '../redis-consul.config';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message: string) {
  log(`✅ ${message}`, colors.green);
}

function error(message: string) {
  log(`❌ ${message}`, colors.red);
}

function info(message: string) {
  log(`ℹ️  ${message}`, colors.blue);
}

function header(message: string) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(message, colors.cyan);
  log('='.repeat(60), colors.cyan);
}

async function testConsulHealth(): Promise<boolean> {
  header('Testing Consul Health Check');
  
  try {
    const consulService = ConsulConfigService.getInstance();
    const isHealthy = await consulService.healthCheck();
    
    if (isHealthy) {
      success('Consul is running and accessible at http://localhost:8500');
      return true;
    } else {
      error('Consul health check failed');
      return false;
    }
  } catch (err) {
    error(`Consul health check error: ${err}`);
    return false;
  }
}

async function testServiceConfiguration(): Promise<boolean> {
  header('Testing Service-Specific Configuration');
  
  let allPassed = true;
  const consulService = ConsulConfigService.getInstance();
  
  try {
    // Test service port
    const port = await consulService.getNumber('port');
    if (port === 3003) {
      success(`Service port: ${port}`);
    } else {
      error(`Service port incorrect: ${port} (expected 3003)`);
      allPassed = false;
    }
    
    // Test service name
    const serviceName = await consulService.get('service_name');
    if (serviceName === 'user-service') {
      success(`Service name: ${serviceName}`);
    } else {
      error(`Service name incorrect: ${serviceName} (expected user-service)`);
      allPassed = false;
    }
    
    // Test Redis key prefix
    const keyPrefix = await consulService.get('redis_key_prefix');
    if (keyPrefix === 'user') {
      success(`Redis key prefix: ${keyPrefix}`);
    } else {
      error(`Redis key prefix incorrect: ${keyPrefix} (expected user)`);
      allPassed = false;
    }
    
    return allPassed;
  } catch (err) {
    error(`Service configuration test failed: ${err}`);
    return false;
  }
}

async function testSharedConfiguration(): Promise<boolean> {
  header('Testing Shared Infrastructure Configuration');
  
  let allPassed = true;
  const consulService = ConsulConfigService.getInstance();
  
  try {
    // Test Redis configuration
    const redisHost = await consulService.getShared('redis/host');
    if (redisHost === 'shared-redis') {
      success(`Redis host: ${redisHost}`);
    } else {
      error(`Redis host incorrect: ${redisHost} (expected shared-redis)`);
      allPassed = false;
    }
    
    const redisPort = await consulService.getSharedNumber('redis/port');
    if (redisPort === 6379) {
      success(`Redis port: ${redisPort}`);
    } else {
      error(`Redis port incorrect: ${redisPort} (expected 6379)`);
      allPassed = false;
    }
    
    const redisPassword = await consulService.getShared('redis/password');
    if (redisPassword === 'shared_redis_password_2024') {
      success(`Redis password: ${redisPassword.substring(0, 10)}...`);
    } else {
      error(`Redis password incorrect`);
      allPassed = false;
    }
    
    // Test Database configuration
    const dbHost = await consulService.getShared('database/shared_user_db/host');
    if (dbHost === 'shared-user-db') {
      success(`Database host: ${dbHost}`);
    } else {
      error(`Database host incorrect: ${dbHost} (expected shared-user-db)`);
      allPassed = false;
    }
    
    const dbPort = await consulService.getSharedNumber('database/shared_user_db/port');
    if (dbPort === 3306) {
      success(`Database port: ${dbPort}`);
    } else {
      error(`Database port incorrect: ${dbPort} (expected 3306)`);
      allPassed = false;
    }
    
    const dbUsername = await consulService.getShared('database/shared_user_db/username');
    if (dbUsername === 'shared_user') {
      success(`Database username: ${dbUsername}`);
    } else {
      error(`Database username incorrect: ${dbUsername} (expected shared_user)`);
      allPassed = false;
    }
    
    const dbPassword = await consulService.getShared('database/shared_user_db/password');
    if (dbPassword === 'shared_password_2024') {
      success(`Database password: ${dbPassword.substring(0, 10)}...`);
    } else {
      error(`Database password incorrect`);
      allPassed = false;
    }
    
    const dbName = await consulService.getShared('database/shared_user_db/database');
    if (dbName === 'shared_user_db') {
      success(`Database name: ${dbName}`);
    } else {
      error(`Database name incorrect: ${dbName} (expected shared_user_db)`);
      allPassed = false;
    }
    
    return allPassed;
  } catch (err) {
    error(`Shared configuration test failed: ${err}`);
    return false;
  }
}

async function testTypeOrmConfiguration(): Promise<boolean> {
  header('Testing TypeORM Configuration from Consul');
  
  try {
    const typeOrmConfig = await createTypeOrmConsulConfig() as any;
    
    let allPassed = true;
    
    if (typeOrmConfig.type === 'mysql') {
      success(`Database type: ${typeOrmConfig.type}`);
    } else {
      error(`Database type incorrect: ${typeOrmConfig.type}`);
      allPassed = false;
    }
    
    if (typeOrmConfig.host === 'shared-user-db') {
      success(`TypeORM host: ${typeOrmConfig.host}`);
    } else {
      error(`TypeORM host incorrect: ${typeOrmConfig.host}`);
      allPassed = false;
    }
    
    if (typeOrmConfig.port === 3306) {
      success(`TypeORM port: ${typeOrmConfig.port}`);
    } else {
      error(`TypeORM port incorrect: ${typeOrmConfig.port}`);
      allPassed = false;
    }
    
    if (typeOrmConfig.database === 'shared_user_db') {
      success(`TypeORM database: ${typeOrmConfig.database}`);
    } else {
      error(`TypeORM database incorrect: ${typeOrmConfig.database}`);
      allPassed = false;
    }
    
    if (typeOrmConfig.synchronize === false) {
      success(`TypeORM synchronize: ${typeOrmConfig.synchronize} (correct - using migrations)`);
    } else {
      error(`TypeORM synchronize should be false`);
      allPassed = false;
    }
    
    if (typeOrmConfig.entities && Array.isArray(typeOrmConfig.entities) && typeOrmConfig.entities.length > 0) {
      success(`TypeORM entities: ${typeOrmConfig.entities.length} loaded`);
    } else {
      error(`TypeORM entities not loaded`);
      allPassed = false;
    }
    
    return allPassed;
  } catch (err) {
    error(`TypeORM configuration test failed: ${err}`);
    return false;
  }
}

async function testRedisConfiguration(): Promise<boolean> {
  header('Testing Redis Configuration from Consul');
  
  try {
    const redisConfig = await createRedisConsulConfig();
    
    let allPassed = true;
    
    if (redisConfig.host === 'shared-redis') {
      success(`Redis host: ${redisConfig.host}`);
    } else {
      error(`Redis host incorrect: ${redisConfig.host}`);
      allPassed = false;
    }
    
    if (redisConfig.port === 6379) {
      success(`Redis port: ${redisConfig.port}`);
    } else {
      error(`Redis port incorrect: ${redisConfig.port}`);
      allPassed = false;
    }
    
    if (redisConfig.keyPrefix === 'user:') {
      success(`Redis key prefix: ${redisConfig.keyPrefix}`);
    } else {
      error(`Redis key prefix incorrect: ${redisConfig.keyPrefix}`);
      allPassed = false;
    }
    
    if (redisConfig.db === 0) {
      success(`Redis database: ${redisConfig.db}`);
    } else {
      error(`Redis database incorrect: ${redisConfig.db}`);
      allPassed = false;
    }
    
    return allPassed;
  } catch (err) {
    error(`Redis configuration test failed: ${err}`);
    return false;
  }
}

async function testCaching(): Promise<boolean> {
  header('Testing Configuration Caching');
  
  try {
    const consulService = ConsulConfigService.getInstance();
    consulService.clearCache();
    
    // Load some configurations
    await consulService.get('service_name');
    await consulService.getNumber('port');
    await consulService.getShared('redis/host');
    
    const cachedKeys = consulService.getCachedKeys();
    
    if (cachedKeys.length >= 3) {
      success(`Cached ${cachedKeys.length} configuration keys`);
      info(`Cached keys: ${cachedKeys.join(', ')}`);
      return true;
    } else {
      error(`Caching not working properly (only ${cachedKeys.length} keys cached)`);
      return false;
    }
  } catch (err) {
    error(`Caching test failed: ${err}`);
    return false;
  }
}

async function runAllTests() {
  log('\n🚀 Starting Consul Configuration Tests\n', colors.cyan);
  
  const results: { [key: string]: boolean } = {};
  
  // Run all tests
  results['Consul Health'] = await testConsulHealth();
  results['Service Configuration'] = await testServiceConfiguration();
  results['Shared Configuration'] = await testSharedConfiguration();
  results['TypeORM Configuration'] = await testTypeOrmConfiguration();
  results['Redis Configuration'] = await testRedisConfiguration();
  results['Configuration Caching'] = await testCaching();
  
  // Summary
  header('Test Summary');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r).length;
  const failedTests = totalTests - passedTests;
  
  Object.entries(results).forEach(([name, passed]) => {
    if (passed) {
      success(`${name}: PASSED`);
    } else {
      error(`${name}: FAILED`);
    }
  });
  
  log('');
  if (failedTests === 0) {
    success(`All ${totalTests} test suites passed! 🎉`);
    log('');
    success('Consul configuration is working correctly!');
    success('User Service is successfully loading configuration from Consul KV store.');
    process.exit(0);
  } else {
    error(`${failedTests} out of ${totalTests} test suites failed`);
    log('');
    error('Please check Consul is running and configuration is seeded:');
    info('1. docker ps | grep consul');
    info('2. cd consul && ./seed-consul-config.sh');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch((err) => {
  error(`Test execution failed: ${err}`);
  console.error(err);
  process.exit(1);
});
