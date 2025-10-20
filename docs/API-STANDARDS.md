# 📋 API Standards - Fullstack Project

## 🎯 Overview

This document defines the **RESTful API standards** for all microservices in the fullstack project. All services MUST follow these standards to ensure consistency, predictability, and ease of integration.

---

## 🏗️ **Current State Analysis**

### ⚠️ **INCONSISTENCY DETECTED**

Our services currently have **INCONSISTENT** API response formats:

1. **Translation Service**: Returns **raw data** (no wrapper)
   ```json
   [
     {
       "code": "en",
       "name": "English",
       "localName": "English",
       "status": "active"
     }
   ]
   ```

2. **Auth/User Services**: NestJS default error format
   ```json
   {
     "message": "User not found",
     "error": "Not Found",
     "statusCode": 404
   }
   ```

3. **Shared Infrastructure**: Defines `ApiResponseDto` but **NOT BEING USED**
   ```json
   {
     "data": {...},
     "message": "Success",
     "statusCode": 200,
     "timestamp": "2025-10-19T...",
     "success": true
   }
   ```

---

## ✅ **RECOMMENDED STANDARD** (RESTful Best Practices)

Based on industry best practices (Google JSON Style Guide, Microsoft REST API Guidelines, JSON:API specification), we should adopt the following:

### 📤 **Success Response Format**

```typescript
interface ApiResponse<T> {
  data: T;                    // The actual data payload
  message?: string;           // Optional success message
  statusCode: number;         // HTTP status code
  timestamp: string;          // ISO 8601 timestamp
  success: boolean;           // Quick success indicator
}
```

**Example - Single Resource:**
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

**Example - Collection:**
```json
{
  "data": [
    {
      "code": "en",
      "name": "English",
      "localName": "English"
    },
    {
      "code": "es",
      "name": "Spanish",
      "localName": "Español"
    }
  ],
  "message": "Languages retrieved successfully",
  "statusCode": 200,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "success": true
}
```

### 📄 **Paginated Response Format**

```typescript
interface PaginatedResponse<T> {
  data: {
    items: T[];             // Array of items
    pagination: {
      page: number;         // Current page (1-indexed)
      limit: number;        // Items per page
      total: number;        // Total item count
      totalPages: number;   // Total page count
      hasNext: boolean;     // Has next page
      hasPrev: boolean;     // Has previous page
    }
  };
  message?: string;
  statusCode: number;
  timestamp: string;
  success: boolean;
}
```

**Example:**
```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "key": "welcome_message",
        "original": "Hello World"
      },
      {
        "id": 2,
        "key": "goodbye_message",
        "original": "Goodbye"
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
  "timestamp": "2025-10-19T14:30:00.000Z",
  "success": true
}
```

### ❌ **Error Response Format**

```typescript
interface ErrorResponse {
  error: string;                          // Error type (e.g., "Validation Error")
  message: string;                        // Human-readable error message
  statusCode: number;                     // HTTP status code
  timestamp: string;                      // ISO 8601 timestamp
  path?: string;                          // Request path
  fieldErrors?: Record<string, string[]>; // Field-specific errors
  details?: Record<string, any>;          // Additional error details
}
```

**Example - Validation Error (400):**
```json
{
  "error": "Validation Error",
  "message": "Request validation failed",
  "statusCode": 400,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "path": "/api/v1/auth/login",
  "fieldErrors": {
    "email": ["Please provide a valid email address"],
    "password": ["Password must be at least 6 characters long"]
  }
}
```

**Example - Business Error (400):**
```json
{
  "error": "Business Error",
  "message": "Email already exists",
  "statusCode": 400,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "path": "/api/v1/auth/register",
  "details": {
    "errorCode": "EMAIL_EXISTS",
    "email": "user@example.com"
  }
}
```

**Example - Not Found (404):**
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

**Example - Unauthorized (401):**
```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials",
  "statusCode": 401,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "path": "/api/v1/auth/login"
}
```

