# Winston Logging - Developer Quick Reference

## 📚 Overview

All 6 microservices now use Winston for structured JSON logging with correlation ID tracking for distributed tracing.

---

## 🎯 Services with Winston Logging

| Service | Port | Endpoint | Status |
|---------|------|----------|--------|
| auth-service | 3001 | /api/v1/auth/health | ✅ Active |
| user-service | 3003 | /api/v1/health | ✅ Active |
| customer-service | 3004 | /api/v1/health | ✅ Active |
| carrier-service | 3005 | /api/v1/health | ✅ Active |
| pricing-service | 3006 | /api/v1/health | ✅ Active |
| translation-service | 3007 | /api/v1/health | ✅ Active |

---

## 🔍 Using Correlation IDs

### In API Requests
Add the `X-Correlation-ID` header to track requests across services:

```bash
# Custom correlation ID
curl -H "X-Correlation-ID: my-test-001" \
  http://localhost:3003/api/v1/health

# Auto-generated correlation ID
curl http://localhost:3003/api/v1/health
# Service will generate UUID automatically
```

### In Application Code
Correlation IDs are automatically captured by the `LoggingInterceptor`:

```typescript
// In your controller/service - correlation ID is in logger context
this.logger.log('Processing user registration', 'UserService');
// Output: {"level":"info","message":"Processing user registration","metadata":{"correlationId":"abc-123",...},...}
```

---

## 📊 Viewing Logs

### Docker Logs
```bash
# View recent logs for a service
docker logs user-service --tail 50

# Follow logs in real-time
docker logs -f user-service

# Filter for JSON logs only
docker logs user-service | grep '"level":"info"'

# Find logs with specific correlation ID
docker logs user-service | grep '"correlationId":"my-test-001"'
```

### Grafana Explore (Recommended)
1. Open Grafana: http://localhost:3100
2. Login: `admin` / `admin`
3. Go to **Explore** (compass icon)
4. Select **Loki** as data source
5. Use LogQL queries:

```logql
# All logs from a service
{service="user-service"}

# All logs with specific correlation ID
{service=~".*"} | json | metadata_correlationId="my-test-001"

# Error logs across all services
{service=~".*"} | json | level="error"

# HTTP requests taking > 100ms
{service=~".*"} | json | metadata_responseTime > 100

# Logs from multiple services
{service=~"auth-service|user-service|customer-service"}
```

### Loki API (Direct Query)
```bash
# Query logs for specific correlation ID
CORRELATION_ID="my-test-001"
START=$(date -u -v-1H +%s)000000000
END=$(date -u +%s)000000000

curl -G "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode "query={metadata_correlationId=\"$CORRELATION_ID\"}" \
  --data-urlencode "start=$START" \
  --data-urlencode "end=$END" | jq
```

---

## 🔧 Log Format

### Standard Log Entry
```json
{
  "level": "info",
  "message": "HTTP Request",
  "metadata": {
    "context": "LoggingInterceptor",
    "environment": "development",
    "correlationId": "f7b3c8a1-4d2e-4f8c-9a1b-3e5d7c9f2a4b",
    "method": "GET",
    "url": "/api/v1/health",
    "statusCode": 200,
    "responseTime": 4,
    "type": "http_request",
    "ip": "::ffff:192.168.65.1",
    "userAgent": "curl/8.7.1"
  },
  "service": "user-service",
  "timestamp": "2025-10-23 04:08:51.753"
}
```

### Error Log Entry
```json
{
  "level": "error",
  "message": "Database connection failed",
  "metadata": {
    "context": "DatabaseService",
    "environment": "development",
    "correlationId": "abc-123",
    "error": {
      "name": "QueryFailedError",
      "message": "Connection terminated",
      "stack": "Error: Connection terminated\n    at /app/src/..."
    }
  },
  "service": "user-service",
  "timestamp": "2025-10-23 04:08:51.753"
}
```

---

## 🎯 Common Use Cases

