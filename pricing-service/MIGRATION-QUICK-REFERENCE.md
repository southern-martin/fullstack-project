# Pricing Service - Migration Quick Reference

## 🚀 Quick Commands

### Show Migration Status
```bash
cd pricing-service
npm run migration:show
```

### Run Pending Migrations
```bash
cd pricing-service
npm run migration:run
```

### Revert Last Migration
```bash
cd pricing-service
npm run migration:revert
```

### Generate New Migration (from entity changes)
```bash
cd pricing-service
npm run migration:generate -- src/infrastructure/database/typeorm/migrations/AddNewField
```

### Create Empty Migration (for custom SQL)
```bash
cd pricing-service
npm run migration:create -- src/infrastructure/database/typeorm/migrations/CustomChanges
```

## 📊 Current Schema

### pricing_rules
- `id` - Primary key
- `name` - Rule name (indexed)
- `description` - Rule description
- `isActive` - Active status (indexed)
- `conditions` - JSON: Matching conditions
- `pricing` - JSON: Pricing details
- `priority` - Rule priority (indexed)
- `validFrom` - Start date (indexed)
- `validTo` - End date (indexed)
- `createdAt` - Created timestamp (indexed)
- `updatedAt` - Updated timestamp

### price_calculations
- `id` - Primary key
- `requestId` - Unique request ID
- `request` - JSON: Original request
- `calculation` - JSON: Calculation breakdown
- `appliedRules` - JSON: Applied rules
- `calculatedAt` - Calculation timestamp (indexed)
- `createdAt` - Created timestamp (indexed)
- `updatedAt` - Updated timestamp

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `typeorm.config.ts` | TypeORM CLI configuration |
| `.env.local` | Local database connection (localhost:3311) |
| `.env` | Docker database connection (pricing-service-db:3306) |
| `src/app.module.ts` | Runtime TypeORM configuration |

## ⚙️ Environment Variables

### For CLI (from host machine)
```bash
DB_HOST=localhost
DB_PORT=3311
DB_USERNAME=pricing_user
DB_PASSWORD=pricing_password
DB_NAME=pricing_service_db
```

### For Docker (in container)
```bash
DB_HOST=pricing-service-db
DB_PORT=3306
DB_USERNAME=pricing_user
DB_PASSWORD=pricing_password
DB_NAME=pricing_service_db
```

## 📁 Directory Structure

```
pricing-service/
├── src/
│   └── infrastructure/
│       └── database/
│           └── typeorm/
│               ├── entities/
│               │   ├── pricing-rule.typeorm.entity.ts
│               │   └── price-calculation.typeorm.entity.ts
│               ├── migrations/
│               │   └── 1730013600000-InitialSchema.ts
│               └── repositories/
├── typeorm.config.ts
├── .env
├── .env.local
├── MIGRATIONS-README.md
└── MIGRATION-SETUP-COMPLETE.md
```

## 🔄 Typical Workflow

1. **Modify entity** in `src/infrastructure/database/typeorm/entities/`
2. **Generate migration**:
   ```bash
   npm run migration:generate -- src/infrastructure/database/typeorm/migrations/DescriptiveName
   ```
3. **Review migration** file
4. **Run migration**:
   ```bash
   npm run migration:run
   ```
5. **Test changes**
6. **Commit to Git**

## ✅ Verification

### Check Service Health
```bash
curl http://localhost:3006/api/v1/health | jq
```

### Check Pricing Rules
```bash
curl "http://localhost:3006/api/v1/pricing/rules?page=1&limit=5" | jq
```

### Check Docker Status
```bash
docker ps | grep pricing
```

## 🆘 Troubleshooting

### Migration Already Executed
```bash
npm run migration:show  # Check status
npm run migration:revert  # Revert if needed
```

### Database Connection Failed
- Check if Docker containers are running
- Verify .env.local has correct localhost settings
- Confirm database port (3311 for host access)

### Service Not Starting
```bash
docker logs pricing-service --tail 50
```

## 📚 Documentation

- Full Guide: `MIGRATIONS-README.md`
- Completion Summary: `MIGRATION-SETUP-COMPLETE.md`
- TypeORM Docs: https://typeorm.io/migrations

---

**Created**: October 27, 2025  
**Version**: 1.0.0
