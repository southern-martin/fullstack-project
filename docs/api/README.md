# 📡 API Documentation

Comprehensive API documentation for all microservices in the fullstack application.

## 🎯 **API Overview**

### **Base URLs**
- **Auth Service**: `http://localhost:3001/api/v1`
- **User Service**: `http://localhost:3003/api/v1`
- **Carrier Service**: `http://localhost:3004/api/v1`
- **Customer Service**: `http://localhost:3005/api/v1`
- **Pricing Service**: `http://localhost:3006/api/v1`
- **Translation Service**: `http://localhost:3007/api/v1`

### **Authentication**
All API endpoints (except login/register) require JWT authentication:
```http
Authorization: Bearer <jwt_token>
```

### **Response Format**
All APIs return JSON responses with consistent format:
```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔐 **Auth Service API**

### **Base URL**: `http://localhost:3001/api/v1/auth`

#### **POST /login**
User login endpoint.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "roles": ["admin"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  },
  "message": "Login successful"
}
```

#### **POST /register**
User registration endpoint.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["user"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  },
  "message": "Registration successful"
}
```

#### **GET /profile**
Get current user profile.

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "phone": null,
    "isActive": true,
    "isEmailVerified": true,
    "roles": [
      {
        "id": 1,
        "name": "admin",
        "description": "Administrator with full access"
      }
    ],
    "lastLoginAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### **POST /refresh**
Refresh JWT token.

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

#### **GET /health**
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "version": "1.0.0"
}
```

## 👥 **User Service API**

### **Base URL**: `http://localhost:3003/api/v1/users`

#### **GET /users**
Get list of users with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term
- `role` (optional): Filter by role
- `isActive` (optional): Filter by active status

**Example:**
```http
GET /users?page=1&limit=10&search=admin&role=admin&isActive=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "admin@example.com",
        "firstName": "Admin",
        "lastName": "User",
        "phone": null,
        "isActive": true,
        "isEmailVerified": true,
        "roles": ["admin"],
        "lastLoginAt": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### **POST /users**
Create a new user.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "roleIds": [2]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1234567890",
    "isActive": true,
    "isEmailVerified": false,
    "roles": [
      {
        "id": 2,
        "name": "user",
        "description": "Regular user with basic access"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully"
}
```

#### **GET /users/:id**
Get user by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "phone": null,
    "isActive": true,
    "isEmailVerified": true,
    "roles": [
      {
        "id": 1,
        "name": "admin",
        "description": "Administrator with full access"
      }
    ],
    "lastLoginAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### **PUT /users/:id**
Update user by ID.

**Request:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "phone": "+1234567890",
  "isActive": true,
  "roleIds": [1, 2]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "firstName": "Updated",
    "lastName": "Name",
    "phone": "+1234567890",
    "isActive": true,
    "isEmailVerified": true,
    "roles": [
      {
        "id": 1,
        "name": "admin",
        "description": "Administrator with full access"
      },
      {
        "id": 2,
        "name": "user",
        "description": "Regular user with basic access"
      }
    ],
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User updated successfully"
}
```

#### **DELETE /users/:id**
Delete user by ID.

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### **GET /users/roles**
Get all available roles.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "admin",
      "description": "Administrator with full access",
      "permissions": ["*"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "user",
      "description": "Regular user with basic access",
      "permissions": ["read:own", "update:own"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🚚 **Carrier Service API**

### **Base URL**: `http://localhost:3004/api/v1/carriers`

#### **GET /carriers**
Get list of carriers.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "FedEx",
      "code": "FEDEX",
      "contactEmail": "contact@fedex.com",
      "contactPhone": "+1-800-463-3339",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### **POST /carriers**
Create a new carrier.

**Request:**
```json
{
  "name": "UPS",
  "code": "UPS",
  "contactEmail": "contact@ups.com",
  "contactPhone": "+1-800-742-5877"
}
```

#### **GET /carriers/:id**
Get carrier by ID.

#### **PUT /carriers/:id**
Update carrier by ID.

#### **DELETE /carriers/:id**
Delete carrier by ID.

## 🏢 **Customer Service API**

### **Base URL**: `http://localhost:3005/api/v1/customers`

#### **GET /customers**
Get list of customers.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      "phone": "+1-555-0123",
      "address": "123 Business St, City, State 12345",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### **POST /customers**
Create a new customer.

#### **GET /customers/:id**
Get customer by ID.

#### **PUT /customers/:id**
Update customer by ID.

#### **DELETE /customers/:id**
Delete customer by ID.

## 💰 **Pricing Service API**

### **Base URL**: `http://localhost:3006/api/v1/pricing`

#### **POST /calculate**
Calculate pricing for a shipment.

**Request:**
```json
{
  "origin": "New York, NY",
  "destination": "Los Angeles, CA",
  "weight": 10.5,
  "dimensions": {
    "length": 12,
    "width": 8,
    "height": 6
  },
  "carrierId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "carrier": "FedEx",
    "service": "Ground",
    "estimatedCost": 25.50,
    "estimatedDays": 3,
    "currency": "USD"
  }
}
```

## 🌐 **Translation Service API**

### **Base URL**: `http://localhost:3007/api/v1/translations`

#### **GET /languages**
Get available languages.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "en",
      "name": "English",
      "isActive": true
    },
    {
      "id": 2,
      "code": "fr",
      "name": "French",
      "isActive": true
    }
  ]
}
```

#### **GET /translations**
Get translations for a specific language.

**Query Parameters:**
- `language`: Language code (e.g., 'en', 'fr')

**Response:**
```json
{
  "success": true,
  "data": {
    "language": "en",
    "translations": {
      "nav.dashboard": "Dashboard",
      "nav.users": "Users",
      "nav.carriers": "Carriers",
      "user.first_name": "First Name",
      "user.last_name": "Last Name"
    }
  }
}
```

#### **POST /translations**
Create or update translations.

**Request:**
```json
{
  "language": "fr",
  "key": "nav.dashboard",
  "value": "Tableau de bord"
}
```

## 📊 **Error Handling**

### **Error Response Format**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Common Error Codes**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

## 🔧 **Testing APIs**

### **Using cURL**
```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get users (with token)
curl -X GET http://localhost:3003/api/v1/users \
  -H "Authorization: Bearer <jwt_token>"
```

### **Using Postman**
Import the Postman collection from `docs/api/postman-collection.json` for comprehensive API testing.

### **Health Checks**
```bash
# Check all services
curl http://localhost:3001/api/v1/auth/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
curl http://localhost:3006/health
curl http://localhost:3007/health
```

## 📋 **Rate Limiting**

All APIs implement rate limiting:
- **Auth endpoints**: 5 requests per minute
- **User endpoints**: 100 requests per minute
- **Other endpoints**: 1000 requests per minute

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

---

**This API documentation provides comprehensive coverage of all microservice endpoints with examples and error handling information.**