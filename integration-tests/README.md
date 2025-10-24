# Integration Tests

This directory contains comprehensive integration tests for the fullstack microservices project.

## 📊 Test Suite Overview

**Total Tests:** 73 tests across 5 test suites
**Success Rate:** 100% (73/73 passing)
**Execution Time:** ~90-120 seconds

## Available Test Suites

### 1. Business Services Integration Test ✅
**File:** `business-services-integration-test.sh`
**Tests:** 18 | **Status:** All Passing

Tests the integration between Customer, Carrier, Pricing, and Translation services.

**Coverage:**
- Service health checks
- API endpoint functionality
- Response format consistency
- Cross-service correlation ID propagation

### 2. Redis Caching Integration Test ✅
**File:** `redis-caching-integration-test.sh`
**Tests:** 14 | **Status:** All Passing

Tests Redis caching infrastructure and service integration.

**Coverage:**
- Redis connection and operations
- Cache hit/miss scenarios
- TTL expiration behavior
- Service-specific cache keys
- Performance measurement

### 3. Kong Gateway Integration Test ✅
**File:** `kong-gateway-integration-test.sh`
**Tests:** 13 | **Status:** All Passing

Tests the Kong API Gateway configuration and routing to all microservices.

**Coverage:**
- Kong Admin API functionality
- Service and route configuration
- Authentication through gateway
- Header injection and correlation IDs
- Security validation

### 4. End-to-End Workflow Test ✅
**File:** `end-to-end-workflow-test.sh`
**Tests:** 20 | **Status:** All Passing

Tests complete user journeys across multiple microservices.

**Coverage:**
- Customer lifecycle management (CRUD)
- Carrier management workflow
- Pricing rule creation and application
- Cross-service data consistency
- Translation service integration
- Error handling and edge cases

### 5. Master Test Runner 🚀
**File:** `run-all-tests.sh`

Runs all integration test suites sequentially with aggregate reporting.

**Features:**
- Automatic service availability checking
- Conditional suite execution (Redis, Kong)
- Comprehensive pass/fail reporting
- Color-coded output

### 6. Performance and Load Test ⚡
**File:** `performance-load-test.sh`
**Tests:** 8 | **Status:** All Passing

Tests system performance under various load conditions.

**Coverage:**
- Baseline response time measurement
- Sequential load testing (10 req/service)
- Concurrent load testing (50 parallel requests)
- Kong Gateway overhead analysis
- Redis cache performance impact
- Sustained load testing (30 seconds)
- Rate limiting validation

---

## 🚀 Quick Start

### Run All Tests
```bash
./integration-tests/run-all-tests.sh
```

### Run Individual Test Suites
```bash
# Business services only
./integration-tests/business-services-integration-test.sh

# Redis caching only
./integration-tests/redis-caching-integration-test.sh

# Kong Gateway only
./integration-tests/kong-gateway-integration-test.sh

# End-to-end workflows only
./integration-tests/end-to-end-workflow-test.sh

# Performance and load testing only
./integration-tests/performance-load-test.sh
```

---

## Kong Gateway Integration Test

**File:** `kong-gateway-integration-test.sh`

### Purpose
Validates the Kong API Gateway setup and ensures:
- Kong Admin API is operational
- All microservices are registered as Kong services
- Routes are properly configured
- Authentication flows through Kong correctly
- All services are accessible via Kong proxy
- Security plugins (JWT, Rate Limiting, CORS) are working
- Correlation IDs propagate through the gateway

### Prerequisites

1. **Running Kong Stack:**
   ```bash
   cd /opt/cursor-project/fullstack-project/api-gateway
   docker-compose -f docker-compose.kong.yml up -d
   ```

2. **Kong Services:**
   - Kong Database (PostgreSQL on port 5433)
   - Kong Gateway (ports 8000, 8001, 8443, 8444)
   - Konga Admin UI (port 1337)

3. **Running Microservices:**
   ```bash
   docker-compose -f docker-compose.hybrid.yml up -d
   ```

4. **Kong Configuration:**
   ```bash
   cd api-gateway
   bash setup-kong.sh
   ```

### Test Coverage

#### 1. Kong Admin API Test
- ✅ Verify Kong Admin API is accessible
- ✅ Check Kong version (3.4.2)

#### 2. Kong Services Configuration Test
- ✅ Verify 6 services are configured:
  - auth-service (port 3001)
  - user-service (port 3003)
  - customer-service (port 3004)
  - carrier-service (port 3005)
  - pricing-service (port 3006)
  - translation-service (port 3007)

#### 3. Kong Routes Configuration Test
- ✅ Verify 11+ routes are configured
- ✅ Routes properly linked to services

