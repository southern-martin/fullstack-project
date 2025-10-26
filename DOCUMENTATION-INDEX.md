# 📚 Fullstack Project Documentation

**Last Updated**: October 22, 2025

Welcome to the Fullstack Microservices Project documentation. This index provides a clear navigation structure for all documentation.

## 🚀 Quick Start Guides

**New to this project? Start here:**

1. **[🏗️ Architecture Guide](ARCHITECTURE-GUIDE.md)** - ⭐ **NEW!** Complete architecture reference
2. **[⚡ Developer Quick Reference](DEVELOPER-QUICK-REFERENCE.md)** - ⭐ **NEW!** Daily command reference
3. **[Quick Start Guide](QUICK-START.md)** - Get the project running in 5 minutes
4. **[Startup Guide](START-SERVICES-GUIDE.md)** - Understanding service startup
5. **[README](README.md)** - Main project overview

### 🎯 What to Read First

**For New Developers:**
1. Read [ARCHITECTURE-GUIDE.md](ARCHITECTURE-GUIDE.md) - Understand the complete system
2. Follow [QUICK-START.md](QUICK-START.md) - Get services running
3. Bookmark [DEVELOPER-QUICK-REFERENCE.md](DEVELOPER-QUICK-REFERENCE.md) - Daily commands

**For AI Agents:**
1. Read [ARCHITECTURE-GUIDE.md](ARCHITECTURE-GUIDE.md) - Architecture patterns and AI prompts
2. Read [.github/copilot-instructions.md](.github/copilot-instructions.md) - AI-specific guidelines
3. Use **AI Agent Prompts** section for common tasks

## 📖 Documentation Structure

### 🏗️ Architecture & Design
**Location**: `docs/architecture/`

- **[Architecture Overview](docs/architecture/README.md)** - Main architectural documentation
- **[Hybrid Architecture](docs/architecture/HYBRID-ARCHITECTURE-README.md)** - Shared vs Separate database strategy
- **[Microservices Guidelines](docs/architecture/MICROSERVICES-ARCHITECTURE-GUIDELINES.md)** - Best practices

### 🚢 Deployment Guides
**Location**: `docs/deployment/` and `infrastructure/`

#### Local Development
- **[Local Setup](docs/deployment/README.md)** - Development environment setup
- **[Default Admin User](docs/deployment/DEFAULT-ADMIN-USER.md)** - Login credentials

#### Cloud Deployment (GCP)
- **[GCP Quick Reference](QUICK-REFERENCE-GCP.md)** - ⭐ Complete GCP deployment guide
- **Terraform Location**: `infrastructure/terraform/`
- **Secrets Management**: `infrastructure/secrets/`

#### Custom VM Deployment
- **[VM Deployment Guide](infrastructure/vm/README.md)** - ⭐ Complete VM deployment guide
- **Installation**: `infrastructure/vm/install-vm.sh`
- **Deployment**: `infrastructure/vm/deploy-vm.sh`

### 🔌 API Documentation
**Location**: `docs/api/`

- **[API Standards](docs/API-STANDARDS.md)** - API design standards
- **[Postman Collection](docs/api/README.md)** - API testing with Postman
- **[Response Format Examples](docs/API-RESPONSE-FORMAT-EXAMPLES.md)** - Standard response formats

### 🌐 Translation System
**Location**: `docs/translation/`

- **[Translation README](docs/translation/README.md)** - Translation system overview
- **[Quick Reference](docs/translation/QUICK-REFERENCE.md)** - Common translation tasks
- **[Debugging Guide](docs/translation/TRANSLATION-DEBUGGING-GUIDE.md)** - Troubleshooting

### 👨‍💻 Development
**Location**: `docs/development/`

- **[Development README](docs/development/README.md)** - Development guidelines
- **[Git Flow](docs/development/GITFLOW.md)** - Branch strategy and workflow
- **[Coding Standards](docs/development/coding-standards.md)** - Code style guide

