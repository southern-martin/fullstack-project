# Customer Service - Quick Reference Guide

## 🚀 Quick Start

### Generate 400 Customers (Local Development)
```bash
cd customer-service
bash scripts/seed-local.sh
```

**Expected Output**:
```
🌱 Generating 400 sample customers...
✅ Created 50 customers...
✅ Created 100 customers...
✅ Created 150 customers...
✅ Created 200 customers...
✅ Created 250 customers...
✅ Created 300 customers...
✅ Created 350 customers...
✅ Created 400 customers...

📊 Seeding Summary:
   ✅ Created: 400 customers
   ⚠️  Skipped: 0 customers
   ❌ Failed: 0 customers
🎉 Customer Service seeding completed successfully!
```

### Generate Customers (Docker Environment)
```bash
cd customer-service
npx ts-node -r tsconfig-paths/register scripts/seed-data.ts
```

## 📝 Seed Scripts

### seed-local.sh
**Purpose**: Local development with password-free Redis  
**Environment Overrides**:
- `REDIS_HOST=localhost`
- `REDIS_PASSWORD=""` (empty, no authentication)

### seed-data.ts
**Features**:
- Generates 400 realistic customers
- Diverse names: 160 first × 160 last = 25,600 combinations
- 25 US cities with realistic addresses
- 40 companies across 20 industries
- Random birth dates (1950-2005)
- Progress tracking every 50 customers
- Duplicate detection via email
- Auto-exit after 2 seconds

**Performance**: ~2 seconds for 400 customers

## 🔧 React Admin Integration

### API Response Structure
Backend returns:
```json
{
  "customers": [...],
  "total": 400,
  "page": 1,
  "limit": 10,
  "totalPages": 40
}
```

Frontend accesses:
```typescript
const response = await customerApiClient.getCustomers(params);
// ✅ Access directly: response.customers
// ❌ NOT: response.data.customers
```

### Fixed Methods (9 total)
1. `getCustomers()` - Paginated list
2. `getCustomer()` - Single by ID
3. `createCustomer()` - Create new
4. `updateCustomer()` - Update existing
5. `deleteCustomer()` - Delete
6. `getCustomerCount()` - Total count
7. `getCustomerAddresses()` - Get addresses
8. `addCustomerAddress()` - Add address
9. `updateCustomerAddress()` - Update address

## 🐳 Docker Commands

### Start Customer Service
```bash
docker-compose -f docker-compose.hybrid.yml up -d customer-service
```

### Check Service Health
```bash
curl http://localhost:3004/health
```

### View Logs
```bash
docker logs customer-service --tail 50
```

### Stop Service
```bash
docker-compose -f docker-compose.hybrid.yml stop customer-service
```

## 📊 Database

### Connection (Docker)
- **Host**: customer-service-db
- **Port**: 3306 (internal), 3309 (external)
- **Database**: customer_service_db
- **User**: customer_user
- **Password**: customer_password_2024

### Connection (Local)
- **Host**: localhost
- **Port**: 3309
- **Database**: customer_service_db

### Query Customer Count
```sql
SELECT COUNT(*) FROM customers;
```

## 🧪 Testing

### Manual API Testing
```bash
# Get all customers (paginated)
curl http://localhost:3004/api/v1/customers?page=1&limit=10

# Get customer by ID
curl http://localhost:3004/api/v1/customers/1

# Get customer count
curl http://localhost:3004/api/v1/customers/count

# Get active customers
curl http://localhost:3004/api/v1/customers/active
```

### React Admin Testing
1. Start backend: `docker-compose -f docker-compose.hybrid.yml up -d customer-service`
2. Start frontend: `cd react-admin && npm start`
3. Navigate to: http://localhost:3000/customers
4. Verify customer list loads without errors

## 🔍 Troubleshooting

### Issue: Redis AUTH errors
**Symptom**: 
```
NOAUTH Authentication required
```

**Solution**: Use `seed-local.sh` which sets `REDIS_PASSWORD=""`

### Issue: Script hangs after completion
**Symptom**: Script completes but doesn't exit

**Solution**: Already fixed with force-exit mechanism (2-second timeout)

### Issue: React Admin TypeError
**Symptom**: 
```
TypeError: Cannot read properties of undefined (reading 'customers')
```

**Solution**: Already fixed - customerService.ts now accesses `response.customers` directly

### Issue: Port 3004 already in use
**Solution**:
```bash
# Find process using port
lsof -i :3004

# Stop existing container
docker-compose -f docker-compose.hybrid.yml stop customer-service
```

## 📚 Related Documentation

- **Git Flow Summary**: `CUSTOMER-SERVICE-400-SEED-GIT-FLOW.md`
- **Service README**: `customer-service/README.md`
- **Architecture Review**: `customer-service/ARCHITECTURE-REVIEW.md`
- **Event Implementation**: `customer-service/EVENT-IMPLEMENTATION-SUMMARY.md`

## 🏷️ Version Information

- **Tag**: v1.8.0-customer-service
- **Branch**: develop
- **Feature Branch**: feature/customer-service-400-seed-and-react-admin-fix
- **Commit**: c51d5a2 (feature), 4943548 (merge), 69bc7d7 (docs)
- **Date**: October 19, 2025

## ✅ Status

- ✅ 400 customer seed data
- ✅ React Admin integration working
- ✅ Local development seamless
- ✅ Docker deployment healthy
- ✅ All API methods functional
- ✅ Documentation complete

**Overall**: Production Ready 🚀
