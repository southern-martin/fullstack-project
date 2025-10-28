# 🔧 Consul Configuration Usage Guide

## Overview

This guide explains how to use Consul for configuration management in the microservices architecture. All services now read configuration from Consul KV store instead of environment variables.

## 📋 Table of Contents

1. [Basic Concepts](#basic-concepts)
2. [Configuration Structure](#configuration-structure)
3. [Usage Patterns](#usage-patterns)
4. [Common Use Cases](#common-use-cases)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Basic Concepts

### What is Consul?

Consul is a service mesh solution providing:
- **Key-Value Store**: Centralized configuration management
- **Service Discovery**: Automatic service registration and discovery
- **Health Checking**: Service health monitoring
- **Dynamic Configuration**: Update configs without restarting services

### Configuration Hierarchy

```
config/
├── shared/                          # Shared infrastructure configs
│   ├── redis/
│   │   ├── host                     # shared-redis
│   │   ├── port                     # 6379
│   │   └── password                 # shared_redis_password_2024
│   └── database/
│       └── shared_user_db/          # Auth & User services DB
│           ├── host                 # shared-user-db
│           ├── port                 # 3306
│           ├── username             # shared_user
│           ├── password             # shared_password_2024
│           └── database             # shared_user_db
│
├── customer-service/                # Customer service specific
│   ├── port                         # 3004
│   ├── service_name                 # customer-service
│   ├── redis_key_prefix             # customer
│   ├── user_service_url             # http://user-service:3003
│   └── database/
│       ├── host                     # customer-service-db
│       ├── port                     # 3306
│       ├── username                 # customer_user
│       ├── password                 # customer_password
│       └── database                 # customer_service_db
│
├── carrier-service/                 # Carrier service specific
├── pricing-service/                 # Pricing service specific
└── user-service/                    # User service specific
```

---

## Configuration Structure

### Service-Specific Configs
- Path: `config/{service-name}/{key}`
- Example: `config/customer-service/port`
- Use: Service-specific settings (port, service name, database, etc.)

### Shared Infrastructure Configs
- Path: `config/shared/{category}/{key}`
- Example: `config/shared/redis/host`
- Use: Shared resources (Redis, shared database, API keys, etc.)

---

## Usage Patterns

### 1. **Basic Configuration Reading**

```typescript
import { ConsulConfigService } from './infrastructure/config/consul.config';

// Get singleton instance
const consulConfig = ConsulConfigService.getInstance();

// Initialize (done once at startup)
await consulConfig.initialize();

// Read service-specific config
const serviceName = await consulConfig.get('service_name');
const port = await consulConfig.getNumber('port');

// Read shared infrastructure config
const redisHost = await consulConfig.getShared('redis/host');
const redisPort = await consulConfig.getSharedNumber('redis/port');

// With fallback defaults
const timeout = await consulConfig.getNumber('timeout', 5000);
const apiKey = await consulConfig.get('api_key', 'default-key');
```

### 2. **TypeORM Database Configuration**

```typescript
// customer-service/src/infrastructure/config/typeorm-consul.config.ts

import { ConsulConfigService } from './consul.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export async function createTypeOrmConsulConfig(): Promise<TypeOrmModuleOptions> {
  const consulConfig = ConsulConfigService.getInstance();
  
  // Initialize if needed
  if (!consulConfig['initialized']) {
    await consulConfig.initialize();
  }
  
  // Read database configuration from service-specific path
  const dbHost = await consulConfig.get('database/host', 'localhost');
  const dbPort = await consulConfig.getNumber('database/port', 3306);
  const dbUsername = await consulConfig.get('database/username', 'user');
  const dbPassword = await consulConfig.get('database/password', 'password');
  const dbName = await consulConfig.get('database/database', 'mydb');
  
  return {
    type: 'mysql',
    host: dbHost,
    port: dbPort,
    username: dbUsername,
    password: dbPassword,
    database: dbName,
    entities: [/* your entities */],
    synchronize: false,
    migrations: ['dist/infrastructure/database/typeorm/migrations/*.js'],
    migrationsRun: true,
  };
}
```

**Usage in app.module.ts:**

```typescript
import { createTypeOrmConsulConfig } from './infrastructure/config/typeorm-consul.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return await createTypeOrmConsulConfig();
      },
    }),
  ],
})
export class AppModule {}
```

### 3. **Redis Configuration**

```typescript
// customer-service/src/infrastructure/config/redis-consul.config.ts

import { ConsulConfigService } from './consul.config';

export async function createRedisConsulConfig(): Promise<RedisConfig> {
  const consulConfig = ConsulConfigService.getInstance();
  
  // Initialize if needed
  if (!consulConfig['initialized']) {
    await consulConfig.initialize();
  }
  
  // Read Redis configuration from shared infrastructure
  const redisHost = await consulConfig.getShared('redis/host', 'localhost');
  const redisPort = await consulConfig.getSharedNumber('redis/port', 6379);
  const redisPassword = await consulConfig.getShared('redis/password', '');
  
  // Read service-specific key prefix
  const keyPrefix = await consulConfig.get('redis_key_prefix', 'app');
  
  return {
    host: redisHost,
    port: redisPort,
    password: redisPassword,
    keyPrefix: keyPrefix,
  };
}
```

**Usage in app.module.ts:**

```typescript
import { createRedisConsulConfig } from './infrastructure/config/redis-consul.config';

@Module({
  providers: [
    {
      provide: RedisCacheService,
      useFactory: async () => {
        const redisConfig = await createRedisConsulConfig();
        const redisUrl = redisConfig.password
          ? `redis://:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}`
          : `redis://${redisConfig.host}:${redisConfig.port}`;
        
        return new RedisCacheService(redisUrl, redisConfig.keyPrefix);
      },
    },
  ],
})
export class AppModule {}
```

### 4. **Service Integration**

```typescript
import { Injectable } from '@nestjs/common';
import { ConsulConfigService } from './infrastructure/config/consul.config';

