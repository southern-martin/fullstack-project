# 🏗️ Clean Architecture Refactor Plan

## 🎯 **Current Issues**

### ❌ **Architecture Violations**
1. **Duplicate Directories**: `auth/`, `user/`, `application/`, `domain/`, `infrastructure/`
2. **Mixed Concerns**: Controllers, services, and entities scattered across layers
3. **Infrastructure in Domain**: TypeORM repositories in domain layer
4. **No Clear Boundaries**: Dependencies pointing in wrong directions

### ❌ **Specific Problems**
- `src/auth/auth.service.ts` - Contains both application and infrastructure logic
- `src/user/user.service.ts` - Infrastructure concerns in wrong layer
- `src/domain/entities/` - Mixed with `src/user/` entities
- `src/auth/dto/` - Duplicated with `src/application/dtos/`
- `src/interfaces/controllers/` - Duplicated with `src/auth/`

## 🎯 **Target Clean Architecture Structure**

```
src/
├── domain/                           # 🏛️ Core Business Logic (Innermost)
│   ├── entities/                     # Business entities
│   │   ├── user.entity.ts           # User business entity
│   │   ├── role.entity.ts           # Role business entity
│   │   └── base.entity.ts           # Base entity
│   ├── value-objects/               # Value objects
│   │   ├── email.vo.ts              # Email value object
│   │   ├── password.vo.ts           # Password value object
│   │   └── user-id.vo.ts            # User ID value object
│   ├── repositories/                # Repository interfaces (contracts)
│   │   ├── user.repository.interface.ts
│   │   └── role.repository.interface.ts
│   ├── services/                    # Domain services
│   │   ├── auth.domain.service.ts   # Authentication domain logic
│   │   └── user.domain.service.ts   # User domain logic
│   └── events/                      # Domain events
│       ├── user-created.event.ts
│       └── user-logged-in.event.ts
├── application/                      # 🎯 Application Logic
│   ├── use-cases/                   # Use cases (application services)
│   │   ├── auth/                    # Authentication use cases
│   │   │   ├── login.use-case.ts
│   │   │   ├── register.use-case.ts
│   │   │   ├── validate-token.use-case.ts
│   │   │   └── refresh-token.use-case.ts
│   │   └── user/                    # User use cases
│   │       ├── create-user.use-case.ts
│   │       ├── update-user.use-case.ts
│   │       └── get-user.use-case.ts
│   ├── dtos/                        # Data transfer objects
│   │   ├── auth/                    # Auth DTOs
│   │   │   ├── login-request.dto.ts
│   │   │   ├── register-request.dto.ts
│   │   │   └── auth-response.dto.ts
│   │   └── user/                    # User DTOs
│   │       ├── create-user.dto.ts
│   │       ├── update-user.dto.ts
│   │       └── user-response.dto.ts
│   ├── interfaces/                  # Application interfaces
│   │   ├── repositories/            # Repository interfaces
│   │   ├── services/                # Service interfaces
│   │   └── external/                # External service interfaces
│   └── events/                      # Application events
│       └── handlers/                # Event handlers
├── infrastructure/                   # 🔧 External Concerns (Outermost)
│   ├── database/                    # Database implementations
│   │   ├── typeorm/                 # TypeORM specific
│   │   │   ├── entities/            # TypeORM entities
│   │   │   │   ├── user.typeorm.entity.ts
│   │   │   │   └── role.typeorm.entity.ts
│   │   │   ├── repositories/        # Repository implementations
│   │   │   │   ├── user.typeorm.repository.ts
│   │   │   │   └── role.typeorm.repository.ts
│   │   │   └── migrations/          # Database migrations
│   │   └── database.module.ts       # Database module
│   ├── external-services/           # External API implementations
│   │   ├── email/                   # Email service
│   │   └── notification/            # Notification service
│   ├── strategies/                  # Infrastructure strategies
│   │   ├── jwt.strategy.ts          # JWT strategy
│   │   └── passport/                # Passport strategies
│   └── config/                      # Configuration
│       ├── database.config.ts
│       └── auth.config.ts
└── interfaces/                       # 🌐 Interface Adapters
    ├── controllers/                 # HTTP controllers
    │   ├── auth.controller.ts       # Auth HTTP controller
    │   └── user.controller.ts       # User HTTP controller
    ├── middleware/                  # HTTP middleware
    │   ├── auth.middleware.ts
    │   └── validation.middleware.ts
    ├── guards/                      # Authentication guards
    │   ├── jwt-auth.guard.ts
    │   └── roles.guard.ts
    └── pipes/                       # Validation pipes
        ├── validation.pipe.ts
        └── transform.pipe.ts
```