#### 4. Authentication Through Kong
- ✅ Test login via Kong proxy
- ✅ Validate JWT token generation

#### 5. Service Routing Tests
- ✅ Auth Service - `/api/v1/auth/login`
- ✅ User Service - `/api/v1/users`
- ✅ Customer Service - `/api/v1/customers`
- ✅ Carrier Service - `/api/v1/carriers`
- ✅ Pricing Service - `/api/v1/pricing/rules`
- ✅ Translation Service - `/api/v1/translation/languages`

#### 6. Kong Headers Test
- ✅ Verify Kong injects proper headers:
  - `X-Kong-Upstream-Latency`
  - `X-Kong-Proxy-Latency`
  - `X-RateLimit-*` headers

#### 7. Correlation ID Propagation
- ✅ Test correlation ID passes through Kong
- ✅ Verify distributed tracing support

#### 8. Security Test
- ✅ Verify unauthorized requests are blocked (401)
- ✅ Test JWT authentication enforcement

### Running the Tests

```bash
# Make executable (if not already)
chmod +x integration-tests/kong-gateway-integration-test.sh

# Run tests
./integration-tests/kong-gateway-integration-test.sh
```

### Expected Output

```
🚪 Kong Gateway Integration Tests
=================================
🏁 Starting Kong Gateway Integration Tests...

🔍 Kong Admin API
✅ Kong Admin API - Version: 3.4.2

🔍 Kong Services Configuration
✅ Kong Services - 6 services configured

🔍 Kong Routes Configuration
✅ Kong Routes - 11 routes configured

🔍 Getting authentication token
✅ Authentication successful

🔍 Kong Routing - Auth Login
✅ Kong Auth Login - Routed successfully

🔍 Kong Routing - User Service
✅ Kong User Service - Routed successfully

🔍 Kong Routing - Customer Service
✅ Kong Customer Service - Routed successfully

🔍 Kong Routing - Carrier Service
✅ Kong Carrier Service - Routed successfully

🔍 Kong Routing - Pricing Service
✅ Kong Pricing Service - Routed successfully

🔍 Kong Routing - Translation Service
✅ Kong Translation Service - Routed successfully

🔍 Kong Request Headers
✅ Kong Headers - Kong-specific headers present

🔍 Kong Correlation ID Propagation
✅ Kong Correlation ID - Request successful

🔍 Kong Unauthorized Access
✅ Kong Security - Unauthorized access blocked (401)

==============================================
📊 Kong Gateway Integration Test Summary
==============================================
✅ Kong Admin API operational
✅ Kong services configured (6 services)
✅ Kong routes configured (11+ routes)
✅ Authentication through Kong working
✅ All microservices accessible via Kong
✅ Security (unauthorized access blocked)
✅ Correlation ID propagation tested

==============================================
📈 Test Results
==============================================
Total Tests: 13
Passed: 13
Failed: 0
Success Rate: 100%

🎉 Kong Gateway Integration Tests - All Passed!
```

### Troubleshooting

**Issue: Kong Database not running**
```bash
cd api-gateway
docker-compose -f docker-compose.kong.yml down
docker-compose -f docker-compose.kong.yml up -d
```

**Issue: Routes not configured**
```bash
cd api-gateway
bash setup-kong.sh
```

**Issue: Services returning 502 Bad Gateway**
- Verify microservices are running: `docker ps | grep -E "customer|carrier|pricing|translation"`
- Check service ports match Kong configuration
- Customer: 3004, Carrier: 3005, Pricing: 3006, Translation: 3007

**Issue: Services returning 404 Not Found**
- Verify route paths match service endpoints
- Customer, Carrier: `/api/v1/{service}`
- Pricing: `/api/v1/pricing/rules`
- Translation: `/api/v1/translation/languages`

---

## Business Services Integration Test

**File:** `business-services-integration-test.sh`

### Purpose
Tests the integration between Customer, Carrier, and Pricing services to ensure:
- All services are healthy and accessible
- API responses follow the standardized format
- Cross-service communication works correctly
- Correlation IDs propagate across services

### Prerequisites

1. **Running Services:**
   ```bash
   cd /opt/cursor-project/fullstack-project
   docker-compose -f docker-compose.hybrid.yml up -d
   ```

2. **Required Services:**
   - Auth Service (port 3001)
   - User Service (port 3003)
   - Customer Service (port 3004)
   - Carrier Service (port 3005)
   - Pricing Service (port 3006)

3. **Dependencies:**
   - `curl` - for HTTP requests
   - `jq` - for JSON parsing

### Running the Tests

