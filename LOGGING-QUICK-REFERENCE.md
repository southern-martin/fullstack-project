# 🔍 Logging Infrastructure - Quick Command Reference

## 📊 Querying Logs with Loki

### Basic Queries

**View all logs from a service**:
```bash
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode 'query={service="auth-service"} | json' \
  --data-urlencode "start=$(date -u -v-1H +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000" \
  --data-urlencode "limit=100" | jq -r '.data.result[0].values[][1]'
```

**Filter by log level**:
```bash
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode 'query={service="auth-service"} | json | level="error"' \
  --data-urlencode "start=$(date -u -v-1H +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000" | jq -r '.data.result[0].values[][1]'
```

**Track specific correlation ID**:
```bash
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode 'query={service="auth-service"} | json | metadata_correlationId="YOUR-ID-HERE"' \
  --data-urlencode "start=$(date -u -v-1H +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000" | jq -r '.data.result[0].values[][1]'
```

**Show HTTP requests with response times**:
```bash
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode 'query={service="auth-service"} | json | metadata_type="http_request"' \
  --data-urlencode "start=$(date -u -v-1H +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000" | jq -r '.data.result[0].values[] | "\(.[0] | tonumber / 1000000000 | strftime("%H:%M:%S")) - \(.[1] | fromjson | "\(.metadata.method) \(.metadata.url) - \(.metadata.statusCode) (\(.metadata.responseTime)ms)")"'
```

**Business events only**:
```bash
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode 'query={service="auth-service"} | json | metadata_type="business_event"' \
  --data-urlencode "start=$(date -u -v-1H +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000" | jq -r '.data.result[0].values[][1]'
```

---

## 🧪 Testing Endpoints with Correlation IDs

### User Registration
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: test-register-$(date +%s)" \
  -d '{
    "email":"user'$(date +%s)'@example.com",
    "password":"TestPass123!",
    "firstName":"Test",
    "lastName":"User"
  }'
```

### User Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: test-login-$(date +%s)" \
  -d '{
    "email":"admin@example.com",
    "password":"Admin123!"
  }'
```

### Health Check
```bash
curl -H "X-Correlation-ID: test-health-$(date +%s)" \
  http://localhost:3001/api/v1/auth/health
```

---

## 🐳 Docker Commands

### View Service Logs
```bash
# Raw logs
docker logs auth-service --tail 50

# Follow logs in real-time
docker logs -f auth-service

# Filter by correlation ID
docker logs auth-service | grep "correlation-id-here"

# Show only errors
docker logs auth-service | grep '"level":"error"'

# JSON formatted output
docker logs auth-service --tail 10 | jq .
```

### Restart Services
```bash
# Restart auth-service
docker-compose -f docker-compose.hybrid.yml restart auth-service

# Rebuild and restart
docker-compose -f docker-compose.hybrid.yml up -d --build auth-service

# View status
docker-compose -f docker-compose.hybrid.yml ps
```

### Check Logging Stack
```bash
# Check Loki
curl http://localhost:3200/ready

# Check Promtail
docker logs promtail --tail 20

# Check Grafana
curl http://localhost:3100/api/health
```

---

## 📈 Performance Queries

### Slow Requests (>1 second)
```bash
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode 'query={service="auth-service"} | json | metadata_type="http_request" | unwrap metadata_responseTime | > 1000' \
  --data-urlencode "start=$(date -u -v-1H +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000"
```

### Request Rate (requests per minute)
```bash
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode 'query=rate({service="auth-service"} | json | metadata_type="http_request" [1m])' \
  --data-urlencode "start=$(date -u -v-1H +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000"
```

### Error Rate
```bash
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode 'query=sum by (service) (count_over_time({service=~".+"} | json | level="error" [5m]))' \
  --data-urlencode "start=$(date -u -v-1H +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000"
```

---

## 🔧 Troubleshooting

### Service Not Starting
```bash
# Check container status
docker ps -a | grep auth-service

# View full logs
docker logs auth-service

# Check for port conflicts
lsof -i :3001

# Inspect container
docker inspect auth-service
```

### Database Connection Issues
```bash
# Test database connectivity
docker exec -it shared-user-db mysql -u shared_user -p

# Check network
docker network inspect fullstack-project-hybrid-network

# View environment variables
docker exec auth-service env | grep DB_
```

