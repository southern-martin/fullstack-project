# Translation Service - Migration Quick Reference 🚀

## One-Page Cheat Sheet

### Common Commands

```bash
# Show migration status
npm run migration:show

# Run pending migrations
npm run migration:run

# Rollback last migration
npm run migration:revert

# Generate migration from entity changes
npm run migration:generate src/infrastructure/database/typeorm/migrations/DescriptiveName

# Create empty migration (manual SQL)
npm run migration:create src/infrastructure/database/typeorm/migrations/CustomChange

# Build service (required before running migrations)
npm run build
```

### File Locations

| File | Purpose |
|------|---------|
| `typeorm.config.ts` | TypeORM CLI configuration |
| `src/infrastructure/database/database.module.ts` | Runtime database config |
| `src/infrastructure/database/typeorm/migrations/` | Migration source files (.ts) |
| `dist/infrastructure/database/typeorm/migrations/` | Compiled migrations (.js) |

### Database Connection

**Local Development**:
- Host: `localhost`
- Port: `3312`
- Database: `translation_service_db`
- User: `translation_user`
- Password: `translation_password`

**Docker Container**:
```bash
# Access database
docker exec -it translation-service-database mysql -u translation_user -ptranslation_password translation_service_db

# Check tables
docker exec translation-service-database mysql -u translation_user -ptranslation_password translation_service_db -e "SHOW TABLES;"

# Count records
docker exec translation-service-database mysql -u translation_user -ptranslation_password translation_service_db -e "SELECT COUNT(*) FROM languages;"
```

### Quick Workflows

#### Creating a New Migration

```bash
# 1. Modify entities in src/domain/entities/
# 2. Generate migration
npm run migration:generate src/infrastructure/database/typeorm/migrations/AddNewField

# 3. Review generated migration file
cat src/infrastructure/database/typeorm/migrations/[timestamp]-AddNewField.ts

# 4. Build
npm run build

# 5. Run migration
npm run migration:run

# 6. Verify
npm run migration:show
```

#### Rolling Back a Migration

```bash
# 1. Revert last migration
npm run migration:revert

# 2. Build (to remove compiled migration)
npm run build

# 3. Restart service
docker-compose restart translation-service

# 4. Verify
curl http://localhost:3007/api/v1/health
```

#### Checking Migration Status

```bash
# Show all migrations and their status
npm run migration:show

# Output example:
# [X] InitialSchema1761561348872  <- Executed
# [ ] AddNewField1761562000000    <- Pending
```

### Troubleshooting

| Problem | Solution |
|---------|----------|
| "No changes found" | Tables already exist; use `migration:create` instead |
| SQL syntax error | Check MySQL compatibility; avoid `IF NOT EXISTS` for indexes |
| Migration won't run | Verify `synchronize: false` in `database.module.ts` |
| Can't connect to DB | Check port 3312, verify `.env.local` settings |
| Service won't start | Check logs: `docker-compose logs translation-service` |

### Health Checks

```bash
# Service health
curl http://localhost:3007/api/v1/health | jq

# Languages count (should be 30)
curl -s http://localhost:3007/api/v1/translation/languages | jq '.data | length'

# Test translation
curl -X POST http://localhost:3007/api/v1/translation/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"User","targetLanguage":"fr"}' | jq
```

### Migration File Template

```typescript
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class DescriptiveName1234567890123 implements MigrationInterface {
  name = "DescriptiveName1234567890123";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if table exists
    const tableExists = await queryRunner.hasTable("table_name");
    if (!tableExists) {
      await queryRunner.createTable(new Table({
        name: "table_name",
        columns: [
          { name: "id", type: "varchar", isPrimary: true, length: "36" },
          // ... more columns
        ]
      }), true);
    }

    // Check if index exists (MySQL-compatible)
    const table = await queryRunner.getTable("table_name");
    if (!table?.indices.find(idx => idx.name === "IDX_name")) {
      await queryRunner.query(`CREATE INDEX IDX_name ON table_name (column)`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the changes
    await queryRunner.query(`DROP INDEX IDX_name ON table_name`);
    await queryRunner.dropTable("table_name");
  }
}
```

### Production Deployment

```bash
# 1. Build
npm run build

# 2. Run migrations (before restarting service)
npm run migration:run

# 3. Verify migration success
npm run migration:show

# 4. Restart service
docker-compose restart translation-service

# 5. Verify health
curl http://localhost:3007/api/v1/health
```

### Key Configuration

**database.module.ts**:
```typescript
{
  synchronize: false,              // ✅ Disabled
  migrationsRun: true,             // ✅ Auto-run on startup
  migrations: ["dist/infrastructure/database/typeorm/migrations/*.js"]
}
```

**typeorm.config.ts**:
```typescript
{
  type: "mysql",
  port: 3312,                      // ✅ Local development port
  synchronize: false,              // ✅ Disabled
  migrations: ["src/infrastructure/database/typeorm/migrations/*.ts"]
}
```

### Important Notes

⚠️ **MySQL Compatibility**: Use programmatic checks instead of `IF NOT EXISTS` for indexes

⚠️ **Build Required**: Always run `npm run build` after creating/modifying migrations

⚠️ **Test Locally**: Run migrations on localhost:3312 before production

✅ **Idempotent**: Migrations check for existence before creating objects

✅ **Transactional**: Failed migrations auto-rollback

---

**For detailed documentation**: See `MIGRATIONS-README.md`  
**For completion summary**: See `MIGRATION-SETUP-COMPLETE.md`
