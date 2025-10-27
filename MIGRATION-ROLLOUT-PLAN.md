# TypeORM Migration Rollout Plan - Remaining 5 Services

## 📋 Executive Summary

**Objective:** Rollout TypeORM migration infrastructure to 5 remaining microservices  
**Template Service:** Pricing Service (completed Oct 27, 2025)  
**Target Services:** Translation, Customer, Carrier, User, Auth  
**Estimated Total Time:** 4-6 hours  
**Status:** 🎯 Ready to Begin

---

## 🎯 Services Overview

### Current State

| Service | Port | Database | Schema Tables | Current Mode | Migration Status | Priority |
|---------|------|----------|---------------|--------------|------------------|----------|
| **Pricing Service** | 3006 | pricing_service_db:3311 | 2 tables | ✅ **Migrations** | ✅ COMPLETE | Template |
| Translation Service | 3007 | translation_service_db:3312 | 3 tables | ⚠️ synchronize | 🔄 Pending | HIGH |
| Customer Service | 3004 | customer_service_db:3309 | ~3 tables | ⚠️ synchronize | 🔄 Pending | HIGH |
| Carrier Service | 3005 | carrier_service_db:3310 | ~3 tables | ⚠️ synchronize | 🔄 Pending | HIGH |
| User Service | 3003 | shared_user_db:3306 | ~4 tables | ⚠️ synchronize | 🔄 Pending | MEDIUM |
| Auth Service | 3001 | shared_user_db:3306 | ~4 tables | ⚠️ synchronize | 🔄 Pending | MEDIUM |

**Notes:**
- User Service + Auth Service share `shared_user_db` database
- User Service migration must be coordinated with Auth Service

---

## 🚀 Rollout Strategy

### Phase 1: Independent Services (High Priority)

**Services:** Translation, Customer, Carrier  
**Estimated Time:** 3 hours (1 hour each)  
**Can be done in parallel:** Yes

These services have independent databases and can be migrated without coordination.

### Phase 2: Shared Database Services (Medium Priority)

**Services:** User Service + Auth Service  
**Estimated Time:** 1.5 hours  
**Must be done together:** Yes

These services share `shared_user_db` and must be migrated as a coordinated effort.

### Phase 3: Verification & Documentation

**Estimated Time:** 0.5 hours  
**Activities:** Test all services, update documentation

---

## 📝 Migration Template (From Pricing Service)

### Required Files Per Service

1. **Migration File**
   - Location: `src/infrastructure/database/typeorm/migrations/XXXXXXXXXX-InitialSchema.ts`
   - Purpose: Create tables and indexes
   - Template: Copy from Pricing Service, adapt for service entities

2. **TypeORM Config**
   - Location: `typeorm.config.ts`
   - Purpose: CLI migration commands
   - Template: Copy from Pricing Service, update service-specific values

3. **Environment File**
   - Location: `.env.local`
   - Purpose: Localhost database connection for CLI
   - Template: Copy from Pricing Service, update ports and credentials

4. **Package.json Scripts**
   - Add: `typeorm`, `migration:show`, `migration:run`, `migration:revert`, `migration:generate`, `migration:create`
   - Template: Copy from Pricing Service

5. **App Module Update**
   - Change: `synchronize: true` → `synchronize: false`
   - Add: `migrations: [...], migrationsRun: true`
   - Template: Copy from Pricing Service app.module.ts

6. **Documentation**
   - Create: `MIGRATIONS-README.md` (comprehensive guide)
   - Create: `MIGRATION-SETUP-COMPLETE.md` (completion summary)
   - Create: `MIGRATION-QUICK-REFERENCE.md` (quick commands)
   - Template: Copy from Pricing Service, adapt for service

### Execution Checklist Per Service

- [ ] 1. Identify all TypeORM entities
- [ ] 2. Create migrations directory
- [ ] 3. Create typeorm.config.ts
- [ ] 4. Create .env.local with correct port
- [ ] 5. Add migration scripts to package.json
- [ ] 6. Generate initial schema migration
- [ ] 7. Review migration SQL
- [ ] 8. Update app.module.ts (disable synchronize)
- [ ] 9. Build service (`npm run build`)
- [ ] 10. Run migration (`npm run migration:run`)
- [ ] 11. Restart service
- [ ] 12. Verify health endpoint
- [ ] 13. Verify API endpoints
- [ ] 14. Verify data integrity
- [ ] 15. Create documentation
- [ ] 16. Update TODO.md

---

## 📋 Service-Specific Details

### 1. Translation Service (Port 3007)

**Priority:** HIGH  
**Database:** translation_service_db (Port 3312)  
**Complexity:** MEDIUM

**Entities:**
- `LanguageTypeOrmEntity`
- `TranslationTypeOrmEntity`
- `TranslationContextTypeOrmEntity`

**Expected Indexes:**
- Languages: code (unique), isActive, createdAt
- Translations: original, languageCode, context, createdAt
- TranslationContext: module, category, createdAt

**Data Volume:**
- 30 languages
- 764 translations
- Critical for production

**Port Mapping:**
```
DB_HOST=localhost
DB_PORT=3312  # External port
```

