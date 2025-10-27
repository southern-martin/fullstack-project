# Pricing Service - Postman Collection Guide

## 📦 Collection Overview

**File**: `Pricing-Service.postman_collection.json`  
**Version**: 1.0.0  
**Created**: October 27, 2025  
**Base URL**: `http://localhost:3006/api/v1`

This Postman collection provides complete API testing for the Pricing Service with **15 endpoints** organized into 4 categories.

## 🚀 Quick Start

### 1. Import Collection

**Option A: Via Postman App**
1. Open Postman
2. Click **Import** button
3. Select `Pricing-Service.postman_collection.json`
4. Click **Import**

**Option B: Via Command Line**
```bash
# If you have newman installed
npm install -g newman
newman run Pricing-Service.postman_collection.json
```

### 2. Verify Base URL

The collection uses variable `{{baseUrl}}` set to:
```
http://localhost:3006/api/v1
```

To change for different environments, update the collection variable.

### 3. Test Connection

Run the **Health Check** request first to verify the service is running.

Expected Response:
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2025-10-27T09:21:29.731Z",
    "service": "pricing-service"
  },
  "statusCode": 200,
  "success": true
}
```

## 📂 Collection Structure

### 1. Health Check (1 endpoint)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |

**Usage**: Verify service is running before testing other endpoints.

### 2. Pricing Rules (6 endpoints)

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/pricing/rules` | POST | Create pricing rule | ❌ No (should be ✅) |
| `/pricing/rules` | GET | Get all rules (paginated) | No |
| `/pricing/rules/:id` | GET | Get rule by ID | No |
| `/pricing/rules/count` | GET | Get total rule count | No |
| `/pricing/rules/:id` | PATCH | Update rule | ❌ No (should be ✅) |
| `/pricing/rules/:id` | DELETE | Delete rule | ❌ No (should be ✅) |

**Query Parameters** (GET /pricing/rules):
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by rule name (optional)

### 3. Price Calculation (4 endpoints)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/pricing/calculate` | POST | Calculate price - Basic |
| `/pricing/calculate` | POST | Calculate price - With Distance |
| `/pricing/calculate` | POST | Calculate price - International |
| `/pricing/calculate` | POST | Calculate price - With Customer ID |

**Request Body** (all variants):
```json
{
  "carrierId": 1,           // Required
  "serviceType": "Express", // Required
  "weight": 5.5,            // Required (in kg)
  "distance": 250,          // Optional (in km)
  "originCountry": "US",    // Required
  "destinationCountry": "US", // Required
  "customerId": 123,        // Optional
  "customerType": "Enterprise" // Optional
}
```

### 4. Price Calculation History (2 endpoints)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/pricing/calculations` | GET | Get calculation history |
| `/pricing/calculations/count` | GET | Get calculation count |

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by request ID (optional)

## 📝 Sample Requests

### Create Pricing Rule

```bash
POST /api/v1/pricing/rules
Content-Type: application/json

{
  "name": "FedEx Express Domestic",
  "description": "Standard pricing for FedEx Express domestic shipments",
  "conditions": {
    "carrierId": 1,
    "serviceType": "Express",
    "originCountry": "US",
    "destinationCountry": "US"
  },
  "pricing": {
    "baseRate": 15.99,
    "currency": "USD",
    "perKgRate": 2.5,
    "minimumCharge": 12.99,
    "maximumCharge": 500.0,
    "surcharges": [
      {
        "type": "Fuel Surcharge",
        "percentage": 8.5
      },
      {
        "type": "Weekend Delivery",
        "amount": 5.0
      }
    ]
  },
  "priority": 100
}
```

### Calculate Price

```bash
POST /api/v1/pricing/calculate
Content-Type: application/json

{
  "carrierId": 1,
  "serviceType": "Express",
  "weight": 5.5,
  "originCountry": "US",
  "destinationCountry": "US"
}
```

**Response**:
```json
{
  "data": {
    "requestId": "uuid-here",
    "calculation": {
      "baseRate": 15.99,
      "weightRate": 13.75,
      "surcharges": [
        {
          "type": "Fuel Surcharge",
          "amount": 2.53,
          "description": "8.5% fuel surcharge"
        }
      ],
      "discounts": [],
      "subtotal": 29.74,
      "total": 32.27,
      "currency": "USD"
    },
    "appliedRules": [
      {
        "ruleId": 1,
        "ruleName": "FedEx Express Domestic",
        "priority": 100
      }
    ]
  },
  "statusCode": 200,
  "success": true
}
```

## 🧪 Testing Scenarios

### Scenario 1: Complete CRUD Workflow

1. **Create** a pricing rule → `POST /pricing/rules`
2. **Read all** rules → `GET /pricing/rules`
3. **Read one** by ID → `GET /pricing/rules/1`
4. **Update** the rule → `PATCH /pricing/rules/1`
5. **Delete** the rule → `DELETE /pricing/rules/1`

