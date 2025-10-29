# Consul Service Discovery - Quick Reference

## 🚀 Quick Start Commands

### Register All Services
```bash
cd consul
./register-services.sh
```

### Check Service Health
```bash
cd consul
./check-service-health.sh
```

### Test Service Discovery
```bash
cd consul
./test-service-discovery.sh
```

---

## 📋 Health Check Endpoints

| Service | URL | Status |
|---------|-----|--------|
| User Service | http://localhost:3003/api/v1/health | ✅ Healthy |
| Customer Service | http://localhost:3004/api/v1/health | ✅ Healthy |
| Carrier Service | http://localhost:3005/api/v1/health | ✅ Healthy |
| Pricing Service | http://localhost:3006/api/v1/health | ✅ Healthy |

### Test from Command Line
```bash
# User Service
curl http://localhost:3003/api/v1/health | jq

# Customer Service
curl http://localhost:3004/api/v1/health | jq

# Carrier Service
curl http://localhost:3005/api/v1/health | jq

# Pricing Service
curl http://localhost:3006/api/v1/health | jq
```

---

## 🔍 Service Discovery Examples

### Discover Service via Consul API
```bash
# Get service information
curl http://localhost:8500/v1/catalog/service/user-service | jq

# Get only healthy instances
curl http://localhost:8500/v1/health/service/user-service?passing=true | jq

# Get all services
curl http://localhost:8500/v1/catalog/services | jq
```

### TypeScript/JavaScript Example
```typescript
interface ServiceInstance {
  Service: {
    ID: string;
    Service: string;
    Address: string;
    Port: number;
  };
}

async function discoverService(serviceName: string): Promise<string> {
  const response = await fetch(
    `http://consul-server:8500/v1/health/service/${serviceName}?passing=true`
  );
  
  const instances: ServiceInstance[] = await response.json();
  
  if (instances.length === 0) {
    throw new Error(`No healthy instances of ${serviceName} found`);
  }
  
  // Simple round-robin: pick first instance
  const instance = instances[0];
  const address = instance.Service.Address || instance.Service.Service;
  const port = instance.Service.Port;
  
  return `http://${address}:${port}`;
}

// Usage
const userServiceUrl = await discoverService('user-service');
const response = await fetch(`${userServiceUrl}/api/v1/users`);
```

### Python Example
```python
import requests

def discover_service(service_name):
    """Discover a service via Consul"""
    consul_url = "http://consul-server:8500"
    response = requests.get(
        f"{consul_url}/v1/health/service/{service_name}",
        params={"passing": "true"}
    )
    
    instances = response.json()
    
    if not instances:
        raise ValueError(f"No healthy instances of {service_name} found")
    
    # Pick first healthy instance
    service = instances[0]["Service"]
    address = service.get("Address") or service["Service"]
    port = service["Port"]
    
    return f"http://{address}:{port}"

# Usage
user_service_url = discover_service("user-service")
response = requests.get(f"{user_service_url}/api/v1/users")
```

---

## 🌐 Consul UI

**Access:** http://localhost:8500/ui/dc1/services

### Available Sections
- **Services** - List of all registered services
- **Nodes** - Consul server and agents
- **Key/Value** - Configuration storage
- **Intentions** - Service-to-service access control

### Useful Filters
- Filter by health status: `passing`, `warning`, `critical`
- Filter by tags: Click on service tags
- Search by service name

---

## 🧪 Testing & Troubleshooting

### Verify Service Registration
```bash
# List all registered services
curl http://localhost:8500/v1/agent/services | jq

# Check specific service
curl http://localhost:8500/v1/agent/service/user-service | jq
```

### Check Health Status
```bash
# All health checks
curl http://localhost:8500/v1/health/state/any | jq

# Only passing checks
curl http://localhost:8500/v1/health/state/passing | jq

