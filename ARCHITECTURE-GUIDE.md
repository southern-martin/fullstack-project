# 🏗️ Architecture Guide - Fullstack Microservices Project

> **Comprehensive reference for developers and AI agents**
> 
> This guide documents the complete architecture, design patterns, coding standards, and development workflows for the fullstack microservices project.

**Last Updated**: October 26, 2025  
**Project Version**: 2.0  
**Architecture**: Hybrid Microservices with Clean Architecture

---

## 📋 Table of Contents

1. [Architecture Overview](#-architecture-overview)
2. [Clean Architecture Pattern](#-clean-architecture-pattern)
3. [NestJS Service Structure](#-nestjs-service-structure)
4. [Critical Design Patterns](#-critical-design-patterns)
5. [Database Architecture](#-database-architecture)
6. [Coding Standards](#-coding-standards)
7. [Development Workflows](#-development-workflows)
8. [Common Commands](#-common-commands)
9. [Docker Patterns](#-docker-patterns)
10. [Troubleshooting Patterns](#-troubleshooting-patterns)
11. [AI Agent Prompts](#-ai-agent-prompts)

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Admin Dashboard                       │
│                        (Port 3000)                              │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ HTTP/REST
             │
┌────────────┴────────────────────────────────────────────────────┐
│                     API Gateway (Future)                        │
│                    Kong / Nginx (Port 80)                       │
└────────────┬────────────────────────────────────────────────────┘
             │
     ┌───────┴────────┐
     │                │
┌────┴─────┐    ┌────┴──────────────────────────────────┐
│   Auth   │    │        Business Services               │
│ Services │    │  (Carrier, Customer, Pricing)          │
└────┬─────┘    └────┬──────────────────────────────────┘
     │               │
┌────┴─────────┬─────┴───────┬────────────┬──────────────┐
│ Auth Service │ User Service│ Carrier Svc│ Customer Svc │ Pricing Svc
│ Port: 3001   │ Port: 3003  │ Port: 3005 │ Port: 3004   │ Port: 3006
│ NestJS       │ NestJS      │ NestJS     │ NestJS       │ NestJS
└──────┬───────┴──────┬──────┴─────┬──────┴───────┬──────┴──────┬─────
       │              │            │              │             │
   ┌───┴───────┐      │        ┌───┴────┐    ┌───┴────┐   ┌───┴────┐
   │ Shared DB │      │        │Carrier │    │Customer│   │Pricing │
   │  MySQL    │◄─────┘        │  DB    │    │   DB   │   │   DB   │
   │ Port 3306 │               │Port3310│    │Port3309│   │Port3311│
   └───────────┘               └────────┘    └────────┘   └────────┘
        ▲
        │
   ┌────┴──────────────────────────────────────────────────────────┐
   │                  Shared Redis Cache                           │
   │                    Port: 6379                                 │
   └───────────────────────────────────────────────────────────────┘
```

### Microservices Inventory

| Service | Port | Stack | Database | Purpose | Swagger |
|---------|------|-------|----------|---------|---------|
| **auth-service** | 3001 | NestJS + TypeScript | Shared MySQL | JWT authentication, login/logout | ✅ `/api/docs` |
| **user-service** | 3003 | NestJS + TypeScript | Shared MySQL | User & role management | ✅ `/api/docs` |
| **carrier-service** | 3005 | NestJS + TypeScript | MySQL (3310) | Logistics carrier operations | ✅ `/api/docs` |
| **customer-service** | 3004 | NestJS + TypeScript | MySQL (3309) | Customer management | ✅ `/api/docs` |
| **pricing-service** | 3006 | NestJS + TypeScript | MySQL (3311) | Dynamic pricing calculations | ✅ `/api/docs` |
| **translation-service** | 3007 | NestJS + TypeScript | MySQL (3312) | i18n translations | ✅ `/api/docs` |
| **react-admin** | 3000 | React 18 + TypeScript | - | Admin dashboard UI | - |

### Shared Infrastructure

```yaml
Databases:
  shared-user-database:
    type: MySQL 8.0
    port: 3306
    users: auth-service, user-service
    strategy: "Shared database for tightly coupled user/auth data"
  
  carrier-service-db:
    type: MySQL 8.0
    port: 3310
    strategy: "Separate database for loose coupling"
  
  customer-service-db:
    type: MySQL 8.0
    port: 3309
    strategy: "Separate database for loose coupling"
  
  pricing-service-db:
    type: MySQL 8.0
    port: 3311
    strategy: "Separate database for loose coupling"

Cache:
  shared-redis:
    type: Redis 7
    port: 6379
    purpose: "Session storage, caching, event bus"
    key-prefixes:
      - "auth:" (auth-service)
      - "user:" (user-service)
      - "carrier:" (carrier-service)
      - "customer:" (customer-service)
      - "pricing:" (pricing-service)
```

---

## 🎯 Clean Architecture Pattern

All NestJS services follow **Clean Architecture** with strict layer separation:

### Directory Structure

```
service-name/
├── src/
│   ├── application/              # Application Layer (Use Cases)
│   │   ├── use-cases/           # Business use cases
│   │   │   ├── create-entity.use-case.ts
│   │   │   ├── update-entity.use-case.ts
│   │   │   └── delete-entity.use-case.ts
│   │   └── application.module.ts
│   │
│   ├── domain/                   # Domain Layer (Business Logic)
│   │   ├── entities/            # Domain entities (pure TypeScript)
│   │   │   └── entity.ts
│   │   ├── repositories/        # Repository interfaces
│   │   │   └── entity.repository.interface.ts
│   │   ├── services/            # Domain services
│   │   │   └── entity.domain.service.ts
│   │   └── events/              # Domain events
│   │       └── entity-created.event.ts
│   │
│   ├── infrastructure/           # Infrastructure Layer
│   │   ├── database/
│   │   │   ├── typeorm/
│   │   │   │   ├── entities/   # TypeORM entities
│   │   │   │   │   └── entity.typeorm.entity.ts
│   │   │   │   └── repositories/
│   │   │   │       └── entity.typeorm.repository.ts
│   │   │   └── database.module.ts
│   │   └── messaging/           # Event bus, message queues
│   │
│   └── interfaces/               # Interface Layer (Controllers, DTOs)
│       ├── http/
│       │   ├── controllers/
│       │   │   └── entity.controller.ts
│       │   └── dtos/
│       │       ├── create-entity.dto.ts
│       │       ├── update-entity.dto.ts
│       │       └── entity-response.dto.ts
│       └── interfaces.module.ts
│
├── test/                         # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── Dockerfile                    # Multi-stage Docker build
├── package.json
├── tsconfig.json
└── nest-cli.json
```

### Layer Responsibilities

#### 1️⃣ **Domain Layer** (Core Business Logic)
- **NO external dependencies** (no NestJS, TypeORM, HTTP libraries)
- Pure TypeScript classes
- Business rules and validation
- Domain events

```typescript
// domain/entities/customer.ts
export class Customer {
  constructor(
    private readonly id: string,
    private name: string,
    private email: string,
    private phone: string,
  ) {
    this.validateEmail(email);
    this.validatePhone(phone);
  }

  private validateEmail(email: string): void {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  // Domain logic only
  updateContactInfo(email: string, phone: string): void {
    this.validateEmail(email);
    this.validatePhone(phone);
    this.email = email;
    this.phone = phone;
  }
}
```

#### 2️⃣ **Application Layer** (Use Cases)
- Orchestrates domain objects
- Transaction boundaries
- Business workflows
- Depends ONLY on domain layer

```typescript
// application/use-cases/create-customer.use-case.ts
import { Injectable } from '@nestjs/common';
import { CustomerRepositoryInterface } from '../../domain/repositories/customer.repository.interface';
import { CustomerDomainService } from '../../domain/services/customer.domain.service';
import { Customer } from '../../domain/entities/customer';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly domainService: CustomerDomainService,
  ) {}

  async execute(data: CreateCustomerDto): Promise<Customer> {
    // Use domain service for validation
    await this.domainService.validateUniqueEmail(data.email);
    
    // Create domain entity
    const customer = new Customer(
      generateId(),
      data.name,
      data.email,
      data.phone,
    );
    
    // Persist via repository
    return this.customerRepository.save(customer);
  }
}
```

#### 3️⃣ **Infrastructure Layer** (Technical Details)
- TypeORM entities and repositories
- External service clients
- Database connections
- Message queues

```typescript
// infrastructure/database/typeorm/repositories/customer.typeorm.repository.ts
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepositoryInterface } from '../../../../domain/repositories/customer.repository.interface';
import { CustomerTypeOrmEntity } from '../entities/customer.typeorm.entity';
import { BaseTypeOrmRepository } from '@shared/infrastructure';

export class CustomerTypeOrmRepository 
  extends BaseTypeOrmRepository<CustomerTypeOrmEntity>
  implements CustomerRepositoryInterface 
{
  constructor(
    @InjectRepository(CustomerTypeOrmEntity)
    protected readonly repository: Repository<CustomerTypeOrmEntity>,
    protected readonly redisCache: RedisCacheService,
  ) {
    super(repository, redisCache, 'customer');
  }
  
  async findByEmail(email: string): Promise<CustomerTypeOrmEntity | null> {
    const cacheKey = `customer:email:${email}`;
    return this.findOneWithCache({ where: { email } }, cacheKey);
  }
}
```

#### 4️⃣ **Interface Layer** (HTTP Controllers, DTOs)
- REST controllers
- Request/Response DTOs
- Swagger documentation
- Input validation

```typescript
// interfaces/http/controllers/customer.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCustomerUseCase } from '../../../application/use-cases/create-customer.use-case';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CustomerResponseDto } from '../dtos/customer-response.dto';

@ApiTags('customers')
@Controller('api/v1/customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, type: CustomerResponseDto })
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.createCustomerUseCase.execute(dto);
    return CustomerResponseDto.fromDomain(customer);
  }
}
```

---

## 🔧 NestJS Service Structure

### Module Organization

Every NestJS service has these core modules:

```typescript
// app.module.ts - Root module
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '@shared/infrastructure/logging/winston-logger.module';
import { RedisCacheService } from '@shared/infrastructure';

/**
 * ⚠️ CRITICAL: @Global() decorator is REQUIRED for infrastructure services
 * 
 * Without @Global(), child modules cannot inject exported providers
 * even if they're in the exports array. This is a NestJS requirement.
 */
@Global()
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Structured logging
    WinstonLoggerModule,

    // Database connection
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'service_db',
      entities: [__dirname + '/**/*.typeorm.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
    }),

    // Clean Architecture layers
    ApplicationModule,
    DatabaseModule,
    InterfacesModule,
  ],
  providers: [
    // Global Redis cache service factory
    {
      provide: RedisCacheService,
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get('REDIS_HOST', 'shared-redis');
        const redisPort = configService.get('REDIS_PORT', 6379);
        const redisPassword = configService.get('REDIS_PASSWORD', '');
        const redisUrl = redisPassword
          ? `redis://:${redisPassword}@${redisHost}:${redisPort}`
          : `redis://${redisHost}:${redisPort}`;
        
        return new RedisCacheService({
          redisUrl,
          prefix: configService.get('REDIS_KEY_PREFIX', 'service:'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisCacheService], // Export for all modules
})
export class AppModule {}
```

### Swagger Configuration

```typescript
// main.ts - Swagger setup
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Service Name API')
    .setDescription('API documentation for Service Name')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('service-name')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
  
  console.log(`🚀 Service is running on: http://localhost:${process.env.PORT || 3000}`);
  console.log(`📚 API Documentation: http://localhost:${process.env.PORT || 3000}/api/docs`);
}
bootstrap();
```

---

## 🎨 Critical Design Patterns

### Pattern 1: @Global() Decorator for Infrastructure Services

**Problem**: Repository can't inject `RedisCacheService` even though it's exported from `AppModule`

**Error**:
```
Nest can't resolve dependencies of the CustomerRepository (?, RedisCacheService).
Please make sure that the argument RedisCacheService at index [1] 
is available in the DatabaseModule context.
```

**Root Cause**: 
- In NestJS, modules have **local scope** by default
- Exporting a provider from a module doesn't make it globally available
- Child modules can only access providers if they explicitly import the parent module
- This creates circular dependency issues

**Solution**: Add `@Global()` decorator to `AppModule`

```typescript
// ❌ WRONG - Without @Global()
@Module({
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class AppModule {}

// ✅ CORRECT - With @Global()
import { Global, Module } from '@nestjs/common';

@Global()  // ← Makes this module globally available
@Module({
  providers: [RedisCacheService],
  exports: [RedisCacheService],  // Still need to export
})
export class AppModule {}
```

**When to Use**:
- ✅ Infrastructure services (logging, caching, config)
- ✅ Cross-cutting concerns used by all modules
- ✅ Services that would otherwise create circular dependencies
- ❌ Business logic services (should be explicitly imported)
- ❌ Domain services (violates Clean Architecture)

**Applied To**:
- `customer-service/src/app.module.ts`
- `pricing-service/src/app.module.ts`
- `carrier-service/src/app.module.ts`

### Pattern 2: BaseTypeOrmRepository Pattern

All repositories extend a shared base class for consistent caching and CRUD operations:

```typescript
// shared/infrastructure/src/database/base-typeorm.repository.ts
import { Repository, FindOptionsWhere, FindOneOptions } from 'typeorm';
import { RedisCacheService } from '../cache/redis-cache.service';

export abstract class BaseTypeOrmRepository<T> {
  protected readonly cacheTTL = 3600; // 1 hour

  constructor(
    protected readonly repository: Repository<T>,
    protected readonly redisCache: RedisCacheService,
    protected readonly entityName: string,
  ) {}

  async findOneWithCache(
    options: FindOneOptions<T>,
    cacheKey: string,
  ): Promise<T | null> {
    // Try cache first
    const cached = await this.redisCache.get<T>(cacheKey);
    if (cached) return cached;

    // Query database
    const entity = await this.repository.findOne(options);
    if (entity) {
      await this.redisCache.set(cacheKey, entity, this.cacheTTL);
    }
    return entity || null;
  }

  async save(entity: T): Promise<T> {
    const saved = await this.repository.save(entity);
    // Invalidate cache
    await this.invalidateCache(saved);
    return saved;
  }

  protected async invalidateCache(entity: T): Promise<void> {
    const id = (entity as any).id;
    await this.redisCache.del(`${this.entityName}:${id}`);
  }
}
```

**Usage**:
```typescript
export class CustomerTypeOrmRepository extends BaseTypeOrmRepository<CustomerTypeOrmEntity> {
  constructor(
    @InjectRepository(CustomerTypeOrmEntity)
    repository: Repository<CustomerTypeOrmEntity>,
    redisCache: RedisCacheService,  // ← Injected from @Global() AppModule
  ) {
    super(repository, redisCache, 'customer');
  }
}
```

### Pattern 3: Shared Infrastructure as Symlinks

**Problem**: Avoid code duplication for common infrastructure code (logging, caching, events)

**Solution**: Symlink approach with TypeScript path mapping

```bash
# Directory structure
shared/
└── infrastructure/
    ├── src/
    │   ├── cache/
    │   │   └── redis-cache.service.ts
    │   ├── database/
    │   │   └── base-typeorm.repository.ts
    │   ├── logging/
    │   │   └── winston-logger.module.ts
    │   └── index.ts
    ├── package.json
    └── tsconfig.json

# Each service creates symlink in Dockerfile
RUN ln -s /app/shared/infrastructure/dist /app/shared/infrastructure/src

# TypeScript path mapping (tsconfig.json)
{
  "compilerOptions": {
    "paths": {
      "@shared/infrastructure": ["../shared/infrastructure/src"],
      "@shared/infrastructure/*": ["../shared/infrastructure/src/*"]
    }
  }
}

# Runtime resolution (Dockerfile)
ENV NODE_PATH=/app/shared/infrastructure/node_modules:/app/service-name/node_modules
```

### Pattern 4: Factory Provider Pattern

Use factory providers for services that need configuration:

```typescript
{
  provide: RedisCacheService,
  useFactory: (configService: ConfigService) => {
    const redisHost = configService.get('REDIS_HOST', 'shared-redis');
    const redisPort = configService.get('REDIS_PORT', 6379);
    const redisPassword = configService.get('REDIS_PASSWORD', '');
    
    const redisUrl = redisPassword
      ? `redis://:${redisPassword}@${redisHost}:${redisPort}`
      : `redis://${redisHost}:${redisPort}`;
    
    return new RedisCacheService({
      redisUrl,
      prefix: configService.get('REDIS_KEY_PREFIX', 'service:'),
    });
  },
  inject: [ConfigService],
}
```

---

## 🗄️ Database Architecture

### Hybrid Strategy

The project uses a **hybrid database architecture**:

#### Shared Database Pattern
- **Services**: auth-service, user-service
- **Database**: `shared-user-database` (Port 3306)
- **Reason**: User and authentication data are tightly coupled
- **Entities**: `UserTypeOrmEntity`, `RoleTypeOrmEntity`
- **Trade-off**: Services are coupled via database schema

```sql
-- shared-user-database schema
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  user_id VARCHAR(36),
  role_id VARCHAR(36),
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

#### Separate Database Pattern
- **Services**: carrier-service, customer-service, pricing-service
- **Databases**: Independent MySQL instances per service
- **Reason**: Business services are loosely coupled
- **Trade-off**: Higher infrastructure cost, better scalability

```yaml
carrier-service-db:    # Port 3310
customer-service-db:   # Port 3309
pricing-service-db:    # Port 3311
```

### Migration Strategy

```bash
# Generate migration
npm run typeorm:migration:generate -- -n MigrationName

# Run migrations
npm run typeorm:migration:run

# Revert migration
npm run typeorm:migration:revert
```

**Important**: Auth and User services share schema - coordinate migrations!

---

## 📝 Coding Standards

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": false,
    "paths": {
      "@shared/infrastructure": ["../shared/infrastructure/src"],
      "@shared/infrastructure/*": ["../shared/infrastructure/src/*"]
    }
  }
}
```

### Naming Conventions

```typescript
// Classes: PascalCase
export class CustomerDomainService {}
export class CreateCustomerUseCase {}
export class CustomerController {}

// Interfaces: PascalCase with 'Interface' suffix
export interface CustomerRepositoryInterface {}
export interface LoggerInterface {}

// Files: kebab-case
customer.domain.service.ts
create-customer.use-case.ts
customer.controller.ts
customer.repository.interface.ts

// TypeORM entities: PascalCase with 'TypeOrmEntity' suffix
export class CustomerTypeOrmEntity {}
customer.typeorm.entity.ts

// DTOs: PascalCase with 'Dto' suffix
export class CreateCustomerDto {}
export class UpdateCustomerDto {}
export class CustomerResponseDto {}

// Constants: UPPER_SNAKE_CASE
export const MAX_RETRY_ATTEMPTS = 3;
export const CACHE_TTL = 3600;

// Variables and functions: camelCase
const customerService = new CustomerService();
async function createCustomer() {}
```

### Code Organization

```typescript
// 1. Imports (grouped and ordered)
// a) External libraries
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// b) Shared infrastructure
import { RedisCacheService } from '@shared/infrastructure';

// c) Domain layer
import { Customer } from '../../domain/entities/customer';
import { CustomerRepositoryInterface } from '../../domain/repositories/customer.repository.interface';

// d) Local imports
import { CustomerTypeOrmEntity } from './entities/customer.typeorm.entity';

// 2. Class/Interface definition with JSDoc
/**
 * Customer Repository Implementation
 * Handles customer persistence with Redis caching
 */
@Injectable()
export class CustomerTypeOrmRepository implements CustomerRepositoryInterface {
  // 3. Constructor with dependency injection
  constructor(
    @InjectRepository(CustomerTypeOrmEntity)
    private readonly repository: Repository<CustomerTypeOrmEntity>,
    private readonly redisCache: RedisCacheService,
  ) {}

  // 4. Public methods first
  async findById(id: string): Promise<Customer | null> {
    // Implementation
  }

  // 5. Private methods last
  private mapToDomain(entity: CustomerTypeOrmEntity): Customer {
    // Implementation
  }
}
```

### Error Handling

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

// Domain exceptions
export class CustomerAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`Customer with email ${email} already exists`);
    this.name = 'CustomerAlreadyExistsException';
  }
}

// HTTP exceptions in controllers
@Post()
async create(@Body() dto: CreateCustomerDto) {
  try {
    return await this.createCustomerUseCase.execute(dto);
  } catch (error) {
    if (error instanceof CustomerAlreadyExistsException) {
      throw new HttpException(
        { message: error.message, code: 'CUSTOMER_EXISTS' },
        HttpStatus.CONFLICT,
      );
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
```

### Logging Standards

```typescript
import { Logger } from '@nestjs/common';

export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  async createCustomer(dto: CreateCustomerDto): Promise<Customer> {
    this.logger.log(`Creating customer: ${dto.email}`);
    
    try {
      const customer = await this.repository.save(dto);
      this.logger.log(`Customer created: ${customer.id}`);
      return customer;
    } catch (error) {
      this.logger.error(
        `Failed to create customer: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
```

---

## 🔄 Development Workflows

### Starting Development

```bash
# 1. Start infrastructure
cd shared-database
docker-compose up -d

# 2. Start Redis
cd ../shared-redis
docker-compose up -d

# 3. Start all services
cd ..
docker-compose -f docker-compose.hybrid.yml up -d

# 4. Check health
docker ps
curl http://localhost:3001/api/v1/auth/health
curl http://localhost:3003/api/v1/health
curl http://localhost:3004/api/v1/health
curl http://localhost:3005/api/v1/health
curl http://localhost:3006/api/v1/health
```

### Adding a New Feature

```bash
# Example: Add new endpoint to customer-service

# 1. Create domain entity (if needed)
touch customer-service/src/domain/entities/customer-address.ts

# 2. Create repository interface
touch customer-service/src/domain/repositories/customer-address.repository.interface.ts

# 3. Create use case
touch customer-service/src/application/use-cases/add-customer-address.use-case.ts

# 4. Create TypeORM entity
touch customer-service/src/infrastructure/database/typeorm/entities/customer-address.typeorm.entity.ts

# 5. Create repository implementation
touch customer-service/src/infrastructure/database/typeorm/repositories/customer-address.typeorm.repository.ts

# 6. Create DTOs
touch customer-service/src/interfaces/http/dtos/create-address.dto.ts
touch customer-service/src/interfaces/http/dtos/address-response.dto.ts

# 7. Add controller method
# Edit: customer-service/src/interfaces/http/controllers/customer.controller.ts

# 8. Register in modules
# Edit: database.module.ts, application.module.ts

# 9. Test locally
cd customer-service
npm run build
npm run start:dev

# 10. Test endpoint
curl -X POST http://localhost:3004/api/v1/customers/123/addresses \
  -H "Content-Type: application/json" \
  -d '{"street": "123 Main St", "city": "City"}'

# 11. Build Docker image
docker-compose -f docker-compose.hybrid.yml build customer-service

# 12. Deploy
docker-compose -f docker-compose.hybrid.yml up -d customer-service

# 13. Verify
docker logs customer-service --tail 50
curl http://localhost:3004/api/docs
```

### Running Tests

```bash
# Unit tests
npm run test

# Specific file
npm run test -- customer.domain.service.spec.ts

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

### Debugging

```bash
# Start service in debug mode
npm run start:debug

# Attach debugger in VS Code
# .vscode/launch.json:
{
  "type": "node",
  "request": "attach",
  "name": "Attach to NestJS",
  "port": 9229,
  "restart": true,
  "sourceMaps": true,
  "outFiles": ["${workspaceFolder}/dist/**/*.js"]
}
```

---

## 🐳 Docker Patterns

### Multi-Stage Dockerfile

```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared infrastructure
COPY shared/infrastructure ./shared/infrastructure
WORKDIR /app/shared/infrastructure
RUN npm ci && npm run build

# Copy service
WORKDIR /app/service-name
COPY service-name/package*.json ./
RUN npm ci --legacy-peer-deps && npm cache clean --force

COPY service-name/ ./
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app/service-name

# Copy shared infrastructure from builder
COPY --from=builder /app/shared/infrastructure /app/shared/infrastructure

# Create symlink for runtime resolution
RUN rm -rf /app/shared/infrastructure/src && \
    ln -s /app/shared/infrastructure/dist /app/shared/infrastructure/src

# Copy service dependencies
COPY --from=builder /app/service-name/package*.json ./
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Copy built service
COPY --from=builder /app/service-name/dist ./dist

# Set ownership
RUN chown -R nestjs:nodejs /app

# Set NODE_PATH for module resolution
ENV NODE_PATH=/app/shared/infrastructure/node_modules:/app/service-name/node_modules

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health || exit 1

CMD ["node", "dist/main"]
```

### Docker Compose Service Template

```yaml
service-name:
  build:
    context: .
    dockerfile: service-name/Dockerfile
  container_name: service-name
  ports:
    - "3000:3000"
  environment:
    NODE_ENV: ${NODE_ENV:-development}
    PORT: 3000
    DB_HOST: service-name-db
    DB_PORT: 3306
    DB_USERNAME: ${DB_USERNAME:-root}
    DB_PASSWORD: ${DB_PASSWORD:-password}
    DB_NAME: ${DB_NAME:-service_db}
    REDIS_HOST: shared-redis
    REDIS_PORT: 6379
    REDIS_KEY_PREFIX: service:
  depends_on:
    service-name-db:
      condition: service_healthy
    shared-redis:
      condition: service_healthy
  networks:
    - app-network
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000/api/v1/health"]
    interval: 30s
    timeout: 3s
    retries: 3
    start_period: 40s
  restart: unless-stopped

service-name-db:
  image: mysql:8.0
  container_name: service-name-db
  ports:
    - "3306:3306"
  environment:
    MYSQL_ROOT_PASSWORD: ${DB_PASSWORD:-password}
    MYSQL_DATABASE: ${DB_NAME:-service_db}
  volumes:
    - service-name-db-data:/var/lib/mysql
  networks:
    - app-network
  healthcheck:
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
    interval: 10s
    timeout: 5s
    retries: 5
  restart: unless-stopped

volumes:
  service-name-db-data:

networks:
  app-network:
    driver: bridge
```

---

## 🔧 Common Commands

### Docker Management

```bash
# Build all services
docker-compose -f docker-compose.hybrid.yml build

# Build specific service
docker-compose -f docker-compose.hybrid.yml build customer-service

# Start all services
docker-compose -f docker-compose.hybrid.yml up -d

# Start specific service
docker-compose -f docker-compose.hybrid.yml up -d customer-service

# View logs
docker logs customer-service --tail 100 -f

# Check container health
docker ps --filter "name=customer-service"

# Restart service
docker-compose -f docker-compose.hybrid.yml restart customer-service

# Stop all services
docker-compose -f docker-compose.hybrid.yml down

# Remove volumes (CAREFUL!)
docker-compose -f docker-compose.hybrid.yml down -v

# Clean up Docker
docker system prune -af --volumes  # Frees up disk space
```

### Service Management

```bash
# Install dependencies
cd service-name
npm install

# Build locally
npm run build

# Run locally
npm run start:dev

# Run in production mode
npm run start:prod

# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Database Management

```bash
# Connect to database
docker exec -it shared-user-database mysql -u root -p

# Run SQL query
docker exec -it shared-user-database mysql -u root -ppassword -e "SHOW DATABASES;"

# Backup database
docker exec shared-user-database mysqldump -u root -ppassword database_name > backup.sql

# Restore database
docker exec -i shared-user-database mysql -u root -ppassword database_name < backup.sql

# Generate migration
npm run typeorm:migration:generate -- -n MigrationName

# Run migrations
npm run typeorm:migration:run

# Revert migration
npm run typeorm:migration:revert
```

### Redis Management

```bash
# Connect to Redis CLI
docker exec -it shared-redis redis-cli

# View all keys
docker exec -it shared-redis redis-cli KEYS '*'

# Get key value
docker exec -it shared-redis redis-cli GET "customer:123"

# Delete key
docker exec -it shared-redis redis-cli DEL "customer:123"

# Flush all data (CAREFUL!)
docker exec -it shared-redis redis-cli FLUSHALL
```

### Health Checks

```bash
# Check all services
curl http://localhost:3001/api/v1/auth/health
curl http://localhost:3003/api/v1/health
curl http://localhost:3004/api/v1/health
curl http://localhost:3005/api/v1/health
curl http://localhost:3006/api/v1/health

# Check with jq for formatting
curl -s http://localhost:3004/api/v1/health | jq

# Check Swagger UI
curl -s http://localhost:3004/api/docs/ | grep "Swagger UI"
```

---

## 🛠️ Troubleshooting Patterns

### Issue: Dependency Injection Error

**Symptom**:
```
Nest can't resolve dependencies of the CustomerRepository (?, RedisCacheService)
```

**Solution**:
1. Add `@Global()` decorator to `AppModule`
2. Ensure `RedisCacheService` is in providers array
3. Ensure `RedisCacheService` is in exports array

```typescript
@Global()  // ← Add this
@Module({
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class AppModule {}
```

### Issue: Module Not Found

**Symptom**:
```
Error: Cannot find module '@shared/infrastructure'
```

**Solution**:
1. Check `tsconfig.json` has correct path mapping
2. Verify symlink exists in Docker container
3. Check `NODE_PATH` environment variable

```bash
# Verify symlink in container
docker exec service-name ls -la /app/shared/infrastructure/

# Check NODE_PATH
docker exec service-name printenv NODE_PATH
```

### Issue: Docker Build Fails

**Symptom**:
```
failed to copy files: no space left on device
```

**Solution**:
```bash
# Clean up Docker
docker system prune -af --volumes

# Check disk space
df -h

# Remove unused images
docker image prune -af
```

### Issue: TypeORM Entity Not Found

**Symptom**:
```
EntityMetadataNotFound: No metadata for "CustomerTypeOrmEntity" was found
```

**Solution**:
1. Ensure entity is registered in `TypeOrmModule.forRoot`
2. Check entity file naming (must end with `.typeorm.entity.ts`)
3. Verify entity is exported

```typescript
TypeOrmModule.forRoot({
  entities: [CustomerTypeOrmEntity],  // ← Explicit registration
  // OR
  entities: [__dirname + '/**/*.typeorm.entity{.ts,.js}'],  // Pattern
})
```

### Issue: Port Already in Use

**Symptom**:
```
Error: listen EADDRINUSE: address already in use :::3004
```

**Solution**:
```bash
# Find process using port
lsof -i :3004

# Kill process
kill -9 <PID>

# Or stop Docker container
docker stop customer-service
```

### Issue: Database Connection Failed

**Symptom**:
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution**:
```bash
# Check database is running
docker ps | grep mysql

# Check database logs
docker logs shared-user-database

# Wait for database to be ready
docker-compose -f docker-compose.hybrid.yml up -d shared-user-database
sleep 30  # Wait for initialization

# Test connection
docker exec -it shared-user-database mysql -u root -ppassword -e "SELECT 1;"
```

---

## 🤖 AI Agent Prompts

### Creating a New Service

```
Create a new microservice called 'order-service' following the project's Clean Architecture pattern:

1. Port: 3008
2. Database: Separate MySQL instance (port 3313)
3. Redis prefix: "order:"
4. Features:
   - Create order
   - Get order by ID
   - List orders
   - Update order status
   - Cancel order

Requirements:
- Follow Clean Architecture (domain, application, infrastructure, interfaces)
- Extend BaseTypeOrmRepository for caching
- Use @Global() decorator in AppModule for RedisCacheService
- Add Swagger documentation
- Include health check endpoint
- Create Dockerfile with multi-stage build
- Add to docker-compose.hybrid.yml
- Use Winston structured logging

Reference these files for patterns:
- customer-service/src/app.module.ts (for @Global pattern)
- customer-service/src/infrastructure/database/typeorm/repositories/ (for BaseTypeOrmRepository)
- customer-service/Dockerfile (for Docker build)
```

### Adding Swagger to Existing Service

```
Add Swagger/OpenAPI documentation to the 'translation-service':

1. Install dependencies:
   - @nestjs/swagger
   - swagger-ui-express

2. Configure in main.ts:
   - Title: "Translation Service API"
   - Version: "1.0"
   - Tag: "translations"
   - Mount at: /api/docs

3. Add decorators to all DTOs:
   - @ApiProperty() for all fields
   - Include description, example, required

4. Add decorators to all controllers:
   - @ApiTags()
   - @ApiOperation()
   - @ApiResponse() for all status codes
   - @ApiBearerAuth() for protected routes

5. Verify:
   - Build: npm run build
   - Start: npm run start:dev
   - Access: http://localhost:3007/api/docs

Reference: customer-service/src/interfaces/http/ for examples
```

### Debugging Dependency Injection

```
The 'pricing-service' is failing with this error:
"Nest can't resolve dependencies of the PricingRepository (?, RedisCacheService)"

Steps to fix:
1. Check if RedisCacheService has @Global() decorator in app.module.ts
2. Verify RedisCacheService is in providers array with factory
3. Verify RedisCacheService is in exports array
4. Remove RedisCacheService from application.module.ts providers
5. Test locally: cd pricing-service && npm run build
6. If successful, rebuild Docker: docker-compose -f docker-compose.hybrid.yml build pricing-service
7. Deploy: docker-compose -f docker-compose.hybrid.yml up -d pricing-service
8. Verify: docker logs pricing-service --tail 50

Reference: customer-service/src/app.module.ts for working example
```

### Adding Unit Tests

```
Add comprehensive unit tests for 'CustomerDomainService':

File: customer-service/src/domain/services/customer.domain.service.spec.ts

Test cases:
1. validateCustomerData()
   - Valid data passes
   - Invalid email throws error
   - Invalid phone throws error
   - Empty name throws error

2. validateUniqueEmail()
   - Unique email passes
   - Duplicate email throws CustomerAlreadyExistsException

3. businessRuleValidation()
   - Test all business rules
   - Edge cases

Mocking:
- Mock CustomerRepositoryInterface
- Mock dependencies
- Use Jest spies for verification

Coverage goal: >80%

Run with: npm run test -- customer.domain.service.spec.ts
```

### Docker Build Optimization

```
The Docker build for 'customer-service' is taking too long (>5 minutes). Optimize it:

1. Check layer caching:
   - COPY package*.json before COPY . to cache dependencies
   - Use .dockerignore to exclude node_modules, dist, .git

2. Check build output:
   - Add --progress=plain flag to see where time is spent
   - docker-compose -f docker-compose.hybrid.yml build --progress=plain customer-service

3. Multi-stage build:
   - Ensure shared infrastructure is cached in builder stage
   - Copy only necessary files to production stage

4. Clean up:
   - Run docker system prune -af to free space
   - Remove unused layers

5. Measure improvement:
   - Time the build: time docker-compose build customer-service

Expected result: <2 minutes per service
```

---

## 📚 Additional Resources

### Key Documentation Files

- **[README.md](README.md)** - Project overview and quick start
- **[DOCUMENTATION-INDEX.md](DOCUMENTATION-INDEX.md)** - Complete documentation index
- **[QUICK-START.md](QUICK-START.md)** - 5-minute setup guide
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - AI assistant guidelines
- **[docker-compose.hybrid.yml](docker-compose.hybrid.yml)** - Service orchestration

### Service-Specific READMEs

- `auth-service/README.md` - Authentication service documentation
- `user-service/README.md` - User management documentation
- `customer-service/README.md` - Customer service documentation
- `carrier-service/README.md` - Carrier service documentation
- `pricing-service/README.md` - Pricing service documentation

### External References

- **NestJS Documentation**: https://docs.nestjs.com/
- **TypeORM Documentation**: https://typeorm.io/
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/
- **Redis Documentation**: https://redis.io/documentation

---

## 🎯 Quick Reference Card

### Service Status
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Service URLs
- Auth Service: http://localhost:3001/api/docs
- User Service: http://localhost:3003/api/docs
- Carrier Service: http://localhost:3005/api/docs
- Customer Service: http://localhost:3004/api/docs
- Pricing Service: http://localhost:3006/api/docs
- Translation Service: http://localhost:3007/api/docs
- React Admin: http://localhost:3000

### Critical Patterns
1. **Always use @Global() for infrastructure services**
2. **Extend BaseTypeOrmRepository for caching**
3. **Follow Clean Architecture layer separation**
4. **Use factory providers for configured services**
5. **Symlink shared infrastructure, set NODE_PATH**

### Build & Deploy
```bash
# Local: Test first
cd service-name && npm run build

# Docker: Build image
docker-compose -f docker-compose.hybrid.yml build service-name

# Docker: Deploy
docker-compose -f docker-compose.hybrid.yml up -d service-name

# Verify
docker logs service-name --tail 50
curl http://localhost:PORT/api/docs/
```

---

**Last Updated**: October 26, 2025  
**Maintainer**: Development Team  
**License**: Proprietary

For questions or issues, please refer to the troubleshooting section or consult the service-specific README files.
