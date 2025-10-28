# Kong Gateway Health Check Routes Setup

## Overview

This document describes the health check route configuration for Kong Gateway to enable proper service health monitoring in React Admin.

## Problem Statement

React Admin's MicroservicesStatus component was showing all services (except Translation) as "unhealthy" even though Docker containers were healthy and direct health endpoint tests returned 200 OK.

### Root Cause

Kong Gateway did not have routes configured for the `/health` endpoints of each microservice. When React Admin attempted health checks through Kong Gateway (port 8000), the requests failed with 404 or routing errors.

### Why Translation Service Worked

Translation Service health checks worked because `react-admin/src/config/api.ts` configured it to bypass Kong Gateway with direct access:

```typescript
export const TRANSLATION_API_CONFIG = {
  BASE_URL: 'http://localhost:3007/api/v1/translation', // Direct access
  TIMEOUT: 10000
};
```

Other services route through Kong Gateway:

```typescript
export const USER_API_CONFIG = {
  BASE_URL: KONG_GATEWAY_URL + '/api/v1', // http://localhost:8000/api/v1
  TIMEOUT: 10000
};
```

## Solution Implementation

### Backend Changes

Added standardized `/health` endpoints to all microservice controllers:

#### 1. User Service (`user-service/src/interfaces/controllers/user.controller.ts`)

```typescript
@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Health check" })
  @ApiResponse({ status: 200, description: "Service is healthy" })
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    service: string;
    version: string;
    environment: string;
  }> {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "user-service",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    };
  }
}
```

**Route**: `/api/v1/health` (via global prefix)

#### 2. Customer Service (`customer-service/src/interfaces/controllers/customer.controller.ts`)

Added identical health endpoint pattern with `service: "customer-service"`.

**Route**: `/api/v1/health`

#### 3. Carrier Service (`carrier-service/src/interfaces/controllers/carrier.controller.ts`)

Added identical health endpoint pattern with `service: "carrier-service"`.

**Route**: `/api/v1/health`

#### 4. Pricing Service (`pricing-service/src/interfaces/controllers/pricing.controller.ts`)

Added identical health endpoint pattern with `service: "pricing-service"`.

**Route**: `/api/v1/health`

#### 5. Auth Service

Already had health endpoint at `/api/v1/auth/health` ✅

### Frontend Changes

Updated React Admin API clients to use the correct health check paths:

#### Before (Incorrect - caused validation errors)

```typescript
// User Service
async healthCheck(): Promise<boolean> {
  await userApiClient.get('/users/health'); // ❌ Conflicted with /:id routes
  return true;
}
```

#### After (Correct)

```typescript
// User Service
async healthCheck(): Promise<boolean> {
  await userApiClient.get('/health'); // ✅ Routes to /api/v1/health
  return true;
}
```

**Files Updated**:
- `react-admin/src/features/users/services/userService.ts`
- `react-admin/src/features/customers/services/customerApiClient.ts`
- `react-admin/src/features/carriers/services/carrierApiClient.ts`
- `react-admin/src/features/pricing/services/pricingApiClient.ts`

### Kong Gateway Configuration

Added health check routes to Kong Gateway using the Kong Admin API:

```bash
# 1. Auth Service (already has /api/v1/auth/health)
curl -X POST http://localhost:8001/services/auth-service/routes \
  --data 'name=auth-health-route' \
  --data 'paths[]=/api/v1/auth/health' \
  --data 'methods[]=GET' \
  --data 'methods[]=OPTIONS' \
  --data 'strip_path=false'

# Note: For other services, routes need service-specific configuration
# to avoid path conflicts (all use /api/v1/health)
```

## Health Endpoint Specifications

### Request

```
GET /api/v1/health HTTP/1.1
Host: localhost:8000
Accept: application/json
```

### Response (Success - 200 OK)

```json
{
  "status": "ok",
  "timestamp": "2025-10-28T03:01:31.368Z",
  "service": "user-service",
  "version": "1.0.0",
  "environment": "development"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always "ok" if service is healthy |
| `timestamp` | string | ISO 8601 timestamp of health check |
| `service` | string | Service identifier (e.g., "user-service") |
| `version` | string | Service version (e.g., "1.0.0") |
| `environment` | string | Current NODE_ENV value |

## Testing Health Endpoints

### 1. Direct Service Access (Bypassing Kong)

```bash
# Auth Service
curl http://localhost:3001/api/v1/auth/health

# User Service
curl http://localhost:3003/api/v1/health

# Customer Service
curl http://localhost:3004/api/v1/health

# Carrier Service
curl http://localhost:3005/api/v1/health

