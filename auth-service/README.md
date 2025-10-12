# 🔐 Auth Service

Authentication and authorization microservice built with NestJS, featuring JWT-based authentication and shared database architecture.

## 🎯 **Overview**

The Auth Service handles user authentication, JWT token generation, and user profile management. It shares the database with the User Service to eliminate data duplication and sync issues.

## 🏗️ **Architecture**

### **Shared Database Integration**
- **Database**: Shared MySQL database (`shared_user_db`)
- **Port**: 3306 (shared with User Service)
- **Tables**: `users`, `roles`, `user_roles`

### **Service Configuration**
- **Port**: 3001
- **Framework**: NestJS with TypeScript
- **Authentication**: JWT tokens
- **Database**: TypeORM with MySQL

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- MySQL database (shared)
- Docker (optional)

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
# Database Configuration (Shared Database)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=shared_user
DB_PASSWORD=shared_password_2024
DB_NAME=shared_user_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Service Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📡 **API Endpoints**

### **Authentication**
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/refresh` - Refresh JWT token

### **Health Check**
- `GET /api/v1/auth/health` - Service health status

### **Example Usage**
```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get profile (with JWT token)
curl -X GET http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer <jwt_token>"
```

## 🗄️ **Database Schema**

### **Users Table**
```sql
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
```

### **Roles Table**
```sql
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **User Roles Junction Table**
```sql
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
├── auth/                    # Authentication module
│   ├── auth.controller.ts   # Auth endpoints
│   ├── auth.service.ts      # Auth business logic
│   ├── auth.module.ts       # Auth module
│   ├── dto/                 # Data transfer objects
│   └── strategies/          # JWT strategy
├── user/                    # User module (shared with User Service)
│   ├── user.entity.ts       # User entity
│   ├── user.service.ts      # User service
│   └── user.module.ts       # User module
├── domain/                  # Domain layer
│   ├── entities/            # Domain entities
│   ├── repositories/        # Repository interfaces
│   └── services/            # Domain services
├── infrastructure/          # Infrastructure layer
│   ├── database/            # Database configuration
│   └── repositories/        # Repository implementations
└── main.ts                  # Application entry point
```

## 🔐 **Security Features**

### **JWT Authentication**
- **Token Type**: JSON Web Tokens
- **Expiration**: Configurable (default: 24h)
- **Algorithm**: HS256
- **Claims**: User ID, email, roles, timestamps

### **Password Security**
- **Hashing**: bcrypt with salt rounds
- **Validation**: Strong password requirements
- **Reset**: Password reset functionality

### **Role-Based Access Control**
- **Roles**: admin, user, editor, viewer
- **Permissions**: Granular permission system
- **Authorization**: JWT-based role verification

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

### **Test Database**
Tests use a separate test database to avoid conflicts with development data.

## 🐳 **Docker Support**

### **Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

### **Docker Compose**
```yaml
auth-service:
  build: .
  ports:
    - "3001:3001"
  environment:
    DB_HOST: shared-user-db
    DB_PORT: 3306
    DB_USERNAME: shared_user
    DB_PASSWORD: shared_password_2024
    DB_NAME: shared_user_db
  depends_on:
    - shared-user-db
```

## 📊 **Monitoring**

### **Health Check**
```bash
curl http://localhost:3001/api/v1/auth/health
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

### **Logging**
- **Level**: Configurable (default: info)
- **Format**: JSON structured logging
- **Output**: Console and file logging

## 🔄 **Shared Database Benefits**

### **Why Shared Database?**
1. **Single Source of Truth** - No duplicate user data
2. **No Sync Issues** - Changes immediately available to both services
3. **Better Performance** - No cross-service API calls for user data
4. **Simpler Architecture** - Easier to maintain and debug
5. **ACID Compliance** - Database transactions ensure data integrity

### **Data Consistency**
- **User Creation** - Auth Service creates user, User Service can immediately access
- **Role Assignment** - Changes reflected in both services instantly
- **Profile Updates** - Single update affects both services

## 🚀 **Deployment**

### **Production Build**
```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

### **Environment Variables**
Ensure all production environment variables are set:
- Database credentials
- JWT secret (use strong, unique secret)
- Service ports
- External service URLs

### **Health Monitoring**
- Monitor health check endpoint
- Set up alerts for service downtime
- Monitor database connections
- Track JWT token generation rates

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
  database: process.env.DB_NAME,
  entities: [User, Role],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development'
}
```

### **JWT Configuration**
```typescript
// JWT module configuration
{
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
}
```

## 📚 **API Documentation**

For complete API documentation, see:
- **Swagger UI**: http://localhost:3001/api/docs (when enabled)
- **API Reference**: `docs/api/README.md`
- **Postman Collection**: `docs/api/postman-collection.json`

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Database Connection Failed**
```bash
# Check database status
docker-compose logs shared-user-db

# Verify connection
mysql -h localhost -P 3306 -u shared_user -p shared_user_db
```

#### **JWT Token Issues**
- Verify JWT_SECRET is set
- Check token expiration
- Ensure proper token format in Authorization header

#### **Service Not Starting**
```bash
# Check logs
npm run start:dev

# Verify environment variables
cat .env

# Check port availability
lsof -i :3001
```

---

**The Auth Service provides secure, scalable authentication for the microservices architecture with shared database integration.**