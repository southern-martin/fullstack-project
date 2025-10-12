# 🚀 Quick Start Guide

Get up and running with the fullstack microservices application in minutes!

## ⚡ **5-Minute Setup**

### **Prerequisites**
- Docker Desktop (running)
- Node.js 18+ and npm
- Git

### **Step 1: Clone and Setup**
```bash
# Clone the repository
git clone <repository-url>
cd fullstack-project

# Verify Docker is running
docker --version
docker ps
```

### **Step 2: Start Shared Database**
```bash
# Navigate to shared database directory
cd shared-database

# Start the shared MySQL database
docker-compose up -d

# Wait for database to be ready (about 30 seconds)
docker-compose logs -f shared-user-db
```

### **Step 3: Configure Services**
```bash
# Copy environment configuration files
cp auth-service/.env.shared.example auth-service/.env
cp user-service/.env.shared.example user-service/.env

# Verify configuration
cat auth-service/.env
cat user-service/.env
```

### **Step 4: Start All Services**
```bash
# Start all services with Docker Compose
docker-compose -f docker-compose.services.yml up -d

# Check all services are running
docker-compose -f docker-compose.services.yml ps
```

### **Step 5: Access the Application**
- **React Admin Dashboard**: http://localhost:3000
- **Default Login**:
  - Email: `admin@example.com`
  - Password: `admin123`

## 🎯 **What You'll See**

### **React Admin Dashboard**
- Modern, responsive admin interface
- User management with role-based access
- Carrier and customer management
- Real-time service status monitoring

### **Available Services**
- **Auth Service**: http://localhost:3001 (Authentication & JWT)
- **User Service**: http://localhost:3003 (User management)
- **Carrier Service**: http://localhost:3004 (Carrier management)
- **Customer Service**: http://localhost:3005 (Customer management)
- **Pricing Service**: http://localhost:3006 (Pricing calculations)
- **Translation Service**: http://localhost:3007 (Internationalization)

## 🔧 **Development Mode**

### **Start Services Individually**
```bash
# Terminal 1: Auth Service
cd auth-service
npm install
npm run start:dev

# Terminal 2: User Service
cd user-service
npm install
npm run start:dev

# Terminal 3: React Admin
cd react-admin
npm install
npm start
```

### **Service URLs**
- **React Admin**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **User Service**: http://localhost:3003

## 🗄️ **Database Access**

### **Connect to Database**
```bash
# Connect to shared database
docker exec -it shared-user-database mysql -u shared_user -p shared_user_db

# Default credentials:
# Username: shared_user
# Password: shared_password_2024
# Database: shared_user_db
```

### **Default Data**
The database comes pre-populated with:
- **Default Admin User**: admin@example.com / admin123
- **Default Roles**: admin, user, editor, viewer
- **Sample Data**: Test users and configurations

## 🧪 **Testing the Setup**

### **Health Checks**
```bash
# Check all services are healthy
curl http://localhost:3001/api/v1/auth/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
curl http://localhost:3006/health
curl http://localhost:3007/health
```

### **API Testing**
```bash
# Test login API
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Test user list API (replace <token> with JWT from login)
curl -X GET http://localhost:3003/api/v1/users \
  -H "Authorization: Bearer <token>"
```

## 🐳 **Docker Commands**

### **Essential Commands**
```bash
# View running containers
docker ps

# View service logs
docker-compose -f shared-database/docker-compose.services.yml logs -f

# Restart a specific service
docker-compose -f shared-database/docker-compose.services.yml restart auth-service

# Stop all services
docker-compose -f shared-database/docker-compose.services.yml down

# Stop and remove volumes (clean slate)
docker-compose -f shared-database/docker-compose.services.yml down -v
```

### **Troubleshooting**
```bash
# Check container status
docker-compose -f shared-database/docker-compose.services.yml ps

# View detailed logs
docker-compose -f shared-database/docker-compose.services.yml logs auth-service

# Rebuild services
docker-compose -f shared-database/docker-compose.services.yml build --no-cache
```

## 🔍 **Verification Checklist**

- [ ] Docker Desktop is running
- [ ] Shared database is started and healthy
- [ ] All services are running (check `docker ps`)
- [ ] React Admin loads at http://localhost:3000
- [ ] Can login with admin@example.com / admin123
- [ ] User management page loads
- [ ] API health checks return 200 OK

## 🚨 **Common Issues**

### **Port Already in Use**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001
lsof -i :3306

# Kill the process
kill -9 <PID>
```

### **Database Connection Failed**
```bash
# Check database status
docker-compose logs shared-user-db

# Restart database
docker-compose restart shared-user-db

# Wait for database to be ready
docker-compose logs -f shared-user-db
```

### **Services Not Starting**
```bash
# Check service logs
docker-compose logs auth-service
docker-compose logs user-service

# Rebuild services
docker-compose build --no-cache
docker-compose up -d
```

## 📚 **Next Steps**

### **Explore the Application**
1. **User Management**: Create, edit, and manage users
2. **Role Management**: Assign roles and permissions
3. **Service Monitoring**: Check service health and status
4. **API Testing**: Use the built-in API testing tools

### **Development**
1. **Read Documentation**: Check `docs/` folder for detailed guides
2. **API Documentation**: Review `docs/api/README.md`
3. **Architecture**: Understand the system in `docs/architecture/README.md`
4. **Deployment**: Follow `docs/deployment/README.md` for production setup

### **Customization**
1. **Add New Services**: Follow the microservice pattern
2. **Modify Database Schema**: Update shared database schema
3. **Add Features**: Extend existing services with new functionality
4. **UI Customization**: Modify React Admin components

## 🆘 **Getting Help**

### **Documentation**
- **Main README**: `README.md`
- **Architecture**: `docs/architecture/README.md`
- **API Reference**: `docs/api/README.md`
- **Deployment**: `docs/deployment/README.md`

### **Troubleshooting**
- **Check Logs**: `docker-compose logs -f <service-name>`
- **Health Checks**: Verify all services are healthy
- **Database**: Ensure shared database is running
- **Ports**: Check for port conflicts

### **Support**
- Create an issue in the repository
- Check existing issues for solutions
- Review the troubleshooting section in deployment docs

---

**🎉 Congratulations! You now have a fully functional microservices application running locally.**
