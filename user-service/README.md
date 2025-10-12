# 👥 User Service

User management microservice built with NestJS, featuring comprehensive user CRUD operations and shared database architecture.

## 🎯 **Overview**

The User Service handles user management, role assignments, and user profile operations. It shares the database with the Auth Service to ensure data consistency and eliminate sync issues.

## 🏗️ **Architecture**

### **Shared Database Integration**
- **Database**: Shared MySQL database (`shared_user_db`)
- **Port**: 3306 (shared with Auth Service)
- **Tables**: `users`, `roles`, `user_roles`

### **Service Configuration**
- **Port**: 3003
- **Framework**: NestJS with TypeScript
- **Database**: TypeORM with MySQL
- **Authentication**: JWT-based (from Auth Service)

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- MySQL database (shared)
- Auth Service running (for JWT validation)

### **Installation**
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.shared.example .env

# Start in development mode
npm run start:dev
```

### **Environment Configuration**
```env
# Application Configuration
NODE_ENV=development
PORT=3003

# Database Configuration (Shared Database)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=shared_user
DB_PASSWORD=shared_password_2024
DB_DATABASE=shared_user_db
DB_ROOT_PASSWORD=shared_root_password_2024

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# JWT Configuration (for inter-service communication)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Service Discovery
SERVICE_REGISTRY_URL=http://localhost:3001/api/v1/services
SERVICE_NAME=user-service
SERVICE_VERSION=1.0.0
```

## 📡 **API Endpoints**

### **User Management**
- `GET /api/v1/users` - List users with pagination and filtering
- `POST /api/v1/users` - Create new user
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### **Role Management**
- `GET /api/v1/users/roles` - Get all available roles
- `POST /api/v1/users/:id/roles` - Assign roles to user
- `DELETE /api/v1/users/:id/roles/:roleId` - Remove role from user

### **Health Check**
- `GET /health` - Service health status

### **Example Usage**
```bash
# Get users list
curl -X GET http://localhost:3003/api/v1/users \
  -H "Authorization: Bearer <jwt_token>"

# Create new user
curl -X POST http://localhost:3003/api/v1/users \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "roleIds": [2]
  }'

# Update user
curl -X PUT http://localhost:3003/api/v1/users/1 \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "isActive": true
  }'
```

## 🗄️ **Database Schema**

### **Shared Database Tables**
The User Service shares the same database schema with the Auth Service:

```sql
-- Users table (shared between Auth and User services)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    password_changed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table (shared between services)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User-Roles junction table
CREATE TABLE user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (user_id, role_id)
);
```

## 🔧 **Development**

### **Available Scripts**
```bash
npm run start          # Start in production mode
npm run start:dev      # Start in development mode with hot reload
npm run build          # Build for production
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
npm run lint           # Lint code
npm run format         # Format code
```

### **Project Structure**
```
src/
├── application/               # Application layer
│   ├── controllers/          # API controllers
│   │   ├── user.controller.ts
│   │   └── role.controller.ts
│   ├── dto/                  # Data transfer objects
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   └── user-response.dto.ts
│   └── services/             # Application services
│       ├── user.service.ts
│       └── role.service.ts
├── domain/                   # Domain layer
│   ├── entities/             # Domain entities
│   │   ├── user.entity.ts
│   │   └── role.entity.ts
│   ├── events/               # Domain events
│   │   ├── user-created.event.ts
│   │   ├── user-updated.event.ts
│   │   └── user-deleted.event.ts
│   └── repositories/         # Repository interfaces
│       ├── user.repository.interface.ts
│       └── role.repository.interface.ts
├── infrastructure/           # Infrastructure layer
│   └── repositories/         # Repository implementations
│       ├── user.repository.ts
│       └── role.repository.ts
├── shared/                   # Shared components
│   └── kernel/               # Domain kernel
│       ├── base.entity.ts
│       ├── domain-event.ts
│       └── result.ts
└── main.ts                   # Application entry point
```

## 🔐 **Security & Authorization**

### **JWT Authentication**
- **Token Validation**: Validates JWT tokens from Auth Service
- **Role-Based Access**: Implements role-based access control
- **Permission Checks**: Validates user permissions for operations

### **Data Validation**
- **Input Validation**: Comprehensive input validation using class-validator
- **SQL Injection Protection**: TypeORM provides built-in protection
- **XSS Protection**: Input sanitization and validation

### **Role-Based Operations**
- **Admin**: Full access to all user operations
- **User**: Limited access to own profile
- **Editor**: Can manage users but not delete
- **Viewer**: Read-only access

## 🧪 **Testing**

### **Unit Tests**
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### **Integration Tests**
```bash
# Run e2e tests
npm run test:e2e
```

### **Test Data**
Tests use a separate test database with seeded data:
- Test users with different roles
- Sample role configurations
- Mock JWT tokens for testing

## 🐳 **Docker Support**

### **Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3003
CMD ["npm", "run", "start:prod"]
```

