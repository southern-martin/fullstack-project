# Kong API Gateway

Kong-based API Gateway with RBAC integration for the Fullstack Microservices Project.

## 📋 Overview

Kong acts as the **single entry point** for all microservices, providing:
- 🔐 **JWT Authentication** - Token validation
- 🛡️ **RBAC** - Role-based access control
- 🚦 **Rate Limiting** - Prevent abuse
- 🌐 **CORS** - Frontend integration
- 📊 **Logging & Monitoring** - Request/response tracking
- ⚡ **Load Balancing** - Traffic distribution

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
│ (React/Web) │
└──────┬──────┘
       │
       │ All requests go through Kong
       ▼
┌─────────────────────────────────┐
│      Kong API Gateway           │
│  (Port 8000 - Proxy)           │
│  (Port 8001 - Admin API)       │
│                                 │
│  Features:                      │
│  - JWT Validation               │
│  - ACL (Role-based)             │
│  - Rate Limiting                │
│  - CORS                         │
│  - Request Logging              │
└────┬────┬────┬────┬────┬────┬───┘
     │    │    │    │    │    │
     ▼    ▼    ▼    ▼    ▼    ▼
   Auth User Carrier Customer Pricing Translation
   :3001 :3003 :3004  :3005   :3006    :3007
```

## 🚀 Quick Start

### 1. Start Kong Gateway

```bash
# From project root
docker-compose -f api-gateway/docker-compose.kong.yml up -d

# Wait for services to be healthy
docker-compose -f api-gateway/docker-compose.kong.yml ps
```

### 2. Configure Kong

```bash
# Run setup script
cd api-gateway
./setup-kong.sh
```

### 3. Access Kong Admin UI (Konga)

```bash
# Open browser
open http://localhost:1337

# First time setup:
# 1. Create admin user
# 2. Connect to Kong: http://kong:8001
# 3. Activate connection
```

### 4. Test Gateway

```bash
# Test public endpoint (no auth)
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'

# Get JWT token from response

# Test protected endpoint (with JWT)
curl -X GET http://localhost:8000/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📦 Components

### Kong Gateway
- **Image**: `kong:3.4-alpine`
- **Proxy Port**: `8000` (HTTP), `8443` (HTTPS)
- **Admin API**: `8001` (HTTP), `8444` (HTTPS)
- **Database**: PostgreSQL

### Konga (Admin UI)
- **Image**: `pantsel/konga`
- **Port**: `1337`
- **Purpose**: Visual interface for Kong configuration

### PostgreSQL (Kong DB)
- **Image**: `postgres:15-alpine`
- **Port**: `5433` (to avoid conflicts)
- **Database**: `kong`

## 🔐 JWT Integration

### How It Works

1. **Login** → Auth Service generates JWT
2. **Request** → Client sends JWT in `Authorization: Bearer <token>`
3. **Kong validates** → Checks JWT signature using shared secret
4. **RBAC check** → Verifies user roles/permissions
5. **Proxy** → Forwards to microservice if authorized

### Configuration

```yaml
# In kong.yml
plugins:
  - name: jwt
    config:
      key_claim_name: sub
      secret_is_base64: false
```

### JWT Secret Sharing

**Option 1: Environment Variable** (Recommended for Docker)
```bash
# In your Auth Service and Kong
JWT_SECRET=your-secret-key-here
```

**Option 2: Kong Consumer Credentials**
```bash
# Create JWT credential matching Auth Service
curl -X POST http://localhost:8001/consumers/user-issuer/jwt \
  -d "key=user-issuer" \
  -d "algorithm=HS256" \
  -d "secret=your-secret-from-auth-service"
```

## 🛡️ RBAC Configuration

### Role-Based Access Control

```yaml
# Example: Only admins can access user management
- name: users-routes
  plugins:
    - name: jwt
    - name: acl
      config:
        whitelist:
          - admin
          - super_admin
```

### ACL Groups

| Group | Permissions |
|-------|-------------|
| `super_admin` | Full access to all routes |
| `admin` | Manage users, roles, all resources |
| `manager` | Read users, manage carriers/customers |
| `user` | Own profile, read-only access |
| `guest` | Public routes only |

## 🛣️ Routes Configuration

### Public Routes (No Auth)

```bash
POST /api/v1/auth/login       # User login
POST /api/v1/auth/register    # User registration
POST /api/v1/auth/refresh     # Refresh token
```

### Protected Routes (JWT Required)

