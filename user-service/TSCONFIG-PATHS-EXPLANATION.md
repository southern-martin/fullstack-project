# 🔧 Why We Need `tsconfig-paths/register` in User Service

**Date:** October 18, 2025  
**Context:** User Service seed script execution

---

## 🎯 The Problem

When you run TypeScript files directly with `ts-node` (without compiling first), TypeScript's **path aliases** don't work automatically.

### Example Error Without `tsconfig-paths/register`

```bash
npm run seed:400

Error: Cannot find module '@shared/infrastructure'
Require stack:
- /opt/cursor-project/fullstack-project/user-service/src/interfaces/controllers/user.controller.ts
```

---

## 📋 What Are Path Aliases?

Path aliases are shortcuts defined in `tsconfig.json` that make imports cleaner and more maintainable.

### Defined in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@/domain/*": ["src/domain/*"],
      "@/application/*": ["src/application/*"],
      "@/infrastructure/*": ["src/infrastructure/*"],
      "@/shared/*": ["src/shared/*"],
      "@/interfaces/*": ["src/interfaces/*"],
      "@shared/infrastructure": ["../shared/infrastructure/src/index.ts"],
      "@shared/infrastructure/*": ["../shared/infrastructure/src/*"]
    }
  }
}
```

### Used Throughout the Codebase:

**Example 1: Importing from shared infrastructure**
```typescript
// Instead of:
import { PaginationDto } from "../../../shared/infrastructure/src/dto/pagination.dto";

// We can write:
import { PaginationDto } from "@shared/infrastructure";
```

**Example 2: Importing from domain layer**
```typescript
// Instead of:
import { User } from "../../../domain/entities/user.entity";

