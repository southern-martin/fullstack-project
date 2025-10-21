# 🏥 Microservices Health Check Guide

## 📊 Current Health Status (October 20, 2025)

### ✅ Running Services (5/6)

| Service | Port | Status | Endpoint | Response Format |
|---------|------|--------|----------|----------------|
| **Auth Service** | 3001 | ✅ Healthy | `/api/v1/auth/health` | Standardized |
| **User Service** | 3003 | ✅ Healthy | `/api/v1/health` | Standardized |
| **Customer Service** | 3004 | ✅ Healthy | `/api/v1/health` | Standardized |
| **Carrier Service** | 3005 | ✅ Healthy | `/api/v1/health` | Standardized |
| **Translation Service** | 3007 | ✅ Healthy | `/api/v1/health` | Standardized |
| **Pricing Service** | 3006 | ❌ Not Running | `/api/v1/health` | - |

### 📈 Health Summary
- **Total Services**: 6
- **Running**: 5 (83%)
- **Down**: 1 (17%)
- **API Standards**: 5/5 running services (100%)

---

## 🎯 Quick Health Check Commands

### Check All Services at Once
```bash
# Using curl and jq
curl -s http://localhost:3001/api/v1/auth/health | jq .
curl -s http://localhost:3003/api/v1/health | jq .
curl -s http://localhost:3004/api/v1/health | jq .
curl -s http://localhost:3005/api/v1/health | jq .
curl -s http://localhost:3006/api/v1/health | jq .
curl -s http://localhost:3007/api/v1/health | jq .
```

### Check Docker Container Health
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep service
```

### Check with Status Codes Only
```bash
echo "Auth (3001): $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/api/v1/auth/health)"
echo "User (3003): $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3003/api/v1/health)"
echo "Customer (3004): $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3004/api/v1/health)"
echo "Carrier (3005): $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3005/api/v1/health)"
echo "Pricing (3006): $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3006/api/v1/health)"
echo "Translation (3007): $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3007/api/v1/health)"
```

---

## 🔍 Detailed Health Check Responses

### 1. Auth Service (Port 3001)
**Endpoint**: `http://localhost:3001/api/v1/auth/health`

**Response**:
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2025-10-20T10:28:30.331Z"
  },
  "message": "Success",
  "statusCode": 200,
  "timestamp": "2025-10-20T10:28:30.331Z",
  "success": true
}
```

**Features**:
- ✅ API Standards implemented
- ✅ Standardized response format
- ✅ Docker health check configured

---

### 2. User Service (Port 3003)
**Endpoint**: `http://localhost:3003/api/v1/health`

**Response**:
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2025-10-20T10:28:30.355Z",
    "service": "user-service",
    "version": "1.0.0",
    "environment": "development"
  },
  "message": "Success",
  "statusCode": 200,
  "timestamp": "2025-10-20T10:28:30.355Z",
  "success": true
}
```

**Features**:
- ✅ API Standards implemented
- ✅ Service name and version included
- ✅ Environment information
- ✅ Detailed health check available at `/api/v1/health/detailed`

**Additional Endpoints**:
- `/api/v1/health/detailed` - Detailed metrics (user counts, roles)
- `/api/v1/health/ready` - Readiness probe
- `/api/v1/health/live` - Liveness probe

---

### 3. Customer Service (Port 3004)
**Endpoint**: `http://localhost:3004/api/v1/health`

**Response**:
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2025-10-20T10:28:30.382Z",
    "service": "customer-service"
  },
  "message": "Success",
  "statusCode": 200,
  "timestamp": "2025-10-20T10:28:30.382Z",
  "success": true
}
```

**Features**:
- ✅ API Standards implemented (Oct 20, 2025)
- ✅ Standardized response format
- ✅ Docker health check configured

---

### 4. Carrier Service (Port 3005)
**Endpoint**: `http://localhost:3005/api/v1/health`

