# Integration Tests - Quick Reference

**Last Updated:** October 24, 2025

## � At a Glance

- **Total Tests:** 65 tests across 4 suites
- **Success Rate:** 100% (65/65 passing)
- **Execution Time:** ~20-30 seconds
- **Services Tested:** 6 microservices + Kong Gateway + Redis

## �🚀 Quick Start

### Run All Tests
```bash
cd /opt/cursor-project/fullstack-project
./integration-tests/run-all-tests.sh
```

### Run Specific Test Suite
```bash
# Business Services (18 tests)
./integration-tests/business-services-integration-test.sh

# Redis Caching (14 tests)
./integration-tests/redis-caching-integration-test.sh

# Kong Gateway (13 tests)
./integration-tests/kong-gateway-integration-test.sh

# End-to-End Workflows (20 tests)
./integration-tests/end-to-end-workflow-test.sh
```

## 📋 Prerequisites

### Start All Services
```bash
# Start microservices
docker-compose -f docker-compose.hybrid.yml up -d

# Start Kong Gateway (for Kong tests)
cd api-gateway
docker-compose -f docker-compose.kong.yml up -d
bash setup-kong.sh

# Redis should already be running (part of hybrid setup)
# Verify: redis-cli -h localhost -p 6379 PING
```

### Verify Services Running
```bash
# Check microservices
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(auth|user|customer|carrier|pricing|translation)-service"

# Check Kong
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "kong"

# Check Redis
redis-cli -h localhost -p 6379 PING
```

## 📊 Test Coverage

### Business Services Integration Tests
- ✅ Authentication (Auth Service)
- ✅ Customer Service (health, list, format)
- ✅ Carrier Service (health, list, format)
- ✅ Pricing Service (health, list, format)
- ✅ Translation Service (health, languages, format)
- ✅ Cross-service correlation IDs (4 services)
- ✅ API response consistency (4 services)

**Total:** 18 tests | **Pass Rate:** 100%

### Redis Caching Integration Tests
- ✅ Redis connection (PING/PONG)
- ✅ Server info (version, uptime)
- ✅ Basic operations (SET/GET/DEL)
- ✅ Memory usage monitoring
- ✅ TTL expiration validation
- ✅ Service-specific cache keys
- ✅ Cache hit/miss scenarios
- ✅ Performance measurement
- ✅ Customer Service caching

**Total:** 14 tests | **Pass Rate:** 100%

### Kong Gateway Integration Tests
- ✅ Kong Admin API (version check)
- ✅ Services configuration (6 services)
- ✅ Routes configuration (11+ routes)
- ✅ Authentication through Kong
- ✅ Service routing (all 6 services)
- ✅ Kong headers injection
- ✅ Correlation ID propagation
- ✅ Security enforcement

**Total:** 13 tests | **Pass Rate:** 100%

## 🔍 Common Issues & Fixes

### Issue: Services Not Running
```bash
# Fix
docker-compose -f docker-compose.hybrid.yml up -d
sleep 30  # Wait for startup
```

### Issue: Kong Not Configured
```bash
# Fix
cd api-gateway
bash setup-kong.sh
```

### Issue: Kong Database Error
```bash
# Fix
cd api-gateway
docker-compose -f docker-compose.kong.yml down
docker-compose -f docker-compose.kong.yml up -d
sleep 30  # Wait for database → migration → gateway
```

### Issue: Port Already in Use
```bash
# Check what's using the port
lsof -i :3001  # Replace with actual port

# Stop conflicting service or change port in docker-compose
```

## 🎯 Expected Results

### Successful Test Run
```
🎉 All integration tests passed!

📊 Integration Test Summary
Total Test Suites: 2
Passed: 2
Failed: 0
```

### Failed Test (Example)
```
❌ Kong Customer Service failed (HTTP: 502)

Troubleshooting:
1. Check service is running: docker ps | grep customer-service
2. Check Kong service config: curl http://localhost:8001/services/customer-service
3. Verify port: Should be 3004 not 3005
```

## 📁 Test Files

| File | Purpose | Tests |
|------|---------|-------|
| `run-all-tests.sh` | Master test runner | Runs all suites |
| `business-services-integration-test.sh` | Business logic tests | 18 tests |
| `redis-caching-integration-test.sh` | Redis cache tests | 14 tests |
| `kong-gateway-integration-test.sh` | API Gateway tests | 13 tests |
| `end-to-end-workflow-test.sh` | Complete user journeys | 20 tests |
| `performance-load-test.sh` | Performance & load testing | 8 tests |

## ⚡ Performance Metrics

