# 📖 Documentation Quick Guide

**Too many docs? Start here!** This is your 30-second guide to finding what you need.

## 🎯 I Want To...

### Start the Project
→ **[QUICK-START.md](QUICK-START.md)** (5 minutes)

### Deploy to Production
- **Custom VM** → [infrastructure/vm/README.md](infrastructure/vm/README.md)
- **Google Cloud** → [QUICK-REFERENCE-GCP.md](QUICK-REFERENCE-GCP.md)

### Find Any Documentation
→ **[DOCUMENTATION-INDEX.md](DOCUMENTATION-INDEX.md)** ⭐ Complete index

### Understand the Architecture
→ [docs/architecture/HYBRID-ARCHITECTURE-README.md](docs/architecture/HYBRID-ARCHITECTURE-README.md)

### Test the API
→ [docs/api/README.md](docs/api/README.md) + [Fullstack-Project-API.postman_collection.json](Fullstack-Project-API.postman_collection.json)

### Add Multi-Language Support
→ [docs/translation/README.md](docs/translation/README.md)

### Fix Broken Services
→ [docs/SERVICES-NOT-RUNNING.md](docs/SERVICES-NOT-RUNNING.md)

### Develop a New Feature
→ [docs/development/README.md](docs/development/README.md)

## 📂 Quick Structure

```
/ (root)
├── DOCUMENTATION-INDEX.md    ⭐ MASTER INDEX - Start here
├── README.md                 Project overview
├── QUICK-START.md            5-minute setup
├── QUICK-REFERENCE-GCP.md    GCP deployment
└── START-SERVICES-GUIDE.md   Service management

docs/
├── architecture/             How it's built
├── api/                     API specs
├── deployment/              How to deploy
├── development/             How to develop
├── translation/             Multi-language
├── frontend/                React admin
└── backend/                 Services

infrastructure/
├── terraform/               GCP (Terraform)
├── vm/                      VM deployment
│   └── README.md           ⭐ VM deployment guide
└── environments/            Configs
```

## 🚀 Quick Commands

```bash
# Start everything locally
make start

# Deploy to VM
sudo ./infrastructure/vm/deploy-vm.sh

# Deploy to GCP
cd infrastructure/terraform/environments/dev && terraform apply

# View all services
docker ps

# View logs
docker compose logs -f
```

## 💡 Pro Tips

1. **Lost?** → Check [DOCUMENTATION-INDEX.md](DOCUMENTATION-INDEX.md)
2. **Need deployment options?** → See [README.md](README.md) deployment section
3. **Service not working?** → Check [docs/SERVICES-NOT-RUNNING.md](docs/SERVICES-NOT-RUNNING.md)
4. **Historical docs?** → Check [docs-archive/](docs-archive/)

---

**Still confused?** Open [DOCUMENTATION-INDEX.md](DOCUMENTATION-INDEX.md) - it has everything organized by category.