### **Docker Compose Integration**
```yaml
user-service:
  build: .
  ports:
    - "3003:3003"
  environment:
    DB_HOST: shared-user-db
    DB_PORT: 3306
    DB_USERNAME: shared_user
    DB_PASSWORD: shared_password_2024
    DB_DATABASE: shared_user_db
  depends_on:
    - shared-user-db
    - auth-service
```

## 📊 **Monitoring & Health Checks**

### **Health Check Endpoint**
```bash
curl http://localhost:3003/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "version": "1.0.0"
}
```

### **Metrics & Logging**
- **Request Logging**: All API requests logged with timing
- **Error Tracking**: Comprehensive error logging and tracking
- **Performance Metrics**: Response time and throughput monitoring
- **Database Metrics**: Connection pool and query performance

## 🔄 **Shared Database Benefits**

### **Data Consistency**
- **Single Source of Truth**: User data exists in one place
- **Immediate Updates**: Changes reflected instantly across services
- **Transaction Support**: Database transactions ensure data integrity
- **No Sync Issues**: Eliminates data synchronization problems

### **Performance Benefits**
- **No Cross-Service Calls**: Direct database access for user data
- **Reduced Latency**: Faster response times for user operations
- **Simplified Caching**: Single cache layer for user data
- **Better Scalability**: Database can be optimized for user operations

## 🚀 **Deployment**

### **Production Configuration**
```bash
# Set production environment variables
export NODE_ENV=production
export DB_HOST=your-production-db-host
export DB_PASSWORD=your-secure-password
export JWT_SECRET=your-production-jwt-secret

# Build and start
npm run build
npm run start:prod
```

### **Environment Variables**
Ensure all production environment variables are configured:
- Database connection details
- JWT secret (must match Auth Service)
- Service discovery URLs
- External service endpoints

### **Health Monitoring**
- Monitor health check endpoint
- Set up alerts for service downtime
- Monitor database connection health
- Track API response times

## 🔧 **Configuration**

### **Database Configuration**
```typescript
// TypeORM configuration
{
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Role],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  poolSize: 10,
  acquireTimeout: 60000,
  timeout: 60000
}
```

### **CORS Configuration**
```typescript
// CORS setup for frontend integration
{
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## 📚 **API Documentation**

### **Query Parameters**
- **Pagination**: `page`, `limit`
- **Filtering**: `search`, `role`, `isActive`
- **Sorting**: `sortBy`, `sortOrder`

### **Response Format**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  },
  "message": "Users retrieved successfully"
}
```

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Database Connection Issues**
```bash
# Check database connectivity
mysql -h localhost -P 3306 -u shared_user -p shared_user_db

# Verify environment variables
cat .env | grep DB_
```

#### **JWT Token Validation Issues**
- Ensure JWT_SECRET matches Auth Service
- Check token expiration
- Verify token format in Authorization header

#### **Service Dependencies**
```bash
# Check Auth Service is running
curl http://localhost:3001/api/v1/auth/health

# Verify service discovery
curl http://localhost:3001/api/v1/services
```

#### **Performance Issues**
```bash
# Check database performance
mysql -u root -p -e "SHOW PROCESSLIST;"

# Monitor service metrics
curl http://localhost:3003/health
```

## 🔄 **Integration with Auth Service**

### **Shared Database Operations**
- **User Creation**: Auth Service creates user, User Service can immediately access
- **Role Assignment**: Changes reflected in both services instantly
- **Profile Updates**: Single update affects both services
- **User Deactivation**: Consistent across all services

### **JWT Token Flow**
1. User authenticates with Auth Service
2. Auth Service generates JWT token
3. User Service validates JWT for user operations
4. Both services share same user data from database

---

**The User Service provides comprehensive user management with shared database integration for optimal performance and data consistency.**