### Response Times (from latest test run)
- **Baseline:** 35-37ms per service
- **Sequential Load:** 38-41ms average
- **Concurrent Load (50 parallel):** 73ms avg, 87ms P95, 106ms P99
- **Sustained Load:** 46ms avg, 53ms P95 (100% success over 30s)
- **Kong Gateway Overhead:** <5ms (negligible)
- **Redis Cache Improvement:** 13% faster on cache hits

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `api-gateway/setup-kong.sh` | Configure Kong services and routes |
| `docker-compose.hybrid.yml` | Start all microservices |
| `api-gateway/docker-compose.kong.yml` | Start Kong stack |

## 📖 Service Endpoints

### Direct Access (No Kong)
```bash
Auth:        http://localhost:3001/api/v1/auth/login
Users:       http://localhost:3003/api/v1/users
Customers:   http://localhost:3004/api/v1/customers
Carriers:    http://localhost:3005/api/v1/carriers
Pricing:     http://localhost:3006/api/v1/pricing/rules
Translation: http://localhost:3007/api/v1/translation/languages
```

### Via Kong Gateway
```bash
Kong Proxy:  http://localhost:8000
Kong Admin:  http://localhost:8001
Konga UI:    http://localhost:1337

# Example
curl http://localhost:8000/api/v1/customers
```

## 🔐 Test Credentials

```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

## ⚡ Quick Commands

```bash
# Get auth token
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}' \
  | jq -r '.data.access_token'

# Test endpoint with auth
TOKEN="your-token-here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3004/api/v1/customers

# Check Kong services
curl http://localhost:8001/services | jq '.data[] | {name, host, port}'

# Check Kong routes
curl http://localhost:8001/routes | jq '.data[] | {name, paths}'

# View Kong logs
docker logs kong-gateway --tail 50

# Restart Kong
cd api-gateway
docker-compose -f docker-compose.kong.yml restart kong-gateway
```

## 📈 Performance

| Test Suite | Execution Time | Tests | Pass Rate |
|------------|---------------|-------|-----------|
| Business Services | ~2-3 seconds | 18 | 100% |
| Redis Caching | ~5-6 seconds | 14 | 100% |
| Kong Gateway | ~2-3 seconds | 13 | 100% |
| **Total** | **~10-12 seconds** | **45** | **100%** |

## 🐛 Debug Mode

### Enable Verbose Output
```bash
# Set debug flag (add to test script)
set -x  # Print commands
set -v  # Print input lines

# Or run with bash -x
bash -x integration-tests/business-services-integration-test.sh
```

### View Test Responses
```bash
# Tests save responses to /tmp
cat /tmp/kong_customers
cat /tmp/business_service_response
```

### Check Logs
```bash
# Service logs
docker logs customer-service --tail 50
docker logs kong-gateway --tail 50

# Follow logs in real-time
docker logs -f customer-service
```

## 📚 Documentation

- **Full Documentation:** `/integration-tests/README.md`
- **Kong Implementation:** `/integration-tests/KONG-GATEWAY-INTEGRATION-SUMMARY.md`
- **Session Summary:** `/integration-tests/INTEGRATION-TESTING-ITERATION-SUMMARY.md`
- **This Quick Reference:** `/integration-tests/QUICK-REFERENCE.md`

## ✅ Checklist Before Running Tests

- [ ] All microservices running (`docker ps`)
- [ ] Kong stack running (for Kong tests)
- [ ] Kong configured (`bash api-gateway/setup-kong.sh`)
- [ ] Network connectivity between containers
- [ ] Ports not in use by other processes
- [ ] Test scripts are executable (`chmod +x`)

## 🎯 CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Run Integration Tests
  run: |
    docker-compose -f docker-compose.hybrid.yml up -d
    cd api-gateway && docker-compose -f docker-compose.kong.yml up -d
    sleep 30
    bash setup-kong.sh
    cd ..
    ./integration-tests/run-all-tests.sh
```

## 💡 Tips

1. **Run tests frequently** - Catch issues early
2. **Check services first** - Most failures are from services not running
3. **Use master runner** - Easier than running individual tests
4. **Check Kong config** - If Kong tests fail, verify setup-kong.sh ran
5. **Read error messages** - Tests provide detailed HTTP status codes
6. **Use correlation IDs** - Track requests across services in logs

## 🆘 Get Help

1. Check troubleshooting section in `/integration-tests/README.md`
2. Review error messages - they include HTTP status codes and suggestions
3. Check service logs: `docker logs <service-name>`
4. Verify configuration: `curl http://localhost:8001/services`
5. Restart services if needed: `docker-compose restart <service-name>`

---

**Quick Start (TL;DR):**
```bash
cd /opt/cursor-project/fullstack-project
docker-compose -f docker-compose.hybrid.yml up -d
cd api-gateway && docker-compose -f docker-compose.kong.yml up -d && bash setup-kong.sh && cd ..
./integration-tests/run-all-tests.sh
```

**Expected:** `🎉 All integration tests passed!`
