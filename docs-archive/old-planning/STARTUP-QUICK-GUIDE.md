# Backend Services Startup Guide - Quick Reference

## 🚨 Problem Summary

You're seeing these errors because **NO backend services are running**:
- ❌ Auth Service (3001) - `ERR_CONNECTION_REFUSED`
- ❌ Translation Service (3007) - Connection refused
- ❌ All other backend services likely down

## ✅ Quick Solution (3 Commands)

```bash
# 1. Make sure Docker Desktop is running (open it from Applications)

# 2. Navigate to project root
cd /opt/cursor-project/fullstack-project

# 3. Run the startup script
./start-all-services.sh
```

**That's it!** The script will:
- ✅ Check Docker is running
- ✅ Start all 6 backend services + database + Redis
- ✅ Wait for initialization (60 seconds)
- ✅ Verify each service is healthy
- ✅ Show you service URLs and login credentials

## 📊 What Services Will Start

| Service | Port | Purpose |
|---------|------|---------|
| **Auth Service** | 3001 | User authentication & authorization |
| **User Service** | 3003 | User management & profiles |
| **Customer Service** | 3004 | Customer data management |
| **Carrier Service** | 3005 | Shipping carrier management |
| **Pricing Service** | 3006 | Pricing calculations |
| **Translation Service** | 3007 | Multi-language support |
| **MySQL Database** | 3306 | Shared database (Auth + User) |
| **Redis Cache** | 6379 | Shared caching layer |

## 🎯 After Services Start

### Step 1: Login to React Admin
```
URL: http://localhost:3000
Email: admin@example.com
Password: Admin123!
```

### Step 2: Test Translations
1. Click **language selector** in top-right corner
2. Select **"Français"** or **"Español"**
3. Navigate to **Users → View Details → Profile** tab
4. ✅ **All labels should be translated!**

Expected results:
- **English**: "Profile", "Create Profile", "Basic Information"
- **French**: "Profil", "Créer un profil", "Informations de base"
- **Spanish**: "Perfil", "Crear perfil", "Información básica"

## 🔧 Alternative Methods

### Method 1: Docker Compose Directly
```bash
cd /opt/cursor-project/fullstack-project
docker-compose -f docker-compose.hybrid.yml up -d
```

### Method 2: Using Makefile
```bash
cd /opt/cursor-project/fullstack-project
make dev
```

### Method 3: Start Individual Services
```bash
cd /opt/cursor-project/fullstack-project

# Start infrastructure first
docker-compose -f docker-compose.hybrid.yml up -d shared_user_db shared-redis

# Wait 10 seconds
sleep 10

# Start services one by one
docker-compose -f docker-compose.hybrid.yml up -d auth-service
docker-compose -f docker-compose.hybrid.yml up -d user-service
docker-compose -f docker-compose.hybrid.yml up -d translation-service
# ... etc
```

## 🛠️ Troubleshooting

### Docker Desktop Not Running
**Error**: `Cannot connect to the Docker daemon`

**Solution**:
```bash
# Mac: Open Docker Desktop
open -a Docker

# Wait for Docker icon in menu bar to show "running" status
```

### Port Already in Use
**Error**: `port 3001 is already allocated`

**Solution**:
```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Then restart services
./start-all-services.sh
```

### Services Keep Crashing
```bash
# View logs
docker-compose -f docker-compose.hybrid.yml logs -f

# Check specific service
docker-compose -f docker-compose.hybrid.yml logs auth-service
```

### Database Connection Issues
```bash
# Restart database
docker-compose -f docker-compose.hybrid.yml restart shared_user_db

# Wait 10 seconds
sleep 10

# Restart services that use it
docker-compose -f docker-compose.hybrid.yml restart auth-service user-service
```

## 📋 Verification Commands

### Check All Services Status
```bash
docker-compose -f docker-compose.hybrid.yml ps
```

