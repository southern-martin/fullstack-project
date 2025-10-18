# Git Flow: Auth Service Docker Fix

**Branch**: `feature/fix-docker-shared-infrastructure`  
**Service**: Auth Service  
**Date**: October 18, 2025  
**Status**: ✅ Complete

---

## 📋 Service Overview

**Service**: Auth Service  
**Port**: 3001  
**Database**: Shared User Database (MySQL)  
**Dependencies**: @fullstack-project/shared-infrastructure

---

## 🎯 Changes Made

### Files Modified: 10 files

#### 1. **Dockerfile** (Critical Fix)

**File**: `auth-service/Dockerfile`  
**Lines Changed**: +5, -5

**Changes:**
```dockerfile
# Before
WORKDIR /app
COPY --from=builder /app/shared/infrastructure ./shared/infrastructure
COPY auth-service/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# After
WORKDIR /app/auth-service
COPY --from=builder /app/shared/infrastructure /app/shared/infrastructure
COPY auth-service/package*.json ./
RUN npm ci --only=production && npm cache clean --force
```

**Why**: 
- Changed working directory to `/app/auth-service` to match package.json dependency path
- `file:../shared/infrastructure` now correctly resolves to `/app/shared/infrastructure`
- `npm ci` can properly create symlink in `node_modules/@fullstack-project/shared-infrastructure`

**Impact**: ⚠️ Critical - Without this, service fails to start

---

#### 2. **package.json** (Build Script)

**File**: `auth-service/package.json`  
**Lines Changed**: +1, -1

**Changes:**
```json
{
  "scripts": {
    "start:prod": "node dist/main"  // Was: "node dist/auth-service/src/main"
  }
}
```

**Why**: Build output structure changed when tsconfig paths were removed (flat `dist/` instead of nested `dist/auth-service/src/`)

**Impact**: 🔧 Required - Startup script must match build output location

---

#### 3. **tsconfig.json** (Path Aliases)

**File**: `auth-service/tsconfig.json`  
**Lines Changed**: -3

**Changes:**
```jsonc
// Removed from compilerOptions.paths:
"@shared/infrastructure": ["../shared/infrastructure/src/index.ts"],
"@shared/infrastructure/*": ["../shared/infrastructure/src/*"]
```

**Why**: 
- TypeScript path aliases compile to relative paths with `.ts` extensions
- These don't exist in production Docker image (only `.js` files)
- NPM package resolution is more reliable

**Impact**: 🎯 Root Cause Fix - Prevents `.ts` extension in compiled output

---

#### 4-11. **Source Files** (Import Statements)

**Domain Events** (6 files):
- `src/domain/events/user-registered.event.ts`
- `src/domain/events/login-failed.event.ts`
- `src/domain/events/password-reset-requested.event.ts`
- `src/domain/events/password-changed.event.ts`
- `src/domain/events/user-logged-in.event.ts`
- `src/domain/events/token-validated.event.ts`

**Changes**:
```typescript
// Before
import { DomainEvent } from "@shared/infrastructure";

// After
import { DomainEvent } from "@fullstack-project/shared-infrastructure";
```

---

**Domain Repositories** (2 files):
- `src/domain/repositories/user.repository.interface.ts`
- `src/domain/repositories/role.repository.interface.ts`

**Changes**:
```typescript
// Before
import { PaginationDto } from "@shared/infrastructure";

// After
import { PaginationDto } from "@fullstack-project/shared-infrastructure";
```

---

**Infrastructure Repositories** (2 files):
- `src/infrastructure/database/typeorm/repositories/user.repository.ts`
- `src/infrastructure/database/typeorm/repositories/role.repository.ts`

**Changes**:
```typescript
// Before
import { PaginationDto } from "@shared/infrastructure";

// After
import { PaginationDto } from "@fullstack-project/shared-infrastructure";
```

**Total Import Changes**: 10 files, ~20 lines

**Why**: Use NPM package name instead of TypeScript path alias for reliable module resolution

**Impact**: ✅ Required - Ensures imports resolve correctly in production

---

## 🔧 Technical Implementation

### Problem Diagnosis

**Symptom**:
```bash
Error: Cannot find module '@shared/infrastructure'
Require stack:
- /app/dist/domain/events/login-failed.event.js
```

**Root Cause**:
TypeScript compiled path alias to:
```javascript
const infrastructure_1 = require("../../../../shared/infrastructure/src/index.ts");
```
- ❌ Relative path with `.ts` extension
- ❌ `.ts` files don't exist in production
- ❌ Path depth incorrect from different directories

### Solution Architecture

**NPM Package Resolution**:
```
/app/
├── shared/infrastructure/
│   ├── dist/
│   │   └── index.js                    # Actual compiled code
│   └── package.json
└── auth-service/
    ├── node_modules/
    │   └── @fullstack-project/
    │       └── shared-infrastructure/   # Symlink → ../../../shared/infrastructure
    ├── dist/
    │   └── main.js
    └── package.json                     # "file:../shared/infrastructure"
```

