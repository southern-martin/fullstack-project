# 🤖 AI Agent Prompt Library

> Pre-written prompts for common development tasks in the fullstack microservices project

**Purpose**: Copy-paste these prompts to AI assistants (ChatGPT, Claude, Copilot) for consistent, high-quality code generation following project patterns.

**Last Updated**: October 26, 2025

---

## 📋 Table of Contents

1. [Service Development](#service-development)
2. [Feature Addition](#feature-addition)
3. [Bug Fixes](#bug-fixes)
4. [Testing](#testing)
5. [Documentation](#documentation)
6. [Deployment](#deployment)
7. [Refactoring](#refactoring)
8. [Database](#database)

---

## 🚀 Service Development

### Create a New Microservice

```
Create a new NestJS microservice called '{service-name}' for the fullstack-project following these exact specifications:

SERVICE CONFIGURATION:
- Port: {PORT}
- Database: Separate MySQL instance (port {DB_PORT})
- Redis prefix: "{service}:"
- Tech stack: NestJS + TypeScript + TypeORM + MySQL

ARCHITECTURE:
Follow Clean Architecture with these layers:
1. Domain Layer (src/domain/)
   - entities/ - Pure TypeScript domain entities
   - repositories/ - Repository interfaces (NO implementation)
   - services/ - Domain services with business rules

2. Application Layer (src/application/)
   - use-cases/ - Application use cases
   - application.module.ts

3. Infrastructure Layer (src/infrastructure/)
   - database/typeorm/
     - entities/ - TypeORM entities (*.typeorm.entity.ts)
     - repositories/ - TypeORM repository implementations
   - database.module.ts

4. Interface Layer (src/interfaces/)
   - http/controllers/ - REST controllers
   - http/dtos/ - Request/Response DTOs
   - interfaces.module.ts

CRITICAL PATTERNS TO FOLLOW:

1. AppModule with @Global() decorator:
```typescript
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '@shared/infrastructure';

@Global()  // ← REQUIRED for infrastructure services
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonLoggerModule,
    TypeOrmModule.forRoot({ /* MySQL config */ }),
    DatabaseModule,
    ApplicationModule,
    InterfacesModule,
  ],
  providers: [
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
          prefix: configService.get('REDIS_KEY_PREFIX', '{service}:'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisCacheService],
})
export class AppModule {}
```

2. Extend BaseTypeOrmRepository:
```typescript
import { BaseTypeOrmRepository } from '@shared/infrastructure';

export class EntityTypeOrmRepository 
  extends BaseTypeOrmRepository<EntityTypeOrmEntity>
  implements EntityRepositoryInterface 
{
  constructor(
    @InjectRepository(EntityTypeOrmEntity)
    repository: Repository<EntityTypeOrmEntity>,
    redisCache: RedisCacheService,  // ← Injected from @Global AppModule
  ) {
    super(repository, redisCache, 'entity-name');
  }
}
```

3. Swagger Configuration in main.ts:
```typescript
const config = new DocumentBuilder()
  .setTitle('{Service Name} API')
  .setDescription('API documentation for {Service Name}')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('{service-name}')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

DOCKERFILE:
Create multi-stage Dockerfile with:
- Shared infrastructure symlink
- NODE_PATH environment variable
- Non-root user (nestjs)
- Health check endpoint
- Optimized layer caching

DOCKER-COMPOSE:
Add service to docker-compose.hybrid.yml with:
- Health checks
- Database dependency
- Redis dependency
- Network configuration

FEATURES TO IMPLEMENT:
{List specific features here}

FILES TO GENERATE:
1. Complete directory structure
2. All module files
3. Dockerfile
4. package.json
5. tsconfig.json with path mapping
6. .env.example
7. README.md

Reference these existing services for patterns:
- customer-service/ (for @Global pattern)
- pricing-service/ (for Clean Architecture)
- carrier-service/ (for Swagger setup)
```

**Variables to Replace**:
- `{service-name}`: e.g., "order-service"
- `{PORT}`: e.g., "3008"
- `{DB_PORT}`: e.g., "3313"
- `{service}`: e.g., "order"

---

### Add Swagger to Existing Service

```
Add comprehensive Swagger/OpenAPI documentation to the '{service-name}' service:

REQUIREMENTS:

1. Install Dependencies:
npm install @nestjs/swagger swagger-ui-express

2. Configure in main.ts:
- Title: "{Service Name} API"
- Description: "API documentation for {Service Name}"
- Version: "1.0"
- Bearer authentication
- Tag: "{service-name}"
- Mount path: /api/docs

3. DTO Decorators (ALL DTOs):
Add @ApiProperty() to every field:
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEntityDto {
  @ApiProperty({
    description: 'Entity name',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
```

4. Controller Decorators (ALL Controllers):
```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('{service-name}')
@Controller('api/v1/{entities}')
export class EntityController {
  @Post()
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({ 
    status: 201, 
    description: 'Entity created successfully',
    type: EntityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Entity already exists' })
  async create(@Body() dto: CreateEntityDto): Promise<EntityResponseDto> {
    // Implementation
  }

  @Get(':id')
  @ApiBearerAuth()  // ← For protected routes
  @ApiOperation({ summary: 'Get entity by ID' })
  @ApiResponse({ status: 200, type: EntityResponseDto })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  async findOne(@Param('id') id: string): Promise<EntityResponseDto> {
    // Implementation
  }
}
```

5. Response DTOs:
Create response DTOs with @ApiProperty:
```typescript
export class EntityResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  static fromDomain(entity: Entity): EntityResponseDto {
    const dto = new EntityResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
```

VERIFICATION STEPS:
1. Build: cd {service-name} && npm run build
2. Start: npm run start:dev
3. Access: http://localhost:{PORT}/api/docs
4. Test all endpoints in Swagger UI
5. Verify request/response schemas
6. Test authentication flows

DELIVERABLES:
- main.ts with Swagger configuration
- All DTOs with @ApiProperty decorators
- All controllers with API decorators
- Response DTOs with examples
- README updated with Swagger URL

Reference: customer-service/src/interfaces/http/ for complete examples
```

**Variables**:
- `{service-name}`: e.g., "translation-service"
- `{Service Name}`: e.g., "Translation Service"
- `{PORT}`: e.g., "3007"
- `{entities}`: e.g., "translations"

---

## 🔧 Feature Addition

### Add New Endpoint to Existing Service

```
Add a new endpoint to {service-name} for {feature description}:

ENDPOINT SPECIFICATION:
- Method: {GET/POST/PUT/DELETE}
- Path: /api/v1/{path}
- Request: {Request DTO structure}
- Response: {Response DTO structure}
- Authorization: {Required/Optional}

IMPLEMENTATION STEPS:

1. CREATE DOMAIN ENTITY (if new):
File: src/domain/entities/{entity}.ts
- Pure TypeScript class
- No external dependencies
- Business validation logic
- Immutable design

2. CREATE REPOSITORY INTERFACE:
File: src/domain/repositories/{entity}.repository.interface.ts
```typescript
export interface {Entity}RepositoryInterface {
  findById(id: string): Promise<{Entity} | null>;
  save(entity: {Entity}): Promise<{Entity}>;
  // Other methods
}
```

3. CREATE USE CASE:
File: src/application/use-cases/{action}-{entity}.use-case.ts
```typescript
@Injectable()
export class {Action}{Entity}UseCase {
  constructor(
    private readonly repository: {Entity}RepositoryInterface,
    private readonly domainService: {Entity}DomainService,
  ) {}

  async execute(data: {Action}{Entity}Dto): Promise<{Entity}> {
    // 1. Validation
    await this.domainService.validate(data);
    
    // 2. Business logic
    const entity = new {Entity}(...);
    
    // 3. Persistence
    return this.repository.save(entity);
  }
}
```

4. CREATE TYPEORM ENTITY:
File: src/infrastructure/database/typeorm/entities/{entity}.typeorm.entity.ts
```typescript
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('{table_name}')
export class {Entity}TypeOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

5. CREATE REPOSITORY IMPLEMENTATION:
File: src/infrastructure/database/typeorm/repositories/{entity}.typeorm.repository.ts
```typescript
export class {Entity}TypeOrmRepository 
  extends BaseTypeOrmRepository<{Entity}TypeOrmEntity>
  implements {Entity}RepositoryInterface 
{
  constructor(
    @InjectRepository({Entity}TypeOrmEntity)
    repository: Repository<{Entity}TypeOrmEntity>,
    redisCache: RedisCacheService,
  ) {
    super(repository, redisCache, '{entity}');
  }

  async findBySpecificField(value: string): Promise<{Entity}TypeOrmEntity | null> {
    const cacheKey = `{entity}:field:${value}`;
    return this.findOneWithCache({ where: { field: value } }, cacheKey);
  }
}
```

6. CREATE REQUEST DTO:
File: src/interfaces/http/dtos/{action}-{entity}.dto.ts
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class {Action}{Entity}Dto {
  @ApiProperty({ 
    description: 'Field description',
    example: 'Example value',
  })
  @IsString()
  @IsNotEmpty()
  field: string;
}
```

7. CREATE RESPONSE DTO:
File: src/interfaces/http/dtos/{entity}-response.dto.ts
```typescript
export class {Entity}ResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Value' })
  field: string;

  static fromDomain(entity: {Entity}): {Entity}ResponseDto {
    // Mapping logic
  }
}
```

8. ADD CONTROLLER METHOD:
File: src/interfaces/http/controllers/{entity}.controller.ts
```typescript
@{Method}('{path}')
@ApiOperation({ summary: '{Description}' })
@ApiResponse({ status: {status}, type: {Response}Dto })
async {methodName}(@Body() dto: {Request}Dto): Promise<{Response}Dto> {
  const result = await this.useCase.execute(dto);
  return {Response}Dto.fromDomain(result);
}
```

9. REGISTER IN MODULES:
- DatabaseModule: Register TypeORM entity and repository
- ApplicationModule: Register use case
- InterfacesModule: Already includes controller

10. ADD UNIT TESTS:
File: src/application/use-cases/{action}-{entity}.use-case.spec.ts

VERIFICATION:
1. Local build: npm run build
2. Local run: npm run start:dev
3. Test endpoint: curl -X {METHOD} http://localhost:{PORT}/api/v1/{path}
4. Check Swagger: http://localhost:{PORT}/api/docs
5. Run tests: npm run test

DELIVERABLES:
- All files listed above
- Unit tests with >80% coverage
- Swagger documentation
- Updated README
```

**Variables**:
- `{service-name}`: e.g., "customer-service"
- `{feature description}`: e.g., "adding customer addresses"
- `{Entity}`: e.g., "CustomerAddress"
- `{Action}`: e.g., "Create", "Update", "Delete"
- `{Method}`: e.g., "Post", "Get", "Put", "Delete"

---

## 🐛 Bug Fixes

### Fix Dependency Injection Issue

```
Fix the dependency injection error in {service-name}:

ERROR MESSAGE:
"Nest can't resolve dependencies of the {Repository} (?, {Service})"

ROOT CAUSE:
NestJS modules have local scope by default. Even if a service is exported from a module,
child modules cannot inject it unless the parent module is marked as @Global().

SOLUTION:

1. VERIFY THE ISSUE:
```bash
cd {service-name}
npm run build
# Check for dependency errors
```

2. FIX APP.MODULE.TS:
```typescript
// BEFORE (Wrong):
import { Module } from '@nestjs/common';

@Module({
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class AppModule {}

// AFTER (Correct):
import { Global, Module } from '@nestjs/common';  // ← Add Global

@Global()  // ← Add this decorator
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ... other imports
  ],
  providers: [
    // ← Add factory provider for RedisCacheService
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
          prefix: configService.get('REDIS_KEY_PREFIX', '{service}:'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisCacheService],  // ← Keep export
})
export class AppModule {}
```

3. REMOVE FROM CHILD MODULES:
If RedisCacheService was in application.module.ts or database.module.ts, remove it:
```typescript
// application.module.ts - REMOVE RedisCacheService
@Module({
  providers: [
    // Remove RedisCacheService factory from here
    // It's now available globally from AppModule
  ],
})
export class ApplicationModule {}
```

4. VERIFY REPOSITORY CAN INJECT:
```typescript
// Repository should now work:
export class EntityRepository extends BaseTypeOrmRepository {
  constructor(
    @InjectRepository(EntityTypeOrmEntity)
    repository: Repository<EntityTypeOrmEntity>,
    redisCache: RedisCacheService,  // ← Now injectable from @Global AppModule
  ) {
    super(repository, redisCache, 'entity');
  }
}
```

5. TEST LOCALLY:
```bash
cd {service-name}
npm run build
npm run start:dev
# Should start without errors
```

6. REBUILD DOCKER:
```bash
cd ..
docker-compose -f docker-compose.hybrid.yml build {service-name}
docker-compose -f docker-compose.hybrid.yml up -d {service-name}
```

7. VERIFY DEPLOYMENT:
```bash
docker logs {service-name} --tail 50
# Should see: "Nest application successfully started"

curl http://localhost:{PORT}/api/v1/health
# Should return: {"status":"ok"}
```

WHY THIS WORKS:
- @Global() registers the module in NestJS's global provider registry
- All child modules automatically have access to exported providers
- No need to import AppModule in every module
- Prevents circular dependency issues
- Follows NestJS best practices for infrastructure services

REFERENCE:
See customer-service/src/app.module.ts and pricing-service/src/app.module.ts for working examples.
```

**Variables**:
- `{service-name}`: e.g., "pricing-service"
- `{Repository}`: e.g., "PricingRepository"
- `{Service}`: e.g., "RedisCacheService"
- `{PORT}`: Service port

---

### Fix Docker Build Issues

```
Fix Docker build failure for {service-name}:

ERROR: {error message}

TROUBLESHOOTING STEPS:

1. CHECK DISK SPACE:
```bash
df -h
docker system df
```

If low disk space:
```bash
# Clean up Docker (frees 10-20GB typically)
docker system prune -af --volumes

# Verify space freed
docker system df
```

2. CHECK BUILD LOGS:
```bash
docker-compose -f docker-compose.hybrid.yml build --progress=plain {service-name} 2>&1 | tee build.log
```

3. VERIFY LOCAL BUILD WORKS:
```bash
cd {service-name}
rm -rf node_modules dist
npm install
npm run build
```

4. CHECK DOCKERFILE:
Common issues:
- Missing COPY commands
- Incorrect paths
- Missing dependencies
- Symlink issues

Verify symlink creation:
```dockerfile
# Should have these lines:
COPY --from=builder /app/shared/infrastructure /app/shared/infrastructure
RUN rm -rf /app/shared/infrastructure/src && \
    ln -s /app/shared/infrastructure/dist /app/shared/infrastructure/src
```

5. CHECK TSCONFIG PATH MAPPING:
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/infrastructure": ["../shared/infrastructure/src"],
      "@shared/infrastructure/*": ["../shared/infrastructure/src/*"]
    }
  }
}
```

6. CHECK PACKAGE.JSON:
Ensure npm ci uses --legacy-peer-deps if there are peer dependency conflicts:
```dockerfile
RUN npm ci --legacy-peer-deps && npm cache clean --force
```

7. REBUILD WITH NO CACHE:
```bash
docker-compose -f docker-compose.hybrid.yml build --no-cache {service-name}
```

8. CHECK SHARED INFRASTRUCTURE:
```bash
cd shared/infrastructure
npm install
npm run build
ls -la dist/  # Should see compiled files
```

9. REBUILD AND DEPLOY:
```bash
cd ..
docker-compose -f docker-compose.hybrid.yml build {service-name}
docker-compose -f docker-compose.hybrid.yml up -d {service-name}
```

10. VERIFY:
```bash
docker logs {service-name} --tail 50
curl http://localhost:{PORT}/api/v1/health
```

COMMON FIXES:

Issue: "Cannot find module '@shared/infrastructure'"
Fix: Check NODE_PATH in Dockerfile:
```dockerfile
ENV NODE_PATH=/app/shared/infrastructure/node_modules:/app/{service-name}/node_modules
```

Issue: "ENOSPC: no space left on device"
Fix: docker system prune -af --volumes

Issue: "npm ERR! peer dependency"
Fix: Use npm ci --legacy-peer-deps

Issue: Build hangs at specific step
Fix: Check that step isn't downloading large files; use build cache
```

---

## 🧪 Testing

### Add Unit Tests for Use Case

```
Create comprehensive unit tests for {UseCase} in {service-name}:

FILE: src/application/use-cases/{use-case}.spec.ts

TEST STRUCTURE:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { {UseCase} } from './{use-case}';
import { {Repository}Interface } from '../../domain/repositories/{repository}.interface';
import { {DomainService} } from '../../domain/services/{domain-service}';
import { {Exception} } from '../../domain/exceptions/{exception}';

describe('{UseCase}', () => {
  let useCase: {UseCase};
  let repository: jest.Mocked<{Repository}Interface>;
  let domainService: jest.Mocked<{DomainService}>;

  beforeEach(async () => {
    // Create mocks
    const mockRepository: jest.Mocked<{Repository}Interface> = {
      findById: jest.fn(),
      save: jest.fn(),
      findByField: jest.fn(),
    };

    const mockDomainService: jest.Mocked<{DomainService}> = {
      validate: jest.fn(),
      validateUnique: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {UseCase},
        {
          provide: '{Repository}Interface',
          useValue: mockRepository,
        },
        {
          provide: {DomainService},
          useValue: mockDomainService,
        },
      ],
    }).compile();

    useCase = module.get<{UseCase}>({UseCase});
    repository = module.get('{Repository}Interface');
    domainService = module.get({DomainService});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should successfully create entity with valid data', async () => {
      // Arrange
      const dto = {
        field1: 'value1',
        field2: 'value2',
      };
      const expectedEntity = { id: 'uuid', ...dto };

      domainService.validateUnique.mockResolvedValue(undefined);
      repository.save.mockResolvedValue(expectedEntity);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(domainService.validateUnique).toHaveBeenCalledWith(dto.field1);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedEntity);
    });

    it('should throw error when validation fails', async () => {
      // Arrange
      const dto = { field1: 'invalid' };
      domainService.validateUnique.mockRejectedValue(
        new {Exception}('Validation failed')
      );

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow({Exception});
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw error when entity already exists', async () => {
      // Arrange
      const dto = { field1: 'existing' };
      repository.findByField.mockResolvedValue({ id: 'existing-id' });

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow('Already exists');
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const dto = { field1: 'value' };
      repository.save.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow('Database error');
    });

    // Edge cases
    it('should handle empty string values', async () => { /* ... */ });
    it('should handle null values', async () => { /* ... */ });
    it('should handle undefined values', async () => { /* ... */ });
  });
});
```

TEST REQUIREMENTS:

1. **Happy Path**: Test successful execution with valid data
2. **Validation Errors**: Test all validation failures
3. **Domain Exceptions**: Test business rule violations
4. **Repository Errors**: Test database error handling
5. **Edge Cases**: Test boundary conditions
6. **Mocking**: Mock all dependencies
7. **Coverage**: Achieve >80% code coverage

RUNNING TESTS:

```bash
# Run this specific test file
npm run test -- {use-case}.spec.ts

# Run with coverage
npm run test:cov

# Run in watch mode
npm run test:watch -- {use-case}.spec.ts
```

VERIFICATION:
- All tests pass
- Coverage >80%
- No console warnings
- Meaningful test descriptions
- Proper assertions

Reference: Look for existing .spec.ts files in the codebase for patterns.
```

**Variables**:
- `{UseCase}`: e.g., "CreateCustomerUseCase"
- `{service-name}`: e.g., "customer-service"
- `{Repository}`: e.g., "CustomerRepository"
- `{DomainService}`: e.g., "CustomerDomainService"

---

## 📚 Documentation

### Document a New Feature

```
Create comprehensive documentation for the new {feature-name} feature:

DOCUMENTATION STRUCTURE:

1. UPDATE SERVICE README:
File: {service-name}/README.md

Add section:
```markdown
## {Feature Name}

### Overview
{Brief description of what the feature does}

### Endpoints

#### Create {Entity}
- **Method**: POST
- **Path**: `/api/v1/{path}`
- **Authorization**: Bearer token required
- **Request Body**:
```json
{
  "field1": "value1",
  "field2": "value2"
}
```
- **Response** (201 Created):
```json
{
  "id": "uuid",
  "field1": "value1",
  "field2": "value2",
  "createdAt": "2024-01-01T00:00:00Z"
}
```
- **Errors**:
  - 400: Invalid input
  - 409: Entity already exists
  - 500: Internal server error

#### Get {Entity} by ID
- **Method**: GET
- **Path**: `/api/v1/{path}/:id`
- **Response** (200 OK): Same as create response

### Business Rules
1. {Rule 1}
2. {Rule 2}
3. {Rule 3}

### Examples

#### Using cURL:
```bash
# Create entity
curl -X POST http://localhost:{PORT}/api/v1/{path} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"field1":"value1"}'

# Get entity
curl -X GET http://localhost:{PORT}/api/v1/{path}/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Using Swagger UI:
Visit http://localhost:{PORT}/api/docs and test directly in the browser.

### Database Schema

```sql
CREATE TABLE {table_name} (
  id VARCHAR(36) PRIMARY KEY,
  field1 VARCHAR(255) NOT NULL,
  field2 VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Testing
```bash
# Unit tests
npm run test -- {entity}.spec.ts

# E2E tests
npm run test:e2e
```
```

2. UPDATE ARCHITECTURE DIAGRAM:
Update docs/architecture/README.md with new endpoints

3. UPDATE API DOCUMENTATION:
Update Swagger decorators with comprehensive examples

4. ADD TO POSTMAN COLLECTION:
File: Fullstack-Project-API.postman_collection.json
Add request examples for all new endpoints

5. UPDATE CHANGELOG:
File: CHANGELOG.md
```markdown
## [Version] - YYYY-MM-DD

### Added
- {Feature name}: {Brief description}
  - Endpoint: POST /api/v1/{path}
  - Endpoint: GET /api/v1/{path}/:id
  - Database table: {table_name}
  - Business rules: {summary}
```

DELIVERABLES:
- Updated service README
- Swagger documentation
- Postman collection examples
- Changelog entry
- Architecture diagram update (if needed)
```

---

## 🚀 Deployment

### Deploy Service Update

```
Deploy updated {service-name} to production:

PRE-DEPLOYMENT CHECKLIST:

1. CODE QUALITY:
- [ ] All tests passing (npm run test)
- [ ] Linting passed (npm run lint)
- [ ] Build successful (npm run build)
- [ ] No console.log statements
- [ ] Environment variables documented

2. DOCUMENTATION:
- [ ] README updated
- [ ] Swagger documentation complete
- [ ] Changelog updated
- [ ] API changes documented

3. DATABASE:
- [ ] Migrations created (if schema changed)
- [ ] Migration tested locally
- [ ] Rollback plan prepared

DEPLOYMENT STEPS:

1. LOCAL VERIFICATION:
```bash
cd {service-name}
npm run build
npm run test
npm run test:e2e
```

2. BUILD DOCKER IMAGE:
```bash
cd ..
docker-compose -f docker-compose.hybrid.yml build {service-name}
```

3. TEST IN DOCKER:
```bash
docker-compose -f docker-compose.hybrid.yml up -d {service-name}
docker logs {service-name} --tail 50
curl http://localhost:{PORT}/api/v1/health
```

4. RUN MIGRATIONS (if needed):
```bash
docker exec {service-name} npm run typeorm:migration:run
```

5. VERIFY FUNCTIONALITY:
```bash
# Test critical endpoints
curl -X POST http://localhost:{PORT}/api/v1/{path} \
  -H "Content-Type: application/json" \
  -d '{test-data}'

# Check Swagger
open http://localhost:{PORT}/api/docs
```

6. MONITOR LOGS:
```bash
docker logs {service-name} -f
# Watch for errors for 5-10 minutes
```

7. SMOKE TESTS:
- [ ] Health check responding
- [ ] Database connectivity
- [ ] Redis connectivity
- [ ] Critical endpoints working
- [ ] No errors in logs

ROLLBACK PLAN:
If issues occur:
```bash
# Stop new version
docker-compose -f docker-compose.hybrid.yml stop {service-name}

# Restore previous image
docker tag {service-name}:previous {service-name}:latest

# Start previous version
docker-compose -f docker-compose.hybrid.yml up -d {service-name}

# Revert database migrations (if ran)
docker exec {service-name} npm run typeorm:migration:revert
```

POST-DEPLOYMENT:
- [ ] Monitor error logs for 24 hours
- [ ] Check performance metrics
- [ ] Update deployment documentation
- [ ] Notify team of deployment
```

---

## 🔄 Refactoring

### Refactor to Clean Architecture

```
Refactor {service-name} to follow Clean Architecture pattern:

CURRENT STATE ANALYSIS:
1. Identify current structure
2. List coupling issues
3. Identify business logic in controllers
4. Identify database logic in use cases

TARGET STRUCTURE:

```
src/
├── domain/              # Business logic (no framework dependencies)
│   ├── entities/       # Pure TypeScript domain models
│   ├── repositories/   # Repository interfaces
│   ├── services/       # Domain services
│   └── exceptions/     # Domain exceptions
├── application/         # Use cases (orchestration)
│   ├── use-cases/      # Application use cases
│   └── application.module.ts
├── infrastructure/      # Technical implementations
│   ├── database/
│   │   └── typeorm/
│   │       ├── entities/      # TypeORM entities
│   │       └── repositories/  # Repository implementations
│   └── messaging/
└── interfaces/          # External interfaces
    └── http/
        ├── controllers/
        └── dtos/
```

REFACTORING STEPS:

1. CREATE DOMAIN LAYER:
```bash
mkdir -p src/domain/{entities,repositories,services,exceptions}
```

Extract domain entities (pure TypeScript):
```typescript
// domain/entities/customer.ts
export class Customer {
  constructor(
    private readonly id: string,
    private name: string,
    private email: string,
  ) {
    this.validateEmail(email);
  }

  private validateEmail(email: string): void {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new InvalidEmailException(email);
    }
  }

  // Business methods only
  updateEmail(newEmail: string): void {
    this.validateEmail(newEmail);
    this.email = newEmail;
  }

  // Getters
  getId(): string { return this.id; }
  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
}
```

2. CREATE REPOSITORY INTERFACES:
```typescript
// domain/repositories/customer.repository.interface.ts
import { Customer } from '../entities/customer';

export interface CustomerRepositoryInterface {
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
  delete(id: string): Promise<void>;
}
```

3. CREATE DOMAIN SERVICES:
```typescript
// domain/services/customer.domain.service.ts
export class CustomerDomainService {
  async validateUniqueEmail(
    email: string,
    repository: CustomerRepositoryInterface,
  ): Promise<void> {
    const existing = await repository.findByEmail(email);
    if (existing) {
      throw new CustomerAlreadyExistsException(email);
    }
  }
}
```

4. CREATE APPLICATION LAYER:
```typescript
// application/use-cases/create-customer.use-case.ts
@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject('CustomerRepositoryInterface')
    private readonly repository: CustomerRepositoryInterface,
    private readonly domainService: CustomerDomainService,
  ) {}

  async execute(dto: CreateCustomerDto): Promise<Customer> {
    // Validation
    await this.domainService.validateUniqueEmail(dto.email, this.repository);
    
    // Create domain entity
    const customer = new Customer(
      generateUuid(),
      dto.name,
      dto.email,
    );
    
    // Persist
    return this.repository.save(customer);
  }
}
```

5. CREATE INFRASTRUCTURE LAYER:
```typescript
// infrastructure/database/typeorm/entities/customer.typeorm.entity.ts
@Entity('customers')
export class CustomerTypeOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  // Map from domain
  static fromDomain(customer: Customer): CustomerTypeOrmEntity {
    const entity = new CustomerTypeOrmEntity();
    entity.id = customer.getId();
    entity.name = customer.getName();
    entity.email = customer.getEmail();
    return entity;
  }

  // Map to domain
  toDomain(): Customer {
    return new Customer(this.id, this.name, this.email);
  }
}
```

```typescript
// infrastructure/database/typeorm/repositories/customer.typeorm.repository.ts
@Injectable()
export class CustomerTypeOrmRepository implements CustomerRepositoryInterface {
  constructor(
    @InjectRepository(CustomerTypeOrmEntity)
    private readonly repository: Repository<CustomerTypeOrmEntity>,
  ) {}

  async findById(id: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? entity.toDomain() : null;
  }

  async save(customer: Customer): Promise<Customer> {
    const entity = CustomerTypeOrmEntity.fromDomain(customer);
    const saved = await this.repository.save(entity);
    return saved.toDomain();
  }
}
```

6. UPDATE CONTROLLERS:
```typescript
// interfaces/http/controllers/customer.controller.ts
@Controller('api/v1/customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.createCustomerUseCase.execute(dto);
    return CustomerResponseDto.fromDomain(customer);
  }
}
```

7. WIRE UP MODULES:
```typescript
// database.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([CustomerTypeOrmEntity])],
  providers: [
    {
      provide: 'CustomerRepositoryInterface',
      useClass: CustomerTypeOrmRepository,
    },
  ],
  exports: ['CustomerRepositoryInterface'],
})
export class DatabaseModule {}

