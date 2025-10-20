# 📋 API Standards - Quick Reference

## 🎯 TL;DR

**Current State:** ⚠️ INCONSISTENT - Services use different response formats  
**Recommended:** ✅ Standardize using `ApiResponseDto` and `ErrorResponseDto`

---

## ✅ **Success Response (Recommended)**

```typescript
{
  "data": { /* actual data */ },
  "message": "Success",
  "statusCode": 200,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "success": true
}
```

---

## ❌ **Error Response (Recommended)**

```typescript
{
  "error": "Error Type",
  "message": "Human readable message",
  "statusCode": 400,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "path": "/api/v1/endpoint",
  "fieldErrors": { /* validation errors */ },
  "details": { /* additional info */ }
}
```

---

## 🔧 **HTTP Methods & Status Codes**

| Method | Action | Success | Example |
|--------|--------|---------|---------|
| GET | Read | 200 OK | Get user(s) |
| POST | Create | 201 Created | Create user |
| PATCH | Update | 200 OK | Update user |
| DELETE | Delete | 204 No Content | Delete user |

### Common Status Codes

**Success (2xx)**
- `200` - OK
- `201` - Created
- `204` - No Content

**Client Errors (4xx)**
- `400` - Bad Request (validation/business error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `409` - Conflict

**Server Errors (5xx)**
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## 🌐 **REST Conventions**

### URL Structure
```
/{version}/{resource}/{id?}/{sub-resource?}
```

**✅ Good:**
```
GET    /api/v1/users
GET    /api/v1/users/123
POST   /api/v1/users
PATCH  /api/v1/users/123
DELETE /api/v1/users/123
GET    /api/v1/users/123/orders
```

**❌ Bad:**
```
GET    /api/v1/getUsers           # Don't use verbs
POST   /api/v1/createUser         # Don't use verbs
GET    /api/v1/UserProfiles       # Don't use CamelCase
GET    /api/v1/user/123           # Don't mix singular/plural
```

### Query Parameters

**Pagination:**
```
GET /api/v1/users?page=1&limit=10
```

**Filtering:**
```
GET /api/v1/users?status=active&role=admin
```

**Sorting:**
```
GET /api/v1/users?sortBy=name&sortOrder=asc
```

**Searching:**
```
GET /api/v1/users?search=john
```

---

## 📤 **Request Examples**

### POST (Create)
```json
POST /api/v1/users
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

### PATCH (Update)
```json
PATCH /api/v1/users/123
{
  "name": "Jane Doe"
}
```

---

## 📥 **Response Examples**

### Success - Single Resource
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "message": "User retrieved successfully",
  "statusCode": 200,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "success": true
}
```

### Success - Collection
```json
{
  "data": [
    { "id": 1, "name": "User 1" },
    { "id": 2, "name": "User 2" }
  ],
  "message": "Users retrieved successfully",
  "statusCode": 200,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "success": true
}
```

### Success - Paginated
```json
{
  "data": {
    "items": [
      { "id": 1, "name": "Item 1" }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Items retrieved successfully",
  "statusCode": 200,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "success": true
}
```

### Error - Validation (400)
```json
{
  "error": "Validation Error",
  "message": "Request validation failed",
  "statusCode": 400,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "path": "/api/v1/users",
  "fieldErrors": {
    "email": ["Please provide a valid email address"],
    "password": ["Password must be at least 6 characters long"]
  }
}
```

### Error - Not Found (404)
```json
{
  "error": "Not Found",
  "message": "User not found",
  "statusCode": 404,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "path": "/api/v1/users/99999",
  "details": {
    "resource": "User",
    "identifier": 99999
  }
}
```

### Error - Unauthorized (401)
```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials",
  "statusCode": 401,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "path": "/api/v1/auth/login"
}
```

---

## 🛠️ **Implementation Checklist**

### Backend (NestJS)

**1. Create Exception Filter:**
```typescript
// src/infrastructure/filters/http-exception.filter.ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Handle exceptions and return ErrorResponseDto
  }
}
```

**2. Create Transform Interceptor:**
```typescript
// src/infrastructure/interceptors/transform.interceptor.ts
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    // Wrap responses in ApiResponseDto
  }
}
```

**3. Register in main.ts:**
```typescript
app.useGlobalFilters(new HttpExceptionFilter());
app.useGlobalInterceptors(new TransformInterceptor());
```

### Frontend

**1. Update API Client:**
```typescript
// Extract data from response.data
const users = response.data.data; // Not response.data directly

// Handle pagination
const { items, pagination } = response.data.data;

// Handle errors
catch (error) {
  const errorMessage = error.response.data.message;
  const fieldErrors = error.response.data.fieldErrors;
}
```

---

## 📊 **Current Service Status**

| Service | Port | Response Format | Needs Update? |
|---------|------|-----------------|---------------|
| Auth Service | 3001 | NestJS Default | ✅ Yes |
| User Service | 3003 | NestJS Default | ✅ Yes |
| Carrier Service | 3004 | NestJS Default | ✅ Yes |
| Customer Service | 3005 | NestJS Default | ✅ Yes |
| Pricing Service | 3006 | NestJS Default | ✅ Yes |
| Translation Service | 3007 | Raw Data | ✅ Yes |

**Shared Infrastructure:** ✅ DTOs defined but **not consistently used**

---

## 🎯 **Migration Priority**

1. **Translation Service** (Just integrated with React Admin)
2. **Auth Service** (Core authentication)
3. **User Service** (User management)
4. **Carrier/Customer Services** (Business services)
5. **Pricing Service** (Supporting service)

---

## 📚 **Key Files**

**Shared DTOs:**
- `/shared/infrastructure/src/dto/api-response.dto.ts`
- `/shared/infrastructure/src/dto/error-response.dto.ts`
- `/shared/infrastructure/src/dto/pagination.dto.ts`

**Exceptions:**
- `/shared/infrastructure/src/exceptions/validation.exception.ts`
- `/shared/infrastructure/src/exceptions/business.exception.ts`
- `/shared/infrastructure/src/exceptions/not-found.exception.ts`

---

## ⚡ **Quick Commands**

**Test Current Format:**
```bash
# Translation Service (raw)
curl http://localhost:3007/api/v1/translation/languages | jq

# Auth Service (NestJS default)
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"invalid","password":"test"}' | jq

# User Service (404 format)
curl http://localhost:3003/api/v1/users/99999 | jq
```

---

## 🚨 **Important Notes**

1. **Don't break existing clients** during migration
2. **Version the API** if making breaking changes
3. **Test thoroughly** before deploying
4. **Update Postman collections** after changes
5. **Document all changes** in CHANGELOG.md

---

## 📖 **Full Documentation**

See `/docs/API-STANDARDS.md` for complete details including:
- Detailed implementation guide
- Security considerations
- Monitoring & logging
- Migration strategy
- Service-specific examples

---

**Quick Reference Version:** 1.0  
**Last Updated:** October 19, 2025
