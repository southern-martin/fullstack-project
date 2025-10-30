# Seller Service API Documentation

**Version**: 1.0  
**Base URL**: `http://localhost:3010/api/v1`  
**Authentication**: JWT Bearer Token (required for all endpoints except health check)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Health Check](#health-check)
3. [Seller Registration](#seller-registration)
4. [Seller Queries](#seller-queries)
5. [Seller Updates](#seller-updates)
6. [Verification Workflow](#verification-workflow)
7. [Admin Actions](#admin-actions)
8. [Error Responses](#error-responses)

---

## Authentication

All endpoints (except health check) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **seller**: Can manage own seller account
- **admin**: Can manage all sellers and perform admin actions

---

## Health Check

### GET /health

Check service health status.

**Auth**: None required

**Response** (200 OK):
```json
{
  "status": "ok",
  "service": "seller-service",
  "timestamp": "2025-10-30T12:00:00.000Z",
  "uptime": 12345
}
```

---

## Seller Registration

### POST /sellers

Register a new seller account for the authenticated user.

**Auth**: Required (any authenticated user)

**Request Body**:
```json
{
  "businessName": "Tech Solutions LLC",
  "businessType": "llc",
  "businessEmail": "contact@techsolutions.com",
  "businessPhone": "+1234567890",
  "taxId": "12-3456789",
  "businessAddress": "123 Main St",
  "businessCity": "San Francisco",
  "businessState": "CA",
  "businessCountry": "US",
  "businessPostalCode": "94102",
  "description": "Leading technology solutions provider",
  "website": "https://techsolutions.com",
  "logoUrl": "https://techsolutions.com/logo.png"
}
```

**Field Validations**:
- `businessName`: Required, 2-255 characters
- `businessType`: Optional, enum: `individual`, `sole_proprietor`, `llc`, `corporation`, `partnership`
- `businessEmail`: Optional, valid email format
- `businessPhone`: Optional, valid phone format (regex: `^\+?[1-9]\d{1,14}$`)
- `taxId`: Optional, 5-100 characters
- Address fields: Optional
- `logoUrl`, `website`: Optional, valid URL format
- `description`: Optional, max 2000 characters

**Response** (201 Created):
```json
{
  "data": {
    "id": 1,
    "userId": 100,
    "businessName": "Tech Solutions LLC",
    "businessType": "llc",
    "businessEmail": "contact@techsolutions.com",
    "businessPhone": "+1234567890",
    "status": "pending",
    "verificationStatus": "unverified",
    "rating": 0,
    "totalReviews": 0,
    "totalProducts": 0,
    "totalSales": 0,
    "totalRevenue": 0,
    "createdAt": "2025-10-30T12:00:00.000Z",
    "updatedAt": "2025-10-30T12:00:00.000Z"
  }
}
```

**Errors**:
- `409 Conflict`: User already has a seller account
- `400 Bad Request`: Validation errors

---

## Seller Queries

### GET /sellers/me

Get the authenticated user's seller account.

**Auth**: Required

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "userId": 100,
    "businessName": "Tech Solutions LLC",
    ...
  }
}
```

**Errors**:
- `404 Not Found`: Seller not found for user

---

### GET /sellers/:id

Get seller by ID.

**Auth**: Required (owner or admin)

**URL Parameters**:
- `id`: Seller ID (integer)

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "userId": 100,
    "businessName": "Tech Solutions LLC",
    ...
  }
}
```

**Errors**:
- `404 Not Found`: Seller not found
- `403 Forbidden`: Not authorized to view this seller

---

### GET /sellers/user/:userId

Get seller by user ID.

**Auth**: Required (owner or admin)

**URL Parameters**:
- `userId`: User ID (integer)

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "userId": 100,
    ...
  }
}
```

---

### GET /sellers

Get all sellers with filters (admin only).

**Auth**: Required (admin role)

**Query Parameters**:
- `status`: Filter by status (`pending`, `active`, `suspended`, `rejected`)
- `verificationStatus`: Filter by verification (`unverified`, `pending`, `verified`, `rejected`)
- `minRating`: Minimum rating (0-5)
- `search`: Search in business name and email
- `limit`: Results per page (1-100, default: 10)
- `offset`: Pagination offset (default: 0)
- `sortBy`: Sort field (default: `createdAt`)
- `sortOrder`: Sort order (`ASC`, `DESC`, default: `DESC`)

**Example**:
```
GET /sellers?status=active&verificationStatus=verified&minRating=4&limit=20&offset=0
```

**Response** (200 OK):
```json
{
  "data": {
    "sellers": [
      {
        "id": 1,
        "userId": 100,
        "businessName": "Tech Solutions LLC",
        ...
      }
    ],
    "total": 1
  }
}
```

---

### GET /sellers/pending-verification

Get sellers pending verification (admin only).

**Auth**: Required (admin role)

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "userId": 100,
      "businessName": "Tech Solutions LLC",
      "verificationStatus": "pending",
      ...
    }
  ]
}
```

---

## Seller Updates

### PATCH /sellers/:id/profile

Update seller profile (owner only).

**Auth**: Required (owner)

**URL Parameters**:
- `id`: Seller ID

**Request Body**:
```json
{
  "logoUrl": "https://example.com/new-logo.png",
  "description": "Updated description",
  "website": "https://www.example.com",
  "businessEmail": "support@example.com",
  "businessPhone": "+1234567891"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "logoUrl": "https://example.com/new-logo.png",
    ...
  }
}
```

**Errors**:
- `400 Bad Request`: Cannot update while suspended
- `403 Forbidden`: Not seller owner

---

### PATCH /sellers/:id/banking

Update banking information (owner only).

**Auth**: Required (owner)

**Request Body**:
```json
{
  "bankName": "Chase Bank",
  "bankAccountHolder": "Tech Solutions LLC",
  "bankAccountNumber": "123456789012",
  "bankRoutingNumber": "021000021",
  "paymentMethod": "bank_transfer"
}
```

**Field Validations**:
- `paymentMethod`: enum: `bank_transfer`, `paypal`, `stripe`

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "bankName": "Chase Bank",
    ...
  }
}
```

**Security Note**: Banking numbers are excluded from normal responses for security.

---

### PATCH /sellers/:id

Admin update seller (admin only).

**Auth**: Required (admin role)

**Request Body**:
```json
{
  "commissionRate": 12.5,
  "description": "Premium seller - reduced commission"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "commissionRate": 12.5,
    ...
  }
}
```

---

## Verification Workflow

### POST /sellers/:id/verify

Submit seller for verification (owner only).

**Auth**: Required (owner)

**Prerequisites**:
- Business name, email, phone must be filled
- Complete business address required
- Verification status must be `unverified` or `rejected`

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "verificationStatus": "pending",
    ...
  }
}
```

