# 🚀 Kong API Gateway - ACTIVE & CONFIGURED

**Status:** ✅ **RUNNING AND CONFIGURED**  
**Date:** October 26, 2025

---

## ✅ Current Status

Kong API Gateway is **ACTIVE** and all microservices are configured to route through it.

### Running Services

```
✅ kong-gateway    - Port 8000 (Proxy), 8001 (Admin API)
✅ kong-database   - PostgreSQL on port 5433
✅ konga           - Admin UI on port 1337
```

### Configured Services (6)

| Service | Internal URL | Kong Service Name |
|---------|--------------|-------------------|
| Auth Service | `http://auth-service:3001` | `auth-service` |
| User Service | `http://user-service:3003` | `user-service` |
| Carrier Service | `http://carrier-service:3005` | `carrier-service` |
| Customer Service | `http://customer-service:3004` | `customer-service` |
| Pricing Service | `http://pricing-service:3006` | `pricing-service` |
| Translation Service | `http://translation-service:3007` | `translation-service` |

### Active Plugins

- ✅ **JWT Authentication** - 8 instances (protected routes)
- ✅ **Rate Limiting** - 12 instances
  - Public routes: 300 req/min, 5000 req/hour
  - Protected routes: 50 req/min, 1000 req/hour
- ✅ **CORS** - 1 global instance
- ✅ **Prometheus** - 1 instance (metrics)

---

## 🌐 How to Use Kong Gateway

### Base URLs

```bash
# ✅ USE THIS - Through Kong Gateway
GATEWAY_URL=http://localhost:8000

# ❌ AVOID - Direct access (bypasses security)
DIRECT_URL=http://localhost:3001  # Don't use in production
```

### Public Endpoints (No Authentication)

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'

# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "Password123!",
    "firstName": "New",
    "lastName": "User"
  }'

# Refresh Token
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token"
  }'
```

### Protected Endpoints (Require JWT)

```bash
# Get JWT Token first
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['access_token'])")

# List Users (Protected)
curl -X GET http://localhost:8000/api/v1/users \
  -H "Authorization: Bearer $TOKEN"

# Get User Profile (Protected)
curl -X GET http://localhost:8000/api/v1/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# List Carriers (Protected)
curl -X GET http://localhost:8000/api/v1/carriers \
  -H "Authorization: Bearer $TOKEN"

# List Customers (Protected)
curl -X GET http://localhost:8000/api/v1/customers \
  -H "Authorization: Bearer $TOKEN"

# List Pricing Rules (Protected)
curl -X GET http://localhost:8000/api/v1/pricing \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔒 Security Features

### 1. JWT Authentication

**Protected routes automatically validate JWT tokens:**

```bash
# ✅ With valid token - SUCCESS
curl -X GET http://localhost:8000/api/v1/users \
  -H "Authorization: Bearer <valid-token>"
# Response: 200 OK + data

# ❌ Without token - BLOCKED
curl -X GET http://localhost:8000/api/v1/users
# Response: 401 Unauthorized
```

### 2. Rate Limiting

**Automatic rate limiting per endpoint:**

```bash
# Response headers show rate limit status:
X-RateLimit-Limit-Minute: 300
X-RateLimit-Remaining-Minute: 299
RateLimit-Reset: 5
```

**Limits:**
- Public routes: 300 requests/minute
- Protected routes: 50 requests/minute

### 3. CORS

**Cross-Origin Resource Sharing enabled globally:**

```bash
# Headers included in responses:
Access-Control-Allow-Credentials: true
Vary: Origin
```

---

## 🎯 Kong-Specific Headers

All requests through Kong include these headers:

```
X-Kong-Upstream-Latency: 132ms    # Time to reach service
X-Kong-Proxy-Latency: 720ms       # Kong processing time
Via: kong/3.4.2                   # Confirms routing through Kong
```

**How to verify requests go through Kong:**
```bash
curl -i http://localhost:8000/api/v1/auth/login ... | grep "Via:"
# Should see: Via: kong/3.4.2
```

---

## 📊 Monitoring & Admin

### Kong Admin API (Port 8001)

```bash
# Check Kong status
curl http://localhost:8001/status

# List all services
curl http://localhost:8001/services | python3 -m json.tool

# List all routes
curl http://localhost:8001/routes | python3 -m json.tool

# List all plugins
curl http://localhost:8001/plugins | python3 -m json.tool

# Get metrics
curl http://localhost:8001/metrics
```

### Konga Admin UI (Port 1337)

```bash
# Open in browser
open http://localhost:1337
```

**Features:**
- Visual service/route management
- Plugin configuration
- Real-time monitoring
- Request analytics

---

## 🔄 Request Flow

### Current Architecture (With Kong)