### 1. Debug a Single Request Across All Services
```bash
# Generate correlation ID
CORRELATION_ID="debug-$(date +%s)"

# Make requests to all services
curl -H "X-Correlation-ID: $CORRELATION_ID" http://localhost:3001/api/v1/auth/health
curl -H "X-Correlation-ID: $CORRELATION_ID" http://localhost:3003/api/v1/health
curl -H "X-Correlation-ID: $CORRELATION_ID" http://localhost:3004/api/v1/health

# View in Grafana
# Query: {metadata_correlationId="$CORRELATION_ID"}
```

### 2. Find Slow Endpoints
In Grafana Explore:
```logql
{service=~".*"} | json | metadata_responseTime > 500
```

### 3. Monitor Error Rate
In Grafana Explore:
```logql
rate({service=~".*"} | json | level="error" [5m])
```

### 4. Track User Activity
```logql
{service=~".*"} | json | metadata_userId="12345"
```

### 5. Analyze API Usage
```logql
{service=~".*"} | json | metadata_method="POST"
```

---

## 🚀 Best Practices

### DO ✅
- **Always use correlation IDs** for multi-service requests
- **Include context** in log messages (what, why, where)
- **Log at appropriate levels**: debug, info, warn, error
- **Use structured metadata** for searchable fields
- **Query Loki in Grafana** for better visualization

### DON'T ❌
- **Don't log sensitive data** (passwords, tokens, PII)
- **Don't log in loops** without throttling
- **Don't use console.log** (use Winston logger)
- **Don't ignore correlation IDs** in responses
- **Don't query Docker logs** for complex searches (use Loki)

---

## 📈 Performance Metrics

### Current Baseline
- **Average Response Time:** 2-6ms (health checks)
- **Log Volume:** 2 entries per request (incoming + response)
- **Log Size:** ~500 bytes per entry (JSON format)
- **Loki Ingestion:** Real-time (< 1 second delay)

### Monitoring
- **Grafana Dashboards:** http://localhost:3100/dashboards
- **Loki Status:** http://localhost:3200/ready
- **Promtail Metrics:** http://localhost:9080/metrics

---

## 🆘 Troubleshooting

### Issue: Logs not appearing in Grafana
**Check:**
1. Service is running: `docker ps | grep <service-name>`
2. Promtail is running: `docker ps | grep promtail`
3. Loki is running: `docker ps | grep loki`
4. Check Promtail logs: `docker logs promtail --tail 50`

### Issue: Correlation ID not in logs
**Check:**
1. Header is set: `X-Correlation-ID: your-id`
2. LoggingInterceptor is registered in main.ts
3. Service is using Winston (not console.log)

### Issue: High log volume
**Solutions:**
1. Reduce log level in production (info → warn)
2. Configure log sampling in Winston
3. Adjust Loki retention policies
4. Use log filtering in Promtail

---

## 📚 Related Documentation

- **Phase 12 Summary:** `/LOGGING-INFRASTRUCTURE-SUCCESS.md`
- **Phase 13 Summary:** `/PHASE-13-COMPLETION-SUMMARY.md`
- **Rollout Plan:** `/LOGGING-ROLLOUT-PLAN.md`
- **Quick Commands:** `/LOGGING-QUICK-REFERENCE.md`
- **API Gateway Logging:** `/api-gateway/STRUCTURED-LOGGING-GUIDE.md`

---

## 🔗 Useful Links

- **Grafana:** http://localhost:3100
- **Loki API:** http://localhost:3200
- **Promtail Metrics:** http://localhost:9080/metrics
- **Health Checks:**
  - Auth: http://localhost:3001/api/v1/auth/health
  - User: http://localhost:3003/api/v1/health
  - Customer: http://localhost:3004/api/v1/health
  - Carrier: http://localhost:3005/api/v1/health
  - Pricing: http://localhost:3006/api/v1/health
  - Translation: http://localhost:3007/api/v1/health

---

**Last Updated:** October 23, 2025  
**Status:** All 6 services operational with Winston logging ✅
