# Copilot Instructions for Fullstack Microservices Project

## 🏗️ Architecture Overview

This is a **hybrid microservices architecture** with deliberate shared and separated database strategies:

- **Shared Database Pattern**: Auth Service (3001) + User Service (3003) share `shared_user_db:3306` for tightly coupled user/auth data
- **Separate Database Pattern**: Business services (Carrier, Customer, Pricing) have independent databases for loose coupling
- **Shared Redis**: All services use `shared-redis:6379` for caching and sessions

## 🚀 Essential Development Workflows

### Quick Setup Commands
```bash
# Start shared infrastructure first
cd shared-database && docker-compose up -d

# Start all services via hybrid setup
docker-compose -f docker-compose.hybrid.yml up -d

# Development mode (individual services)
make dev  # or check Makefile for specific targets
```

### Key Environment Files
- Copy `.env.shared.example` → `.env` for Auth/User services (shared DB config)
- Each service has specific port assignments (Auth:3001, User:3003, etc.)
- Default login: `admin@example.com` / `admin123`

## 🎯 Project-Specific Patterns

### Clean Architecture (NestJS Services)
Services follow Clean Architecture with consistent structure:
```
src/
├── application/     # Use cases and business logic
├── domain/         # Entities and domain rules
├── infrastructure/ # Database, external services
└── interfaces/     # Controllers and DTOs
```

### React Admin Structure
Frontend uses provider-wrapped architecture:
```tsx
<QueryProvider>
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <AppRoutes />
```

### Database Conventions
- **Shared entities**: `UserTypeOrmEntity`, `RoleTypeOrmEntity` (used by Auth + User services)
- **Business entities**: Independent per service
- TypeORM with PostgreSQL config in development, MySQL in production

## 🔧 Integration Patterns

### Cross-Service Communication
Business services call User Service API for user data (not direct DB access):
```typescript
// In Customer Service
const user = await userService.getUser(customer.userId);
```

### Health Checks
All services expose health endpoints:
- Auth: `/api/v1/auth/health`
- Others: `/health`

### Docker Orchestration
- Use `docker-compose.hybrid.yml` for full stack
- Individual service docker-compose files for isolated development
- Shared volumes for database persistence

## 📁 Key Files for Context

- `HYBRID-ARCHITECTURE-README.md` - Database strategy decisions
- `Makefile` - Development commands and targets
- `docker-compose.hybrid.yml` - Full stack orchestration
- `scripts/` - Utility scripts for build, test, deploy
- Service-specific `README.md` files contain API documentation

## 🎨 Code Style & Conventions

- TypeScript strict mode across all services
- NestJS decorators for dependency injection
- React Query for state management in frontend
- Environment-specific configurations (dev/prod)
- Shared Redis key prefixes per service (`auth:`, `user:`, etc.)

## ⚠️ Important Notes

- **Database Changes**: Auth/User services share schema - coordinate migrations
- **Port Management**: Fixed port assignments - check `docker-compose.hybrid.yml`
- **Development vs Production**: Services use different DB types (PostgreSQL dev, MySQL prod)
- **Testing**: Use `scripts/testing/` utilities for validation