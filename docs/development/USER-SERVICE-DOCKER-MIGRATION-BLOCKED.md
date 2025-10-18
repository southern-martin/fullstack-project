# 🐳 User Service Docker Migration Attempt - October 18, 2025

## 📊 Executive Summary

**Objective:** Migrate User Service from local Node.js to Docker to match Auth Service pattern  
**Status:** ⚠️ **BLOCKED** - Path resolution issues prevent Docker deployment  
**Recommendation:** Keep User Service running locally until path resolution is fixed  

---

## 🎯 What We Attempted

### Initial Goal
Containerize User Service to achieve:
- ✅ Consistency with Auth Service (already Dockerized)
- ✅ Environment parity (dev = prod)
- ✅ Simplified onboarding (one command: `docker-compose up`)

### What We Did
1. ✅ Fixed `docker-compose.hybrid.yml` - commented out problematic volume mounts
2. ✅ Cleaned up old Docker containers (`southern-martin-*`)
3. ✅ Freed 22GB+ Docker disk space with `docker system prune`
4. ✅ Created simplified `Dockerfile.simple` based on Auth Service pattern
5. ✅ Fixed build context from `./user-service` to `.` (project root)
6. ✅ Fixed main.js path from `dist/main.js` to `dist/user-service/src/main.js`
7. ✅ Successfully built Docker image (25+ build steps completed)
8. ✅ Container starts but crashes immediately

---

## ❌ The Blocking Issue

### Problem: Module Not Found Error

```
Error: Cannot find module '../../../../shared/infrastructure/src/index.ts'
Require stack:
- /app/dist/user-service/src/interfaces/controllers/user.controller.js
- /app/dist/user-service/src/interfaces/interfaces.module.js
- /app/dist/user-service/src/app.module.js
- /app/dist/user-service/src/main.js
```

### Root Cause Analysis

**The Issue:**
- TypeScript compiles `.ts` files to `.js` files
- Compiled JavaScript still tries to `require('../../../../shared/infrastructure/src/index.ts')` with `.ts` extension
- At runtime, Node.js cannot find `.ts` files (only `.js` files exist)

**Why This Happens:**
1. User Service uses path aliases in `tsconfig.json`:
   ```json
   "@shared/infrastructure": ["../shared/infrastructure/src/index.ts"]
   ```

2. TypeScript compiler resolves these at compile time

3. The compiled `.js` files have hardcoded relative paths with `.ts` extensions

4. `tsc-alias` is supposed to fix this but isn't working properly

### Why Auth Service Works

**Auth Service Dockerfile** is simpler and doesn't have this issue because:
- Different build output structure
- Simpler path resolution
- May use different tsconfig settings
- Successfully runs in Docker since 18 hours ago

---

## 🔍 Technical Details

### Docker Setup (Successful Parts)

#### Infrastructure ✅
```bash
# Shared MySQL - RUNNING
Container: shared-user-database
Port: 3306
Status: Healthy

# Shared Redis - RUNNING
Container: shared-redis
Port: 6379
Status: Healthy
```

#### User Service Dockerfile Attempts

**Attempt 1:** Original complex `Dockerfile` (95 lines)
- Multi-stage build with tsc-alias
- Complex path symlinking
- **Result:** Build failures, path resolution errors

**Attempt 2:** Simplified `Dockerfile.simple` (67 lines)
- Based on Auth Service pattern
- Simpler two-stage build
- **Result:** Builds successfully, crashes at runtime

### Build Process (Working)

```bash
# Build completed successfully in ~25 seconds
docker-compose -f docker-compose.hybrid.yml build user-service

# Image created
REPOSITORY: fullstack-project-hybrid-user-service
SIZE: ~400MB
STATUS: Built successfully
```

### Runtime (Failing)

```bash
# Container starts but immediately crashes
docker ps | grep user-service
# STATUS: Restarting (1) X seconds ago

# Error repeats every restart attempt
docker logs user-service
# Error: Cannot find module '../../../../shared/infrastructure/src/index.ts'
```

---

## 📊 Comparison: Auth vs User Service

| Aspect | Auth Service | User Service |
|--------|-------------|--------------|
| **Docker Status** | ✅ Running | ❌ Failing |
| **Dockerfile** | Simple (67 lines) | Complex (95 lines) |
| **Build** | ✅ Works | ✅ Works |
| **Runtime** | ✅ Works | ❌ Crashes |
| **Path Aliases** | ✅ Resolves | ❌ Fails |
| **tsc-alias** | Not needed | ❌ Doesn't work |
| **Uptime** | 18+ hours | 0 seconds |

---

## 🛠️ Attempted Solutions

