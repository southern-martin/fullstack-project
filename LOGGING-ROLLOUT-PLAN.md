# 🚀 Logging Rollout Plan - Next 5 Services

## 📋 Rollout Strategy

**Approach**: Incremental rollout starting with most critical services
**Timeline**: ~2-3 hours total (30-40 minutes per service)
**Status**: auth-service ✅ COMPLETE | Remaining: 5 services

---

## 🎯 Service Priority Order

1. **user-service** (Priority 1) - Shares database with auth-service
2. **customer-service** (Priority 2) - Core business entity
3. **carrier-service** (Priority 3) - Core business entity
4. **pricing-service** (Priority 4) - Business logic service
5. **translation-service** (Priority 5) - Support service

---

## 🔧 Required Changes Per Service

### Step 1: Update package.json
```bash
cd <service-directory>
npm install winston@^3.18.3 --save
```

**OR** add to dependencies manually:
```json
{
  "dependencies": {
    "winston": "^3.18.3"
  }
}
```

### Step 2: Update Dockerfile
Add curl installation (for health checks):
```dockerfile
# After dependencies installation, before build
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
```

**Location**: After `RUN npm install` or `COPY --from=build`, before `CMD`

### Step 3: Update src/app.module.ts
Add `ignoreEnvFile` to ConfigModule (if present):
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: !!(process.env.DB_HOST), // ← ADD THIS LINE
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

**Purpose**: Prevents .env file from overriding docker-compose environment variables

### Step 4: Update src/main.ts
Fix WinstonLoggerService instantiation:
```typescript
import { NestFactory } from '@nestjs/core';
import { WinstonLoggerService } from '@app/shared/infrastructure/logging';
import { LoggingInterceptor } from '@app/shared/infrastructure/interceptors';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@app/shared/infrastructure/filters';
import { TransformInterceptor } from '@app/shared/infrastructure/interceptors';
import { AppModule } from './app.module';

async function bootstrap() {
  // ❌ DON'T: Pass logger to NestFactory (causes crash with scoped providers)
  // const app = await NestFactory.create(AppModule, { logger: logger });
  
  // ✅ DO: Create app without logger
  const app = await NestFactory.create(AppModule);
  
  // ❌ DON'T: Use app.get() for scoped providers
  // const logger = app.get(WinstonLoggerService);
  
  // ✅ DO: Direct instantiation for bootstrap logger
  const logger = new WinstonLoggerService();
  logger.setContext('Bootstrap');
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api/v1');
  
  const port = process.env.PORT || 3003; // ← UPDATE PORT FOR EACH SERVICE
  await app.listen(port);
  
  logger.log(`🚀 <SERVICE-NAME> is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/v1/health`);
  logger.log(`✅ Structured Logging: Winston JSON format enabled`);
  logger.log(`✅ Request/Response logging with correlation IDs enabled`);
}

bootstrap().catch((err) => {
  console.error('========== BOOTSTRAP ERROR ==========');
  console.error(err);
  console.error('=====================================');
  process.exit(1);
});
```

**Key Changes**:
- No `logger` option in `NestFactory.create()`
- Use `new WinstonLoggerService()` instead of `app.get()`
- Update port number for each service
- Update service name in log messages

### Step 5: Disable TypeORM SQL Logging
Update database configuration to reduce log noise:
```typescript
// In database module or ormconfig
{
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'database',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false, // ← ADD THIS LINE (or set to false if already present)
}
```

### Step 6: Update docker-compose.hybrid.yml
Ensure health check uses curl:
```yaml
services:
  <service-name>:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:<PORT>/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Also ensure SERVICE_NAME is set:
```yaml
services:
  <service-name>:
    environment:
      - SERVICE_NAME=<service-name>
      # ... other env vars
```

### Step 7: Rebuild and Test
```bash
# Rebuild service
docker-compose -f docker-compose.hybrid.yml build <service-name>

