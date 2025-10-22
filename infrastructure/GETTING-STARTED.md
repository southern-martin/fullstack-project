# 🚀 GCP Migration - Getting Started Guide

## Overview

This project is now configured for cloud deployment (GCP) while maintaining full local development capabilities. All secrets have been externalized and the infrastructure is cloud-ready.

## 🏗️ Architecture

- **Local Development**: Docker Compose with externalized secrets
- **Cloud Deployment**: Kubernetes on Google Kubernetes Engine (GKE)
- **Databases**: Cloud SQL for MySQL (production) / Local MySQL containers (development)
- **Cache**: Memorystore for Redis (production) / Local Redis container (development)

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.0+
- Python 3.x (for secrets conversion script)
- Make (for convenient commands)
- OpenSSL (for generating secrets)

## 🚀 Quick Start (First Time Setup)

### 1. Initialize Local Secrets

Run this **once** to generate secure random passwords for local development:

```bash
make init-secrets
```

This creates `infrastructure/secrets/secrets.yaml` with secure random passwords. This file is gitignored and never committed.

### 2. Start All Services

```bash
make start-local
```

This will:
1. Load secrets from `secrets.yaml`
2. Merge with environment config from `infrastructure/environments/local.env`
3. Create `.env` file
4. Start all services with Docker Compose

### 3. Access Services

Once started, services are available at:

- **React Admin**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **User Service**: http://localhost:3003
- **Carrier Service**: http://localhost:3004
- **Customer Service**: http://localhost:3005
- **Pricing Service**: http://localhost:3006

**Default Login**:
- Email: `admin@example.com`
- Password: `Admin123!`

## 📦 Available Commands

### Local Development

```bash
# First time setup
make init-secrets          # Generate secure local secrets (run once)

# Daily development
make start-local           # Start all services
make stop-local            # Stop all services
make restart-local         # Restart all services
make logs-local            # View logs (follow mode)

# Build and cleanup
make build-local           # Rebuild Docker images
make clean-local           # Stop and remove all containers + volumes
```

### Legacy Commands (Still Work)

```bash
make start                 # Start with docker-compose.hybrid.yml (old way)
make stop                  # Stop services
make docker-clean          # Clean up Docker resources
```

## 🔐 Secrets Management

### Local Development

Secrets are stored in `infrastructure/secrets/secrets.yaml`:

```yaml
database:
  shared_user_db:
    root_password: "auto-generated-secure-password"
    username: "shared_user"
    password: "auto-generated-secure-password"
    # ... more secrets
```

**Important**:
- ✅ `secrets.yaml` is gitignored (never committed)
- ✅ `secrets.example.yaml` is a template (safe to commit)
- ✅ Secrets are auto-generated with `make init-secrets`
- ✅ You can manually edit `secrets.yaml` for custom values

### Cloud Deployment (GCP)

For production/staging:
- Secrets stored in **GCP Secret Manager**
- Kubernetes pulls secrets automatically
- Never store production secrets in files

## 📁 Project Structure

```
fullstack-project/
├── infrastructure/
│   ├── environments/          # Environment configurations
│   │   ├── local.env         # Local development config
│   │   ├── development.env   # Cloud dev environment
│   │   ├── staging.env       # Cloud staging environment
│   │   └── production.env    # Cloud production environment
│   ├── secrets/              # Secrets management
│   │   ├── .gitignore        # Ensures secrets are not committed
│   │   ├── README.md         # Secrets documentation
│   │   ├── secrets.example.yaml  # Template (SAFE to commit)
│   │   └── secrets.yaml      # YOUR secrets (GITIGNORED)
│   ├── terraform/            # Infrastructure as Code (coming soon)
│   └── kubernetes/           # K8s manifests (coming soon)
├── scripts/
│   ├── init-local-secrets.sh # Generate local secrets
│   └── load-env.sh           # Convert secrets to .env
├── docker-compose.local.yml  # Cloud-ready local development
├── docker-compose.hybrid.yml # Legacy (still works)
└── .env                      # Auto-generated, gitignored
```

## 🔄 How It Works

