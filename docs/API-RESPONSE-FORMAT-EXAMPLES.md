# 🎨 API Response Format - Visual Examples

**Quick visual guide to standardized API formats**

---

## 📤 **REQUEST FORMATS**

### 1. GET Request (Read)
```
GET /api/v1/users
Headers:
  Accept: application/json
  Accept-Language: en
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 2. POST Request (Create)
```
POST /api/v1/users
Headers:
  Content-Type: application/json
  Accept: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

### 3. PATCH Request (Update)
```
PATCH /api/v1/users/123
Headers:
  Content-Type: application/json
  Accept: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Body:
{
  "name": "Jane Doe"
}
```

### 4. DELETE Request (Delete)
```
DELETE /api/v1/users/123
Headers:
  Accept: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 📥 **RESPONSE FORMATS**

### ✅ Success Response - Single Resource (200 OK)

```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-10-19T14:30:00.000Z",
    "updatedAt": "2025-10-19T14:30:00.000Z"
  },
  "message": "User retrieved successfully",
  "statusCode": 200,
  "timestamp": "2025-10-19T14:30:05.123Z",
  "success": true
}
```

**Structure:**
```
┌─────────────────────────────────────┐
│ API Response Wrapper                │
├─────────────────────────────────────┤
│ ✓ data: { /* actual resource */ }  │
│ ✓ message: "Success message"       │
│ ✓ statusCode: 200                  │
│ ✓ timestamp: "ISO 8601"            │
│ ✓ success: true                    │
└─────────────────────────────────────┘
```

---

### ✅ Success Response - Collection (200 OK)

```json
{
  "data": [
    {
      "id": 1,
      "name": "User 1",
      "email": "user1@example.com"
    },
    {
      "id": 2,
      "name": "User 2",
      "email": "user2@example.com"
    },
    {
      "id": 3,
      "name": "User 3",
      "email": "user3@example.com"
    }
  ],
  "message": "Users retrieved successfully",
  "statusCode": 200,
  "timestamp": "2025-10-19T14:30:05.123Z",
  "success": true
}
```

**Structure:**
```
┌─────────────────────────────────────┐
│ API Response Wrapper                │
├─────────────────────────────────────┤
│ ✓ data: [                          │
│     { resource1 },                 │
│     { resource2 },                 │
│     { resource3 }                  │
│   ]                                │
│ ✓ message: "Success message"       │
│ ✓ statusCode: 200                  │
│ ✓ timestamp: "ISO 8601"            │
│ ✓ success: true                    │
└─────────────────────────────────────┘
```

---

### ✅ Success Response - Paginated (200 OK)

```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "key": "welcome_message",
        "original": "Hello World",
        "destination": "Hola Mundo",
        "languageCode": "es"
      },
      {
        "id": 2,
        "key": "goodbye_message",
        "original": "Goodbye",
        "destination": "Adiós",
        "languageCode": "es"
      }
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
  "message": "Translations retrieved successfully",
  "statusCode": 200,
  "timestamp": "2025-10-19T14:30:05.123Z",
  "success": true
}
```

**Structure:**
```
┌──────────────────────────────────────────┐
│ API Response Wrapper                     │
├──────────────────────────────────────────┤
│ ✓ data: {                                │
│     items: [{ item1 }, { item2 }]        │
│     pagination: {                        │
│       page: 1                            │
│       limit: 10                          │
│       total: 25                          │
│       totalPages: 3                      │
│       hasNext: true                      │
│       hasPrev: false                     │
│     }                                    │
│   }                                      │
│ ✓ message: "Success message"             │
│ ✓ statusCode: 200                        │
│ ✓ timestamp: "ISO 8601"                  │
│ ✓ success: true                          │
└──────────────────────────────────────────┘
```

---

### ✅ Success Response - Created (201 Created)

```json
{
  "data": {
    "id": 123,
    "email": "newuser@example.com",
    "name": "New User",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-10-19T14:30:05.123Z",
    "updatedAt": "2025-10-19T14:30:05.123Z"
  },
  "message": "User created successfully",
  "statusCode": 201,
  "timestamp": "2025-10-19T14:30:05.123Z",
  "success": true
}
```

**Headers:**
```
HTTP/1.1 201 Created
Location: /api/v1/users/123
Content-Type: application/json
```

---

### ✅ Success Response - No Content (204 No Content)

```
HTTP/1.1 204 No Content
(empty body)
```

**Used for:**
- Successful DELETE operations
- Successful updates with no return data

---

## ❌ **ERROR RESPONSES**

### ❌ Validation Error (400 Bad Request)

```json
{
  "error": "Validation Error",
  "message": "Request validation failed",
  "statusCode": 400,
  "timestamp": "2025-10-19T14:30:05.123Z",
  "path": "/api/v1/auth/register",
  "fieldErrors": {
    "email": [
      "Email is required",
      "Please provide a valid email address"
    ],
    "password": [
      "Password must be at least 6 characters long",
      "Password must contain at least one uppercase letter",
      "Password must contain at least one number"
    ],
    "name": [
      "Name is required"
    ]
  }
}
```

**Structure:**
```
┌──────────────────────────────────────────┐
│ Error Response                           │
├──────────────────────────────────────────┤
│ ✗ error: "Validation Error"              │
│ ✗ message: "Human readable message"      │
│ ✗ statusCode: 400                        │
│ ✗ timestamp: "ISO 8601"                  │
│ ✗ path: "/api/v1/endpoint"               │
│ ✗ fieldErrors: {                         │
│     field1: ["error1", "error2"],        │
│     field2: ["error3"]                   │
│   }                                      │
└──────────────────────────────────────────┘
```

**Frontend Display:**
```
Registration Form
─────────────────────────────────
Email: [invalid@]
       ❌ Email is required
       ❌ Please provide a valid email address

