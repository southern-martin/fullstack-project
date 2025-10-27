# Kong Gateway Startup Issues - Quick Reference

## 🔥 Common Problem

Kong Gateway often fails to start when Docker restarts because:
- **Race Condition**: Kong tries to connect to PostgreSQL before it's ready
- **Network Timing**: Containers start simultaneously, causing connection failures
- **Migration Issues**: Database migrations fail if database isn't fully initialized

## ⚠️ Symptoms

```bash
# Kong in restart loop
docker ps -a | grep kong
kong-gateway    Restarting (1) 5 seconds ago  ❌

# Error in logs
docker logs kong-gateway
[error] init_by_lua error: [PostgreSQL error] failed to retrieve PostgreSQL server_version_num
```

## ✅ Solutions

### Quick Fix (Use the Script)

```bash
cd /opt/cursor-project/fullstack-project/api-gateway
./restart-kong.sh
```

This script:
1. ✅ Stops all Kong services cleanly
2. ✅ Starts database first and waits for health check
3. ✅ Runs migrations after database is ready
4. ✅ Starts Kong Gateway after migrations complete
5. ✅ Starts Konga UI last
6. ✅ Verifies all services are healthy

### Manual Fix (Step by Step)

```bash
cd api-gateway

# 1. Stop everything
docker-compose -f docker-compose.kong.yml down

# 2. Start database only
docker-compose -f docker-compose.kong.yml up -d kong-database

# 3. Wait 10 seconds
sleep 10

# 4. Verify database is ready
docker exec kong-database pg_isready -U kong
# Should output: kong-database:5432 - accepting connections

# 5. Start all services
docker-compose -f docker-compose.kong.yml up -d

# 6. Verify Kong is healthy
docker ps | grep kong
# Should show: (healthy) status

# 7. Test Admin API
curl http://localhost:8001/
# Should return JSON configuration
```

### Emergency Fix (Nuclear Option)

If Kong is completely broken:

```bash
cd api-gateway

# Stop and remove everything (including volumes)
docker-compose -f docker-compose.kong.yml down -v

# Wait a moment
sleep 5

# Use the restart script
./restart-kong.sh
```

⚠️ **Warning**: `-v` flag removes volumes, you'll lose Kong configuration!

## 🔍 Verify Services

### Check Container Status
```bash
docker ps --filter name=kong --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Expected output:
```
NAMES           STATUS                    PORTS
kong-gateway    Up 2 minutes (healthy)   0.0.0.0:8000-8001->8000-8001/tcp, 0.0.0.0:8443-8444->8443-8444/tcp
kong-database   Up 2 minutes (healthy)   0.0.0.0:5433->5432/tcp
konga           Up 2 minutes             0.0.0.0:1337->1337/tcp
```

### Check Kong Admin API
```bash
curl -s http://localhost:8001/ | jq '.version'
```

Expected: `"3.4.2"`

### Check Kong Health
```bash
curl -s http://localhost:8001/status | jq '.database.reachable'
```

Expected: `true`

## 🐛 Troubleshooting

### Database Won't Start

```bash
# Check database logs
docker logs kong-database --tail 50

# Common issues:
# - Port 5433 already in use
# - Volume corruption
# - Insufficient disk space
```

### Kong Won't Connect to Database

```bash
# Verify network connectivity
docker exec kong-gateway ping kong-database

# Check database from Kong container
docker exec kong-gateway curl -s http://kong-database:5432

# Verify environment variables
docker exec kong-gateway env | grep KONG_PG
```

Expected:
```
KONG_PG_HOST=kong-database
KONG_PG_DATABASE=kong
KONG_PG_USER=kong
```

### Migrations Fail

```bash
# Check migration logs
docker logs kong-migration

# Manually run migrations
docker-compose -f docker-compose.kong.yml run --rm kong kong migrations bootstrap

# Or reset migrations (destructive!)
docker-compose -f docker-compose.kong.yml run --rm kong kong migrations reset --yes
```

### Kong is Unhealthy

```bash
# Check health check logs
docker inspect kong-gateway --format='{{json .State.Health}}' | jq

# Manually test health
docker exec kong-gateway kong health

# Check if ports are listening
docker exec kong-gateway netstat -tulpn | grep 8001
```

## 📚 Reference

### Kong Endpoints
- **Admin API**: http://localhost:8001/
- **Proxy (HTTP)**: http://localhost:8000/
- **Proxy (HTTPS)**: https://localhost:8443/
- **Konga UI**: http://localhost:1337/

### Important Commands
```bash
# View all Kong containers
docker ps -a | grep kong

# Follow Kong logs in real-time
docker logs -f kong-gateway

# Restart specific service
docker-compose -f docker-compose.kong.yml restart kong

# View Kong configuration
curl http://localhost:8001/ | jq

# Check enabled plugins
curl http://localhost:8001/ | jq '.plugins.enabled_in_cluster'
```

### Docker Compose Service Names
- **Service Name**: `kong` (use in docker-compose commands)
- **Container Name**: `kong-gateway` (use in docker commands)
- **Database Service**: `kong-database`
- **Migration Service**: `kong-migration`
- **UI Service**: `konga`

## 🎯 Best Practices

1. **Always use the restart script** (`./restart-kong.sh`) instead of `docker-compose up -d`
2. **Wait for health checks** before accessing Kong
3. **Check logs** if services don't start: `docker logs kong-gateway`
4. **Verify database first** before debugging Kong
5. **Use `docker ps`** to confirm `(healthy)` status

## 📝 Quick Checklist

When Kong won't start:
- [ ] Stop all services: `docker-compose -f docker-compose.kong.yml down`
- [ ] Start database: `docker-compose -f docker-compose.kong.yml up -d kong-database`
- [ ] Wait 10 seconds: `sleep 10`
- [ ] Verify database: `docker exec kong-database pg_isready -U kong`
- [ ] Start all services: `docker-compose -f docker-compose.kong.yml up -d`
- [ ] Check status: `docker ps | grep kong`
- [ ] Test API: `curl http://localhost:8001/`

✅ If all steps pass, Kong is working!
