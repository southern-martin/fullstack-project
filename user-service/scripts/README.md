# User Service - Seed Scripts

## Overview
This directory contains scripts to seed the database with test data for development and testing purposes.

---

## Available Scripts

### 1. **seed-data.ts** - Basic Seed (3 Users)
Creates minimal test data:
- 3 roles (admin, user, moderator)
- 3 users (one per role)

**Usage:**
```bash
npm run seed
```

**Default Users:**
| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin@example.com | Admin123 | Admin | Active |
| user@example.com | User123 | User | Active |
| moderator@example.com | Moderator123 | Moderator | Active |

---

### 2. **seed-400-users.ts** - Bulk Seed (400 Users) ⭐
Creates realistic bulk test data for pagination testing:
- 3 roles (admin, user, moderator)
- 400 users with diverse, realistic data

**Usage:**
```bash
npm run seed:400
```

**Features:**
- ✅ Realistic names (200+ first names, 120+ last names)
- ✅ Realistic email addresses (10 different domains)
- ✅ Randomized phone numbers
- ✅ Randomized dates of birth (18-80 years old)
- ✅ Randomized addresses (50+ US cities, all 50 states)
- ✅ Role distribution: 85% users, 10% moderators, 5% admins
- ✅ Status distribution: 80% active, 20% inactive
- ✅ Email verification: 70% verified, 30% not verified
- ✅ User preferences (theme, language, notifications)
- ✅ Metadata tracking (batch, source, index)
- ✅ Batch processing (50 users at a time)
- ✅ Progress tracking with real-time statistics
- ✅ Error handling with retry capability

**Total Users:** 400  
**Batch Size:** 50 users per batch (8 total batches)  
**Default Password:** `Password123!` for all users

---

## Usage Instructions

### Prerequisites
Make sure the user service is set up and the database is running:

```bash
# Start the shared database (from root directory)
cd shared-database
docker-compose up -d

# Or start entire stack
cd /opt/cursor-project/fullstack-project
docker-compose -f docker-compose.hybrid.yml up -d shared-mysql shared-redis
```

### Running Seed Scripts

#### Option 1: From User Service Directory
```bash
cd user-service
npm run seed:400
```

#### Option 2: From Root Directory
```bash
cd /opt/cursor-project/fullstack-project
npm --prefix user-service run seed:400
```

---

## Expected Output

### seed:400 Output Example:
```
🌱 Starting bulk user seeding (400 users)...
⏰ This may take a few minutes...

📝 Ensuring roles exist...
✅ Created role: admin
✅ Created role: user
✅ Created role: moderator
📊 Progress: 50/400 (12%) - ✅ 50 success, ❌ 0 failed - ⏱️  5.2s
📊 Progress: 100/400 (25%) - ✅ 100 success, ❌ 0 failed - ⏱️  10.5s
📊 Progress: 150/400 (38%) - ✅ 150 success, ❌ 0 failed - ⏱️  15.8s
📊 Progress: 200/400 (50%) - ✅ 200 success, ❌ 0 failed - ⏱️  21.1s
📊 Progress: 250/400 (62%) - ✅ 250 success, ❌ 0 failed - ⏱️  26.4s
📊 Progress: 300/400 (75%) - ✅ 300 success, ❌ 0 failed - ⏱️  31.7s
📊 Progress: 350/400 (88%) - ✅ 350 success, ❌ 0 failed - ⏱️  37.0s
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

💡 Tips:
   - ---

## 🔑 Sample Users

- Default password for all users: `Password123!`
   - User distribution: 85% users, 10% moderators, 5% admins
   - Status distribution: 80% active, 20% inactive
   - Test pagination with different page sizes (10, 25, 50, 100)
   - Try searching by name, email, or filtering by status
```

---

## Testing Pagination

After seeding 400 users, you can test pagination features:

### Via React Admin UI:
1. Navigate to `http://localhost:3000/users`
2. Test different page sizes: 10, 25, 50, 100
3. Navigate through pages
4. Search by name or email
5. Filter by status (active/inactive)
6. Sort by different columns

