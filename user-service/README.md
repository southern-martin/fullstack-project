# 👥 User Service

A microservice for user and role management built with NestJS following Clean Architecture principles.

## 🏗️ Architecture

This service follows Clean Architecture with clear separation of concerns:

```
src/
├── domain/                 # Domain Layer
│   ├── entities/          # Domain Entities (User, Role)
│   ├── repositories/      # Repository Interfaces
│   └── events/           # Domain Events
├── application/           # Application Layer
│   ├── controllers/      # REST Controllers
│   ├── services/         # Application Services
│   └── dto/             # Data Transfer Objects
├── infrastructure/        # Infrastructure Layer
│   └── repositories/     # TypeORM Repository Implementations
└── shared/               # Shared Kernel
    └── kernel/           # Base Classes and Utilities
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0+

### Development Setup

1. **Clone and Install Dependencies**
   ```bash
   cd user-service
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Seed Test Data**
   ```bash
   npm run seed:dev
   ```

### Manual Setup

1. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE user_service_db;
   ```

2. **Start Application**
   ```bash
   npm run start:dev
   ```

## 📊 API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/users` | Create a new user |
| `GET` | `/api/v1/users` | List users (paginated) |
| `GET` | `/api/v1/users/active` | List active users |
| `GET` | `/api/v1/users/count` | Get user count |
| `GET` | `/api/v1/users/email/:email` | Get user by email |
| `GET` | `/api/v1/users/role/:roleName` | Get users by role |
| `GET` | `/api/v1/users/exists/:email` | Check if email exists |
| `GET` | `/api/v1/users/:id` | Get user by ID |
| `PATCH` | `/api/v1/users/:id` | Update user |
| `PATCH` | `/api/v1/users/:id/roles` | Assign roles to user |
| `DELETE` | `/api/v1/users/:id` | Delete user |

### Roles

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/roles` | Create a new role |
| `GET` | `/api/v1/roles` | List roles (paginated) |
| `GET` | `/api/v1/roles/active` | List active roles |
| `GET` | `/api/v1/roles/count` | Get role count |
| `GET` | `/api/v1/roles/permission/:permission` | Get roles by permission |
| `GET` | `/api/v1/roles/name/:name` | Get role by name |
| `GET` | `/api/v1/roles/exists/:name` | Check if role name exists |
| `GET` | `/api/v1/roles/:id` | Get role by ID |
| `PATCH` | `/api/v1/roles/:id` | Update role |
| `DELETE` | `/api/v1/roles/:id` | Delete role |

## 🧪 Testing

### Test Users

After seeding, you can use these test accounts:

- **Admin**: `admin@example.com` / `Admin123`
- **User**: `user@example.com` / `User123`
- **Moderator**: `moderator@example.com` / `Moderator123`

### API Testing

```bash
# Health check
curl http://localhost:3003/api/v1/health

# Get all users
curl http://localhost:3003/api/v1/users

# Get user by email
curl http://localhost:3003/api/v1/users/email/admin@example.com
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f user-service

# Stop services
docker-compose down

# Clean up (remove volumes)
docker-compose down -v
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Application environment |
| `PORT` | `3003` | Application port |
| `DB_HOST` | `localhost` | Database host |
| `DB_PORT` | `3307` | Database port |
| `DB_USERNAME` | `user_service_user` | Database username |
| `DB_PASSWORD` | `user_service_password` | Database password |
| `DB_DATABASE` | `user_service_db` | Database name |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend URL for CORS |

## 📈 Features

- ✅ **Clean Architecture**: Domain-driven design with clear separation
- ✅ **User Management**: CRUD operations with validation
- ✅ **Role Management**: Flexible role-based access control
- ✅ **Password Security**: Bcrypt hashing
- ✅ **Data Validation**: Class-validator DTOs
- ✅ **Database**: TypeORM with MySQL
- ✅ **Docker Support**: Complete containerization
- ✅ **Health Checks**: Built-in health monitoring
- ✅ **CORS**: Configurable cross-origin support

## 🔗 Integration

This service is designed to work with:

- **Auth Service**: For authentication and authorization
- **Main API Gateway**: For routing and load balancing
- **Frontend Applications**: React admin panel
- **Other Microservices**: Via HTTP API calls

## 📝 License

MIT License - see LICENSE file for details.





