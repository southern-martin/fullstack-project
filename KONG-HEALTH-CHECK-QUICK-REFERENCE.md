# Kong Health Check Routes - Quick Reference

## Current Status 
**Branch**: `feature/kong-health-check-routes`  
**Backend**: ✅ Complete  
**Kong Routes**: ⏳ Pending  
**Commits**: 5 commits ready for review

## Problem Summary
React Admin shows 5/6 services as "unhealthy" because Kong Gateway doesn't have routes for `/api/v1/health` endpoints (except Auth service which works).

## Quick Test
```bash
# ✅ Works: Direct access to services
curl http://localhost:3003/api/v1/health  # User: 200 OK
curl http://localhost:3004/api/v1/health  # Customer: 200 OK
curl http://localhost:3005/api/v1/health  # Carrier: 200 OK
curl http://localhost:3006/api/v1/health  # Pricing: 200 OK

# ✅ Works: Auth through Kong
curl http://localhost:8000/api/v1/auth/health  # 200 OK

# ❌ Fails: Other services through Kong
curl http://localhost:8000/api/v1/health  # No route matched
```

## Recommended Solution: Host-Based Routing

### Step 1: Delete Experimental Routes
```bash
curl -X DELETE http://localhost:8001/routes/user-service-health-route
curl -X DELETE http://localhost:8001/routes/customer-service-health-route
curl -X DELETE http://localhost:8001/routes/carrier-service-health-route
curl -X DELETE http://localhost:8001/routes/pricing-service-health-route
curl -X DELETE http://localhost:8001/routes/translation-service-health-route
```

### Step 2: Create Host-Based Health Routes
```bash
# User Service
curl -X POST http://localhost:8001/services/user-service/routes \
  --data 'name=user-health-route' \
  --data 'paths[]=/api/v1/health' \
  --data 'hosts[]=user.health.local' \
  --data 'methods[]=GET' \
  --data 'methods[]=OPTIONS' \
  --data 'strip_path=false'

# Customer Service
curl -X POST http://localhost:8001/services/customer-service/routes \
  --data 'name=customer-health-route' \
  --data 'paths[]=/api/v1/health' \
  --data 'hosts[]=customer.health.local' \
  --data 'methods[]=GET' \
  --data 'methods[]=OPTIONS' \
  --data 'strip_path=false'

# Carrier Service
curl -X POST http://localhost:8001/services/carrier-service/routes \
  --data 'name=carrier-health-route' \
  --data 'paths[]=/api/v1/health' \
  --data 'hosts[]=carrier.health.local' \
  --data 'methods[]=GET' \
  --data 'methods[]=OPTIONS' \
  --data 'strip_path=false'

# Pricing Service
curl -X POST http://localhost:8001/services/pricing-service/routes \
  --data 'name=pricing-health-route' \
  --data 'paths[]=/api/v1/health' \
  --data 'hosts[]=pricing.health.local' \
  --data 'methods[]=GET' \
  --data 'methods[]=OPTIONS' \
  --data 'strip_path=false'

# Translation Service
curl -X POST http://localhost:8001/services/translation-service/routes \
  --data 'name=translation-health-route' \
  --data 'paths[]=/api/v1/health' \
  --data 'hosts[]=translation.health.local' \
  --data 'methods[]=GET' \
  --data 'methods[]=OPTIONS' \
  --data 'strip_path=false'
```

### Step 3: Update React Admin API Clients
Modify each service's health check to send appropriate Host header:

**react-admin/src/features/users/services/userService.ts**:
```typescript
async healthCheck(): Promise<boolean> {
  try {
    await userApiClient.get('/health', {
      headers: { 'Host': 'user.health.local' }
    });
    return true;
  } catch (error) {
    console.error('User service health check failed:', error);
    return false;
  }
}
```