**Response**:
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2025-10-20T10:28:30.403Z",
    "service": "carrier-service"
  },
  "message": "Success",
  "statusCode": 200,
  "timestamp": "2025-10-20T10:28:30.403Z",
  "success": true
}
```

**Features**:
- ✅ API Standards implemented (Oct 20, 2025)
- ✅ Standardized response format
- ✅ Docker health check configured

---

### 5. Translation Service (Port 3007)
**Endpoint**: `http://localhost:3007/api/v1/health`

**Response**:
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2025-10-20T10:28:30.456Z",
    "service": "translation-service",
    "version": "1.0.0"
  },
  "message": "Success",
  "statusCode": 200,
  "timestamp": "2025-10-20T10:28:30.456Z",
  "success": true
}
```

**Features**:
- ✅ API Standards implemented
- ✅ Service name and version included
- ✅ Docker health check configured

---

### 6. Pricing Service (Port 3006) ❌
**Endpoint**: `http://localhost:3006/api/v1/health`

**Status**: **Not Running**

**Reason**: Infrastructure setup not completed yet

**To Start**:
```bash
# TODO: Complete Pricing Service infrastructure setup
cd pricing-service
docker-compose up -d
```

---

## 🎨 React-Admin Health Dashboard

### Accessing the Health Dashboard

The React-Admin application includes a **MicroservicesStatus** component that displays real-time health status of all services.

**Location**: `/opt/cursor-project/fullstack-project/react-admin/src/components/MicroservicesStatus.tsx`

**Features**:
- ✅ Real-time health checks
- ✅ Response time tracking
- ✅ Auto-refresh on mount
- ✅ Manual refresh button
- ✅ Visual status indicators (icons + badges)
- ✅ Last checked timestamp
- ✅ Overall health summary

**Usage in Your App**:
```tsx
import MicroservicesStatus from './components/MicroservicesStatus';

// In your page/component
<MicroservicesStatus />
```

**Component Features**:
1. **Status Icons**:
   - ✅ Green checkmark = Healthy
   - ❌ Red X = Unhealthy
   - ⚠️ Yellow alert = Checking

2. **Response Time Tracking**:
   - Displays response time in milliseconds
   - Helps identify slow services

3. **Auto-Check**:
   - Checks all services on component mount
   - Can be manually refreshed

4. **Service Grid**:
   - 3-column responsive grid
   - Shows service name, port, status, and last check time

---

## 📝 Health Check Implementation Details

### Backend Implementation

All services follow the same health check pattern:

```typescript
// Health Controller
@Controller('health')
export class HealthController {
  @Get()
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    service: string;
  }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'service-name',
    };
  }
}
```

### Frontend Implementation

Each service has a `healthCheck()` method in its API client:

```typescript
// Example: customerApiClient.ts
async healthCheck(): Promise<any> {
  return this.request<any>('/health', { method: 'GET' });
}

// Example: customerService.ts
async healthCheck(): Promise<boolean> {
  try {
    await customerApiClient.healthCheck();
    return true;
  } catch (error) {
    console.error('Customer service health check failed:', error);
    return false;
  }
}
```

### Standardized Response Format

All health checks now return data in the standardized API format:

```json
{
  "data": {
    "status": "ok",
    "timestamp": "2025-10-20T10:28:30.456Z",
    "service": "service-name",
    "version": "1.0.0"
  },
  "message": "Success",
  "statusCode": 200,
  "timestamp": "2025-10-20T10:28:30.456Z",
  "success": true
}
```

---

## 🔧 Docker Health Check Configuration

### docker-compose.hybrid.yml

Each service has a Docker health check configured:

```yaml
services:
  auth-service:
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3001/api/v1/auth/health"]
      timeout: 10s
      retries: 3
      interval: 30s
      start_period: 40s

  user-service:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3003/api/v1/health"]
      timeout: 10s
      retries: 3
      interval: 30s
      start_period: 40s

  customer-service:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3004/api/v1/health"]
      timeout: 10s
      retries: 3
      interval: 30s
      start_period: 40s

  carrier-service:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3005/api/v1/health"]
      timeout: 10s
      retries: 3
      interval: 30s
      start_period: 40s

  translation-service:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3007/api/v1/health"]
      timeout: 10s
      retries: 3
      interval: 30s
      start_period: 40s
```

