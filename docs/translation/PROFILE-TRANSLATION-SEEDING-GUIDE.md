# Quick Start: Profile Translation Seeding

## Prerequisites

1. **Translation Service must be running**:
   ```bash
   # Check if Translation Service is running
   curl http://localhost:3007/health
   
   # If not running, start it:
   cd translation-service
   npm start
   # or
   docker-compose up -d translation-service
   ```

2. **Database must be accessible**:
   - Translation Service uses its own database
   - Check `translation-service/.env` for DB connection details

## Running the Seeder

### ✅ COMPLETED - Translation seeding successful!

**Results from last run:**
- ✅ Created: 100 translations
- ⏭️ Skipped: 14 (already exist)
- ❌ Errors: 0
- 📦 Total: 114 translations (57 labels × 2 languages)

### Option 1: Default (localhost:3007)
```bash
cd /opt/cursor-project/fullstack-project
node scripts/seed-profile-translations.js
```

**Note**: The seeder uses the correct Translation Service API format:
- Endpoint: `POST /api/v1/translation/translations`
- Payload format:
  ```json
  {
    "original": "English text",
    "destination": "Translated text",
    "languageCode": "fr",
    "context": { "module": "profile" },
    "isApproved": true
  }
  ```

### Option 2: Custom Translation Service URL
```bash
TRANSLATION_SERVICE_URL=http://localhost:3007 node scripts/seed-profile-translations.js
```

### Option 3: Docker Environment
```bash
# If using Docker Compose
TRANSLATION_SERVICE_URL=http://translation-service:3007 node scripts/seed-profile-translations.js
```

## Expected Output

### Success:
```
🌱 Starting Profile Module Translation Seeding...

📝 Seeding French (fr) translations...
................................................................
✅ French translations completed

📝 Seeding Spanish (es) translations...
................................................................
✅ Spanish translations completed

═══════════════════════════════════════════════
📊 Profile Translation Seeding Summary
═══════════════════════════════════════════════
✅ Created:  120+ translations
⏭️  Skipped:  0 (already exist)
❌ Errors:   0
📦 Total:    120+ translations (60+ labels x 2 languages)
═══════════════════════════════════════════════

🎉 Profile translation seeding completed successfully!
```

### If Translations Already Exist:
```
🌱 Starting Profile Module Translation Seeding...

📝 Seeding French (fr) translations...
ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
✅ French translations completed

📝 Seeding Spanish (es) translations...
ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
✅ Spanish translations completed

═══════════════════════════════════════════════
📊 Profile Translation Seeding Summary
═══════════════════════════════════════════════
✅ Created:  0 translations
⏭️  Skipped:  120+ (already exist)
❌ Errors:   0
📦 Total:    120+ translations (60+ labels x 2 languages)
═══════════════════════════════════════════════

🎉 Profile translation seeding completed successfully!
```

Legend:
- `.` = Translation created successfully
- `s` = Translation skipped (already exists)
- `x` = Error occurred

## Troubleshooting

### Error: "ECONNREFUSED"
```
❌ Error creating French translation: connect ECONNREFUSED 127.0.0.1:3007
```

**Solution**: Translation Service is not running. Start it:
```bash
cd translation-service
npm start
```

### Error: "HTTP 500"
```
❌ Error creating French translation: HTTP 500: Internal Server Error
```

**Solution**: Check Translation Service database connection:
```bash
cd translation-service
cat .env
# Verify DB credentials are correct
```

### Error: "Network timeout"
```
❌ Fatal error during seeding: Request timeout
```

**Solution**: Increase timeout or check network connectivity:
```bash
# Test connectivity
curl -X POST http://localhost:3007/api/v1/translations \
  -H "Content-Type: application/json" \
  -d '{"text":"test","translation":"test","language":"fr","namespace":"profile"}'
```

## Verification

After seeding, verify translations are in the database:

```bash
# Option 1: Via API
curl http://localhost:3007/api/v1/translations/profile/fr

# Option 2: Direct database query (if using PostgreSQL)
psql -h localhost -U <user> -d translation_db
SELECT COUNT(*) FROM translations WHERE namespace = 'profile' AND language = 'fr';
SELECT COUNT(*) FROM translations WHERE namespace = 'profile' AND language = 'es';
```

Expected counts:
- French (fr): 60+ translations
- Spanish (es): 60+ translations

## Testing in Browser

1. **Start React Admin**:
   ```bash
   cd react-admin
   npm start
   ```

2. **Navigate to Users**:
   - Go to http://localhost:3000/users
   - Click "View Details" on any user
   - Click "Profile" tab

3. **Test English** (default):
   - Verify all labels are in English
   - Create a profile
   - Edit the profile
   - Check toast messages

4. **Test French**:
   - Switch language to French (language selector in header)
   - Verify all labels are in French
   - Create/edit profile
   - Check toast messages

5. **Test Spanish**:
   - Switch language to Spanish
   - Verify all labels are in Spanish
   - Create/edit profile
   - Check toast messages

## Cleanup (if needed)

To remove all profile translations and re-seed:

```bash
# Via API (if endpoint exists)
curl -X DELETE http://localhost:3007/api/v1/translations/namespace/profile

# Via database (PostgreSQL example)
psql -h localhost -U <user> -d translation_db
DELETE FROM translations WHERE namespace = 'profile';
```

Then re-run the seeder:
```bash
node scripts/seed-profile-translations.js
```

## Summary

✅ **What the seeder does**:
- Creates 60+ French translations
- Creates 60+ Spanish translations
- Uses namespace 'profile'
- Skips duplicates automatically
- Reports detailed progress

✅ **What you need**:
- Translation Service running on port 3007
- Database accessible
- Node.js installed

✅ **Total time**: ~10-30 seconds (depending on network speed)

---

**Next Step**: After successful seeding, test in the browser by switching languages! 🌍
