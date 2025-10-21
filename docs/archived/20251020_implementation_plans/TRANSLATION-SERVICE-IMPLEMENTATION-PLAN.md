# Translation Service Infrastructure Improvements - Implementation Plan

## 🎯 Overview

**Goal**: Implement comprehensive infrastructure improvements for Translation Service following Carrier Service v1.12.0 pattern

**Branch**: `feature/translation-service-infrastructure`
**Tag**: `v1.13.0-translation-service`
**Status**: 🚧 IN PROGRESS

## 📋 Implementation Checklist

### Phase 1: Docker Infrastructure (30 min)
- [ ] Update Dockerfile with NPM workspace pattern
- [ ] Change WORKDIR to `/app/translation-service`
- [ ] Copy shared infrastructure to `/app/shared/infrastructure`
- [ ] Let npm ci handle symlinks automatically
- [ ] Add scripts folder copy for seed execution
- [ ] Improve health check configuration (timeout: 10s, start-period: 30s)
- [ ] Use curl for health checks instead of Node script

### Phase 2: Database Migration (30 min)
- [ ] Update app.module.ts: PostgreSQL → MySQL
- [ ] Change database type from 'postgres' to 'mysql'
- [ ] Update port from 5432 to 3306
- [ ] Fix environment variables (DB_DATABASE → DB_NAME)
- [ ] Import TypeORM entities instead of domain entities
- [ ] Add charset: 'utf8mb4' for MySQL compatibility
- [ ] Register TypeORM entities in entities array

### Phase 3: TypeORM Configuration (45 min)
- [ ] Update application.module.ts with TypeORM entity registration
- [ ] Add TypeOrmModule.forFeature() for both entities
- [ ] Export repository interfaces for cross-module usage
- [ ] Export IEventBus if event-driven architecture exists
- [ ] Simplify interfaces.module.ts by importing ApplicationModule
- [ ] Fix TypeORM entity decorators for MySQL compatibility
- [ ] Remove duplicate unique indexes
- [ ] Simplify timestamp decorators

### Phase 4: Seed Script (1.5 hours)
- [ ] Create comprehensive language seed data (20-30 common languages)
- [ ] Add metadata for each language (flag, direction, region, currency, date format)
- [ ] Create sample translation keys for common UI elements
- [ ] Add production seed script (compiled JavaScript)
- [ ] Create local development convenience script
- [ ] Update package.json with seed commands
- [ ] Handle dynamic imports for dev/production environments

### Phase 5: Docker Compose Integration (30 min)
- [ ] Add translation-service to docker-compose.hybrid.yml
- [ ] Configure translation-service-db (MySQL 8.0)
- [ ] Set up environment variables
- [ ] Configure dependencies (shared-redis, user-service)
- [ ] Set up health checks
- [ ] Configure ports (3007:3007 for service, 3312:3306 for database)

### Phase 6: Documentation (1 hour)
- [ ] Create TRANSLATION-SERVICE-INFRASTRUCTURE-GIT-FLOW.md
- [ ] Create TRANSLATION-SERVICE-INFRASTRUCTURE-QUICK-REFERENCE.md
- [ ] Document all issues resolved
- [ ] Document seed data structure
- [ ] Add configuration reference
- [ ] Include testing procedures
- [ ] Add deployment instructions

## 🐛 Expected Issues (Based on Carrier Service Experience)

### Issue 1: MODULE_NOT_FOUND
**Expected Error**: `Cannot find module '@fullstack-project/shared-infrastructure'`
**Solution**: NPM workspace pattern with correct WORKDIR

### Issue 2: PostgreSQL Driver Missing
**Expected Error**: `DriverPackageNotInstalledError: Postgres package has not been found`
**Solution**: Change to MySQL configuration

### Issue 3: TypeORM Entity Not Found
**Expected Error**: `EntityMetadataNotFoundError: No metadata for entities`
**Solution**: Import and register TypeORM entities

### Issue 4: Dependency Injection Failure
**Expected Error**: `Nest can't resolve dependencies`
**Solution**: Add TypeOrmModule.forFeature([...entities])

### Issue 5: MySQL Timestamp Error
**Expected Error**: `QueryFailedError: Invalid default value`
**Solution**: Simplify @CreateDateColumn() and @UpdateDateColumn()

### Issue 6: Duplicate Unique Index
**Expected Error**: `QueryFailedError: Duplicate key name`
**Solution**: Remove entity-level unique indexes

## 📊 Seed Data Plan

### Languages (30 Common Languages)

#### Major Languages
- English (en-US) - Default
- Spanish (es-ES)
- French (fr-FR)
- German (de-DE)
- Italian (it-IT)
- Portuguese (pt-BR)
- Russian (ru-RU)
- Chinese Simplified (zh-CN)
- Chinese Traditional (zh-TW)
- Japanese (ja-JP)
- Korean (ko-KR)
- Arabic (ar-SA) - RTL

#### European Languages
- Dutch (nl-NL)
- Polish (pl-PL)
- Swedish (sv-SE)
- Danish (da-DK)
- Norwegian (no-NO)
- Finnish (fi-FI)
- Greek (gr-GR)
- Czech (cs-CZ)
- Hungarian (hu-HU)

