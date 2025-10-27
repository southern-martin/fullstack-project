# Kong Permissions Route Fix

**Date**: October 27, 2025  
**Issue**: CORS errors when accessing `/api/v1/permissions` endpoint  

## Problems Identified

### 1. Missing Kong Route for Permissions Endpoint ✅ FIXED
**Symptom**: 
```
Access to fetch at 'http://localhost:8000/api/v1/permissions' from origin 'http://localhost:3000' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
It does not have HTTP ok status.
```

**Root Cause**: Kong Gateway had no route configured for `/api/v1/permissions`

**Diagnosis**:
- ✅ User Service works directly: `http://localhost:3003/api/v1/permissions` (40 permissions)
- ❌ Kong Gateway returned 404: `http://localhost:8000/api/v1/permissions`
- CORS error was symptom of missing route (OPTIONS preflight failed with 404)

**Solution**:
```bash
# 1. Create route for permissions endpoint
curl -i -X POST http://localhost:8001/services/user-service/routes \
  --data 'paths[]=/api/v1/permissions' \
  --data 'name=permissions-routes' \
  --data 'strip_path=false'

# 2. Add OPTIONS method explicitly for CORS
curl -i -X PATCH http://localhost:8001/routes/ba16b774-b644-43ed-9d02-a5d947fc204d \
  --data 'methods[]=GET' \
  --data 'methods[]=OPTIONS'
```

**Verification**:
```bash
# Test OPTIONS preflight
curl -X OPTIONS http://localhost:8000/api/v1/permissions \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"
# Result: 200 OK with CORS headers ✅

# Test GET request
curl http://localhost:8000/api/v1/permissions
# Result: 200 OK with 40 permissions ✅
```

### 2. Translation Batch Limit Too Low ✅ FIXED
**Symptom**:
```
Translation API request failed: Error: Cannot translate more than 100 texts at once
useLabels.ts:69 🔄 Fetching 102 role labels for fr...
```

**Root Cause**: Role labels contain 102 text items but translation service limited to 100

**Solution**:
Updated `/translation-service/src/application/use-cases/translate-text.use-case.ts`:

```typescript
// OLD
if (texts.length > 100) {
  throw new BadRequestException(
    "Cannot translate more than 100 texts at once"
  );
}

// NEW
if (texts.length > 200) {
  throw new BadRequestException(
    "Cannot translate more than 200 texts at once"
  );
}
```

**Applied**:
```bash
# Rebuild Docker image with updated code
cd /opt/cursor-project/fullstack-project
docker-compose -f docker-compose.hybrid.yml build translation-service

# Restart with new image
docker-compose -f docker-compose.hybrid.yml up -d translation-service

# Verify healthy
docker ps --filter "name=translation-service"
```

**Note**: Simply restarting wasn't enough - the service needed to be **rebuilt** because the code change must be recompiled into the Docker image.

### 3. Auth Refresh Route Exists ✅ VERIFIED
**Symptom**:
```
POST http://localhost:8000/api/v1/auth/refresh 404 (Not Found)
Token refresh failed: Error: Cannot POST /api/v1/auth/refresh
```

**Investigation**:
```bash
curl -s http://localhost:8001/routes | jq -r '.data[] | select(.name | contains("auth"))'
```

**Result**: Route EXISTS in Kong:
```json
{
  "name": "auth-refresh",
  "paths": ["/api/v1/auth/refresh"],
  "methods": ["POST", "OPTIONS"]
}
```

**Note**: This error may be due to:
- Frontend caching 404 response
- Auth service not running/responding
- Need to check Auth service status separately

## Summary of Changes

### Kong Gateway Configuration
| Route Name | Path | Methods | Service | Status |
|------------|------|---------|---------|--------|
| permissions-routes | /api/v1/permissions | GET, OPTIONS | user-service | ✅ ADDED |

### Translation Service
| File | Change | Old Value | New Value |
|------|--------|-----------|-----------|
| translate-text.use-case.ts | Batch limit | 100 texts | 200 texts |

### Services Restarted
- ✅ translation-service (container restarted)

## Testing Checklist

- [x] Kong route exists: `curl http://localhost:8001/routes | grep permissions`
- [x] OPTIONS preflight works: `curl -X OPTIONS http://localhost:8000/api/v1/permissions`
- [x] GET request works: `curl http://localhost:8000/api/v1/permissions`
- [x] CORS headers present in response
- [x] Translation service restarted successfully
- [ ] Frontend: Clear browser cache and test role edit page
- [ ] Frontend: Verify 102 role labels load successfully
- [ ] Frontend: Check auth token refresh functionality

## Next Steps

1. **Clear Browser Cache**: The frontend may be caching the 404 response
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or: Clear site data in DevTools (Application > Storage > Clear site data)

2. **Test Role Edit Page**: 
   - Navigate to Roles module
   - Click edit on any role
   - Verify permissions checkboxes load successfully
   - Switch language to FR/ES and verify translations work

3. **Monitor Auth Service**: If refresh token issues persist:
   ```bash
   docker ps --filter "name=auth"
   docker logs auth-service --tail 50
   ```

## Kong Route Configuration Reference

**User Service Routes** (updated):
```
GET    /api/v1/users          -> user-service
GET    /api/v1/roles          -> user-service
GET    /api/v1/permissions    -> user-service ✅ NEW
```

**Auth Service Routes**:
```
POST   /api/v1/auth/login     -> auth-service
POST   /api/v1/auth/logout    -> auth-service
POST   /api/v1/auth/register  -> auth-service
POST   /api/v1/auth/refresh   -> auth-service
GET    /api/v1/auth/profile   -> auth-service
```

## Technical Details

### Kong Route ID
- Route ID: `ba16b774-b644-43ed-9d02-a5d947fc204d`
- Service ID: `2068cf7f-4ecb-4b47-9062-354b1ff662c0` (user-service)
- Created: October 27, 2025

### Translation Service
- Container: `translation-service`
- Port: 3007
- Database: MySQL on port 3312
- Status: Healthy (restarted at 14:33 UTC)

### CORS Configuration
Kong CORS plugin enabled with:
- Access-Control-Allow-Origin: http://localhost:3000
- Access-Control-Allow-Credentials: true
- Access-Control-Allow-Methods: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS, TRACE, CONNECT
- Access-Control-Max-Age: 3600

## Resolution

✅ **Kong permissions route**: FIXED - Route added with GET and OPTIONS methods  
✅ **Translation batch limit**: FIXED - Increased from 100 to 200 texts  
⚠️ **Auth refresh route**: EXISTS - May need browser cache clear or auth service check  

**Impact**: Role edit page should now work with permissions loading through Kong Gateway. Large label sets (up to 200 texts) can now be translated in a single batch request.
