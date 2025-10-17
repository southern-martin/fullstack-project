# Microservices Architecture Guidelines

**Project:** Fullstack Microservices Project  
**Date:** October 17, 2025  
**Version:** 1.0  
**Status:** Active

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design Principles](#design-principles)
3. [Service Structure Guidelines](#service-structure-guidelines)
4. [Clean Architecture Implementation](#clean-architecture-implementation)
5. [Database Strategies](#database-strategies)
6. [Event-Driven Architecture](#event-driven-architecture)
7. [API Design Standards](#api-design-standards)
8. [Service Communication](#service-communication)
9. [Security Guidelines](#security-guidelines)
10. [Docker & Deployment](#docker--deployment)
11. [Testing Strategy](#testing-strategy)
12. [Monitoring & Observability](#monitoring--observability)
13. [Best Practices](#best-practices)

---

## Architecture Overview

### System Architecture

Our microservices architecture follows a **hybrid approach** combining shared and separated database patterns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway (Future)                      │
│                     Load Balancer & Routing                      │
└─────────────────┬───────────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┬──────────────┬──────────────┐
    │             │             │              │              │
┌───▼────┐   ┌───▼────┐   ┌───▼─────┐   ┌───▼─────┐   ┌───▼─────┐
│  Auth  │   │  User  │   │Customer │   │ Carrier │   │ Pricing │
│Service │   │Service │   │Service  │   │ Service │   │ Service │
│ :3001  │   │ :3003  │   │  :3004  │   │  :3005  │   │  :3006  │
└───┬────┘   └───┬────┘   └───┬─────┘   └───┬─────┘   └───┬─────┘
    │            │            │             │             │
    └────────┬───┴────────────┴─────────────┴─────────────┘
             │
    ┌────────▼────────────────────────────────────────────┐
    │         Shared Infrastructure Layer                  │
    ├──────────────────────────────────────────────────────┤
    │  Shared Database (Auth + User) :3306                 │
    │  Business Databases (Customer, Carrier, Pricing)     │
    │  Shared Redis Cache :6379                            │
    │  Event Bus (InMemory → RabbitMQ/Kafka in prod)      │
    └──────────────────────────────────────────────────────┘
```

### Service Inventory

| Service | Port | Purpose | Database Strategy | Status |
|---------|------|---------|-------------------|--------|
| **Auth Service** | 3001 | Authentication, JWT tokens | Shared (`shared_user_db`) | ✅ Production |
| **User Service** | 3003 | User management, CRUD | Shared (`shared_user_db`) | ✅ Production |
| **Customer Service** | 3004 | Customer business logic | Separate DB | ✅ Production |
| **Carrier Service** | 3005 | Carrier management | Separate DB | ✅ Production |
| **Pricing Service** | 3006 | Pricing calculations | Separate DB | ✅ Production |
| **Translation Service** | 3007 | i18n translations | Separate DB | 🔄 Development |

---

## Design Principles

### 1. Single Responsibility Principle (SRP)

**Rule:** Each service should have ONE clearly defined business capability.

✅ **Good Example:**
```
Auth Service → Authentication & Authorization ONLY
User Service → User data management ONLY
```

❌ **Bad Example:**
```
User Service → User management + Authentication + Billing
(Too many responsibilities)
```

### 2. Domain-Driven Design (DDD)

**Rule:** Organize services around business domains, not technical layers.

**Bounded Contexts:**
- **Identity & Access Context** → Auth Service, User Service
- **Business Operations Context** → Customer Service, Carrier Service
- **Pricing Context** → Pricing Service
- **Localization Context** → Translation Service

### 3. Loose Coupling, High Cohesion

**Rule:** Services should be independent but work together seamlessly.

✅ **Loose Coupling:**
```typescript
// Customer Service calls User Service via HTTP API (not direct DB access)
const user = await this.userService.getUserById(customerId);
```

❌ **Tight Coupling:**
```typescript
// Customer Service accessing User Service database directly
const user = await this.userRepository.findOne({ id: customerId });
```

### 4. Autonomy & Independence

**Rule:** Each service should be deployable, scalable, and testable independently.

**Requirements:**
- ✅ Own codebase
- ✅ Own database (or clearly shared with documented reason)
- ✅ Own Docker container
- ✅ Own CI/CD pipeline
- ✅ Independent versioning

### 5. API-First Design

**Rule:** Design APIs before implementation.

**Workflow:**
1. Define OpenAPI/Swagger specification
2. Review with team
3. Mock API endpoints
4. Implement service
5. Generate API documentation

### 6. Failure Isolation

**Rule:** One service failure should not cascade to others.

**Strategies:**
- Circuit breakers
- Timeout configurations
- Retry policies with exponential backoff
- Graceful degradation

---

## Service Structure Guidelines

### Clean Architecture (4-Layer Pattern)

**MANDATORY** for all services. Follow this structure:

```
src/
├── domain/                    # Layer 1: Business Logic (Pure TypeScript)
│   ├── entities/             # Domain entities (business objects)
│   ├── value-objects/        # Immutable value objects (Email, Money, etc.)
│   ├── repositories/         # Repository interfaces (contracts)
│   ├── services/             # Domain services (business rules)
│   ├── events/               # Domain events
│   └── exceptions/           # Domain-specific exceptions
│
├── application/               # Layer 2: Use Cases (Orchestration)
│   ├── use-cases/            # Business use cases
│   │   ├── create-user/
│   │   ├── update-user/
│   │   └── delete-user/
│   ├── dto/                  # Data Transfer Objects
│   ├── services/             # Application services (password, email, etc.)
│   └── ports/                # Port interfaces (for infrastructure)
│
├── infrastructure/           # Layer 3: Technical Details
│   ├── database/             # TypeORM entities, migrations
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── migrations/
│   ├── events/               # Event bus implementation
│   ├── external/             # Third-party integrations
│   ├── cache/                # Redis implementation
│   └── config/               # Configuration files
│
└── interfaces/               # Layer 4: Controllers & Adapters
    ├── http/                 # REST controllers
    │   ├── controllers/
    │   ├── middlewares/
    │   └── guards/
    ├── graphql/              # GraphQL resolvers (if needed)
    └── cli/                  # CLI commands (if needed)
```

### Dependency Flow (CRITICAL)

```
Interfaces → Application → Domain ← Infrastructure
     ↓           ↓           ↑           ↑
  (HTTP)     (Use Cases)  (Pure TS)  (TypeORM)
```

**Rules:**
1. **Domain layer** has ZERO dependencies (pure TypeScript)
2. **Application layer** depends ONLY on domain
3. **Infrastructure layer** implements domain interfaces
4. **Interfaces layer** depends on application and infrastructure

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| **Entity** | `{name}.entity.ts` | `user.entity.ts` |
| **Value Object** | `{name}.value-object.ts` | `email.value-object.ts` |
| **Repository Interface** | `{name}-repository.interface.ts` | `user-repository.interface.ts` |
| **Repository Implementation** | `{name}.repository.ts` | `user.repository.ts` |
| **Use Case** | `{action}.use-case.ts` | `create-user.use-case.ts` |
| **DTO** | `{action}-{entity}.dto.ts` | `create-user.dto.ts` |
| **Controller** | `{name}.controller.ts` | `user.controller.ts` |
| **Service** | `{name}.service.ts` | `password.service.ts` |
| **Event** | `{name}.event.ts` | `user-created.event.ts` |

---

## Clean Architecture Implementation

### Domain Layer (Layer 1) - Pure TypeScript

**Purpose:** Business logic and rules, framework-independent.

**Domain Entity Example:**
```typescript
// src/domain/entities/user.entity.ts
export class User {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public firstName: string,
    public lastName: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  // Business logic methods
  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public isActive(): boolean {
    return this.status === 'active';
  }

  // Validation
  public validate(): void {
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Invalid email');
    }
  }
}
```

**Value Object Example:**
```typescript
// src/domain/value-objects/email.value-object.ts
export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error(`Invalid email: ${email}`);
    }
    this.value = email.toLowerCase().trim();
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public getValue(): string {
    return this.value;
  }

  public getDomain(): string {
    return this.value.split('@')[1];
  }
}
```

**Repository Interface Example:**
```typescript
// src/domain/repositories/user-repository.interface.ts
export interface UserRepositoryInterface {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(filters?: UserFilters): Promise<User[]>;
  create(user: User): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}
```

### Application Layer (Layer 2) - Use Cases

**Purpose:** Orchestrate domain logic, coordinate workflows.

**Use Case Example:**
```typescript
// src/application/use-cases/create-user/create-user.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { UserRepositoryInterface } from '../../../domain/repositories/user-repository.interface';
import { EventBusInterface } from '../../../domain/events/event-bus.interface';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.value-object';
import { UserCreatedEvent } from '../../../domain/events/user-created.event';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('EventBusInterface')
    private readonly eventBus: EventBusInterface
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // 1. Validate input (using value objects)
    const email = new Email(dto.email);

    // 2. Check business rules
    const existingUser = await this.userRepository.findByEmail(email.getValue());
    if (existingUser) {
      throw new Error('User already exists');
    }

    // 3. Create domain entity
    const user = new User(
      null, // ID assigned by database
      email.getValue(),
      dto.firstName,
      dto.lastName,
      new Date(),
      new Date()
    );

    // 4. Validate entity
    user.validate();

    // 5. Persist
    const createdUser = await this.userRepository.create(user);

    // 6. Dispatch domain event
    await this.eventBus.publish(
      new UserCreatedEvent(
        createdUser.id,
        createdUser.email,
        createdUser.firstName,
        createdUser.lastName
      )
    );

    // 7. Return result
    return createdUser;
  }
}
```

**DTO Example:**
```typescript
// src/application/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;
}
```

### Infrastructure Layer (Layer 3) - Implementation

**Purpose:** Implement technical details (database, cache, external APIs).

**TypeORM Entity Example:**
```typescript
// src/infrastructure/database/entities/user.typeorm-entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Repository Implementation Example:**
```typescript
// src/infrastructure/database/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryInterface } from '../../../domain/repositories/user-repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserTypeOrmEntity } from '../entities/user.typeorm-entity';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>
  ) {}

  async findById(id: number): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(user: User): Promise<User> {
    const entity = this.repository.create(this.toTypeORM(user));
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  // Mapper: TypeORM → Domain
  private toDomain(entity: UserTypeOrmEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.firstName,
      entity.lastName,
      entity.createdAt,
      entity.updatedAt
    );
  }

  // Mapper: Domain → TypeORM
  private toTypeORM(user: User): Partial<UserTypeOrmEntity> {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
```

**Infrastructure Module Example:**
```typescript
// src/infrastructure/infrastructure.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './database/entities/user.typeorm-entity';
import { UserRepository } from './database/repositories/user.repository';
import { InMemoryEventBus } from './events/in-memory-event-bus';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeOrmEntity]),
  ],
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'EventBusInterface',
      useClass: InMemoryEventBus,
    },
  ],
  exports: [
    'UserRepositoryInterface',
    'EventBusInterface',
  ],
})
export class InfrastructureModule {}
```

### Interfaces Layer (Layer 4) - Controllers

**Purpose:** Handle HTTP requests, call use cases, return responses.

**Controller Example:**
```typescript
// src/interfaces/http/controllers/user.controller.ts
import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../../application/use-cases/create-user/create-user.use-case';
import { CreateUserDto } from '../../../application/dto/create-user.dto';

@ApiTags('users')
@Controller('api/v1/users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(dto);
    return {
      success: true,
      data: user,
      message: 'User created successfully',
    };
  }
}
```

---

## Database Strategies

### Strategy 1: Shared Database Pattern

**When to Use:**
- Tightly coupled services (Auth + User)
- Strong consistency requirements
- Shared domain entities
- Low latency requirements

**Example:** Auth Service + User Service share `shared_user_db`

**Pros:**
- ✅ Strong consistency (ACID transactions)
- ✅ No data duplication
- ✅ Simple queries across entities
- ✅ Lower infrastructure cost

**Cons:**
- ❌ Tight coupling between services
- ❌ Schema changes affect multiple services
- ❌ Scaling complexity
- ❌ Single point of failure

**Configuration:**
```yaml
# docker-compose.yml
services:
  shared-database:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: shared_user_db
      MYSQL_ROOT_PASSWORD: secret
    ports:
      - "3306:3306"
    volumes:
      - shared-db-data:/var/lib/mysql

  auth-service:
    depends_on:
      - shared-database
    environment:
      DB_HOST: shared-database
      DB_NAME: shared_user_db

  user-service:
    depends_on:
      - shared-database
    environment:
      DB_HOST: shared-database
      DB_NAME: shared_user_db
```

### Strategy 2: Database per Service Pattern

**When to Use:**
- Loosely coupled services
- Independent scalability needs
- Different database technology requirements
- Service autonomy priority

**Example:** Customer, Carrier, Pricing services each have separate databases

**Pros:**
- ✅ Service independence
- ✅ Technology flexibility (MySQL, PostgreSQL, MongoDB)
- ✅ Easier scaling
- ✅ Fault isolation

**Cons:**
- ❌ Eventual consistency challenges
- ❌ Complex cross-service queries
- ❌ Data duplication
- ❌ Higher infrastructure cost

**Configuration:**
```yaml
# docker-compose.yml
services:
  customer-db:
    image: postgres:15
    environment:
      POSTGRES_DB: customer_db
      POSTGRES_PASSWORD: secret

  carrier-db:
    image: postgres:15
    environment:
      POSTGRES_DB: carrier_db
      POSTGRES_PASSWORD: secret

  pricing-db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: pricing_db
      MYSQL_ROOT_PASSWORD: secret
```

### Data Consistency Patterns

#### Pattern 1: Event-Driven Data Sync
```typescript
// User Service publishes event
await this.eventBus.publish(new UserCreatedEvent(user.id, user.email));

// Customer Service subscribes and syncs data
eventBus.subscribe('UserCreatedEvent', async (event) => {
  await customerService.syncUserData({
    userId: event.userId,
    email: event.email,
  });
});
```

#### Pattern 2: Saga Pattern (Future)
```typescript
// Distributed transaction across multiple services
const saga = new CreateOrderSaga();
saga.addStep(inventoryService.reserveItems, inventoryService.releaseItems);
saga.addStep(paymentService.charge, paymentService.refund);
saga.addStep(shippingService.createShipment, shippingService.cancelShipment);
await saga.execute(orderData);
```

---

## Event-Driven Architecture

### Domain Events

**Purpose:** Enable loose coupling, asynchronous communication, and reactive systems.

**Event Structure:**
```typescript
// src/domain/events/domain-event.ts (shared)
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;
  public readonly eventName: string;

  constructor() {
    this.occurredOn = new Date();
    this.eventId = uuidv4();
    this.eventName = this.constructor.name;
  }
}
```

**Event Example:**
```typescript
// src/domain/events/user-created.event.ts
export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string
  ) {
    super();
  }
}
```

### Event Bus Interface

**Domain Contract:**
```typescript
// src/domain/events/event-bus.interface.ts
export interface EventBusInterface {
  publish(event: any): Promise<void>;
  publishAll(events: any[]): Promise<void>;
  subscribe(eventName: string, handler: (event: any) => Promise<void>): void;
}
```

### Event Bus Implementations

#### Development: InMemoryEventBus
```typescript
// src/infrastructure/events/in-memory-event-bus.ts
@Injectable()
export class InMemoryEventBus implements EventBusInterface {
  private handlers: Map<string, Function[]> = new Map();

  async publish(event: any): Promise<void> {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) || [];
    
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error handling ${eventName}:`, error);
      }
    }
  }

  subscribe(eventName: string, handler: Function): void {
    const handlers = this.handlers.get(eventName) || [];
    handlers.push(handler);
    this.handlers.set(eventName, handlers);
  }
}
```

#### Production: RabbitMQ EventBus (Recommended)
```typescript
// src/infrastructure/events/rabbitmq-event-bus.ts
@Injectable()
export class RabbitMQEventBus implements EventBusInterface {
  constructor(
    @Inject('RABBITMQ_CLIENT')
    private readonly client: ClientProxy
  ) {}

  async publish(event: any): Promise<void> {
    const eventName = event.constructor.name;
    await this.client.emit(eventName, event).toPromise();
  }

  subscribe(eventName: string, handler: Function): void {
    this.client.subscribe(eventName, async (data) => {
      await handler(data);
    });
  }
}
```

### Event Handlers

**Handler Example:**
```typescript
// src/application/event-handlers/send-welcome-email.handler.ts
@Injectable()
export class SendWelcomeEmailHandler {
  constructor(
    private readonly emailService: EmailService,
    @Inject('EventBusInterface')
    private readonly eventBus: EventBusInterface
  ) {
    // Subscribe to event
    this.eventBus.subscribe('UserCreatedEvent', this.handle.bind(this));
  }

  async handle(event: UserCreatedEvent): Promise<void> {
    try {
      await this.emailService.sendWelcomeEmail({
        to: event.email,
        firstName: event.firstName,
        userId: event.userId,
      });
      console.log(`Welcome email sent to ${event.email}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Consider dead letter queue or retry mechanism
    }
  }
}
```

### Event Catalog

**Maintain a centralized event catalog:**

| Service | Event | Purpose | Subscribers |
|---------|-------|---------|-------------|
| **User Service** | UserCreatedEvent | User registration | Email Service, Analytics, Customer Service |
| **User Service** | UserUpdatedEvent | User data change | Customer Service, Cache Invalidator |
| **User Service** | UserDeletedEvent | User deletion | Cleanup Services, Analytics |
| **Auth Service** | UserRegisteredEvent | New registration | Welcome Email, Analytics |
| **Auth Service** | UserLoggedInEvent | Login success | Activity Tracker, Analytics |
| **Auth Service** | LoginFailedEvent | Login failure | Security Monitor, Alert Service |
| **Customer Service** | CustomerCreatedEvent | Customer created | Invoice Service, CRM Integration |
| **Pricing Service** | PriceUpdatedEvent | Price change | Notification Service, Cache |

---

## API Design Standards

### RESTful API Principles

**Resource Naming:**
- Use **plural nouns** for collections: `/api/v1/users`, `/api/v1/customers`
- Use **specific IDs** for single resources: `/api/v1/users/123`
- Use **nested resources** for relationships: `/api/v1/users/123/orders`

**HTTP Methods:**
| Method | Purpose | Example | Success Code |
|--------|---------|---------|--------------|
| GET | Retrieve resource(s) | `GET /api/v1/users` | 200 OK |
| POST | Create resource | `POST /api/v1/users` | 201 Created |
| PUT | Replace resource | `PUT /api/v1/users/123` | 200 OK |
| PATCH | Update resource | `PATCH /api/v1/users/123` | 200 OK |
| DELETE | Delete resource | `DELETE /api/v1/users/123` | 204 No Content |

### API Versioning

**Always version your APIs:**
```
/api/v1/users
/api/v2/users
```

### Request/Response Format

**Standard Response Structure:**
```typescript
// Success Response
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "message": "User retrieved successfully",
  "meta": {
    "timestamp": "2025-10-17T10:30:00Z",
    "version": "1.0"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 123 not found",
    "details": {
      "userId": 123
    }
  },
  "meta": {
    "timestamp": "2025-10-17T10:30:00Z",
    "version": "1.0"
  }
}

// Paginated Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### API Documentation

**Use Swagger/OpenAPI:**
```typescript
// src/main.ts
const config = new DocumentBuilder()
  .setTitle('User Service API')
  .setDescription('User management microservice')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### Error Handling

**Standard Error Codes:**
```typescript
// src/domain/exceptions/app-error.ts
export enum ErrorCode {
  // Client Errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly statusCode: number,
    public readonly details?: any
  ) {
    super(message);
  }
}
```

---

## Service Communication

### Synchronous Communication (HTTP/REST)

**When to Use:**
- Request-response pattern needed
- Immediate result required
- Low latency requirement

**Example:**
```typescript
// Customer Service calling User Service
@Injectable()
export class UserServiceClient {
  constructor(private readonly httpService: HttpService) {}

  async getUser(userId: number): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://user-service:3003/api/v1/users/${userId}`)
      );
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`User ${userId} not found`);
      }
      throw new Error('User service unavailable');
    }
  }
}
```

**Best Practices:**
- ✅ Use circuit breakers (e.g., `@nestjs/circuit-breaker`)
- ✅ Implement timeouts (default: 5 seconds)
- ✅ Add retry logic with exponential backoff
- ✅ Cache responses when appropriate
- ✅ Handle partial failures gracefully

### Asynchronous Communication (Events)

**When to Use:**
- Fire-and-forget operations
- Multiple subscribers needed
- Loose coupling priority
- High availability requirement

**Example:**
```typescript
// User Service publishes event
await this.eventBus.publish(
  new UserCreatedEvent(user.id, user.email)
);