#### Asian Languages
- Hindi (hi-IN)
- Thai (th-TH)
- Vietnamese (vi-VN)
- Indonesian (id-ID)
- Malay (ms-MY)

#### Other Languages
- Turkish (tr-TR)
- Hebrew (he-IL) - RTL
- Persian (fa-IR) - RTL
- Ukrainian (uk-UA)
- Romanian (ro-RO)

### Sample Translation Keys (100+ translations per language)

#### Common UI Elements
- `common.save` → "Save"
- `common.cancel` → "Cancel"
- `common.delete` → "Delete"
- `common.edit` → "Edit"
- `common.create` → "Create"
- `common.search` → "Search"
- `common.filter` → "Filter"
- `common.loading` → "Loading..."
- `common.error` → "Error"
- `common.success` → "Success"

#### Navigation
- `nav.home` → "Home"
- `nav.dashboard` → "Dashboard"
- `nav.users` → "Users"
- `nav.customers` → "Customers"
- `nav.carriers` → "Carriers"
- `nav.pricing` → "Pricing"
- `nav.translations` → "Translations"
- `nav.settings` → "Settings"
- `nav.logout` → "Logout"

#### Forms
- `form.email` → "Email"
- `form.password` → "Password"
- `form.firstName` → "First Name"
- `form.lastName` → "Last Name"
- `form.phone` → "Phone"
- `form.address` → "Address"
- `form.required` → "Required"
- `form.invalid` → "Invalid"

#### Messages
- `message.success.created` → "Successfully created"
- `message.success.updated` → "Successfully updated"
- `message.success.deleted` → "Successfully deleted"
- `message.error.generic` → "An error occurred"
- `message.error.notFound` → "Not found"
- `message.error.unauthorized` → "Unauthorized"

## 🔧 Configuration

### Environment Variables
```env
# Database
DB_HOST=translation-service-db
DB_PORT=3306
DB_USERNAME=translation_user
DB_PASSWORD=translation_password
DB_NAME=translation_service_db

# Redis
REDIS_HOST=shared-redis
REDIS_PORT=6379
REDIS_PASSWORD=shared_redis_password_2024
REDIS_KEY_PREFIX=translation

# Service
NODE_ENV=development
PORT=3007
```

### Docker Ports
- **Service**: 3007:3007
- **Database**: 3312:3306 (external:internal)

## 📝 Git Flow Commands

```bash
# Create feature branch
git checkout develop
git checkout -b feature/translation-service-infrastructure

# Make all changes...

# Stage changes
git add translation-service/
git add docker-compose.hybrid.yml
git add TRANSLATION-SERVICE-INFRASTRUCTURE-*.md

# Commit
git commit -m "feat(translation): comprehensive infrastructure improvements

- Docker NPM workspace migration (MODULE_NOT_FOUND fix)
- PostgreSQL to MySQL database migration
- TypeORM entity registration and dependency injection fixes
- 30 common languages seed script with comprehensive metadata
- 100+ sample translation keys for UI elements
- Production-ready seed execution
- Local development tools
- Integration with hybrid Docker orchestration

Issues Resolved:
- MODULE_NOT_FOUND error
- PostgreSQL driver missing
- TypeORM entity not found
- Dependency injection failures
- MySQL timestamp errors
- Duplicate unique index
- Scripts folder missing in Docker

Files Changed: 13 (11 modified, 2 new)
Languages: 30 (English, Spanish, French, German, Chinese, Japanese, Arabic, etc.)
Translation Keys: 100+ common UI elements"

# Merge to develop
git checkout develop
git merge --no-ff feature/translation-service-infrastructure -m "Merge feature/translation-service-infrastructure into develop"

# Tag
git tag -a v1.13.0-translation-service -m "Translation Service Infrastructure Improvements v1.13.0"

# Push
git push origin develop
git push origin v1.13.0-translation-service
```

## ⏱️ Estimated Timeline

- **Phase 1** (Docker): 30 minutes
- **Phase 2** (Database): 30 minutes
- **Phase 3** (TypeORM): 45 minutes
- **Phase 4** (Seed): 1.5 hours
- **Phase 5** (Docker Compose): 30 minutes
- **Phase 6** (Documentation): 1 hour
- **Testing & Verification**: 30 minutes
- **Git Flow Execution**: 15 minutes

**Total**: ~5 hours

## ✅ Success Criteria

- [ ] Translation Service builds successfully
- [ ] Service starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] API endpoints return valid JSON
- [ ] Database connection established
- [ ] TypeORM schema synchronized
- [ ] 30 languages seeded successfully
- [ ] 100+ translation keys per language
- [ ] All critical issues resolved
- [ ] Documentation complete
- [ ] Git Flow executed
- [ ] Tag created

## 🎯 Next Steps After Completion

1. Test Translation API endpoints
2. Integrate with React Admin
3. Test language switching functionality
4. Verify RTL languages (Arabic, Hebrew, Persian)
5. Performance testing with large translation sets
6. Consider Pricing Service next

---

**Status**: 🚧 IN PROGRESS
**Started**: Now
**Expected Completion**: ~5 hours
