# Kong Consumer Synchronization - Phase 1 Implementation Guide

## 🎯 Overview

This guide covers the **Phase 1** implementation of **Kong Consumer Synchronization** for the Auth Service. This implementation automatically creates and synchronizes Kong Gateway consumers when users register or login, enabling Role-Based Access Control (RBAC) at the API Gateway level.

---

## 📦 What Was Implemented

### 1. **Kong Integration Service** (`kong.service.ts`)
Located: `src/infrastructure/external-services/kong.service.ts`

**Features:**
- ✅ Create Kong consumers on user registration
- ✅ Update ACL groups on login (role synchronization)
- ✅ Delete Kong consumers when users are deleted
- ✅ Sync JWT credentials with shared secret
- ✅ Health check for Kong Admin API
- ✅ Error handling with detailed logging
- ✅ Configurable via environment variables

**Methods:**
```typescript
createKongConsumer(userId, username, roles)    // Creates consumer + ACL groups
updateKongConsumerGroups(userId, roles)         // Updates ACL group membership
deleteKongConsumer(userId)                      // Removes consumer from Kong
syncKongConsumerJWT(userId, username)          // Syncs JWT credential
healthCheck()                                   // Verifies Kong connectivity
```

---

### 2. **Auth Flow Integration**

#### **Register Flow** (RegisterUseCase)
```typescript
// After user creation in database:
await this.kongService.createKongConsumer(
  newUser.id!,
  newUser.email,
  newUser.roles || []
);
```

#### **Login Flow** (LoginUseCase)
```typescript
// After successful authentication:
await this.kongService.updateKongConsumerGroups(
  user.id!,
  user.roles || []
);
```

---

### 3. **Migration Script**
Located: `scripts/kong-migrate-users.ts`

**Purpose:** Sync all existing database users to Kong consumers

**Usage:**
```bash
npm run kong:migrate
```

**Features:**
- Fetches all users from database
- Creates Kong consumers with proper ACL groups
- Displays progress and summary
- Error handling per user (continues on failure)

---

### 4. **Environment Configuration**

Added to `.env.shared.example`:
```bash
# Kong Gateway Configuration
KONG_ADMIN_URL=http://localhost:8001
KONG_ADMIN_TOKEN=
KONG_SYNC_ENABLED=true
```

**Configuration Options:**
- `KONG_ADMIN_URL`: Kong Admin API endpoint (default: `http://localhost:8001`)
- `KONG_ADMIN_TOKEN`: Optional admin token for secured Kong instances
- `KONG_SYNC_ENABLED`: Toggle Kong synchronization (`true`/`false`)

---

## 🚀 Quick Start

### **Step 1: Update Environment Variables**

Copy `.env.shared.example` to `.env`:
```bash
cd auth-service
cp .env.shared.example .env
```

Edit `.env` and configure Kong:
```bash
KONG_ADMIN_URL=http://localhost:8001
KONG_SYNC_ENABLED=true
JWT_SECRET=your-shared-jwt-secret  # Must match Kong configuration
```

---

### **Step 2: Start Kong Gateway**

```bash
cd ../api-gateway
docker-compose -f docker-compose.kong.yml up -d
```

Wait for Kong to be ready:
```bash
curl http://localhost:8001/status
```

---

### **Step 3: Configure Kong JWT Plugin**

Run the JWT configuration script:
```bash
cd ../api-gateway
./configure-jwt.sh
```

This creates:
- JWT consumer: `auth-service-jwt`
- JWT credential with shared secret
- JWT plugin on all protected routes

---

### **Step 4: Start Auth Service**

```bash
cd ../auth-service
npm install  # Install axios dependency
npm run start:dev
```

---

### **Step 5: Migrate Existing Users**

```bash
npm run kong:migrate
```

Expected output:
```
🚀 Kong Consumer Migration Script
====================================

⏳ Checking Kong Gateway connection...
✅ Kong Gateway is accessible

📊 Fetching users from database...
Found 5 users

🔄 Starting migration...

Processing: admin@example.com (ID: 1)
✅ Success: admin@example.com
   Roles: admin

Processing: user@example.com (ID: 2)
✅ Success: user@example.com
   Roles: user

====================================
📈 Migration Summary
====================================
Total users:     5
✅ Successful:   5
❌ Failed:       0
====================================

🎉 All users successfully migrated to Kong!
```

---

## 🧪 Testing the Integration

### **Test 1: User Registration**

```bash
# Register a new user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Expected Behavior:**
1. User created in database
2. Kong consumer created automatically
3. ACL group `user` assigned
4. JWT credential synced

**Verify in Kong:**
```bash
# Check consumer exists
curl http://localhost:8001/consumers/test@example.com

# Check ACL groups
curl http://localhost:8001/consumers/test@example.com/acls
# Expected: { "group": "user" }
```

---

### **Test 2: User Login with Role Change**

Scenario: User's role is updated in database, login should sync ACL groups

```bash
# 1. Login with current role
TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"Test123!"}' | \
  jq -r '.data.access_token')

# 2. Manually update user role in database (admin assigns manager role)

# 3. Login again
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"Test123!"}'

# 4. Verify ACL groups updated
curl http://localhost:8001/consumers/test@example.com/acls
# Expected: { "group": "user" }, { "group": "manager" }
```

---

### **Test 3: Access Control via Kong**

```bash
# Admin user token
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"Admin123!"}' | \
  jq -r '.data.access_token')

# Regular user token
USER_TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"User123!"}' | \
  jq -r '.data.access_token')

# Test admin route (should succeed for admin)
curl http://localhost:8000/api/v1/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
# Expected: 200 OK + user list

