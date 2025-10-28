# 🚀 Consul Quick Reference Card

## One-Line Usage

```typescript
// Get config value
const value = await ConsulConfigService.getInstance().get('key', 'default');
```

---

## Common Patterns

### ⚡ Quick Setup (in any service)

```typescript
import { ConsulConfigService } from './infrastructure/config/consul.config';

const config = ConsulConfigService.getInstance();
await config.initialize(); // Do this once at startup

// Now use anywhere in your app
const port = await config.getNumber('port', 3000);
const dbHost = await config.get('database/host', 'localhost');
const redisHost = await config.getShared('redis/host', 'localhost');
```

---

## Method Cheat Sheet

| What You Want | Use This Method | Example |
|---------------|-----------------|---------|
| Service port | `getNumber('port')` | `await config.getNumber('port', 3004)` |
| Service name | `get('service_name')` | `await config.get('service_name')` |
| Database host | `get('database/host')` | `await config.get('database/host', 'localhost')` |
| Database port | `getNumber('database/port')` | `await config.getNumber('database/port', 3306)` |
| Redis host (shared) | `getShared('redis/host')` | `await config.getShared('redis/host', 'localhost')` |
| Redis port (shared) | `getSharedNumber('redis/port')` | `await config.getSharedNumber('redis/port', 6379)` |
| Feature flag | `getBoolean('features/flag')` | `await config.getBoolean('features/new_ui', false)` |
| Check Consul health | `healthCheck()` | `await config.healthCheck()` |

---

## Key Differences

### Service-Specific vs Shared

```typescript
// ❌ DON'T: Mix these up!
await config.get('redis/host')        // ❌ Looks in config/customer-service/redis/host
await config.getShared('port')        // ❌ Looks in config/shared/port

// ✅ DO: Use correct method for each config type
await config.getShared('redis/host')  // ✅ Looks in config/shared/redis/host
await config.get('port')              // ✅ Looks in config/customer-service/port
```

---

## Configuration Paths

```
Service Config:  config/{service-name}/{key}
Shared Config:   config/shared/{key}

Examples:
✓ config/customer-service/port
✓ config/customer-service/database/host
✓ config/shared/redis/host
✓ config/shared/database/shared_user_db/host
```

---

## TypeORM Integration (Copy-Paste Ready)

```typescript
// In typeorm-consul.config.ts
import { ConsulConfigService } from './consul.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export async function createTypeOrmConsulConfig(): Promise<TypeOrmModuleOptions> {
  const config = ConsulConfigService.getInstance();
  
  if (!config['initialized']) await config.initialize();
  
  return {
    type: 'mysql',
    host: await config.get('database/host', 'localhost'),
    port: await config.getNumber('database/port', 3306),
    username: await config.get('database/username', 'user'),
    password: await config.get('database/password', 'pass'),
    database: await config.get('database/database', 'mydb'),
    entities: [/* Your entities */],
    synchronize: false,
    migrations: ['dist/infrastructure/database/typeorm/migrations/*.js'],
    migrationsRun: true,
  };
}

// In app.module.ts
TypeOrmModule.forRootAsync({
  useFactory: async () => await createTypeOrmConsulConfig(),
})
```

---

## Redis Integration (Copy-Paste Ready)

```typescript
// In redis-consul.config.ts
import { ConsulConfigService } from './consul.config';

export async function createRedisConsulConfig() {
  const config = ConsulConfigService.getInstance();
  
  if (!config['initialized']) await config.initialize();
  
  return {
    host: await config.getShared('redis/host', 'localhost'),
    port: await config.getSharedNumber('redis/port', 6379),
    password: await config.getShared('redis/password', ''),
    keyPrefix: await config.get('redis_key_prefix', 'app'),
  };
}

// In app.module.ts
{
  provide: RedisCacheService,
  useFactory: async () => {
    const cfg = await createRedisConsulConfig();
    const url = `redis://:${cfg.password}@${cfg.host}:${cfg.port}`;
    return new RedisCacheService(url, cfg.keyPrefix);
  },
}
```

---

## Testing

```bash
# Run test suite for each service
cd customer-service && npx ts-node src/infrastructure/config/__tests__/test-consul.ts
cd carrier-service && npx ts-node src/infrastructure/config/__tests__/test-consul.ts
cd pricing-service && npx ts-node src/infrastructure/config/__tests__/test-consul.ts
cd user-service && npx ts-node src/infrastructure/config/__tests__/test-consul.ts
```

---

## Troubleshooting One-Liners

```bash
# Check Consul is running
docker ps | grep consul

# Check specific config value
curl 'http://localhost:8500/v1/kv/config/customer-service/port?raw'

# List all service configs
curl 'http://localhost:8500/v1/kv/config/customer-service?keys' | jq

# Add config value
curl -X PUT -d 'value' http://localhost:8500/v1/kv/config/customer-service/key

# Delete config value
curl -X DELETE http://localhost:8500/v1/kv/config/customer-service/key

# Check Consul health
curl http://localhost:8500/v1/status/leader
```

---

## Docker Environment Variables

```yaml
# Add to docker-compose.yml for each service
environment:
  CONSUL_HOST: consul-server
  CONSUL_PORT: 8500
  CONSUL_SCHEME: http
```

---

## Best Practices Summary

✅ **DO:**
- Initialize once at startup
- Use fallback defaults
- Use typed methods (`getNumber`, `getBoolean`)
- Test with provided test suites

❌ **DON'T:**
- Call `initialize()` multiple times
- Hard-code configuration values
- Mix service and shared configs
- Forget error handling

---

## Most Common Usage Pattern

```typescript
import { Injectable } from '@nestjs/common';
import { ConsulConfigService } from './infrastructure/config/consul.config';

@Injectable()
export class MyService {
  private config = ConsulConfigService.getInstance();
  
  async doSomething() {
    // Read any config on-demand
    const apiUrl = await this.config.get('external_api_url', 'https://api.example.com');
    const timeout = await this.config.getNumber('timeout', 5000);
    const enabled = await this.config.getBoolean('features/new_feature', false);
    
    // Use the values
    if (enabled) {
      await axios.get(apiUrl, { timeout });
    }
  }
}
```

---

**For full documentation, see:** [CONSUL-USAGE-GUIDE.md](./CONSUL-USAGE-GUIDE.md)
