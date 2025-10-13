# 🏗️ Shared Infrastructure Package

A comprehensive shared infrastructure package for the fullstack microservices project, providing common components that can be used across all services.

## 📦 **Package Overview**

This package provides standardized infrastructure components following Clean Architecture principles, ensuring consistency and maintainability across all microservices.

## 🚀 **Installation**

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## 📁 **Package Structure**

```
src/
├── core/                    # Core domain components
│   ├── result.ts           # Result pattern implementation
│   ├── base-entity.ts      # Base entity class
│   └── domain-event.ts     # Domain event base class
├── exceptions/              # Custom exceptions
│   ├── validation.exception.ts
│   ├── business.exception.ts
│   └── not-found.exception.ts
├── dto/                     # Data Transfer Objects
│   ├── pagination.dto.ts
│   ├── api-response.dto.ts
│   └── error-response.dto.ts
├── communication/           # Inter-service communication
│   ├── service-communicator.ts
│   └── http-client.ts
├── validation/              # Validation utilities
│   ├── validation-utils.ts
│   └── custom-validators.ts
├── logging/                 # Logging utilities
│   ├── logger.ts
│   └── log-level.ts
├── database/                # Database utilities
│   ├── base-repository.ts
│   └── connection-manager.ts
├── config/                  # Configuration management
│   ├── service-config.ts
│   └── database-config.ts
├── health/                  # Health check utilities
│   ├── health-check.ts
│   └── health-indicator.ts
└── index.ts                 # Main export file
```

## 🎯 **Key Features**

### ✅ **Core Components**
- **Result Pattern**: Functional error handling
- **Base Entity**: Common entity fields and methods
- **Domain Events**: Event-driven architecture support

### ✅ **Exception Handling**
- **ValidationException**: Field-specific validation errors
- **BusinessException**: Business rule violations
- **NotFoundException**: Resource not found errors

### ✅ **Data Transfer Objects**
- **PaginationDto**: Standardized pagination
- **ApiResponseDto**: Consistent API responses
- **ErrorResponseDto**: Standardized error responses

### ✅ **Communication**
- **ServiceCommunicator**: Inter-service communication with retry logic
- **HttpClient**: Robust HTTP client with interceptors

### ✅ **Validation**
- **ValidationUtils**: Common validation functions
- **Custom Validators**: Reusable validation decorators

### ✅ **Logging**
- **Logger**: Structured logging with multiple levels
- **Log Levels**: Standardized log levels

### ✅ **Database**
- **BaseRepository**: Common repository operations
- **ConnectionManager**: Database connection management

### ✅ **Configuration**
- **ServiceConfig**: Standardized service configuration
- **DatabaseConfig**: Database configuration builder

### ✅ **Health Checks**
- **HealthCheck**: Base health check class
- **Health Indicators**: Specific health check implementations

## 📖 **Usage Examples**

### **Result Pattern**
```typescript
import { Result } from '@shared/infrastructure';

// Success result
const success = Result.ok({ id: 1, name: 'John' });

// Error result
const error = Result.fail('User not found');

// Chain operations
const result = Result.ok(5)
  .map(x => x * 2)
  .flatMap(x => x > 10 ? Result.ok(x) : Result.fail('Too small'));
```

### **Validation Exception**
```typescript
import { ValidationException } from '@shared/infrastructure';

// Field-specific errors
const fieldErrors = {
  email: ['Email is required', 'Email format is invalid'],
  password: ['Password must be at least 8 characters']
};

throw new ValidationException(fieldErrors);
```

### **Service Communication**
```typescript
import { ServiceCommunicator } from '@shared/infrastructure';

const communicator = new ServiceCommunicator();

// Get user from user service
const userResponse = await communicator.getUser(123);

// Make custom request
const response = await communicator.get('customer', '/api/v1/customers');
```

### **Logger**
```typescript
import { createLogger, LogLevel } from '@shared/infrastructure';

const logger = createLogger({
  level: LogLevel.INFO,
  service: 'user-service',
  enableConsole: true,
});

logger.info('User created', { userId: 123, email: 'user@example.com' });
logger.error('Database error', error, { query: 'SELECT * FROM users' });
```

### **Base Repository**
```typescript
import { BaseRepository } from '@shared/infrastructure';

class UserRepository extends BaseRepository<User> {
  protected buildSearchConditions(search: string): FindOptionsWhere<User> {
    return {
      firstName: Like(`%${search}%`),
      lastName: Like(`%${search}%`),
      email: Like(`%${search}%`),
    };
  }
}
```

### **Health Checks**
```typescript
import { DatabaseHealthIndicator, MemoryHealthIndicator } from '@shared/infrastructure';

const dbHealth = new DatabaseHealthIndicator(connectionManager, logger);
const memoryHealth = new MemoryHealthIndicator(logger);

const dbResult = await dbHealth.check();
const memoryResult = await memoryHealth.check();
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Service configuration
SERVICE_NAME=user-service
SERVICE_VERSION=1.0.0
PORT=3003

# Database configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=user_db

# Redis configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

# Logging configuration
LOG_LEVEL=info
LOG_FORMAT=text
```

## 🧪 **Testing**

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- validation-utils.test.ts
```

## 📚 **API Documentation**

### **Core Components**
- [Result Pattern](./docs/core/result.md)
- [Base Entity](./docs/core/base-entity.md)
- [Domain Events](./docs/core/domain-events.md)

### **Exceptions**
- [Validation Exception](./docs/exceptions/validation.md)
- [Business Exception](./docs/exceptions/business.md)
- [Not Found Exception](./docs/exceptions/not-found.md)

### **Communication**
- [Service Communicator](./docs/communication/service-communicator.md)
- [HTTP Client](./docs/communication/http-client.md)

### **Validation**
- [Validation Utils](./docs/validation/validation-utils.md)
- [Custom Validators](./docs/validation/custom-validators.md)

### **Logging**
- [Logger](./docs/logging/logger.md)
- [Log Levels](./docs/logging/log-levels.md)

### **Database**
- [Base Repository](./docs/database/base-repository.md)
- [Connection Manager](./docs/database/connection-manager.md)

### **Health Checks**
- [Health Check](./docs/health/health-check.md)
- [Health Indicators](./docs/health/health-indicators.md)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

---

**This shared infrastructure package provides the foundation for building robust, maintainable microservices with consistent patterns and utilities.**