# Start service
docker-compose -f docker-compose.hybrid.yml up -d <service-name>

# Wait for healthy status
sleep 15

# Check status
docker-compose -f docker-compose.hybrid.yml ps <service-name>

# Test health endpoint
curl http://localhost:<PORT>/api/v1/health

# Check logs
docker logs <service-name> --tail 20

# Verify JSON format
docker logs <service-name> --tail 5 | jq .
```

---

## 📝 Checklist Per Service

- [ ] Install winston dependency
- [ ] Update Dockerfile (add curl)
- [ ] Update app.module.ts (ignoreEnvFile)
- [ ] Update main.ts (fix WinstonLoggerService)
- [ ] Disable TypeORM SQL logging
- [ ] Update docker-compose.hybrid.yml (health check)
- [ ] Rebuild and start service
- [ ] Verify health endpoint
- [ ] Check Winston JSON logs
- [ ] Test with correlation ID
- [ ] Query Loki for logs
- [ ] Mark as complete ✅

---

## 🎯 Service-Specific Details

### 1. user-service (Port 3003)
**Database**: Shares `shared_user_db` with auth-service
**Key Routes**:
- GET /api/v1/users/health
- GET /api/v1/users/:id
- POST /api/v1/users
- PUT /api/v1/users/:id

**Test Command**:
```bash
curl -H "X-Correlation-ID: test-user-$(date +%s)" \
  http://localhost:3003/api/v1/users/health
```

**Verification Query**:
```bash
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode 'query={service="user-service"} | json' \
  --data-urlencode "start=$(date -u -v-5M +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000" | jq -r '.data.result[0].values[0][1]'
```

---

### 2. customer-service (Port 3004)
**Database**: Independent `customer_db`
**Key Routes**:
- GET /api/v1/customers/health
- GET /api/v1/customers
- POST /api/v1/customers
- PUT /api/v1/customers/:id

**Test Command**:
```bash
curl -H "X-Correlation-ID: test-customer-$(date +%s)" \
  http://localhost:3004/api/v1/customers/health
```

---

### 3. carrier-service (Port 3005)
**Database**: Independent `carrier_db`
**Key Routes**:
- GET /api/v1/carriers/health
- GET /api/v1/carriers
- POST /api/v1/carriers
- PUT /api/v1/carriers/:id

**Test Command**:
```bash
curl -H "X-Correlation-ID: test-carrier-$(date +%s)" \
  http://localhost:3005/api/v1/carriers/health
```

---

### 4. pricing-service (Port 3006)
**Database**: Independent `pricing_db`
**Key Routes**:
- GET /api/v1/pricing/health
- POST /api/v1/pricing/calculate

**Test Command**:
```bash
curl -H "X-Correlation-ID: test-pricing-$(date +%s)" \
  http://localhost:3006/api/v1/pricing/health
```

---

### 5. translation-service (Port 3007)
**Database**: Independent `translation_db`
**Key Routes**:
- GET /api/v1/translations/health
- GET /api/v1/translations/languages
- GET /api/v1/translations/:code

**Test Command**:
```bash
curl -H "X-Correlation-ID: test-translation-$(date +%s)" \
  http://localhost:3007/api/v1/translations/health
```

---

## 🧪 Testing After All Services Updated

### Multi-Service Correlation ID Test
```bash
CORRELATION_ID="multi-service-$(date +%s)"

# Hit each service with same correlation ID
curl -H "X-Correlation-ID: $CORRELATION_ID" http://localhost:3001/api/v1/auth/health
curl -H "X-Correlation-ID: $CORRELATION_ID" http://localhost:3003/api/v1/users/health
curl -H "X-Correlation-ID: $CORRELATION_ID" http://localhost:3004/api/v1/customers/health
curl -H "X-Correlation-ID: $CORRELATION_ID" http://localhost:3005/api/v1/carriers/health
curl -H "X-Correlation-ID: $CORRELATION_ID" http://localhost:3006/api/v1/pricing/health
curl -H "X-Correlation-ID: $CORRELATION_ID" http://localhost:3007/api/v1/translations/health