### Logging Stack Issues
```bash
# Restart logging stack
cd api-gateway
docker-compose -f docker-compose.logging.yml restart

# Check Promtail targets
curl http://localhost:9080/targets

# Check Loki metrics
curl http://localhost:3200/metrics
```

---

## 📊 Grafana Dashboards

### Access Grafana
```bash
# Open in browser
open http://localhost:3100

# Default credentials
Username: admin
Password: admin
```

### Create Dashboard
1. Click "+" → "Dashboard"
2. Add panel
3. Select "Loki" as data source
4. Enter LogQL query
5. Save dashboard

### Example Queries for Dashboard

**Log Volume (Time Series)**:
```logql
sum by (service) (count_over_time({service=~".+"} [1m]))
```

**Error Rate (Stat)**:
```logql
sum(count_over_time({service=~".+"} | json | level="error" [5m])) / 
sum(count_over_time({service=~".+"} | json [5m])) * 100
```

**Recent Errors (Logs)**:
```logql
{service=~".+"} | json | level="error"
```

**Response Time Heatmap**:
```logql
{service=~".+"} | json | unwrap metadata_responseTime
```

---

## 🔄 Distributed Tracing

### Generate Multi-Service Request
```bash
# Example: Auth service calling User service
CORRELATION_ID="trace-$(date +%s)"

# Step 1: Register user (creates user in User service)
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: $CORRELATION_ID" \
  -d '{"email":"test@example.com","password":"Pass123!","firstName":"Test","lastName":"User"}'

# Step 2: Query logs across all services
curl -G -s "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode "query={service=~\"auth-service|user-service\"} | json | metadata_correlationId=\"$CORRELATION_ID\"" \
  --data-urlencode "start=$(date -u -v-1H +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000" | jq -r '.data.result[].values[] | "\(.[1] | fromjson | "\(.service) - \(.message)")"'
```

---

## 💡 Tips & Best Practices

### Always Use Correlation IDs
```bash
# Generate unique ID
CORRELATION_ID="$(uuidgen)"

# Use in request
curl -H "X-Correlation-ID: $CORRELATION_ID" ...

# Track in logs
docker logs auth-service | grep "$CORRELATION_ID"
```

### Time Range Parameters
```bash
# Last 5 minutes
--data-urlencode "start=$(date -u -v-5M +%s)000000000"

# Last hour
--data-urlencode "start=$(date -u -v-1H +%s)000000000"

# Last day
--data-urlencode "start=$(date -u -v-1d +%s)000000000"

# Specific time range
--data-urlencode "start=1729647000000000000" \
--data-urlencode "end=1729650600000000000"
```

### Pretty Print JSON
```bash
# Use jq for formatting
docker logs auth-service --tail 10 | jq .

# Color output
docker logs auth-service --tail 10 | jq -C . | less -R

# Extract specific fields
docker logs auth-service | jq -r '.message'
```

### Monitor in Real-Time
```bash
# Follow logs with filtering
docker logs -f auth-service | grep --line-buffered '"level":"error"' | jq .

# Watch specific endpoint
watch -n 1 'curl -s http://localhost:3001/api/v1/auth/health | jq .'

# Monitor log volume
watch -n 5 'curl -s "http://localhost:3200/loki/api/v1/query" --data-urlencode "query=count_over_time({service=\"auth-service\"} [1m])"'
```

---

## 📚 Resources

- **Loki API**: http://localhost:3200
- **Grafana**: http://localhost:3100
- **Promtail Targets**: http://localhost:9080/targets
- **Auth Service**: http://localhost:3001
- **Documentation**: `/LOGGING-INFRASTRUCTURE-SUCCESS.md`

## 🆘 Common Issues

### "No data" in Loki queries
- Check service is running: `docker ps | grep auth-service`
- Verify logs in Docker: `docker logs auth-service`
- Check Promtail targets: `curl http://localhost:9080/targets`
- Restart logging stack: `docker-compose -f api-gateway/docker-compose.logging.yml restart`

### Correlation ID not appearing
- Ensure header format: `X-Correlation-ID` (case-sensitive)
- Check LoggingInterceptor is enabled
- Verify Winston JSON format (not printf)
- Check Promtail parsing config

### Service crash-loop
- Check database connection: `docker exec auth-service env | grep DB_`
- View error logs: `docker logs auth-service --tail 50`
- Ensure .env not overriding Docker env: Use `ignoreEnvFile`
- Verify health check: `docker inspect auth-service | jq '.[0].State.Health'`
