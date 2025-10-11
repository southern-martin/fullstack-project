# 🏗️ Auth Service - Clean Architecture Microservice

## 📋 Overview

This is a **standalone authentication microservice** built with **Clean Architecture** principles, designed for **reusability**, **extensibility**, and **maintainability**.

## 🎯 Architecture Principles

### **Clean Architecture Layers**

```
┌─────────────────────────────────────────────────────────────┐
│                    Clean Architecture                       │
├─────────────────────────────────────────────────────────────┤
│ Interface Layer (Controllers)                              │
│ ├── Controllers handle HTTP requests                       │
│ ├── Input validation and transformation                    │
│ └── Response formatting                                    │
├─────────────────────────────────────────────────────────────┤
│ Application Layer (Use Cases)                              │
│ ├── Business use cases orchestration                       │
│ ├── Application-specific business rules                    │
│ └── DTOs for data transfer                                 │
├─────────────────────────────────────────────────────────────┤
│ Domain Layer (Business Logic)                              │
│ ├── Entities with business rules                           │
│ ├── Value Objects for data integrity                       │
│ ├── Repository interfaces                                  │
│ └── Domain services                                        │
├─────────────────────────────────────────────────────────────┤
│ Infrastructure Layer (External Concerns)                   │
│ ├── Database repositories                                  │
│ ├── External service integrations                          │
│ └── Framework-specific implementations                     │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
auth-service/
├── src/
│   ├── domain/                    # 🎯 Domain Layer (Business Logic)
│   │   ├── entities/              # Business entities
│   │   │   ├── user.entity.ts
│   │   │   ├── role.entity.ts
│   │   │   └── base.entity.ts
│   │   ├── value-objects/         # Value objects for data integrity
│   │   │   ├── email.vo.ts
│   │   │   └── password.vo.ts
│   │   ├── repositories/          # Repository interfaces
│   │   │   ├── user.repository.interface.ts
│   │   │   └── role.repository.interface.ts
│   │   ├── services/              # Domain services
│   │   │   └── auth.domain.service.ts
│   │   ├── tokens/                # Dependency injection tokens
│   │   │   └── repository.tokens.ts
│   │   └── index.ts               # Domain exports
│   │
│   ├── application/               # 🔧 Application Layer (Use Cases)
│   │   ├── use-cases/             # Business use cases
│   │   │   ├── login.use-case.ts
│   │   │   ├── register.use-case.ts
│   │   │   └── validate-token.use-case.ts
│   │   ├── dtos/                  # Data Transfer Objects
│   │   │   ├── login-request.dto.ts
│   │   │   ├── register-request.dto.ts
│   │   │   ├── user-response.dto.ts
│   │   │   └── auth-response.dto.ts
│   │   ├── application.module.ts  # Application module
│   │   └── index.ts               # Application exports
│   │
│   ├── infrastructure/            # 🔌 Infrastructure Layer
│   │   ├── repositories/          # Repository implementations
│   │   │   ├── user.repository.ts
│   │   │   └── role.repository.ts
│   │   ├── database/              # Database configuration
│   │   │   └── database.module.ts
│   │   ├── strategies/            # Authentication strategies
│   │   │   └── jwt.strategy.ts
│   │   └── index.ts               # Infrastructure exports
│   │
│   ├── interfaces/                # 🌐 Interface Layer
│   │   ├── controllers/           # HTTP controllers
│   │   │   └── auth.controller.ts
│   │   └── index.ts               # Interface exports
│   │
│   ├── app.module.ts              # Main application module
│   └── main.ts                    # Application entry point
│
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── nest-cli.json                  # NestJS CLI configuration
└── env.example                    # Environment variables template
```

## 🎯 Key Features

### **✅ Clean Architecture Benefits**
- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Testability**: Easy to unit test each layer independently
- **Extensibility**: Easy to add new features without affecting existing code
- **Maintainability**: Clear structure makes code easy to understand and modify

### **✅ Domain-Driven Design**
- **Entities**: Rich domain models with business logic
- **Value Objects**: Immutable objects for data integrity
- **Repository Pattern**: Abstract data access layer
- **Domain Services**: Business logic that doesn't belong to entities

