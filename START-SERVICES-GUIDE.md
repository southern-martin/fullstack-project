# 🚀 Start Services Guide

## Current Issue
Docker daemon is not running. Frontend cannot connect to backend services.

## ✅ Step-by-Step Instructions

### 1. Start Docker Desktop

**On macOS:**
1. Open **Docker Desktop** application from Applications folder or Spotlight
2. Wait for Docker to fully start
3. Look for the Docker icon in the menu bar (top right)
4. When ready, it should say "Docker Desktop is running"

**Verify Docker is running:**
```bash
docker ps
```
If this command works without errors, Docker is running ✅

---

### 2. Start Shared Infrastructure

```bash
cd shared-database && docker-compose up -d && cd ..
```

This starts:
- **shared_user_db** (MySQL 8.0) on port 3306
- **shared-redis** (Redis) on port 6379

**Verify infrastructure:**
```bash
docker ps | grep -E "shared_user_db|shared-redis"
```

---

### 3. Start All Microservices

```bash
docker-compose -f docker-compose.hybrid.yml up -d
```

This starts all 6 microservices:
- **auth-service** → Port 3001
- **user-service** → Port 3003
- **customer-service** → Port 3004
- **carrier-service** → Port 3005
- **pricing-service** → Port 3006
- **translation-service** → Port 3007

**Wait 30-60 seconds** for services to initialize.

---

### 4. Verify All Services are Running

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

You should see:
```
NAMES                   STATUS          PORTS
auth-service           Up X seconds    0.0.0.0:3001->3001/tcp
user-service           Up X seconds    0.0.0.0:3003->3003/tcp
customer-service       Up X seconds    0.0.0.0:3004->3004/tcp
carrier-service        Up X seconds    0.0.0.0:3005->3005/tcp
pricing-service        Up X seconds    0.0.0.0:3006->3006/tcp
translation-service    Up X seconds    0.0.0.0:3007->3007/tcp
shared_user_db         Up X seconds    0.0.0.0:3306->3306/tcp
shared-redis           Up X seconds    0.0.0.0:6379->6379/tcp
```

---

### 5. Check Service Health

Test each service endpoint:

```bash
# Auth Service (REQUIRED for login)
curl http://localhost:3001/api/v1/health

# User Service
curl http://localhost:3003/health

# Customer Service
curl http://localhost:3004/health

# Carrier Service
curl http://localhost:3005/health

# Pricing Service
curl http://localhost:3006/health

# Translation Service
curl http://localhost:3007/api/v1/health
```

All should return: `{"status":"ok"}`

---

### 6. Test Login

Open browser at `http://localhost:3000` and login with:
- **Email:** `admin@example.com`
- **Password:** `Admin123!`

If login works ✅, all services are running correctly!

---

## 🔍 Troubleshooting

### Service won't start?
Check logs for specific service:
```bash
docker logs auth-service --tail 50
docker logs user-service --tail 50
docker logs carrier-service --tail 50
```

### Port already in use?
Stop conflicting services:
```bash
lsof -ti:3001 -ti:3003 -ti:3004 -ti:3005 -ti:3006 -ti:3007 | xargs kill -9
```

### Need to rebuild a service?
```bash
docker-compose -f docker-compose.hybrid.yml build <service-name>
docker-compose -f docker-compose.hybrid.yml up -d <service-name>
```

### Stop all services:
```bash
docker-compose -f docker-compose.hybrid.yml down
cd shared-database && docker-compose down && cd ..
```

### Restart all services:
```bash
# Stop everything
docker-compose -f docker-compose.hybrid.yml down
cd shared-database && docker-compose down && cd ..

# Start everything
cd shared-database && docker-compose up -d && cd ..
docker-compose -f docker-compose.hybrid.yml up -d
```

---

## 📝 Quick Start Commands

After Docker Desktop is running, use these commands:

```bash
# Start everything
cd shared-database && docker-compose up -d && cd .. && docker-compose -f docker-compose.hybrid.yml up -d

# Check status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# View logs (all services)
docker-compose -f docker-compose.hybrid.yml logs -f

# View logs (specific service)
docker logs auth-service -f
```

---

## ✅ Success Checklist

- [ ] Docker Desktop is running
- [ ] Shared infrastructure started (MySQL + Redis)
- [ ] All 6 microservices started
- [ ] All services show "Up" status in `docker ps`
- [ ] Health checks return `{"status":"ok"}`
- [ ] Login works at http://localhost:3000
- [ ] No connection errors in browser console

Once all items are checked, you're ready to test the Carrier translation feature! 🎉