**Example - Internal Server Error (500):**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "statusCode": 500,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "path": "/api/v1/users",
  "details": {
    "errorId": "abc-123-def",
    "stack": "Only in development mode"
  }
}
```

---

## 🔧 **HTTP Methods & Status Codes**

### Standard RESTful Mappings

| Method   | Action          | Success Code | Description                    |
|----------|-----------------|--------------|--------------------------------|
| `GET`    | Read            | `200 OK`     | Retrieve resource(s)           |
| `POST`   | Create          | `201 Created`| Create new resource            |
| `PUT`    | Replace         | `200 OK`     | Full resource replacement      |
| `PATCH`  | Update          | `200 OK`     | Partial resource update        |
| `DELETE` | Delete          | `204 No Content` | Delete resource (no body)  |

### Common Status Codes

#### Success (2xx)
- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `204 No Content` - Success with no response body (typically DELETE)

#### Client Errors (4xx)
- `400 Bad Request` - Validation error or business rule violation
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource does not exist
- `409 Conflict` - Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity` - Valid syntax but semantic errors

#### Server Errors (5xx)
- `500 Internal Server Error` - Unexpected server error
- `503 Service Unavailable` - Service temporarily unavailable

---

## 🌐 **REST API Conventions**

### 1. **URL Structure**

```
/{api-version}/{resource}/{identifier?}/{sub-resource?}
```

**Examples:**
```
GET    /api/v1/users                    # Get all users
GET    /api/v1/users/123                # Get user by ID
POST   /api/v1/users                    # Create user
PATCH  /api/v1/users/123                # Update user
DELETE /api/v1/users/123                # Delete user
GET    /api/v1/users/123/orders         # Get user's orders
```

### 2. **Naming Conventions**

✅ **DO:**
- Use **plural nouns** for collections: `/users`, `/orders`, `/products`
- Use **kebab-case** for multi-word resources: `/customer-orders`
- Use **lowercase** for all path segments
- Use **query parameters** for filtering/sorting: `/users?status=active&sort=name`

❌ **DON'T:**
- Use verbs in URLs: ❌ `/getUser`, ❌ `/createOrder`
- Use CamelCase or snake_case: ❌ `/userProfiles`, ❌ `/user_profiles`
- Mix singular and plural: ❌ `/user/123/orders`

### 3. **Query Parameters**

#### Pagination
```
GET /api/v1/translations?page=1&limit=10
```
- `page`: Current page number (1-indexed)
- `limit`: Items per page (default: 10, max: 100)

#### Filtering
```
GET /api/v1/languages?status=active
GET /api/v1/users?role=admin&isActive=true
```

#### Sorting
```
GET /api/v1/users?sortBy=createdAt&sortOrder=desc
```
- `sortBy`: Field name to sort by
- `sortOrder`: `asc` or `desc` (default: `asc`)

#### Searching
```
GET /api/v1/translations?search=hello
```
- `search`: Search term (searches across multiple fields)

#### Field Selection (Sparse Fieldsets)
```
GET /api/v1/users?fields=id,email,name
```

#### Including Related Resources
```
GET /api/v1/translations?include=language
```

### 4. **Request Headers**

```
Content-Type: application/json
Accept: application/json
Accept-Language: en
Authorization: Bearer <token>
```

### 5. **Request Body (POST/PATCH/PUT)**

**POST Example (Create):**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**PATCH Example (Partial Update):**
```json
{
  "name": "Jane Doe"
}
```

**PUT Example (Full Replacement):**
```json
{
  "email": "user@example.com",
  "password": "NewPass456!",
  "name": "Jane Doe",
  "isActive": true
}
```

---

## 🔍 **Validation & Error Handling**

### 1. **Input Validation**

All services MUST validate:
- **Required fields**: Return 400 with field errors
- **Data types**: Return 400 with field errors
- **Format constraints**: Email, phone, URL, etc.
- **Business rules**: Return 400 with business error

### 2. **Validation Error Format**

```json
{
  "error": "Validation Error",
  "message": "Request validation failed",
  "statusCode": 400,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "path": "/api/v1/auth/register",
  "fieldErrors": {
    "email": [
      "Email is required",
      "Please provide a valid email address"
    ],
    "password": [
      "Password must be at least 6 characters long",
      "Password must contain at least one uppercase letter"
    ]
  }
}
```