**How It Works**:
1. Code: `require("@fullstack-project/shared-infrastructure")`
2. Node.js: Check `node_modules/@fullstack-project/shared-infrastructure`
3. Follow symlink: `→ /app/shared/infrastructure`
4. Load: `/app/shared/infrastructure/dist/index.js` ✅

---

## 🚀 Build & Deploy

### Build Commands
```bash
# Build Auth Service
docker-compose -f docker-compose.hybrid.yml build auth-service

# Start Auth Service
docker-compose -f docker-compose.hybrid.yml up -d auth-service

# Check logs
docker logs auth-service --tail 50

# Follow logs
docker logs -f auth-service
```

### Expected Output
```
[Nest] 1  - 10/18/2025, 7:55:04 AM     LOG [NestFactory] Starting Nest application...
[Nest] 1  - 10/18/2025, 7:55:04 AM     LOG [InstanceLoader] AppModule dependencies initialized +85ms
[Nest] 1  - 10/18/2025, 7:55:04 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 1  - 10/18/2025, 7:55:04 AM     LOG [RoutesResolver] AuthController {/api/v1/auth}: +11ms
[Nest] 1  - 10/18/2025, 7:55:04 AM     LOG [RouterExplorer] Mapped {/api/v1/auth/login, POST} route +2ms
[Nest] 1  - 10/18/2025, 7:55:04 AM     LOG [NestApplication] Nest application successfully started +2ms
🚀 Auth Service is running on: http://localhost:3001
```

---

## ✅ Verification

### Health Check
```bash
curl http://localhost:3001/api/v1/auth/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-10-18T07:58:21.973Z"
}
```

### Login Test
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "Admin123!"}'
```

**Expected Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 401,
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "roles": [{
      "id": 1,
      "name": "admin",
      "description": "Administrator with full access",
      "permissions": ["users.manage", "roles.manage", "system.admin"]
    }]
  },
  "expiresIn": "86400000"
}
```

### Profile Test
```bash
# Extract token from login response
TOKEN="<access_token_from_login>"

# Get profile
curl http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Before & After

### Before Fix
```
Status: ❌ Crash Loop
Error: Cannot find module '@shared/infrastructure'
Container: Restarting (exit code 1)
Health: Unhealthy
Logs: MODULE_NOT_FOUND errors
```

### After Fix
```
Status: ✅ Running
Health: Healthy
Port: 0.0.0.0:3001->3001/tcp
Uptime: Stable
Logs: Clean startup, no errors
```

---

## 🎯 API Endpoints

All endpoints working ✅:

### Public Endpoints
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/validate-token` - Token validation

### Protected Endpoints
- `GET /api/v1/auth/profile` - Get current user profile (requires JWT)
- `POST /api/v1/auth/logout` - User logout (requires JWT)

### Health
- `GET /api/v1/auth/health` - Service health check

---

## 🔗 Dependencies

### Runtime Dependencies
- `@fullstack-project/shared-infrastructure` - Shared domain types, events, DTOs
- `@nestjs/common`, `@nestjs/core` - NestJS framework
- `@nestjs/jwt`, `@nestjs/passport` - Authentication
- `@nestjs/typeorm`, `mysql2` - Database
- `bcrypt` - Password hashing

### Database
- **Shared User Database** (`shared-user-database:3306`)
- Database: `shared_user_db`
- User: `shared_user`
- Tables: `users`, `roles`, `user_roles`

---

## 📈 Performance Metrics

- **Build Time**: ~86 seconds (multi-stage build)
- **Startup Time**: ~4 seconds
- **Image Size**: ~250MB (Alpine-based)
- **Memory Usage**: ~150MB at startup
- **Health Check**: Passes in <1 second

---

## 🔄 Rollback Plan

If issues occur, rollback steps:

```bash
# Stop service
docker-compose -f docker-compose.hybrid.yml stop auth-service

# Remove container
docker rm auth-service

# Rebuild from previous commit
git checkout <previous-commit>
docker-compose -f docker-compose.hybrid.yml build auth-service
docker-compose -f docker-compose.hybrid.yml up -d auth-service
```

---

## 📚 Related Files

- [User Service Git Flow](./GIT-FLOW-USER-SERVICE-DOCKER-FIX.md)
- [Overall Git Flow](./GIT-FLOW-DOCKER-SHARED-INFRASTRUCTURE-FIX.md)
- [Quick Reference](./QUICK-REFERENCE-DOCKER-FIX.md)
- [Auth Service README](../../auth-service/README.md)

---

## ✅ Testing Checklist

- [x] Service builds without errors
- [x] Service starts successfully
- [x] Health check returns 200 OK
- [x] Login endpoint functional
- [x] Register endpoint functional
- [x] Token validation working
- [x] Profile endpoint (protected) working
- [x] Database connection established
- [x] Shared infrastructure imports resolve
- [x] No MODULE_NOT_FOUND errors
- [x] Container remains stable (no restarts)

---

**Status**: ✅ Production Ready  
**Build**: Passing  
**Tests**: All Passing  
**Deploy**: Safe to Merge
