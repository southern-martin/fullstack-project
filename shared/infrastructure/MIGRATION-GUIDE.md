# 🔄 Migration Guide: Shared Infrastructure

This guide helps you migrate existing services to use the new shared infrastructure package.

## 📋 **Migration Overview**

The shared infrastructure package provides standardized components that replace duplicated code across services. This migration ensures consistency and reduces maintenance overhead.

## 🎯 **Migration Steps**

### **Step 1: Install Shared Infrastructure Package**

```bash
# In each service directory
npm install @shared/infrastructure
```

### **Step 2: Update Imports**

#### **Before (Old Imports)**
```typescript
// Old imports in services
import { ValidationException } from '../shared/exceptions/validation.exception';
import { Result } from '../shared/kernel/result';
import { BaseEntity } from '../shared/kernel/base.entity';
import { PaginationDto } from '../shared/dto/pagination.dto';
```

#### **After (New Imports)**
```typescript
// New imports using shared infrastructure
import { 
  ValidationException, 
  Result, 
  BaseEntity, 
  PaginationDto 
} from '@shared/infrastructure';
```

### **Step 3: Update Exception Handling**

#### **Before (Service-specific exceptions)**
```typescript
// user-service/src/shared/exceptions/validation.exception.ts
export class ValidationException extends HttpException {
  // ... implementation
}
```

#### **After (Shared infrastructure)**
```typescript
// Remove local exception files and use shared ones
import { ValidationException } from '@shared/infrastructure';

// Usage remains the same
throw new ValidationException(fieldErrors);
```

### **Step 4: Update Repository Pattern**

#### **Before (Service-specific base repository)**
```typescript
// user-service/src/infrastructure/repositories/base.repository.ts
export abstract class BaseRepository<T> {
  // ... implementation
}
```

#### **After (Shared infrastructure)**
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

### **Step 5: Update Logging**

#### **Before (Service-specific logging)**
```typescript
// Custom logging implementation
console.log('User created', { userId: 123 });
```

#### **After (Shared infrastructure)**
```typescript
import { createLogger } from '@shared/infrastructure';

const logger = createLogger({
  level: LogLevel.INFO,
  service: 'user-service',
  enableConsole: true,
});

logger.info('User created', { userId: 123, email: 'user@example.com' });
```

### **Step 6: Update Health Checks**

#### **Before (Service-specific health checks)**
```typescript
// Custom health check implementation
@Get('/health')
async getHealth() {
  return { status: 'ok' };
}
```

#### **After (Shared infrastructure)**
```typescript
import { 
  DatabaseHealthIndicator, 
  MemoryHealthIndicator,
  HealthStatus 
} from '@shared/infrastructure';

@Get('/health')
async getHealth() {
  const dbHealth = await this.dbHealthIndicator.check();
  const memoryHealth = await this.memoryHealthIndicator.check();
  
  const overallStatus = dbHealth.status === HealthStatus.HEALTHY && 
                       memoryHealth.status === HealthStatus.HEALTHY 
                       ? HealthStatus.HEALTHY 
                       : HealthStatus.UNHEALTHY;
  
  return {
    status: overallStatus,
    checks: {
      database: dbHealth,
      memory: memoryHealth,
    },
  };
}
```

### **Step 7: Update Service Communication**

#### **Before (Custom HTTP clients)**
```typescript
// Custom service communication
const response = await axios.get('http://user-service:3003/api/v1/users/123');
```

#### **After (Shared infrastructure)**
```typescript
import { ServiceCommunicator } from '@shared/infrastructure';

const communicator = new ServiceCommunicator();
const userResponse = await communicator.getUser(123);
```

### **Step 8: Update Configuration**

#### **Before (Service-specific configuration)**
```typescript
// Custom configuration
const config = {
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    // ...
  },
};
```

#### **After (Shared infrastructure)**
```typescript
import { ConfigurationManager } from '@shared/infrastructure';

const configManager = new ConfigurationManager();
const config = configManager.getConfig();
```

## 🗂️ **File Cleanup**

After migration, remove these files from each service:

### **Files to Remove**
```bash
# Remove old shared directories
rm -rf src/shared/
rm -rf src/exceptions/
rm -rf src/kernel/
rm -rf src/dto/

# Remove old communication files
rm -f src/communication/
rm -f src/utils/http-client.ts
```

### **Files to Keep**
```bash
# Keep service-specific files
src/domain/           # Domain logic
src/application/      # Use cases and DTOs
src/infrastructure/   # Service-specific infrastructure
src/interfaces/       # Controllers and interfaces
```

## 🔧 **Configuration Updates**

### **Update package.json**
```json
{
  "dependencies": {
    "@shared/infrastructure": "^1.0.0"
  }
}
```

### **Update tsconfig.json**
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../shared/infrastructure/src/*"]
    }
  }
}
```

## 🧪 **Testing Migration**

### **1. Update Test Imports**
```typescript
// Before
import { ValidationException } from '../src/shared/exceptions/validation.exception';

// After
import { ValidationException } from '@shared/infrastructure';
```

### **2. Update Test Setup**
```typescript
import { createLogger } from '@shared/infrastructure';

// Use shared logger in tests
const logger = createLogger({
  level: LogLevel.ERROR, // Reduce log noise in tests
  service: 'test-service',
  enableConsole: false,
});
```

## 📊 **Migration Checklist**

### **For Each Service:**
- [ ] Install `@shared/infrastructure` package
- [ ] Update all imports to use shared infrastructure
- [ ] Remove local shared files
- [ ] Update exception handling
- [ ] Update repository implementations
- [ ] Update logging
- [ ] Update health checks
- [ ] Update service communication
- [ ] Update configuration
- [ ] Update tests
- [ ] Verify functionality
- [ ] Update documentation

### **Global Updates:**
- [ ] Update Docker configurations
- [ ] Update environment variables
- [ ] Update CI/CD pipelines
- [ ] Update documentation
- [ ] Update Postman collections

## 🚨 **Common Issues and Solutions**

### **Issue 1: Import Path Errors**
```typescript
// Error: Cannot find module '@shared/infrastructure'
// Solution: Check tsconfig.json paths configuration
```

### **Issue 2: Type Conflicts**
```typescript
// Error: Duplicate type definitions
// Solution: Remove local type definitions and use shared ones
```

### **Issue 3: Configuration Conflicts**
```typescript
// Error: Configuration not found
// Solution: Use ConfigurationManager from shared infrastructure
```

## 🎯 **Benefits After Migration**

### ✅ **Consistency**
- Standardized error handling across all services
- Consistent logging format and levels
- Uniform API response formats

### ✅ **Maintainability**
- Single source of truth for common functionality
- Reduced code duplication
- Easier to update and maintain

### ✅ **Reliability**
- Tested and proven components
- Better error handling and recovery
- Improved monitoring and health checks

### ✅ **Developer Experience**
- Consistent patterns across services
- Better documentation and examples
- Easier onboarding for new developers

## 📚 **Additional Resources**

- [Shared Infrastructure Documentation](./README.md)
- [API Reference](./docs/api-reference.md)
- [Best Practices](./docs/best-practices.md)
- [Troubleshooting Guide](./docs/troubleshooting.md)

---

**This migration guide ensures a smooth transition to the shared infrastructure package while maintaining all existing functionality.**
