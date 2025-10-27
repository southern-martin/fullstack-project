# Pricing Service - Database Migrations

This document explains the database migration setup and usage for the Pricing Service.

## Overview

The Pricing Service uses **TypeORM migrations** for database schema management instead of auto-synchronization. This approach provides:

- ✅ **Version Control**: Track all schema changes in Git
- ✅ **Production Safety**: No automatic schema changes in production
- ✅ **Rollback Support**: Revert migrations if needed
- ✅ **Team Collaboration**: Clear history of database changes
- ✅ **CI/CD Integration**: Automated migration runs in deployment pipelines

## Migration Files

Migrations are located in: `src/infrastructure/database/typeorm/migrations/`

### Current Migrations

| Migration | Description | Created |
|-----------|-------------|---------|
| `1730013600000-InitialSchema.ts` | Creates pricing_rules and price_calculations tables with indexes | 2025-10-27 |

## Database Schema

### Tables

#### `pricing_rules`
Stores pricing rules with conditions and pricing configurations.

**Columns:**
- `id` - Primary key (auto-increment)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
- `name` - Rule name (varchar 255, indexed)
- `description` - Rule description (text, nullable)
- `isActive` - Active status (boolean, indexed, default: true)
- `conditions` - JSON: Rule matching conditions
- `pricing` - JSON: Pricing details (rates, surcharges, discounts)
- `priority` - Rule priority (int, indexed, default: 0)
- `validFrom` - Validity start date (nullable, indexed)
- `validTo` - Validity end date (nullable, indexed)

**Indexes:**
- `IDX_pricing_rules_name` - Name lookup
- `IDX_pricing_rules_isActive` - Active rules filtering
- `IDX_pricing_rules_priority` - Priority sorting
- `IDX_pricing_rules_validFrom_validTo` - Date range queries
- `IDX_pricing_rules_createdAt` - Creation time sorting

#### `price_calculations`
Stores historical price calculations for audit and analytics.

**Columns:**
- `id` - Primary key (auto-increment)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
- `requestId` - Unique request identifier (varchar 255, unique)
- `request` - JSON: Original calculation request
- `calculation` - JSON: Calculation breakdown
- `appliedRules` - JSON: Rules applied in calculation (nullable)
- `calculatedAt` - Calculation timestamp (indexed)

**Indexes:**
- `IDX_price_calculations_calculatedAt` - Time-based queries
- `IDX_price_calculations_createdAt` - Creation time sorting

## Migration Commands

All migration commands are available as npm scripts:

### Show Migration Status
```bash
npm run migration:show
```
Shows all migrations and their status (executed or pending).

### Run Migrations
```bash
npm run migration:run
```
Executes all pending migrations in order. **Automatically runs on service startup** via `migrationsRun: true`.

### Revert Last Migration
```bash
npm run migration:revert
```
Reverts the most recently executed migration.

### Generate New Migration
```bash
npm run migration:generate -- src/infrastructure/database/typeorm/migrations/MigrationName
```
Generates a new migration file based on entity changes.

### Create Empty Migration
```bash
npm run migration:create -- src/infrastructure/database/typeorm/migrations/MigrationName
```
Creates an empty migration file for custom SQL.

## Workflow

### Development Workflow

1. **Modify entities** in `src/infrastructure/database/typeorm/entities/`
2. **Generate migration**:
   ```bash
   npm run migration:generate -- src/infrastructure/database/typeorm/migrations/AddNewField
   ```
3. **Review generated migration** file
4. **Run migration**:
   ```bash
   npm run migration:run
   ```
5. **Test changes** in your development environment
6. **Commit migration file** to Git

### Production Deployment

Migrations run automatically on service startup via `migrationsRun: true` in `app.module.ts`:

1. Build Docker image with new migration files
2. Deploy container
3. Service starts and runs pending migrations
4. Application becomes ready

## Configuration

### TypeORM DataSource (typeorm.config.ts)

Used by TypeORM CLI for migration commands:

```typescript
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3311"),
  username: process.env.DB_USERNAME || "pricing_user",
  password: process.env.DB_PASSWORD || "pricing_password",
  database: process.env.DB_NAME || "pricing_service_db",
  entities: [
    PricingRuleTypeOrmEntity,
    PriceCalculationTypeOrmEntity,
  ],
  migrations: ["src/infrastructure/database/typeorm/migrations/*.ts"],
  synchronize: false,
});
```

### Application Configuration (app.module.ts)

Used by the running application:

```typescript
TypeOrmModule.forRoot({
  // ... database config ...
  entities: [PricingRuleTypeOrmEntity, PriceCalculationTypeOrmEntity],
  migrations: ["dist/infrastructure/database/typeorm/migrations/*.js"],
  migrationsRun: true, // Auto-run migrations on startup
  synchronize: false,  // Disabled - using migrations
  logging: process.env.NODE_ENV === "development",
})
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3311` |
| `DB_USERNAME` | Database username | `pricing_user` |
| `DB_PASSWORD` | Database password | `pricing_password` |
| `DB_NAME` | Database name | `pricing_service_db` |

## Troubleshooting

### Migration already executed
If you see "This migration has already been executed":
```bash
npm run migration:show
```
Check which migrations have run. Revert if needed:
```bash
npm run migration:revert
```

### Schema out of sync
If manual changes were made to the database:
1. Restore database from backup or recreate
2. Run all migrations:
   ```bash
   npm run migration:run
   ```

### Migration fails on production
1. Check logs for specific error
2. If safe, revert migration:
   ```bash
   npm run migration:revert
   ```
3. Fix migration file
4. Redeploy with corrected migration

## Best Practices

1. ✅ **Never modify executed migrations** - Create new migrations instead
2. ✅ **Test migrations locally** before deploying to production
3. ✅ **Review generated migrations** - Auto-generated migrations may need adjustments
4. ✅ **Keep migrations small** - One logical change per migration
5. ✅ **Write reversible migrations** - Always implement the `down()` method
6. ✅ **Backup before production migrations** - Always have a rollback plan
7. ✅ **Use transactions** - TypeORM automatically wraps migrations in transactions
8. ✅ **Document complex migrations** - Add comments explaining why changes are made

## Migration History

### Version 1.0.0 - Initial Schema (2025-10-27)

**Migration:** `1730013600000-InitialSchema.ts`

Created the initial database schema with:
- `pricing_rules` table for storing pricing rules
- `price_calculations` table for calculation history
- Proper indexes for query performance
- JSON columns for flexible data structures

**Before:** Database managed with `synchronize: true`
**After:** Database managed with migrations

## Related Documentation

- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
- [Pricing Service README](../../../README.md)
- [Clean Architecture Guide](../../../CLEAN-ARCHITECTURE-REFACTOR.md)

## Support

For questions or issues with migrations:
1. Check this README
2. Review TypeORM documentation
3. Check migration execution logs
4. Contact the development team