// application.module.ts
@Module({
  imports: [DatabaseModule],
  providers: [
    CustomerDomainService,
    CreateCustomerUseCase,
    GetCustomerUseCase,
  ],
  exports: [CreateCustomerUseCase, GetCustomerUseCase],
})
export class ApplicationModule {}
```

8. TESTING STRATEGY:
- Domain layer: Pure unit tests (no mocks needed)
- Application layer: Unit tests with mocked repositories
- Infrastructure layer: Integration tests with real database
- Controllers: E2E tests

9. MIGRATION STEPS:
- Create new structure alongside old code
- Write tests for new implementation
- Migrate one feature at a time
- Ensure tests pass at each step
- Remove old code once feature is migrated
- Update documentation

VERIFICATION:
- [ ] All tests passing
- [ ] No circular dependencies
- [ ] Domain layer has no framework imports
- [ ] Business logic in domain services
- [ ] Technical details in infrastructure
- [ ] Controllers thin (just delegation)
```

---

## 🗄️ Database

### Create TypeORM Migration

```
Create a TypeORM migration for {change description} in {service-name}:

SCENARIO: {Describe the database change needed}

STEPS:

1. MAKE ENTITY CHANGES FIRST:
Edit: src/infrastructure/database/typeorm/entities/{entity}.typeorm.entity.ts
```typescript
@Entity('table_name')
export class EntityTypeOrmEntity {
  // Add new columns
  @Column({ nullable: true })
  newField: string;

