# 🏗️ Hybrid Database Architecture - Complete Guide

## 📋 **Overview**

This project implements a **Hybrid Database Architecture** that combines the benefits of both shared and separate databases based on data coupling and service relationships.

## 🎯 **Architecture Decision**

### **Hybrid Approach:**
- **Shared Database**: Auth + User services (tightly coupled)
- **Separate Databases**: Business services (loosely coupled)
- **Shared Redis**: All services for caching and session management

## 🗄️ **Database Strategy**

### **Phase 1: Shared Database (Auth + User)**
```sql
-- Shared database for tightly coupled services
shared_user_db:3306
├── users (Auth + User services)
├── roles (Auth + User services)
└── user_roles (Auth + User services)
```

### **Phase 2: Separate Databases (Business Services)**
```sql
-- Separate databases for loosely coupled services
customer_service_db:3309
├── customers (with user_id reference)
└── customer-specific tables

carrier_service_db:3310
├── carriers (independent)
└── carrier-specific tables

pricing_service_db:3311
├── pricing_rules (independent)
└── pricing-specific tables
```

## 🚀 **Quick Start**

### **1. Prerequisites**
- Docker Desktop running
- Node.js 18+ installed
- Git installed

### **2. Clone and Setup**
```bash
# Clone the repository
git clone <repository-url>
cd fullstack-project

# Run the hybrid setup script
./scripts/setup/hybrid-setup.sh
```

### **3. Access Services**
- **React Admin**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **User Service**: http://localhost:3003
- **Customer Service**: http://localhost:3004
- **Carrier Service**: http://localhost:3005
- **Pricing Service**: http://localhost:3006

### **4. Default Login**
- **Email**: admin@example.com
- **Password**: admin123

## 🐳 **Docker Configuration**

### **Start All Services**
```bash
# Start the hybrid architecture
docker-compose -f docker-compose.hybrid.yml up -d

# View logs
docker-compose -f docker-compose.hybrid.yml logs -f

# Check status
docker-compose -f docker-compose.hybrid.yml ps
```

### **Stop Services**
```bash
# Stop all services
docker-compose -f docker-compose.hybrid.yml down

# Stop and remove volumes
docker-compose -f docker-compose.hybrid.yml down -v
```

## 🔄 **Cross-Service Communication**

### **1. User Data Access**
```typescript
// Customer Service needs user data
const user = await userService.getUser(customer.userId);

// Carrier Service needs user data
const user = await userService.getUser(carrier.ownerId);
```

### **2. Customer Data Access**
```typescript
// Pricing Service needs customer data
const customer = await customerService.getCustomer(pricing.customerId);
```

### **3. Event-Driven Communication**
```typescript
// User created event
userService.publishEvent('user.created', { userId, email, firstName, lastName });

// Customer Service subscribes
customerService.subscribe('user.created', (event) => {
  // Create customer profile for new user
});
```

## 📊 **Service Architecture**

### **Core Services (Shared Database)**
- **Auth Service** (Port 3001): Authentication and authorization
- **User Service** (Port 3003): User management and profiles

### **Business Services (Separate Databases)**
- **Customer Service** (Port 3004): Customer data management
- **Carrier Service** (Port 3005): Carrier/shipping management
- **Pricing Service** (Port 3006): Pricing calculations

### **Shared Infrastructure**
- **Shared Database** (Port 3306): MySQL for Auth + User services
- **Shared Redis** (Port 6379): Caching and session management

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Copy the hybrid environment template
cp hybrid-environment.example .env

# Edit the configuration
nano .env
```

### **Key Configuration Areas**
- **Database Settings**: Connection strings and credentials
- **Redis Settings**: Caching configuration
- **Service URLs**: Inter-service communication
- **Security Settings**: JWT secrets and CORS
- **Monitoring**: Health checks and metrics

## 📈 **Benefits of Hybrid Approach**

### **✅ Advantages:**
1. **Optimal Data Coupling**: Shared database for tightly coupled services
2. **Service Independence**: Separate databases for business services
3. **Operational Efficiency**: 2 databases instead of 5 (60% reduction)
4. **Shared Redis**: All services use same caching infrastructure
5. **Future Flexibility**: Business services can evolve independently
6. **Simplified Management**: Core user data in one place

### **✅ Resource Optimization:**
- **Database Reduction**: 5 → 2 databases (60% reduction)
- **Redis Sharing**: All services use shared Redis
- **Memory Savings**: ~150MB RAM savings
- **Simplified Backup**: 2 databases to backup instead of 5

## 🧪 **Testing**

### **Health Checks**
```bash
# Check all service health
curl http://localhost:3001/api/v1/health  # Auth Service
curl http://localhost:3003/api/v1/health  # User Service
curl http://localhost:3004/api/v1/health  # Customer Service
curl http://localhost:3005/api/v1/health  # Carrier Service
curl http://localhost:3006/api/v1/health  # Pricing Service
```

### **Database Connectivity**
```bash
# Connect to shared database
docker exec -it shared-user-database mysql -u shared_user -p shared_user_db