Password: [weak]
          ❌ Password must be at least 6 characters long
          ❌ Password must contain at least one uppercase letter
          ❌ Password must contain at least one number

Name: [ ]
      ❌ Name is required
```

---

### ❌ Business Error (400 Bad Request)

```json
{
  "error": "Business Error",
  "message": "Email already exists",
  "statusCode": 400,
  "timestamp": "2025-10-19T14:30:05.123Z",
  "path": "/api/v1/auth/register",
  "details": {
    "errorCode": "EMAIL_EXISTS",
    "field": "email",
    "value": "existing@example.com",
    "suggestion": "Please use a different email or try to login"
  }
}
```

**Structure:**
```
┌──────────────────────────────────────────┐
│ Error Response                           │
├──────────────────────────────────────────┤
│ ✗ error: "Business Error"                │
│ ✗ message: "Business rule violation"     │
│ ✗ statusCode: 400                        │
│ ✗ timestamp: "ISO 8601"                  │
│ ✗ path: "/api/v1/endpoint"               │
│ ✗ details: {                             │
│     errorCode: "SPECIFIC_CODE",          │
│     /* additional context */             │
│   }                                      │
└──────────────────────────────────────────┘
```

---

### ❌ Unauthorized (401 Unauthorized)

```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials",
  "statusCode": 401,
  "timestamp": "2025-10-19T14:30:05.123Z",
  "path": "/api/v1/auth/login"
}
```

**Common Cases:**
- Invalid username/password
- Missing authentication token
- Expired token
- Invalid token

---

### ❌ Forbidden (403 Forbidden)

```json
{
  "error": "Forbidden",
  "message": "You do not have permission to perform this action",
  "statusCode": 403,
  "timestamp": "2025-10-19T14:30:05.123Z",
  "path": "/api/v1/admin/users",
  "details": {
    "requiredRole": "admin",
    "currentRole": "user"
  }
}
```

**Common Cases:**
- User authenticated but lacks permissions
- Role-based access control violation
- Resource ownership violation

---

### ❌ Not Found (404 Not Found)

```json
{
  "error": "Not Found",
  "message": "User not found",
  "statusCode": 404,
  "timestamp": "2025-10-19T14:30:05.123Z",
  "path": "/api/v1/users/99999",
  "details": {
    "resource": "User",
    "identifier": 99999
  }
}
```

**Common Cases:**
- Resource does not exist
- Invalid ID
- Deleted resource

---

### ❌ Conflict (409 Conflict)

```json
{
  "error": "Conflict",
  "message": "Cannot delete user with active orders",
  "statusCode": 409,
  "timestamp": "2025-10-19T14:30:05.123Z",
  "path": "/api/v1/users/123",
  "details": {
    "resource": "User",
    "conflict": "Active orders exist",
    "activeOrdersCount": 5
  }
}
```

**Common Cases:**
- Resource state conflict
- Concurrent modification
- Referential integrity violation

---

### ❌ Internal Server Error (500 Internal Server Error)

**Production:**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred. Please try again later.",
  "statusCode": 500,
  "timestamp": "2025-10-19T14:30:05.123Z",
  "path": "/api/v1/users",
  "details": {
    "errorId": "abc-123-def-456",
    "support": "Please contact support with this error ID"
  }
}
```

**Development:**
```json
{
  "error": "Internal Server Error",
  "message": "Cannot read property 'name' of undefined",
  "statusCode": 500,
  "timestamp": "2025-10-19T14:30:05.123Z",
  "path": "/api/v1/users",
  "details": {
    "errorId": "abc-123-def-456",
    "stack": "Error: Cannot read property 'name' of undefined\n    at UserService.getUser (user.service.ts:45:18)\n    at UserController.getUser (user.controller.ts:23:12)"
  }
}
```