### 3. **Business Rule Violations**

```json
{
  "error": "Business Error",
  "message": "Email already exists",
  "statusCode": 400,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "path": "/api/v1/auth/register",
  "details": {
    "errorCode": "EMAIL_EXISTS",
    "field": "email",
    "value": "user@example.com"
  }
}
```

---

## 🛠️ **Implementation Guide**

### Step 1: Create Global Exception Filter

**File:** `src/infrastructure/filters/http-exception.filter.ts`

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseDto } from '@shared/infrastructure';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let errorResponse: ErrorResponseDto;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        const responseObj = exceptionResponse as any;

        // Handle validation errors from class-validator
        if (Array.isArray(responseObj.message)) {
          errorResponse = ErrorResponseDto.validation(
            'Request validation failed',
            this.formatValidationErrors(responseObj.message),
            request.url
          );
        } else {
          errorResponse = new ErrorResponseDto(
            responseObj.message || exception.message,
            status,
            responseObj.error || 'Error',
            request.url
          );
        }
      } else {
        errorResponse = new ErrorResponseDto(
          exception.message,
          status,
          'Error',
          request.url
        );
      }
    } else {
      // Unhandled errors
      console.error('Unhandled exception:', exception);
      errorResponse = ErrorResponseDto.internal(
        'Internal server error',
        request.url
      );
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private formatValidationErrors(messages: string[]): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};
    
    messages.forEach((message) => {
      // Parse messages like "email must be a valid email"
      const match = message.match(/^(\w+)\s+(.+)$/);
      if (match) {
        const [, field, error] = match;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(error);
      } else {
        if (!fieldErrors['general']) {
          fieldErrors['general'] = [];
        }
        fieldErrors['general'].push(message);
      }
    });

    return fieldErrors;
  }
}
```

### Step 2: Create Response Interceptor

**File:** `src/infrastructure/interceptors/transform.interceptor.ts`

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '@shared/infrastructure';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponseDto<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // If data is already wrapped in ApiResponseDto, return as is
        if (data && typeof data === 'object' && 'success' in data && 'statusCode' in data) {
          return data;
        }

        // Otherwise, wrap the data
        const statusCode = response.statusCode || 200;
        
        if (statusCode === 201) {
          return ApiResponseDto.created(data);
        } else if (statusCode === 204) {
          return ApiResponseDto.noContent();
        } else {
          return ApiResponseDto.success(data);
        }
      })
    );
  }
}
```

### Step 3: Register in main.ts

**File:** `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { TransformInterceptor } from './infrastructure/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response transformer
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validationError: { target: false },
    })
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Service is running on: http://localhost:${port}/api/v1`);
}

bootstrap();
```

---

## 📚 **Service-Specific Implementation Status**

### ✅ **Shared Infrastructure Package**

**Location:** `/shared/infrastructure/src/dto/`

- ✅ `ApiResponseDto` - Success response format
- ✅ `ErrorResponseDto` - Error response format
- ✅ `PaginationDto` - Pagination query parameters
- ✅ Custom exceptions: `ValidationException`, `BusinessException`, `NotFoundException`

**Status:** ✅ **DEFINED** but ❌ **NOT CONSISTENTLY USED**

### ⚠️ **Services Need Standardization**

| Service | Port | Status | Action Required |
|---------|------|--------|-----------------|
| Auth Service | 3001 | ⚠️ Partial | Add exception filter + interceptor |
| User Service | 3003 | ⚠️ Partial | Add exception filter + interceptor |
| Carrier Service | 3004 | ⚠️ Partial | Add exception filter + interceptor |
| Customer Service | 3005 | ⚠️ Partial | Add exception filter + interceptor |
| Pricing Service | 3006 | ⚠️ Partial | Add exception filter + interceptor |
| Translation Service | 3007 | ❌ Raw | Add exception filter + interceptor |

---

## 🎯 **Migration Strategy**

### Phase 1: Add Interceptors & Filters (Week 1)

1. Create `http-exception.filter.ts` in each service
2. Create `transform.interceptor.ts` in each service
3. Register both in `main.ts`
4. Test with existing endpoints

### Phase 2: Update Controllers (Week 2)

1. Update controller methods to return raw data
2. Let interceptor handle wrapping
3. Use custom exceptions for errors
4. Update tests

### Phase 3: Update Frontend (Week 3)

1. Update API client to handle new response format
2. Extract data from `response.data.data`
3. Handle new error format
4. Update error displays

### Phase 4: Documentation (Week 4)

1. Update Postman collections
2. Generate OpenAPI/Swagger documentation
3. Update API documentation
4. Training for team

---

## 📖 **Examples by Service**

### Auth Service

**Login Success:**
```json
POST /api/v1/auth/login
{
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin User"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful",
  "statusCode": 200,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "success": true
}
```

**Login Error:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials",
  "statusCode": 401,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "path": "/api/v1/auth/login"
}
```