```
┌─────────────┐
│   Client    │
│ React Admin │
└──────┬──────┘
       │
       │ All requests to http://localhost:8000
       ▼
┌─────────────────────────────────────┐
│      Kong API Gateway               │
│  Port 8000 (Proxy)                 │
│                                     │
│  Security Layer:                    │
│  ✅ JWT Validation                  │
│  ✅ Rate Limiting (300/min)         │
│  ✅ CORS Handling                   │
│  ✅ Request Logging                 │
│  ✅ Response Transformation         │
└────┬────┬────┬────┬────┬────┬───────┘
     │    │    │    │    │    │
     ▼    ▼    ▼    ▼    ▼    ▼
   Auth User Carrier Customer Pricing Translation
   :3001 :3003  :3005   :3004   :3006    :3007
```

### Benefits

✅ **Centralized Security** - Single point for authentication  
✅ **Rate Limiting** - Prevent API abuse  
✅ **Monitoring** - Track all requests in one place  
✅ **Load Balancing** - Distribute traffic (when scaled)  
✅ **API Versioning** - Manage multiple API versions  
✅ **Request/Response Transformation** - Modify data as needed  

---

## 🧪 Testing & Verification

### Test 1: Public Endpoint (Login)

```bash
curl -i -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
```

**Expected:**
- ✅ Status: `200 OK`
- ✅ Headers: `Via: kong/3.4.2`
- ✅ Headers: `X-RateLimit-Remaining-Minute: 299`
- ✅ Body: JSON with `access_token`

### Test 2: Protected Endpoint Without Token

```bash
curl -i -X GET http://localhost:8000/api/v1/users
```

**Expected:**
- ✅ Status: `401 Unauthorized`
- ✅ Body: `{"message":"Unauthorized"}`

### Test 3: Protected Endpoint With Token

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['access_token'])")

# Use token
curl -i -X GET http://localhost:8000/api/v1/users \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:**
- ✅ Status: `200 OK`
- ✅ Headers: `Via: kong/3.4.2`
- ✅ Headers: `X-Kong-Upstream-Latency: <ms>`
- ✅ Body: List of users

### Test 4: Rate Limiting

```bash
# Send 301 requests in 1 minute (exceeds limit of 300)
for i in {1..301}; do
  curl -s http://localhost:8000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"Admin123!"}'
done
```

**Expected on request #301:**
- ✅ Status: `429 Too Many Requests`
- ✅ Body: Rate limit exceeded message

---

## 🛠️ Management Commands

### Start Kong

```bash
cd /opt/cursor-project/fullstack-project/api-gateway
docker-compose -f docker-compose.kong.yml up -d
```

### Stop Kong

```bash
cd /opt/cursor-project/fullstack-project/api-gateway
docker-compose -f docker-compose.kong.yml down
```

### Restart Kong

```bash
cd /opt/cursor-project/fullstack-project/api-gateway
docker-compose -f docker-compose.kong.yml restart kong-gateway
```

### View Kong Logs

```bash
docker logs -f kong-gateway
```

### Reconfigure Kong

```bash
cd /opt/cursor-project/fullstack-project/api-gateway
./setup-kong.sh
```

### Check Kong Health

```bash
curl http://localhost:8001/status
docker ps --filter "name=kong"
```

---

## 📝 Frontend Integration

### Update React Admin to Use Kong

**Before (Direct Access):**
```typescript
// ❌ Old - bypasses gateway
const API_BASE_URL = 'http://localhost:3001';
```

**After (Through Kong):**
```typescript
// ✅ New - through gateway
const API_BASE_URL = 'http://localhost:8000';
```

### Example API Client

```typescript
// src/config/api.ts
export const API_CONFIG = {
  baseURL: 'http://localhost:8000',  // Kong gateway
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Add JWT automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle rate limiting
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please wait and try again.');
    }
    return Promise.reject(error);
  }
);
```

---

## 🎯 Next Steps

1. **Update Frontend:**
   - Change API base URL from `:3001` to `:8000`
   - Test all API calls through Kong
   - Verify JWT tokens work correctly

2. **Configure JWT Secret:**
   - Ensure Kong JWT plugin uses same secret as Auth Service
   - Update in `setup-kong.sh` if needed

3. **Monitor Performance:**
   - Check `X-Kong-Upstream-Latency` headers
   - Optimize if latency is high
   - Review rate limits based on usage

4. **Production Setup:**
   - Configure HTTPS (port 8443)
   - Set up proper JWT validation
   - Add ACL (role-based access control)
   - Configure logging to external systems

---

## 📚 Additional Resources

- **Kong Documentation:** https://docs.konghq.com/
- **Kong Admin API:** http://localhost:8001/
- **Konga UI:** http://localhost:1337/
- **Setup Script:** `/api-gateway/setup-kong.sh`
- **Config File:** `/api-gateway/kong.yml`

---

## ⚠️ Important Notes

1. **All API requests should now go through port 8000 (Kong), not direct service ports**
2. **Rate limits are enforced automatically**
3. **Protected routes require valid JWT tokens**
4. **Check `Via: kong/3.4.2` header to confirm routing through gateway**
5. **Direct access to services (ports 3001-3007) bypasses security - use only for debugging**

---

**Status: ✅ FULLY OPERATIONAL**

Kong API Gateway is successfully routing and protecting all microservices!