**Errors**:
- `400 Bad Request`: Missing required fields or already pending/verified

---

### POST /sellers/:id/approve

Approve seller verification (admin only).

**Auth**: Required (admin role)

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "status": "active",
    "verificationStatus": "verified",
    "verifiedAt": "2025-10-30T12:00:00.000Z",
    "verifiedBy": 200,
    ...
  }
}
```

**State Changes**:
- `verificationStatus`: `pending` → `verified`
- `status`: `pending` → `active`

---

### POST /sellers/:id/reject

Reject seller verification (admin only).

**Auth**: Required (admin role)

**Request Body**:
```json
{
  "reason": "Incomplete business documentation"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "status": "rejected",
    "verificationStatus": "rejected",
    "rejectionReason": "Incomplete business documentation",
    ...
  }
}
```

**Errors**:
- `400 Bad Request`: Rejection reason required

---

## Admin Actions

### POST /sellers/:id/suspend

Suspend seller account (admin only).

**Auth**: Required (admin role)

**Request Body**:
```json
{
  "reason": "Multiple customer complaints"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "status": "suspended",
    "suspensionReason": "Multiple customer complaints",
    ...
  }
}
```

**Effects**:
- Seller cannot update profile or banking
- Seller cannot perform marketplace actions

---

### POST /sellers/:id/reactivate

Reactivate suspended seller (admin only).

**Auth**: Required (admin role)

**Prerequisites**:
- Seller must be suspended
- Seller must be verified

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "status": "active",
    "suspensionReason": null,
    ...
  }
}
```

---

### DELETE /sellers/:id

Delete seller account (admin only).

**Auth**: Required (admin role)

**Prerequisites**:
- Seller must have zero products
- Seller must have zero sales

**Response** (204 No Content)

**Errors**:
- `400 Bad Request`: Cannot delete seller with products or sales history

---

## Error Responses

### Standard Error Format

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Common Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `204 No Content`: Successful deletion
- `400 Bad Request`: Validation error or business rule violation
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists

### Example Error Responses

**Validation Error** (400):
```json
{
  "statusCode": 400,
  "message": [
    "businessName must be longer than or equal to 2 characters",
    "businessEmail must be an email"
  ],
  "error": "Bad Request"
}
```

**Forbidden** (403):
```json
{
  "statusCode": 403,
  "message": "Access denied. Required role(s): admin",
  "error": "Forbidden"
}
```

**Not Found** (404):
```json
{
  "statusCode": 404,
  "message": "Seller with id 999 not found",
  "error": "Not Found"
}
```

---

## State Machine Diagram

```
Registration
    ↓
PENDING (unverified)
    ↓
Submit for Verification
    ↓
PENDING (pending verification)
    ↓
    ├─→ APPROVE → ACTIVE (verified)
    │                ↓
    │         SUSPEND → SUSPENDED
    │                ↓
    │         REACTIVATE → ACTIVE
    └─→ REJECT → REJECTED
```

---

## Testing with Postman

1. Import `Seller-Service-API.postman_collection.json`
2. Import `Seller-Service.postman_environment.json`
3. Set `token` variable with your JWT token
4. Run requests in order:
   - Health Check
   - Register Seller
   - Get My Seller Account
   - Update Profile
   - Submit for Verification
   - (Admin) Approve Seller

---

## Rate Limiting

(To be implemented in Day 4)

---

## Caching

(To be implemented in Day 4 with Redis)

---

**Last Updated**: October 30, 2025  
**Service Version**: 1.0.0  
**API Version**: v1
