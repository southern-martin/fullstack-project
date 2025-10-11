# 🔄 Shared Redis Service

A centralized Redis service for all microservices with proper namespacing and security.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │    │   User Service  │    │  Other Services │
│                 │    │                 │    │                 │
│ auth:session:*  │    │ user:cache:*    │    │ service:data:*  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     Shared Redis          │
                    │   (Port 6379)             │
                    │                           │
                    │ • auth:session:*          │
                    │ • user:cache:*            │
                    │ • service:data:*          │
                    │ • shared:config:*         │
                    └───────────────────────────┘
```

## 🚀 Quick Start

### 1. Start Shared Redis

```bash
cd shared-redis
docker-compose up -d
```

### 2. Monitor Redis (CLI)

```bash
# Connect to Redis CLI
docker exec -it southern-martin-shared-redis redis-cli -a shared_redis_password_2024

# View all keys
keys *

# View keys by namespace
keys auth:*
keys user:*
keys shared:*
```

### 3. Connect Services

Update your service configurations to use the shared Redis:

```bash
# Redis Connection Details
REDIS_HOST=shared-redis
REDIS_PORT=6379
REDIS_PASSWORD=shared_redis_password_2024
```

## 🔑 Key Namespacing Strategy

### **Auth Service Keys**
```
auth:session:{userId}     # User sessions
auth:token:{tokenId}      # JWT tokens
auth:refresh:{userId}     # Refresh tokens
auth:attempts:{email}     # Login attempts
```

### **User Service Keys**
```
user:profile:{userId}     # User profiles cache
user:roles:{userId}       # User roles cache
user:permissions:{userId} # User permissions cache
user:search:{query}       # Search results cache
```

### **Shared Keys**
```
shared:config:app         # Application configuration
shared:cache:translations # Translation cache
shared:metrics:services   # Service metrics
shared:health:services    # Health check results
```

## 🛠️ Service Integration

### **Auth Service Configuration**

```typescript
// auth-service/.env
REDIS_HOST=shared-redis
REDIS_PORT=6379
REDIS_PASSWORD=shared_redis_password_2024
REDIS_KEY_PREFIX=auth
```

### **User Service Configuration**

```typescript
// user-service/.env
REDIS_HOST=shared-redis
REDIS_PORT=6379
REDIS_PASSWORD=shared_redis_password_2024
REDIS_KEY_PREFIX=user
```

## 📊 Benefits

### **Resource Efficiency**
- Single Redis instance: ~50MB RAM
- Multiple Redis instances: ~150MB RAM (3 services)
- **Savings**: 100MB RAM + CPU resources

### **Operational Benefits**
- Single Redis to monitor and backup
- Centralized logging and metrics
- Easier scaling and maintenance

### **Development Benefits**
- Shared cache for cross-service data
- Centralized configuration management
- Easier debugging with Redis Commander

## 🔒 Security Features

- **Password Protection**: `shared_redis_password_2024`
- **Key Namespacing**: Prevents key conflicts
- **Network Isolation**: Services communicate via Docker network
- **Access Control**: Redis Commander with authentication

## 📈 Monitoring

### **Redis CLI Monitoring**
```bash
# Connect to Redis
docker exec -it southern-martin-shared-redis redis-cli -a shared_redis_password_2024

# Monitor memory usage
info memory

# Monitor performance
info stats

# View all keys
keys *

# Monitor key expiration
ttl key_name
```

### **Health Checks**
```bash
# Check Redis health
docker exec southern-martin-shared-redis redis-cli -a shared_redis_password_2024 ping
```

## 🔧 Management Commands

```bash
# Start shared Redis
docker-compose up -d

# View logs
docker-compose logs -f shared-redis

# Stop services
docker-compose down

# Clean up (remove volumes)
docker-compose down -v
```

## 🚨 Migration Strategy

### **Phase 1: Setup Shared Redis**
1. Start shared Redis service
2. Test connectivity from all services

### **Phase 2: Update Service Configurations**
1. Update Auth Service to use shared Redis
2. Update User Service to use shared Redis
3. Test functionality

### **Phase 3: Remove Individual Redis**
1. Remove individual Redis from docker-compose files
2. Clean up unused volumes
3. Update documentation

## 📝 Best Practices

1. **Always use key prefixes** to avoid conflicts
2. **Set appropriate TTL** for cached data
3. **Monitor memory usage** regularly
4. **Backup Redis data** periodically
5. **Use Redis Commander** for debugging

## 🔗 Integration Examples

### **Auth Service Integration**
```typescript
// Cache user session
await redis.setex(`auth:session:${userId}`, 3600, JSON.stringify(sessionData));

// Get user session
const session = await redis.get(`auth:session:${userId}`);
```

### **User Service Integration**
```typescript
// Cache user profile
await redis.setex(`user:profile:${userId}`, 1800, JSON.stringify(userProfile));

// Get user profile
const profile = await redis.get(`user:profile:${userId}`);
```

This shared Redis approach provides the best balance of efficiency, maintainability, and functionality for your microservices architecture.