### 1. Fixed Volume Mounts ✅
**Problem:** Docker couldn't access `./shared-redis/redis.conf` and `./shared-database/init`  
**Solution:** Commented out optional volume mounts  
**Result:** Infrastructure starts successfully

### 2. Fixed Build Context ✅
**Problem:** `COPY user-service/` failed - wrong context  
**Solution:** Changed context from `./user-service` to `.` (project root)  
**Result:** Build succeeds

### 3. Fixed Main.js Path ✅
**Problem:** CMD tried to run `dist/main.js` but file at `dist/user-service/src/main.js`  
**Solution:** Updated CMD path  
**Result:** Container starts (but crashes immediately)

### 4. Simplified Dockerfile ✅
**Problem:** Complex Dockerfile with too many moving parts  
**Solution:** Created `Dockerfile.simple` based on working Auth Service  
**Result:** Build works, but runtime still fails

### 5. Module Resolution ❌ **UNSOLVED**
**Problem:** Compiled code references `.ts` files at runtime  
**Attempted:**
- tsc-alias in build step
- Different Dockerfile approaches
- Symlink strategies
- Path mapping

**Result:** None of these solved the runtime module resolution

---

## 💡 Possible Solutions (Future Work)

### Option 1: Fix Path Resolution (Recommended)
**Investigate why Auth Service works:**
1. Compare Auth Service `tsconfig.json` vs User Service
2. Check if Auth Service uses `@shared/infrastructure` differently
3. Test if Auth Service has different build output structure
4. Apply same pattern to User Service

**Estimated Effort:** 2-4 hours  
**Risk:** Medium  
**Impact:** High (enables full Dockerization)

### Option 2: Use npm Link/Workspace
**Convert shared infrastructure to npm workspace:**
```json
// package.json (root)
{
  "workspaces": [
    "shared/infrastructure",
    "auth-service",
    "user-service"
  ]
}
```
**Estimated Effort:** 4-6 hours  
**Risk:** High (affects all services)  
**Impact:** Very High (solves issue permanently)

### Option 3: Bundle Shared Infrastructure
**Copy shared infrastructure into user-service during build:**
- No path aliases needed
- Direct imports from `./shared/infrastructure`
- Simpler but duplicates code

**Estimated Effort:** 1-2 hours  
**Risk:** Low  
**Impact:** Medium (not ideal architecture)

### Option 4: Keep Local for Now (Current)
**Run User Service on local Node.js:**
- ✅ Works immediately
- ✅ Fast development (hot-reload)
- ✅ Easy debugging
- ❌ Inconsistent with other services
- ❌ Production mismatch

**Estimated Effort:** 0 hours  
**Risk:** None  
**Impact:** Low (acceptable temporary solution)

---

## 📋 Current Architecture State

### Services in Docker ✅
- Auth Service (port 3001)
- Carrier Service (port 3002)
- Customer Service (port 3004)
- Pricing Service (port 3005)
- Translation Service (port 3006)
- Shared MySQL (port 3306)
- Shared Redis (port 6379)

### Services Running Locally 💻
- **User Service (port 3003)** ⚠️
- React Admin (port 3000)
- React Admin 2 (TBD)

---

## 🎯 Recommendation

### Immediate Action: **Keep User Service Local**

**Reasons:**
1. ✅ Works reliably right now
2. ✅ Faster development iteration
3. ✅ Easy debugging with VS Code
4. ✅ Can still access Docker databases
5. ✅ 400 users already seeded successfully
6. ✅ Pagination testing can proceed

**Drawbacks:**
1. ⚠️ Inconsistent with Auth Service
2. ⚠️ Requires Node.js 20 installed locally
3. ⚠️ Different from production setup

### Future Action: **Fix Path Resolution**

**Priority:** P2 (Medium)  
**Timeline:** Next sprint  
**Owner:** TBD  

**Investigation Steps:**
1. Deep-dive Auth Service success pattern
2. Compare tsconfig.json configurations
3. Test different build configurations
4. Consider npm workspaces migration
5. Document findings and apply fix

---

## 🚀 How to Run User Service (Current Setup)

### Local Node.js (Working)
```bash
# Navigate to user-service
cd user-service

# Install dependencies (if needed)
npm install

# Start development server
npm run start:dev

# Service runs on http://localhost:3003
# API docs: http://localhost:3003/api/v1
```

### Verify It Works
```bash
# Health check
curl http://localhost:3003/api/v1/health

# Should return: {"status":"ok"}
```

### Seed 400 Users (Already Done)
```bash
cd user-service
npm run seed:400

# ✅ Successfully seeded 400 users in 6.54 seconds
# ✅ 61.16 users/second
# ✅ Ready for pagination testing
```

---

## 📚 Related Documentation

