# Kong API Gateway Implementation Guide

## 🎯 Implementation Roadmap

### Phase 1: Local Setup & Basic Routing (Week 1)

**Objective**: Get Kong running locally and routing to all microservices

#### Day 1-2: Kong Installation & Configuration
- [x] Create `docker-compose.kong.yml`
- [x] Create `kong.yml` (declarative config)
- [x] Create `setup-kong.sh` script
- [ ] Start Kong and verify health
- [ ] Access Konga UI and configure connection

#### Day 3-4: Service & Route Configuration
- [ ] Add all 6 microservices to Kong
- [ ] Configure routes for each service
- [ ] Test routing without authentication
- [ ] Verify all services accessible via Kong proxy

#### Day 5: Testing & Documentation
- [ ] Create Postman collection for Kong routes
- [ ] Test all public endpoints
- [ ] Document Kong architecture
- [ ] Update project README

### Phase 2: JWT Integration (Week 2)

**Objective**: Secure all routes with JWT authentication

#### Day 1-2: JWT Configuration
- [ ] Share JWT secret between Auth Service and Kong
- [ ] Configure JWT plugin on protected routes
- [ ] Create Kong consumers from existing users
- [ ] Map users to ACL groups

#### Day 3-4: Authentication Testing
- [ ] Test login → JWT generation
- [ ] Test JWT validation on protected routes
- [ ] Test JWT expiration and refresh
- [ ] Handle authentication errors gracefully

#### Day 5: RBAC Implementation
- [ ] Configure ACL plugin for role-based access
- [ ] Map database roles to Kong ACL groups
- [ ] Test admin-only routes
- [ ] Test user-specific permissions

### Phase 3: Advanced Features (Week 3)

**Objective**: Add production-ready features

#### Day 1-2: Rate Limiting & Security
- [ ] Configure rate limiting per route
- [ ] Add IP whitelisting for admin routes
- [ ] Configure CORS properly for frontend
- [ ] Add request/response transformers

#### Day 3-4: Monitoring & Logging
- [ ] Configure Prometheus plugin
- [ ] Set up Grafana dashboards
- [ ] Configure structured logging
- [ ] Add health check endpoints

#### Day 5: Frontend Integration
- [ ] Update React Admin to use Kong proxy
- [ ] Change API base URL to http://localhost:8000
- [ ] Test all frontend operations
- [ ] Update environment variables

### Phase 4: Cloud Preparation (Week 4)

**Objective**: Prepare Kong for Kubernetes deployment

#### Day 1-2: Kubernetes Configuration
- [ ] Install Kong Ingress Controller
- [ ] Create KongIngress CRDs
- [ ] Configure services in K8s
- [ ] Test in local Minikube

#### Day 3-4: GKE Deployment
- [ ] Deploy Kong to GKE
- [ ] Configure Cloud SQL for Kong DB
- [ ] Set up Cloud Load Balancer
- [ ] Configure SSL/TLS certificates

#### Day 5: Production Readiness
- [ ] Load testing
- [ ] Security audit
- [ ] Backup & recovery procedures
- [ ] Documentation finalization

---

## 🔐 JWT Integration Details

### Step-by-Step JWT Setup

#### 1. Get JWT Secret from Auth Service

```typescript
// auth-service/src/config/jwt.config.ts
export default {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '1h',
  refreshExpiresIn: '7d'
}
```

#### 2. Configure Kong JWT Plugin

```bash
# Method 1: Via Admin API
curl -X POST http://localhost:8001/plugins \
  -d "name=jwt" \
  -d "config.secret_is_base64=false"

# Method 2: Via Kong.yml
plugins:
  - name: jwt
    config:
      uri_param_names:
        - jwt
      claims_to_verify:
        - exp
```

#### 3. Create Kong Consumer for Each User

```bash
# When user registers or logs in, create Kong consumer
curl -X POST http://localhost:8001/consumers \
  -d "username=user@example.com" \
  -d "custom_id=${userId}"

# Add JWT credential
curl -X POST http://localhost:8001/consumers/${userId}/jwt \
  -d "key=user-issuer" \
  -d "algorithm=HS256" \
  -d "secret=${JWT_SECRET}"
```

#### 4. Modify Auth Service to Include Kong Consumer

```typescript
// auth-service/src/application/use-cases/auth/login.use-case.ts

async execute(loginDto: LoginDto): Promise<LoginResponseDto> {
  // ... existing login logic ...
  
  // Create/update Kong consumer
  await this.createKongConsumer(user);
  
  // Generate JWT (existing)
  const token = this.jwtService.sign({ sub: user.id, email: user.email });
  
  return { token, user };
}

private async createKongConsumer(user: User): Promise<void> {
  const kongAdminUrl = process.env.KONG_ADMIN_URL || 'http://kong:8001';
  
  // Create consumer
  await axios.post(`${kongAdminUrl}/consumers`, {
    username: user.email,
    custom_id: user.id.toString()
  }).catch(() => {}); // Ignore if exists
  
  // Add to ACL groups based on roles
  for (const role of user.roles) {
    await axios.post(`${kongAdminUrl}/consumers/${user.id}/acls`, {
      group: role.name
    }).catch(() => {});
  }
}
```

---

## 🛡️ RBAC Configuration Examples

### Route-Specific RBAC

```bash
# Only super_admin and admin can manage users
curl -X POST http://localhost:8001/routes/users-routes/plugins \
  -d "name=acl" \
  -d "config.whitelist=super_admin,admin"

# Only super_admin and admin can manage roles
curl -X POST http://localhost:8001/routes/roles-routes/plugins \
  -d "name=acl" \
  -d "config.whitelist=super_admin,admin"

# All authenticated users can read carriers
curl -X POST http://localhost:8001/routes/carriers-read/plugins \
  -d "name=jwt"  # JWT required, no ACL = all authenticated users
```

