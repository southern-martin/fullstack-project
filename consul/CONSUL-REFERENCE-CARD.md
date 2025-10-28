# Consul Config Server - Quick Reference Card

## 🚀 Essential Commands

### Start/Stop Consul
```bash
# Start Consul
docker-compose -f docker-compose.hybrid.yml up -d consul

# Stop Consul
docker-compose -f docker-compose.hybrid.yml stop consul

# Restart Consul
docker-compose -f docker-compose.hybrid.yml restart consul

# View logs
docker logs -f consul-server
```

### Access Consul
```bash
# Open Web UI
open http://localhost:8500

# Check health
docker exec consul-server consul members

# Check leader
docker exec consul-server consul operator raft list-peers
```

### Configuration Management
```bash
# View all configs
docker exec consul-server consul kv get -recurse config/

# Get specific value
docker exec consul-server consul kv get config/translation-service/max_batch_translation_size

# Set a value
docker exec consul-server consul kv put config/translation-service/max_batch_translation_size 300

# Delete a value
docker exec consul-server consul kv delete config/translation-service/max_batch_translation_size

# Reseed all configs
./consul/seed-consul-config.sh
```

### HTTP API
```bash
# Get value (raw)
curl http://localhost:8500/v1/kv/config/translation-service/max_batch_translation_size?raw

# Get value (JSON)
curl http://localhost:8500/v1/kv/config/translation-service/max_batch_translation_size

# Set value
curl -X PUT -d "300" http://localhost:8500/v1/kv/config/translation-service/max_batch_translation_size

# List all keys
curl http://localhost:8500/v1/kv/config/?keys

# Get all configs (recurse)
curl http://localhost:8500/v1/kv/config/?recurse | jq
```

## 📁 Key Paths

### Shared Infrastructure
```
config/shared/redis/host
config/shared/redis/port
config/shared/redis/password
config/shared/database/shared_user_db/host
config/shared/database/shared_user_db/port
config/shared/database/shared_user_db/username
config/shared/database/shared_user_db/password
config/shared/database/shared_user_db/database
```

### Translation Service (Example)
```
config/translation-service/port
config/translation-service/service_name
config/translation-service/max_batch_translation_size  ← 200
config/translation-service/redis_key_prefix
config/translation-service/database/host
config/translation-service/database/port
config/translation-service/database/username
config/translation-service/database/password
config/translation-service/database/database
```

### Auth Service (Example)
```
config/auth-service/port
config/auth-service/jwt_secret
config/auth-service/jwt_expiration
config/auth-service/kong_admin_url
config/auth-service/kong_sync_enabled
```

## 🔧 Troubleshooting

### Consul Won't Start
```bash
# Check if port 8500 is in use
lsof -i :8500

# Check Docker logs
docker logs consul-server

# Remove old container and restart
docker-compose -f docker-compose.hybrid.yml down consul
docker-compose -f docker-compose.hybrid.yml up -d consul
```

### UI Not Accessible
```bash
# Verify Consul is running
docker ps | grep consul

# Check health
docker exec consul-server consul members

# Check network
docker network inspect fullstack-project-hybrid-network
```

### Configuration Not Persisting
```bash
# Check volume
docker volume inspect fullstack-project-hybrid_consul_data

# Backup data
docker exec consul-server consul snapshot save /tmp/backup.snap
docker cp consul-server:/tmp/backup.snap ./consul-backup.snap

# Restore data
docker cp ./consul-backup.snap consul-server:/tmp/backup.snap
docker exec consul-server consul snapshot restore /tmp/backup.snap
```

## 📊 Status Check

### Health Status
```bash
# Quick health check
docker exec consul-server consul members

# Expected output:
# Node          Address          Status  Type    Build   Protocol  DC   Partition  Segment
# <hostname>    172.x.x.x:8301   alive   server  1.17.x  2         dc1  default    <all>
```

### Count Configurations
```bash
# Count all keys
curl -s http://localhost:8500/v1/kv/config/?keys | jq '. | length'

# Expected: 54
```

### Check Specific Service
```bash
# Translation service configs
docker exec consul-server consul kv get -recurse config/translation-service/

# Auth service configs
docker exec consul-server consul kv get -recurse config/auth-service/
```

## 🎯 Common Tasks

### Update Translation Batch Limit
```bash
# Via CLI
docker exec consul-server consul kv put config/translation-service/max_batch_translation_size 300

# Via HTTP
curl -X PUT -d "300" http://localhost:8500/v1/kv/config/translation-service/max_batch_translation_size

# Verify
curl http://localhost:8500/v1/kv/config/translation-service/max_batch_translation_size?raw
```

### Backup All Configuration
```bash
# Create snapshot
docker exec consul-server consul snapshot save /tmp/consul-backup-$(date +%Y%m%d).snap

# Copy to host
docker cp consul-server:/tmp/consul-backup-$(date +%Y%m%d).snap ./
```

### Reset Configuration
```bash
# Delete all configs
docker exec consul-server consul kv delete -recurse config/

# Reseed
./consul/seed-consul-config.sh
```

## 📚 Documentation Links

| Document | Purpose |
|----------|---------|
| `consul/CONSUL-SETUP.md` | Comprehensive setup guide |
| `consul/CONSUL-QUICK-START.md` | Quick start and Week 2 guide |
| `CONSUL-IMPLEMENTATION-SUMMARY.md` | Week 1 completion summary |
| `consul/seed-consul-config.sh` | Configuration seeding script |

## 🌐 URLs

| Service | URL |
|---------|-----|
| Consul UI | http://localhost:8500 |
| Consul HTTP API | http://localhost:8500/v1/ |
| Consul DNS | localhost:8600 |

## 📋 Implementation Status

| Week | Status | Description |
|------|--------|-------------|
| Week 1 | ✅ Complete | Consul setup and config seeding |
| Week 2 | ⏳ Pending | Service integration (Translation pilot) |
| Week 3 | ⏳ Pending | Dynamic config reload |
| Week 4 | ⏳ Pending | Documentation and training |

## 🔐 Environment Variables (Week 2)

Services will need these environment variables:

```bash
CONSUL_ENABLED=true
CONSUL_HOST=consul
CONSUL_PORT=8500
```

## 💾 Data Persistence

- **Volume**: `fullstack-project-hybrid_consul_data`
- **Path**: `/consul/data` (inside container)
- **Type**: Docker volume (persists across restarts)

## 🚨 Emergency Commands

### Stop Everything
```bash
docker-compose -f docker-compose.hybrid.yml down
```

### Nuclear Reset (⚠️ Destroys data)
```bash
docker-compose -f docker-compose.hybrid.yml down -v
docker volume rm fullstack-project-hybrid_consul_data
docker-compose -f docker-compose.hybrid.yml up -d consul
./consul/seed-consul-config.sh
```

## 📞 Support

1. Check documentation: `consul/CONSUL-SETUP.md`
2. View logs: `docker logs consul-server`
3. Check health: `docker exec consul-server consul members`
4. Access UI: http://localhost:8500

---

**Last Updated**: 2025-01-27  
**Branch**: `feature/consul-config-server`  
**Version**: 1.0.0