@Injectable()
export class MyService {
  private consulConfig: ConsulConfigService;
  
  constructor() {
    this.consulConfig = ConsulConfigService.getInstance();
  }
  
  async getServiceUrl(serviceName: string): Promise<string> {
    // Read dynamic service URL from Consul
    const url = await this.consulConfig.get(`${serviceName}_url`);
    return url;
  }
  
  async getFeatureFlag(flagName: string): Promise<boolean> {
    // Read feature flags from Consul
    const enabled = await this.consulConfig.getBoolean(
      `features/${flagName}`,
      false
    );
    return enabled;
  }
}
```

---

## Common Use Cases

### Use Case 1: **Service Discovery**

```typescript
// Get URL of another microservice
const userServiceUrl = await consulConfig.get('user_service_url');
const response = await axios.get(`${userServiceUrl}/api/v1/users/${userId}`);
```

### Use Case 2: **Feature Flags**

```typescript
// Check if a feature is enabled
const isNewFeatureEnabled = await consulConfig.getBoolean('features/new_dashboard', false);

if (isNewFeatureEnabled) {
  // Use new implementation
} else {
  // Use old implementation
}
```

### Use Case 3: **External API Credentials**

```typescript
// Read third-party API credentials
const apiKey = await consulConfig.get('integrations/stripe/api_key');
const apiSecret = await consulConfig.get('integrations/stripe/api_secret');

const stripe = new Stripe(apiKey, { apiVersion: '2024-10-28' });
```

### Use Case 4: **Rate Limiting Configuration**

```typescript
// Read rate limiting settings
const rateLimit = await consulConfig.getNumber('rate_limit/requests_per_minute', 100);
const rateLimitWindow = await consulConfig.getNumber('rate_limit/window_seconds', 60);
```

---

## Testing

### Running Consul Configuration Tests

Each service has a test suite to verify Consul integration:

```bash
# Customer Service
cd customer-service
npx ts-node src/infrastructure/config/__tests__/test-consul.ts

# User Service
cd user-service
npx ts-node src/infrastructure/config/__tests__/test-consul.ts

# Carrier Service
cd carrier-service
npx ts-node src/infrastructure/config/__tests__/test-consul.ts

# Pricing Service
cd pricing-service
npx ts-node src/infrastructure/config/__tests__/test-consul.ts
```

### Test Coverage

The test suite verifies:
- ✅ Consul health check
- ✅ Service-specific configuration
- ✅ Shared infrastructure configuration
- ✅ Database configuration
- ✅ TypeORM configuration
- ✅ Redis configuration
- ✅ Configuration caching

### Example Test Output

```
============================================================
🧪 CUSTOMER SERVICE - CONSUL CONFIGURATION TEST SUITE
============================================================
✅ Consul service initialized

============================================================
Test Results Summary
============================================================
✅ Health Check: PASSED
✅ Service Configuration: PASSED
✅ Shared Configuration: PASSED
✅ Database Configuration: PASSED
✅ TypeORM Configuration: PASSED
✅ Redis Configuration: PASSED
✅ Configuration Cache: PASSED

