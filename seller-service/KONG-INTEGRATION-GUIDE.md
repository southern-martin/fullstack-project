# Kong Gateway - Seller Service Integration Testing Guide

## ✅ Kong Gateway Configuration Complete

The seller service has been successfully integrated into Kong Gateway with the following routes:

### Service Configuration
- **Service Name**: `seller-service`
- **Upstream URL**: `http://seller-service:3010`
- **Tags**: `microservice`, `seller`, `marketplace`
- **Kong Gateway URL**: `http://localhost:8000`

---

## 📋 Available Routes

### 1. **Seller Registration** (Authenticated Users)
- **Route**: `POST /api/v1/sellers`
- **Protection**: JWT Authentication
- **Access**: Any authenticated user
- **Purpose**: Register as a seller

**Example Request via Kong**:
```bash
curl -X POST http://localhost:8000/api/v1/sellers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: seller-reg-001" \
  -d '{
    "userId": 123,
    "businessName": "Tech Store",
    "businessType": "LLC",
    "businessEmail": "contact@techstore.com",
    "businessPhone": "+1234567890",
    "businessAddress": "123 Main St",
    "businessCity": "San Francisco",
    "businessState": "CA",
    "businessCountry": "US"
  }'
```

---

### 2. **Get Current User's Seller Account**
- **Route**: `GET /api/v1/sellers/me`
- **Protection**: JWT Authentication
- **Access**: Any authenticated user
- **Purpose**: Get logged-in user's seller account

**Example Request via Kong**:
```bash
curl http://localhost:8000/api/v1/sellers/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Correlation-ID: seller-me-001"
```

---

### 3. **Get Seller by User ID**
- **Route**: `GET /api/v1/sellers/user/{userId}`
- **Protection**: JWT Authentication
- **Access**: Any authenticated user
- **Purpose**: Get seller account by user ID

**Example Request via Kong**:
```bash
curl http://localhost:8000/api/v1/sellers/user/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Correlation-ID": seller-user-001"
```

---

### 4. **Update Seller Profile**
- **Route**: `PATCH /api/v1/sellers/{id}/profile`
- **Protection**: JWT Authentication
- **Access**: Seller owner
- **Purpose**: Update business profile information

**Example Request via Kong**:
```bash
curl -X PATCH http://localhost:8000/api/v1/sellers/1/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: seller-profile-001" \
  -d '{
    "businessName": "Updated Tech Store",
    "businessDescription": "Leading tech retailer"
  }'
```

---

### 5. **Update Banking Information**
- **Route**: `PATCH /api/v1/sellers/{id}/banking`
- **Protection**: JWT Authentication
- **Access**: Seller owner
- **Purpose**: Update banking and tax information

**Example Request via Kong**:
```bash
curl -X PATCH http://localhost:8000/api/v1/sellers/1/banking \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: seller-banking-001" \
  -d '{
    "bankName": "Chase Bank",
    "accountNumber": "****1234",
    "routingNumber": "021000021"
  }'
```

---

### 6. **Submit for Verification**
- **Route**: `POST /api/v1/sellers/{id}/verify`
- **Protection**: JWT Authentication
- **Access**: Seller owner
- **Purpose**: Submit seller account for admin verification

**Example Request via Kong**:
```bash
curl -X POST http://localhost:8000/api/v1/sellers/1/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Correlation-ID: seller-verify-001"
```

---

## 🔐 Admin-Only Routes

The following routes require **admin** or **super_admin** ACL group membership:

### 7. **Get Pending Sellers** (Admin Only)
- **Route**: `GET /api/v1/sellers/pending-verification`
- **Protection**: JWT + ACL (admin, super_admin)
- **Purpose**: List all sellers awaiting verification

**Example Request via Kong**:
```bash
curl http://localhost:8000/api/v1/sellers/pending-verification \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "X-Correlation-ID: seller-pending-001"
```

---

### 8. **Approve Seller** (Admin Only)
- **Route**: `POST /api/v1/sellers/{id}/approve`
- **Protection**: JWT + ACL (admin, super_admin)
- **Purpose**: Approve a pending seller

**Example Request via Kong**:
```bash
curl -X POST http://localhost:8000/api/v1/sellers/1/approve \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: seller-approve-001" \
  -d '{
    "approvedBy": 1,
    "notes": "Verified business documentation"
  }'
```

---

### 9. **Reject Seller** (Admin Only)
- **Route**: `POST /api/v1/sellers/{id}/reject`
- **Protection**: JWT + ACL (admin, super_admin)
- **Purpose**: Reject a pending seller

**Example Request via Kong**:
```bash
curl -X POST http://localhost:8000/api/v1/sellers/1/reject \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: seller-reject-001" \
  -d '{
    "reason": "Incomplete business documentation"
  }'
```

---

### 10. **Suspend Seller** (Admin Only)
- **Route**: `POST /api/v1/sellers/{id}/suspend`
- **Protection**: JWT + ACL (admin, super_admin)
- **Purpose**: Suspend an active seller

**Example Request via Kong**:
```bash
curl -X POST http://localhost:8000/api/v1/sellers/1/suspend \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: seller-suspend-001" \
  -d '{
    "reason": "Policy violation - selling prohibited items"
  }'
```

---