---

## 🎯 **HTTP Status Code Quick Reference**

```
2xx - SUCCESS
────────────────────────────────────────
200 OK                  ✅ Request succeeded
201 Created             ✅ Resource created
204 No Content          ✅ Success, no body

4xx - CLIENT ERRORS
────────────────────────────────────────
400 Bad Request         ❌ Validation/Business error
401 Unauthorized        ❌ Authentication required
403 Forbidden           ❌ Not authorized
404 Not Found           ❌ Resource not found
409 Conflict            ❌ Resource conflict
422 Unprocessable       ❌ Semantic error

5xx - SERVER ERRORS
────────────────────────────────────────
500 Internal Server     💥 Unexpected error
503 Service Unavailable 🔧 Service down
```

---

## 📊 **Frontend Integration Examples**

### React/TypeScript Example

**API Client:**
```typescript
interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
  success: boolean;
}

interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  fieldErrors?: Record<string, string[]>;
  details?: Record<string, any>;
}

async function fetchUser(id: number): Promise<User> {
  try {
    const response = await fetch(`/api/v1/users/${id}`);
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new ApiError(error);
    }
    
    const result: ApiResponse<User> = await response.json();
    return result.data; // Extract data
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

async function fetchUsers(page = 1, limit = 10): Promise<PaginatedResult<User>> {
  const response = await fetch(`/api/v1/users?page=${page}&limit=${limit}`);
  const result: ApiResponse<{ items: User[]; pagination: PaginationInfo }> = 
    await response.json();
  
  return {
    users: result.data.items,
    pagination: result.data.pagination
  };
}
```

**Error Handling:**
```typescript
class ApiError extends Error {
  constructor(public response: ErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
  }
  
  get isValidationError(): boolean {
    return this.response.error === 'Validation Error';
  }
  
  get fieldErrors(): Record<string, string[]> {
    return this.response.fieldErrors || {};
  }
}

// Usage in component
try {
  await createUser(userData);
} catch (error) {
  if (error instanceof ApiError && error.isValidationError) {
    // Show field-level errors
    setErrors(error.fieldErrors);
  } else {
    // Show general error
    showToast(error.message);
  }
}
```

---

## 🔄 **Request/Response Flow**

```
CLIENT                                  SERVER
  │                                       │
  │  1. POST /api/v1/users                │
  │     {                                 │
  │       "email": "user@example.com",    │
  │       "password": "SecurePass123!"    │
  │     }                                 │
  ├──────────────────────────────────────>│
  │                                       │
  │                                       │ 2. Validate Input
  │                                       │    (ValidationPipe)
  │                                       │
  │                                       │ 3. Execute Business Logic
  │                                       │    (Use Case)
  │                                       │
  │                                       │ 4. Transform Response
  │                                       │    (TransformInterceptor)
  │                                       │
  │  5. HTTP 201 Created                  │
  │     {                                 │
  │       "data": { /* user */ },         │
  │       "message": "User created",      │
  │       "statusCode": 201,              │
  │       "timestamp": "...",             │
  │       "success": true                 │
  │     }                                 │
  │<──────────────────────────────────────│
  │                                       │
  │  6. Extract: const user = response.data;
  │                                       │
```

**Error Flow:**
```
CLIENT                                  SERVER
  │                                       │
  │  1. POST /api/v1/users                │
  │     {                                 │
  │       "email": "invalid",             │
  │       "password": "weak"              │
  │     }                                 │
  ├──────────────────────────────────────>│
  │                                       │
  │                                       │ 2. Validation FAILS
  │                                       │    (ValidationPipe throws)
  │                                       │
  │                                       │ 3. Catch Exception
  │                                       │    (HttpExceptionFilter)
  │                                       │
  │                                       │ 4. Format Error Response
  │                                       │    (ErrorResponseDto)
  │                                       │
  │  5. HTTP 400 Bad Request              │
  │     {                                 │
  │       "error": "Validation Error",    │
  │       "message": "...",               │
  │       "statusCode": 400,              │
  │       "fieldErrors": {                │
  │         "email": ["Invalid"],         │
  │         "password": ["Too weak"]      │
  │       }                               │
  │     }                                 │
  │<──────────────────────────────────────│
  │                                       │
  │  6. Show field errors in form         │
  │                                       │
```

---

## 📚 **Related Documentation**

- **Full Standards:** `/docs/API-STANDARDS.md`
- **Quick Reference:** `/docs/API-STANDARDS-QUICK-REFERENCE.md`
- **Comparison:** `/docs/API-FORMAT-COMPARISON.md`
- **Summary:** `/docs/API-STANDARDS-REVIEW-SUMMARY.md`

---

**Visual Examples Version:** 1.0  
**Last Updated:** October 19, 2025
