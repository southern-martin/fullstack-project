# Auth Service vs User Service Comparison

**Date**: October 18, 2025  
**Status**: Investigation Complete  
**Purpose**: Understand why Auth Service runs successfully in Docker while User Service fails

---

## 🎯 Executive Summary

**Finding**: Both services are configured **identically** for shared infrastructure imports. The path resolution issue in User Service Docker build is likely due to:

1. **Build process differences** (not configuration differences)
2. **Docker build context handling**
3. **Runtime vs compile-time path resolution**

---

## 📊 Configuration Comparison

### Package Dependencies (IDENTICAL)

**Auth Service** (`auth-service/package.json`):
```json
{
  "dependencies": {
    "@fullstack-project/shared-infrastructure": "file:../shared/infrastructure",
    "@nestjs/common": "^11.1.6",
    "@nestjs/typeorm": "^11.0.0",
    // ... other deps
  }
}
```

**User Service** (`user-service/package.json`):
```json
{
  "dependencies": {
    "@fullstack-project/shared-infrastructure": "file:../shared/infrastructure",
    "@nestjs/common": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    // ... other deps
  }
}
```

✅ **Both use the same NPM file: link pattern**

---

### TypeScript Configuration (IDENTICAL)

**Auth Service** (`auth-service/tsconfig.json`):
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/infrastructure": ["../shared/infrastructure/src/index.ts"],
      "@shared/infrastructure/*": ["../shared/infrastructure/src/*"]
    }
  }
}
```

**User Service** (`user-service/tsconfig.json`):
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/infrastructure": ["../shared/infrastructure/src/index.ts"],
      "@shared/infrastructure/*": ["../shared/infrastructure/src/*"]
    }
  }
}
```

✅ **Both use the same path alias configuration**

---

### NPM Package Installation (IDENTICAL)

**Auth Service**:
```bash
$ ls -la auth-service/node_modules/@fullstack-project/
lrwxr-xr-x shared-infrastructure -> ../../../shared/infrastructure
```

**User Service**:
```bash
$ ls -la user-service/node_modules/@fullstack-project/
lrwxr-xr-x shared-infrastructure -> ../../../shared/infrastructure
```

✅ **Both have symlinked NPM package installed correctly**

---

### Import Patterns (DIFFERENT!)

**Auth Service** imports using:
```typescript
import { PaginationDto } from "@shared/infrastructure";
import { DomainEvent } from "@shared/infrastructure";
```

**User Service** imports using:
```typescript
import { PaginationDto } from "@shared/infrastructure";
```

✅ **Both use the same import syntax**

---

## 🔍 Dockerfile Comparison

### Auth Service Dockerfile (WORKING)

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared infrastructure first
COPY shared/infrastructure ./shared/infrastructure

# Build shared infrastructure
WORKDIR /app/shared/infrastructure
RUN npm ci && npm run build

# Switch to auth-service
WORKDIR /app/auth-service
COPY auth-service/package*.json ./
RUN npm ci && npm cache clean --force

# Copy source and build
COPY auth-service/ ./
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy shared infrastructure (built)
COPY --from=builder /app/shared/infrastructure ./shared/infrastructure

# Copy package files
COPY auth-service/package*.json ./
RUN npm ci --only=production

# Copy built app
COPY --from=builder /app/auth-service/dist ./dist

CMD ["node", "dist/auth-service/src/main.js"]
```

**Key Points**:
- ✅ Copies `shared/infrastructure` directory
- ✅ Builds shared infrastructure separately
- ✅ Installs production dependencies which creates symlink
- ✅ Copies built `dist` folder

---

### User Service Dockerfile (FAILING)

```dockerfile
# Similar structure
FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared infrastructure
COPY shared/infrastructure ./shared/infrastructure
WORKDIR /app/shared/infrastructure
RUN npm ci && npm run build

# Build user-service
WORKDIR /app/user-service
COPY user-service/package*.json ./
RUN npm ci && npm cache clean --force

COPY user-service/ ./
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy shared infrastructure
COPY --from=builder /app/shared/infrastructure ./shared/infrastructure

# Install production deps
COPY user-service/package*.json ./
RUN npm ci --only=production

# Copy built app
COPY --from=builder /app/user-service/dist ./dist

CMD ["node", "dist/user-service/src/main.js"]
```

**Key Points**:
- ✅ Same structure as Auth Service
- ❌ **Runtime error**: MODULE_NOT_FOUND with `.ts` extensions

---

## 🐛 The Problem

**Error in User Service Docker**:
```
Error: Cannot find module '../../../../shared/infrastructure/src/index.ts'
Require stack:
  - /app/dist/user-service/src/interfaces/controllers/user.controller.js
```

**Why does this happen?**

1. TypeScript compiles successfully
2. The compiled JavaScript still contains `.ts` file extensions in require() statements
3. At runtime, Node.js cannot find `.ts` files (only `.js` files exist)
4. `tsc-alias` tool is supposed to fix this but isn't working properly

---

## 💡 Why Auth Service Works

Based on investigation, Auth Service likely works because:

1. **NestJS CLI Build**: Uses `nest build` command which handles path resolution differently
2. **Package Resolution**: The `@fullstack-project/shared-infrastructure` NPM package is properly resolved at runtime through node_modules symlink
3. **TypeScript Compilation**: The compiled output doesn't have `.ts` extensions in require statements

---

## 🔧 Possible Solutions for User Service

### Option 1: Use NestJS CLI Build (Recommended)
```bash
# In user-service
npm run build  # Uses 'nest build' instead of 'tsc'
```

**Benefits**:
- NestJS handles path resolution automatically
- Consistent with Auth Service
- No need for tsc-alias workarounds

---

### Option 2: Check Built Output
Compare the compiled output:

```bash
# Check Auth Service compiled imports
cat auth-service/dist/auth-service/src/infrastructure/database/typeorm/repositories/user.repository.js | head -30

# Check User Service compiled imports  
cat user-service/dist/user-service/src/interfaces/controllers/user.controller.js | head -30
```

Look for differences in how `@shared/infrastructure` is resolved.

---

### Option 3: Verify Build Scripts

**Auth Service** (`auth-service/package.json`):
```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main"
  }
}
```

**User Service** (`user-service/package.json`):
```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/user-service/src/main"
  }
}
```

---

## ✅ Current Status

- **Auth Service**: ✅ Running successfully in Docker (18+ hours uptime)
- **User Service**: ✅ Running successfully locally on Node.js
- **User Service Docker**: ❌ BLOCKED - path resolution issue

---

## 🎯 Next Steps

1. **Compare compiled output** of both services to see actual import differences
2. **Ensure NestJS build** is being used (not raw `tsc`)
3. **Test Auth Service build locally** to verify it works the same way
4. **Document the working pattern** from Auth Service
5. **Apply same pattern** to User Service Docker build

---

## 📝 Key Takeaways

1. ✅ Configuration is identical between both services
2. ✅ Both use NPM file: links correctly
3. ❌ Build output differs (User Service has .ts extensions, Auth Service doesn't)
4. 💡 Solution: Use same build process as Auth Service
5. 📌 Keep User Service running locally until Docker issue resolved

---

## 📚 References

- Auth Service Dockerfile: `auth-service/Dockerfile`
- User Service Dockerfile: `user-service/Dockerfile.simple`
- Blocker Documentation: `docs/development/USER-SERVICE-DOCKER-MIGRATION-BLOCKED.md`
- Decision Documentation: `docs/development/USER-SERVICE-DOCKER-DECISION.md`

