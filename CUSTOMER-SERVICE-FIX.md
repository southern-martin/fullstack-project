# Customer Service Connection Fix

## Issue
React Admin was showing `ERR_CONNECTION_REFUSED` when trying to access the customer service API at `http://localhost:3004`.

## Root Cause
The customer service was not running. Only the following services were active:
- ✅ Auth service: localhost:3001
- ✅ User service: localhost:3003
- ❌ **Customer service: localhost:3004** (missing)
- ✅ Carrier service: localhost:3005
- ✅ Pricing service: localhost:3006

## Solution
Started the customer service using Docker Compose:

```bash
cd customer-service
docker-compose up -d
```

## Result
- ✅ Customer service now running on localhost:3004
- ✅ Customer API accessible and returning data
- ✅ Database contains 503 seeded customer records
- ✅ React Admin customer page now loads without errors

## Verification
```bash
# Test customer API
curl "http://localhost:3004/api/v1/customers?page=1&limit=10"

# Response includes customer data with proper pagination
{"customers":[...],"total":503}
```

## Services Status (After Fix)
All microservices are now running and healthy:
- ✅ Auth service: localhost:3001
- ✅ User service: localhost:3003
- ✅ Customer service: localhost:3004
- ✅ Carrier service: localhost:3005
- ✅ Pricing service: localhost:3006

Date: 2025-10-13
Status: Resolved
