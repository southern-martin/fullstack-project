# NestJS API Postman Collection

This directory contains a comprehensive Postman collection for testing the NestJS Clean Architecture API.

## 📁 Files

- `postman-collection.json` - Complete API collection with all endpoints
- `postman-environment.json` - Environment variables for different configurations
- `POSTMAN-README.md` - This documentation file

## 🚀 Quick Start

### 1. Import Collection
1. Open Postman
2. Click "Import" button
3. Select `postman-collection.json`
4. Click "Import"

### 2. Import Environment
1. In Postman, go to "Environments"
2. Click "Import"
3. Select `postman-environment.json`
4. Click "Import"
5. Select the "NestJS API Environment" from the dropdown

### 3. Start Your API Server
```bash
cd /opt/cursor-project/fullstack-project/nestjs-app-api/api
npm run start:dev
```

## 🔧 Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `baseUrl` | API base URL | `http://localhost:3001/api/v1` |
| `authToken` | JWT authentication token | (auto-populated) |
| `userId` | User ID for testing | (auto-populated) |
| `roleId` | Role ID for testing | (auto-populated) |
| `carrierId` | Carrier ID for testing | (auto-populated) |
| `customerId` | Customer ID for testing | (auto-populated) |

## 📋 API Endpoints

### Health Check
- **GET** `/health` - Check API health status

### Authentication
- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login user
- **GET** `/auth/profile` - Get user profile (requires auth)
- **POST** `/auth/refresh` - Refresh JWT token (requires auth)
- **POST** `/auth/logout` - Logout user (requires auth)

### Users Management
- **POST** `/users` - Create user (requires auth)
- **GET** `/users` - Get all users with pagination (requires auth)
- **GET** `/users/active` - Get active users (requires auth)
- **GET** `/users/count` - Get user count (requires auth)
- **GET** `/users/email/:email` - Get user by email (requires auth)
- **GET** `/users/role/:roleName` - Get users by role (requires auth)
- **GET** `/users/exists/:email` - Check if user exists (requires auth)
- **GET** `/users/:id` - Get user by ID (requires auth)
- **PATCH** `/users/:id` - Update user (requires auth)
- **PATCH** `/users/:id/roles` - Assign roles to user (requires auth)
- **DELETE** `/users/:id` - Delete user (requires auth)

### Roles Management
- **POST** `/roles` - Create role (requires auth)
- **GET** `/roles` - Get all roles with pagination (requires auth)
- **GET** `/roles/active` - Get active roles (requires auth)
- **GET** `/roles/count` - Get role count (requires auth)
- **GET** `/roles/permission/:permission` - Get roles by permission (requires auth)
- **GET** `/roles/name/:name` - Get role by name (requires auth)
- **GET** `/roles/exists/:name` - Check if role exists (requires auth)
- **GET** `/roles/:id` - Get role by ID (requires auth)
- **PATCH** `/roles/:id` - Update role (requires auth)
- **DELETE** `/roles/:id` - Delete role (requires auth)

### Carriers Management
- **POST** `/carriers` - Create carrier (requires auth)
- **GET** `/carriers` - Get all carriers with pagination (requires auth)
- **GET** `/carriers/active` - Get active carriers (requires auth)
- **GET** `/carriers/:id` - Get carrier by ID (requires auth)
- **PATCH** `/carriers/:id` - Update carrier (requires auth)
- **DELETE** `/carriers/:id` - Delete carrier (requires auth)

### Customers Management
- **POST** `/customers` - Create customer (requires auth)
- **GET** `/customers` - Get all customers with pagination (requires auth)
- **GET** `/customers/active` - Get active customers (requires auth)
- **GET** `/customers/email/:email` - Get customer by email (requires auth)
- **GET** `/customers/:id` - Get customer by ID (requires auth)
- **PATCH** `/customers/:id` - Update customer (requires auth)
- **DELETE** `/customers/:id` - Delete customer (requires auth)

## 🔐 Authentication Flow

### 1. Register a New User
```json
POST /auth/register
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User",
  "phone": "+1234567890"
}
```

### 2. Login User
```json
POST /auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Use Token for Authenticated Requests
The collection automatically captures the JWT token from login/register responses and uses it for subsequent authenticated requests.

**Note**: The collection has been updated to correctly capture the `token` field from the API response (not `accessToken`).

## 📊 Testing Workflow

### Recommended Testing Order:

1. **Health Check** - Verify API is running
2. **Register User** - Create a test user account
3. **Login User** - Authenticate and get token
4. **Get Profile** - Verify authentication works
5. **Create Role** - Set up user roles
6. **Create Carrier** - Set up carriers
7. **Create Customer** - Set up customers
8. **Test CRUD Operations** - Full CRUD testing for each module

## 🛠️ Customization

### Environment Variables
You can modify the environment variables in `postman-environment.json`:

- **Development**: `http://localhost:3001/api/v1`
- **Staging**: `https://staging-api.example.com/api/v1`
- **Production**: `https://api.example.com/api/v1`

### Request Bodies
All request bodies are pre-filled with example data. Modify them according to your testing needs.

### Headers
The collection automatically handles:
- `Content-Type: application/json` for POST/PATCH requests
- `Authorization: Bearer {token}` for authenticated requests

## 🐛 Troubleshooting

### Common Issues:

1. **401 Unauthorized**: Make sure you're logged in and the token is valid
2. **404 Not Found**: Check if the API server is running on the correct port
3. **500 Internal Server Error**: Check server logs for detailed error information
4. **Token Not Working**: Ensure you've run Login/Register first to capture the token

### Debug Steps:

1. Check if the API server is running: `curl http://localhost:3001/api/v1/health`
2. Verify database connection
3. Check server logs for errors
4. Ensure all required environment variables are set

## 📝 Notes

- All authenticated endpoints require a valid JWT token
- The collection includes automatic token extraction from login/register responses
- Pagination is supported for list endpoints (page, limit parameters)
- All endpoints return JSON responses
- Error responses include detailed error messages

## 🔄 Updates

To update the collection:
1. Export the updated collection from Postman
2. Replace the existing `postman-collection.json` file
3. Update this README if new endpoints are added

---

**Happy Testing! 🚀**