### Via API:
```bash
# Get first page (10 users)
curl http://localhost:3003/api/v1/users?page=1&limit=10

# Get page 5 with 25 users per page
curl http://localhost:3003/api/v1/users?page=5&limit=25

# Search users
curl http://localhost:3003/api/v1/users?search=john&page=1&limit=10

# Filter active users
curl http://localhost:3003/api/v1/users?isActive=true&page=1&limit=10

# Sort by email ascending
curl http://localhost:3003/api/v1/users?sortBy=email&sortOrder=asc&page=1&limit=10

# Combine filters
curl "http://localhost:3003/api/v1/users?search=smith&isActive=true&sortBy=firstName&sortOrder=asc&page=1&limit=25"
```

---

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Make sure you're in the user-service directory and dependencies are installed:
```bash
cd user-service
npm install
```

### Issue: Database connection errors
**Solution:** Ensure the database is running:
```bash
cd shared-database
docker-compose ps
docker-compose up -d
```

### Issue: "Role already exists" errors
**Solution:** This is normal if you've run the script before. Roles are skipped, users are created.

### Issue: Duplicate email errors
**Solution:** The script uses incremental numbers in emails to ensure uniqueness. If you run it multiple times, you may need to clear the database first:
```bash
# Clear user data (WARNING: This deletes all users!)
npm run seed:clear  # If this script exists
# Or manually truncate the users table
```

### Issue: Slow performance
**Solution:** 
- Increase batch size in the script (default: 50)
- Check database performance
- Ensure adequate system resources

---

## Performance Tips

### Optimize Batch Size
The script processes users in batches of 50. You can adjust this in the code:

```typescript
const batchSize = 100; // Increase for faster seeding (may increase memory usage)
```

### Database Optimization
For faster seeding, temporarily disable indexes:
```sql
-- Before seeding
ALTER TABLE users DISABLE KEYS;

-- Run seed script

-- After seeding
ALTER TABLE users ENABLE KEYS;
```

---

## Data Distribution

### Roles
- **Admin** (5%): ~20 users
- **Moderator** (10%): ~40 users
- **User** (85%): ~340 users

### Status
- **Active** (80%): ~320 users
- **Inactive** (20%): ~80 users

### Email Verification
- **Verified** (70%): ~280 users
- **Not Verified** (30%): ~120 users

### Demographics
- **Age Range**: 18-80 years old
- **Locations**: 50+ US cities across all 50 states
- **Themes**: Light, Dark, Auto
- **Languages**: English, Spanish, French, German

---

## Cleanup

To remove seeded data:

```bash
# Option 1: Drop and recreate database
docker-compose -f shared-database/docker-compose.yml down -v
docker-compose -f shared-database/docker-compose.yml up -d

# Option 2: Manual cleanup via SQL
# Connect to database and run:
# DELETE FROM users WHERE email LIKE '%.%@%';
# (Be careful! This will delete all users except system users)
```

---

## Customization

### Add More Names
Edit the `firstNames` and `lastNames` arrays in `seed-400-users.ts`

### Change Default Password
Edit the password in the user data object:
```typescript
password: "YourPassword123", // Change this
```

### Adjust Role Distribution
Modify the role assignment logic:
```typescript
// Current: 5% admin, 10% moderator, 85% user
if (roleRandom < 0.05) {  // Change this percentage
  roleIds = [1]; // admin
}
```

### Add Custom Fields
Add additional fields to the `userData` object:
```typescript
const userData = {
  // ... existing fields
  customField: "your value",
};
```

---

## Tips for Testing

1. **Pagination:**
   - Test with page sizes: 10, 25, 50, 100
   - Navigate to last page (page 40 with size 10)
   - Test edge cases (page 0, page 1000)

2. **Search:**
   - Search for common names: "John", "Smith"
   - Search for emails: "@gmail.com"
   - Search for partial matches

3. **Filtering:**
   - Filter by active/inactive status
   - Filter by role
   - Combine multiple filters

4. **Sorting:**
   - Sort by firstName, lastName, email
   - Test ascending/descending
   - Sort by createdAt (newest/oldest first)

5. **Performance:**
   - Load test with 400 users
   - Check response times for different page sizes
   - Monitor memory usage

---

## Notes

- Default password for all users: `Password123`
- All users are created with realistic, randomized data
- Emails are unique (includes sequential numbers)
- Phone numbers follow US format: +1XXXXXXXXXX
- Addresses are randomized but realistic (real US cities/states)
- Metadata tracks batch number and source for analytics
- Script includes progress tracking and error handling
- Safe to run multiple times (will skip existing roles)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console output for error messages
3. Check database logs: `docker-compose logs shared-mysql`
4. Verify user service is running: `docker-compose ps user-service`

---

**Happy Testing! 🎉**
