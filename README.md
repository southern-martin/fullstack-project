# 🚀 Fullstack Microservices Project

**A modern cloud-ready microservices platform with React Admin, NestJS/Go services, and multi-language support.**

[![Services](https://img.shields.io/badge/Microservices-6-blue)](./DOCUMENTATION-INDEX.md)
[![Deployments](https://img.shields.io/badge/Deployment-Local%20%7C%20VM%20%7C%20GCP-green)]()
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](./docker-compose.hybrid.yml)

> **New**: Now supports deployment to Custom VMs and Google Cloud Platform! See [deployment guides](#-deployment-options) below.

---

## 🎯 Quick Links

### 📚 Essential Documentation
- **[🏗️ Architecture Guide](ARCHITECTURE-GUIDE.md)** - ⭐ **NEW!** Complete architecture, patterns, and AI prompts
- **[⚡ Developer Quick Reference](DEVELOPER-QUICK-REFERENCE.md)** - ⭐ **NEW!** Fast command reference
- **[📖 Documentation Index](DOCUMENTATION-INDEX.md)** - Complete navigation
- **[🚀 Quick Start](QUICK-START.md)** - Get running in 5 minutes

### 🚀 Deployment Guides
- **[☁️ GCP Deployment](QUICK-REFERENCE-GCP.md)** - Deploy to Google Cloud
- **[🖥️ VM Deployment](infrastructure/vm/README.md)** - Deploy to custom VMs

### 🧪 Testing & API
- **[📮 Postman Collection](Fullstack-Project-API.postman_collection.json)** - API testing
- **[🤖 AI Instructions](.github/copilot-instructions.md)** - Copilot guidelines
- **[📊 Swagger Index](swagger-index.html)** - ⭐ **NEW!** Central API documentation hub

### ⚙️ Configuration Management
- **[📝 Consul Usage Guide](CONSUL-USAGE-GUIDE.md)** - ⭐ **NEW!** Complete Consul configuration guide
- **[⚡ Consul Quick Reference](CONSUL-QUICK-REFERENCE.md)** - ⭐ **NEW!** Quick reference card
- **[✅ Week 2 Completion](CONSUL-WEEK2-COMPLETION.md)** - ⭐ **NEW!** Implementation summary

---

## 🏗️ Architecture

### Microservices (6 Services + Frontend)

| Service | Port | Technology | Purpose | Database |
|---------|------|-----------|---------|----------|
| **React Admin** | 3000 | React 18 | Admin dashboard | - |
| **Auth Service** | 3001 | NestJS | Authentication & JWT | Shared MySQL |
| **User Service** | 3003 | NestJS | User management | Shared MySQL |
| **Carrier Service** | 3004 | Go | Carrier operations | MySQL |
| **Customer Service** | 3005 | Go | Customer operations | MySQL |
| **Pricing Service** | 3006 | Go | Pricing calculations | MySQL |
| **Translation Service** | 3007 | NestJS | Multi-language i18n | MySQL |

### Shared Infrastructure

- **MySQL 8.0** - 4 database instances (hybrid architecture)
- **Redis 7** - Shared cache and session store
- **Consul** - Centralized configuration management
- **Nginx** - Reverse proxy (VM deployment)
- **Docker Compose** - Local orchestration
- **Kubernetes** - GCP deployment (GKE)

---

## ⚡ Quick Start

### 1. Start Services (Local Development)
```bash
# Easiest way - use Makefile
make start

# Or manually start services
cd shared-database && docker-compose up -d
docker-compose -f docker-compose.hybrid.yml up -d
```

### 2. Access Application
- **Frontend**: http://localhost:3000
- **Default Login**: `admin@example.com` / `Admin123!`
- **API Documentation**: See [API Standards](docs/API-STANDARDS.md)
- **Consul UI**: http://localhost:8500

### 3. Test Consul Configuration (Optional)
```bash
# Test all services load configuration from Consul
cd customer-service && npx ts-node src/infrastructure/config/__tests__/test-consul.ts
cd ../carrier-service && npx ts-node src/infrastructure/config/__tests__/test-consul.ts
cd ../pricing-service && npx ts-node src/infrastructure/config/__tests__/test-consul.ts
cd ../user-service && npx ts-node src/infrastructure/config/__tests__/test-consul.ts
```

**→ See [CONSUL-USAGE-GUIDE.md](CONSUL-USAGE-GUIDE.md) for complete documentation**

**→ See [QUICK-START.md](QUICK-START.md) for detailed instructions**

---

## 🚀 Deployment Options

### Local Development (5 minutes)
```bash
make start
```
- **Best for**: Development, testing
- **Cost**: Free
- **Documentation**: [QUICK-START.md](QUICK-START.md)

### Custom VM Deployment (15 minutes)
```bash
sudo ./infrastructure/vm/install-vm.sh
sudo ./infrastructure/vm/deploy-vm.sh
```
- **Best for**: Small-medium sites, on-premises
- **Cost**: $20-100/month
- **Documentation**: [infrastructure/vm/README.md](infrastructure/vm/README.md)

### Google Cloud Platform (30 minutes)
```bash
cd infrastructure/terraform/environments/dev
terraform apply
```
- **Best for**: Enterprise, auto-scaling
- **Cost**: $150-1200/month
- **Documentation**: [QUICK-REFERENCE-GCP.md](QUICK-REFERENCE-GCP.md)

---

## 🌟 Key Features

### ✅ Multi-Language Support
- **3 Languages**: English, French, Spanish
- **401 User Profiles**: Pre-seeded with translations
- **Dynamic Translation**: Real-time language switching
- **Redis Caching**: Fast translation lookups

### ✅ Standardized API Format
All microservices use consistent responses:
```json
{
  "data": {},
  "message": "Success",
  "statusCode": 200,
  "timestamp": "2025-10-22T00:00:00.000Z",
  "success": true
}
```

### ✅ Hybrid Database Architecture
- **Shared DB**: Auth + User services (tightly coupled)
- **Separate DBs**: Business services (loose coupling)
- **Benefits**: Performance + Scalability

### ✅ Cloud-Ready Infrastructure
- **Secrets Management**: YAML-based with environment separation
- **Consul Config Server**: Centralized configuration management (⭐ **NEW!**)
- **Terraform**: Complete GCP infrastructure as code
- **Docker Compose**: Production-ready VM deployment
- **Auto-scaling**: Kubernetes support for GCP

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, TanStack Query, Tailwind CSS |
| **Backend** | NestJS (TypeScript), Go 1.21 |
| **Databases** | MySQL 8.0, Redis 7 |
| **Infrastructure** | Docker, Kubernetes (GKE), Terraform |
| **Cloud** | Google Cloud Platform |
| **Auth** | JWT with refresh tokens |

---

## 📚 Documentation

**Start Here**: [DOCUMENTATION-INDEX.md](DOCUMENTATION-INDEX.md) - Complete navigation

### Essential Guides
- **[QUICK-START.md](QUICK-START.md)** - Get running in 5 minutes
- **[QUICK-REFERENCE-GCP.md](QUICK-REFERENCE-GCP.md)** - GCP deployment
- **[infrastructure/vm/README.md](infrastructure/vm/README.md)** - VM deployment
- **[START-SERVICES-GUIDE.md](START-SERVICES-GUIDE.md)** - Service management

### By Category
- **Architecture**: [docs/architecture/](docs/architecture/)
- **API Docs**: [docs/api/](docs/api/)
- **Translation**: [docs/translation/](docs/translation/)
- **Development**: [docs/development/](docs/development/)
- **Deployment**: [docs/deployment/](docs/deployment/)

---

## 📊 Project Status

| Component | Status | Version |
|-----------|--------|---------|
| User Profiles | ✅ Complete | 401 seeded |
| Multi-language | ✅ Complete | EN/FR/ES |
| API Standardization | ✅ Complete | 6/6 services |
| Consul Config Server | ✅ Complete | Week 2 ⭐ **NEW!** |
| Local Deployment | ✅ Ready | Docker Compose |
| VM Deployment | ✅ Ready | Ubuntu/Debian/CentOS |
| GCP Deployment | ✅ Ready | Terraform |
| AWS Deployment | ⏳ Planned | Phase 4 |

---

## 🤝 Contributing

1. **Git Workflow**: See [docs/development/GITFLOW.md](docs/development/GITFLOW.md)
2. **Coding Standards**: Follow [docs/development/coding-standards.md](docs/development/coding-standards.md)
3. **API Standards**: Adhere to [docs/API-STANDARDS.md](docs/API-STANDARDS.md)
4. **Testing**: Use [Postman collection](Fullstack-Project-API.postman_collection.json)

---

## 📞 Support

- **📖 Documentation**: [DOCUMENTATION-INDEX.md](DOCUMENTATION-INDEX.md)
- **🆘 Troubleshooting**: [docs/SERVICES-NOT-RUNNING.md](docs/SERVICES-NOT-RUNNING.md)
- **💬 Questions**: Check service-specific README files

---

**Last Updated**: October 22, 2025
