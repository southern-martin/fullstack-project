#!/usr/bin/env ts-node

/**
 * Consul Configuration Test Script - Carrier Service
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
      success('Consul is running and accessible');
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
  header('Testing Carrier Service-Specific Configuration');
  
  let allPassed = true;
  const consulService = ConsulConfigService.getInstance();
  
  try {
    // Test service port
    const port = await consulService.getNumber('port');
    if (port === 3005) {
      success(`Service port: ${port}`);
    } else {
      error(`Service port incorrect: ${port} (expected 3005)`);
      allPassed = false;
    }
    
    // Test service name
    const serviceName = await consulService.get('service_name');
    if (serviceName === 'carrier-service') {
      success(`Service name: ${serviceName}`);
    } else {
      error(`Service name incorrect: ${serviceName} (expected carrier-service)`);
      allPassed = false;
    }
    
    // Test Redis key prefix
    const keyPrefix = await consulService.get('redis_key_prefix');
    if (keyPrefix === 'carrier') {
      success(`Redis key prefix: ${keyPrefix}`);
    } else {
      error(`Redis key prefix incorrect: ${keyPrefix} (expected carrier)`);
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
    // Test Redis configuration (shared)
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
    
    return allPassed;
  } catch (err) {
    error(`Shared configuration test failed: ${err}`);
    return false;
  }
}

async function testDatabaseConfiguration(): Promise<boolean> {
  header('Testing Database Configuration (Service-Specific)');
  
  let allPassed = true;
  const consulService = ConsulConfigService.getInstance();
  
  try {
    // Test Database configuration (service-specific, not shared)
    const dbHost = await consulService.get('database/host');
    if (dbHost === 'carrier-service-db') {
      success(`Database host: ${dbHost}`);
    } else {
      error(`Database host incorrect: ${dbHost} (expected carrier-service-db)`);
      allPassed = false;
    }
    
    const dbPort = await consulService.getNumber('database/port');
    if (dbPort === 3306) {
      success(`Database port: ${dbPort}`);
    } else {
      error(`Database port incorrect: ${dbPort} (expected 3306)`);
      allPassed = false;
    }
    
    const dbUsername = await consulService.get('database/username');
    if (dbUsername === 'carrier_user') {
      success(`Database username: ${dbUsername}`);
    } else {
      error(`Database username incorrect: ${dbUsername} (expected carrier_user)`);
      allPassed = false;
    }
    
    const dbPassword = await consulService.get('database/password');
    if (dbPassword === 'carrier_password') {
      success(`Database password: ${dbPassword.substring(0, 10)}...`);
    } else {
      error(`Database password incorrect`);
      allPassed = false;
    }
    
    const dbName = await consulService.get('database/database');
    if (dbName === 'carrier_service_db') {
      success(`Database name: ${dbName}`);
    } else {
      error(`Database name incorrect: ${dbName} (expected carrier_service_db)`);
      allPassed = false;
    }
    
    return allPassed;
  } catch (err) {
    error(`Database configuration test failed: ${err}`);
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
      error(`Database type incorrect: ${typeOrmConfig.type} (expected mysql)`);
      allPassed = false;
    }
    
    if (typeOrmConfig.host === 'carrier-service-db') {
      success(`TypeORM host: ${typeOrmConfig.host}`);
    } else {
      error(`TypeORM host incorrect: ${typeOrmConfig.host} (expected carrier-service-db)`);
      allPassed = false;
    }
    
    if (typeOrmConfig.port === 3306) {
      success(`TypeORM port: ${typeOrmConfig.port}`);
    } else {
      error(`TypeORM port incorrect: ${typeOrmConfig.port} (expected 3306)`);
      allPassed = false;
    }
    
    if (typeOrmConfig.database === 'carrier_service_db') {
      success(`TypeORM database: ${typeOrmConfig.database}`);
    } else {
      error(`TypeORM database incorrect: ${typeOrmConfig.database} (expected carrier_service_db)`);
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
      error(`Redis host incorrect: ${redisConfig.host} (expected shared-redis)`);
      allPassed = false;
    }
    
    if (redisConfig.port === 6379) {
      success(`Redis port: ${redisConfig.port}`);
    } else {
      error(`Redis port incorrect: ${redisConfig.port} (expected 6379)`);
      allPassed = false;
    }
    
    if (redisConfig.password === 'shared_redis_password_2024') {
      success(`Redis password: ${redisConfig.password.substring(0, 10)}...`);
    } else {
      error(`Redis password incorrect`);
      allPassed = false;
    }
    
    return allPassed;
  } catch (err) {
    error(`Redis configuration test failed: ${err}`);
    return false;
  }
}

async function testConfigurationCache(): Promise<boolean> {
  header('Testing Configuration Cache');
  
  try {
    const consulService = ConsulConfigService.getInstance();
    
    // First read - from Consul
    const start1 = Date.now();
    const value1 = await consulService.get('service_name');
    const time1 = Date.now() - start1;
    
    // Second read - from cache (should be faster)
    const start2 = Date.now();
    const value2 = await consulService.get('service_name');
    const time2 = Date.now() - start2;
    
    success(`First read (Consul): ${time1}ms`);
    success(`Second read (Cache): ${time2}ms`);
    
    if (value1 === value2) {
      success('Cache consistency verified');
      return true;
    } else {
      error('Cache inconsistency detected');
      return false;
    }
  } catch (err) {
    error(`Cache test failed: ${err}`);
    return false;
  }
}

async function testAllConfigurations(): Promise<void> {
  header('🧪 CARRIER SERVICE - CONSUL CONFIGURATION TEST SUITE');
  info('Testing Consul integration for Carrier Service');
  
  const results: { [key: string]: boolean } = {};
  
  try {
    // Initialize Consul service
    info('Initializing Consul service...');
    const consulService = ConsulConfigService.getInstance();
    await consulService.initialize();
    success('Consul service initialized\n');
    
    // Run tests
    results['Health Check'] = await testConsulHealth();
    results['Service Configuration'] = await testServiceConfiguration();
    results['Shared Configuration'] = await testSharedConfiguration();
    results['Database Configuration'] = await testDatabaseConfiguration();
    results['TypeORM Configuration'] = await testTypeOrmConfiguration();
    results['Redis Configuration'] = await testRedisConfiguration();
    results['Configuration Cache'] = await testConfigurationCache();
    
    // Summary
    header('Test Results Summary');
    
    let totalTests = 0;
    let passedTests = 0;
    
    for (const [testName, passed] of Object.entries(results)) {
      totalTests++;
      if (passed) {
        passedTests++;
        success(`${testName}: PASSED`);
      } else {
        error(`${testName}: FAILED`);
      }
    }
    
    log(''); // Empty line
    
    if (passedTests === totalTests) {
      success(`\n🎉 All tests passed! (${passedTests}/${totalTests})`);
      success('Carrier Service Consul integration is working correctly!');
      process.exit(0);
    } else {
      error(`\n⚠️  Some tests failed (${passedTests}/${totalTests} passed)`);
      error('Please check the configuration and try again.');
      process.exit(1);
    }
    
  } catch (err) {
    error(`\n💥 Test suite failed with error: ${err}`);
    if (err instanceof Error) {
      error(`Stack trace: ${err.stack}`);
    }
    process.exit(1);
  }
}

// Run tests if executed directly
if (require.main === module) {
  testAllConfigurations().catch(err => {
    error(`Unhandled error: ${err}`);
    process.exit(1);
  });
}

export {
  testConsulHealth,
  testServiceConfiguration,
  testSharedConfiguration,
  testDatabaseConfiguration,
  testTypeOrmConfiguration,
  testRedisConfiguration,
  testConfigurationCache,
  testAllConfigurations,
};