🎉 All tests passed! (7/7)
✅ Customer Service Consul integration is working correctly!
```

---

## Troubleshooting

### Issue 1: "Cannot connect to Consul"

**Symptoms:**
```
[Consul] Error fetching configuration: AxiosError: connect ECONNREFUSED
```

**Solutions:**
1. Check Consul is running:
   ```bash
   docker ps | grep consul
   ```

2. Verify environment variables in `docker-compose.hybrid.yml`:
   ```yaml
   environment:
     CONSUL_HOST: consul-server
     CONSUL_PORT: 8500
     CONSUL_SCHEME: http
   ```

3. Check Consul health:
   ```bash
   curl http://localhost:8500/v1/status/leader
   ```

### Issue 2: "Configuration key not found"

**Symptoms:**
```
[Consul] Configuration key not found: config/customer-service/database/host
```

**Solutions:**
1. Check if key exists in Consul:
   ```bash
   curl http://localhost:8500/v1/kv/config/customer-service/database/host?raw
   ```

2. List all keys for your service:
   ```bash
   curl 'http://localhost:8500/v1/kv/config/customer-service?keys' | jq
   ```

3. Seed missing configuration:
   ```bash
   # Add single key
   curl -X PUT -d 'customer-service-db' \
     http://localhost:8500/v1/kv/config/customer-service/database/host
   ```

### Issue 3: "Service initialization failed"

**Symptoms:**
```
[Consul] Initialization failed: Failed to initialize Consul configuration service
```

**Solutions:**
1. Initialize Consul explicitly in main.ts:
   ```typescript
   import { ConsulConfigService } from './infrastructure/config/consul.config';
   
   async function bootstrap() {
     const consulConfig = ConsulConfigService.getInstance();
     await consulConfig.initialize();
     
     const app = await NestJS.create(AppModule);
     await app.listen(3004);
   }
   ```

2. Check Docker network connectivity:
   ```bash
   docker exec customer-service ping consul-server
   ```

### Issue 4: "Configuration caching issues"

**Symptoms:**
- Stale configuration values
- Changes in Consul not reflected in service

**Solutions:**
1. Restart the service (caching happens at startup):
   ```bash
   docker-compose restart customer-service
   ```

2. Implement configuration refresh (Week 3 feature):
   - Use Consul watches
   - Poll for configuration changes
   - Implement hot-reload mechanism

---

## Best Practices

### ✅ DO:
- ✅ Use `initialize()` once at application startup
- ✅ Provide sensible default values for optional configs
- ✅ Use typed getters (`getNumber`, `getBoolean`) for non-string values
- ✅ Cache frequently accessed configuration values
- ✅ Use service-specific paths for service configs
- ✅ Use shared paths for infrastructure configs
- ✅ Test Consul integration with the provided test suites

### ❌ DON'T:
- ❌ Don't call `initialize()` multiple times
- ❌ Don't store secrets in plain text (use Consul ACLs + encryption)
- ❌ Don't bypass the cache for every read
- ❌ Don't hard-code configuration values
- ❌ Don't mix environment variables and Consul (choose one)
- ❌ Don't forget fallback defaults for critical configs

---

## API Reference

### ConsulConfigService Methods

| Method | Description | Example |
|--------|-------------|---------|
| `getInstance()` | Get singleton instance | `ConsulConfigService.getInstance()` |
| `initialize()` | Initialize and preload configs | `await consulConfig.initialize()` |
| `get(key, default?)` | Get service-specific string value | `await consulConfig.get('port', '3000')` |
| `getNumber(key, default?)` | Get service-specific number value | `await consulConfig.getNumber('port', 3000)` |
| `getBoolean(key, default?)` | Get service-specific boolean value | `await consulConfig.getBoolean('debug', false)` |
| `getShared(key, default?)` | Get shared infrastructure string value | `await consulConfig.getShared('redis/host')` |
| `getSharedNumber(key, default?)` | Get shared infrastructure number value | `await consulConfig.getSharedNumber('redis/port')` |
| `healthCheck()` | Check Consul connectivity | `await consulConfig.healthCheck()` |

---

## Environment Variables

Required environment variables for Consul connectivity:

```bash
# In docker-compose.hybrid.yml
CONSUL_HOST=consul-server      # Consul container name
CONSUL_PORT=8500                # Consul HTTP API port
CONSUL_SCHEME=http              # http or https
```

---

## Next Steps

1. **Week 3: Configuration Refresh**
   - Implement hot-reload of configuration changes
   - Add Consul watches for dynamic updates
   - Support configuration versioning

2. **Week 4: Service Discovery**
   - Register services with Consul
   - Implement health checks
   - Dynamic service discovery

3. **Security Enhancements**
   - Enable Consul ACLs
   - Encrypt sensitive values
   - Implement audit logging

---

## Additional Resources

- [Consul KV Store Documentation](https://developer.hashicorp.com/consul/docs/dynamic-app-config/kv)
- [Consul API Reference](https://developer.hashicorp.com/consul/api-docs/kv)
- [Test Suite Examples](./customer-service/src/infrastructure/config/__tests__/test-consul.ts)
- [TypeORM Integration](./customer-service/src/infrastructure/config/typeorm-consul.config.ts)
- [Redis Integration](./customer-service/src/infrastructure/config/redis-consul.config.ts)

---

**Last Updated:** October 28, 2025  
**Version:** 2.0 (Week 2 Implementation Complete)
