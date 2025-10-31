# Grafana Dashboards - Import Guide

## 📊 Available Dashboards

This directory contains pre-configured Grafana dashboards for monitoring your microservices infrastructure.

### Dashboard Overview

| Dashboard | File | Description |
|-----------|------|-------------|
| **Service Health Overview** | `service-health-overview.json` | Monitor all microservices health, log rates, and error counts |
| **Kong Gateway Monitoring** | `kong-gateway-monitoring.json` | Track Kong API Gateway requests, errors, and status |
| **Seller Service Analytics** | `seller-service-analytics.json` | Monitor seller service operations, registrations, and analytics |
| **Correlation ID Tracing** | `correlation-id-tracing.json` | Trace requests across services using correlation IDs |

## 🚀 How to Import Dashboards

### Method 1: Via Grafana UI (Recommended)

1. **Access Grafana**
   ```
   URL: http://localhost:3100
   Username: admin
   Password: admin123
   ```

2. **Import Dashboard**
   - Click the **"+"** icon in the left sidebar
   - Select **"Import"**
   - Click **"Upload JSON file"**
   - Select one of the dashboard JSON files from this directory
   - Click **"Import"**

3. **Configure Data Sources** (if prompted)
   - **Loki**: Select "Loki" (UID: `bf1tgok7srym8f`)
   - **Prometheus**: Select "Prometheus" (UID: `df1tey8fx9o8wb`)

4. **Repeat** for each dashboard you want to import

### Method 2: Via Grafana API

```bash
# Import Service Health Overview Dashboard
curl -X POST \
  -H "Content-Type: application/json" \
  -u admin:admin123 \
  http://localhost:3100/api/dashboards/db \
  -d @service-health-overview.json

# Import Kong Gateway Dashboard
curl -X POST \
  -H "Content-Type: application/json" \
  -u admin:admin123 \
  http://localhost:3100/api/dashboards/db \
  -d @kong-gateway-monitoring.json

# Import Seller Service Dashboard
curl -X POST \
  -H "Content-Type: application/json" \
  -u admin:admin123 \
  http://localhost:3100/api/dashboards/db \
  -d @seller-service-analytics.json

# Import Correlation ID Tracing Dashboard
curl -X POST \
  -H "Content-Type: application/json" \
  -u admin:admin123 \
  http://localhost:3100/api/dashboards/db \
  -d @correlation-id-tracing.json
```

### Method 3: Auto-Provisioning (Future Enhancement)

To enable automatic dashboard loading on Grafana startup:

1. Update `grafana/provisioning/dashboards/dashboards.yml`:
   ```yaml
   apiVersion: 1
   
   providers:
     - name: 'default'
       orgId: 1
       folder: ''
       type: file
       disableDeletion: false
       updateIntervalSeconds: 10
       allowUiUpdates: true
       options:
         path: /etc/grafana/provisioning/dashboards/files
   ```

2. Update `docker-compose.monitoring.yml` to mount the dashboards directory:
   ```yaml
   grafana:
     volumes:
       - ./grafana/provisioning:/etc/grafana/provisioning:ro
       - ./grafana/dashboards:/etc/grafana/provisioning/dashboards/files:ro
   ```

3. Restart Grafana:
   ```bash
   docker-compose -f docker-compose.monitoring.yml restart grafana
   ```

## 📋 Dashboard Details

### 1. Service Health Overview

**Purpose**: Overall health monitoring of all microservices

**Panels**:
- Log Rate by Service (time series)
- Log Levels Distribution (stacked time series)
- Recent Logs - All Services (log panel)
- Error Logs - All Services (log panel)
- Error Count (gauge)

**Use Cases**:
- Quick health check of entire system
- Identify which services are most active
- Spot error trends across services

**Refresh**: Auto-refresh every 10 seconds

### 2. Kong Gateway Monitoring

**Purpose**: Monitor Kong API Gateway performance and health

**Panels**:
- Kong Request Rate (time series)
- Kong Gateway Logs (log panel)
- Kong Errors (gauge)
- Kong Gateway Status (gauge from Prometheus)

**Use Cases**:
- Monitor API traffic patterns
- Detect gateway failures
- Track error rates at the gateway level

**Refresh**: Auto-refresh every 10 seconds

### 3. Seller Service Analytics Dashboard

**Purpose**: Monitor Seller Service operations and business events

**Panels**:
- Seller Service Logs (log panel)
- Seller Service Log Levels (stacked time series)
- Seller Service Errors (gauge)
- Seller Registration & Verification Logs (filtered logs)
- Seller Analytics Logs (filtered logs)
- Seller Service Error Logs (error-level logs)

