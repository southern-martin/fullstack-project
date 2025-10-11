# Docker Commands for Southern-Martin Auth Service

## 🚀 Basic Commands

### Build and Start
```bash
# Build Docker images
npm run docker:build

# Start all services
npm run docker:start

# Start services in background
npm run docker:up

# Stop services
npm run docker:down
```

### Development
```bash
# View logs
npm run docker:logs

# Restart services
npm run docker:restart

# Stop services
npm run docker:stop
```

## 🧹 Cleanup Commands

### Project Cleanup (Recommended)
```bash
# Clean up current project only
npm run docker:clean
```
**What it does:**
- Stops and removes project containers
- Removes project volumes
- Removes project images
- Removes project network

### Comprehensive Cleanup
```bash
# Clean up all southern-martin related resources
npm run docker:clean:all
```
**What it does:**
- Removes ALL containers with 'southern-martin' in name
- Removes ALL volumes with 'southern-martin' in name
- Removes ALL images with 'southern-martin' in name
- Removes ALL networks with 'southern-martin' in name
- Cleans up dangling images

### System Cleanup (⚠️ Use with caution)
```bash
# Clean up entire Docker system
npm run docker:clean:system
```
**What it does:**
- Removes ALL unused containers
- Removes ALL unused networks
- Removes ALL unused images
- Removes ALL unused volumes
- Removes ALL unused build cache
- **WARNING:** This affects ALL Docker projects, not just this one

## 📋 Container Names

All containers are prefixed with `southern-martin-`:

- **Database:** `southern-martin-auth-db`
- **Application:** `southern-martin-auth-app`
- **Redis:** `southern-martin-auth-redis`

## 🌐 Network

- **Network:** `southern-martin-auth_southern-martin-network`

## 💾 Volumes

- **Database:** `southern-martin-auth_southern-martin_auth_db_data`
- **Redis:** `southern-martin-auth_southern-martin_auth_redis_data`

## 🔍 Manual Docker Commands

If you need to run Docker commands manually:

```bash
# List all containers
docker ps -a

# List all images
docker images

# List all volumes
docker volume ls

# List all networks
docker network ls

# Remove specific container
docker rm -f <container-name>

# Remove specific image
docker rmi -f <image-name>

# Remove specific volume
docker volume rm <volume-name>

# Remove specific network
docker network rm <network-name>
```

## 🚨 Troubleshooting

### Port Conflicts
If you get port conflicts, check what's using the ports:
```bash
# Check port 3001 (Auth Service)
lsof -i :3001

# Check port 3307 (Database)
lsof -i :3307

# Check port 6379 (Redis)
lsof -i :6379
```

### Clean Start
If you're having issues, try a clean start:
```bash
npm run docker:clean
npm run docker:build
npm run docker:start
```

### View Logs
```bash
# View all logs
npm run docker:logs

# View specific service logs
docker-compose logs auth-service
docker-compose logs auth-db
docker-compose logs auth-redis
```






