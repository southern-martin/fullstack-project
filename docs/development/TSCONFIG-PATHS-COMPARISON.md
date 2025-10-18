# 🔍 Auth Service vs User Service: tsconfig-paths Comparison

**Analysis Date:** October 18, 2025  
**Comparison:** Auth Service vs User Service path alias usage

---

## 📊 Quick Comparison

| Feature | Auth Service | User Service |
|---------|-------------|--------------|
| **Uses path aliases in tsconfig.json** | ✅ Yes | ✅ Yes |
| **Uses `@shared/infrastructure`** | ✅ Yes (10+ files) | ✅ Yes (10+ files) |
| **Has TypeScript seed scripts** | ❌ No | ✅ Yes (2 scripts) |
| **Uses `tsconfig-paths/register`** | ⚠️ Only in `test:debug` | ✅ In dev, seed, test |
| **Needs it added?** | ⚠️ Maybe (if scripts added) | ✅ Already correct |

---

## 🔧 Auth Service Current Setup

### Path Aliases Defined (tsconfig.json)

```json
{
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
```

**Same as User Service** ✅

---

### Usage in Code

**Files Using `@shared/infrastructure`:**

1. **Domain Events (6 files):**
   - `src/domain/events/password-changed.event.ts`
   - `src/domain/events/user-logged-in.event.ts`
   - `src/domain/events/login-failed.event.ts`
   - `src/domain/events/user-registered.event.ts`
   - `src/domain/events/token-validated.event.ts`
   - `src/domain/events/password-reset-requested.event.ts`

2. **Repository Interfaces (2 files):**
   - `src/domain/repositories/role.repository.interface.ts`
   - `src/domain/repositories/user.repository.interface.ts`

3. **Repository Implementations (2 files):**
   - `src/infrastructure/database/typeorm/repositories/role.repository.ts`
   - `src/infrastructure/database/typeorm/repositories/user.repository.ts`

**Total: 10 files** using `@shared/infrastructure` ✅

---

### npm Scripts (package.json)

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",              // ⚠️ No tsconfig-paths here
    "start:debug": "nest start --debug --watch",    // ⚠️ No tsconfig-paths here
    "start:prod": "node dist/main",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
  }
}
```

**Observations:**
- ✅ Uses `tsconfig-paths/register` in `test:debug`
- ⚠️ **Does NOT use it in `start:dev`** (but doesn't need to - using `nest start`)
- ❌ **No seed scripts** (unlike User Service)

---

### Scripts Directory

```
auth-service/scripts/
├── docker-build.sh
├── docker-cleanup-all.sh
├── docker-cleanup-system.sh
├── docker-cleanup.sh
├── docker-logs.sh
├── docker-start.sh
└── docker-stop.sh
```

**All bash scripts - no TypeScript scripts** ✅

This is why Auth Service doesn't need `tsconfig-paths/register` in most scripts!

---

## 🔧 User Service Current Setup

### Path Aliases Defined

**Same as Auth Service** ✅

### npm Scripts (package.json)

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "ts-node -r tsconfig-paths/register src/main.ts",    // ✅ Uses it
    "start:debug": "nest start --debug --watch",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "seed": "ts-node -r tsconfig-paths/register scripts/seed-data.ts",     // ✅ Uses it
    "seed:dev": "ts-node -r tsconfig-paths/register scripts/seed-data.ts --dev",  // ✅ Uses it
    "seed:400": "ts-node -r tsconfig-paths/register scripts/seed-400-users.ts"    // ✅ Uses it
  }
}
```

**Observations:**
- ✅ Uses `tsconfig-paths/register` in all `ts-node` commands
- ✅ Has TypeScript seed scripts that need it
- ✅ Custom `start:dev` with `ts-node` (needs it)

### Scripts Directory

```
user-service/scripts/
├── seed-data.ts          // TypeScript seed script
├── seed-400-users.ts     // TypeScript seed script
├── README.md
├── QUICK-START-SEED.md
└── SEED-400-IMPLEMENTATION-SUMMARY.md
```

**Has TypeScript scripts that import the app** ✅

---

## 🎯 Key Differences

### 1. Development Server

