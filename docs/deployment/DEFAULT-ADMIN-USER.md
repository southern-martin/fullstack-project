# Default Admin User - Setup Complete

## 📋 Admin Credentials

**Email**: `admin@example.com`  
**Password**: `Admin123!`  
**Role**: `admin`

## ✅ What Was Done

1. **Created Default Roles**:
   - `admin` - Administrator with full access (users.manage, roles.manage, system.admin)
   - `user` - Regular user with basic access (users.read, profile.manage)
   - `moderator` - Moderator with limited admin access (users.read, users.update, content.moderate)

2. **Created Admin User**:
   - Email: admin@example.com
   - Password: Admin123! (bcrypt hashed: `$2b$10$/fk1WPB9sJhZ8WnVCGq8IeZp/KfCwJzYWEoYNTabR26NapcQH4jb6`)
   - First Name: Admin
   - Last Name: User
   - Phone: +1234567890
   - Status: Active & Email Verified
   - Assigned Role: admin (ID: 1)

3. **Verified Login**:
   - ✅ Auth Service login successful (http://localhost:3001/api/v1/auth/login)
   - ✅ User Service data retrieval successful (http://localhost:3003/api/v1/users/email/admin@example.com)
   - ✅ JWT token generated with admin permissions
   - ✅ User ID: 401

## 🧪 Test Login

### Via Auth Service API:
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "Admin123!"}'
```

### Expected Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 401,
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "roles": [
      {
        "id": 1,
        "name": "admin",
        "permissions": ["users.manage", "roles.manage", "system.admin"]
      }
    ]
  },
  "expiresIn": "86400000"
}
```

## 🔄 Recreating the Admin User

If you need to recreate the admin user:

### 1. Generate Password Hash:
```bash
docker exec user-service node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Admin123!', 10).then(hash => console.log(hash));"
```

### 2. Insert Roles:
```bash
docker exec shared-user-database mysql -u shared_user -pshared_password_2024 shared_user_db -e "
INSERT IGNORE INTO roles (id, name, description, permissions, is_active, created_at, updated_at) VALUES
(1, 'admin', 'Administrator with full access', '[\"users.manage\",\"roles.manage\",\"system.admin\"]', 1, NOW(), NOW()),
(2, 'user', 'Regular user with basic access', '[\"users.read\",\"profile.manage\"]', 1, NOW(), NOW()),
(3, 'moderator', 'Moderator with limited admin access', '[\"users.read\",\"users.update\",\"content.moderate\"]', 1, NOW(), NOW());
"
```

### 3. Insert Admin User:
```bash
docker exec shared-user-database mysql -u shared_user -pshared_password_2024 shared_user_db -e "
INSERT IGNORE INTO users (email, password, first_name, last_name, phone, is_active, is_email_verified, created_at, updated_at) 
VALUES ('admin@example.com', '\$2b\$10\$/fk1WPB9sJhZ8WnVCGq8IeZp/KfCwJzYWEoYNTabR26NapcQH4jb6', 'Admin', 'User', '+1234567890', 1, 1, NOW(), NOW());
"
```

### 4. Assign Admin Role:
```bash
docker exec shared-user-database mysql -u shared_user -pshared_password_2024 shared_user_db -e "
INSERT IGNORE INTO user_roles (user_id, role_id) 
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.email = 'admin@example.com' AND r.name = 'admin';
"
```

## 📊 Database Tables

### Users Table:
```sql
SELECT id, email, first_name, last_name, is_active, is_email_verified 
FROM users 
WHERE email = 'admin@example.com';
```

### User Roles Table:
```sql
SELECT u.email, r.name as role, r.permissions
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@example.com';
```

## 🎯 Additional Test Users

Along with the admin user, 400+ test users are available (IDs 1-400) for testing:
- 85% regular users
- 10% moderators  
- 5% admins
- Various activity statuses and email verification states

Access them via:
```bash
curl "http://localhost:3003/api/v1/users?page=1&limit=10"
```

## 🔐 Security Notes

1. **Password Complexity**: Admin123! meets the basic requirements (uppercase, lowercase, number, special char)
2. **Bcrypt Hash**: Using bcrypt with cost factor 10 for secure password storage
3. **Change in Production**: Always change default passwords in production environments
4. **Email Verification**: Admin user is pre-verified for immediate access
5. **Permissions**: Admin has full system permissions - handle with care

## 📝 Updated Documentation

The following files have been updated with the correct password:
- `.github/copilot-instructions.md`
- `QUICK-START.md`
- `shared-database/README.md`
- `user-service/scripts/seed-data.ts`

---

**Status**: ✅ Complete  
**Created**: October 18, 2025  
**User ID**: 401  
**Services**: Auth Service (port 3001) + User Service (port 3003)
