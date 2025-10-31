# Translation API Connection Fix

**Date:** October 31, 2025  
**Issue:** React Admin frontend showing 503 errors when trying to access Translation API  
**Status:** ✅ RESOLVED

---

## Problem Analysis

### Symptoms
```
POST http://localhost:8000/api/v1/translation/translate/batch 503 (Service Temporarily Unavailable)
GET http://localhost:8000/api/v1/translation/languages/active 503 (Service Temporarily Unavailable)

Error: name resolution failed
```

### Root Cause
The React Admin frontend is configured to access all backend services through **Kong API Gateway** at `http://localhost:8000`, but:

1. ❌ Kong Gateway was not running
2. ❌ Translation Service was not running
3. ❌ Auth Service was not running (required for auth routes)
4. ❌ User Service was not running (required for user data)
5. ❌ Customer Service was not running (required for dashboard stats)
6. ❌ Carrier Service was not running (required for dashboard stats)
7. ❌ Pricing Service was not running (required for complete functionality)

---

## Solution Applied

### 1. Started Kong API Gateway
```bash
cd /opt/cursor-project/fullstack-project/api-gateway
docker-compose -f docker-compose.kong.yml up -d
```

**Result:**
- ✅ Kong Gateway running on port 8000 (HTTP API)
- ✅ Kong Admin API running on port 8001
- ✅ Konga Dashboard running on port 1337
- ✅ Kong Database (PostgreSQL) running on port 5433

### 2. Started Backend Services
```bash
cd /opt/cursor-project/fullstack-project
docker-compose -f docker-compose.hybrid.yml up -d \
  translation-service \
  auth-service \
  user-service \
  customer-service \
  carrier-service \
  pricing-service
```

**Result:**
- ✅ Translation Service running on port 3007
- ✅ Auth Service running on port 3001
- ✅ User Service running on port 3003
- ✅ Customer Service running on port 3004
- ✅ Carrier Service running on port 3005
- ✅ Pricing Service running on port 3006
- ✅ All database dependencies healthy

### 3. Verified Kong Routes
```bash
# Check services
curl -s http://localhost:8001/services | jq -r '.data[] | {name, host, port}'

# Check routes
curl -s http://localhost:8001/routes | jq -r '.data[] | select(.name | contains("translation"))'
```

**Kong Configuration:**
- ✅ Service: `translation-service` → `http://translation-service:3007`
- ✅ Public Routes:
  - `/api/v1/translation/languages/active` (no auth required)
  - `/api/v1/translation/translate/batch` (no auth required)
  - `/api/v1/translation/health` (no auth required)
- ✅ Protected Routes:
  - `/api/v1/translation/translations` (requires JWT)
  - `/api/v1/translation/languages` (requires JWT)

### 4. Tested Endpoints
```bash
# Test active languages
curl http://localhost:8000/api/v1/translation/languages/active
# ✅ Returns 30 active languages

# Test batch translation
curl -X POST http://localhost:8000/api/v1/translation/translate/batch \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Hello", "World"], "targetLanguage": "fr"}'
# ✅ Returns translated text
```

---

## Current Service Status

### Running Services
| Service | Port | Status | Health |
|---------|------|--------|--------|
| Kong Gateway | 8000 | ✅ Running | Healthy |
| Kong Admin API | 8001 | ✅ Running | Healthy |
| Kong Database | 5433 | ✅ Running | Healthy |
| Konga Dashboard | 1337 | ✅ Running | - |
| Translation Service | 3007 | ✅ Running | Healthy |
| Auth Service | 3001 | ✅ Running | Healthy |
| User Service | 3003 | ✅ Running | Healthy |
| Customer Service | 3004 | ✅ Running | Healthy |
| Carrier Service | 3005 | ✅ Running | Healthy |
| Pricing Service | 3006 | ✅ Running | Healthy |
| Shared MySQL DB | 3306 | ✅ Running | Healthy |
| Shared Redis | 6379 | ✅ Running | Healthy |

### React Admin Configuration
Located in: `react-admin/src/config/api.ts`

```typescript
// All services route through Kong Gateway
const KONG_GATEWAY_URL = process.env.REACT_APP_KONG_GATEWAY_URL || 'http://localhost:8000';

export const TRANSLATION_API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8000/api/v1',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  TIMEOUT: 10000,
};
```