// Multiple services subscribe
// Email Service
eventBus.subscribe('UserCreatedEvent', async (event) => {
  await emailService.sendWelcomeEmail(event.email);
});

// Analytics Service
eventBus.subscribe('UserCreatedEvent', async (event) => {
  await analyticsService.trackSignup(event.userId);
});

// Customer Service
eventBus.subscribe('UserCreatedEvent', async (event) => {
  await customerService.syncUserData(event);
});
```

### Service Discovery

**Development:** Hard-coded service URLs
```typescript
const USER_SERVICE_URL = 'http://user-service:3003';
```

**Production:** Use service mesh or discovery (Consul, Kubernetes DNS)
```typescript
const USER_SERVICE_URL = await serviceDiscovery.getUrl('user-service');
```

---

## Security Guidelines

### Authentication & Authorization

**JWT Token Strategy:**
```typescript
// Auth Service generates JWT
const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    roles: user.roles.map(r => r.name),
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Other services validate JWT
@UseGuards(JwtAuthGuard)
@Controller('api/v1/users')
export class UserController { ... }
```

### API Gateway (Future)

**Centralized authentication:**
```
Client → API Gateway (JWT validation) → Services
```

### Secrets Management

**Never commit secrets!**

```bash
# .env (gitignored)
DB_PASSWORD=secret_password
JWT_SECRET=super_secret_key
REDIS_PASSWORD=redis_password
```

**Production:** Use secret managers (AWS Secrets Manager, Vault)

### Data Encryption

- ✅ **In Transit:** TLS/SSL for all HTTP communication
- ✅ **At Rest:** Encrypt sensitive data (passwords, tokens, PII)
- ✅ **Password Hashing:** bcrypt with salt rounds ≥ 10

### Rate Limiting

```typescript
// Apply rate limiting to prevent abuse
@Throttle(100, 60) // 100 requests per 60 seconds
@Controller('api/v1/users')
export class UserController { ... }
```

---

## Docker & Deployment

### Dockerfile Best Practices

**Multi-stage build:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

### Docker Compose

**Hybrid setup:**
```yaml
# docker-compose.hybrid.yml
version: '3.8'

