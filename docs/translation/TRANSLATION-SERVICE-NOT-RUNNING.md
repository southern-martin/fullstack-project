# URGENT: Translation Service Not Running

## Problem Identified

The Translation Service is **NOT RUNNING** on port 3007. This is why you're not seeing any translated labels!

```bash
# Test showed:
curl: (7) Failed to connect to localhost port 3007
```

## Solution: Start Translation Service

### Option 1: Start All Services (Recommended)

```bash
cd /opt/cursor-project/fullstack-project

# Start Docker (if not running)
# On Mac: Open Docker Desktop application

# Wait for Docker to start, then:
docker-compose -f docker-compose.hybrid.yml up -d

# Verify services are running
docker-compose -f docker-compose.hybrid.yml ps
```

### Option 2: Start Translation Service Only

```bash
cd /opt/cursor-project/fullstack-project/translation-service

# Start the service
docker-compose up -d

# Or run in development mode
npm run dev
```

### Option 3: Use Makefile

```bash
cd /opt/cursor-project/fullstack-project

# Start all services
make dev

# Or start translation service specifically
make translation-dev
```

## Verification Steps

### 1. Check Translation Service is Running

```bash
# Should return health status
curl http://localhost:3007/api/v1/health

# Expected response:
{
  "data": {
    "status": "ok",
    "service": "translation-service",
    "version": "1.0.0"
  }
}
```

### 2. Test Translation API

```bash
curl -s "http://localhost:3007/api/v1/translation/translate/batch" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "texts": ["User Details", "Profile"],
    "targetLanguage": "fr",
    "sourceLanguage": "en"
  }' | jq .
```

### 3. Verify Translations Exist

```bash
# Check profile translations
curl -s "http://localhost:3007/api/v1/translation/translations?limit=10" | jq .
```

## After Starting Translation Service

1. **Refresh your browser** (hard refresh: Cmd+Shift+R or Ctrl+Shift+R)
2. **Open React Admin**: http://localhost:3000
3. **Click the language selector** in the top-right corner
4. **Select "Français" or "Español"**
5. **Navigate to Users → View Details → Profile tab**
6. **All labels should now be translated!**

## Expected Behavior

Once Translation Service is running:

### In English (default):
- Profile tab label: "Profile"
- Create button: "Create Profile"
- Section: "Basic Information"

### In French:
- Profile tab label: "Profil"
- Create button: "Créer un profil"
- Section: "Informations de base"

### In Spanish:
- Profile tab label: "Perfil"
- Create button: "Crear perfil"
- Section: "Información básica"

## Troubleshooting

### Docker Not Running

**Error**: `Cannot connect to the Docker daemon`

**Solution**:
- **Mac**: Open Docker Desktop application
- **Linux**: `sudo systemctl start docker`
- **Windows**: Start Docker Desktop

### Port 3007 Already in Use

**Error**: `port 3007 is already allocated`

**Solution**:
```bash
# Find and kill process on port 3007
lsof -ti:3007 | xargs kill -9

# Then restart service
docker-compose -f docker-compose.hybrid.yml up -d translation-service
```

### Service Won't Start

**Check logs**:
```bash
# View Translation Service logs
docker-compose -f docker-compose.hybrid.yml logs translation-service

# Or if running in dev mode
cd translation-service
npm run dev
```

## Quick Start Commands

```bash
# 1. Start Docker Desktop (Mac)
open -a Docker

# 2. Wait 30 seconds for Docker to initialize

# 3. Start all services
cd /opt/cursor-project/fullstack-project
docker-compose -f docker-compose.hybrid.yml up -d

# 4. Wait for services to start (30 seconds)
sleep 30

# 5. Verify Translation Service
curl http://localhost:3007/api/v1/health

# 6. Open React Admin
open http://localhost:3000

# 7. Test language switching
# Click language selector → Select "Français"
# Navigate to Users → View Details → Profile
# ✅ All labels should be in French!
```

## Why This Happened

The translation system requires:
1. ✅ **Frontend code** - useProfileLabels hook implemented
2. ✅ **Translation data** - 114 translations seeded to database
3. ❌ **Translation Service running** - Was NOT running on port 3007

Without the Translation Service running:
- Frontend can't fetch translations
- Batch translate API calls fail
- Labels default to English (fallback)
- Language switching appears to do nothing

---

**Action Required**: Start the Translation Service, then test again!