---

## Starting Services for Development

### Quick Start (All Services)
```bash
# 1. Start Kong Gateway first
cd /opt/cursor-project/fullstack-project/api-gateway
docker-compose -f docker-compose.kong.yml up -d

# 2. Start backend services
cd /opt/cursor-project/fullstack-project
docker-compose -f docker-compose.hybrid.yml up -d

# 3. Start React Admin (in separate terminal)
cd react-admin
npm start
```

### Minimal Start (Translation + Auth only)
```bash
# 1. Start Kong Gateway
cd /opt/cursor-project/fullstack-project/api-gateway
docker-compose -f docker-compose.kong.yml up -d

# 2. Start required services
cd /opt/cursor-project/fullstack-project
docker-compose -f docker-compose.hybrid.yml up -d \
  shared-user-db shared-redis \
  auth-service user-service translation-service

# 3. Start React Admin
cd react-admin
npm start
```

### Stop All Services
```bash
# Stop backend services
cd /opt/cursor-project/fullstack-project
docker-compose -f docker-compose.hybrid.yml down

# Stop Kong Gateway
cd /opt/cursor-project/fullstack-project/api-gateway
docker-compose -f docker-compose.kong.yml down
```

---

## Verification Steps

### 1. Verify Kong Gateway
```bash
curl http://localhost:8001/status
# Expected: {"database":{"reachable":true},...}
```

### 2. Verify Services
```bash
curl http://localhost:8000/api/v1/auth/health
curl http://localhost:8000/api/v1/translation/health
curl http://localhost:8000/api/v1/translation/languages/active
```

### 3. Verify React Admin
1. Open browser: `http://localhost:3000`
2. Check browser console for errors
3. Should see: "🔄 Fetching X auth labels for fr..."
4. Should NOT see: "503 Service Temporarily Unavailable"

---

## Architecture Overview

```
React Admin (http://localhost:3000)
         ↓
Kong API Gateway (http://localhost:8000)
         ↓
    ┌────────┴────────┬─────────────┬──────────────┐
    ↓                 ↓             ↓              ↓
Auth Service    Translation   User Service   Other Services
(port 3001)     (port 3007)   (port 3003)    (various ports)
```

### Benefits of Kong Gateway
- ✅ Centralized authentication (JWT validation)
- ✅ Rate limiting (300/min public, 50/min protected)
- ✅ CORS handling (no CORS errors in frontend)
- ✅ Request logging and monitoring
- ✅ Load balancing (when services scaled)
- ✅ Single entry point for frontend

---

## Troubleshooting

### Issue: "503 Service Temporarily Unavailable"
**Cause:** Backend service is not running  
**Fix:**
```bash
# Check which services are running
docker ps

# Start missing service
docker-compose -f docker-compose.hybrid.yml up -d <service-name>
```

### Issue: "name resolution failed"
**Cause:** Kong Gateway cannot resolve service hostname  
**Fix:**
```bash
# Verify service is in the same Docker network
docker inspect <service-name> | jq '.[].NetworkSettings.Networks'

# Should show: "fullstack-project-hybrid-network"
```

### Issue: "Connection refused"
**Cause:** Kong Gateway is not running  
**Fix:**
```bash
cd /opt/cursor-project/fullstack-project/api-gateway
docker-compose -f docker-compose.kong.yml up -d
```

### Issue: Kong routes not found
**Cause:** Auth service hasn't synced routes to Kong  
**Fix:**
```bash
# Restart auth service to trigger route sync
docker-compose -f docker-compose.hybrid.yml restart auth-service

# Check logs
docker logs auth-service --tail 50 | grep Kong
```

---

## Related Documentation

- **Kong Gateway Setup:** `api-gateway/QUICK-START.md`
- **Phase 2 Completion:** `PHASE-2-COMPLETION-SUMMARY.md`
- **Docker Compose Guide:** `docker-compose.hybrid.yml`
- **API Configuration:** `react-admin/src/config/api.ts`

---

## Status: ✅ RESOLVED

The Translation API is now fully accessible through Kong Gateway. The React Admin frontend can successfully:
- Load active languages
- Perform batch translations
- Use all translation features

**Next Steps:**
- Start React Admin development server: `cd react-admin && npm start`
- Test login flow: Auth service is running and configured
- Test language switching: Translation API is fully functional