services:
  shared-database:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: shared_user_db
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
    volumes:
      - shared-db-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  shared-redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - shared-redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s

  auth-service:
    build: ./auth-service
    ports:
      - "3001:3001"
    depends_on:
      shared-database:
        condition: service_healthy
      shared-redis:
        condition: service_healthy
    environment:
      - DB_HOST=shared-database
      - REDIS_HOST=shared-redis

  user-service:
    build: ./user-service
    ports:
      - "3003:3003"
    depends_on:
      - shared-database
      - shared-redis
```

### Health Checks

**Implement health endpoints:**
```typescript
@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private connection: Connection,
    @Inject('REDIS_CLIENT') private redis: Redis,
  ) {}

  @Get()
  async check() {
    const dbHealthy = this.connection.isConnected;
    const redisHealthy = await this.redis.ping() === 'PONG';

    return {
      status: dbHealthy && redisHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'user-service',
      version: '1.0.0',
      dependencies: {
        database: dbHealthy ? 'up' : 'down',
        redis: redisHealthy ? 'up' : 'down',
      },
    };
  }
}
```

---

## Testing Strategy

### Test Pyramid

```
           /\
          /  \  E2E Tests (10%)
         /    \
        /──────\
       /   Integration Tests (30%)
      /        \
     /──────────\
    /   Unit Tests (60%)
   /______________\