**Auth Service:**
```json
"start:dev": "nest start --watch"
```
- Uses NestJS CLI
- NestJS handles path resolution internally
- **Doesn't need `tsconfig-paths/register`** ✅

**User Service:**
```json
"start:dev": "ts-node -r tsconfig-paths/register src/main.ts"
```
- Uses `ts-node` directly
- Manual path resolution needed
- **Needs `tsconfig-paths/register`** ✅

---

### 2. Seed Scripts

**Auth Service:**
- ❌ No TypeScript seed scripts
- Only bash Docker scripts
- **Doesn't need `tsconfig-paths/register`** ✅

**User Service:**
- ✅ Has TypeScript seed scripts
- Scripts import app modules with path aliases
- **Needs `tsconfig-paths/register`** ✅

---

### 3. Test Scripts

**Both Services:**
```json
"test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
```
**Both use it for test debugging** ✅

---

## 🤔 Does Auth Service Need Changes?

### Current State: ✅ **CORRECT AS-IS**

**Why it's fine:**

1. **No TypeScript scripts:**
   - Auth Service only has bash scripts
   - No seed scripts to run with `ts-node`
   - Nothing that needs runtime path resolution

2. **Uses NestJS CLI for dev:**
   - `nest start --watch` handles paths internally
   - No manual `ts-node` execution
   - NestJS knows how to read `tsconfig.json`

3. **Only needs it for test:debug:**
   - Already configured correctly ✅
   - Jest with `ts-node` needs path resolution

### When Auth Service Would Need It:

**If you add TypeScript scripts:**
```json
// Example: If you add seed scripts like User Service
{
  "scripts": {
    "seed": "ts-node -r tsconfig-paths/register scripts/seed-data.ts"
  }
}
```

**If you change start:dev to use ts-node:**
```json
{
  "scripts": {
    "start:dev": "ts-node -r tsconfig-paths/register src/main.ts"
  }
}
```

---

## 📋 Summary Table

| Aspect | Auth Service | User Service | Needs tsconfig-paths? |
|--------|-------------|--------------|---------------------|
| **Path aliases defined** | ✅ Yes | ✅ Yes | - |
| **Uses @shared/infrastructure** | ✅ 10 files | ✅ 10+ files | - |
| **Development mode** | `nest start` | `ts-node` | User: ✅ |
| **TypeScript scripts** | ❌ None | ✅ Seed scripts | User: ✅ |
| **Test debug** | ✅ Has it | ✅ Has it | Both: ✅ |
| **Overall need** | ⚠️ Minimal | ✅ Essential | - |

---

## 🎯 Recommendations

### Auth Service: ✅ **No Changes Needed**

**Current setup is correct because:**
- Uses NestJS CLI (not raw `ts-node`)
- No TypeScript seed/utility scripts
- Only needs it for test debugging (already has it)

**Keep as-is unless you:**
- Add TypeScript seed scripts
- Switch from `nest start` to `ts-node` in development
- Add other TypeScript utility scripts

---

### User Service: ✅ **Already Correct**

**Current setup is correct because:**
- Uses `ts-node` for development
- Has TypeScript seed scripts
- Properly includes `tsconfig-paths/register` in all relevant commands

**No changes needed** ✅

---

## 🔍 Other Services Check

Should we check other services too?

| Service | Likely Status | Reason |
|---------|--------------|---------|
| **Carrier Service** | ⚠️ Check | May have scripts |
| **Customer Service** | ⚠️ Check | May have scripts |
| **Pricing Service** | ⚠️ Check | May have scripts |
| **Translation Service** | ⚠️ Check | May have scripts |

**Would you like me to check the other services?** 🔍

---

## 💡 Key Takeaway

**Auth Service doesn't need `tsconfig-paths/register` in most scripts because:**

1. ✅ Uses `nest start` (not `ts-node`) for development
2. ✅ No TypeScript seed scripts
3. ✅ Already has it where needed (test:debug)

**User Service needs it because:**

1. ✅ Uses `ts-node` directly
2. ✅ Has TypeScript seed scripts that import app modules
3. ✅ Scripts need runtime path resolution

**Both are configured correctly for their use cases!** 🎯