```bash
# Auth Service
POST /api/v1/auth/logout
GET  /api/v1/auth/profile
PUT  /api/v1/auth/profile

# User Service
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id

# Roles
GET    /api/v1/roles
POST   /api/v1/roles
GET    /api/v1/roles/:id
PATCH  /api/v1/roles/:id
DELETE /api/v1/roles/:id

# Carrier Service
GET    /api/carriers
POST   /api/carriers
GET    /api/carriers/:id
PATCH  /api/carriers/:id
DELETE /api/carriers/:id

# Customer Service
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PATCH  /api/customers/:id
DELETE /api/customers/:id

# Pricing Service
GET    /api/pricing
POST   /api/pricing
GET    /api/pricing/:id
PATCH  /api/pricing/:id
DELETE /api/pricing/:id

# Translation Service
GET    /api/v1/translations
POST   /api/v1/translations
GET    /api/v1/translations/:id
PATCH  /api/v1/translations/:id
DELETE /api/v1/translations/:id
```

## 🔌 Plugins

### Enabled Plugins

1. **JWT** - Authentication
2. **ACL** - Role-based access control
3. **CORS** - Cross-origin resource sharing
4. **Rate Limiting** - 100 req/min, 1000 req/hour
5. **Request Transformer** - Modify requests
6. **Response Transformer** - Modify responses
7. **File Log** - Request logging

### Adding Custom Plugins

```bash
# Via Admin API
curl -X POST http://localhost:8001/routes/ROUTE_NAME/plugins \
  -d "name=PLUGIN_NAME" \
  -d "config.SETTING=VALUE"

# Via Konga UI
# Navigate to Routes → Select Route → Add Plugin
```

## 📊 Monitoring & Logging

### View Logs

```bash
# Kong Gateway logs
docker logs -f kong-gateway

# Kong Database logs
docker logs -f kong-database

# All logs
docker-compose -f api-gateway/docker-compose.kong.yml logs -f
```

### Request Logs

```bash
# View request log file (inside container)
docker exec kong-gateway cat /tmp/kong-requests.log
```

### Konga Dashboard

- Access: http://localhost:1337
- View all services, routes, plugins
- Real-time monitoring
- Configuration management

## 🚢 Deployment

### Local Development

```bash
# Already configured via docker-compose.kong.yml
docker-compose -f api-gateway/docker-compose.kong.yml up -d
```

### Custom VM

```bash
# Use same docker-compose.kong.yml
# Update docker-compose.vm.yml to include Kong
# Configure Nginx to proxy to Kong:8000
```

### Kubernetes (GKE)

```bash
# Use Kong Ingress Controller
kubectl apply -f https://bit.ly/k4k8s

# Configure via KongIngress CRD
apiVersion: configuration.konghq.com/v1
kind: KongIngress
metadata:
  name: api-gateway
spec:
  proxy:
    protocol: http
```

## 🔧 Troubleshooting

### Kong won't start

```bash
# Check database migration
docker logs kong-migration

# Check database connectivity
docker exec kong-gateway kong health

# Reset database
docker-compose -f api-gateway/docker-compose.kong.yml down -v
docker-compose -f api-gateway/docker-compose.kong.yml up -d
```

### JWT validation fails

```bash
# Check JWT secret matches Auth Service
# Verify JWT format: Header.Payload.Signature
# Check Kong logs for detailed error
docker logs kong-gateway
```

### Routes not working

```bash
# List all routes
curl http://localhost:8001/routes

# Test specific route
curl -v http://localhost:8000/api/v1/auth/login

# Check route configuration
curl http://localhost:8001/routes/ROUTE_NAME
```

## 📚 Resources

- **Kong Documentation**: https://docs.konghq.com
- **Kong Hub (Plugins)**: https://docs.konghq.com/hub/
- **Konga GitHub**: https://github.com/pantsel/konga
- **Kong Kubernetes**: https://github.com/Kong/kubernetes-ingress-controller

## 🎯 Next Steps

1. ✅ Start Kong Gateway (done)
2. ✅ Configure services and routes (done)
3. ⏳ Integrate JWT with Auth Service
4. ⏳ Configure RBAC policies
5. ⏳ Update frontend to use Kong proxy (port 8000)
6. ⏳ Add custom rate limiting per route
7. ⏳ Configure monitoring and alerting
8. ⏳ Deploy to Kubernetes with Kong Ingress Controller

---

**Kong Gateway**: Production-ready API Gateway for microservices 🚀
