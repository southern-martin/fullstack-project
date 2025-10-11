# 🔄 Redis Migration Plan: Individual → Shared Redis

## 📊 **Current State Analysis**

### **Current Setup:**
- **Auth Service**: Individual Redis (port 6379)
- **User Service**: Individual Redis (port 6380) 
- **Main NestJS**: No Redis or individual Redis

### **Resource Usage:**
- **Individual Redis**: ~50MB RAM per instance × 3 = 150MB
- **Shared Redis**: ~50MB RAM total
- **Savings**: 100MB RAM + CPU resources

## 🎯 **Migration Strategy**

### **Phase 1: Setup Shared Redis** ⭐ **RECOMMENDED**

1. **Start Shared Redis Service**
   ```bash
   cd shared-redis
   docker-compose up -d
   ```

2. **Benefits:**
   - ✅ **Resource Efficiency**: 100MB RAM savings
   - ✅ **Simplified Operations**: One Redis to manage
   - ✅ **Cost Effective**: Lower infrastructure costs
   - ✅ **Cross-Service Caching**: Services can share data
   - ✅ **Centralized Monitoring**: Redis Commander UI

### **Phase 2: Update Service Configurations**

#### **Auth Service Updates:**
```yaml
# auth-service/docker-compose.yml
environment:
  REDIS_HOST: shared-redis
  REDIS_PORT: 6379
  REDIS_PASSWORD: shared_redis_password_2024
  REDIS_KEY_PREFIX: auth
```

#### **User Service Updates:**
```yaml
# user-service/docker-compose.yml
environment:
  REDIS_HOST: shared-redis
  REDIS_PORT: 6379
  REDIS_PASSWORD: shared_redis_password_2024
  REDIS_KEY_PREFIX: user
```

### **Phase 3: Key Namespacing Strategy**

#### **Auth Service Keys:**
```
auth:session:{userId}     # User sessions
auth:token:{tokenId}      # JWT tokens
auth:refresh:{userId}     # Refresh tokens
auth:attempts:{email}     # Login attempts
```

#### **User Service Keys:**
```
user:profile:{userId}     # User profiles cache
user:roles:{userId}       # User roles cache
user:permissions:{userId} # User permissions cache
user:search:{query}       # Search results cache
```

#### **Shared Keys:**
```
shared:config:app         # Application configuration
shared:cache:translations # Translation cache
shared:metrics:services   # Service metrics
```

## 🚀 **Implementation Steps**

### **Step 1: Start Shared Redis**
```bash
cd /opt/cursor-project/fullstack-project/shared-redis
docker-compose up -d
```

### **Step 2: Test Shared Redis**
```bash
# Test Redis connection
docker exec -it southern-martin-shared-redis redis-cli ping

# Access Redis Commander
open http://localhost:8081
# Username: admin, Password: admin123
```

### **Step 3: Update Auth Service**
```bash
# Update auth-service/.env
REDIS_HOST=shared-redis
REDIS_PORT=6379
REDIS_PASSWORD=shared_redis_password_2024
REDIS_KEY_PREFIX=auth
```

### **Step 4: Update User Service**
```bash
# Update user-service/.env
REDIS_HOST=shared-redis
REDIS_PORT=6379
REDIS_PASSWORD=shared_redis_password_2024
REDIS_KEY_PREFIX=user
```

### **Step 5: Remove Individual Redis**
```bash
# Remove Redis from auth-service/docker-compose.yml
# Remove Redis from user-service/docker-compose.yml
```

## 📈 **Benefits Comparison**

| Aspect | Individual Redis | Shared Redis |
|--------|------------------|--------------|
| **Memory Usage** | 150MB (3 instances) | 50MB (1 instance) |
| **CPU Usage** | High (3 processes) | Low (1 process) |
| **Management** | Complex (3 to manage) | Simple (1 to manage) |
| **Monitoring** | 3 separate instances | 1 centralized instance |
| **Backup** | 3 separate backups | 1 centralized backup |
| **Scaling** | Individual scaling | Centralized scaling |
| **Cost** | High | Low |
| **Data Sharing** | Not possible | Possible |
| **Fault Tolerance** | High (isolated) | Medium (shared) |

## 🔒 **Security Considerations**

### **Shared Redis Security:**
- ✅ **Password Protection**: `shared_redis_password_2024`
- ✅ **Key Namespacing**: Prevents key conflicts
- ✅ **Network Isolation**: Docker network isolation
- ✅ **Access Control**: Redis Commander authentication

### **Risk Mitigation:**
- **Single Point of Failure**: Mitigated by Redis clustering (future)
- **Key Conflicts**: Prevented by namespacing
- **Security**: Enhanced with authentication and network isolation

## 🛠️ **Code Examples**

### **Auth Service Redis Integration:**
```typescript
// Cache user session
await redis.setex(`auth:session:${userId}`, 3600, JSON.stringify(sessionData));

// Get user session
const session = await redis.get(`auth:session:${userId}`);
```

### **User Service Redis Integration:**
```typescript
// Cache user profile
await redis.setex(`user:profile:${userId}`, 1800, JSON.stringify(userProfile));

// Get user profile
const profile = await redis.get(`user:profile:${userId}`);
```

### **Shared Configuration:**
```typescript
// Cache application configuration
await redis.setex(`shared:config:app`, 86400, JSON.stringify(appConfig));

// Get application configuration
const config = await redis.get(`shared:config:app`);
```

## 📊 **Monitoring & Management**

### **Redis Commander (Web UI):**
- **URL**: http://localhost:8081
- **Features**: Real-time monitoring, key management, performance metrics
- **Authentication**: admin/admin123

### **Health Checks:**
```bash
# Redis health
curl http://localhost:6379/ping

# Redis Commander health
curl http://localhost:8081
```

## 🎯 **Recommendation**

**I strongly recommend implementing the Shared Redis approach** because:

1. **Resource Efficiency**: 100MB RAM savings
2. **Operational Simplicity**: One Redis to manage
3. **Cost Effectiveness**: Lower infrastructure costs
4. **Enhanced Functionality**: Cross-service data sharing
5. **Better Monitoring**: Centralized Redis Commander UI

The benefits far outweigh the risks, especially for a development environment. For production, you can always implement Redis clustering for high availability.

## 🚀 **Next Steps**

1. **Start Shared Redis**: `cd shared-redis && docker-compose up -d`
2. **Test Connectivity**: Verify Redis Commander works
3. **Update Services**: Modify service configurations
4. **Remove Individual Redis**: Clean up old Redis instances
5. **Test Integration**: Verify all services work with shared Redis

Would you like me to help you implement this migration?

