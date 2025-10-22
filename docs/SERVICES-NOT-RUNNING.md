# ⚠️ CRITICAL: Backend Services Not Running

## Problem Identified

Multiple backend services are **NOT RUNNING**, which is why you're seeing connection errors:

```
❌ Auth Service (port 3001) - ERR_CONNECTION_REFUSED
❌ Translation Service (port 3007) - Connection refused
❌ Possibly other services as well
```

## Quick Fix - Start All Services

### Step 1: Start Docker Desktop (Mac)

```bash
# Open Docker Desktop application
open -a Docker

# Wait 30-60 seconds for Docker to fully initialize
# You'll see the Docker icon in the menu bar turn solid when ready
```

### Step 2: Start All Backend Services

```bash
cd /opt/cursor-project/fullstack-project

# Start all services using hybrid compose file
docker-compose -f docker-compose.hybrid.yml up -d

# This will start:
# - Auth Service (3001)
# - User Service (3003)
# - Customer Service (3004)
# - Carrier Service (3005)
# - Pricing Service (3006)
# - Translation Service (3007)
# - Shared MySQL Database (3306)
# - Shared Redis (6379)
```

### Step 3: Wait for Services to Initialize

```bash
# Wait 30-60 seconds for all services to start
sleep 60

# OR watch the logs
docker-compose -f docker-compose.hybrid.yml logs -f
```

### Step 4: Verify Services Are Running

```bash
# Check all containers
docker-compose -f docker-compose.hybrid.yml ps

# Expected output:
# NAME                    STATUS          PORTS
# auth-service            Up              0.0.0.0:3001->3001/tcp
# user-service            Up              0.0.0.0:3003->3003/tcp
# customer-service        Up              0.0.0.0:3004->3004/tcp
# carrier-service         Up              0.0.0.0:3005->3005/tcp
# pricing-service         Up              0.0.0.0:3006->3006/tcp
# translation-service     Up              0.0.0.0:3007->3007/tcp
# shared_user_db          Up              0.0.0.0:3306->3306/tcp
# shared-redis            Up              0.0.0.0:6379->6379/tcp
```

### Step 5: Test Individual Services

```bash
# Test Auth Service
curl http://localhost:3001/api/v1/auth/health
# Expected: {"data":{"status":"ok","service":"auth-service"}}

# Test User Service
curl http://localhost:3003/api/v1/users/health
# Expected: {"data":{"status":"ok","service":"user-service"}}

# Test Translation Service
curl http://localhost:3007/api/v1/health
# Expected: {"data":{"status":"ok","service":"translation-service"}}

# Test Carrier Service
curl http://localhost:3005/health
# Expected: {"data":{"status":"ok","service":"carrier-service"}}

# Test Customer Service
curl http://localhost:3004/health
# Expected: {"data":{"status":"ok","service":"customer-service"}}

# Test Pricing Service
curl http://localhost:3006/health
# Expected: {"data":{"status":"ok","service":"pricing-service"}}
```

### Step 6: Refresh React Admin

```bash
# Hard refresh browser
# Mac: Cmd + Shift + R
# Windows/Linux: Ctrl + Shift + R

# Or restart React Admin
cd react-admin
npm run dev
```

## Alternative: Using Makefile

```bash
cd /opt/cursor-project/fullstack-project

# Start all services
make dev

# Or start services individually
make auth-dev
make user-dev
make translation-dev
# etc.
```

## Troubleshooting

### Issue 1: Docker Not Installed

```bash
# Check if Docker is installed
docker --version

# If not installed, download from:
# https://www.docker.com/products/docker-desktop
```

### Issue 2: Docker Daemon Not Running

**Error**: `Cannot connect to the Docker daemon`

**Solution**:
- **Mac**: Open Docker Desktop application
- **Linux**: `sudo systemctl start docker`
- **Windows**: Start Docker Desktop

### Issue 3: Port Already in Use

**Error**: `port is already allocated`

**Solution**:
```bash
# Find and kill process on port 3001 (Auth Service)
lsof -ti:3001 | xargs kill -9

# Find and kill process on port 3007 (Translation Service)
lsof -ti:3007 | xargs kill -9

# Then restart services
docker-compose -f docker-compose.hybrid.yml up -d
```

### Issue 4: Services Keep Crashing

**Check logs**:
```bash
# View logs for all services
docker-compose -f docker-compose.hybrid.yml logs

# View logs for specific service
docker-compose -f docker-compose.hybrid.yml logs auth-service
docker-compose -f docker-compose.hybrid.yml logs translation-service

# Follow logs in real-time
docker-compose -f docker-compose.hybrid.yml logs -f auth-service
```

### Issue 5: Database Connection Errors

**Symptom**: Services can't connect to database