// We can write:
import { User } from "@/domain/entities/user.entity";
```

---

## 🔍 Current Usage in User Service

### Path Aliases Being Used:

| Alias | Maps To | Usage Count |
|-------|---------|-------------|
| `@shared/infrastructure` | `../shared/infrastructure/src/index.ts` | 10+ files |
| `@/domain/*` | `src/domain/*` | 4+ files |
| `@/application/*` | `src/application/*` | Many files |
| `@/infrastructure/*` | `src/infrastructure/*` | Many files |
| `@/interfaces/*` | `src/interfaces/*` | Many files |

**Files Using These Aliases:**
- ✅ `src/interfaces/controllers/user.controller.ts`
- ✅ `src/domain/events/user-created.event.ts`
- ✅ `src/domain/events/user-updated.event.ts`
- ✅ `src/application/use-cases/create-user.use-case.ts`
- ✅ `src/infrastructure/database/typeorm/repositories/*.ts`
- ✅ And many more...

---

## ⚙️ How TypeScript Compilation Works

### Scenario 1: Normal Build (nest build)
```bash
npm run build
```

**What happens:**
1. TypeScript compiler reads `tsconfig.json`
2. Resolves all path aliases during compilation
3. Outputs JavaScript with actual file paths
4. Everything works ✅

**Example Output (dist/main.js):**
```javascript
// Path aliases are resolved to actual paths
const pagination_dto_1 = require("../../shared/infrastructure/dist/dto/pagination.dto");
```

### Scenario 2: Direct Execution with ts-node (Scripts)
```bash
ts-node scripts/seed-400-users.ts
```

**What happens:**
1. `ts-node` transpiles TypeScript to JavaScript on-the-fly
2. BUT it doesn't automatically resolve path aliases ❌
3. Node.js tries to find `@shared/infrastructure` as a package
4. Fails with "Cannot find module" error ❌

---

## 🔧 The Solution: `tsconfig-paths/register`

### What It Does:

`tsconfig-paths/register` is a runtime module that:
1. ✅ Reads your `tsconfig.json` at runtime
2. ✅ Registers custom path resolvers with Node.js
3. ✅ Intercepts module imports
4. ✅ Resolves path aliases to actual file paths
5. ✅ Allows `ts-node` to find modules correctly

### How to Use It:

**Add to npm scripts:**
```json
{
  "scripts": {
    "start:dev": "ts-node -r tsconfig-paths/register src/main.ts",
    "seed": "ts-node -r tsconfig-paths/register scripts/seed-data.ts",
    "seed:400": "ts-node -r tsconfig-paths/register scripts/seed-400-users.ts",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
  }
}
```

**The `-r` flag means "require this module before running the script"**

---

## 🎯 When You Need It

### ✅ Need `tsconfig-paths/register`:

1. **Direct ts-node execution:**
   ```bash
   ts-node -r tsconfig-paths/register src/main.ts
   ts-node -r tsconfig-paths/register scripts/seed-data.ts
   ```

2. **Running scripts that import the app:**
   - Seed scripts
   - Development servers
   - Debug/test commands with ts-node

3. **Any non-compiled execution** that uses path aliases

### ❌ Don't Need `tsconfig-paths/register`:

1. **Compiled production code:**
   ```bash
   npm run build  # TypeScript resolves aliases during compilation
   node dist/main.js  # No aliases in compiled code
   ```

2. **Regular nest commands:**
   ```bash
   nest start  # NestJS CLI handles it
   nest build  # TypeScript compiler handles it
   ```

---

## 📊 User Service Scripts Using It

### Current Scripts in `package.json`:

```json
{
  "start:dev": "ts-node -r tsconfig-paths/register src/main.ts",
  "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
  "seed": "ts-node -r tsconfig-paths/register scripts/seed-data.ts",
  "seed:dev": "ts-node -r tsconfig-paths/register scripts/seed-data.ts --dev",
  "seed:400": "ts-node -r tsconfig-paths/register scripts/seed-400-users.ts"
}
```

**All these scripts:**
- ✅ Execute TypeScript directly (not compiled)
- ✅ Import modules using path aliases
- ✅ Need path resolution at runtime
- ✅ Require `tsconfig-paths/register`

---

## 🔍 Real Example from Seed Script Error

### What Happened:

**Initial Command (Failed):**
```json
"seed:400": "ts-node scripts/seed-400-users.ts"
```

**Error:**
```
Error: Cannot find module '@shared/infrastructure'
Require stack:
- user-service/src/interfaces/controllers/user.controller.ts
- user-service/src/interfaces/interfaces.module.ts
- user-service/src/app.module.ts
- user-service/scripts/seed-400-users.ts
```

**Why:** The seed script imports `app.module.ts`, which imports controllers, which import `@shared/infrastructure`. Without `tsconfig-paths/register`, Node.js can't resolve the `@shared/infrastructure` alias.

### Fixed Command:
```json
"seed:400": "ts-node -r tsconfig-paths/register scripts/seed-400-users.ts"
```

**Result:** ✅ Works perfectly! Path aliases resolved correctly.

---

## 🎓 Alternative Solutions (Not Recommended)

### 1. Use Relative Paths Everywhere ❌
```typescript
// Instead of:
import { PaginationDto } from "@shared/infrastructure";

// Use:
import { PaginationDto } from "../../../shared/infrastructure/src/dto/pagination.dto";
```

**Problems:**
- ❌ Harder to read
- ❌ Breaks when you move files
- ❌ Inconsistent with rest of codebase
- ❌ Violates Clean Architecture patterns

### 2. Install Shared as Real NPM Package ❌
```bash
npm publish @fullstack-project/shared-infrastructure
npm install @fullstack-project/shared-infrastructure
```

**Problems:**
- ❌ Overkill for monorepo
- ❌ Need to publish on every change
- ❌ Slower development cycle
- ❌ Version management overhead

### 3. Use `tsconfig-paths/register` ✅ **BEST SOLUTION**
- ✅ Simple to implement
- ✅ Consistent with compiled code
- ✅ No code changes needed
- ✅ Works with all tools (ts-node, jest, etc.)

---

## 📦 Installation

The package is already installed:

```json
{
  "devDependencies": {
    "tsconfig-paths": "^4.2.0"
  }
}
```

**No additional setup needed!** Just add `-r tsconfig-paths/register` to ts-node commands.

---

## 🎯 Summary

### Why We Need It:
1. **User Service uses path aliases** (`@shared/infrastructure`, `@/domain/*`, etc.)
2. **ts-node doesn't resolve aliases by default**
3. **`tsconfig-paths/register` bridges the gap** between tsconfig.json and runtime

### When to Use:
- ✅ Any `ts-node` command that uses path aliases
- ✅ Seed scripts, dev servers, debug commands
- ✅ Before importing application code with aliases

### How to Use:
```bash
ts-node -r tsconfig-paths/register your-script.ts
```

### Benefits:
- ✅ Clean, maintainable imports
- ✅ Consistent with compiled code
- ✅ Easy to refactor/move files
- ✅ Follows Clean Architecture principles
- ✅ Works seamlessly with all tools

---

## 🔗 Related Files

- **tsconfig.json** - Defines path aliases
- **package.json** - Scripts using tsconfig-paths/register
- **scripts/seed-400-users.ts** - Example script requiring it
- **shared/infrastructure/** - External package aliased as `@shared/infrastructure`

---

**Conclusion:** `tsconfig-paths/register` is essential for running TypeScript files directly with path aliases. It's a small runtime helper that makes development much cleaner and more maintainable! ✨