# Query all logs with this correlation ID
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode "query={service=~\"auth-service|user-service|customer-service|carrier-service|pricing-service|translation-service\"} | json | metadata_correlationId=\"$CORRELATION_ID\"" \
  --data-urlencode "start=$(date -u -v-5M +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000" | jq -r '.data.result[].values[] | "\(.[1] | fromjson | "\(.service) - \(.message)")"'
```

### Log Volume by Service
```bash
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode 'query=sum by (service) (count_over_time({service=~".+"} [5m]))' \
  --data-urlencode "start=$(date -u -v-1H +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000"
```

### Error Rate Across All Services
```bash
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode 'query={service=~".+"} | json | level="error"' \
  --data-urlencode "start=$(date -u -v-1H +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000"
```

---

## ⚠️ Common Pitfalls

### 1. Scoped Provider Error
**Error**: `InvalidClassScopeException: WinstonLoggerService is marked as a scoped provider`
**Solution**: Use `new WinstonLoggerService()` instead of `app.get(WinstonLoggerService)`

### 2. Database Connection Failure
**Error**: `ECONNREFUSED 127.0.0.1:3306`
**Solution**: Add `ignoreEnvFile: !!(process.env.DB_HOST)` to ConfigModule

### 3. Health Check Failing
**Error**: Container restarts with "unhealthy" status
**Solution**: 
- Ensure curl is installed in Dockerfile
- Use correct port in health check URL
- Wait longer: `start_period: 40s`

### 4. Winston Module Not Found
**Error**: `Cannot find module 'winston'`
**Solution**: Ensure winston is in dependencies (not devDependencies) and rebuild Docker image

### 5. Logs Not in JSON Format
**Error**: Loki queries return empty or unparseable logs
**Solution**: Verify `winston.format.json()` is used in WinstonLoggerService (shared infrastructure)

---

## 📊 Success Metrics

After completing all 5 services:
- ✅ All services running with "healthy" status
- ✅ All services logging in JSON format
- ✅ Correlation IDs propagating across services
- ✅ Loki ingesting logs from all 6 services
- ✅ LogQL queries returning data from all services
- ✅ Error logs include stack traces
- ✅ Request/response logs include performance metrics
- ✅ Business events logged with full context

---

## 🎯 Next Steps After Rollout

1. **Create Grafana Dashboard**
   - Log volume by service
   - Error rate by service
   - Response time distribution
   - Top slow endpoints
   - Recent errors panel

2. **Performance Testing**
   - Generate load on all services
   - Monitor log volume in Loki
   - Test query performance
   - Verify no log ingestion delays

3. **Distributed Tracing**
   - Test cross-service requests
   - Verify correlation ID propagation
   - Create example trace diagrams
   - Document common trace patterns

4. **Alerting (Future)**
   - Error rate thresholds
   - Response time SLAs
   - Service health alerts
   - Log volume anomalies

---

## 📚 References

- **Success Documentation**: `/LOGGING-INFRASTRUCTURE-SUCCESS.md`
- **Quick Command Reference**: `/LOGGING-QUICK-REFERENCE.md`
- **Auth Service Implementation**: `/auth-service/src/main.ts`
- **Winston Configuration**: `/shared/infrastructure/src/logging/winston-logger.service.ts`
- **Docker Compose**: `/docker-compose.hybrid.yml`
- **Promtail Config**: `/api-gateway/promtail/promtail-config.yml`

---

## 🚀 Ready to Start?

Begin with **user-service** (highest priority):
```bash
cd user-service
npm install winston@^3.18.3 --save
# Follow steps 2-7 from "Required Changes Per Service"
```

**Estimated Time**: 30-40 minutes per service × 5 services = **2.5-3.5 hours total**

Good luck! 🎉