### Local Development Flow

```
1. secrets.yaml (your secrets)
        ↓
2. load-env.sh (converts to .env)
        ↓
3. .env (used by docker-compose)
        ↓
4. docker-compose.local.yml (starts services)
        ↓
5. Services running with externalized config
```

### Cloud Deployment Flow (Future)

```
1. GCP Secret Manager (secrets)
        ↓
2. Kubernetes Secrets (mounted in pods)
        ↓
3. Environment variables (in containers)
        ↓
4. Services running in GKE
```

## 🛠️ Troubleshooting

### Secrets not found

```bash
# Error: secrets.yaml not found
# Solution: Initialize secrets first
make init-secrets
```

### Services won't start

```bash
# Check if Docker is running
docker ps

# Check logs
make logs-local

# Clean and restart
make clean-local
make start-local
```

### Database connection errors

```bash
# Wait for databases to be ready (healthchecks)
docker-compose -f docker-compose.local.yml ps

# Check database is healthy (should show "healthy")
```

### Permission denied on scripts

```bash
# Make scripts executable
chmod +x scripts/*.sh
```

## 🔒 Security Best Practices

### Local Development

1. ✅ Never commit `secrets.yaml`
2. ✅ Never commit `.env`
3. ✅ Use strong passwords (auto-generated)
4. ✅ Rotate secrets periodically
5. ✅ Don't share `secrets.yaml` via Slack/email

### Production

1. ✅ Use GCP Secret Manager
2. ✅ Enable audit logging
3. ✅ Rotate secrets regularly (90 days)
4. ✅ Use least-privilege access
5. ✅ Enable encryption at rest

## 🚀 Next Steps

After getting local development working:

1. **Test locally**: Verify all services work
2. **Review architecture**: Check `docs/cloud/GCP-DEPLOYMENT.md` (coming soon)
3. **Set up GCP project**: Create GCP account and project
4. **Deploy to dev**: Follow deployment guide
5. **Deploy to staging**: Test in staging environment
6. **Deploy to production**: Go live!

## 📚 Additional Documentation

- [Secrets Management](infrastructure/secrets/README.md)
- [Environment Configuration](infrastructure/environments/README.md) (coming soon)
- [GCP Deployment Guide](docs/cloud/GCP-DEPLOYMENT.md) (coming soon)
- [Kubernetes Setup](docs/cloud/KUBERNETES-SETUP.md) (coming soon)

## ❓ FAQ

**Q: Can I still use the old `make start` command?**
A: Yes! The old `docker-compose.hybrid.yml` still works, but uses hardcoded secrets.

**Q: Do I need to regenerate secrets every time?**
A: No! Run `make init-secrets` once. The `secrets.yaml` file persists.

**Q: Can I use custom passwords instead of auto-generated?**
A: Yes! Edit `infrastructure/secrets/secrets.yaml` manually after running `make init-secrets`.

**Q: How do I reset everything?**
A: Run `make clean-local` to remove all containers and volumes, then `make start-local`.

**Q: Will this work on Windows?**
A: Yes, but you may need WSL2 for the bash scripts. Alternatively, use Docker Desktop for Windows.

## 💡 Tips

- Use `make help` to see all available commands
- Check service health with `docker-compose -f docker-compose.local.yml ps`
- View individual service logs: `docker logs -f auth-service`
- Access databases directly: `docker exec -it shared-user-database mysql -u shared_user -p`

## 🎯 What's Different?

### Before (Old Way)
```yaml
# docker-compose.hybrid.yml
environment:
  DB_PASSWORD: hardcoded_password_2024  # 😱 Hardcoded!
```

### After (New Way)
```yaml
# docker-compose.local.yml
environment:
  DB_PASSWORD: ${SHARED_DB_PASSWORD}  # ✅ From secrets.yaml
```

**Benefits**:
- ✅ No hardcoded secrets in code
- ✅ Different secrets per environment
- ✅ Cloud-ready configuration
- ✅ Better security
- ✅ Easy to rotate secrets

---

**Ready to get started?** Run `make init-secrets` and then `make start-local`! 🚀