**Solution**:
```bash
# Restart shared database
docker-compose -f docker-compose.hybrid.yml restart shared_user_db

# Wait 10 seconds
sleep 10

# Restart dependent services
docker-compose -f docker-compose.hybrid.yml restart auth-service user-service
```

## Complete Service Architecture

### Shared Infrastructure
- **MySQL Database** (port 3306) - Used by Auth & User services
- **Redis Cache** (port 6379) - Shared by all services

### Microservices
| Service | Port | Health Endpoint | Database |
|---------|------|----------------|----------|
| Auth Service | 3001 | `/api/v1/auth/health` | Shared MySQL |
| User Service | 3003 | `/api/v1/users/health` | Shared MySQL |
| Customer Service | 3004 | `/health` | Separate DB |
| Carrier Service | 3005 | `/health` | Separate DB |
| Pricing Service | 3006 | `/health` | Separate DB |
| Translation Service | 3007 | `/api/v1/health` | Separate DB |

### Frontend
- **React Admin** (port 3000) - Main UI application

## Service Dependencies

```
React Admin (3000)
    ↓
    ├─→ Auth Service (3001) ─→ Shared MySQL (3306)
    ├─→ User Service (3003) ─→ Shared MySQL (3306)
    ├─→ Customer Service (3004) ─→ Customer DB
    ├─→ Carrier Service (3005) ─→ Carrier DB
    ├─→ Pricing Service (3006) ─→ Pricing DB
    └─→ Translation Service (3007) ─→ Translation DB
    
All Services → Shared Redis (6379)
```

## Quick Start Script

Create a convenience script:

```bash
# Create startup script
cat > start-all.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Fullstack Project..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"

# Start all services
echo "📦 Starting all services..."
docker-compose -f docker-compose.hybrid.yml up -d

echo "⏳ Waiting for services to initialize (60 seconds)..."
sleep 60

# Check service health
echo "🏥 Checking service health..."

services=(
    "http://localhost:3001/api/v1/auth/health|Auth Service"
    "http://localhost:3003/api/v1/users/health|User Service"
    "http://localhost:3004/health|Customer Service"
    "http://localhost:3005/health|Carrier Service"
    "http://localhost:3006/health|Pricing Service"
    "http://localhost:3007/api/v1/health|Translation Service"
)

for service in "${services[@]}"; do
    IFS='|' read -r url name <<< "$service"
    if curl -s "$url" > /dev/null; then
        echo "✅ $name is healthy"
    else
        echo "❌ $name is not responding"
    fi
done

echo ""
echo "🎉 All services started!"
echo ""
echo "📋 Service URLs:"
echo "  - React Admin: http://localhost:3000"
echo "  - Auth Service: http://localhost:3001"
echo "  - User Service: http://localhost:3003"
echo "  - Translation Service: http://localhost:3007"
echo ""
echo "🔐 Default Login:"
echo "  - Email: admin@example.com"
echo "  - Password: Admin123!"
EOF

chmod +x start-all.sh

# Run it
./start-all.sh
```

## Stop Services

```bash
# Stop all services
docker-compose -f docker-compose.hybrid.yml down

# Stop and remove volumes (WARNING: deletes data)
docker-compose -f docker-compose.hybrid.yml down -v

# Stop specific service
docker-compose -f docker-compose.hybrid.yml stop auth-service
```

## Restart Services

```bash
# Restart all services
docker-compose -f docker-compose.hybrid.yml restart

# Restart specific service
docker-compose -f docker-compose.hybrid.yml restart auth-service
docker-compose -f docker-compose.hybrid.yml restart translation-service
```

---

## Next Steps After Starting Services

1. **Verify all services are healthy** (see Step 4 above)
2. **Open React Admin**: http://localhost:3000
3. **Login** with: `admin@example.com` / `Admin123!`
4. **Test translations**:
   - Click language selector (top-right)
   - Select "Français" or "Español"
   - Navigate to Users → View Details → Profile tab
   - ✅ All labels should be translated!

---

## Common Startup Issues

### MySQL Connection Failed
```bash
# Check if MySQL is running
docker-compose -f docker-compose.hybrid.yml ps shared_user_db

# Restart MySQL
docker-compose -f docker-compose.hybrid.yml restart shared_user_db

# Check logs
docker-compose -f docker-compose.hybrid.yml logs shared_user_db
```

### Redis Connection Failed
```bash
# Check if Redis is running
docker-compose -f docker-compose.hybrid.yml ps shared-redis

# Restart Redis
docker-compose -f docker-compose.hybrid.yml restart shared-redis
```

### Service Won't Start
```bash
# View service logs
docker-compose -f docker-compose.hybrid.yml logs [service-name]

# Common issues:
# 1. Port already in use → Kill process on that port
# 2. Database not ready → Wait longer or restart database
# 3. Environment variables missing → Check .env files
```

---

**IMPORTANT**: All backend services must be running for the application to work properly!