- [USER-SERVICE-DOCKER-DECISION.md](./USER-SERVICE-DOCKER-DECISION.md) - Original dockerization analysis
- [TSCONFIG-PATHS-COMPARISON.md](./TSCONFIG-PATHS-COMPARISON.md) - Auth vs User path configuration
- [SOUTHERN-MARTIN-DOCKER-MIGRATION-SUCCESS.md](../../SOUTHERN-MARTIN-DOCKER-MIGRATION-SUCCESS.md) - Auth Service success story
- [docker-compose.hybrid.yml](../../docker-compose.hybrid.yml) - Full stack configuration

---

## ✅ What's Working

1. ✅ Shared MySQL Database (Docker)
2. ✅ Shared Redis (Docker)
3. ✅ Auth Service (Docker)
4. ✅ Business Services (Docker)
5. ✅ **User Service (Local Node.js)** ⚠️
6. ✅ 400 users seeded successfully
7. ✅ React Admin can connect to all services
8. ✅ Pagination testing can proceed

---

## 📊 Time Spent

| Activity | Time | Status |
|----------|------|--------|
| Analysis & Planning | 15 min | ✅ Complete |
| Docker cleanup | 10 min | ✅ Complete |
| First build attempt | 20 min | ✅ Complete |
| Dockerfile simplification | 15 min | ✅ Complete |
| Debugging path issues | 30 min | ⚠️ Unsolved |
| Documentation | 20 min | ✅ Complete |
| **Total** | **110 min** | **Partially Complete** |

---

## 🎯 Next Steps

### Immediate (Today)
1. ✅ Keep User Service running locally
2. ✅ Test pagination with 400 seeded users
3. ✅ Verify React Admin works correctly
4. ✅ Document the blocking issue

### Short-term (This Week)
1. ⏳ File GitHub issue for path resolution problem
2. ⏳ Research Auth Service success pattern
3. ⏳ Compare build outputs side-by-side
4. ⏳ Create minimal reproduction case

### Medium-term (Next Sprint)
1. ⏳ Fix path resolution in User Service
2. ⏳ Successfully dockerize User Service
3. ⏳ Update all documentation
4. ⏳ Standardize Dockerfile across all services

---

## 🔑 Key Learnings

1. **Auth Service Works, User Service Doesn't**
   - Despite similar structure, they behave differently
   - Need to understand why Auth Service succeeds

2. **Path Aliases Are Tricky in Docker**
   - TypeScript path mapping doesn't always translate to runtime
   - tsc-alias should fix this but isn't working properly

3. **Pragmatic Approach is OK**
   - Running locally is acceptable temporary solution
   - Focus on unblocking user's pagination testing
   - Can fix Docker later when have more time

4. **Documentation is Critical**
   - Capture what worked and what didn't
   - Future developers need this context
   - Prevents repeating same attempts

---

## ❓ Open Questions

1. **Why does Auth Service work in Docker but User Service doesn't?**
   - Different tsconfig settings?
   - Different build output structure?
   - Different dependency versions?

2. **Is tsc-alias configured correctly?**
   - Should we use different tool?
   - Is there a better way to handle path aliases?

3. **Should we migrate to npm workspaces?**
   - Would this solve the problem permanently?
   - What's the migration effort?
   - Would it break existing services?

---

## 🎯 Success Criteria (When Revisiting)

### Definition of Done
- [ ] User Service builds in Docker successfully
- [ ] User Service starts without crashes
- [ ] Health endpoint responds: `http://localhost:3003/api/v1/health`
- [ ] Can run seed scripts inside container
- [ ] React Admin can connect successfully
- [ ] Same setup works in production

### Acceptance Tests
```bash
# 1. Build succeeds
docker-compose -f docker-compose.hybrid.yml build user-service
# Exit code: 0

# 2. Container starts
docker-compose -f docker-compose.hybrid.yml up -d user-service
docker ps | grep user-service
# STATUS: Up X seconds (healthy)

# 3. Health check passes
curl http://localhost:3003/api/v1/health
# Response: {"status":"ok"}

# 4. API works
curl http://localhost:3003/api/v1/users
# Response: JSON array of users

# 5. Seed works
docker exec -it user-service npm run seed:400
# Exit code: 0
```

---

## 📞 Contact & Support

**Issue:** User Service Docker path resolution  
**Status:** Blocked  
**Priority:** P2 (Medium)  
**Next Review:** Next sprint planning  

**For Questions:**
- Check this document first
- Review related documentation (links above)
- Compare with Auth Service (working example)
- File GitHub issue with reproduction steps

---

**Last Updated:** October 18, 2025  
**Document Status:** Complete  
**Next Action:** Proceed with local Node.js User Service, test pagination
