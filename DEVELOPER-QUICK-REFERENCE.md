# ⚡ Developer Quick Reference

> Fast command reference for daily development tasks

---

## 🚀 Getting Started (First Time)

```bash
# 1. Clone and setup
git clone <repo-url>
cd fullstack-project

# 2. Start infrastructure
cd shared-database && docker-compose up -d
cd ../shared-redis && docker-compose up -d

# 3. Start all services
cd ..
docker-compose -f docker-compose.hybrid.yml up -d

# 4. Verify everything is running
docker ps
```

**Access Points**:
- Frontend: http://localhost:3000 (admin@example.com / Admin123!)
- Auth API: http://localhost:3001/api/docs
- User API: http://localhost:3003/api/docs
- Carrier API: http://localhost:3005/api/docs
- Customer API: http://localhost:3004/api/docs
- Pricing API: http://localhost:3006/api/docs

---

## 🔄 Daily Development Workflow

### Start Your Day
```bash
# Check what's running
docker ps

# Start everything (if stopped)
docker-compose -f docker-compose.hybrid.yml up -d

# View logs for specific service
docker logs customer-service -f
```

### Working on a Service
```bash
# Option 1: Local development (hot reload)
cd customer-service
npm install
npm run start:dev

# Option 2: Docker development
docker-compose -f docker-compose.hybrid.yml restart customer-service
docker logs customer-service -f
```

### Making Changes
```bash
# 1. Edit code
# 2. Test locally
cd service-name
npm run build
npm run test

# 3. Rebuild Docker image
cd ..
docker-compose -f docker-compose.hybrid.yml build service-name

# 4. Deploy changes
docker-compose -f docker-compose.hybrid.yml up -d service-name

# 5. Verify
docker logs service-name --tail 50
curl http://localhost:PORT/api/docs/
```

### End Your Day
```bash
# Stop all services (keeps data)
docker-compose -f docker-compose.hybrid.yml stop

# Or stop everything including databases
docker-compose -f docker-compose.hybrid.yml down
```

---

## 🐳 Docker Commands

### Container Management
```bash
# List all containers
docker ps -a

# Start/stop specific service
docker-compose -f docker-compose.hybrid.yml up -d customer-service
docker-compose -f docker-compose.hybrid.yml stop customer-service

# Restart service
docker-compose -f docker-compose.hybrid.yml restart customer-service

# Remove container (rebuilds from scratch)
docker-compose -f docker-compose.hybrid.yml rm -f customer-service
docker-compose -f docker-compose.hybrid.yml up -d customer-service

# View logs
docker logs customer-service --tail 100 -f

# Execute command in container
docker exec -it customer-service sh
docker exec customer-service npm run typeorm:migration:run
```

### Building
```bash
# Build all services
docker-compose -f docker-compose.hybrid.yml build

# Build specific service
docker-compose -f docker-compose.hybrid.yml build customer-service

# Build with no cache (clean build)
docker-compose -f docker-compose.hybrid.yml build --no-cache customer-service

# Build and start immediately
docker-compose -f docker-compose.hybrid.yml up -d --build customer-service
```

### Cleanup
```bash
# Free up disk space (removes stopped containers, unused images)
docker system prune -af

# Remove volumes too (CAREFUL: deletes data!)
docker system prune -af --volumes

# Remove specific service and rebuild
docker-compose -f docker-compose.hybrid.yml rm -sf customer-service
docker-compose -f docker-compose.hybrid.yml build customer-service
docker-compose -f docker-compose.hybrid.yml up -d customer-service
```

### Health Checks
```bash
# Check all container health
docker ps --format "table {{.Names}}\t{{.Status}}"

# Check specific service
docker ps --filter "name=customer-service"

# Check logs for errors
docker logs customer-service --tail 50 | grep -i error
```

---

## 💾 Database Commands

### MySQL
```bash
# Connect to database
docker exec -it shared-user-database mysql -u root -ppassword

# Run SQL query
docker exec -it shared-user-database mysql -u root -ppassword -e "SHOW DATABASES;"

# View table structure
docker exec -it shared-user-database mysql -u root -ppassword service_db -e "DESCRIBE users;"

# Backup database
docker exec shared-user-database mysqldump -u root -ppassword service_db > backup.sql

# Restore database
docker exec -i shared-user-database mysql -u root -ppassword service_db < backup.sql

# Reset database (CAREFUL!)
docker-compose -f docker-compose.hybrid.yml down -v
docker-compose -f docker-compose.hybrid.yml up -d
```

### TypeORM Migrations
```bash
# Generate migration (after entity changes)
cd service-name
npm run typeorm:migration:generate -- -n AddCustomerAddress

# Run migrations
npm run typeorm:migration:run

# Revert last migration
npm run typeorm:migration:revert

# Show migration status
npm run typeorm:migration:show
```