**Use Cases**:
- Track seller registration flows
- Monitor verification processes
- Debug analytics endpoint issues
- Identify business logic errors

**Refresh**: Auto-refresh every 10 seconds

### 4. Correlation ID Tracing

**Purpose**: Trace individual requests across multiple services

**Features**:
- **Variable Input**: Enter any Correlation ID to trace
- Trace Logs by Correlation ID (chronological log view)
- Services Involved in Trace (pie chart)
- Log Levels in Trace (pie chart)

**Use Cases**:
- Debug cross-service request flows
- Identify where requests fail in the chain
- Analyze request patterns
- Troubleshoot distributed transactions

**How to Use**:
1. Find a Correlation ID from logs (usually in request headers or log entries)
2. Enter it in the "Correlation ID" variable at the top
3. View all logs related to that request across all services
4. See which services handled the request and at what log levels

**Time Range**: Default 24 hours (adjustable)

## 🔍 Query Examples

### Loki Queries Used

```logql
# All logs from a service
{service="seller-service"} |= ""

# Error logs from all services
{container=~".+"} | json | level="error"

# Logs by correlation ID
{container=~".+"} | json | correlationId=~"your-correlation-id-here"

# Filter by message content
{service="seller-service"} |= "register" or |= "verify"

# Count errors in time window
sum(count_over_time({container=~".+"} | json | level="error" [5m]))

# Log rate by service
sum by (service) (rate({container=~".+"} |= "" [5m]))
```

### PromQL Queries Used

```promql
# Service up/down status
up{job="kong"}

# (Add more Prometheus queries as metrics become available)
```

## 🎨 Customization Tips

### Adding New Panels

1. Edit dashboard in Grafana UI
2. Click "Add panel"
3. Select visualization type
4. Write Loki/Prometheus query
5. Configure panel settings
6. Save dashboard
7. Export JSON via "Share" → "Export" → "Save to file"

### Modifying Queries

- All queries use `bf1tgok7srym8f` (Loki UID) or `df1tey8fx9o8wb` (Prometheus UID)
- Update service names to match your deployment
- Adjust time ranges in queries for different aggregation windows

### Creating Alerts

1. Open panel edit mode
2. Go to "Alert" tab
3. Create alert rule
4. Configure notification channels (email, Slack, etc.)

## 📊 Dashboard Screenshots (Future)

*Add screenshots of each dashboard here after import*

## 🚦 Next Steps

1. **Import all dashboards** using Method 1 or 2
2. **Deploy Seller Service** to Docker to see it in monitoring
3. **Generate some traffic** to populate dashboards with data
4. **Create alerts** for critical errors and service outages
5. **Customize dashboards** based on your specific needs

## 🆘 Troubleshooting

### Dashboard shows "No data"

**Cause**: Service not deployed or not generating logs

**Solution**:
- Verify service is running: `docker ps | grep service-name`
- Check Promtail is collecting logs: `docker logs promtail`
- Verify logs in Loki: `curl "http://localhost:3200/loki/api/v1/label/service/values"`

### Data source error

**Cause**: Loki or Prometheus not configured

**Solution**:
- Verify data sources in Grafana: Settings → Data sources
- Should see "Loki" (id: 2) and "Prometheus" (id: 1)
- Check provisioning: `docker exec grafana ls /etc/grafana/provisioning/datasources`

### Correlation ID tracing shows nothing

**Cause**: No correlation ID in variable or logs don't contain it

**Solution**:
- Find a valid correlation ID from recent logs
- Ensure Winston logging includes correlationId field
- Check log format: logs should be JSON with correlationId field

## 📚 Additional Resources

- [Grafana Documentation](https://grafana.com/docs/)
- [Loki LogQL Reference](https://grafana.com/docs/loki/latest/logql/)
- [Prometheus PromQL Reference](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [CENTRALIZED-LOGGING-STATUS.md](../CENTRALIZED-LOGGING-STATUS.md) - Infrastructure setup guide

## 🔗 Related Documentation

- [../CENTRALIZED-LOGGING-STATUS.md](../CENTRALIZED-LOGGING-STATUS.md) - Monitoring infrastructure status
- [../../seller-service/DEVELOPMENT-COMPLETE.md](../../seller-service/DEVELOPMENT-COMPLETE.md) - Seller service documentation
- [../../seller-service/KONG-INTEGRATION-GUIDE.md](../../seller-service/KONG-INTEGRATION-GUIDE.md) - Kong routes configuration

---

**Created**: October 30, 2025  
**Last Updated**: October 30, 2025  
**Version**: 1.0.0
