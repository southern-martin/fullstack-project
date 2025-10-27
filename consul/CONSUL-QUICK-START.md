# Consul Config Server - Quick Start Guide

## ✅ What's Been Completed

### Week 1: Setup & Shared Configs ✅ COMPLETE

1. **Consul Server Setup** ✅
   - Added Consul to `docker-compose.hybrid.yml`
   - Consul UI accessible at: http://localhost:8500
   - Health checks configured
   - Data persistence via Docker volume

2. **Configuration Seeding** ✅
   - Created seeding script: `consul/seed-consul-config.sh`
   - Seeded 54 configuration keys
   - Organized by service and shared configs
   - All services' configuration available in Consul

3. **Documentation** ✅
   - Comprehensive setup guide: `consul/CONSUL-SETUP.md`
   - This quick start guide
   - Seeding script with colored output

## 🚀 Quick Commands

### Start Consul
```bash
docker-compose -f docker-compose.hybrid.yml up -d consul
```

### Check Consul Status
```bash
# View container status
docker ps | grep consul

# Check Consul members
docker exec consul-server consul members

# View logs
docker logs consul-server
```

### Access Consul UI
```
http://localhost:8500
```

### View Configuration
```bash
# View all configs
docker exec consul-server consul kv get -recurse config/

# View specific service config
docker exec consul-server consul kv get -recurse config/translation-service/

# Get a single value
docker exec consul-server consul kv get config/translation-service/max_batch_translation_size
```

### Seed Configuration (if needed)
```bash
./consul/seed-consul-config.sh
```

## 📋 Configuration Structure

```
config/
├── shared/
│   ├── redis/
│   │   ├── host: "shared-redis"
│   │   ├── port: "6379"
│   │   └── password: "shared_redis_password_2024"
│   └── database/shared_user_db/
│       ├── host: "shared-user-db"
│       ├── port: "3306"
│       ├── username: "shared_user"
│       ├── password: "shared_password_2024"
│       └── database: "shared_user_db"
│
├── auth-service/
│   ├── port: "3001"
│   ├── service_name: "auth-service"
│   ├── redis_key_prefix: "auth"
│   ├── jwt_secret: "your-jwt-secret-key-change-in-production"
│   ├── jwt_expiration: "24h"
│   ├── kong_admin_url: "http://kong-gateway:8001"
│   └── kong_sync_enabled: "true"
│
├── user-service/
├── customer-service/
├── carrier-service/
├── pricing-service/
└── translation-service/
    ├── port: "3007"
    ├── service_name: "translation-service"
    ├── max_batch_translation_size: "200"  ← Externalized config!
    └── ...
```

## 🎯 Next Steps - Week 2: Service Integration

### Goal
Migrate Translation Service to read from Consul (pilot integration)

### Tasks

#### 1. Install Consul Client Library
```bash
cd translation-service
npm install consul --save
```

#### 2. Create Consul Config Module
Create `src/infrastructure/config/consul-config.module.ts`:

```typescript
import { Module, Global } from '@nestjs/common';
import Consul from 'consul';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'CONSUL_CLIENT',
      useFactory: (configService: ConfigService) => {
        const consulEnabled = configService.get<string>('CONSUL_ENABLED', 'false');
        
        if (consulEnabled !== 'true') {
          return null; // Consul disabled, use .env
        }
        
        return new Consul({
          host: configService.get<string>('CONSUL_HOST', 'consul'),
          port: configService.get<string>('CONSUL_PORT', '8500'),
          promisify: true
        });
      },
      inject: [ConfigService]
    }
  ],
  exports: ['CONSUL_CLIENT']
})
export class ConsulConfigModule {}
```

#### 3. Create Consul Config Service
Create `src/infrastructure/config/consul-config.service.ts`:

```typescript
import { Injectable, Inject, Optional, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Consul from 'consul';

@Injectable()
export class ConsulConfigService {
  private readonly logger = new Logger(ConsulConfigService.name);
  private readonly consulEnabled: boolean;
  
  constructor(
    @Optional() @Inject('CONSUL_CLIENT') private readonly consul: Consul | null,
    private readonly configService: ConfigService
  ) {
    this.consulEnabled = this.configService.get<string>('CONSUL_ENABLED', 'false') === 'true';
  }
  
  /**
   * Get a config value from Consul or fallback to .env
   */
  async get<T = string>(key: string, defaultValue?: T): Promise<T> {
    if (!this.consulEnabled || !this.consul) {
      // Fallback to environment variables
      return this.configService.get<T>(key, defaultValue);
    }
    
    try {
      const consulKey = `config/translation-service/${key.toLowerCase()}`;
      const result = await this.consul.kv.get(consulKey);
      
      if (result && result.Value) {
        this.logger.log(`Loaded ${key} from Consul: ${consulKey}`);
        return result.Value as T;
      }
      
      // Fallback to .env if not found in Consul
      this.logger.warn(`Key ${consulKey} not found in Consul, using .env`);
      return this.configService.get<T>(key, defaultValue);
      
    } catch (error) {
      this.logger.error(`Error reading from Consul: ${error.message}`);
      return this.configService.get<T>(key, defaultValue);
    }
  }
  
  /**
   * Get numeric config value
   */
  async getNumber(key: string, defaultValue: number): Promise<number> {
    const value = await this.get(key, String(defaultValue));
    return parseInt(String(value), 10);
  }
}
```

#### 4. Update translate-text.use-case.ts
```typescript
import { ConsulConfigService } from '../../infrastructure/config/consul-config.service';

export class TranslateTextUseCase {
  private maxBatchSize: number;
  
  constructor(
    // ... existing dependencies
    private readonly consulConfig: ConsulConfigService
  ) {}
  
  async onModuleInit() {
    // Load config from Consul on startup
    this.maxBatchSize = await this.consulConfig.getNumber(
      'MAX_BATCH_TRANSLATION_SIZE',
      200
    );
    
    this.logger.log(`Batch translation limit: ${this.maxBatchSize}`);
  }
}
```

#### 5. Update docker-compose.hybrid.yml
Add Consul environment variables to translation-service:

```yaml
translation-service:
  environment:
    # ... existing vars
    CONSUL_ENABLED: "true"
    CONSUL_HOST: consul
    CONSUL_PORT: 8500
  depends_on:
    consul:
      condition: service_healthy
```

#### 6. Test Integration
```bash
# Rebuild and restart translation service
docker-compose -f docker-compose.hybrid.yml build translation-service
docker-compose -f docker-compose.hybrid.yml up -d translation-service

# Check logs for Consul connection
docker logs translation-service | grep -i consul

# Verify service still works
curl http://localhost:3007/api/v1/health
```

#### 7. Test Dynamic Config Update
```bash
# Update config in Consul
docker exec consul-server consul kv put config/translation-service/max_batch_translation_size 300

# TODO Week 3: Implement watch mechanism to reload without restart
```

## 🔄 Migration Status

| Service | Consul Integration | Status |
|---------|-------------------|--------|
| Translation Service | Week 2 (Pilot) | ⏳ Pending |
| Auth Service | Week 2 | ⏳ Pending |
| User Service | Week 2 | ⏳ Pending |
| Customer Service | Week 2 | ⏳ Pending |
| Carrier Service | Week 2 | ⏳ Pending |
| Pricing Service | Week 2 | ⏳ Pending |

## 📚 Resources

- **Comprehensive Guide**: `consul/CONSUL-SETUP.md`
- **Consul UI**: http://localhost:8500
- **Consul Docs**: https://www.consul.io/docs
- **Node Consul Client**: https://github.com/silas/node-consul

## ⚠️ Important Notes

### Backward Compatibility
- Services continue to work with .env files if `CONSUL_ENABLED=false`
- Consul is additive, not replacing existing configs immediately
- Gradual migration approach minimizes risk

### Security (Production)
- Current setup is for **development only**
- Production requires: ACLs, TLS, secrets management
- See `CONSUL-SETUP.md` for production recommendations

### Troubleshooting
```bash
# Consul not accessible
docker-compose -f docker-compose.hybrid.yml restart consul

# Reset configuration
docker exec consul-server consul kv delete -recurse config/
./consul/seed-consul-config.sh

# View Consul logs
docker logs -f consul-server
```

---

**Created**: 2025-01-27  
**Branch**: `feature/consul-config-server`  
**Status**: Week 1 Complete ✅, Week 2 In Progress ⏳