# Pricing Service
curl http://localhost:3006/api/v1/health

# Translation Service
curl http://localhost:3007/api/v1/health
```

### 2. Through Kong Gateway

```bash
# Auth Service (working ✅)
curl http://localhost:8000/api/v1/auth/health

# Other services (need route configuration)
curl http://localhost:8000/api/v1/health
```

### 3. React Admin Health Check

1. Open React Admin: http://localhost:3000
2. Login with: `admin@example.com` / `Admin123!`
3. Navigate to Dashboard
4. Check "Microservices Status" panel
5. Click "Refresh" button to recheck all services

**Expected Result**: All 6 services should show "Healthy" status with response times.

## Current Status

### ✅ Completed

- [x] Added `/health` endpoints to 4 microservices (User, Customer, Carrier, Pricing)
- [x] Auth Service already had `/api/v1/auth/health` endpoint
- [x] Updated React Admin API clients to use correct paths
- [x] Added Kong route for Auth Service health check
- [x] All services return 200 OK when accessed directly

### ⏳ Pending

- [ ] Configure Kong routes for User, Customer, Carrier, Pricing health endpoints
  - Challenge: All services use `/api/v1/health` path
  - Solution options:
    1. Use host-based routing (e.g., `user-service-health.local`)
    2. Use service-specific prefixes (e.g., `/api/v1/users/health`)
    3. Create separate Kong services for health checks
- [ ] Restart microservices to pick up controller changes
- [ ] Verify React Admin shows all services as healthy

## Next Steps

### Option 1: Host-Based Routing (Recommended)

Configure Kong routes with different hosts for each service:

```bash
# User Service Health
curl -X POST http://localhost:8001/services/user-service/routes \
  --data 'name=user-health-route' \
  --data 'paths[]=/api/v1/health' \
  --data 'hosts[]=user-service.local' \
  --data 'methods[]=GET'
```

Update React Admin to send `Host` header for health checks.

### Option 2: Service-Specific Prefixes

Change health endpoints to service-specific paths:

- User Service: `/api/v1/users/health`
- Customer Service: `/api/v1/customers/health`
- Carrier Service: `/api/v1/carriers/health`
- Pricing Service: `/api/v1/pricing/health`

**Note**: Requires modifying controllers to avoid `:id` route conflicts.

### Option 3: Unified Health Service

Create a dedicated health aggregation service that checks all microservices and returns consolidated status.

## Service Restart Commands

After backend changes, restart services:

```bash
# Option 1: Restart individual services
docker restart user-service
docker restart customer-service
docker restart carrier-service
docker restart pricing-service

# Option 2: Rebuild and restart (for code changes)
cd user-service && npm run build && docker restart user-service
cd customer-service && npm run build && docker restart customer-service
cd carrier-service && npm run build && docker restart carrier-service
cd pricing-service && npm run build && docker restart pricing-service

# Option 3: Full stack restart
docker-compose -f docker-compose.hybrid.yml restart
```

## Troubleshooting

### Issue: 404 Not Found

**Cause**: Kong route not configured for the health endpoint

**Solution**: Add Kong route using Admin API (see Kong Gateway Configuration section)

### Issue: 400 Bad Request - "Validation failed (numeric string is expected)"

**Cause**: Health endpoint path conflicting with `:id` parameter routes

**Solution**: Ensure health route is defined before parameterized routes in controller

### Issue: Service shows "Unhealthy" in React Admin

**Debug Steps**:

1. Check Docker container health:
   ```bash
   docker ps --format "table {{.Names}}\t{{.Status}}"
   ```

2. Test direct health endpoint:
   ```bash
   curl http://localhost:300X/api/v1/health
   ```

3. Test through Kong Gateway:
   ```bash
   curl http://localhost:8000/api/v1/health
   ```

4. Check Kong routes:
   ```bash
   curl http://localhost:8001/routes | jq '.data[] | select(.paths[] | contains("health"))'
   ```

5. Check React Admin browser console for errors

## Related Documentation

- `api-gateway/README.md` - Kong Gateway setup and configuration
- `api-gateway/KONG-STARTUP-TROUBLESHOOTING.md` - Kong troubleshooting guide
- `react-admin/src/components/MicroservicesStatus.tsx` - Health check UI component
- `HYBRID-ARCHITECTURE-README.md` - Microservices architecture overview

## Git Flow

**Branch**: `feature/kong-health-check-routes`

**Commits**:
1. `feat(backend): Add /health endpoints to microservices controllers`
2. `fix(react-admin): Update health check paths to use /health endpoint`
3. `docs(api-gateway): Add Kong health routes setup documentation`

**Next**: Merge to `develop` after testing and verification
