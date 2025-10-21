# 🚀 Fullstack Microservices Project

**A modern microservices platform with React Admin frontend, NestJS backend services, and intelligent translation system.**

[![Services](https://img.shields.io/badge/Microservices-6-blue)](./docs/DOCUMENTATION-INDEX.md)
[![Status](https://img.shields.io/badge/Status-Active%20Development-green)]()
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](./docker-compose.hybrid.yml)

---

## 🎯 Quick Links

- **[📖 Documentation Index](./docs/DOCUMENTATION-INDEX.md)** - Complete documentation navigation
- **[🚀 Quick Start](./QUICK-START.md)** - Get running in 5 minutes
- **[🐳 Start Services](./START-SERVICES-GUIDE.md)** - Docker services guide
- **[🌐 Translation Feature](./TRANSLATION-FEATURE-COMPLETE-SUMMARY.md)** - Latest feature overview
- **[📮 Postman Guide](./POSTMAN-QUICK-REFERENCE.md)** - API testing

---

## 🏗️ Architecture

### Microservices (6 Services)

| Service | Port | Purpose | Database |
|---------|------|---------|----------|
| **Auth Service** | 3001 | Authentication & JWT | Shared MySQL |
| **User Service** | 3003 | User management | Shared MySQL |
| **Customer Service** | 3004 | Customer operations | PostgreSQL |
| **Carrier Service** | 3005 | Carrier management | PostgreSQL |
| **Pricing Service** | 3006 | Pricing calculations | PostgreSQL |
| **Translation Service** | 3007 | i18n & translations | PostgreSQL |

### Shared Infrastructure

- **MySQL (3306)** - Shared database for Auth + User services
- **Redis (6379)** - Caching and session management
- **Docker Compose** - Container orchestration

---

## ⚡ Quick Start

### 1. Start Services
```bash
# Start shared infrastructure
cd shared-database && docker-compose up -d

# Start all microservices
docker-compose -f docker-compose.hybrid.yml up -d
```

### 2. Access Application
- **Frontend**: http://localhost:3000
- **Default Login**: admin@example.com / Admin123!

### 3. Verify Services
```bash
# Check all services are healthy
make health-check
```

**→ See [Quick Start Guide](./QUICK-START.md) for detailed instructions**

---

## 🌟 Key Features

### ✅ Translation System (Latest Feature)
- **Language Selector** - Global language switching in header
- **Batch Translation** - 10× faster performance (1 request vs 40)
- **Redis Caching** - 100% cache hit rate for translations
- **Multi-language UI** - Supports English, French, Spanish, etc.
- **Carrier Module** - Fully translated with auto-update

**→ Read [Translation Feature Summary](./TRANSLATION-FEATURE-COMPLETE-SUMMARY.md)**

### ✅ Standardized API Format
All 6 microservices use consistent response format:
```typescript
{
  data: T,              // Actual response data
  message: string,      // Success/error message
  statusCode: number,   // HTTP status code
  timestamp: string,    // ISO timestamp
  success: boolean      // Operation success flag
}
```

**→ Read [API Standards](./docs/API-STANDARDS.md)**

### ✅ Hybrid Database Architecture
- **Shared Pattern**: Auth + User services share MySQL for tightly coupled data
- **Separate Pattern**: Business services have independent databases for loose coupling
- **Best of Both**: Performance + scalability

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **TanStack Query** (React Query) for state management
- **Tailwind CSS** for styling
- **Heroicons** for icons

### Backend
- **NestJS** with TypeScript
- **TypeORM** for database access
- **JWT** authentication
- **Redis** caching

### Infrastructure
- **Docker** & Docker Compose
- **MySQL 8.0** & **PostgreSQL 14**
- **Redis 7**

---

## 📚 Documentation Structure

### For Developers (Start Here)
1. [Quick Start Guide](./QUICK-START.md) - Get up and running
2. [Documentation Index](./docs/DOCUMENTATION-INDEX.md) - Find any document
3. [API Standards](./docs/API-STANDARDS.md) - API conventions

### Feature Documentation
- [Translation Feature](./TRANSLATION-FEATURE-COMPLETE-SUMMARY.md) - Complete translation system
- [Language Selector](./LANGUAGE-SELECTOR-IMPLEMENTATION.md) - Language switching UI
- [Carrier Translation](./CARRIER-MODULE-BATCH-TRANSLATION-COMPLETE.md) - Batch translation

### Service Documentation
Each service has its own README in its folder:
- [auth-service/README.md](./auth-service/README.md)
- [user-service/README.md](./user-service/README.md)
- [customer-service/README.md](./customer-service/README.md)
- [carrier-service/README.md](./carrier-service/README.md)
- [pricing-service/README.md](./pricing-service/README.md)
- [translation-service/README.md](./translation-service/README.md)

---

## 🧪 Testing

### API Testing with Postman
1. Import [Postman Collection](./Fullstack-Project-API.postman_collection.json)
2. Import [Environment](./Fullstack-Project-Environment.postman_environment.json)
3. Read [Postman Guide](./POSTMAN-QUICK-REFERENCE.md)

### Translation Testing
- [Carrier Translation Testing Guide](./CARRIER-TRANSLATION-TESTING-GUIDE.md)

---

## 📊 Current Status

| Feature | Status | Documentation |
|---------|--------|---------------|
| API Standardization | ✅ Complete (6/6 services) | [API Standards](./API-STANDARDIZATION-COMPLETE.md) |
| Translation Service | ✅ Running | [Translation Guide](./TRANSLATION-FEATURE-COMPLETE-SUMMARY.md) |
| Language Selector | ✅ Integrated | [Language Selector](./LANGUAGE-SELECTOR-IMPLEMENTATION.md) |
| Carrier Translation | ✅ Complete | [Carrier Module](./CARRIER-MODULE-BATCH-TRANSLATION-COMPLETE.md) |
| Docker Services | ✅ All healthy | [Start Guide](./START-SERVICES-GUIDE.md) |

**→ See [TODO.md](./TODO.md) for pending work**

---

## 🤝 Contributing

1. Follow [Git Flow Guide](./scripts/gitflow/README.md)
2. Adhere to [API Standards](./docs/API-STANDARDS.md)
3. Update relevant documentation
4. Test with Postman collection

---

## 📞 Need Help?

- **Documentation**: Start with [Documentation Index](./docs/DOCUMENTATION-INDEX.md)
- **Quick Start Issues**: Check [Start Services Guide](./START-SERVICES-GUIDE.md)
- **API Questions**: Review [Postman Guide](./POSTMAN-QUICK-REFERENCE.md)
- **Service Issues**: Check individual service README files

---

## 📝 License

[Add your license here]

---

**Last Updated**: October 21, 2025