```

### Unit Tests

**Test domain logic and use cases:**
```typescript
// src/application/use-cases/create-user/__tests__/create-user.use-case.spec.ts
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let eventBus: jest.Mocked<EventBusInterface>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as any;

    eventBus = {
      publish: jest.fn(),
    } as any;

    useCase = new CreateUserUseCase(userRepository, eventBus);
  });

  it('should create a user and publish event', async () => {
    // Arrange
    const dto = { email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue({ id: 1, ...dto } as any);

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(result).toBeDefined();
    expect(userRepository.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 1, email: dto.email })
    );
  });

  it('should throw error if user already exists', async () => {
    // Arrange
    userRepository.findByEmail.mockResolvedValue({ id: 1 } as any);

    // Act & Assert
    await expect(useCase.execute({ email: 'existing@example.com' }))
      .rejects.toThrow('User already exists');
  });
});
```

### Integration Tests

**Test with real database:**
```typescript
describe('UserRepository Integration', () => {
  let repository: UserRepository;
  let connection: Connection;

  beforeAll(async () => {
    // Setup test database
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [UserTypeOrmEntity],
          synchronize: true,
        }),
      ],
      providers: [UserRepository],
    }).compile();

    repository = module.get(UserRepository);
    connection = module.get(Connection);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create and retrieve user', async () => {
    // Create user
    const user = new User(null, 'test@example.com', 'John', 'Doe', new Date(), new Date());
    const created = await repository.create(user);

    // Retrieve user
    const found = await repository.findById(created.id);

    expect(found).toBeDefined();
    expect(found.email).toBe('test@example.com');
  });
});
```

### E2E Tests

**Test full API flow:**
```typescript
describe('User API E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/users - should create user', async () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe('test@example.com');
      });
  });
});
```

---

## Monitoring & Observability

### Logging

**Structured logging:**
```typescript
import { Logger } from '@nestjs/common';

