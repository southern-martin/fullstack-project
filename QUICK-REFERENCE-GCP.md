# 🚀 Quick Reference - GCP Migration

## 🎯 Current Status

**Completed Phases**: 1, 2, 3 ✅
- Phase 1: Secrets Management (Complete)
- Phase 2: Cloud-Ready Docker Compose (Complete)  
- Phase 3: Terraform Infrastructure (Complete)

**Next Phase**: 4 (Kubernetes Manifests)

---

## One-Time Setup (New Developers)

```bash
# 1. Clone repository
git clone <repo-url>
cd fullstack-project

# 2. Generate local secrets
make init-secrets

# 3. Start all services
make start-local
```

**That's it!** Services will be available at:
- React Admin: http://localhost:3000
- Auth Service: http://localhost:3001
- User Service: http://localhost:3003

Default login: `admin@example.com` / `Admin123!`

---

## Daily Commands

```bash
# Start services
make start-local

# Stop services
make stop-local

# View logs (follow mode)
make logs-local

# Restart services
make restart-local

# Rebuild images
make build-local

# Clean everything (containers + volumes)
make clean-local
```

---

## Legacy Commands (Still Work!)

```bash
make start       # Old way (docker-compose.hybrid.yml)
make stop        # Stop services
make docker-clean # Clean Docker resources
```

---

## Troubleshooting

### Services won't start

```bash
# Check Docker is running
docker ps

# Clean and restart
make clean-local
make start-local
```

### Database connection errors

```bash
# Wait 30-40 seconds for databases to initialize
# Check status
docker-compose -f docker-compose.local.yml ps
```

### Secrets not found

```bash
# Regenerate secrets
make init-secrets
```

### Permission denied

```bash
# Make scripts executable
chmod +x scripts/*.sh
```

---

## What Changed?

### Before
```yaml
environment:
  DB_PASSWORD: hardcoded_password_2024  # 😱
```

### After
```yaml
environment:
  DB_PASSWORD: ${SHARED_DB_PASSWORD}  # ✅ From secrets.yaml
```

---

## File Locations

- **Your secrets**: `infrastructure/secrets/secrets.yaml` (gitignored)
- **Secret template**: `infrastructure/secrets/secrets.example.yaml`
- **Local config**: `infrastructure/environments/local.env`
- **Docker compose**: `docker-compose.local.yml`

---

## Security

✅ **DO**:
- Run `make init-secrets` once per machine
- Keep `secrets.yaml` private
- Use different secrets per environment

❌ **DON'T**:
- Commit `secrets.yaml`
- Share `secrets.yaml` via email/Slack
- Use production secrets locally

---

## Help

```bash
# See all commands
make help

# Read full guide
cat infrastructure/GETTING-STARTED.md
```

---

**Questions?** Check `infrastructure/GETTING-STARTED.md` or ask the team!