Repeat for:
- `customerApiClient.ts` → `Host: customer.health.local`
- `carrierApiClient.ts` → `Host: carrier.health.local`
- `pricingApiClient.ts` → `Host: pricing.health.local`
- `translationApiClient.ts` → `Host: translation.health.local`

### Step 4: Test Through Kong
```bash
curl -H "Host: user.health.local" http://localhost:8000/api/v1/health
curl -H "Host: customer.health.local" http://localhost:8000/api/v1/health
curl -H "Host: carrier.health.local" http://localhost:8000/api/v1/health
curl -H "Host: pricing.health.local" http://localhost:8000/api/v1/health
```

Expected: All return 200 OK with service health status.

### Step 5: Test React Admin
1. Open: http://localhost:3000
2. Login: `admin@example.com` / `Admin123!`
3. Navigate to Dashboard
4. Check "Microservices Status" panel
5. Click "Refresh"

Expected: 6/6 services show "Healthy"

## Alternative: Simpler Approach (No React Admin Changes)

Create a health aggregator endpoint in API Gateway that checks all services:

```typescript
// api-gateway/health-aggregator.js
app.get('/api/v1/system/health', async (req, res) => {
  const services = [
    { name: 'auth', url: 'http://auth-service:3001/api/v1/auth/health' },
    { name: 'user', url: 'http://user-service:3003/api/v1/health' },
    { name: 'customer', url: 'http://customer-service:3004/api/v1/health' },
    { name: 'carrier', url: 'http://carrier-service:3005/api/v1/health' },
    { name: 'pricing', url: 'http://pricing-service:3006/api/v1/health' },
    { name: 'translation', url: 'http://translation-service:3007/api/v1/health' }
  ];
  
  const results = await Promise.all(
    services.map(async (svc) => {
      try {
        const response = await fetch(svc.url);
        const data = await response.json();
        return { name: svc.name, healthy: true, data };
      } catch (error) {
        return { name: svc.name, healthy: false, error: error.message };
      }
    })
  );
  
  res.json({
    timestamp: new Date().toISOString(),
    services: results,
    summary: {
      total: results.length,
      healthy: results.filter(s => s.healthy).length
    }
  });
});
```

Then update React Admin to call single endpoint for all services.

## Files Modified (Current Branch)
```
✅ user-service/src/interfaces/controllers/user.controller.ts
✅ customer-service/src/interfaces/controllers/customer.controller.ts
✅ carrier-service/src/interfaces/controllers/carrier.controller.ts
✅ pricing-service/src/interfaces/controllers/pricing.controller.ts
✅ react-admin/src/features/users/services/userService.ts
✅ react-admin/src/features/customers/services/customerApiClient.ts
✅ react-admin/src/features/carriers/services/carrierApiClient.ts
✅ react-admin/src/features/pricing/services/pricingApiClient.ts
✅ api-gateway/KONG-HEALTH-ROUTES-SETUP.md (new)
✅ KONG-HEALTH-CHECK-IMPLEMENTATION-SUMMARY.md (new)
```

## Merge Process (After Kong Routes Complete)

```bash
# Ensure all changes committed
git status

# Push feature branch
git push origin feature/kong-health-check-routes

# Create pull request
# Review and merge to develop via GitHub/GitLab

# Or merge locally:
git checkout develop
git merge --no-ff feature/kong-health-check-routes
git push origin develop

# Delete feature branch
git branch -d feature/kong-health-check-routes
git push origin --delete feature/kong-health-check-routes
```

## Return to Consul Work

```bash
# Switch to Consul branch
git checkout feature/consul-config-server

# Verify status
git log --oneline -5

# Continue with Week 2: Service integration with Consul
```

## Related Documentation
- `api-gateway/KONG-HEALTH-ROUTES-SETUP.md` - Detailed setup guide
- `KONG-HEALTH-CHECK-IMPLEMENTATION-SUMMARY.md` - Complete implementation journey
- `HYBRID-ARCHITECTURE-README.md` - Architecture overview