### Redis
```bash
# Connect to Redis CLI
docker exec -it shared-redis redis-cli

# View all keys
docker exec -it shared-redis redis-cli KEYS '*'

# Get specific key
docker exec -it shared-redis redis-cli GET "customer:123"

# Delete key pattern
docker exec -it shared-redis redis-cli KEYS "customer:*" | xargs docker exec -i shared-redis redis-cli DEL

# Flush all data (CAREFUL!)
docker exec -it shared-redis redis-cli FLUSHALL
```

---

## 🧪 Testing Commands

### Unit Tests
```bash
# Run all tests
cd service-name
npm run test

# Run specific test file
npm run test -- customer.domain.service.spec.ts

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:cov
```

### Integration Tests
```bash
# Run integration tests
npm run test:e2e

# Run with debug
npm run test:e2e -- --detectOpenHandles
```

### API Testing
```bash
# Health check
curl http://localhost:3004/api/v1/health

# Test endpoint
curl -X POST http://localhost:3004/api/v1/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"1234567890"}'

# Test with authentication
curl -X GET http://localhost:3004/api/v1/customers \
  -H "Authorization: Bearer YOUR_TOKEN"

# Pretty print JSON response
curl -s http://localhost:3004/api/v1/customers | jq
```

---

## 🛠️ Service Development

### Create New Endpoint
```bash
# 1. Create DTO files
touch src/interfaces/http/dtos/create-entity.dto.ts
touch src/interfaces/http/dtos/entity-response.dto.ts

# 2. Create use case
touch src/application/use-cases/create-entity.use-case.ts

# 3. Add controller method
# Edit: src/interfaces/http/controllers/entity.controller.ts

# 4. Test locally
npm run build
npm run start:dev

# 5. Test endpoint
curl -X POST http://localhost:PORT/api/v1/entities -H "Content-Type: application/json" -d '{...}'

# 6. Verify Swagger
open http://localhost:PORT/api/docs
```

### Add Swagger Documentation
```bash
# 1. Install dependencies (if needed)
npm install @nestjs/swagger swagger-ui-express

# 2. Add decorators to DTOs
# @ApiProperty() for each field

# 3. Add decorators to controller
# @ApiTags(), @ApiOperation(), @ApiResponse()

# 4. Verify
npm run build
npm run start:dev
open http://localhost:PORT/api/docs
```

### Fix Dependency Injection Issue
```bash
# Symptom: "Nest can't resolve dependencies"
# Solution: Add @Global() decorator

# 1. Edit app.module.ts
# Add: import { Global } from '@nestjs/common';
# Add: @Global() decorator above @Module

# 2. Ensure provider is exported
# exports: [ServiceName]

# 3. Test
npm run build
npm run start:dev

# 4. Deploy
docker-compose -f docker-compose.hybrid.yml build service-name
docker-compose -f docker-compose.hybrid.yml up -d service-name
```

---

## 🔍 Debugging Commands

### View Logs
```bash
# All logs
docker-compose -f docker-compose.hybrid.yml logs

# Specific service
docker-compose -f docker-compose.hybrid.yml logs customer-service

# Follow logs (live tail)
docker logs customer-service -f

# Last 100 lines
docker logs customer-service --tail 100

# Filter logs
docker logs customer-service 2>&1 | grep ERROR
docker logs customer-service 2>&1 | grep "Nest application"
```

### Inspect Container
```bash
# Get container details
docker inspect customer-service

# Check environment variables
docker exec customer-service printenv

# Check file system
docker exec customer-service ls -la /app
docker exec customer-service cat /app/package.json

# Check running processes
docker exec customer-service ps aux

# Check network connectivity
docker exec customer-service ping shared-redis
docker exec customer-service nc -zv shared-user-database 3306
```

### Debug Build Issues
```bash
# Build with detailed output
docker-compose -f docker-compose.hybrid.yml build --progress=plain customer-service

# Check disk space
df -h

# Clean Docker system
docker system prune -af

# Remove and rebuild
docker-compose -f docker-compose.hybrid.yml rm -f customer-service
docker-compose -f docker-compose.hybrid.yml build --no-cache customer-service
docker-compose -f docker-compose.hybrid.yml up -d customer-service
```

### Debug Runtime Issues
```bash
# Check service health
curl http://localhost:3004/api/v1/health

# Check database connection
docker exec customer-service node -e "const mysql = require('mysql2'); const conn = mysql.createConnection({host:'customer-service-db',user:'root',password:'password'}); conn.connect(err => console.log(err ? 'Failed' : 'Connected'));"

# Check Redis connection
docker exec customer-service node -e "const redis = require('redis'); const client = redis.createClient({url:'redis://shared-redis:6379'}); client.connect().then(() => console.log('Connected')).catch(err => console.log('Failed'));"

# Interactive shell
docker exec -it customer-service sh
```

