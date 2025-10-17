# 🏗️ Hybrid Database Architecture Implementation

## 📋 **Overview**

This document outlines the implementation of a **Hybrid Database Architecture** that combines the benefits of both shared and separate databases based on data coupling and service relationships.

## 🎯 **Architecture Decision**

### **Hybrid Approach:**
- **Shared Database**: Auth + User services (tightly coupled)
- **Separate Databases**: Business services (loosely coupled)
- **Shared Redis**: All services for caching and session management

## 🗄️ **Database Strategy**

### **Phase 1: Keep Current Shared Database (Auth + User)**
```sql
-- Keep this shared database (already working well)
shared_user_db:3306
├── users (Auth + User services)
├── roles (Auth + User services)
└── user_roles (Auth + User services)
```

### **Phase 2: Separate Databases for Business Services**
```sql
-- Standardize these to use separate databases
customer_service_db:3309
├── customers (with user_id reference to shared_user_db.users.id)
└── customer-specific tables

carrier_service_db:3310
├── carriers (independent)
└── carrier-specific tables

pricing_service_db:3311
├── pricing_rules (independent)
└── pricing-specific tables
```

## 🔄 **Cross-Service Communication Patterns**

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

## 🐳 **Docker Configuration Strategy**

### **Shared Infrastructure**
```yaml
# All services use shared Redis
REDIS_HOST: shared-redis
REDIS_PORT: 6379
REDIS_PASSWORD: shared_redis_password_2024
```

### **Database Configuration**
```yaml
# Auth + User Services (Shared Database)
DB_HOST: shared-database
DB_PORT: 3306
DB_NAME: shared_user_db
DB_USERNAME: shared_user
DB_PASSWORD: shared_password_2024

# Business Services (Separate Databases)
DB_HOST: customer-service-db
DB_PORT: 3306
DB_NAME: customer_service_db
DB_USERNAME: customer_user
DB_PASSWORD: customer_password
```

## 📊 **Benefits of Hybrid Approach**

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

## 🚀 **Implementation Plan**

### **Step 1: Document Current State** ✅
- Analyze current database configurations
- Document data relationships
- Plan migration strategy

### **Step 2: Standardize Business Services**
- Update Customer Service to use separate database
- Update Carrier Service to use separate database
- Update Pricing Service to use separate database

### **Step 3: Update Docker Configurations**
- Standardize Docker Compose files
- Update environment variables
- Configure shared networks

### **Step 4: Implement Cross-Service Communication**
- Create service-to-service communication patterns
- Implement event-driven architecture
- Add proper error handling

### **Step 5: Update Environment Configurations**
- Standardize environment variable names
- Create consistent configuration templates
- Update documentation

### **Step 6: Testing and Validation**
- Test all services working together
- Validate cross-service communication
- Performance testing

## 🔧 **Technical Implementation**

### **Database Schema Design**
```sql
-- Shared Database (Auth + User)
CREATE DATABASE shared_user_db;
USE shared_user_db;

-- Users table (shared between Auth and User services)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    -- ... other user fields
);

-- Roles table (shared between Auth and User services)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSON,
    -- ... other role fields
);

-- User-Roles junction table
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    -- ... other fields
);
```

```sql
-- Customer Service Database
CREATE DATABASE customer_service_db;
USE customer_service_db;

-- Customers table (references shared_user_db.users.id)
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- References shared_user_db.users.id
    company_name VARCHAR(255),
    -- ... other customer fields
    -- Note: No foreign key constraint to shared database
);
```

### **Service Configuration**
```typescript
// Customer Service Configuration
export const CUSTOMER_DB_CONFIG = {
  host: process.env.DB_HOST || 'customer-service-db',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'customer_service_db',
  username: process.env.DB_USERNAME || 'customer_user',
  password: process.env.DB_PASSWORD || 'customer_password',
};

// Shared Redis Configuration
export const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'shared-redis',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || 'shared_redis_password_2024',
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'customer',
};
```

## 📈 **Migration Strategy**

### **Phase 1: Preparation**
1. Create separate databases for business services
2. Update Docker configurations
3. Test database connectivity

### **Phase 2: Service Updates**
1. Update Customer Service configuration
2. Update Carrier Service configuration
3. Update Pricing Service configuration

### **Phase 3: Cross-Service Communication**
1. Implement service-to-service communication
2. Add event-driven patterns
3. Test data flow between services

### **Phase 4: Validation**
1. End-to-end testing
2. Performance validation
3. Documentation updates

## 🎯 **Success Criteria**

### **✅ Technical Goals:**
- [ ] All services running with hybrid database architecture
- [ ] Cross-service communication working properly
- [ ] Shared Redis functioning for all services
- [ ] Docker configurations standardized
- [ ] Environment variables consistent

### **✅ Operational Goals:**
- [ ] 60% reduction in database count (5 → 2)
- [ ] Shared Redis for all services
- [ ] Simplified backup strategy
- [ ] Consistent monitoring setup
- [ ] Clear documentation

### **✅ Performance Goals:**
- [ ] No performance degradation
- [ ] Efficient cross-service communication
- [ ] Proper caching implementation
- [ ] Scalable architecture

## 📚 **Documentation Updates**

### **Files to Update:**
- [ ] `README.md` - Update architecture overview
- [ ] `docs/architecture/` - Update architecture diagrams
- [ ] Service-specific README files
- [ ] Docker Compose documentation
- [ ] Environment configuration guides

## 🔄 **Next Steps**

1. **Start Implementation**: Begin with Customer Service database separation
2. **Update Configurations**: Standardize Docker and environment configs
3. **Implement Communication**: Add cross-service communication patterns
4. **Test and Validate**: Ensure all services work together
5. **Document Results**: Update all documentation

---

**This hybrid approach provides the optimal balance between data consistency, service independence, and operational efficiency for your microservices architecture.**