### Dynamic Role Checking

For more complex permission checks, create a custom Kong plugin:

```lua
-- kong-plugins/rbac-checker/handler.lua
local BasePlugin = require "kong.plugins.base_plugin"
local jwt_decoder = require "kong.plugins.jwt.jwt_parser"

local RBACCheckerHandler = BasePlugin:extend()

function RBACCheckerHandler:new()
  RBACCheckerHandler.super.new(self, "rbac-checker")
end

function RBACCheckerHandler:access(conf)
  RBACCheckerHandler.super.access(self)
  
  local token = kong.request.get_header("authorization")
  if not token then
    return kong.response.exit(401, { message = "Unauthorized" })
  end
  
  -- Decode JWT
  local jwt = jwt_decoder:new(token:gsub("Bearer ", ""))
  local claims = jwt.claims
  
  -- Check permission based on route and method
  local route = kong.router.get_route()
  local method = kong.request.get_method()
  
  local required_permission = route.name .. "." .. method:lower()
  
  -- Call User Service to check permission
  local http = require "resty.http"
  local httpc = http.new()
  local res, err = httpc:request_uri(conf.user_service_url .. "/users/" .. claims.sub .. "/permissions", {
    method = "GET",
    headers = {
      ["Authorization"] = token
    }
  })
  
  if not res or not res.body then
    return kong.response.exit(500, { message = "Permission check failed" })
  end
  
  local permissions = cjson.decode(res.body)
  
  if not has_permission(permissions, required_permission) then
    return kong.response.exit(403, { message = "Forbidden: Insufficient permissions" })
  end
end

return RBACCheckerHandler
```

---

## 📊 Monitoring & Logging

### Prometheus Integration

```bash
# Enable Prometheus plugin
curl -X POST http://localhost:8001/plugins \
  -d "name=prometheus"

# Scrape metrics
curl http://localhost:8001/metrics

# Example metrics:
# kong_http_requests_total
# kong_latency_ms
# kong_bandwidth_bytes
```

### Grafana Dashboard

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    networks:
      - fullstack-network

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - fullstack-network

volumes:
  prometheus-data:
  grafana-data:

networks:
  fullstack-network:
    external: true
```

### Structured Logging

```bash
# Enable file-log plugin with JSON format
curl -X POST http://localhost:8001/plugins \
  -d "name=file-log" \
  -d "config.path=/var/log/kong/requests.log" \
  -d "config.custom_fields_by_lua.user_id=return kong.ctx.shared.authenticated_consumer.id"
```

---

## 🚀 Deployment Strategies

### Local Development

```bash
# Start all services + Kong
docker-compose -f docker-compose.hybrid.yml up -d
docker-compose -f api-gateway/docker-compose.kong.yml up -d

# Configure Kong
./api-gateway/setup-kong.sh

# Access via Kong
curl http://localhost:8000/api/v1/auth/login
```

### Custom VM Deployment

```dockerfile
# Add to docker-compose.vm.yml
services:
  kong:
    image: kong:3.4-alpine
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: ${KONG_DB_HOST}
      KONG_PG_PASSWORD: ${KONG_DB_PASSWORD}
    ports:
      - "8000:8000"
      - "8001:8001"
```

### Kubernetes (GKE)

```yaml
# kong-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-gateway
  annotations:
    konghq.com/strip-path: "false"
    konghq.com/plugins: jwt-auth, rate-limiting
spec:
  ingressClassName: kong
  rules:
    - host: api.yourdomain.com
      http:
        paths:
          - path: /api/v1/auth
            pathType: Prefix
            backend:
              service:
                name: auth-service
                port:
                  number: 3001
          - path: /api/v1/users
            pathType: Prefix
            backend:
              service:
                name: user-service
                port:
                  number: 3003
          # ... other services
```

---

## 🧪 Testing Guide

### Test Authentication Flow

```bash
# 1. Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# 2. Login
TOKEN=$(curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }' | jq -r '.token')

# 3. Access protected route
curl -X GET http://localhost:8000/api/v1/users \
  -H "Authorization: Bearer $TOKEN"

# 4. Test RBAC (should fail for regular user)
curl -X POST http://localhost:8000/api/v1/roles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-role",
    "description": "Test role"
  }'
```

### Test Rate Limiting

```bash
# Send 101 requests in 1 minute (should get 429 on 101st)
for i in {1..101}; do
  curl -w "%{http_code}\n" http://localhost:8000/api/v1/auth/health
done
```

### Test CORS

```bash
# Preflight request
curl -X OPTIONS http://localhost:8000/api/v1/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

---

## 📝 Checklist

### Pre-Deployment

- [ ] All microservices have health check endpoints
- [ ] JWT secret is shared between Auth Service and Kong
- [ ] All routes are configured in Kong
- [ ] JWT plugin enabled on protected routes
- [ ] ACL groups match database roles
- [ ] Rate limiting configured appropriately
- [ ] CORS configured for frontend origin
- [ ] Logging enabled and tested
- [ ] Load testing completed
- [ ] Documentation updated

### Post-Deployment

- [ ] Monitor Kong metrics in Grafana
- [ ] Check error logs for issues
- [ ] Verify all services accessible
- [ ] Test authentication flow end-to-end
- [ ] Test RBAC with different roles
- [ ] Verify rate limiting is working
- [ ] Check CORS headers
- [ ] Update frontend to use Kong proxy

---

**Next**: Start with Phase 1 - Get Kong running locally! 🚀
