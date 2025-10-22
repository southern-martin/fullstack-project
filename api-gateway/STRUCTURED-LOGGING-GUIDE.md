# Structured Logging Implementation Guide

## Overview

This guide documents the structured logging implementation using Winston across all NestJS microservices. The logging infrastructure provides:

- **JSON-formatted logs** for easy parsing by Loki
- **Correlation IDs** for request tracing across services
- **Contextual metadata** (user ID, service name, request path)
- **Automatic request/response logging**
- **Database query logging with slow query detection**
- **Business event logging**

## Architecture

```
┌─────────────────────────────────────────┐
│     NestJS Application (Any Service)     │
├─────────────────────────────────────────┤
│  WinstonLoggerModule (Global)           │
│    └── WinstonLoggerService             │
│                                          │
│  Interceptors:                           │
│    └── LoggingInterceptor               │
│        - Correlation IDs                 │
│        - Request/Response tracking       │
│        - Response time measurement       │
│                                          │
│  TypeORM Logger:                         │
│    └── TypeOrmWinstonLogger (optional)  │
│        - Query logging                   │
│        - Slow query detection            │
└─────────────────────────────────────────┘
           │
           ├─> Console (Development)
           ├─> Docker stdout (Production)
           │
           └─> Loki
               - Promtail collects from Docker
               - Grafana for visualization
```

## Components

### 1. WinstonLoggerService

Location: `shared/infrastructure/src/logging/winston-logger.service.ts`

**Key Features:**
- Implements NestJS `LoggerService` interface
- Uses async_hooks for correlation ID tracking
- Supports structured metadata
- Colorized console output (dev) + JSON format (prod)

**Methods:**
```typescript
logger.log(message, metadata?, context?)
logger.error(message, trace?, context?)
logger.warn(message, metadata?, context?)
logger.debug(message, metadata?, context?)
logger.verbose(message, metadata?, context?)

// Specialized logging
logger.logRequest(method, url, statusCode, responseTime, userId?)
logger.logQuery(query, parameters, duration, error?)
logger.logEvent(eventName, eventData, userId?)
logger.logAuth(action, userId?, success?, metadata?)
```

### 2. LoggingInterceptor

Location: `shared/infrastructure/src/logging/logging.interceptor.ts`

**Features:**
- Generates/propagates correlation IDs
- Logs all HTTP requests and responses
- Tracks response times
- Detects slow responses (>3s)
- Sanitizes sensitive data (passwords, tokens)
- Sets X-Correlation-ID header

**Request Flow:**
```
Request arrives
  ↓
Generate/extract correlation ID
  ↓
Create async context with:
  - correlationId
  - userId (from JWT)
  - requestPath
  ↓
Log incoming request
  ↓
Execute request
  ↓
Log response (success or error)
  ↓
Set X-Correlation-ID header
```

### 3. TypeOrmWinstonLogger

Location: `shared/infrastructure/src/logging/typeorm-logger.ts`

**Features:**
- Integrates TypeORM with Winston
- Logs queries, slow queries, errors
- Configurable slow query threshold

**Note:** Currently disabled due to TypeORM version conflicts between services. Alternative: use TypeORM's built-in logging with `logging: true` in config.

## Implementation per Service

### Auth Service ✅

**Files Modified:**
- `src/main.ts` - Winston logger + LoggingInterceptor
- `src/app.module.ts` - WinstonLoggerModule import
- `src/application/use-cases/auth/login.use-case.ts` - Replace console.warn
- `src/infrastructure/events/in-memory-event-bus.ts` - Replace console.log/error

**Environment Variables (.env):**
```env
SERVICE_NAME=auth-service
LOG_LEVEL=info
NODE_ENV=development
DB_LOGGING=true
```

### User Service ✅

**Files Modified:**
- `src/main.ts` - Winston logger + LoggingInterceptor
- `src/app.module.ts` - WinstonLoggerModule import

**Environment Variables (.env):**
```env
SERVICE_NAME=user-service
LOG_LEVEL=info
NODE_ENV=development
DB_LOGGING=true
```

### Carrier Service ⏳

**TODO:**
- Update `src/main.ts`
- Update `src/app.module.ts`
- Replace console.log calls

### Customer Service ⏳

**TODO:**
- Update `src/main.ts`
- Update `src/app.module.ts`
- Replace console.log calls

### Pricing Service ⏳

**TODO:**
- Update `src/main.ts`
- Update `src/app.module.ts`
- Replace console.log calls

### Translation Service ⏳

**TODO:**
- Update `src/main.ts`
- Replace console.log calls

## Log Format

### Development (Console)

```
2024-10-22 10:30:45.123 [auth-service] info [abc-123-def][User: 456][LoginUseCase]: User login successful
{
  "userId": "456",
  "email": "user@example.com",
  "correlationId": "abc-123-def"
}
```

### Production (JSON)