```bash
# Make executable (if not already)
chmod +x integration-tests/business-services-integration-test.sh

# Run tests
./integration-tests/business-services-integration-test.sh
```

### Test Coverage

#### 1. Authentication Test
- ✅ Login with admin credentials
- ✅ Extract and validate access token

#### 2. Customer Service Tests
- ✅ Health check endpoint
- ✅ List customers endpoint
- ✅ Verify standardized API response format

#### 3. Carrier Service Tests
- ✅ Health check endpoint
- ✅ List carriers endpoint
- ✅ Verify standardized API response format

#### 4. Pricing Service Tests
- ✅ Health check endpoint
- ✅ List pricing rules endpoint
- ✅ Verify standardized API response format

#### 5. Cross-Service Communication
- ✅ Correlation ID propagation across all three services
- ✅ Request tracking validation

#### 6. API Consistency Tests
- ✅ All services return consistent response format:
  - `success` (boolean)
  - `data` (object/array)
  - `message` (string)
  - `timestamp` (ISO 8601)
  - `statusCode` (number)

### Timeout Configuration

The tests include timeout protection to prevent hanging:
- **Connection Timeout:** 5 seconds
- **Max Request Time:** 10 seconds

### Expected Output

```
🚀 Business Services Integration Tests
=====================================
🏁 Starting Business Services Integration Tests...

🔍 Getting authentication token
✅ Authentication successful

🔍 Customer Service API Tests
✅ Customer Service - Health check passed
✅ Customer Service - API format is standardized

🔍 Carrier Service API Tests
✅ Carrier Service - Health check passed
✅ Carrier Service - API format is standardized

🔍 Pricing Service API Tests
✅ Pricing Service - Health check passed
✅ Pricing Service - API format is standardized

🔍 Cross-Service Communication Tests
✅ localhost - Correlation ID handled correctly
✅ localhost - Correlation ID handled correctly
✅ localhost - Correlation ID handled correctly
ℹ️  Check logs for correlation ID: test-business-XXXXXXXXXX

🔍 API Response Consistency Tests
✅ Customer - Response format fully consistent
✅ Carrier - Response format fully consistent
✅ Pricing - Response format fully consistent
✅ All business services have consistent API responses

==============================================
📊 Business Services Integration Test Summary
==============================================
✅ Customer Service: API endpoints and format validated
✅ Carrier Service: API endpoints and format validated
✅ Pricing Service: API endpoints and format validated
✅ Cross-service correlation ID propagation tested
✅ API response consistency validated

🎉 Business Services Integration Tests Complete - All Passed!
```

### Troubleshooting

#### Services Not Running
```bash
# Check service status
docker-compose -f docker-compose.hybrid.yml ps

# Start services if needed
docker-compose -f docker-compose.hybrid.yml up -d
```

#### Authentication Failures
- Verify admin credentials in the script match your setup
- Default: `admin@example.com` / `Admin123!`

#### Connection Timeouts
- Check if services are healthy: `docker-compose -f docker-compose.hybrid.yml ps`
- Review service logs: `docker-compose -f docker-compose.hybrid.yml logs <service-name>`

#### Missing Dependencies
```bash
# Install jq on macOS
brew install jq

# Install jq on Ubuntu/Debian
sudo apt-get install jq

# Install curl (usually pre-installed)
# macOS: brew install curl
# Ubuntu/Debian: sudo apt-get install curl
```

### API Endpoints Tested

| Service | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| Auth | `/api/v1/auth/login` | POST | Admin authentication |
| Customer | `/api/v1/health` | GET | Health check |
| Customer | `/api/v1/customers` | GET | List customers |
| Carrier | `/api/v1/health` | GET | Health check |
| Carrier | `/api/v1/carriers` | GET | List carriers |
| Pricing | `/api/v1/health` | GET | Health check |
| Pricing | `/api/v1/pricing/rules` | GET | List pricing rules |

### Exit Codes

- `0` - All tests passed
- `1` - One or more tests failed

### Continuous Integration

This test script can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Integration Tests
  run: |
    docker-compose -f docker-compose.hybrid.yml up -d
    sleep 30  # Wait for services to be ready
    ./integration-tests/business-services-integration-test.sh
```

### Correlation ID Testing

The test generates unique correlation IDs in the format:
```
test-business-<unix-timestamp>
```

You can trace these IDs in service logs to verify cross-service request tracking.

### Future Enhancements

- [ ] Add data mutation tests (create, update, delete)
- [ ] Test error handling scenarios
- [ ] Add performance metrics (response times)
- [ ] Test rate limiting and throttling
- [ ] Add authentication/authorization edge cases
- [ ] Test pagination boundaries
- [ ] Add stress testing capabilities