### 🖥️ Frontend
**Location**: `docs/frontend/`

- **[React Admin Guide](docs/frontend/README.md)** - Frontend documentation
- **[Login Flow](docs/frontend/LOGIN-FLOW-DIAGRAM.md)** - Authentication flow

### 🔧 Backend Services
**Location**: `docs/backend/`

- **[Backend README](docs/backend/README.md)** - Backend services overview
- **[NestJS API](docs/backend/nestjs-api-detailed-readme.md)** - NestJS services documentation
- **[Go API](docs/backend/go-api-readme.md)** - Go services documentation

## 📂 Project Structure

```
fullstack-project/
├── README.md                          # Main project overview
├── QUICK-START.md                     # Quick start guide
├── DOCUMENTATION-INDEX.md             # This file
│
├── docs/                              # All documentation
│   ├── architecture/                  # Architecture docs
│   ├── deployment/                    # Deployment guides
│   ├── api/                          # API documentation
│   ├── translation/                  # Translation system
│   ├── development/                  # Development guides
│   ├── frontend/                     # Frontend docs
│   └── backend/                      # Backend docs
│
├── infrastructure/                    # Infrastructure as Code
│   ├── terraform/                    # GCP Terraform modules
│   ├── vm/                           # VM deployment scripts
│   ├── secrets/                      # Secrets management
│   └── environments/                 # Environment configs
│
├── Services (6 microservices):
│   ├── auth-service/                 # Authentication (NestJS)
│   ├── user-service/                 # User management (NestJS)
│   ├── carrier-service/              # Carrier management (Go)
│   ├── customer-service/             # Customer management (Go)
│   ├── pricing-service/              # Pricing (Go)
│   └── translation-service/          # Translations (NestJS)
│
└── Frontend:
    └── react-admin/                  # React admin dashboard
```

## 🎯 Common Tasks

### Starting the Project
```bash
# Local development
make start

# Cloud-ready local setup
make start-local

# VM deployment
sudo ./infrastructure/vm/deploy-vm.sh
```

### Accessing Services
- **Frontend**: http://localhost:3000
- **Auth API**: http://localhost:3001/api/v1/auth
- **User API**: http://localhost:3003/api/users
- **Default Login**: admin@example.com / Admin123!

### Documentation Tasks
```bash
# View this index
cat DOCUMENTATION-INDEX.md

# Search documentation
grep -r "search term" docs/

# Update documentation
nano docs/[category]/[file].md
```

## 🗂️ Archive

Historical documentation has been moved to:
- **Git Flow History**: `docs-archive/historical-git-flows/`
- **Completed Features**: `docs-archive/completed-features/`
- **Old Planning Docs**: `docs-archive/old-planning/`

## 🆘 Troubleshooting

### Common Issues
- **Services not starting**: See [Troubleshooting Guide](docs/SERVICES-NOT-RUNNING.md)
- **Docker issues**: See [Docker Guide](docs/DOCKER-NOT-RUNNING.md)
- **Translation not working**: See [Translation Debugging](docs/translation/TRANSLATION-DEBUGGING-GUIDE.md)

### Getting Help
1. Check the relevant documentation section above
2. Search in `docs/` directory for your issue
3. Check archived documentation if needed
4. Review service-specific README files

## 📊 Deployment Options

| Environment | Setup Time | Cost/Month | Best For |
|-------------|-----------|-----------|----------|
| **Local Dev** | 5 min | $0 | Development |
| **Custom VM** | 15 min | $20-100 | Small-medium sites |
| **GCP (GKE)** | 30 min | $150-1200 | Enterprise, auto-scaling |

## 📝 Notes

- **Current Branch**: develop
- **Default Admin**: admin@example.com / Admin123!
- **Node Environment**: Development mode by default
- **Database**: MySQL 8.0 (4 separate databases)
- **Cache**: Redis 7

---

**Need to add new documentation?** Follow the structure above and update this index.