**Estimated Time:** 1 hour

---

### 2. Customer Service (Port 3004)

**Priority:** HIGH  
**Database:** customer_service_db (Port 3309)  
**Complexity:** LOW

**Entities:**
- `CustomerTypeOrmEntity`
- (Possibly: `CustomerContactTypeOrmEntity`, `CustomerAddressTypeOrmEntity`)

**Expected Indexes:**
- Customers: email (unique), name, isActive, createdAt

**Data Volume:**
- Test/development data
- Non-critical for migration

**Port Mapping:**
```
DB_HOST=localhost
DB_PORT=3309  # External port
```

**Estimated Time:** 1 hour

---

### 3. Carrier Service (Port 3005)

**Priority:** HIGH  
**Database:** carrier_service_db (Port 3310)  
**Complexity:** LOW

**Entities:**
- `CarrierTypeOrmEntity`
- (Possibly: `CarrierServiceTypeOrmEntity`, `CarrierRateTypeOrmEntity`)

**Expected Indexes:**
- Carriers: code (unique), name, isActive, createdAt

**Data Volume:**
- Test/development data
- Non-critical for migration

**Port Mapping:**
```
DB_HOST=localhost
DB_PORT=3310  # External port
```

**Estimated Time:** 1 hour

---

### 4. User Service (Port 3003) + Auth Service (Port 3001)

**Priority:** MEDIUM  
**Database:** shared_user_db (Port 3306) - **SHARED**  
**Complexity:** HIGH (Coordination required)

**Shared Entities:**
- `UserTypeOrmEntity` (used by both services)
- `RoleTypeOrmEntity` (used by both services)
- (Auth-specific: `RefreshTokenTypeOrmEntity`)

**Expected Indexes:**
- Users: email (unique), username (unique), isActive, createdAt
- Roles: name (unique), code (unique), createdAt
- RefreshTokens: userId, token, expiresAt, createdAt

**Data Volume:**
- Production user data
- Critical for authentication

**Port Mapping:**
```
DB_HOST=localhost
DB_PORT=3306  # External port
```

**Coordination Required:**
- Both services must share the same migration
- Migration must be created in one service and copied to the other
- Both services must update app.module.ts simultaneously
- Both services must restart together

**Estimated Time:** 1.5 hours (coordination overhead)

---

## 🛠️ Step-by-Step Process

### Service Migration Template

#### Step 1: Prepare Environment

```bash
cd /opt/cursor-project/fullstack-project/[service-name]

# Create migrations directory
mkdir -p src/infrastructure/database/typeorm/migrations

# Copy typeorm.config.ts from Pricing Service
cp ../pricing-service/typeorm.config.ts .

# Edit typeorm.config.ts with service-specific values
```

#### Step 2: Create .env.local

```bash
# Copy template from Pricing Service
cp ../pricing-service/.env.local .

# Edit .env.local with correct port and credentials
```

Example `.env.local`:
```env
# Database Configuration (Localhost for Migration CLI)
DB_HOST=localhost
DB_PORT=XXXX  # Service-specific external port
DB_USERNAME=[service]_user
DB_PASSWORD=[service]_password
DB_NAME=[service]_db

NODE_ENV=development
```

#### Step 3: Update package.json

```bash
# Add migration scripts (copy from Pricing Service)
```

```json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm -- migration:generate -d typeorm.config.ts",
    "migration:create": "npm run typeorm -- migration:create",
    "migration:run": "npm run typeorm -- migration:run -d typeorm.config.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d typeorm.config.ts",
    "migration:show": "npm run typeorm -- migration:show -d typeorm.config.ts"
  }
}
```

#### Step 4: Generate Initial Migration

```bash
# Generate migration from entities
npm run migration:generate src/infrastructure/database/typeorm/migrations/InitialSchema

# Review the generated migration file
cat src/infrastructure/database/typeorm/migrations/*-InitialSchema.ts
```

#### Step 5: Update app.module.ts

```typescript
// Before:
synchronize: process.env.NODE_ENV !== "production",

// After:
migrations: ["dist/infrastructure/database/typeorm/migrations/*.js"],
migrationsRun: true, // Auto-run migrations on startup
synchronize: false,  // Disabled - using migrations
```

#### Step 6: Execute Migration

```bash
# Build the service
npm run build

# Show migration status
npm run migration:show

# Run the migration
npm run migration:run

# Restart service
cd ..
docker-compose -f docker-compose.hybrid.yml restart [service-name]
```

#### Step 7: Verify Service

```bash
# Health check
curl http://localhost:[PORT]/api/v1/health

# Check API endpoints
curl http://localhost:[PORT]/api/v1/[resource]?page=1&limit=5

# Verify data integrity
# (Check that existing records are preserved)
```

#### Step 8: Create Documentation

Create three documentation files (copy templates from Pricing Service):

1. **MIGRATIONS-README.md** - Comprehensive guide
2. **MIGRATION-SETUP-COMPLETE.md** - Completion summary
3. **MIGRATION-QUICK-REFERENCE.md** - Quick commands

#### Step 9: Update TODO.md

