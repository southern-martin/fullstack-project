# 📮 Postman Collection - Fullstack Project API

This Postman collection provides comprehensive testing capabilities for the Fullstack Project API, including all microservices and endpoints.

## 🚀 Quick Start

### 1. Import Files
1. Import `Fullstack-Project-API.postman_collection.json` into Postman
2. Import `Fullstack-Project-Environment.postman_environment.json` into Postman
3. Select the "Fullstack Project Environment" in Postman

### 2. Start the Mock Server
```bash
cd /opt/cursor-project/fullstack-project
node comprehensive-mock-server.js
```

### 3. Test Authentication
1. Run "Login - Admin" request to get an access token
2. The token will be automatically saved to the environment
3. All subsequent requests will use this token

## 🔐 Available Test Users

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| `admin@example.com` | `Admin123` or `admin123` | admin | Full access administrator |
| `test@gmail.com` | `Admin123` | user | Standard test user |
| `test1@gmail.com` | `Admin123` | user | Additional test user |
| `user@example.com` | `Admin123` | user | Regular user account |

## 📋 Service Endpoints

### 🔐 Auth Service (`/api/v1/auth/*`)
- **Health Check**: `GET /api/v1/auth/health`
- **Login**: `POST /api/v1/auth/login`
- **Get Profile**: `GET /api/v1/auth/profile`

### 👥 User Service (`/api/v1/users/*`)
- **Get All Users**: `GET /api/v1/users`
- **Get User Count**: `GET /api/v1/users/count`
- **Get User by ID**: `GET /api/v1/users/{id}`
- **Create User**: `POST /api/v1/users`
- **Update User**: `PATCH /api/v1/users/{id}`
- **Delete User**: `DELETE /api/v1/users/{id}`

### 🚚 Carrier Service (`/api/v1/carriers/*`)
- **Get All Carriers**: `GET /api/v1/carriers`
- **Get Carrier by ID**: `GET /api/v1/carriers/{id}`
- **Create Carrier**: `POST /api/v1/carriers`
- **Update Carrier**: `PATCH /api/v1/carriers/{id}`
- **Delete Carrier**: `DELETE /api/v1/carriers/{id}`

### 🏢 Customer Service (`/api/v1/customers/*`)
- **Get All Customers**: `GET /api/v1/customers`
- **Get Customer by ID**: `GET /api/v1/customers/{id}`
- **Create Customer**: `POST /api/v1/customers`
- **Update Customer**: `PATCH /api/v1/customers/{id}`
- **Delete Customer**: `DELETE /api/v1/customers/{id}`

### 💰 Pricing Service (`/api/v1/pricing/*`)
- **Get All Pricing Rules**: `GET /api/v1/pricing`
- **Get Pricing Rule by ID**: `GET /api/v1/pricing/{id}`
- **Create Pricing Rule**: `POST /api/v1/pricing`
- **Update Pricing Rule**: `PATCH /api/v1/pricing/{id}`
- **Delete Pricing Rule**: `DELETE /api/v1/pricing/{id}`

### 🌐 Translation Service (`/api/v1/translations/*`)
- **Get All Translations**: `GET /api/v1/translations`
- **Get Translation by ID**: `GET /api/v1/translations/{id}`
- **Create Translation**: `POST /api/v1/translations`
- **Update Translation**: `PATCH /api/v1/translations/{id}`
- **Delete Translation**: `DELETE /api/v1/translations/{id}`

### ❤️ Health Check (`/health`)
- **General Health Check**: `GET /health`

## 🔧 Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `base_url` | API base URL | `http://localhost:3001` |
| `access_token` | JWT access token (auto-set) | `mock-jwt-token-1234567890` |
| `user_id` | Current user ID (auto-set) | `1` |
| `user_email` | Current user email (auto-set) | `admin@example.com` |
| `new_user_id` | ID of newly created user (auto-set) | `5` |

## 🎯 Testing Workflow

### 1. Authentication Flow
```
1. Run "Health Check" to verify server is running
2. Run "Login - Admin" to authenticate
3. Token is automatically saved to environment
4. All subsequent requests use the token
```

### 2. User Management Flow
```
1. Run "Get All Users" to see existing users
2. Run "Get User Count" to check total count
3. Run "Create New User" to add a user
4. Run "Get User by ID" with the new user ID
5. Run "Update User" to modify user data
6. Run "Delete User" to remove the user
```

### 3. CRUD Operations Flow
```
For each service (Carriers, Customers, Pricing, Translations):
1. GET all items
2. GET specific item by ID
3. POST create new item
4. PATCH update existing item
5. DELETE remove item
```

## 🚨 Important Notes

### Mock Server Behavior
- **User Creation**: New users get password `Admin123` by default
- **Authentication**: All users can login with `Admin123` (demo purposes)
- **Data Persistence**: Data is stored in memory and resets when server restarts
- **Pagination**: All list endpoints support `page` and `limit` parameters

### Request Headers
- **Authorization**: `Bearer {{access_token}}` (for protected endpoints)
- **Content-Type**: `application/json` (for POST/PATCH requests)

### Response Format
All responses follow this structure:
```json
{
  "success": true|false,
  "data": {...},
  "message": "Success message",
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure mock server is running: `node comprehensive-mock-server.js`
   - Check if port 3001 is available

2. **401 Unauthorized**
   - Run a login request first to get an access token
   - Check if the token is set in environment variables

3. **404 Not Found**
   - Verify the endpoint URL is correct
   - Check if the resource ID exists

4. **400 Bad Request**
   - Validate JSON request body format
   - Check required fields are provided

### Server Status
- **Mock Server**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Auth Health**: http://localhost:3001/api/v1/auth/health

## 📊 Example Requests

### Login Request
```json
POST /api/v1/auth/login
{
  "email": "admin@example.com",
  "password": "Admin123"
}
```

### Create User Request
```json
POST /api/v1/users
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "roles": ["user"]
}
```

### Create Carrier Request
```json
POST /api/v1/carriers
{
  "name": "Fast Shipping Co",
  "description": "Express shipping services",
  "contactEmail": "contact@fastshipping.com",
  "contactPhone": "+1-555-0123",
  "isActive": true
}
```

## 🎉 Success!

You now have a complete Postman collection for testing the Fullstack Project API. The collection includes:

- ✅ All service endpoints
- ✅ Authentication flow
- ✅ CRUD operations
- ✅ Environment variables
- ✅ Test scripts for token management
- ✅ Comprehensive documentation

Happy testing! 🚀
