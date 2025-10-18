# 🚀 Fullstack Microservices Project

A comprehensive fullstack application built with microservices architecture, featuring React Admin frontend, NestJS backend services, and shared database architecture.

## 🏗️ **Architecture Overview**

### **Frontend**
- **React Admin Dashboard** - Modern admin interface with Tailwind CSS
- **Authentication** - JWT-based authentication with role management
- **Multi-language Support** - Internationalization ready
- **Responsive Design** - Mobile-first approach

### **Backend Microservices**
- **Auth Service** - Authentication and authorization (Port 3001)
- **User Service** - User management and profiles (Port 3003)
- **Carrier Service** - Carrier management (Port 3004)
- **Customer Service** - Customer management (Port 3005)
- **Pricing Service** - Pricing calculations (Port 3006)
- **Translation Service** - Internationalization (Port 3007)

### **Shared Infrastructure**
- **Shared Database** - MySQL database for Auth and User services (Port 3306)
- **Shared Redis** - Caching and session management (Port 6379)
- **Docker Compose** - Container orchestration

## 🎯 **Key Features**

### **✅ Shared Database Architecture**
- **Single Source of Truth** - Auth and User services share the same database
- **No Data Duplication** - Eliminates sync issues between services
- **Better Performance** - No cross-service API calls for user data
- **Simplified Maintenance** - Single database to manage

### **✅ Modern Tech Stack**
- **Frontend**: React 18, TypeScript, Tailwind CSS, React Admin
- **Backend**: NestJS, TypeScript, TypeORM, JWT Authentication
- **Database**: MySQL 8.0 with shared architecture
- **Caching**: Redis for session management
- **Containerization**: Docker & Docker Compose

### **✅ Production Ready**
- **Health Checks** - All services include health monitoring
- **Environment Configuration** - Comprehensive environment setup
- **Docker Support** - Full containerization with Docker Compose
- **Documentation** - Complete setup and deployment guides

## 🚀 **Quick Start**

### **Prerequisites**
- Docker Desktop
- Node.js 18+ and npm
- Git

### **1. Clone and Setup**
```bash
git clone <repository-url>
cd fullstack-project
```

### **2. Start Shared Database**
```bash
cd shared-database
docker-compose up -d
```

### **3. Configure Services**
```bash
# Copy environment files
cp auth-service/.env.shared.example auth-service/.env
cp user-service/.env.shared.example user-service/.env
```

### **4. Start Services**
```bash
# Start Auth Service
cd auth-service && npm install && npm run start:dev

# Start User Service (in another terminal)
cd user-service && npm install && npm run start:dev

# Start React Admin (in another terminal)
cd react-admin && npm install && npm start
```

### **5. Access the Application**
- **React Admin**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **User Service**: http://localhost:3003

### **Default Login**
- **Email**: admin@example.com
- **Password**: admin123

## 📁 **Project Structure**

```
fullstack-project/
├── 📱 react-admin/              # React Admin frontend
├── 🔐 auth-service/             # Authentication service
├── 👥 user-service/             # User management service
├── 🚚 carrier-service/          # Carrier management service
├── 🏢 customer-service/         # Customer management service
├── 💰 pricing-service/          # Pricing calculation service
├── 🌐 translation-service/      # Translation service
├── 🗄️ shared-database/          # Shared database setup
├── 🔴 shared-redis/             # Shared Redis setup
├── 📚 docs/                     # Comprehensive documentation
├── 🐳 docker-compose.yml        # Main Docker Compose
└── 📋 README.md                 # This file
```

## 🛠️ **Development**

### **Available Scripts**
```bash
# Start all services with Docker
docker-compose -f shared-database/docker-compose.services.yml up -d

# Start individual services
npm run start:dev          # Development mode
npm run build              # Production build
npm run test               # Run tests
npm run lint               # Lint code
```

### **Environment Variables**
Each service has its own `.env` file with:
- Database configuration
- JWT secrets
- Service ports
- External service URLs

## 🗄️ **Database Schema**