### Scenario 2: Price Calculation Flow

1. **Create** pricing rules for different scenarios
2. **Calculate** price for domestic shipment
3. **Calculate** price for international shipment
4. **View** calculation history → `GET /pricing/calculations`
5. **Check** total calculations → `GET /pricing/calculations/count`

### Scenario 3: Pagination Testing

1. Create 15 pricing rules (using POST endpoint 15 times)
2. Get first page → `GET /pricing/rules?page=1&limit=10`
3. Get second page → `GET /pricing/rules?page=2&limit=10`
4. Verify count → `GET /pricing/rules/count` (should be 15)

### Scenario 4: Search Testing

1. Create rules with different names
2. Search → `GET /pricing/rules?search=FedEx`
3. Verify results contain only matching names

## 🔐 Authentication (Future)

**Note**: The following endpoints have `@ApiBearerAuth("JWT-auth")` decorator but authentication is not yet enforced:

- POST `/pricing/rules` (Create)
- PATCH `/pricing/rules/:id` (Update)
- DELETE `/pricing/rules/:id` (Delete)

**To enable authentication**:
1. Login via Auth Service → `POST /auth/login`
2. Copy the JWT token from response
3. Add to Postman:
   - Go to **Authorization** tab
   - Select **Bearer Token**
   - Paste token

## 📊 Response Format

All endpoints follow the standardized response format:

**Success Response**:
```json
{
  "data": { ... },
  "message": "Success",
  "statusCode": 200,
  "timestamp": "2025-10-27T09:21:29.732Z",
  "success": true
}
```

**Error Response**:
```json
{
  "message": "Pricing rule not found",
  "statusCode": 404,
  "error": "Not Found",
  "timestamp": "2025-10-27T09:21:29.732Z",
  "path": "/api/v1/pricing/rules/999"
}
```

## 🐛 Troubleshooting

### Service Not Responding

```bash
# Check if service is running
docker ps | grep pricing

# Check service health
curl http://localhost:3006/api/v1/health

# Check service logs
docker logs pricing-service --tail 50
```

### Database Connection Issues

```bash
# Check database container
docker ps | grep pricing-service-db

# Verify database connection
docker exec pricing-service-db mysql -u pricing_user -ppricing_password -e "SHOW DATABASES;"
```

### Port Already in Use

```bash
# Check what's using port 3006
lsof -i :3006

# Stop the service and restart
docker-compose -f docker-compose.hybrid.yml restart pricing-service
```

## 📈 Performance Testing

### Using Newman (CLI)

```bash
# Install newman
npm install -g newman

# Run entire collection
newman run Pricing-Service.postman_collection.json

# Run with iterations (load testing)
newman run Pricing-Service.postman_collection.json -n 100

# Generate HTML report
newman run Pricing-Service.postman_collection.json --reporters cli,html
```

### Using Postman Runner

1. Click **Runner** button in Postman
2. Select **Pricing Service API** collection
3. Set iterations (e.g., 100)
4. Set delay between requests (e.g., 100ms)
5. Click **Run**

## 📚 Related Documentation

- **API Documentation**: `/pricing-service/README.md`
- **Migration Guide**: `/pricing-service/MIGRATIONS-README.md`
- **Quick Reference**: `/pricing-service/MIGRATION-QUICK-REFERENCE.md`
- **Setup Guide**: `/pricing-service/MIGRATION-SETUP-COMPLETE.md`

## 🔄 Collection Updates

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Oct 27, 2025 | Initial release with 15 endpoints |

### Future Enhancements

- [ ] Add environment variables (dev, staging, prod)
- [ ] Add pre-request scripts for authentication
- [ ] Add test scripts for response validation
- [ ] Add examples for all responses
- [ ] Add negative test cases (400, 404, 500 errors)

## ✅ Quick Validation

Run these to verify collection is working:

```bash
# 1. Health check
curl http://localhost:3006/api/v1/health

# 2. Get pricing rules
curl "http://localhost:3006/api/v1/pricing/rules?page=1&limit=5"

# 3. Get rules count
curl http://localhost:3006/api/v1/pricing/rules/count

# 4. Calculate price
curl -X POST http://localhost:3006/api/v1/pricing/calculate \
  -H "Content-Type: application/json" \
  -d '{"carrierId":1,"serviceType":"Express","weight":5.5,"originCountry":"US","destinationCountry":"US"}'

# 5. Get calculations
curl "http://localhost:3006/api/v1/pricing/calculations?page=1&limit=5"
```

All should return `200 OK` with valid JSON.

---

**Created**: October 27, 2025  
**Maintained by**: Development Team  
**For Support**: Check service logs or contact DevOps
