# User Service Docker Fix - Action Plan

**Date**: October 18, 2025  
**Status**: Ready to Execute  
**Priority**: P2 (Medium - service works locally)

---

## 🎯 Problem Identified

**Root Cause**: TypeScript compiler is outputting `.ts` file extensions in require() statements instead of `.js`

**Evidence**:
```javascript
// User Service compiled output (BROKEN)
const infrastructure_1 = require("../../../../shared/infrastructure/src/index.ts");
//                                                                          ^^^^^ .ts extension causes MODULE_NOT_FOUND
```

**Why Auth Service Works**:
- Uses NestJS CLI v11 (newer version with better path resolution)
- User Service uses NestJS CLI v10 (older version)

---

## ✅ Solution Options (Ranked by Effort)

### Option 1: Upgrade NestJS CLI (Recommended - 15 minutes)

**Steps**:
```bash
cd user-service

# Upgrade NestJS CLI to match Auth Service
npm install --save-dev @nestjs/cli@^11.0.10

# Upgrade NestJS core packages to match
npm install @nestjs/common@^11.1.6 @nestjs/core@^11.1.6 @nestjs/typeorm@^11.0.0

# Rebuild to test
npm run build

# Check compiled output no longer has .ts extensions
head -25 dist/user-service/src/interfaces/controllers/user.controller.js | grep "require.*\.ts"
```

**Expected Result**: No `.ts` extensions in compiled output

**Risk**: Low (Auth Service already uses v11 successfully)

---

### Option 2: Add NestJS Webpack Plugin (30 minutes)

Add plugin to nest-cli.json to handle path resolution:

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": true,
    "webpackConfigPath": "webpack.config.js"
  }
}
```

Create `webpack.config.js`:
```javascript
module.exports = function (options) {
  return {
    ...options,
    externals: [],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
  };
};
```

**Risk**: Medium (additional configuration complexity)

---

### Option 3: Use tsconfig-paths at Runtime (5 minutes)

Modify the Docker CMD to use tsconfig-paths/register:

```dockerfile
# In Dockerfile
CMD ["node", "-r", "tsconfig-paths/register", "dist/user-service/src/main.js"]
```

Install dependency:
```bash
npm install --save tsconfig-paths
```

**Risk**: Low (minimal changes)

---

### Option 4: Fix tsconfig Paths to Use Package Name (10 minutes)

Instead of using path aliases, import directly from the NPM package:

**Change imports from**:
```typescript
import { PaginationDto } from "@shared/infrastructure";
```

**To**:
```typescript
import { PaginationDto } from "@fullstack-project/shared-infrastructure";
```

**Pros**: More explicit, follows NPM conventions  
**Cons**: Requires updating all import statements (20-30 files)

**Risk**: Medium (code changes across multiple files)

---

## 🚀 Recommended Execution Plan

### Phase 1: Quick Win (Option 1 - NestJS CLI Upgrade)

1. **Upgrade NestJS packages** in User Service to match Auth Service versions
2. **Rebuild and test** locally
3. **Test Docker build** if local build succeeds
4. **Verify** no `.ts` extensions in compiled output

**Time**: 15-30 minutes  
**Success Criteria**: Docker container starts without MODULE_NOT_FOUND errors

---

### Phase 2: Fallback (Option 3 - Runtime tsconfig-paths)

If Phase 1 doesn't work:

1. Install `tsconfig-paths` as production dependency
2. Update Dockerfile CMD to use `-r tsconfig-paths/register`
3. Rebuild Docker image
4. Test container startup

**Time**: 5-10 minutes  
**Success Criteria**: Docker container runs successfully

---

### Phase 3: Long-term Solution (Option 4 - Use NPM Package Names)

For maintainability and clarity:

1. Update all import statements to use `@fullstack-project/shared-infrastructure`
2. Remove path aliases from tsconfig.json
3. Rebuild and test both local and Docker
4. Apply same pattern to other services

**Time**: 1-2 hours  
**Success Criteria**: Consistent import pattern across all services

---

## 📋 Detailed Steps for Option 1 (Recommended)

### Step 1: Backup Current State
```bash
cd /opt/cursor-project/fullstack-project/user-service
git status  # Make sure there are no uncommitted changes
```

### Step 2: Upgrade Packages
```bash
# Upgrade NestJS packages to v11
npm install --save-dev @nestjs/cli@^11.0.10