---

## 📊 Monitoring & Health

### Check All Services
```bash
# Container status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Health check all services
for port in 3001 3003 3004 3005 3006; do
  echo "Port $port:"
  curl -s http://localhost:$port/api/v1/health | jq
done

# Check Swagger availability
for port in 3001 3003 3004 3005 3006; do
  echo "Port $port Swagger:"
  curl -s http://localhost:$port/api/docs/ | grep -o "<title>.*</title>"
done
```

### Resource Usage
```bash
# Container resource usage
docker stats

# Specific service
docker stats customer-service

# Disk usage
docker system df

# Image sizes
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### Network Debugging
```bash
# List networks
docker network ls

# Inspect network
docker network inspect fullstack-project_app-network

# Check service connectivity
docker exec customer-service ping -c 3 shared-redis
docker exec customer-service nc -zv customer-service-db 3306
```

---

## 🎯 Common Fixes

### Port Already in Use
```bash
# Find process
lsof -i :3004

# Kill process
kill -9 <PID>

# Or stop Docker container
docker stop customer-service
```

### Database Connection Failed
```bash
# Check database is running
docker ps | grep mysql

# Restart database
docker-compose -f docker-compose.hybrid.yml restart customer-service-db

# Wait for database ready
sleep 30

# Test connection
docker exec -it customer-service-db mysql -u root -ppassword -e "SELECT 1;"
```

### Service Won't Start
```bash
# Check logs for errors
docker logs customer-service

# Remove and recreate
docker-compose -f docker-compose.hybrid.yml rm -f customer-service
docker-compose -f docker-compose.hybrid.yml up -d customer-service

# Check dependencies started
docker ps | grep "redis\|mysql"
```

### Out of Disk Space
```bash
# Check disk usage
df -h
docker system df

# Clean up
docker system prune -af
docker volume prune -f

# Remove old images
docker image prune -af
```

### Module Not Found
```bash
# Rebuild with no cache
cd service-name
rm -rf node_modules dist
npm install
npm run build

# Or in Docker
docker-compose -f docker-compose.hybrid.yml build --no-cache service-name
```

---

## 🚨 Emergency Commands

### Complete Reset
```bash
# ⚠️ WARNING: This deletes all data!

# Stop everything
docker-compose -f docker-compose.hybrid.yml down -v

# Clean Docker
docker system prune -af --volumes

# Restart fresh
cd shared-database && docker-compose up -d
cd ../shared-redis && docker-compose up -d
cd ..
docker-compose -f docker-compose.hybrid.yml up -d
```

### Service-Specific Reset
```bash
# Reset specific service (keeps other services running)
docker-compose -f docker-compose.hybrid.yml stop customer-service
docker-compose -f docker-compose.hybrid.yml rm -f customer-service
docker volume rm fullstack-project_customer-service-db-data
docker-compose -f docker-compose.hybrid.yml up -d customer-service
```

### Database-Only Reset
```bash
# Reset database but keep service
docker-compose -f docker-compose.hybrid.yml stop customer-service-db
docker volume rm fullstack-project_customer-service-db-data
docker-compose -f docker-compose.hybrid.yml up -d customer-service-db
sleep 30  # Wait for init
docker-compose -f docker-compose.hybrid.yml restart customer-service
```

---

## 🔗 Quick URLs

**Swagger API Documentation Hub**:
- **Swagger Index**: http://localhost:8080 (Central documentation hub)
  ```bash
  # Start the Swagger index server
  node swagger-server.js
  # Or open the HTML file directly in browser
  open swagger-index.html  # macOS
  xdg-open swagger-index.html  # Linux
  ```

**Development**:
- React Admin: http://localhost:3000
- Auth Swagger: http://localhost:3001/api/docs
- User Swagger: http://localhost:3003/api/docs
- Customer Swagger: http://localhost:3004/api/docs
- Carrier Swagger: http://localhost:3005/api/docs
- Pricing Swagger: http://localhost:3006/api/docs
- Translation Swagger: http://localhost:3007/api/docs

**Default Credentials**:
- Email: admin@example.com
- Password: Admin123!

---

## 📚 More Help

- **Full Architecture Guide**: [ARCHITECTURE-GUIDE.md](ARCHITECTURE-GUIDE.md)
- **Quick Start**: [QUICK-START.md](QUICK-START.md)
- **Documentation Index**: [DOCUMENTATION-INDEX.md](DOCUMENTATION-INDEX.md)
- **AI Instructions**: [.github/copilot-instructions.md](.github/copilot-instructions.md)

---

**Last Updated**: October 26, 2025