```json
{
  "timestamp": "2024-10-22 10:30:45.123",
  "level": "info",
  "service": "auth-service",
  "environment": "production",
  "message": "User login successful",
  "context": "LoginUseCase",
  "correlationId": "abc-123-def",
  "userId": "456",
  "requestPath": "/api/v1/auth/login",
  "metadata": {
    "email": "user@example.com"
  }
}
```

## Correlation ID Flow

```
Frontend Request
  ↓
Kong Gateway (add X-Correlation-ID if missing)
  ↓
Auth Service (extract/propagate correlation ID)
  ├─> Log with correlation ID
  └─> Call User Service (pass X-Correlation-ID header)
      ↓
      User Service (use same correlation ID)
      └─> All logs use same correlation ID
```

## Querying Logs in Grafana

### View logs by correlation ID

```logql
{service="auth-service"} | json | correlationId="abc-123-def"
```

### Find all errors across services

```logql
{service=~".+"} | json | level="error"
```

### Track a specific user's activity

```logql
{service=~".+"} | json | userId="456"
```

### Find slow responses

```logql
{service=~".+"} | json | type="http_request" | responseTime > 3000
```

### Database query performance

```logql
{service=~".+"} | json | type="database_query" | duration > 1000
```

### Authentication events

```logql
{service="auth-service"} | json | type="authentication"
```

## Best Practices

### 1. Always Set Context

```typescript
@Injectable()
export class MyService {
  private readonly logger = new WinstonLoggerService();

  constructor() {
    this.logger.setContext('MyService');
  }
}
```

### 2. Include Metadata

```typescript
// Good - structured metadata
this.logger.log('User created', {
  userId: user.id,
  email: user.email,
  role: user.role
});

// Bad - unstructured
this.logger.log(`User created: ${user.email}`);
```

### 3. Use Specialized Methods

```typescript
// For HTTP requests
this.logger.logRequest('POST', '/api/v1/users', 201, 45, userId);

// For events
this.logger.logEvent('UserCreated', { userId, email });

// For auth
this.logger.logAuth('login', userId, true, { method: '2FA' });
```

### 4. Sanitize Sensitive Data

```typescript
// The LoggingInterceptor automatically sanitizes these fields:
// - password
// - token
// - secret
// - apiKey
// - accessToken
// - refreshToken

// For custom sanitization:
const sanitized = {
  ...data,
  password: '***REDACTED***'
};
this.logger.log('Data processed', sanitized);
```

### 5. Error Logging

```typescript
try {
  // ...
} catch (error) {
  this.logger.error(
    'Failed to process request',
    error.stack,
    'MyService'
  );
  throw error;
}
```

## Testing Structured Logging

### 1. Start a service with logging

```bash
cd auth-service
npm run start:dev
```

### 2. Make a request

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
```

### 3. Check logs

**Console output:**
```
2024-10-22 10:30:45.123 [auth-service] info [abc-123-def]: Incoming POST /api/v1/auth/login
2024-10-22 10:30:45.234 [auth-service] info [abc-123-def][User: 1]: Event: UserLoggedInEvent
2024-10-22 10:30:45.345 [auth-service] info [abc-123-def][User: 1]: HTTP Request
```

**Loki query:**
```logql
{container="auth-service"} | json | correlationId="abc-123-def"
```

## Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `SERVICE_NAME` | Service identifier | unknown-service | auth-service |
| `LOG_LEVEL` | Minimum log level | info | debug, info, warn, error |
| `NODE_ENV` | Environment | development | development, production |
| `DB_LOGGING` | Enable DB logging | false | true, false |

## Log Levels

- **error** - Errors and exceptions
- **warn** - Warnings and deprecated features
- **info** - General information (default)
- **debug** - Detailed debugging information
- **verbose** - Very detailed information

## Troubleshooting

### Logs not appearing in Loki

1. Check Promtail is running:
```bash
docker ps | grep promtail
```

2. Check Promtail logs:
```bash
docker logs promtail
```

3. Verify service is logging to stdout:
```bash
docker logs <service-container>
```

### TypeScript errors for logger

1. Rebuild shared infrastructure:
```bash
cd shared/infrastructure
npm run build
```

2. Reinstall in service:
```bash
cd auth-service
npm install
```

### Correlation IDs not working

1. Ensure LoggingInterceptor is registered:
```typescript
app.useGlobalInterceptors(new LoggingInterceptor(appLogger));
```

2. Check X-Correlation-ID header is being sent:
```bash
curl -v http://localhost:8000/api/v1/auth/health
```

## Next Steps

1. ✅ Complete structured logging for remaining services
2. ⏳ Add Kong access logging plugin
3. ⏳ Create Grafana dashboards for common queries
4. ⏳ Set up alerting for errors and slow queries
5. ⏳ Implement log retention policies
6. ⏳ Add performance benchmarks

## Resources

- [Winston Documentation](https://github.com/winstonjs/winston)
- [NestJS Logger](https://docs.nestjs.com/techniques/logger)
- [Loki LogQL](https://grafana.com/docs/loki/latest/logql/)
- [Grafana Explore](http://localhost:3100/explore)
