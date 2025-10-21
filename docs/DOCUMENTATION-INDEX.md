# Fullstack Project Documentation Index

**Last Updated**: October 21, 2025  
**Project**: Fullstack Microservices with Translation Feature

---

## 📚 Quick Navigation

### 🚀 Getting Started
- [Quick Start Guide](../QUICK-START.md) - Start here! Get the project running in 5 minutes
- [README](../README.md) - Project overview and main documentation
- [Start Services Guide](../START-SERVICES-GUIDE.md) - Docker services startup guide

### 🏗️ Architecture & Standards
- [API Standards](./API-STANDARDS.md) - Standardized API response format across all services
- [Hybrid Database Architecture](../.github/copilot-instructions.md) - Shared vs separate database strategy

### 🌐 Translation Feature (Current Focus)
- [Translation Feature Summary](../TRANSLATION-FEATURE-COMPLETE-SUMMARY.md) - **START HERE** - Complete overview
- [Language Selector Implementation](../LANGUAGE-SELECTOR-IMPLEMENTATION.md) - How to use the language selector
- [Language Selector Integration](../LANGUAGE-SELECTOR-INTEGRATION-EXAMPLE.md) - Quick integration examples
- [Translation Dynamic Fix](../LANGUAGE-SELECTOR-DYNAMIC-TRANSLATION-FIX.md) - Recent bug fixes

### 🧪 Testing & API
- [Postman Collection Guide](../POSTMAN-QUICK-REFERENCE.md) - API testing with Postman
- [Carrier Translation Testing](../CARRIER-TRANSLATION-TESTING-GUIDE.md) - How to test translations

### 📝 Service-Specific Documentation
- [Auth Service](../auth-service/README.md) - Port 3001
- [User Service](../user-service/README.md) - Port 3003
- [Customer Service](../customer-service/README.md) - Port 3004
- [Carrier Service](../carrier-service/README.md) - Port 3005
- [Pricing Service](../pricing-service/README.md) - Port 3006
- [Translation Service](../translation-service/README.md) - Port 3007

### 🔧 Development Tools
- [Git Flow Guide](../scripts/gitflow/README.md) - Branch management and workflow
- [Makefile Commands](../Makefile) - Build and deployment commands

---

## 📖 Documentation Categories

### Active Documentation (Current Work)
These documents are actively maintained and relevant to current development:

| Document | Purpose | Status |
|----------|---------|--------|
| [TRANSLATION-FEATURE-COMPLETE-SUMMARY.md](../TRANSLATION-FEATURE-COMPLETE-SUMMARY.md) | Translation feature overview | ✅ Current |
| [LANGUAGE-SELECTOR-IMPLEMENTATION.md](../LANGUAGE-SELECTOR-IMPLEMENTATION.md) | Language selector guide | ✅ Current |
| [LANGUAGE-SELECTOR-DYNAMIC-TRANSLATION-FIX.md](../LANGUAGE-SELECTOR-DYNAMIC-TRANSLATION-FIX.md) | Recent bug fixes | ✅ Current |
| [CARRIER-MODULE-BATCH-TRANSLATION-COMPLETE.md](../CARRIER-MODULE-BATCH-TRANSLATION-COMPLETE.md) | Carrier translation implementation | ✅ Current |
| [API-STANDARDIZATION-COMPLETE.md](../API-STANDARDIZATION-COMPLETE.md) | API standards implementation | ✅ Current |
| [POSTMAN-QUICK-REFERENCE.md](../POSTMAN-QUICK-REFERENCE.md) | Postman usage guide | ✅ Current |
| [START-SERVICES-GUIDE.md](../START-SERVICES-GUIDE.md) | Docker startup guide | ✅ Current |

### Reference Documentation (Historical/Background)
These documents provide historical context but are not needed for daily work:

| Category | Documents | Status |
|----------|-----------|--------|
| Git Flow History | All `GIT-FLOW-*.md` files | 📦 Archived |
| Implementation Plans | `*-IMPLEMENTATION-PLAN*.md` files | 📦 Archived |
| Progress Tracking | `*-PROGRESS*.md` files | 📦 Archived |
| Service Migrations | `*-DOCKER-*.md`, `*-INFRASTRUCTURE-*.md` | 📦 Archived |

---

## 🎯 Document by Use Case

### "I want to start developing"
1. [Quick Start Guide](../QUICK-START.md)
2. [Start Services Guide](../START-SERVICES-GUIDE.md)
3. [API Standards](./API-STANDARDS.md)

### "I want to understand the translation feature"
1. [Translation Feature Summary](../TRANSLATION-FEATURE-COMPLETE-SUMMARY.md)
2. [Language Selector Implementation](../LANGUAGE-SELECTOR-IMPLEMENTATION.md)
3. [Carrier Translation Testing](../CARRIER-TRANSLATION-TESTING-GUIDE.md)

### "I want to test the API"
1. [Postman Quick Reference](../POSTMAN-QUICK-REFERENCE.md)
2. Import [Postman Collection](../Fullstack-Project-API.postman_collection.json)
3. Import [Postman Environment](../Fullstack-Project-Environment.postman_environment.json)

### "I want to work on a specific service"
- Navigate to the service folder (e.g., `auth-service/`, `carrier-service/`)
- Read the service's `README.md`

### "I need to understand a bug fix"
- [Language Selector Dynamic Translation Fix](../LANGUAGE-SELECTOR-DYNAMIC-TRANSLATION-FIX.md) - Latest fixes

---

## 🗑️ Archived Documentation

Historical documents have been moved to:
- `docs/archived/` - Contains old implementation plans, git flow history, and deprecated guides

---

## 📞 Support

- Check [TODO.md](../TODO.md) for current work items
- Review [PROJECT-STATUS-UPDATE.md](../PROJECT-STATUS-UPDATE.md) for overall project status
- Service-specific issues: Check individual service README files

---

**Note**: This index is maintained to help navigate the extensive documentation. Always start with the "Active Documentation" section for current work.
