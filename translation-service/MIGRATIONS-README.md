# Translation Service - TypeORM Migrations Guide

## Overview

The Translation Service has been successfully migrated from TypeORM's `synchronize` mode to a **migration-based schema management** approach. This provides better control over database schema changes and enables safe production deployments.

## Migration System Architecture

### Configuration Files

1. **`typeorm.config.ts`** (Root directory)
   - TypeORM DataSource configuration for CLI commands
   - Connects to `localhost:3312` for local development
   - Includes entity paths and migration settings

2. **`src/infrastructure/database/database.module.ts`**
   - Runtime database configuration
   - Migration execution enabled (`migrationsRun: true`)
   - Auto-synchronization disabled (`synchronize: false`)

### Migration Location

```
src/infrastructure/database/typeorm/migrations/
├── 1761561348872-InitialSchema.ts   # Initial schema migration
└── [future migrations...]
```

Compiled migrations are located in:
```
dist/infrastructure/database/typeorm/migrations/
```

## Database Schema

### Tables

1. **`languages`**
   - Primary entity for language definitions
   - 30 languages currently stored
   - Indexes:
     - PRIMARY KEY (`id`)
     - IDX on `code` (UNIQUE)
     - IDX on `name`
     - IDX on `status`

2. **`language_values`**
   - Translation storage (sourceText → targetText)
   - 2,088+ translations currently stored
   - Indexes:
     - PRIMARY KEY (`id`)
     - UNIQUE KEY (`language_id`, `original`)
     - IDX on `language_id`
     - IDX on `original`
     - IDX on `destination`

3. **`typeorm_migrations`**
   - TypeORM's migration tracking table
   - Automatically managed by TypeORM

## Available NPM Scripts

```json
{
  "migration:generate": "Generate a new migration from entity changes",
  "migration:create": "Create an empty migration file",
  "migration:run": "Execute pending migrations",
  "migration:revert": "Revert the last executed migration",
  "migration:show": "Show migration status"
}
```

## Common Workflows

### Creating a New Migration

When you modify entities, create a migration to reflect the changes:

```bash
# Option 1: Auto-generate from entity changes
npm run migration:generate src/infrastructure/database/typeorm/migrations/DescriptiveName

# Option 2: Create an empty migration
npm run migration:create src/infrastructure/database/typeorm/migrations/DescriptiveName
```

### Running Migrations

```bash
# Show pending migrations
npm run migration:show

# Execute all pending migrations
npm run migration:run
```

### Reverting Migrations

```bash
# Revert the last executed migration
npm run migration:revert
```

## Migration Best Practices

### 1. Always Test Locally First

```bash
# Run against local database (port 3312)
npm run migration:run
```

### 2. Idempotent Migrations

Our migrations check for existence before creating objects:

```typescript
// Check if table exists
const tableExists = await queryRunner.hasTable("languages");
if (!tableExists) {
  await queryRunner.createTable(new Table({ ... }));
}

// Check if index exists
const table = await queryRunner.getTable("languages");
if (!table?.indices.find(idx => idx.name === "IDX_name")) {
  await queryRunner.query(`CREATE INDEX IDX_name ...`);
}
```

### 3. MySQL Compatibility Notes

⚠️ **Important**: MySQL does not support `CREATE INDEX IF NOT EXISTS` syntax.

**Incorrect:**
```typescript
await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_name ON table (column)`);
```

**Correct:**
```typescript
const table = await queryRunner.getTable("table_name");
if (!table?.indices.find(idx => idx.name === "idx_name")) {
  await queryRunner.query(`CREATE INDEX idx_name ON table (column)`);
}
```

### 4. Naming Conventions

- Migration files: `{timestamp}-{DescriptiveName}.ts`
- Index names: Use TypeORM's auto-generated format (`IDX_{hash}`) for consistency
- Table names: Use plural form matching entity names

### 5. Data Safety

- Always use transactions (TypeORM does this automatically)
- Test migrations on a copy of production data before deploying
- Keep `migration:revert` logic updated for rollback capability

## Deployment Workflow

### Local Development

1. Pull latest code
2. Run migrations: `npm run migration:run`
3. Start service: `npm run start:dev`

### Production Deployment

1. Build the application: `npm run build`
2. Run migrations: `npm run migration:run`
3. Restart service

**Note**: The service configuration includes `migrationsRun: true`, which automatically executes pending migrations on startup. However, for production, it's recommended to run migrations manually before service restart for better control.

## Troubleshooting

### Migration Fails with "No changes found"

This happens when:
- Tables already exist (from previous `synchronize: true` mode)
- Entity changes don't result in schema differences

**Solution**: Use `migration:create` to create an empty migration and manually write the changes.

### Migration Fails with SQL Syntax Error

Check for:
- MySQL-specific syntax compatibility
- Use of `IF NOT EXISTS` clauses (not supported in MySQL for indexes)

**Solution**: Implement existence checks programmatically (see "MySQL Compatibility Notes" above).

### Service Starts but Migrations Don't Run

Check:
1. `database.module.ts` has `migrationsRun: true`
2. `migrations` array points to compiled files: `dist/infrastructure/database/typeorm/migrations/*.js`
3. Migrations are compiled during `npm run build`

### Database Connection Issues

Verify:
- Database container is running: `docker ps | grep translation-service-database`
- Port 3312 is exposed and accessible
- Credentials match `.env.local` configuration

## Migration History

### 1761561348872-InitialSchema.ts

**Date**: October 27, 2025  
**Description**: Initial migration capturing existing schema from `synchronize` mode

**Changes**:
- Created `languages` table with 4 indexes
- Created `language_values` table with 5 indexes
- Migrated from auto-synchronization to migration-based management

**Data Impact**: None (tables already existed, migration is idempotent)

## References

- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
- [NestJS TypeORM Integration](https://docs.nestjs.com/techniques/database)
- Translation Service entities: `src/domain/entities/`

## Support

For issues with migrations:
1. Check this guide's Troubleshooting section
2. Review migration file logs: `npm run migration:show`
3. Verify database state: Connect to MySQL container
4. Consult TypeORM documentation for advanced scenarios
