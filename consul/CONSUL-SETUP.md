# HashiCorp Consul - Centralized Configuration Management

## Overview

This directory contains configuration and setup for HashiCorp Consul, which provides centralized configuration management and service discovery for the microservices architecture.

## Why Consul?

**Benefits:**
- ✅ **Centralized Configuration**: Single source of truth for all service configs
- ✅ **Dynamic Updates**: Services can reload configs without restart
- ✅ **Service Discovery**: Automatic service registration and health checks
- ✅ **KV Store**: Simple key-value storage for configuration data
- ✅ **HTTP API**: Easy integration with existing services
- ✅ **Web UI**: Visual interface for managing configurations (port 8500)
- ✅ **Multi-datacenter**: Supports scaling across regions

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Consul Server (8500)                     │
│                                                               │
│  ┌─────────────────┐    ┌──────────────────────────────┐   │
│  │   Web UI        │    │   KV Store                    │   │
│  │   (Port 8500)   │    │   config/                     │   │
│  └─────────────────┘    │   ├── shared/                 │   │
│                          │   │   ├── redis/              │   │
│                          │   │   └── database/           │   │
│                          │   ├── auth-service/           │   │
│                          │   ├── user-service/           │   │
│                          │   ├── customer-service/       │   │
│                          │   ├── carrier-service/        │   │
│                          │   ├── pricing-service/        │   │
│                          │   └── translation-service/    │   │
│                          └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ HTTP API Calls
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
        │   Auth    │   │   User    │   │ Customer  │
        │  Service  │   │  Service  │   │  Service  │
        └───────────┘   └───────────┘   └───────────┘
```

## Directory Structure

```
consul/
├── config/
│   └── consul.json          # Consul server configuration
├── data/                    # Consul data directory (auto-generated)
│   ├── checkpoint-signature
│   ├── node-id
│   └── raft/               # Raft consensus data
└── CONSUL-SETUP.md         # This file
```

## Quick Start

### 1. Start Consul Server

```bash
# From project root
docker-compose -f docker-compose.hybrid.yml up -d consul

# Check Consul health
docker-compose -f docker-compose.hybrid.yml ps consul
docker logs consul-server
```

### 2. Access Consul UI

Open browser: http://localhost:8500

You should see the Consul dashboard with:
- Services tab
- Key/Value tab
- Nodes tab

### 3. Verify Consul is Running

```bash
# Check Consul members
docker exec consul-server consul members

# Check Consul leader
docker exec consul-server consul operator raft list-peers

# Check Consul catalog
curl http://localhost:8500/v1/catalog/services
```

## Configuration Management

### Key-Value Store Structure

Consul organizes configuration in a hierarchical KV store:

```
config/
├── shared/                          # Shared across all services
│   ├── redis/
│   │   ├── host                     # "shared-redis"
│   │   ├── port                     # "6379"
│   │   └── password                 # "shared_redis_password_2024"
│   └── database/
│       ├── shared_user_db/
│       │   ├── host                 # "shared-user-db"
│       │   ├── port                 # "3306"
│       │   ├── username             # "shared_user"
│       │   ├── password             # "shared_password_2024"
│       │   └── database             # "shared_user_db"
│
├── auth-service/                    # Auth service specific
│   ├── port                         # "3001"
│   ├── jwt_secret                   # "your-jwt-secret-key"
│   ├── jwt_expiration               # "24h"
│   └── redis_key_prefix             # "auth"
│
├── user-service/                    # User service specific
│   ├── port                         # "3003"
│   └── redis_key_prefix             # "user"
│
├── translation-service/             # Translation service specific
│   ├── port                         # "3007"
│   ├── max_batch_translation_size   # "200"
│   └── redis_key_prefix             # "translation"
```

### Adding Configuration via CLI

```bash
# Set a single key
docker exec consul-server consul kv put config/shared/redis/host "shared-redis"

# Set multiple keys for Redis
docker exec consul-server consul kv put config/shared/redis/host "shared-redis"
docker exec consul-server consul kv put config/shared/redis/port "6379"
docker exec consul-server consul kv put config/shared/redis/password "shared_redis_password_2024"

# Set translation service config
docker exec consul-server consul kv put config/translation-service/max_batch_translation_size "200"
```

### Adding Configuration via HTTP API

```bash
# Set a key via HTTP
curl -X PUT -d "shared-redis" http://localhost:8500/v1/kv/config/shared/redis/host

# Get a key
curl http://localhost:8500/v1/kv/config/shared/redis/host?raw

# Get all keys in a path (returns JSON)
curl http://localhost:8500/v1/kv/config/shared/redis/?recurse
```

### Adding Configuration via Web UI

1. Open http://localhost:8500
2. Click **Key/Value** tab
3. Click **Create** button
4. Enter key path: `config/shared/redis/host`
5. Enter value: `shared-redis`
6. Click **Save**

## Service Integration

### Phase 1: Reading Configuration (Current)

Services will read configuration from Consul on startup:

```typescript
// Example: Translation Service reading max batch size
import Consul from 'consul';

const consul = new Consul({
  host: process.env.CONSUL_HOST || 'consul',
  port: process.env.CONSUL_PORT || '8500'
});

// Read config value
const result = await consul.kv.get('config/translation-service/max_batch_translation_size');
const maxBatchSize = parseInt(result.Value);
```

### Phase 2: Dynamic Configuration Reload (Future)

Services will watch Consul for config changes and reload:

```typescript
// Watch for config changes
const watcher = consul.watch({
  method: consul.kv.get,
  options: { key: 'config/translation-service/max_batch_translation_size' }
});

