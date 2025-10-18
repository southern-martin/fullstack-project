# Quick Reference: Docker Shared Infrastructure Fix

**Date**: October 18, 2025  
**Branch**: `feature/fix-docker-shared-infrastructure`  
**Status**: ✅ Complete

---

## 🎯 Problem & Solution

### Problem
```
Error: Cannot find module '@shared/infrastructure'
```
Services crashed in Docker because TypeScript path aliases compiled to relative paths with `.ts` extensions.

### Solution
Use NPM package names instead of path aliases:
```typescript
// ❌ Before (TypeScript path alias)
import { PaginationDto } from "@shared/infrastructure";

// ✅ After (NPM package name)
import { PaginationDto } from "@fullstack-project/shared-infrastructure";
```

---

## 📝 Changed Files Summary

### Auth Service (10 files)
```
auth-service/
├── Dockerfile                    # Updated WORKDIR to /app/auth-service
├── package.json                  # Updated start:prod script
├── tsconfig.json                 # Removed path aliases
└── src/
    ├── domain/
    │   ├── events/*.ts          # 6 files: Updated imports
    │   └── repositories/*.ts    # 2 files: Updated imports
    └── infrastructure/
        └── database/typeorm/repositories/*.ts  # 2 files: Updated imports
```

### User Service (12 files)
```
user-service/
├── Dockerfile.simple             # Updated WORKDIR to /app/user-service
├── package.json                  # Updated start:prod script
├── tsconfig.json                 # Removed path aliases
├── scripts/seed-data.ts          # Updated admin password
└── src/
    ├── application/use-cases/*.ts           # 3 files: Updated imports
    ├── domain/
    │   ├── events/*.ts                      # 4 files: Updated imports
    │   └── repositories/*.ts                # 2 files: Updated imports
    ├── infrastructure/
    │   └── database/typeorm/repositories/*.ts  # 2 files: Updated imports
    └── interfaces/controllers/*.ts          # 1 file: Updated imports
```

### Docker & Docs (4 files)
```
├── docker-compose.hybrid.yml     # Updated build contexts
├── .github/copilot-instructions.md
├── QUICK-START.md
└── shared-database/README.md
```

**Total**: 26 files modified

---

## 🚀 Quick Commands

### Build & Start
```bash
# Build both services
docker-compose -f docker-compose.hybrid.yml build auth-service user-service

# Start services
docker-compose -f docker-compose.hybrid.yml up -d auth-service user-service

# Check logs
docker logs auth-service --tail 30
docker logs user-service --tail 30
```

### Test Endpoints
```bash
# Health checks
curl http://localhost:3001/api/v1/auth/health
curl http://localhost:3003/api/v1/health

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "Admin123!"}'

# Get users
curl http://localhost:3003/api/v1/users?page=1&limit=5
```

### Database Access
```bash
# Check admin user
docker exec shared-user-database mysql -u shared_user -pshared_password_2024 \
  shared_user_db -e "SELECT id, email, first_name FROM users WHERE email = 'admin@example.com';"
```

---

## 🔑 Default Credentials

**Admin Login:**
- Email: `admin@example.com`
- Password: `Admin123!`
- Role: `admin` (full permissions)

**Test Data:**
- 400+ users in database
- 3 roles: admin, user, moderator
- Various statuses for testing

---

## 🔧 Technical Details

### Dockerfile Changes
```dockerfile
# Before
WORKDIR /app
COPY --from=builder /app/shared/infrastructure ./shared/infrastructure

# After
WORKDIR /app/auth-service  # or /app/user-service
COPY --from=builder /app/shared/infrastructure /app/shared/infrastructure
```

### Why This Works
```
/app/
├── shared/infrastructure/              # Copied from builder
├── auth-service/                       # Working directory
│   ├── node_modules/
│   │   └── @fullstack-project/
│   │       └── shared-infrastructure/  # Symlink → ../../../shared/infrastructure
│   ├── dist/
│   │   └── main.js                    # Compiled code
│   └── package.json                    # file:../shared/infrastructure
```

When code runs `require("@fullstack-project/shared-infrastructure")`:
1. Node.js checks `node_modules/@fullstack-project/shared-infrastructure`
2. Follows symlink to `/app/shared/infrastructure`
3. Loads `/app/shared/infrastructure/dist/index.js` ✅

---

## 📊 Verification Results

### ✅ Services Status
```
$ docker ps | grep -E "auth-service|user-service"
auth-service    Up 10 minutes    0.0.0.0:3001->3001/tcp    Healthy
user-service    Up 10 minutes    0.0.0.0:3003->3003/tcp    Healthy
```

### ✅ Health Checks
```json
// Auth Service
{"status":"ok","timestamp":"2025-10-18T07:58:21.973Z"}

// User Service
{"status":"ok","service":"user-service","version":"1.0.0"}
```

### ✅ Admin Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 401,
    "email": "admin@example.com",
    "roles": [{"name": "admin", "permissions": ["users.manage", "roles.manage", "system.admin"]}]
  }
}
```

---

## 🎓 Key Learnings

1. **TypeScript path aliases** → Relative paths in compiled JS (breaks in Docker)
2. **NPM package names** → Resolved via node_modules (works everywhere)
3. **Working directory structure** → Must match package.json file: paths
4. **Docker context** → Must include parent dir for shared infrastructure

---

## 🔄 Apply to Other Services

### 1. Update Imports (5 min)
```bash
cd <service-name>
find src -type f -name "*.ts" -exec sed -i '' \
  's|@shared/infrastructure|@fullstack-project/shared-infrastructure|g' {} +
```

### 2. Remove Path Aliases (1 min)
```jsonc
// tsconfig.json - Remove:
"@shared/infrastructure": ["../shared/infrastructure/src/index.ts"]
```

### 3. Update Dockerfile (5 min)
```dockerfile
WORKDIR /app/<service-name>
COPY --from=builder /app/shared/infrastructure /app/shared/infrastructure
```

### 4. Update docker-compose.yml (2 min)
```yaml
build:
  context: .  # Parent directory
  dockerfile: <service-name>/Dockerfile
```

### 5. Test (5 min)
```bash
docker-compose build <service-name>
docker-compose up -d <service-name>
docker logs <service-name>
```

**Total Time**: ~20 minutes per service

---

## 📚 Related Docs

- [Full Git Flow Document](./GIT-FLOW-DOCKER-SHARED-INFRASTRUCTURE-FIX.md)
- [Hybrid Architecture](../../HYBRID-ARCHITECTURE-README.md)
- [Quick Start Guide](../../QUICK-START.md)

---

## ✅ Checklist for PR

- [x] All services building
- [x] All services starting
- [x] Health checks passing
- [x] Authentication working
- [x] API endpoints functional
- [x] Documentation updated
- [x] Default credentials set
- [x] Test data available

**Status**: Ready to merge to `develop`

---

**Created**: October 18, 2025  
**For**: Auth Service & User Service Docker Deployment Fix
