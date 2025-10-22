# Kong API Gateway - Quick Start Guide

This guide will get you up and running with Kong in **5 minutes**.

## 🚀 Prerequisites

- Docker & Docker Compose installed
- All microservices running (Auth, User, Carrier, Customer, Pricing, Translation)
- Ports available: 8000, 8001, 8443, 8444, 1337, 5433

## 📦 Step 1: Set Up Environment (30 seconds)

```bash
# Navigate to api-gateway directory
cd api-gateway

# Copy environment template
cp .env.example .env

# IMPORTANT: Update JWT_SECRET to match your Auth Service
# Edit .env and set JWT_SECRET=<your-auth-service-secret>
```

## 🐳 Step 2: Start Kong Stack (2 minutes)

```bash
# Start Kong, PostgreSQL, and Konga
docker-compose -f docker-compose.kong.yml up -d

# Wait for all services to be healthy (takes ~60 seconds)
docker-compose -f docker-compose.kong.yml ps

# You should see all services as "healthy"
```

**Expected Output:**
```
NAME                STATUS              PORTS
kong                Up (healthy)        0.0.0.0:8000->8000/tcp, 0.0.0.0:8001->8001/tcp
kong-database       Up (healthy)        0.0.0.0:5433->5432/tcp
konga               Up (healthy)        0.0.0.0:1337->1337/tcp
```

## ⚙️ Step 3: Configure Kong (1 minute)

```bash
# Run automated setup script
./setup-kong.sh

# This will:
# - Create all 6 microservices in Kong
# - Configure routes for all API endpoints
# - Enable JWT authentication
# - Set up CORS and rate limiting
# - Create test consumers
```

**Expected Output:**
```
🚀 Setting up Kong API Gateway...

✅ Kong is ready!

✅ Service: auth-service created
✅ Service: user-service created
...
✅ All services configured successfully!
```

## 🧪 Step 4: Test Your Setup (1 minute)

### Test 1: Verify Kong is Running

```bash
curl http://localhost:8001/status
```

**Expected:** JSON with Kong status information

### Test 2: Test Public Endpoint (No Auth)

```bash
# Test login endpoint (should work without JWT)
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

**Expected:** JSON with access_token and user info

### Test 3: Test Protected Endpoint (Requires Auth)

```bash
# Try to access users without JWT (should fail)
curl http://localhost:8000/api/v1/users

# Expected: {"message":"Unauthorized"}
```

### Test 4: Test Protected Endpoint with JWT

```bash
# First, login and get a token
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}' | \
  jq -r '.data.access_token')

# Use the token to access protected endpoint
curl http://localhost:8000/api/v1/users \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** JSON array of users

## 🎉 Success! What's Next?

### Access Konga Admin UI

1. Open browser: http://localhost:1337
2. Create admin account (first time only)
3. Connect to Kong:
   - Name: `Local Kong`
   - Kong Admin URL: `http://kong:8001`
4. Explore services, routes, and plugins visually

### Verify All Routes

```bash
# List all configured routes
curl http://localhost:8001/routes | jq '.data[].name'

# You should see:
# - auth-login
# - auth-register
# - users-list
# - roles-list
# - carriers-list
# - customers-list
# - pricing-list
# - translations-list
# ... and more
```

### Update Frontend to Use Kong

Update your React Admin `.env`:

```env
# Before (direct to services)
REACT_APP_API_URL=http://localhost:3001

# After (through Kong)
REACT_APP_API_URL=http://localhost:8000
```

Now all API calls will go through Kong with:
- ✅ JWT validation
- ✅ Role-based access control
- ✅ Rate limiting
- ✅ CORS handling
- ✅ Request/response logging

## 🔧 Common Commands

```bash
# View Kong logs
docker logs kong -f

# View all services
curl http://localhost:8001/services

# View all routes
curl http://localhost:8001/routes

# View all plugins
curl http://localhost:8001/plugins

# Restart Kong (after config changes)
docker-compose -f docker-compose.kong.yml restart kong

# Stop Kong stack
docker-compose -f docker-compose.kong.yml down

# Stop and remove volumes (fresh start)
docker-compose -f docker-compose.kong.yml down -v
```

## ❌ Troubleshooting

### Kong won't start

```bash
# Check logs
docker logs kong

# Common issue: Port already in use
# Solution: Stop conflicting service or change ports in docker-compose.kong.yml
```

### Services not routing

```bash
# Verify service URLs are correct
curl http://localhost:8001/services/auth-service

# Check if backend services are running
docker ps | grep -E "auth-service|user-service"

# Re-run setup script
./setup-kong.sh
```

### JWT not validating

```bash
# Verify JWT_SECRET matches Auth Service
# Check .env file in api-gateway
# Check JWT plugin configuration
curl http://localhost:8001/plugins | jq '.data[] | select(.name=="jwt")'
```

### Can't access Konga

```bash
# Check Konga is running
docker logs konga

# Restart Konga
docker-compose -f docker-compose.kong.yml restart konga

# Access at http://localhost:1337
```

## 📚 Next Steps

1. **Read Full Documentation**: See [README.md](./README.md) for architecture details
2. **Follow Implementation Guide**: See [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) for 4-week roadmap
3. **Configure RBAC**: Set up role-based access control (Week 2)
4. **Add Monitoring**: Set up Prometheus & Grafana (Week 3)
5. **Deploy to Cloud**: Follow Kubernetes guide (Week 4)

## 🆘 Need Help?

- Kong Documentation: https://docs.konghq.com/
- Kong Hub (Plugins): https://docs.konghq.com/hub/
- Kong Community: https://github.com/Kong/kong/discussions
- Project Documentation: See `docs/` directory

---

**You're all set!** Kong is now protecting your microservices with enterprise-grade API Gateway features. 🎊