Expected output:
```
NAME                 STATUS          PORTS
auth-service         Up 2 minutes    0.0.0.0:3001->3001/tcp
user-service         Up 2 minutes    0.0.0.0:3003->3003/tcp
customer-service     Up 2 minutes    0.0.0.0:3004->3004/tcp
carrier-service      Up 2 minutes    0.0.0.0:3005->3005/tcp
pricing-service      Up 2 minutes    0.0.0.0:3006->3006/tcp
translation-service  Up 2 minutes    0.0.0.0:3007->3007/tcp
shared_user_db       Up 2 minutes    0.0.0.0:3306->3306/tcp
shared-redis         Up 2 minutes    0.0.0.0:6379->6379/tcp
```

### Test Individual Services
```bash
# Auth Service
curl http://localhost:3001/api/v1/auth/health
# Expected: {"data":{"status":"ok","service":"auth-service"}}

# User Service  
curl http://localhost:3003/api/v1/users/health
# Expected: {"data":{"status":"ok","service":"user-service"}}

# Translation Service
curl http://localhost:3007/api/v1/health
# Expected: {"data":{"status":"ok","service":"translation-service"}}
```

### Test Translation API
```bash
curl -s "http://localhost:3007/api/v1/translation/translate/batch" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "texts": ["User Details", "Profile"],
    "targetLanguage": "fr",
    "sourceLanguage": "en"
  }' | jq .
```

Expected response:
```json
{
  "data": {
    "translations": [
      {
        "text": "User Details",
        "translatedText": "Détails de l'utilisateur",
        "fromCache": true
      },
      {
        "text": "Profile",
        "translatedText": "Profil",
        "fromCache": true
      }
    ]
  }
}
```

## 🛑 Stopping Services

```bash
cd /opt/cursor-project/fullstack-project

# Stop all services
docker-compose -f docker-compose.hybrid.yml down

# Stop but keep data
docker-compose -f docker-compose.hybrid.yml stop

# Stop and remove volumes (⚠️ DELETES ALL DATA)
docker-compose -f docker-compose.hybrid.yml down -v
```

## 🔄 Restarting Services

```bash
# Restart all services
docker-compose -f docker-compose.hybrid.yml restart

# Restart specific service
docker-compose -f docker-compose.hybrid.yml restart auth-service
docker-compose -f docker-compose.hybrid.yml restart translation-service
```

## 📝 Useful Commands

```bash
# View logs (all services)
docker-compose -f docker-compose.hybrid.yml logs -f

# View logs (specific service)
docker-compose -f docker-compose.hybrid.yml logs -f auth-service

# List all containers
docker ps

# Execute command in container
docker-compose -f docker-compose.hybrid.yml exec auth-service sh

# View container stats (CPU, memory)
docker stats
```

## ✅ Success Checklist

After running `./start-all-services.sh`, verify:

- [ ] All 8 containers show "Up" status
- [ ] Auth Service health check returns 200 OK
- [ ] Translation Service health check returns 200 OK
- [ ] React Admin loads at http://localhost:3000
- [ ] Can login with admin@example.com / Admin123!
- [ ] Can switch language to French/Spanish
- [ ] Profile labels are translated correctly

## 🆘 Still Having Issues?

If services still won't start:

1. **Check Docker disk space**:
   ```bash
   docker system df
   docker system prune -a  # Free up space
   ```

2. **Reset everything**:
   ```bash
   docker-compose -f docker-compose.hybrid.yml down -v
   docker system prune -a
   ./start-all-services.sh
   ```

3. **Check environment files**:
   ```bash
   # Verify .env files exist
   ls -la *-service/.env
   ls -la shared-database/.env
   ```

4. **View detailed logs**:
   ```bash
   docker-compose -f docker-compose.hybrid.yml logs --tail=100
   ```

---

## 📚 Related Documentation

- **Full Service Guide**: `docs/SERVICES-NOT-RUNNING.md`
- **Translation Debugging**: `docs/translation/TRANSLATION-DEBUGGING-GUIDE.md`
- **Architecture Overview**: `HYBRID-ARCHITECTURE-README.md`
- **Quick Start**: `QUICK-START.md`

---

**TL;DR**: Run `./start-all-services.sh` and wait 60 seconds. Everything will just work! 🚀
