# Postman Collection Quick Reference

## 🚀 Quick Start

1. **Import Collection:** `Fullstack-Project-API.postman_collection.json`
2. **Import Environment:** `Fullstack-Project-Environment.postman_environment.json`
3. **Login First:** Run any login request to get access token
4. **Test Away:** Token is auto-saved for subsequent requests

## 📍 Service Endpoints (All use `/api/v1` prefix)

| Service | Port | Base URL | Endpoints |
|---------|------|----------|-----------|
| 🔐 Auth | 3001 | `http://localhost:3001/api/v1` | 6 |
| 👥 User | 3003 | `http://localhost:3003/api/v1` | 6 |
| 🏢 Customer | 3004 | `http://localhost:3004/api/v1` | 6 |
| 🚚 Carrier | 3005 | `http://localhost:3005/api/v1` | 6 |
| 💰 Pricing | 3006 | `http://localhost:3006/api/v1` | 10 |
| 🌐 Translation | 3007 | `http://localhost:3007/api/v1` | 14 |

**Total:** 48 endpoints

## 🔑 Common Endpoints

### Health Checks
```bash
GET /api/v1/health  # All services
```

### CRUD Operations
```bash
GET    /api/v1/{resource}       # List (paginated)
GET    /api/v1/{resource}/:id   # Get by ID
POST   /api/v1/{resource}       # Create
PUT    /api/v1/{resource}/:id   # Update (User, Customer, Carrier)
PATCH  /api/v1/{resource}/:id   # Update (Pricing, Translation)
DELETE /api/v1/{resource}/:id   # Delete
```

## 📦 Standardized Response Format

All endpoints return:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "statusCode": 200,
  "timestamp": "2025-01-15T12:00:00.000Z"
}
```

## 🔐 Authentication Flow

```bash
# 1. Login (saves token automatically)
POST /api/v1/auth/login
{
  "email": "test@gmail.com",
  "password": "Admin123"
}

# 2. Token is stored in environment variable: access_token

# 3. Use in other requests (automatic):
Authorization: Bearer {{access_token}}
```

## 💰 Pricing Service (Special Endpoints)

```bash
# Pricing Rules CRUD
GET    /api/v1/pricing/rules          # List rules
GET    /api/v1/pricing/rules/count    # Get count
GET    /api/v1/pricing/rules/:id      # Get by ID
POST   /api/v1/pricing/rules          # Create rule
PATCH  /api/v1/pricing/rules/:id      # Update rule
DELETE /api/v1/pricing/rules/:id      # Delete rule

# Price Calculation
POST   /api/v1/pricing/calculate      # Calculate price

# Calculation History
GET    /api/v1/pricing/calculations       # List history
GET    /api/v1/pricing/calculations/count # Get count
```

**Sample Rule Request:**
```json
{
  "name": "Standard Shipping",
  "conditions": {
    "minWeight": 0,
    "maxWeight": 50,
    "minDistance": 0,
    "maxDistance": 1000
  },
  "pricing": {
    "basePrice": 10,
    "pricePerKg": 2,
    "pricePerKm": 0.5
  },
  "isActive": true,
  "priority": 1
}
```

## 🌐 Translation Service (Special Endpoints)

```bash
# Translation
POST /api/v1/translation/translate       # Single translation
POST /api/v1/translation/translate/batch # Batch translation

# Languages CRUD (by code, not ID)
GET    /api/v1/translation/languages
GET    /api/v1/translation/languages/:code
POST   /api/v1/translation/languages
PATCH  /api/v1/translation/languages/:code
DELETE /api/v1/translation/languages/:code

# Translations CRUD (by MD5 key)
GET    /api/v1/translation/translations
POST   /api/v1/translation/translations
PATCH  /api/v1/translation/translations/:key
DELETE /api/v1/translation/translations/:key

# Utilities
GET /api/v1/translation/available-languages
```

**Sample Translation Request:**
```json
{
  "text": "Hello World",
  "targetLanguage": "es",
  "sourceLanguage": "en",
  "context": {
    "category": "ui",
    "module": "homepage"
  }
}
```

## 🧪 Quick Tests

### Test All Health Endpoints
```bash
curl http://localhost:3001/api/v1/health  # Auth
curl http://localhost:3003/api/v1/health  # User
curl http://localhost:3004/api/v1/health  # Customer
curl http://localhost:3005/api/v1/health  # Carrier
curl http://localhost:3006/api/v1/health  # Pricing
curl http://localhost:3007/api/v1/health  # Translation
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"Admin123"}'
```

## 📚 Documentation

- **Full Summary:** `POSTMAN-COLLECTION-UPDATE-SUMMARY.md`
- **Architecture:** `HYBRID-ARCHITECTURE-README.md`
- **API Standards:** `API-STANDARDIZATION-COMPLETE.md`

## ✅ Verification Status

- ✅ All 48 endpoints updated with `/api/v1` prefix
- ✅ All services using standardized ApiResponseDto format
- ✅ Request bodies match actual DTO structures
- ✅ Sample responses documented
- ✅ Environment variables configured
- ✅ Health endpoints tested and working

**Last Updated:** 2025-01-XX  
**Commit:** `docs(postman): update collection with /api/v1 prefix for all services`