watcher.on('change', (data) => {
  // Update service config without restart
  this.maxBatchSize = parseInt(data.Value);
  logger.info('Config reloaded', { maxBatchSize: this.maxBatchSize });
});
```

## Migration Strategy

### Current State (Week 1)
- ✅ Consul server running in Docker Compose
- ✅ Consul UI accessible at http://localhost:8500
- ⏳ Configuration still in .env files
- ⏳ Services still using environment variables

### Week 1: Setup & Seed Shared Configs
1. Start Consul server ✅
2. Seed shared Redis configuration
3. Seed shared database configuration
4. Verify configs via UI and API

### Week 2: Service Integration
1. Install `consul` npm package in each service
2. Create `ConsulConfigModule` in each service
3. Update services to read from Consul (with .env fallback)
4. Test services with Consul config

### Week 3: Dynamic Reload
1. Implement config watchers in services
2. Add config versioning
3. Test config changes without service restart
4. Implement rollback capability

### Week 4: Documentation & Training
1. Document Consul operations
2. Create runbooks for common tasks
3. Team training on Consul UI
4. Update deployment documentation

## Common Operations

### View All Configuration

```bash
# List all keys
docker exec consul-server consul kv get -recurse config/

# Export to JSON
curl http://localhost:8500/v1/kv/config/?recurse | jq
```

### Backup Configuration

```bash
# Backup all KV data
docker exec consul-server consul snapshot save /tmp/consul-backup.snap

# Copy backup from container
docker cp consul-server:/tmp/consul-backup.snap ./consul-backup-$(date +%Y%m%d).snap
```

### Restore Configuration

```bash
# Copy backup to container
docker cp ./consul-backup.snap consul-server:/tmp/consul-backup.snap

# Restore snapshot
docker exec consul-server consul snapshot restore /tmp/consul-backup.snap
```

### Delete Configuration

```bash
# Delete a single key
docker exec consul-server consul kv delete config/shared/redis/host

# Delete a path recursively
docker exec consul-server consul kv delete -recurse config/translation-service/
```

## Monitoring & Health Checks

### Check Consul Health

```bash
# Consul members (should show 1 server)
docker exec consul-server consul members

# Leader election status
docker exec consul-server consul operator raft list-peers

# Health check via HTTP
curl http://localhost:8500/v1/health/node/consul-server
```

### Monitor Logs

```bash
# Follow Consul logs
docker logs -f consul-server

# Check for errors
docker logs consul-server | grep ERROR
```

## Troubleshooting

### Issue: Consul UI not accessible

**Solution:**
```bash
# Check if Consul is running
docker-compose -f docker-compose.hybrid.yml ps consul

# Check logs for errors
docker logs consul-server

# Restart Consul
docker-compose -f docker-compose.hybrid.yml restart consul
```

### Issue: Services can't connect to Consul

**Checklist:**
- ✅ Is Consul running? `docker ps | grep consul`
- ✅ Is Consul healthy? `docker exec consul-server consul members`
- ✅ Are services in same Docker network? `docker network inspect fullstack-project-hybrid-network`
- ✅ Is CONSUL_HOST environment variable set correctly in services?

### Issue: Configuration not persisting

**Solution:**
```bash
# Check if volume is mounted
docker inspect consul-server | grep Mounts -A 10

# Verify data directory
docker exec consul-server ls -la /consul/data
```

## Security Considerations

### Current Setup (Development)
- ⚠️ No ACL (Access Control Lists) enabled
- ⚠️ No TLS encryption
- ⚠️ Open to localhost only

### Production Recommendations
- ✅ Enable ACL for access control
- ✅ Enable TLS for encrypted communication
- ✅ Use secrets management for sensitive data
- ✅ Implement backup strategy
- ✅ Use multiple Consul servers (HA cluster)

### Example ACL Setup (Future)

```json
{
  "acl": {
    "enabled": true,
    "default_policy": "deny",
    "tokens": {
      "master": "bootstrap-token-change-in-production"
    }
  }
}
```

## Environment Variables

Services should use these environment variables to connect to Consul:

```bash
# In each service's .env or docker-compose.yml
CONSUL_HOST=consul            # Consul hostname
CONSUL_PORT=8500              # Consul HTTP port
CONSUL_ENABLED=true           # Enable/disable Consul integration
CONSUL_CONFIG_PREFIX=config   # KV store prefix
```

## Next Steps

1. **Seed Initial Configuration**: Populate Consul with shared configs
2. **Update Translation Service**: First service to use Consul (already has externalized config)
3. **Create Consul Config Module**: Reusable NestJS module for Consul integration
4. **Migrate Services**: One by one, migrate services to Consul
5. **Implement Watchers**: Add dynamic config reload capability
6. **Documentation**: Update runbooks and deployment guides

## Resources

- [Consul Documentation](https://www.consul.io/docs)
- [Consul KV Store](https://www.consul.io/docs/dynamic-app-config/kv)
- [Consul HTTP API](https://www.consul.io/api-docs)
- [Consul Node.js Client](https://github.com/silas/node-consul)

## Support

For issues or questions:
1. Check Consul logs: `docker logs consul-server`
2. Verify Consul health: `docker exec consul-server consul members`
3. Check Web UI: http://localhost:8500
4. Review this documentation
5. Contact DevOps team

---

**Created**: 2025-01-27  
**Last Updated**: 2025-01-27  
**Maintained By**: DevOps Team  
**Version**: 1.0.0