### 11. **Reactivate Seller** (Admin Only)
- **Route**: `POST /api/v1/sellers/{id}/reactivate`
- **Protection**: JWT + ACL (admin, super_admin)
- **Purpose**: Reactivate a suspended seller

**Example Request via Kong**:
```bash
curl -X POST http://localhost:8000/api/v1/sellers/1/reactivate \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "X-Correlation-ID: seller-reactivate-001"
```

---

### 12. **Delete Seller** (Admin Only)
- **Route**: `DELETE /api/v1/sellers/{id}`
- **Protection**: JWT + ACL (admin, super_admin)
- **Purpose**: Delete a seller account (only if no products/sales)

**Example Request via Kong**:
```bash
curl -X DELETE http://localhost:8000/api/v1/sellers/1 \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "X-Correlation-ID: seller-delete-001"
```

---

## 🔍 Correlation ID Tracking

All requests through Kong Gateway support correlation ID tracking:

1. **Automatic Generation**: If no `X-Correlation-ID` header is provided, Kong generates one
2. **Winston Logging**: Seller service logs include the correlation ID from Kong
3. **Distributed Tracing**: Track requests across services using the same correlation ID

**Example with Correlation ID**:
```bash
curl http://localhost:8000/api/v1/sellers/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Correlation-ID: my-custom-trace-id-123"
```

**Seller Service Log Output**:
```json
{
  "level": "info",
  "message": "Event: seller_registered",
  "service": "seller-service",
  "timestamp": "2025-10-30 14:00:00.000",
  "metadata": {
    "correlationId": "my-custom-trace-id-123",
    "eventName": "seller_registered",
    "eventData": {
      "sellerId": 1,
      "userId": 123,
      "businessName": "Tech Store"
    }
  }
}
```

---

## 🧪 Testing Workflow

### Step 1: Get JWT Token
```bash
# Login as regular user
TOKEN=$(curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.access_token')

# Login as admin
ADMIN_TOKEN=$(curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}' \
  | jq -r '.access_token')
```

### Step 2: Register as Seller
```bash
curl -X POST http://localhost:8000/api/v1/sellers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: test-reg-001" \
  -d '{
    "userId": 123,
    "businessName": "My Store",
    "businessType": "LLC",
    "businessEmail": "store@example.com",
    "businessPhone": "+1234567890",
    "businessAddress": "123 Main St",
    "businessCity": "San Francisco",
    "businessState": "CA",
    "businessCountry": "US"
  }' | jq
```

### Step 3: Submit for Verification
```bash
SELLER_ID=1
curl -X POST http://localhost:8000/api/v1/sellers/$SELLER_ID/verify \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Correlation-ID: test-verify-001" | jq
```

### Step 4: Admin Approves Seller
```bash
curl -X POST http://localhost:8000/api/v1/sellers/$SELLER_ID/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: test-approve-001" \
  -d '{
    "approvedBy": 1,
    "notes": "Verified documentation"
  }' | jq
```

### Step 5: Verify Correlation ID in Logs
```bash
# Check seller service logs for correlation ID "test-approve-001"
docker logs seller-service 2>&1 | grep "test-approve-001"
```

---

## 🛡️ Security Features

### JWT Authentication
- All routes require valid JWT token
- Token must contain `sub` claim (user ID)
- Issued by auth-service

### ACL (Access Control Lists)
- Admin-only routes protected by ACL plugin
- Requires user to be in `admin` or `super_admin` group
- Returns `403 Forbidden` for unauthorized users

### Rate Limiting
- Global rate limiting: 100 requests/minute, 1000 requests/hour
- Prevents API abuse
- Applied automatically by Kong

### CORS
- Configured for React frontend (`http://localhost:3000`)
- Credentials enabled for cookie-based auth
- Max age: 3600 seconds

---

## 📊 Kong Admin Verification

### View All Seller Routes
```bash
curl -s http://localhost:8001/services/seller-service/routes \
  | jq -r '.data[] | "\(.name): \(.methods[]) \(.paths[])"'
```

### Check Route Plugins
```bash
# Check JWT plugin
curl -s http://localhost:8001/routes/sellers-register/plugins \
  | jq '.data[] | {name: .name, route: .route.name}'

# Check ACL plugin (admin routes)
curl -s http://localhost:8001/routes/sellers-approve/plugins \
  | jq '.data[] | {name: .name, config: .config}'
```

### View Service Health
```bash
curl -s http://localhost:8001/services/seller-service \
  | jq '{name: .name, host: .host, port: .port, tags: .tags}'
```

---

## 🚀 Next Steps

1. **Start Seller Service in Docker**:
   ```bash
   cd /opt/cursor-project/fullstack-project/seller-service
   docker-compose up -d
   ```

2. **Test Routes Through Kong**:
   Use the examples above to test each endpoint

3. **Monitor Winston Logs**:
   ```bash
   docker logs -f seller-service
   ```

4. **View Kong Analytics**:
   - Open Konga: http://localhost:1337
   - Navigate to Services → seller-service
   - View traffic, routes, and plugins

5. **Test Grafana Integration**:
   - Open Grafana: http://localhost:3100
   - Query logs by correlation ID
   - Monitor seller service metrics

---

## ✅ Configuration Complete!

All 11 seller service routes are now accessible through Kong Gateway at `http://localhost:8000` with proper JWT authentication and ACL protection for admin routes.