  // Modify existing columns
  @Column({ length: 500 })  // was 255
  existingField: string;

  // Add indexes
  @Index()
  @Column()
  searchableField: string;

  // Add relations
  @ManyToOne(() => RelatedEntity)
  @JoinColumn({ name: 'related_id' })
  related: RelatedEntity;
}
```

2. GENERATE MIGRATION:
```bash
cd {service-name}
npm run typeorm:migration:generate -- -n {MigrationName}
# Example: npm run typeorm:migration:generate -- -n AddCustomerAddress
```

3. REVIEW GENERATED MIGRATION:
File: src/infrastructure/database/migrations/{timestamp}-{MigrationName}.ts

```typescript
import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex } from 'typeorm';

export class {MigrationName}{Timestamp} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Review auto-generated SQL
    // Add manual changes if needed
    
    // Example: Add column
    await queryRunner.addColumn('table_name', new TableColumn({
      name: 'new_field',
      type: 'varchar',
      length: '255',
      isNullable: true,
    }));

    // Example: Create index
    await queryRunner.createIndex('table_name', new TableIndex({
      name: 'IDX_TABLE_FIELD',
      columnNames: ['field'],
    }));

    // Example: Create new table
    await queryRunner.createTable(new Table({
      name: 'new_table',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          length: '36',
          isPrimary: true,
        },
        // ... more columns
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Implement rollback
    await queryRunner.dropColumn('table_name', 'new_field');
    await queryRunner.dropIndex('table_name', 'IDX_TABLE_FIELD');
  }
}
```

4. TEST MIGRATION LOCALLY:
```bash
# Run migration
npm run typeorm:migration:run

