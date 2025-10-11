# Docker Workspace Commands

## 🚀 Quick Reference

All Docker cleanup commands are available at the workspace level using `make`:

```bash
# Show all available commands
make help

# Docker cleanup commands
make docker-clean        # Basic cleanup
make docker-clean-all    # Comprehensive cleanup
make docker-clean-system # System-wide cleanup (WARNING!)
make docker-clean-auth   # Auth Service cleanup
make docker-status       # Show Docker status
```

## 🧹 Docker Cleanup Commands

### 1. Basic Cleanup
```bash
make docker-clean
```
**What it does:**
- Stops and removes containers
- Removes unused volumes
- Removes unused images
- **Safe** - only removes unused resources

### 2. Comprehensive Cleanup
```bash
make docker-clean-all
```
**What it does:**
- Removes ALL containers with 'southern-martin' in name
- Removes ALL volumes with 'southern-martin' in name
- Removes ALL images with 'southern-martin' in name
- Removes ALL networks with 'southern-martin' in name
- Cleans up dangling images

### 3. System Cleanup (⚠️ Use with caution)
```bash
make docker-clean-system
```
**What it does:**
- Removes ALL unused containers
- Removes ALL unused networks
- Removes ALL unused images
- Removes ALL unused volumes
- Removes ALL unused build cache
- **WARNING:** Affects entire Docker system, not just this project
- **Includes confirmation prompt for safety**

### 4. Auth Service Cleanup
```bash
make docker-clean-auth
```
**What it does:**
- Uses the Auth Service's own cleanup script
- Removes Auth Service containers, volumes, images, and networks
- **Safe** - only affects Auth Service

### 5. Docker Status
```bash
make docker-status
```
**What it shows:**
- All containers with 'southern-martin' in name
- All images with 'southern-martin' in name
- All volumes with 'southern-martin' in name
- All networks with 'southern-martin' in name

## 📋 Container Naming Convention

All containers use the `southern-martin-` prefix:

- **Auth Service Database:** `southern-martin-auth-db`
- **Auth Service App:** `southern-martin-auth-app`
- **Auth Service Redis:** `southern-martin-auth-redis`

## 🌐 Networks and Volumes

- **Network:** `southern-martin-auth_southern-martin-network`
- **Database Volume:** `southern-martin-auth_southern-martin_auth_db_data`
- **Redis Volume:** `southern-martin-auth_southern-martin_auth_redis_data`

## 🚀 Quick Start After Cleanup

```bash
# Clean up everything
make docker-clean-all

# Start Auth Service
cd auth-service
npm run docker:build
npm run docker:start

# Or use the workspace commands
make docker-clean-auth
cd auth-service && npm run docker:build && npm run docker:start
```

## 🔍 Troubleshooting

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
make docker-clean-all
cd auth-service
npm run docker:build
npm run docker:start
```

### View Logs
```bash
# View Auth Service logs
cd auth-service
npm run docker:logs

# Or use Docker directly
docker-compose logs -f
```

## 📚 Additional Commands

The workspace also provides other useful commands:

```bash
# Development
make dev              # Start all services in development mode
make debug            # Start all services in debug mode
make stop             # Stop all services
make restart          # Restart all services

# Individual services
make backend-start    # Start backend only
make frontend-start   # Start frontend only
make go-run           # Run Go API

# Health and testing
make health           # Check health of all services
make test             # Run all tests
```

## 💡 Tips

1. **Use `make docker-clean`** for regular cleanup
2. **Use `make docker-clean-all`** when you want to completely reset the Docker environment
3. **Use `make docker-status`** to see what's currently running
4. **Use `make docker-clean-system`** only when you want to clean up your entire Docker system
5. **Always check `make help`** to see all available commands