export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  async execute(dto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user with email: ${dto.email}`);
    
    try {
      const user = await this.userRepository.create(dto);
      this.logger.log(`User created successfully: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

### Metrics

**Track key metrics:**
- Request count
- Response time
- Error rate
- Active connections
- Database query time

**Example with Prometheus:**
```typescript
import { Counter, Histogram } from 'prom-client';

const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route'],
});
```

### Distributed Tracing

**Use correlation IDs:**
```typescript
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['correlationId'] = req.headers['x-correlation-id'] || uuidv4();
    res.setHeader('X-Correlation-ID', req['correlationId']);
    next();
  }
}
```

---

## Best Practices

### DO's ✅

1. **Follow Clean Architecture** - Always separate concerns into 4 layers
2. **Use Domain Events** - Enable loose coupling and reactive systems
3. **Implement Value Objects** - Enforce business rules at type level
4. **Version APIs** - Always use `/api/v1/` prefix
5. **Document APIs** - Use Swagger/OpenAPI for all endpoints
6. **Write Tests** - Aim for 60% unit, 30% integration, 10% E2E
7. **Use DTOs** - Validate inputs with class-validator
8. **Handle Errors Gracefully** - Never expose stack traces to clients
9. **Log Everything** - Use structured logging with correlation IDs
10. **Monitor Services** - Track metrics, health, and performance

### DON'Ts ❌

1. **Don't Mix Layers** - Never import infrastructure into domain
2. **Don't Share Databases Unnecessarily** - Only when tightly coupled
3. **Don't Hardcode Secrets** - Use environment variables
4. **Don't Skip Error Handling** - Always handle exceptions
5. **Don't Ignore Security** - Always validate JWT tokens
6. **Don't Create God Services** - Keep services small and focused
7. **Don't Forget Health Checks** - Essential for orchestration
8. **Don't Skip Documentation** - Code without docs is technical debt
9. **Don't Ignore Performance** - Profile database queries
10. **Don't Deploy Without Tests** - CI/CD must run tests

### Code Review Checklist

- [ ] Clean Architecture layers respected?
- [ ] Domain layer framework-independent?
- [ ] Use cases orchestrate correctly?
- [ ] DTOs validated with decorators?
- [ ] Domain events dispatched?
- [ ] Error handling implemented?
- [ ] Unit tests written?
- [ ] API documented in Swagger?
- [ ] Secrets in environment variables?
- [ ] Logging added for debugging?

---

## Migration Guide

### Adding a New Service

**Checklist:**

1. **Create service structure:**
```bash
mkdir new-service
cd new-service
nest new . --skip-git
```

2. **Implement Clean Architecture:**
```
src/
├── domain/
├── application/
├── infrastructure/
└── interfaces/
```

3. **Add database configuration**
4. **Implement event infrastructure**
5. **Create Dockerfile**
6. **Add to docker-compose.hybrid.yml**
7. **Update documentation**
8. **Write tests**
9. **Deploy**

### Refactoring Existing Service

**Steps:**

1. **Create feature branch:** `git checkout -b refactor/service-name-clean-architecture`
2. **Create domain layer** with entities, value objects, interfaces
3. **Extract use cases** to application layer
4. **Move TypeORM entities** to infrastructure
5. **Update controllers** to call use cases
6. **Add domain events**
7. **Write tests**
8. **Update documentation**
9. **Create PR and merge**

---

## Conclusion

This guideline document establishes the architectural standards for our microservices project. All developers must follow these principles to ensure:

- ✅ **Consistency** across services
- ✅ **Maintainability** of codebase
- ✅ **Scalability** of system
- ✅ **Quality** of code

**Remember:** Architecture is not about technology choices, it's about managing complexity and enabling change.

---

## References

- **Clean Architecture** by Robert C. Martin
- **Domain-Driven Design** by Eric Evans
- **Microservices Patterns** by Chris Richardson
- **NestJS Documentation:** https://docs.nestjs.com
- **TypeORM Documentation:** https://typeorm.io

---

**Document Version:** 1.0  
**Last Updated:** October 17, 2025  
**Maintained By:** Architecture Team  
**Review Schedule:** Quarterly