# Upgrade core dependencies
npm install @nestjs/common@^11.1.6 \
            @nestjs/core@^11.1.6 \
            @nestjs/typeorm@^11.0.0 \
            @nestjs/config@^4.0.2 \
            @nestjs/platform-express@^11.1.6
```

### Step 3: Test Local Build
```bash
# Clean previous build
rm -rf dist/

# Rebuild
npm run build

# Verify no .ts extensions in output
grep -r "require.*\.ts\"" dist/ | wc -l
# Should output: 0
```

### Step 4: Test Local Execution
```bash
# Start service
npm run start:dev

# In another terminal, test health endpoint
curl http://localhost:3003/api/v1/health
```

### Step 5: Test Docker Build
```bash
cd /opt/cursor-project/fullstack-project

# Build User Service image
docker-compose -f docker-compose.hybrid.yml build user-service

# Start container
docker-compose -f docker-compose.hybrid.yml up -d user-service

# Check logs
docker logs user-service --tail 50

# Test health endpoint
curl http://localhost:3003/api/v1/health
```

### Step 6: Verify Success
```bash
# Container should be running
docker ps | grep user-service

# Logs should show successful startup
docker logs user-service | grep "Nest application successfully started"

# Health endpoint should respond
curl http://localhost:3003/api/v1/health
# Expected: {"status":"ok"}
```

---

## 🧪 Testing Checklist

After implementing the fix:

- [ ] Local build completes without errors
- [ ] No `.ts` extensions in compiled JavaScript
- [ ] Local dev server starts successfully
- [ ] Health endpoint responds: `GET /api/v1/health`
- [ ] User endpoints work: `GET /api/v1/users?page=1&limit=10`
- [ ] Docker image builds successfully
- [ ] Docker container starts without crashes
- [ ] Container health check passes
- [ ] API endpoints accessible from host machine
- [ ] Pagination with 400 seeded users works

---

## 📊 Version Comparison

### Current Versions

| Package | Auth Service (Working) | User Service (Broken) | Action |
|---------|----------------------|---------------------|--------|
| @nestjs/cli | ^11.0.10 | ^10.0.0 | ⬆️ Upgrade |
| @nestjs/common | ^11.1.6 | ^10.0.0 | ⬆️ Upgrade |
| @nestjs/core | ^11.1.6 | ^10.0.0 | ⬆️ Upgrade |
| @nestjs/typeorm | ^11.0.0 | ^10.0.0 | ⬆️ Upgrade |
| @nestjs/config | ^4.0.2 | ^3.1.1 | ⬆️ Upgrade |
| @nestjs/platform-express | ^11.1.6 | ^10.0.0 | ⬆️ Upgrade |

---

## ⚠️ Important Notes

1. **Synchronize Setting**: Remember to set `synchronize: false` in `app.module.ts` after testing
2. **Database State**: Current database has 400 seeded users ready for testing
3. **Local Instance**: Keep User Service running locally until Docker fix is verified
4. **Breaking Changes**: NestJS v11 may have breaking changes - review changelog
5. **Dependencies**: Other packages may need updates for compatibility

---

## 🔄 Rollback Plan

If upgrade causes issues:

```bash
cd user-service

# Restore original package.json
git checkout package.json package-lock.json

# Reinstall original dependencies
rm -rf node_modules
npm install

# Rebuild with original versions
npm run build
```

---

## 📚 References

- **Auth vs User Comparison**: `docs/development/AUTH-VS-USER-SERVICE-COMPARISON.md`
- **Blocker Documentation**: `docs/development/USER-SERVICE-DOCKER-MIGRATION-BLOCKED.md`
- **NestJS v11 Changelog**: https://github.com/nestjs/nest/releases/tag/v11.0.0
- **TypeScript Path Mapping**: https://www.typescriptlang.org/docs/handbook/module-resolution.html

---

## ✅ Next Steps

1. **Execute Option 1** (NestJS CLI upgrade) - 15 minutes
2. **Test thoroughly** with checklist above
3. **Update documentation** if successful
4. **Apply to other services** if needed
5. **Mark todo as complete** ✅

---

## 🎯 Success Metrics

- **Docker Build Time**: < 2 minutes
- **Container Startup**: < 10 seconds
- **Memory Usage**: < 200MB
- **API Response Time**: < 100ms
- **Uptime Target**: 24+ hours without restarts