# Only critical checks
curl http://localhost:8500/v1/health/state/critical | jq
```

### Deregister a Service
```bash
# If you need to manually deregister
curl -X PUT http://localhost:8500/v1/agent/service/deregister/user-service
```

### Re-register Services
```bash
# After deregistration or configuration changes
cd consul
./register-services.sh
```

---

## 📊 Health Check Configuration

Each service has the following health check settings:

| Parameter | Value | Description |
|-----------|-------|-------------|
| Interval | 10s | How often to check |
| Timeout | 5s | Max time for check |
| Success Before Passing | 2 | Consecutive successes needed |
| Failures Before Critical | 3 | Consecutive failures needed |
| Deregister After | 30s | Time before auto-deregistration |

### Modify Health Check Settings

Edit the service JSON files in `consul/services/` and re-register:

```json
{
  "Check": {
    "HTTP": "http://service-name:port/health",
    "Interval": "10s",     // ← Change this
    "Timeout": "5s",       // ← Or this
    "SuccessBeforePassing": 2,
    "FailuresBeforeCritical": 3
  }
}
```

---

## 🔐 Service Tags

Services are registered with the following tags:

### Common Tags
- `microservice` - Service architecture type
- `nestjs` - Framework identifier
- `v1` - API version

### Service-Specific Tags
- **User Service:** `authentication`, `user-management`
- **Customer Service:** `customer-management`, `business-logic`
- **Carrier Service:** `carrier-management`, `business-logic`
- **Pricing Service:** `pricing-management`, `business-logic`

### Query by Tags
```bash
# Find all microservices
curl http://localhost:8500/v1/catalog/service/user-service?tag=microservice

# Find all v1 services
curl http://localhost:8500/v1/catalog/services?filter='Tags contains "v1"'
```

---

## 🐳 Docker Integration

### Services are on the Network
```bash
# Verify network connectivity
docker network inspect fullstack-project_app-network | grep -A 3 "user-service"
```

### Access from Container
```bash
# From any container on the same network
docker exec customer-service curl http://user-service:3003/api/v1/health

# Using Consul DNS
docker exec customer-service curl http://user-service.service.consul:3003/api/v1/health
```

---

## 📝 Environment Variables

### Required for Services
```env
# Consul Configuration
CONSUL_HOST=consul-server
CONSUL_PORT=8500

# Redis Configuration (for health checks)
REDIS_HOST=shared-redis
REDIS_PORT=6379

# Database Configuration (for health checks)
# Each service has its own database config
```

---

## 🎯 Common Use Cases

### 1. Load Balancing
```typescript
// Get all healthy instances and round-robin
async function getServiceWithLoadBalancing(serviceName: string) {
  const response = await fetch(
    `http://consul-server:8500/v1/health/service/${serviceName}?passing=true`
  );
  const instances = await response.json();
  
  // Simple round-robin
  const index = Math.floor(Math.random() * instances.length);
  return instances[index];
}
```

### 2. Service Health Monitoring
```typescript
// Check if service is healthy before making request
async function isServiceHealthy(serviceName: string): Promise<boolean> {
  const response = await fetch(
    `http://consul-server:8500/v1/health/service/${serviceName}?passing=true`
  );
  const instances = await response.json();
  return instances.length > 0;
}
```

### 3. Circuit Breaker Integration
```typescript
// Use with circuit breaker pattern
if (await isServiceHealthy('user-service')) {
  // Make request
} else {
  // Use fallback or cached data
}
```

---

## 🚨 Monitoring & Alerts

### Watch Service Health
```bash
# Continuously monitor service health
watch -n 2 'curl -s http://localhost:8500/v1/health/state/critical | jq length'
```

### Prometheus Integration
```yaml
# Add to prometheus.yml
scrape_configs:
  - job_name: 'consul-services'
    consul_sd_configs:
      - server: 'consul-server:8500'
        services: []
    relabel_configs:
      - source_labels: ['__meta_consul_service']
        target_label: 'service'
```

---

## 📚 Additional Resources

- **Consul UI:** http://localhost:8500/ui
- **Consul API Docs:** https://developer.hashicorp.com/consul/api-docs
- **Health Check Guide:** https://developer.hashicorp.com/consul/docs/services/usage/checks
- **Service Discovery:** https://developer.hashicorp.com/consul/docs/discovery

---

**Last Updated:** October 29, 2025  
**Status:** All services healthy and registered ✅