# Verify database
docker exec -it {service-name}-db mysql -u root -ppassword {db_name} \
  -e "DESCRIBE table_name;"

# Test application
npm run start:dev
# Test affected endpoints

# If issues, rollback
npm run typeorm:migration:revert
```

5. ADD DATA MIGRATION (if needed):
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  // Schema change
  await queryRunner.addColumn(...);

  // Data migration
  await queryRunner.query(`
    UPDATE table_name 
    SET new_field = old_field 
    WHERE condition
  `);
}
```

6. TEST IN DOCKER:
```bash
cd ..
docker-compose -f docker-compose.hybrid.yml build {service-name}
docker-compose -f docker-compose.hybrid.yml up -d {service-name}
docker logs {service-name}
# Should see migration ran successfully

# Verify in database
docker exec -it {service-name}-db mysql -u root -ppassword {db_name} \
  -e "SELECT * FROM migrations;"
```

7. DOCUMENT MIGRATION:
Add to service README:
```markdown
## Database Migrations

### {MigrationName}
- **Date**: YYYY-MM-DD
- **Description**: {What changed}
- **Breaking Changes**: {Yes/No and details}
- **Rollback**: `npm run typeorm:migration:revert`
```

IMPORTANT CONSIDERATIONS:
- [ ] Migration is reversible (down method works)
- [ ] Breaking changes documented
- [ ] Data migration preserves existing data
- [ ] Indexes added for query performance
- [ ] Foreign keys properly constrained
- [ ] Column types appropriate
- [ ] Nullable fields have defaults