## 🔄 **Refactoring Steps**

### **Phase 1: Domain Layer** 🏛️
1. ✅ Move entities to `domain/entities/`
2. ✅ Create value objects in `domain/value-objects/`
3. ✅ Define repository interfaces in `domain/repositories/`
4. ✅ Create domain services in `domain/services/`

### **Phase 2: Application Layer** 🎯
1. ✅ Move use cases to `application/use-cases/`
2. ✅ Organize DTOs in `application/dtos/`
3. ✅ Create application interfaces
4. ✅ Implement event handling

### **Phase 3: Infrastructure Layer** 🔧
1. ✅ Create TypeORM entities in `infrastructure/database/typeorm/entities/`
2. ✅ Implement repositories in `infrastructure/database/typeorm/repositories/`
3. ✅ Move strategies to `infrastructure/strategies/`
4. ✅ Create configuration modules

### **Phase 4: Interface Layer** 🌐
1. ✅ Move controllers to `interfaces/controllers/`
2. ✅ Create middleware in `interfaces/middleware/`
3. ✅ Implement guards in `interfaces/guards/`
4. ✅ Create validation pipes

### **Phase 5: Cleanup** 🧹
1. ✅ Remove duplicate directories
2. ✅ Update imports and dependencies
3. ✅ Fix module configurations
4. ✅ Update tests

## 🎯 **Dependency Rules**

### ✅ **Correct Dependencies**
- **Domain** → No dependencies (pure business logic)
- **Application** → Only depends on Domain
- **Infrastructure** → Depends on Domain and Application
- **Interfaces** → Depends on Application and Infrastructure

### ❌ **Forbidden Dependencies**
- Domain → Application/Infrastructure/Interfaces
- Application → Infrastructure/Interfaces
- Infrastructure → Interfaces

## 🧪 **Testing Strategy**

### **Unit Tests**
- Domain entities and value objects
- Domain services
- Use cases
- Repository implementations

### **Integration Tests**
- Database operations
- External service integrations
- End-to-end API tests

### **Test Structure**
```
tests/
├── unit/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
├── integration/
│   ├── database/
│   └── external-services/
└── e2e/
    ├── auth/
    └── user/
```

## 📊 **Benefits After Refactor**

### ✅ **Clean Architecture Benefits**
1. **Testability** - Easy to unit test business logic
2. **Independence** - Business logic independent of frameworks
3. **Flexibility** - Easy to change external concerns
4. **Maintainability** - Clear separation of concerns

### ✅ **Code Quality Benefits**
1. **No Duplication** - Single source of truth for each concept
2. **Clear Boundaries** - Well-defined layer responsibilities
3. **Dependency Inversion** - High-level modules don't depend on low-level
4. **SOLID Principles** - Follows all SOLID principles

## 🚀 **Implementation Plan**

1. **Create new directory structure**
2. **Move and refactor domain layer**
3. **Move and refactor application layer**
4. **Move and refactor infrastructure layer**
5. **Move and refactor interface layer**
6. **Update module configurations**
7. **Fix imports and dependencies**
8. **Update tests**
9. **Remove old directories**
10. **Update documentation**

---

**This refactor will transform the auth service into a proper Clean Architecture implementation!** 🎉
