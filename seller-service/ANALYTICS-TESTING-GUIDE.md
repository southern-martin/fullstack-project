# Seller Service Analytics Testing Guide

## 📊 Analytics Endpoints Overview

The Seller Service provides comprehensive analytics endpoints to track seller performance metrics, sales trends, product performance, and revenue breakdowns.

## 🔗 Analytics Endpoints

### 1. Analytics Overview
**Endpoint:** `GET /api/v1/sellers/:id/analytics/overview`  
**Auth:** Owner or Admin  
**Purpose:** Comprehensive performance metrics for a seller account

**Query Parameters:**
- `period` (optional): `day` | `week` | `month` | `year` | `all_time` (default: `all_time`)
- `startDate` (optional): Custom start date (ISO 8601)
- `endDate` (optional): Custom end date (ISO 8601)

**Response:**
```json
{
  "sellerId": 1,
  "businessName": "Tech Store",
  "status": "ACTIVE",
  "verificationStatus": "VERIFIED",
  "totalProducts": 50,
  "totalSales": 1000,
  "totalRevenue": 50000,
  "rating": 4.5,
  "totalReviews": 250,
  "joinedDate": "2023-01-01T00:00:00.000Z",
  "verifiedAt": "2023-02-01T00:00:00.000Z",
  "period": "month",
  "periodStart": "2024-09-30T00:00:00.000Z",
  "periodEnd": "2024-10-30T00:00:00.000Z",
  "periodRevenue": 50000,
  "periodSales": 1000,
  "averageOrderValue": 50.00,
  "conversionRate": 10.00
}
```

### 2. Sales Trend
**Endpoint:** `GET /api/v1/sellers/:id/analytics/sales-trend`  
**Auth:** Owner or Admin  
**Purpose:** Time-series data showing sales performance over time

**Query Parameters:**
- `period` (optional): `day` | `week` | `month` | `year` (default: `month`)
- `startDate` (optional): Custom start date
- `endDate` (optional): Custom end date

**Response:**
```json
[
  {
    "date": "2024-10-01",
    "sales": 35,
    "revenue": 1750.50,
    "orders": 35,
    "averageOrderValue": 50.01
  },
  {
    "date": "2024-10-02",
    "sales": 42,
    "revenue": 2100.00,
    "orders": 42,
    "averageOrderValue": 50.00
  }
]
```

### 3. Product Performance
**Endpoint:** `GET /api/v1/sellers/:id/analytics/products`  
**Auth:** Owner or Admin  
**Purpose:** Insights about seller's product catalog and performance

**Response:**
```json
{
  "totalProducts": 50,
  "activeProducts": 42,
  "outOfStockProducts": 8,
  "topProducts": [
    {
      "productId": 1001,
      "productName": "Product 1",
      "unitsSold": 95,
      "revenue": 9500.00,
      "rating": 4.8,
      "reviewCount": 42
    }
  ],
  "averageRating": 4.5,
  "totalViews": 10000,
  "newProductsThisPeriod": 5
}
```

### 4. Revenue Breakdown
**Endpoint:** `GET /api/v1/sellers/:id/analytics/revenue`  
**Auth:** Owner or Admin  
**Purpose:** Detailed revenue analysis and breakdown

**Query Parameters:**
- `period` (optional): `day` | `week` | `month` | `year` (default: `month`)

**Response:**
```json
{
  "totalRevenue": 50000.00,
  "completedRevenue": 47500.00,
  "pendingRevenue": 2500.00,
  "refundedAmount": 1000.00,
  "averageOrderValue": 50.00,
  "highestOrderValue": 250.00,
  "lowestOrderValue": 10.00,
  "revenueByCategory": {
    "Electronics": 20000.00,
    "Clothing": 15000.00,
    "Home & Garden": 10000.00,
    "Other": 5000.00
  }
}
```

## 🧪 Testing Examples

### Prerequisites
```bash
# 1. Get JWT token (login as seller owner)
TOKEN=$(curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@example.com",
    "password": "Password123!"
  }' | jq -r '.accessToken')

# 2. Get seller ID
SELLER_ID=1
```

### Test 1: Get Analytics Overview (All Time)
```bash
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/overview" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Correlation-ID: test-analytics-001" \
  | jq
```

### Test 2: Get Analytics for Specific Period
```bash
# Last month
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/overview?period=month" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Correlation-ID: test-analytics-002" \
  | jq

# Last week
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/overview?period=week" \
  -H "Authorization: Bearer $TOKEN" \
  | jq

# Last day
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/overview?period=day" \
  -H "Authorization: Bearer $TOKEN" \
  | jq
```

### Test 3: Get Analytics with Custom Date Range
```bash
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/overview?startDate=2024-01-01T00:00:00.000Z&endDate=2024-12-31T23:59:59.999Z" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Correlation-ID: test-analytics-003" \
  | jq
```

### Test 4: Get Sales Trend (Monthly)
```bash
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/sales-trend?period=month" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Correlation-ID: test-analytics-004" \
  | jq
```

### Test 5: Get Sales Trend (Weekly)
```bash
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/sales-trend?period=week" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Correlation-ID: test-analytics-005" \
  | jq
```

