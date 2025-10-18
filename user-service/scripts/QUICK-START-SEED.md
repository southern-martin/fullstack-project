# Quick Start - Seed 400 Users for Pagination Testing

## 🚀 One-Command Setup

```bash
# From user-service directory
npm run seed:400
```

## ⏱️ Expected Time
~40-60 seconds to create 400 users

## 📊 What You'll Get
- **400 users** with realistic names, emails, and data
- **3 roles**: Admin (5%), Moderator (10%), User (85%)
- **Mixed status**: 80% active, 20% inactive
- **Default password**: `Password123!` for all users

## ✅ Prerequisites

### 1. Start Database
```bash
cd /opt/cursor-project/fullstack-project
docker-compose -f docker-compose.hybrid.yml up -d shared-mysql shared-redis
```

### 2. Install Dependencies (if needed)
```bash
cd user-service
npm install
```

## 🎯 Run the Seed

```bash
cd user-service
npm run seed:400
```

## 📈 Test Pagination

### React Admin UI
1. Open: `http://localhost:3000/users`
2. See 400 users paginated
3. Test page sizes: 10, 25, 50, 100
4. Navigate pages, search, filter

### API Testing
```bash
# Page 1 (10 users)
curl http://localhost:3003/api/v1/users?page=1&limit=10

# Page 5 (25 users per page)
curl http://localhost:3003/api/v1/users?page=5&limit=25

# Search
curl http://localhost:3003/api/v1/users?search=john&page=1&limit=10

# Filter active users
curl http://localhost:3003/api/v1/users?isActive=true&page=1&limit=50
```

## 🔑 Sample Login Credentials

**All users have the same password:** `Password123!`

**Sample emails to try:**
- `charles.james312@mail.com`
- `zachary.kim313@yahoo.com`
- `sean.simmons314@hotmail.com`

Test in browser or API:
```bash
# Browser UI
Open: http://localhost:3000/login
Email: charles.james312@mail.com
Password: Password123!

# Or via API
curl -X POST http://localhost:3003/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"charles.james312@mail.com","password":"Password123!"}'
```

## 🧹 Cleanup (Optional)

To start fresh:
```bash
# Stop and remove database
cd shared-database
docker-compose down -v

# Restart database
docker-compose up -d

# Re-run seed
cd ../user-service
npm run seed:400
```

## 📝 Output Example

```
🌱 Starting bulk user seeding (400 users)...
⏰ This may take a few minutes...

📝 Ensuring roles exist...
✅ Created role: admin
✅ Created role: user
✅ Created role: moderator

📊 Progress: 50/400 (12%) - ✅ 50 success, ❌ 0 failed - ⏱️  5.2s
📊 Progress: 100/400 (25%) - ✅ 100 success, ❌ 0 failed - ⏱️  10.5s
...
📊 Progress: 400/400 (100%) - ✅ 400 success, ❌ 0 failed - ⏱️  42.3s

============================================================
🎉 Bulk user seeding completed!
============================================================
📊 Summary:
   Total Users Requested: 400
   ✅ Successfully Created: 400
   ❌ Failed: 0
   ⏱️  Total Time: 42.30s
   ⚡ Average: 9.46 users/second
============================================================
```

## ❓ Troubleshooting

**Database not running?**
```bash
docker-compose -f docker-compose.hybrid.yml up -d shared-mysql
```

**Permission errors?**
```bash
chmod +x scripts/seed-400-users.ts
```

**Module not found?**
```bash
cd user-service && npm install
```

---

**That's it! You now have 400 test users for pagination testing! 🎉**