### Translation Service

**Get Languages:**
```json
GET /api/v1/translation/languages
{
  "data": [
    {
      "code": "en",
      "name": "English",
      "localName": "English",
      "flag": "🇺🇸",
      "status": "active"
    },
    {
      "code": "es",
      "name": "Spanish",
      "localName": "Español",
      "flag": "🇪🇸",
      "status": "active"
    }
  ],
  "message": "Languages retrieved successfully",
  "statusCode": 200,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "success": true
}
```

**Get Translations (Paginated):**
```json
GET /api/v1/translation/translations?page=1&limit=10
{
  "data": {
    "items": [
      {
        "id": 1,
        "key": "welcome_message",
        "original": "Hello World",
        "destination": "[ES] Hola Mundo",
        "languageCode": "es"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  },
  "message": "Translations retrieved successfully",
  "statusCode": 200,
  "timestamp": "2025-10-19T14:30:00.000Z",
  "success": true
}
```

---

## 🔒 **Security Considerations**

1. **Never expose sensitive data in error messages**
   - ❌ "User with password 'abc123' not found"
   - ✅ "Invalid credentials"

2. **Sanitize error details in production**
   - Remove stack traces
   - Remove internal error IDs
   - Generic messages for 500 errors

3. **Rate limiting error responses**
   - Return 429 Too Many Requests
   - Include `Retry-After` header

4. **Authentication errors**
   - Use 401 for missing/invalid authentication
   - Use 403 for insufficient permissions
   - Don't reveal if user exists in login errors

---

## 📊 **Monitoring & Logging**

1. **Log all errors with context**
   ```typescript
   logger.error('User creation failed', {
     error: exception.message,
     stack: exception.stack,
     userId: request.user?.id,
     path: request.url,
     method: request.method,
   });
   ```

2. **Track error rates by type**
   - Validation errors (400)
   - Authentication errors (401)
   - Server errors (500)

3. **Alert on high error rates**
   - >10% 5xx errors
   - >50% 4xx errors
   - Sudden spikes

---

## ✅ **Checklist for New Endpoints**

- [ ] Use correct HTTP method (GET/POST/PATCH/DELETE)
- [ ] Return appropriate status code
- [ ] Wrap response in `ApiResponseDto`
- [ ] Use custom exceptions for errors
- [ ] Validate input with DTOs
- [ ] Add Swagger/OpenAPI documentation
- [ ] Test success and error cases
- [ ] Update Postman collection

---

## 🚀 **Next Steps**

1. **Review this document** with the team
2. **Decide on migration timeline**
3. **Create exception filter & interceptor templates**
4. **Update one service as POC** (recommend Translation Service)
5. **Validate with frontend team**
6. **Roll out to remaining services**
7. **Update all documentation**

---

## 📚 **References**

- [Google JSON Style Guide](https://google.github.io/styleguide/jsoncstyleguide.xml)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [JSON:API Specification](https://jsonapi.org/)
- [NestJS Exception Filters](https://docs.nestjs.com/exception-filters)
- [NestJS Interceptors](https://docs.nestjs.com/interceptors)

---

**Document Version:** 1.0  
**Last Updated:** October 19, 2025  
**Author:** Development Team  
**Status:** ⚠️ **PROPOSAL - NEEDS TEAM APPROVAL**
