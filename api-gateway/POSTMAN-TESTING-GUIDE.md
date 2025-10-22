# Kong Gateway - Postman Testing Guide

## 🚀 Quick Start

### 1. Import Collection & Environment

1. **Import Collection**:
   - Open Postman
   - Click "Import"
   - Select `Fullstack-Project-API.postman_collection.json`

2. **Import Environment**:
   - Click "Import"
   - Select `Fullstack-Project-Environment.postman_environment.json`
   - Select the environment from the dropdown (top-right)

### 2. Verify Kong is Running

```bash
# Check Kong status
docker ps | grep kong

# Expected output:
# kong-gateway    kong:3.4    Up (healthy)
```

### 3. Test Kong Admin API

In Postman, go to:
- **🌐 Kong Gateway** → **Kong Status**
- Click "Send"
- Expected: `200 OK` with Kong status info

---

## 🧪 Testing Scenarios

### Scenario 1: Public Endpoints (No Auth Required)

#### Test 1.1: Health Check
- **Request**: `GET {{base_url}}/api/v1/health`
- **Expected**: `200 OK`
- **Kong Behavior**: Routes to auth-service, no JWT required

#### Test 1.2: Login
- **Request**: `POST {{base_url}}/api/v1/auth/login`
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "Admin123!"
  }
  ```
- **Expected**: `200 OK` with `access_token`
- **Kong Behavior**: 
  - Routes to auth-service
  - No JWT validation (public route)
  - Returns JWT with `iss: 'auth-service'`

**Postman Console Output**:
```
✅ Token saved to environment
Token preview: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQwM...
User ID: 401
User Email: admin@example.com
JWT Payload: {
  "sub": 401,
  "email": "admin@example.com",
  "iss": "auth-service",  ← Kong validates this
  "roles": ["admin"],
  "permissions": ["users.manage", "roles.manage", "system.admin"]
}
```

---

### Scenario 2: Protected Endpoints (JWT Required)

#### Test 2.1: Access Users Without Token (Should Fail)
1. **Clear Environment Token**:
   - Go to Environment variables
   - Delete `access_token` value
   
2. **Request**: `GET {{base_url}}/api/v1/users`
3. **Expected**: `401 Unauthorized`
   ```json
   {
     "message": "Unauthorized"
   }
   ```
4. **Kong Behavior**: JWT plugin blocks request

#### Test 2.2: Access Users With Valid Token (Should Succeed)
1. **Login First**: Run "Login - Admin User"
2. **Request**: `GET {{base_url}}/api/v1/users`
3. **Authorization**: `Bearer {{access_token}}` (auto-populated)
4. **Expected**: `200 OK` with user list
5. **Kong Behavior**:
   - Validates JWT signature with shared secret
   - Verifies `iss: 'auth-service'`
   - Routes to user-service

---

### Scenario 3: Rate Limiting

#### Test 3.1: Trigger Rate Limit
1. **Request**: `GET {{base_url}}/api/v1/users`
2. **Repeat**: Send 101 times rapidly (use Runner)
3. **Expected**: After 100 requests:
   ```json
   {
     "message": "API rate limit exceeded"
   }
   ```
4. **Response Headers**:
   ```
   X-RateLimit-Limit-Minute: 100
   X-RateLimit-Remaining-Minute: 0
   RateLimit-Reset: 60
   ```

---

### Scenario 4: RBAC/ACL Testing

#### Test 4.1: Admin Access (Should Succeed)
1. **Login as Admin**: 
   - Email: `admin@example.com`
   - Password: `Admin123!`
2. **Request**: `GET {{base_url}}/api/v1/users`
3. **Expected**: `200 OK`
4. **Kong Behavior**: ACL plugin allows `admin` role

#### Test 4.2: Regular User Access (Currently No Enforcement)
1. **Login as User**: 
   - Email: `user@example.com`
   - Password: `User123!`
2. **Request**: `GET {{base_url}}/api/v1/users`
3. **Expected**: `200 OK` (ACL not fully enforced yet)
4. **Note**: Full ACL enforcement requires Kong consumer sync

---

### Scenario 5: CORS Testing

#### Test 5.1: Preflight Request
- **Request**: `OPTIONS {{base_url}}/api/v1/users`
- **Headers**:
  ```
  Origin: http://localhost:3000
  Access-Control-Request-Method: GET
  Access-Control-Request-Headers: authorization
  ```
- **Expected**: `200 OK` with CORS headers:
  ```
  Access-Control-Allow-Origin: http://localhost:3000
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
  Access-Control-Allow-Credentials: true
  ```

---

## 📊 Kong Admin Endpoints

### Check Services
- **Request**: `GET {{kong_admin_url}}/services`
- **Shows**: All 6 configured microservices

### Check Routes
- **Request**: `GET {{kong_admin_url}}/routes`
- **Shows**: All 11 configured routes

### Check Plugins
- **Request**: `GET {{kong_admin_url}}/plugins`
- **Shows**: JWT, ACL, CORS, Rate Limiting plugins

### Check Consumers
- **Request**: `GET {{kong_admin_url}}/consumers`
- **Shows**: `auth-service-jwt` consumer

---

## 🔍 Debugging

### View Request Logs
```bash
# Kong logs
docker logs kong-gateway -f