### **Shared Database (shared_user_db)**
```sql
-- Users table (shared between Auth and User services)
users (
  id, email, password, first_name, last_name, 
  phone, is_active, is_email_verified, 
  last_login_at, password_changed_at, 
  created_at, updated_at
)

-- Roles table (shared between services)  
roles (
  id, name, description, permissions, 
  is_active, created_at, updated_at
)

-- User-Roles junction table
user_roles (
  id, user_id, role_id, assigned_at, assigned_by
)
```

## 🚀 **Deployment**

### **Production Deployment**
```bash
# Build all services
docker-compose -f shared-database/docker-compose.services.yml build

# Deploy to production
docker-compose -f shared-database/docker-compose.services.yml up -d
```

### **Environment Setup**
1. Update environment variables for production
2. Configure database credentials
3. Set up SSL certificates
4. Configure reverse proxy (nginx)

## 📊 **Monitoring & Health Checks**

All services include health check endpoints:
- **Auth Service**: http://localhost:3001/api/v1/auth/health
- **User Service**: http://localhost:3003/health
- **Carrier Service**: http://localhost:3004/health
- **Customer Service**: http://localhost:3005/health
- **Pricing Service**: http://localhost:3006/health
- **Translation Service**: http://localhost:3007/health

## 🔧 **Configuration**

### **Service Ports**
- React Admin: 3000
- Auth Service: 3001
- User Service: 3003
- Carrier Service: 3004
- Customer Service: 3005
- Pricing Service: 3006
- Translation Service: 3007
- Shared Database: 3306
- Shared Redis: 6379

### **Database Configuration**
- **Host**: localhost
- **Port**: 3306
- **Database**: shared_user_db
- **Username**: shared_user
- **Password**: shared_password_2024

## 📚 **Documentation**

### **🚀 Start Here - Git Flow**
- **[⭐ Executive Summary](GIT-FLOW-EXECUTIVE-SUMMARY.md)** - **START HERE** - Overview, timeline, priorities
- **[📋 Complete Strategy](GIT-FLOW-COMPLETE-STRATEGY.md)** - Full details, PR templates, all commands
- **[🤖 Automated Script](scripts/git-flow-execute.sh)** - Execute with interactive prompts

### **🐳 Docker Fix Documentation**
Located in `docs/development/`:
- **[📚 Index](docs/development/GIT-FLOW-INDEX.md)** - Navigation hub
- **[⚡ Quick Reference](docs/development/QUICK-REFERENCE-DOCKER-FIX.md)** - Fast commands
- **[🐳 Complete Details](docs/development/GIT-FLOW-DOCKER-SHARED-INFRASTRUCTURE-FIX.md)** - Full fix
- **[� Auth Service](docs/development/GIT-FLOW-AUTH-SERVICE-DOCKER-FIX.md)** - Auth specific
- **[👥 User Service](docs/development/GIT-FLOW-USER-SERVICE-DOCKER-FIX.md)** - User specific

### **📖 Project Documentation**
- **[Architecture](docs/architecture/README.md)** - System design and architecture
- **[API Documentation](docs/api/README.md)** - API endpoints and usage
- **[Deployment](docs/deployment/README.md)** - Production deployment
- **[Development](docs/development/README.md)** - Development setup
- **[Frontend](docs/frontend/README.md)** - React Admin setup

### **✅ Features Ready to Merge**
1. ✅ **Documentation Cleanup** - Organize and archive outdated docs
2. ✅ **CMake Modernization** - Update build system for hybrid architecture
3. ✅ **Customer Service Architecture** - Apply Clean Architecture guidelines
4. ✅ **Docker Infrastructure Fix** - Fix shared infrastructure (CRITICAL)
5. ⏳ **Carrier Service Architecture** - Pending implementation
6. ⏳ **Pricing Service Architecture** - Pending implementation

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

For support and questions:
- Check the [documentation](docs/)
- Review [troubleshooting guide](docs/deployment/README.md#troubleshooting)
- Create an issue in the repository

## 🎯 **Roadmap**

- [ ] Add more microservices (Inventory, Orders, etc.)
- [ ] Implement API Gateway
- [ ] Add monitoring and logging
- [ ] Implement CI/CD pipeline
- [ ] Add comprehensive testing suite
- [ ] Implement caching strategies
- [ ] Add real-time features with WebSockets

---

**Built with ❤️ using modern microservices architecture**