TESTING CHECKLIST:
- [ ] Fresh database (migration from scratch)
- [ ] Existing database (migration from previous state)
- [ ] Rollback (down migration)
- [ ] Application works after migration
- [ ] Data integrity maintained

DEPLOYMENT:
Migration will run automatically when service starts in Docker.
Monitor logs for migration success:
```bash
docker logs {service-name} | grep -i migration
```
```

---

## 📌 Quick Reference

### Most Used Prompts

1. **"Create new microservice"** → Service Development section
2. **"Add Swagger documentation"** → Service Development section
3. **"Fix dependency injection"** → Bug Fixes section
4. **"Add new endpoint"** → Feature Addition section
5. **"Create unit tests"** → Testing section
6. **"Deploy service"** → Deployment section

### Template Variables

Always replace these in prompts:
- `{service-name}`: e.g., "customer-service"
- `{Service Name}`: e.g., "Customer Service"
- `{PORT}`: e.g., "3004"
- `{DB_PORT}`: e.g., "3309"
- `{Entity}`: e.g., "Customer", "Order"
- `{UseCase}`: e.g., "CreateCustomerUseCase"
- `{Repository}`: e.g., "CustomerRepository"

### Key Architecture Reminders

1. **Always use @Global() decorator** for infrastructure services in AppModule
2. **Extend BaseTypeOrmRepository** for caching support
3. **Follow Clean Architecture** - domain, application, infrastructure, interfaces
4. **Add Swagger decorators** to all DTOs and controllers
5. **Use factory providers** for services needing configuration

---

**Last Updated**: October 26, 2025  
**For More Details**: See [ARCHITECTURE-GUIDE.md](ARCHITECTURE-GUIDE.md)