Mark the service migration as complete with details.

---

## 🎯 Recommended Order

### Option A: Sequential (Safer)

1. **Translation Service** (1 hour)
2. **Customer Service** (1 hour)
3. **Carrier Service** (1 hour)
4. **User Service + Auth Service** (1.5 hours, coordinated)
5. **Verification & Documentation** (0.5 hours)

**Total:** ~5 hours

### Option B: Parallel (Faster)

**Day 1:**
- Translation Service (1 hour)
- Customer Service (1 hour) - parallel
- Carrier Service (1 hour) - parallel

**Day 2:**
- User Service + Auth Service (1.5 hours, coordinated)
- Verification & Documentation (0.5 hours)

**Total:** ~2 days (wall clock time), 4 hours (work time)

---

## ✅ Success Criteria

For each service, verify:

- [ ] Migration file created and executed
- [ ] `typeorm_migrations` table contains migration record
- [ ] All tables exist with correct schema
- [ ] All indexes created for performance
- [ ] `synchronize: false` in app.module.ts
- [ ] `migrationsRun: true` in app.module.ts
- [ ] Service health endpoint responds
- [ ] API endpoints working
- [ ] Data integrity maintained (no data loss)
- [ ] Service logs show no errors
- [ ] Documentation created (3 files)
- [ ] TODO.md updated

---

## 🧪 Testing Plan

### Per-Service Testing

After each migration:

```bash
# 1. Health check
curl http://localhost:[PORT]/api/v1/health

# 2. Database schema verification
docker exec [service]-db mysql -u [user] -p[password] [database] -e "SHOW TABLES;"

# 3. Migration table check
docker exec [service]-db mysql -u [user] -p[password] [database] -e "SELECT * FROM typeorm_migrations;"

# 4. Index verification
docker exec [service]-db mysql -u [user] -p[password] [database] -e \
  "SELECT TABLE_NAME, INDEX_NAME FROM information_schema.statistics \
   WHERE table_schema = '[database]' AND index_name LIKE 'IDX_%';"

# 5. Data integrity check
curl "http://localhost:[PORT]/api/v1/[resource]?page=1&limit=100"
```

### Integration Testing

After all services migrated:

```bash
# Run full integration test suite
./scripts/phase16-integration-testing.sh

# Expected: 100% pass rate
```

---

## 📚 Reference Documentation

### Pricing Service (Template)

- **Migration README:** `/pricing-service/MIGRATIONS-README.md`
- **Setup Complete:** `/pricing-service/MIGRATION-SETUP-COMPLETE.md`
- **Quick Reference:** `/pricing-service/MIGRATION-QUICK-REFERENCE.md`
- **Integration Test:** `/integration-tests/pricing-service-migration-test.sh`

### TypeORM Documentation

- **Migrations:** https://typeorm.io/migrations
- **Data Source:** https://typeorm.io/data-source
- **Migration CLI:** https://typeorm.io/using-cli

### Project Documentation

- **Integration Testing:** `/INTEGRATION-TESTING-COMPLETE-OCT-27-2025.md`
- **API Standards:** `/docs/API-STANDARDS.md`
- **Winston Logging:** `/WINSTON-DEVELOPER-GUIDE.md`

---

## 🚨 Risks & Mitigation

### Risk 1: Data Loss

**Mitigation:**
- Always backup database before migration
- Test migration on development environment first
- Verify data integrity after migration
- Keep migration rollback script ready

### Risk 2: Service Downtime

**Mitigation:**
- Migrations run automatically on service startup
- Keep service restart time minimal
- Test migration locally before production
- Have rollback plan ready

### Risk 3: Shared Database Conflicts (User + Auth)

**Mitigation:**
- Create migration in User Service first
- Copy migration to Auth Service
- Update both app.module.ts files
- Restart both services simultaneously
- Verify both services operational

### Risk 4: Migration Errors

**Mitigation:**
- Review generated migration SQL before execution
- Test migration on local database first
- Check TypeORM entity definitions for errors
- Verify database connection before migration

---

## 📊 Progress Tracking

### Migration Status Dashboard

| Service | Prep | Config | Migration | Test | Docs | Status |
|---------|------|--------|-----------|------|------|--------|
| Pricing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ COMPLETE |
| Translation | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | 🔄 Pending |
| Customer | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | 🔄 Pending |
| Carrier | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | 🔄 Pending |
| User | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | 🔄 Pending |
| Auth | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | 🔄 Pending |

**Legend:**
- ⏳ Pending
- 🔄 In Progress
- ✅ Complete
- ❌ Failed

---

## 🎯 Next Action

**Ready to begin migration rollout!**

**Recommended First Service:** Translation Service (HIGH priority, independent database)

**Command to start:**
```bash
cd /opt/cursor-project/fullstack-project/translation-service
mkdir -p src/infrastructure/database/typeorm/migrations
```

Shall we proceed with Translation Service migration?

---

**Created:** October 27, 2025  
**Template Service:** Pricing Service (Completed)  
**Target:** 5 Remaining Services  
**Status:** 🎯 Ready to Begin  
**Estimated Completion:** ~4-6 hours
