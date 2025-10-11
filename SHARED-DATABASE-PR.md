# 🔄 Pull Request: Shared Database Architecture Implementation

## 📋 **Summary**

This PR implements a shared database architecture for the Auth and User microservices, eliminating data duplication and sync issues by having both services use the same MySQL database.

## 🎯 **Problem Statement**

**Current Issues:**
- Auth Service and User Service use separate databases
- Data duplication between services
- Sync issues when user data changes
- Complex inter-service communication for user data
- Inconsistent data across services

## ✅ **Solution**

**Shared Database Architecture:**
- Single MySQL database (`shared_user_db`) on port 3306
- Both Auth and User services connect to the same database
- Shared schema with `users`, `roles`, and `user_roles` tables
- Eliminates data duplication and sync issues

## 🔧 **Changes Made**

### **Database Configuration**
- **Port**: Changed from separate ports (7777, 3308) to shared port 3306
- **Database**: `shared_user_db` (instead of separate `auth_service_db` and `user_service_db`)
- **User**: `shared_user` with password `shared_password_2024`

### **Services Updated**
- **Auth Service**: Updated `.env` to use shared database configuration
- **User Service**: Updated `.env` to use shared database configuration
- Both services now use identical database connection settings

### **Docker Configuration**
- `shared-database/docker-compose.yml`: Database setup with initialization scripts
- `shared-database/docker-compose.services.yml`: Complete services setup
- `shared-database/init/01-init-shared-database.sql`: Database schema and default data

### **Documentation**
- `shared-database/README.md`: Complete setup and usage instructions
- Environment example files for both services

## 🗄️ **Database Schema**

```sql
-- Users table (shared between services)
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

## 🚀 **Benefits**

1. **✅ Single Source of Truth** - No duplicate user data
2. **✅ No Sync Issues** - Changes immediately available to both services
3. **✅ Better Performance** - No cross-service API calls for user data
4. **✅ Simpler Architecture** - Less complexity and maintenance
5. **✅ Consistent Data** - No data inconsistencies between services
6. **✅ Easier Testing** - Single database to manage and test

## 🧪 **Testing**

### **Default Admin User**
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: `admin`

### **Test Steps**
1. Start shared database: `docker-compose up -d`
2. Start Auth Service: `npm run start:dev`
3. Start User Service: `npm run start:dev`
4. Test login with default admin user
5. Verify user data accessible from both services

## 📋 **Migration Guide**

### **For Developers**
1. **Start Docker Desktop**
2. **Start Shared Database**:
   ```bash
   cd shared-database
   docker-compose up -d
   ```
3. **Update Environment Files**:
   ```bash
   # Copy example files
   cp auth-service/.env.shared.example auth-service/.env
   cp user-service/.env.shared.example user-service/.env
   ```
4. **Start Services**:
   ```bash
   # Auth Service
   cd auth-service && npm run start:dev
   
   # User Service (in another terminal)
   cd user-service && npm run start:dev
   ```

### **For Production**
1. Update environment variables to use shared database
2. Run database migrations
3. Deploy services with new configuration
4. Verify data consistency

## ⚠️ **Breaking Changes**

- **Auth Service**: Database port changed from 7777 to 3306
- **User Service**: Database port changed from 3308 to 3306
- **Database Names**: Changed from service-specific to shared database
- **Environment Variables**: Updated database connection settings

## 🔄 **Rollback Plan**

If issues occur, rollback by:
1. Revert environment files to original configuration
2. Start individual service databases
3. Restart services with original configuration

## 📊 **Performance Impact**

- **Positive**: Eliminates cross-service API calls for user data
- **Positive**: Reduces network latency for user operations
- **Neutral**: Database load distributed across services
- **Positive**: Simplified data access patterns

## 🔒 **Security Considerations**

- Shared database credentials are environment-specific
- Database access controlled by service-level permissions
- No change in authentication/authorization logic
- Same security model, just shared data storage

## 📈 **Future Enhancements**

- Add database connection pooling
- Implement read replicas for scaling
- Add database monitoring and alerting
- Consider database sharding for large scale

## ✅ **Checklist**

- [x] Database schema created and tested
- [x] Auth Service configuration updated
- [x] User Service configuration updated
- [x] Docker configuration created
- [x] Documentation written
- [x] Example environment files created
- [x] Default admin user configured
- [x] Migration guide provided
- [x] Breaking changes documented
- [x] Rollback plan defined

## 🎯 **Ready for Review**

This PR is ready for review and testing. The shared database architecture provides significant benefits in terms of data consistency, performance, and maintainability while solving the core issues of data duplication and sync problems between the Auth and User services.