# Connect to customer database
docker exec -it customer-service-db mysql -u customer_user -p customer_service_db

# Connect to Redis
docker exec -it shared-redis redis-cli -a shared_redis_password_2024
```

## 🔍 **Monitoring and Debugging**

### **View Logs**
```bash
# All services
docker-compose -f docker-compose.hybrid.yml logs -f

# Specific service
docker-compose -f docker-compose.hybrid.yml logs -f auth-service

# Database logs
docker-compose -f docker-compose.hybrid.yml logs -f shared-user-db
```

### **Check Service Status**
```bash
# Service status
docker-compose -f docker-compose.hybrid.yml ps

# Resource usage
docker stats

# Network connectivity
docker network ls
docker network inspect fullstack-project-hybrid-network
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Services Not Starting**
```bash
# Check Docker status
docker info

# Check logs
docker-compose -f docker-compose.hybrid.yml logs

# Restart services
docker-compose -f docker-compose.hybrid.yml restart
```

#### **2. Database Connection Issues**
```bash
# Check database status
docker-compose -f docker-compose.hybrid.yml ps | grep db

# Check database logs
docker-compose -f docker-compose.hybrid.yml logs shared-user-db

# Test database connection
docker exec -it shared-user-database mysql -u shared_user -p
```

#### **3. Redis Connection Issues**
```bash
# Check Redis status
docker-compose -f docker-compose.hybrid.yml ps | grep redis

# Test Redis connection
docker exec -it shared-redis redis-cli -a shared_redis_password_2024 ping
```

#### **4. Port Conflicts**
```bash
# Check port usage
netstat -tulpn | grep :3001
netstat -tulpn | grep :3306

# Stop conflicting services
sudo lsof -ti:3001 | xargs kill -9
```

## 📚 **Documentation**

### **Architecture Documents**
- [Hybrid Database Architecture](./HYBRID-DATABASE-ARCHITECTURE.md)
- [Service Architecture](./docs/architecture/)
- [API Documentation](./docs/api/)

### **Service-Specific Documentation**
- [Auth Service](./auth-service/README.md)
- [User Service](./user-service/README.md)
- [Customer Service](./customer-service/README.md)
- [Carrier Service](./carrier-service/README.md)
- [Pricing Service](./pricing-service/README.md)

## 🔄 **Migration from Previous Architecture**

### **From Monolithic to Hybrid**
1. **Backup Data**: Export existing data
2. **Update Configuration**: Use hybrid environment variables
3. **Start Services**: Use hybrid Docker Compose
4. **Test Functionality**: Verify all services work
5. **Update Documentation**: Update service documentation

### **From Separate Databases to Hybrid**
1. **Keep Business Services**: Already using separate databases
2. **Update Auth + User**: Use shared database
3. **Update Redis**: Use shared Redis
4. **Test Integration**: Verify cross-service communication

## 🎯 **Best Practices**

### **Development**
1. **Use Environment Variables**: Never hardcode configuration
2. **Test Locally**: Use Docker Compose for local development
3. **Monitor Logs**: Check service logs regularly
4. **Health Checks**: Implement proper health check endpoints

### **Production**
1. **Use Secrets Management**: Store sensitive data securely
2. **Enable Monitoring**: Use proper monitoring and alerting
3. **Backup Strategy**: Implement regular database backups
4. **Security**: Use proper authentication and authorization

## 🚀 **Next Steps**

### **Immediate Tasks**
1. **Test the Setup**: Verify all services work correctly
2. **Update Documentation**: Keep documentation current
3. **Monitor Performance**: Check resource usage and performance
4. **Plan Scaling**: Consider horizontal scaling strategies

### **Future Enhancements**
1. **API Gateway**: Implement API gateway for routing
2. **Service Mesh**: Add service mesh for advanced networking
3. **Monitoring**: Implement comprehensive monitoring
4. **CI/CD**: Set up automated deployment pipelines

## 📞 **Support**

### **Getting Help**
1. **Check Documentation**: Review all documentation first
2. **Check Logs**: Look at service logs for errors
3. **Check Issues**: Look for similar issues in the repository
4. **Create Issue**: Create a new issue with detailed information

### **Contributing**
1. **Fork Repository**: Create your own fork
2. **Create Branch**: Create a feature branch
3. **Make Changes**: Implement your changes
4. **Test Changes**: Ensure all tests pass
5. **Submit PR**: Create a pull request

---

**This hybrid approach provides the optimal balance between data consistency, service independence, and operational efficiency for your microservices architecture.**
