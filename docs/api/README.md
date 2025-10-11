# API Documentation

## 🔌 API Documentation and Testing

This directory contains all API-related documentation, including Postman collections, testing guides, and API specifications.

## 📋 Documents

### Postman Collections
- **[Postman README](postman-readme.md)** - Postman collection setup and usage
- **[Postman Scripts README](postman-scripts-readme.md)** - Postman script documentation
- **[Translation Testing README](translation-testing-readme.md)** - Translation API testing guide
- **[Postman Upload README](postman-upload-readme.md)** - Postman collection upload instructions

## 🎯 API Overview

### Backend APIs
- **NestJS API**: Main application API with full CRUD operations
- **Go API**: Secondary service API (if applicable)
- **Authentication API**: JWT-based authentication endpoints
- **Translation API**: Multi-language translation endpoints

### API Features
- **RESTful Design**: Standard REST API patterns
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive input validation
- **Error Handling**: Standardized error responses
- **Multi-language Support**: Translation endpoints

## 🔐 Authentication

### JWT Token System
- **Login Endpoint**: `/api/v1/auth/login`
- **Register Endpoint**: `/api/v1/auth/register`
- **Token Refresh**: Automatic token refresh
- **Role-Based Access**: Granular permission system

### API Security
- **Bearer Token**: Include in Authorization header
- **CORS Configuration**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting protection
- **Input Sanitization**: XSS and injection prevention

## 📊 API Endpoints

### User Management
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Customer Management
- `GET /api/v1/customers` - List customers
- `POST /api/v1/customers` - Create customer
- `GET /api/v1/customers/:id` - Get customer by ID
- `PATCH /api/v1/customers/:id` - Update customer
- `DELETE /api/v1/customers/:id` - Delete customer

### Carrier Management
- `GET /api/v1/carriers` - List carriers
- `POST /api/v1/carriers` - Create carrier
- `GET /api/v1/carriers/:id` - Get carrier by ID
- `PATCH /api/v1/carriers/:id` - Update carrier
- `DELETE /api/v1/carriers/:id` - Delete carrier

### Translation System
- `GET /api/v1/languages` - List supported languages
- `GET /api/v1/translations` - Get translations
- `POST /api/v1/translations` - Create translation
- `PATCH /api/v1/translations/:key` - Update translation

## 🧪 Testing with Postman

### Collection Setup
1. **Import Collection**: Import the provided Postman collection
2. **Environment Variables**: Set up environment variables
3. **Authentication**: Configure JWT token authentication
4. **Base URL**: Set the API base URL

### Testing Workflow
1. **Authentication**: Login to get JWT token
2. **API Calls**: Test various endpoints
3. **Validation**: Verify response formats
4. **Error Handling**: Test error scenarios

### Environment Variables
- `baseUrl`: API base URL (e.g., http://localhost:3001)
- `token`: JWT authentication token
- `userId`: Current user ID for testing
- `customerId`: Customer ID for testing

## 📝 API Response Formats

### Success Response
```json
{
  "data": {
    "id": 1,
    "name": "Example",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Success",
  "statusCode": 200
}
```

### Error Response
```json
{
  "message": "Validation failed",
  "error": "Bad Request",
  "statusCode": 400,
  "validationErrors": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

### Pagination Response
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "message": "Success",
  "statusCode": 200
}
```

## 🔍 API Testing Best Practices

### Test Coverage
- **Happy Path**: Test successful operations
- **Error Cases**: Test error scenarios
- **Edge Cases**: Test boundary conditions
- **Security**: Test authentication and authorization

### Test Data
- **Valid Data**: Use valid test data
- **Invalid Data**: Test with invalid inputs
- **Boundary Values**: Test min/max values
- **Special Characters**: Test with special characters

### Performance Testing
- **Response Time**: Monitor API response times
- **Load Testing**: Test under load conditions
- **Concurrent Users**: Test multiple concurrent users
- **Resource Usage**: Monitor server resources

## 🚀 API Development Guidelines

### Endpoint Design
- **RESTful URLs**: Use standard REST patterns
- **HTTP Methods**: Use appropriate HTTP methods
- **Status Codes**: Return correct HTTP status codes
- **Consistent Naming**: Use consistent naming conventions

### Request/Response
- **JSON Format**: Use JSON for data exchange
- **Validation**: Validate all inputs
- **Error Messages**: Provide clear error messages
- **Documentation**: Document all endpoints

### Security
- **Authentication**: Require authentication for protected endpoints
- **Authorization**: Check user permissions
- **Input Validation**: Validate and sanitize inputs
- **Rate Limiting**: Implement rate limiting

## 📊 API Monitoring

### Metrics to Track
- **Response Time**: Average response time
- **Error Rate**: Percentage of failed requests
- **Throughput**: Requests per second
- **Availability**: API uptime percentage

### Logging
- **Request Logging**: Log all API requests
- **Error Logging**: Log all errors and exceptions
- **Performance Logging**: Log performance metrics
- **Security Logging**: Log security-related events

## 🔧 API Tools and Resources

### Development Tools
- **Postman**: API testing and documentation
- **Insomnia**: Alternative API client
- **Swagger**: API documentation generation
- **Newman**: Command-line Postman runner

### Monitoring Tools
- **Application Insights**: Application monitoring
- **New Relic**: Performance monitoring
- **DataDog**: Infrastructure monitoring
- **Grafana**: Metrics visualization

## 📞 Support and Resources

### Documentation
- **API Reference**: Complete API documentation
- **Postman Collection**: Ready-to-use API collection
- **Testing Guide**: Step-by-step testing instructions
- **Error Codes**: Complete error code reference

### External Resources
- **REST API Design**: https://restfulapi.net/
- **HTTP Status Codes**: https://httpstatuses.com/
- **JWT Documentation**: https://jwt.io/
- **Postman Learning**: https://learning.postman.com/

---

**Last Updated**: $(date)
**Version**: 1.0.0