# Test admin route (should fail for regular user)
curl http://localhost:8000/api/v1/users \
  -H "Authorization: Bearer $USER_TOKEN"
# Expected: 403 Forbidden (ACL plugin blocks)
```

---

## 🔍 Troubleshooting

### **Issue: Kong consumers not being created**

**Check 1: Kong sync enabled**
```bash
# In .env file
KONG_SYNC_ENABLED=true
```

**Check 2: Kong Admin API accessible**
```bash
curl http://localhost:8001/status
```

**Check 3: Auth Service logs**
```bash
docker logs auth-service -f | grep Kong
# Or in dev mode, check terminal output
```

Expected logs:
```
[KongService] Kong consumer created: test@example.com (ID: xxx)
[KongService] Kong consumer fully configured: test@example.com
```

---

### **Issue: JWT validation failing in Kong**

**Problem:** JWT tokens not being recognized by Kong Gateway

**Solution:** Ensure JWT secrets match

1. Check Auth Service JWT secret:
```bash
# auth-service/.env
JWT_SECRET=your-jwt-secret-key
```

2. Check Kong JWT credential:
```bash
curl http://localhost:8001/consumers/auth-service-jwt/jwt
# Verify "secret" field matches JWT_SECRET
```

3. Re-run JWT configuration:
```bash
cd api-gateway
./configure-jwt.sh
```

---

### **Issue: ACL groups not working**

**Problem:** Kong not enforcing ACL restrictions

**Check:** ACL plugin enabled on routes
```bash
# List plugins on a route (example: users-routes)
curl http://localhost:8001/routes/users-routes/plugins

# Should show ACL plugin with "allow": ["admin", "super_admin"]
```

**Solution:** Run ACL configuration
```bash
cd api-gateway
./configure-rbac.sh
```

---

## 📊 Monitoring & Logs

### **Kong Admin API Endpoints**

```bash
# List all consumers
curl http://localhost:8001/consumers

# Get consumer details
curl http://localhost:8001/consumers/user@example.com

# List consumer ACL groups
curl http://localhost:8001/consumers/user@example.com/acls

# List consumer JWT credentials
curl http://localhost:8001/consumers/user@example.com/jwt
```

---

### **Auth Service Logs**

Enable debug logging for Kong operations:

```typescript
// In WinstonLoggerService configuration
LOG_LEVEL=debug
```

Look for:
- `[KongService] Kong consumer created`
- `[KongService] ACL group 'role' added to consumer`
- `[KongService] JWT credential synced`
- `[KongService] Kong ACL groups updated`

---

## 🎯 Next Steps

### **Phase 2: JWT-Based ACL Enforcement** (Next)
- [ ] Update JWT token structure with roles/permissions
- [ ] Configure Kong JWT plugin to extract claims
- [ ] Configure Kong ACL plugin per route
- [ ] Add Request Transformer to forward user context

### **Phase 3: Permission-Based Access Control** (Future)
- [ ] Create custom Kong plugin for permissions
- [ ] Define permission constants
- [ ] Update permission system in Auth Service
- [ ] Create permission middleware for backend services

---

## 📚 Architecture Decisions

### **Why Kong Consumer Sync?**

**Option 1: Database-only roles** ❌
- Every request requires database lookup
- Higher latency
- Database bottleneck

**Option 2: Kong consumers with ACL** ✅ **CHOSEN**
- Role validation at gateway (edge)
- No database lookup per request
- Scales horizontally with Kong
- Centralized access control

### **When is Kong Synced?**

| Event | Action | Reason |
|-------|--------|--------|
| User Registration | Create consumer + ACL groups | New user needs gateway access |
| User Login | Update ACL groups | Roles may have changed since last login |
| User Deletion | Delete consumer | Clean up Kong resources |
| Role Assignment | (Future) Update ACL groups | Admin changes user roles |

### **Error Handling Strategy**

Kong sync failures **DO NOT** block user operations:
- Registration succeeds even if Kong sync fails
- Login succeeds even if ACL update fails
- Errors logged for monitoring
- Next login/migration will retry sync

**Rationale:** User experience > perfect synchronization. Kong can be repaired via migration script.

---

## 🔐 Security Considerations

1. **JWT Secret**: Must be shared between Auth Service and Kong
   - Store in environment variables
   - Rotate periodically
   - Never commit to repository

2. **Kong Admin API**: Should be protected in production
   - Enable RBAC for Kong Admin API
   - Use `KONG_ADMIN_TOKEN` for authentication
   - Restrict network access to Admin API

3. **Consumer Custom IDs**: Use `user-{userId}` format
   - Prevents username collisions
   - Allows user email changes
   - Simplifies lookups

---

## 🎉 Summary

**Phase 1 Complete!**

✅ **Implemented:**
- Kong Service with full consumer lifecycle management
- Automatic synchronization on register/login
- Migration script for existing users
- Comprehensive error handling and logging
- Environment-based configuration

✅ **Benefits:**
- Users automatically get Kong consumers
- Roles synced to ACL groups
- Foundation for gateway-level RBAC
- Ready for Phase 2 (JWT + ACL enforcement)

✅ **What's Working:**
- User registration → Kong consumer created
- User login → ACL groups updated
- Existing users → Can be migrated via script
- Kong health checks → Monitor connectivity

**Total Effort:** ~4-5 hours ✅ (On target!)

---

## 📞 Support

**Issues?** Check:
1. Kong Gateway running: `curl http://localhost:8001/status`
2. Environment variables set in `.env`
3. Auth Service logs: Look for `[KongService]` entries
4. Migration script output: `npm run kong:migrate`

**Still stuck?** Review troubleshooting section above or check Kong Admin API directly.

---

**Next:** Ready for **Phase 2: JWT-Based ACL Enforcement** 🚀