### **✅ Microservice Best Practices**
- **Single Responsibility**: Only handles authentication concerns
- **Independent Deployment**: Can be deployed separately
- **Database per Service**: Own database for data isolation
- **API-First Design**: RESTful API for service communication
- **Health Checks**: Monitoring and observability endpoints

## 🚀 API Endpoints

### **Authentication Endpoints**
```
POST /api/v1/auth/login           # User login
POST /api/v1/auth/register        # User registration
POST /api/v1/auth/validate-token  # Token validation (for other services)
POST /api/v1/auth/refresh         # Token refresh
GET  /api/v1/auth/profile         # Get user profile
POST /api/v1/auth/logout          # User logout
GET  /api/v1/auth/health          # Health check
```

### **Request/Response Examples**

#### **Login Request**
```json
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "Password123"
}
```

#### **Login Response**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "isEmailVerified": true,
    "roles": [
      {
        "id": 1,
        "name": "user",
        "description": "Regular user",
        "permissions": ["read:own"]
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

## 🔧 Configuration

### **Environment Variables**
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=auth_service_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Service Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🏃‍♂️ Getting Started

### **1. Install Dependencies**
```bash
npm install
```

### **2. Setup Database**
```bash
# Create database
mysql -u root -p
CREATE DATABASE auth_service_db;
```

### **3. Configure Environment**
```bash
cp env.example .env
# Edit .env with your database credentials
```

### **4. Start Development Server**
```bash
npm run start:dev
```

### **5. Build for Production**
```bash
npm run build
npm run start:prod
```

## 🧪 Testing

### **Unit Tests**
```bash
npm run test
```

### **Integration Tests**
```bash
npm run test:e2e
```

### **Test Coverage**
```bash
npm run test:cov
```

## 📊 Monitoring & Observability

### **Health Check**
```bash
curl http://localhost:3001/api/v1/auth/health
```

### **Response**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Security Features

### **Password Security**
- **Bcrypt Hashing**: Passwords are hashed with bcrypt
- **Password Validation**: Strong password requirements
- **Password History**: Track password changes

### **JWT Security**
- **Configurable Secrets**: Environment-based JWT secrets
- **Token Expiration**: Configurable token lifetime
- **Token Validation**: Secure token verification

### **Input Validation**
- **Class Validator**: Request validation with decorators
- **Email Validation**: Proper email format validation
- **SQL Injection Protection**: TypeORM parameterized queries

## 🔄 Integration with Other Services

### **Token Validation for Other Services**
```bash
POST /api/v1/auth/validate-token
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Response**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "roles": [...]
}
```

## 🎯 Extensibility

### **Adding New Use Cases**
1. Create use case in `src/application/use-cases/`
2. Add DTOs in `src/application/dtos/`
3. Update controller in `src/interfaces/controllers/`
4. Add tests

### **Adding New Entities**
1. Create entity in `src/domain/entities/`
2. Create repository interface in `src/domain/repositories/`
3. Implement repository in `src/infrastructure/repositories/`
4. Update database module

### **Adding External Services**
1. Create service interface in `src/domain/services/`
2. Implement service in `src/infrastructure/external-services/`
3. Add to application module

## 📈 Performance Considerations

### **Database Optimization**
- **Indexes**: Proper database indexes for queries
- **Connection Pooling**: TypeORM connection pooling
- **Query Optimization**: Efficient repository queries

### **Caching Strategy**
- **JWT Caching**: Token validation caching
- **User Caching**: Frequently accessed user data
- **Role Caching**: Role and permission caching

### **Scalability**
- **Horizontal Scaling**: Stateless service design
- **Load Balancing**: Multiple service instances
- **Database Sharding**: User data partitioning

## 🚀 Deployment

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/main"]
```

### **Kubernetes Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: auth-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: DB_HOST
          value: "mysql-service"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: auth-secrets
              key: jwt-secret
```

## 📚 Learning Resources

### **Clean Architecture**
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

### **Microservices**
- [Microservices Patterns](https://microservices.io/)
- [Building Microservices by Sam Newman](https://samnewman.io/books/building_microservices/)

### **NestJS**
- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Best Practices](https://docs.nestjs.com/fundamentals/testing)

---

**This Auth Service demonstrates production-ready Clean Architecture implementation for microservices!** 🚀