### Test 6: Get Product Performance
```bash
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Correlation-ID: test-analytics-006" \
  | jq
```

### Test 7: Get Revenue Breakdown
```bash
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/revenue?period=month" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Correlation-ID: test-analytics-007" \
  | jq
```

### Test 8: Admin Access (Different Seller)
```bash
# Login as admin
ADMIN_TOKEN=$(curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }' | jq -r '.accessToken')

# Get analytics for any seller
curl -X GET "http://localhost:8000/api/v1/sellers/1/analytics/overview" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "X-Correlation-ID: test-analytics-admin-001" \
  | jq
```

## 🔒 Authorization

All analytics endpoints use the `SellerOwnerGuard`:
- ✅ **Seller Owner**: Can view their own analytics
- ✅ **Admin/Super Admin**: Can view any seller's analytics
- ❌ **Other Users**: 403 Forbidden

## 📈 Use Cases

### Business Owner Dashboard
```bash
# Get overview metrics
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/overview?period=month" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get daily sales trend
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/sales-trend?period=day" \
  -H "Authorization: Bearer $TOKEN" | jq

# Check product performance
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/products" \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Admin Monitoring
```bash
# Review seller performance
curl -X GET "http://localhost:8000/api/v1/sellers/1/analytics/overview?period=year" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq

# Compare multiple sellers
for seller_id in 1 2 3; do
  echo "Seller $seller_id:"
  curl -s -X GET "http://localhost:8000/api/v1/sellers/${seller_id}/analytics/overview?period=month" \
    -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.totalRevenue, .totalSales'
done
```

### Revenue Analysis
```bash
# Get detailed revenue breakdown
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/revenue?period=year" \
  -H "Authorization: Bearer $TOKEN" | jq

# Track revenue trend over time
curl -X GET "http://localhost:8000/api/v1/sellers/${SELLER_ID}/analytics/sales-trend?period=year" \
  -H "Authorization: Bearer $TOKEN" | jq '[.[] | {date, revenue}]'
```

## 🧪 Test Data Notes

**Current Implementation:**
- Analytics use seller's aggregate fields (`totalProducts`, `totalSales`, `totalRevenue`, etc.)
- Sales trend data is generated with realistic variance based on seller's totals
- Top products are mock data (5 products with random metrics)
- Revenue breakdown includes mock category distribution

**Production Implementation:**
- Would query actual sales/orders table grouped by date
- Would aggregate real product performance data
- Would calculate actual revenue by category
- Would include real-time metrics

## 🔗 Kong Gateway Routes

Add analytics routes to Kong Gateway:

```bash
# Analytics Overview Route
curl -X POST http://localhost:8001/services/seller-service/routes \
  -d 'name=sellers-analytics-overview' \
  -d 'paths[]=/api/v1/sellers/[0-9]+/analytics/overview' \
  -d 'methods[]=GET' \
  -d 'strip_path=false'

# Sales Trend Route
curl -X POST http://localhost:8001/services/seller-service/routes \
  -d 'name=sellers-analytics-trend' \
  -d 'paths[]=/api/v1/sellers/[0-9]+/analytics/sales-trend' \
  -d 'methods[]=GET' \
  -d 'strip_path=false'

# Product Performance Route
curl -X POST http://localhost:8001/services/seller-service/routes \
  -d 'name=sellers-analytics-products' \
  -d 'paths[]=/api/v1/sellers/[0-9]+/analytics/products' \
  -d 'methods[]=GET' \
  -d 'strip_path=false'

# Revenue Breakdown Route
curl -X POST http://localhost:8001/services/seller-service/routes \
  -d 'name=sellers-analytics-revenue' \
  -d 'paths[]=/api/v1/sellers/[0-9]+/analytics/revenue' \
  -d 'methods[]=GET' \
  -d 'strip_path=false'
```

## 📊 Expected Test Results

### Successful Response (200 OK)
- Seller owner accessing their analytics
- Admin accessing any seller's analytics
- Valid period parameter
- Valid date range

### Error Responses

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Seller with id 999 not found"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "statusCode": 403,
  "message": "Forbidden: You can only access your own seller analytics"
}
```

## 🎯 Next Steps

1. ✅ **Created** Analytics DTOs
2. ✅ **Implemented** Analytics service methods
3. ✅ **Added** Analytics controller endpoints
4. ✅ **Written** 17 comprehensive tests (all passing)
5. ⏳ **Add** Kong Gateway routes for analytics endpoints
6. ⏳ **Test** Analytics endpoints through Kong
7. ⏳ **Document** in main README
8. ⏳ **Create** Postman collection for analytics

## 📝 Coverage Summary

**New Tests Added:** 17 tests
- `getSellerAnalytics`: 7 tests
- `getSalesTrend`: 5 tests
- `getProductPerformance`: 3 tests
- `getRevenueBreakdown`: 2 tests

**Total Tests:** 78 tests (all passing ✅)

**New Endpoints:** 4 endpoints
- Analytics Overview
- Sales Trend
- Product Performance
- Revenue Breakdown

**Authentication:** SellerOwnerGuard on all endpoints
**Logging:** Winston structured logging for all operations
