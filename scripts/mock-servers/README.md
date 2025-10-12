# 🎭 Mock Servers

This directory contains mock server scripts for development and testing purposes.

## 📁 Files

### `comprehensive-mock-server.js`
**Purpose:** Complete mock server with all microservices endpoints
**Features:**
- ✅ Auth Service endpoints
- ✅ User Service endpoints  
- ✅ Carrier Service endpoints
- ✅ Customer Service endpoints
- ✅ Pricing Service endpoints
- ✅ Translation Service endpoints
- ✅ Health check endpoints
- ✅ Dynamic user creation and login
- ✅ JWT token generation
- ✅ Pagination support

**Usage:**
```bash
# From project root
node scripts/mock-servers/comprehensive-mock-server.js
```

**Available Services:**
- 🔐 Auth Service: `/api/v1/auth/*`
- 👥 User Service: `/api/v1/users/*`
- 🚚 Carrier Service: `/api/v1/carriers/*`
- 🏢 Customer Service: `/api/v1/customers/*`
- 💰 Pricing Service: `/api/v1/pricing/*`
- 🌐 Translation Service: `/api/v1/translations/*`
- ❤️ Health Check: `/health`

### `simple-mock-server.js`
**Purpose:** Basic auth-only mock server
**Features:**
- ✅ Auth Service endpoints only
- ✅ Login functionality
- ✅ Profile endpoint
- ✅ Health check

**Usage:**
```bash
# From project root
node scripts/mock-servers/simple-mock-server.js
```

### `mock-auth-server.js`
**Purpose:** Express-based auth mock server
**Features:**
- ✅ Express.js framework
- ✅ Auth endpoints
- ✅ JWT token handling

**Usage:**
```bash
# From project root
node scripts/mock-servers/mock-auth-server.js
```

## 🔑 Test Credentials

| Email | Password | Role | Status |
|-------|----------|------|--------|
| `admin@example.com` | `Admin123` or `admin123` | admin | ✅ Active |
| `test@gmail.com` | `Admin123` | user | ✅ Active |
| `test1@gmail.com` | `Admin123` | user | ✅ Active |
| `user@example.com` | `Admin123` | user | ✅ Active |

## 🚀 Quick Start

1. **Start Comprehensive Mock Server:**
   ```bash
   node scripts/mock-servers/comprehensive-mock-server.js
   ```

2. **Test Login:**
   ```bash
   curl -X POST http://localhost:3001/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"Admin123"}'
   ```

3. **Create New User:**
   ```bash
   curl -X POST http://localhost:3001/api/v1/users \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","roles":["user"]}'
   ```

## 🔧 Configuration

### Port Configuration
- **Default Port:** 3001
- **Environment Variable:** `PORT`

### CORS Configuration
- **Frontend URL:** `http://localhost:3000`
- **Environment Variable:** `FRONTEND_URL`

## 📊 API Endpoints

### Auth Service
- `GET /api/v1/auth/health` - Health check
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile

### User Service
- `GET /api/v1/users` - Get all users (paginated)
- `GET /api/v1/users/count` - Get user count
- `GET /api/v1/users/{id}` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PATCH /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Other Services
All other services follow the same CRUD pattern:
- `GET /api/v1/{service}` - List items
- `GET /api/v1/{service}/{id}` - Get item by ID
- `POST /api/v1/{service}` - Create item
- `PATCH /api/v1/{service}/{id}` - Update item
- `DELETE /api/v1/{service}/{id}` - Delete item

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/health
```

### Login Test
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123"}'
```

### User Creation Test
```bash
# First login to get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123"}' | \
  jq -r '.data.accessToken')

# Create user
curl -X POST http://localhost:3001/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","roles":["user"]}'
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill existing process
   pkill -f "mock-server"
   
   # Or use different port
   PORT=3002 node scripts/mock-servers/comprehensive-mock-server.js
   ```

2. **CORS Issues**
   - Ensure frontend URL is correct
   - Check CORS configuration in server

3. **User Creation Fails**
   - Verify user doesn't already exist
   - Check required fields are provided
   - Ensure proper authentication token

### Debug Mode

Enable debug logging:
```bash
DEBUG=* node scripts/mock-servers/comprehensive-mock-server.js
```

## 🔄 Integration

### With React Admin
1. Start mock server: `node scripts/mock-servers/comprehensive-mock-server.js`
2. Start React Admin: `cd react-admin && npm start`
3. Login with test credentials
4. Test all CRUD operations

### With Postman
1. Import collection: `Fullstack-Project-API.postman_collection.json`
2. Import environment: `Fullstack-Project-Environment.postman_environment.json`
3. Set base URL to: `http://localhost:3001`
4. Run test requests

## 📝 Notes

- **Data Persistence:** Data is stored in memory and resets on server restart
- **User Passwords:** All users use `Admin123` for demo purposes
- **JWT Tokens:** Tokens are mock tokens for development only
- **Pagination:** All list endpoints support `page` and `limit` parameters

---

**🎉 Happy mocking!** 🎭