**Health Check Parameters**:
- **test**: Command to execute for health check
- **timeout**: Maximum time for check to complete (10s)
- **retries**: Number of consecutive failures before unhealthy (3)
- **interval**: Time between checks (30s)
- **start_period**: Grace period during startup (40s)

---

## 🚀 Monitoring & Troubleshooting

### Check Service Logs
```bash
# View logs for a specific service
docker logs auth-service --tail 50 -f
docker logs user-service --tail 50 -f
docker logs customer-service --tail 50 -f
docker logs carrier-service --tail 50 -f
docker logs translation-service --tail 50 -f
```

### Check Health Status in Docker
```bash
# See health status column
docker ps

# Detailed health check info
docker inspect auth-service --format='{{json .State.Health}}' | jq .
```

### Common Issues

#### Issue: Service shows "unhealthy" in Docker but responds to curl
**Cause**: Health check endpoint mismatch

**Solution**: Verify health check URL in docker-compose.hybrid.yml matches actual endpoint

**Example**: Auth Service uses `/api/v1/auth/health` not `/api/v1/health`

#### Issue: Health check fails with 404
**Cause**: Incorrect endpoint path

**Solution**: Check service controller for correct path

#### Issue: Health check times out
**Cause**: Service starting slowly or database connection issues

**Solution**: 
1. Increase `start_period` in docker-compose
2. Check database connectivity
3. Review service logs

---

## 📊 Health Monitoring Best Practices

### 1. Regular Health Checks
- ✅ Auto-check on application load
- ✅ Periodic background checks
- ✅ Alert on failures

### 2. Response Time Monitoring
- ✅ Track response times
- ✅ Set thresholds for alerts
- ✅ Identify performance issues early

### 3. Dependency Checks
- ✅ Check database connectivity
- ✅ Check Redis connectivity
- ✅ Check external service dependencies

### 4. Detailed Health Endpoints
```typescript
// Basic health check
GET /api/v1/health
// Returns: { status: 'ok' }

// Detailed health check (User Service example)
GET /api/v1/health/detailed
// Returns: metrics, database status, counts

// Readiness probe
GET /api/v1/health/ready
// Returns: service ready state

// Liveness probe
GET /api/v1/health/live
// Returns: service alive state
```

---

## 🎯 Next Steps

### For Pricing Service
1. Complete infrastructure setup (database, migrations)
2. Deploy Docker container
3. Configure health check endpoint
4. Update docker-compose.hybrid.yml
5. Test health endpoint

### For Enhanced Monitoring
1. Add Prometheus metrics
2. Set up Grafana dashboards
3. Configure alerting (email/Slack)
4. Add APM (Application Performance Monitoring)
5. Implement distributed tracing

### For React-Admin Dashboard
1. ✅ MicroservicesStatus component exists
2. Add to dashboard page or navigation
3. Add auto-refresh interval (optional)
4. Add detailed metrics view
5. Add service restart capability (admin only)

---

## 📚 Related Documentation

- [API Standards Implementation](./API-STANDARDS-IMPLEMENTATION-POC-COMPLETE.md)
- [React-Admin Data Loading Analysis](./REACT-ADMIN-DATA-LOADING-ANALYSIS.md)
- [Docker Infrastructure](./CUSTOMER-SERVICE-DOCKER-INFRASTRUCTURE-EXECUTIVE-SUMMARY.md)
- [Translation Service](./TRANSLATION-SERVICE-INFRASTRUCTURE-QUICK-REFERENCE.md)

---

**Last Updated**: October 20, 2025  
**Services Running**: 5/6 (83%)  
**API Standards**: 100% (5/5 running services)  
**Docker Health Checks**: ✅ Configured and working