# Auth service logs
docker logs auth-service -f
```

### Decode JWT Manually
```bash
# In terminal
TOKEN="your-jwt-token-here"
echo $TOKEN | awk -F'.' '{print $2}' | base64 -d | jq
```

### Test Direct vs Kong
```bash
# Direct to auth-service (bypass Kong)
curl http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'

# Through Kong
curl http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'

# Both should return same response
```

---

## 📝 Postman Features Used

### Auto Token Extraction
Login requests automatically:
1. Extract `access_token` from response
2. Save to environment variable
3. Parse JWT and log claims to console
4. Populate user_id and user_email

### Auto Authorization
Protected endpoints automatically:
1. Use `{{access_token}}` from environment
2. Add `Authorization: Bearer` header
3. No manual token copy/paste needed

### Environment Variables
- `{{base_url}}` - Kong Gateway (localhost:8000)
- `{{kong_admin_url}}` - Kong Admin API (localhost:8001)
- `{{access_token}}` - Auto-populated from login
- `{{user_id}}` - Auto-populated from login
- `{{user_email}}` - Auto-populated from login

---

## 🎯 Expected Results Summary

| Endpoint | Method | Auth Required | Expected Status | Kong Validation |
|----------|--------|---------------|-----------------|-----------------|
| /api/v1/auth/login | POST | No | 200 | None (public route) |
| /api/v1/auth/register | POST | No | 201 | None (public route) |
| /api/v1/auth/refresh | POST | No | 200 | None (public route) |
| /api/v1/auth/logout | POST | Yes | 200 | JWT validation |
| /api/v1/auth/profile | GET | Yes | 200 | JWT validation |
| /api/v1/users | GET | Yes | 200 | JWT + ACL (admin) |
| /api/v1/roles | GET | Yes | 200 | JWT + ACL (admin) |
| /api/carriers | GET | Yes | 200 | JWT + ACL (manager) |
| /api/customers | GET | Yes | 200 | JWT + ACL (manager) |
| /api/pricing | GET | Yes | 200 | JWT + ACL (manager) |
| /api/v1/translations | GET | Yes | 200 | JWT validation |

---

## 🆘 Troubleshooting

### Issue: 401 Unauthorized on protected endpoints

**Solution**:
1. Check token is saved: View environment `access_token`
2. Re-login: Run "Login - Admin User"
3. Verify JWT has `iss` claim:
   ```bash
   echo $TOKEN | awk -F'.' '{print $2}' | base64 -d | jq
   # Should show: "iss": "auth-service"
   ```

### Issue: Token not auto-saved

**Solution**:
1. Check Postman console for errors
2. Verify response format includes `data.access_token`
3. Re-import collection if needed

### Issue: Kong not routing

**Solution**:
```bash
# Check Kong is running
docker ps | grep kong

# Check Kong services
curl http://localhost:8001/services

# Restart Kong if needed
docker restart kong-gateway
```

### Issue: CORS errors

**Solution**:
- Kong CORS plugin is configured for `localhost:3000`
- Postman bypasses CORS (browser restriction)
- Test CORS in React Admin frontend

---

## 📚 Next Steps

1. **Test All Endpoints**: Use Postman Runner to test entire collection
2. **Monitor Kong**: View logs during testing
3. **Frontend Integration**: Update React Admin to use Kong
4. **Production Setup**: Configure proper JWT secret and rate limits

---

**Happy Testing!** 🚀
