# Structured Logging Developer Guide

## 🎯 Quick Start

### Using Winston Logger in Your Code

```typescript
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";

export class YourUseCase {
  private readonly logger = new WinstonLoggerService();

  constructor(...) {
    this.logger.setContext(YourUseCase.name);
  }

  async execute(dto: YourDto): Promise<Result> {
    try {
      this.logger.log("Operation started", { key: "value" });
      // Your business logic
      this.logger.log("Operation completed", { result: data });
      return result;
    } catch (error) {
      this.logger.error(`Operation failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

---

## 📊 Log Levels - When to Use

### **Info Level** - `logger.log()`
Use for important lifecycle events and successful operations.

**Examples**:
```typescript
// Operation start
this.logger.log("Creating new customer", { email: dto.email });

// Operation success
this.logger.log("Customer created successfully", { 
  customerId, 
  email, 
  fullName 
});

// State changes
this.logger.log("Customer activated", { customerId });
this.logger.log("Customer deactivated", { customerId });
```

**When to Use**:
- ✅ Operation entry points
- ✅ Successful completions
- ✅ Important state changes (activation, deactivation)
- ✅ Business events (creation, updates, deletions)

**When NOT to Use**:
- ❌ Debug/verbose information
- ❌ Query results (use debug instead)
- ❌ Expected failures (use warn instead)

---

### **Warn Level** - `logger.warn()`
Use for expected issues, validation failures, and business rule violations.

**Examples**:
```typescript
// Validation failures
this.logger.warn("Validation failed", { 
  customerId, 
  errors: validation.errors 
});

// Resource not found
this.logger.warn("Customer not found", { customerId: id });

// Conflicts
this.logger.warn("Email already exists", { 
  email, 
  existingCustomerId 
});

// Business rule violations
this.logger.warn("Cannot delete customer with existing orders", { 
  customerId 
});
```

**When to Use**:
- ✅ Validation failures
- ✅ Resource not found (expected)
- ✅ Conflicts (duplicate data)
- ✅ Business rule violations
- ✅ Expected edge cases

**When NOT to Use**:
- ❌ Unexpected errors (use error instead)
- ❌ Successful operations (use info instead)
- ❌ Debug information (use debug instead)

---

### **Debug Level** - `logger.debug()`
Use for detailed tracking, event publishing, and query operations.

**Examples**:
```typescript
// Detailed operation tracking
this.logger.debug("Getting customer by ID", { customerId: id });

// Event publishing
this.logger.debug("CustomerCreatedEvent published", { customerId });

// Query results
this.logger.debug("Retrieved all customers", { 
  total, 
  returned: customers.length, 
  page, 
  totalPages 
});

// Internal state
this.logger.debug("Preferences validated", { customerId, preferences });
```

**When to Use**:
- ✅ Query operations and results
- ✅ Event publishing confirmations
- ✅ Detailed operation tracking
- ✅ Internal state changes
- ✅ Development debugging

**When NOT to Use**:
- ❌ Production-critical information (use info instead)
- ❌ Errors or warnings
- ❌ High-frequency logs that clutter output

---

### **Error Level** - `logger.error()`
Use for unexpected failures and exceptions.

**Examples**:
```typescript
// Unexpected exceptions
try {
  // business logic
} catch (error) {
  this.logger.error(`Failed to create customer: ${error.message}`, error.stack);
  throw error;
}

// Database errors
this.logger.error(`Database operation failed: ${error.message}`, error.stack);

// External service failures
this.logger.error(`API call failed: ${error.message}`, error.stack);
```

**When to Use**:
- ✅ Unexpected exceptions
- ✅ Database errors
- ✅ External service failures
- ✅ System errors
- ✅ Critical failures

**When NOT to Use**:
- ❌ Expected exceptions (e.g., NotFoundException in query operations)
- ❌ Validation failures (use warn instead)
- ❌ Business rule violations (use warn instead)

**Special Note**: Error method signature is `error(message, trace)` not `error(message, metadata)`:
```typescript
// ✅ Correct
this.logger.error(`Operation failed: ${error.message}`, error.stack);

// ❌ Wrong
this.logger.error("Operation failed", { error });
```

---

## 🎨 Structured Metadata Best Practices

### ✅ Good Patterns

**Use Structured Objects**:
```typescript
this.logger.log("Customer updated", {
  customerId: id,
  updatedFields: Object.keys(dto),
  email: customer.email
});
```

**Include Contextual IDs**:
```typescript
this.logger.warn("Validation failed", {
  customerId: id,
  errors: validation.errors,
  operation: "update"
});
```

**Add Timestamps for Duration Tracking**:
```typescript
const startTime = Date.now();
// ... operation ...
this.logger.log("Operation completed", {
  customerId,
  duration: Date.now() - startTime
});
```

### ❌ Anti-Patterns to Avoid

**Don't Use String Interpolation**:
```typescript
// ❌ Bad
this.logger.log(`Customer ${customerId} created with email ${email}`);

// ✅ Good
this.logger.log("Customer created", { customerId, email });
```

**Don't Log Sensitive Data**:
```typescript
// ❌ Bad
this.logger.log("User authenticated", { password: dto.password });

// ✅ Good
this.logger.log("User authenticated", { userId, email });
```

**Don't Over-Log in Loops**:
```typescript
// ❌ Bad
customers.forEach(customer => {
  this.logger.debug("Processing customer", { customerId: customer.id });
});

// ✅ Good
this.logger.debug("Processing customers", { count: customers.length });
```

---

## 🔧 Error Handling Patterns

### Standard Try-Catch with Logging

```typescript
async execute(dto: CreateDto): Promise<Result> {
  try {
    this.logger.log("Operation started", { data: dto });
    
    // Business logic
    const result = await this.repository.save(entity);
    
    this.logger.log("Operation completed", { id: result.id });
    return result;
  } catch (error) {
    this.logger.error(`Operation failed: ${error.message}`, error.stack);
    throw error; // Re-throw for NestJS exception filters
  }
}
```

### Handling Expected Exceptions

```typescript
async findById(id: string): Promise<Customer> {
  try {
    const customer = await this.repository.findById(id);
    this.logger.debug("Customer found", { customerId: id });
    return customer;
  } catch (error) {
    if (error instanceof NotFoundException) {
      this.logger.warn("Customer not found", { customerId: id });
      // Don't log as error - this is expected behavior
    } else {
      this.logger.error(`Failed to find customer: ${error.message}`, error.stack);
    }
    throw error;
  }
}
```

### Validation Errors

```typescript
const validation = this.domainService.validateCustomer(customer);
if (!validation.isValid) {
  this.logger.warn("Validation failed", {
    customerId: customer.id,
    errors: validation.errors
  });
  throw new ValidationException(validation.errors);
}
```

---

## 🌐 HTTP Request/Response Logging

### Automatic Logging (Already Configured)

The `LoggingInterceptor` automatically logs all HTTP requests/responses:

```json
{
  "level": "info",
  "message": "POST /api/v1/customers - 201",
  "context": "HTTP",
  "metadata": {
    "method": "POST",
    "url": "/api/v1/customers",
    "statusCode": 201,
    "duration": 150,
    "correlationId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-123"
  }
}
```

### Correlation IDs

Correlation IDs are automatically added to all logs within a request context:

```typescript
// No need to manually add correlation ID
// It's automatically available via AsyncLocalStorage
this.logger.log("Operation completed", { customerId });

// Output includes correlation ID:
// {
//   "correlationId": "550e8400-e29b-41d4-a716-446655440000",
//   "message": "Operation completed",
//   "metadata": { "customerId": "..." }
// }
```

---

## 🧪 Testing with Winston Logger

### Jest Configuration

Add to `package.json`:

```json
{
  "jest": {
    "moduleNameMapper": {
      "^@shared/infrastructure/(.*)$": "<rootDir>/../../shared/infrastructure/src/$1"
    }
  }
}
```

### Mocking Logger in Tests (Optional)

```typescript
describe("YourUseCase", () => {
  let useCase: YourUseCase;
  let mockLogger: jest.Mocked<WinstonLoggerService>;

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      setContext: jest.fn(),
    } as any;

    useCase = new YourUseCase(dependencies);
    (useCase as any).logger = mockLogger;
  });

  it("should log operation", async () => {
    await useCase.execute(dto);
    expect(mockLogger.log).toHaveBeenCalledWith(
      "Operation started",
      expect.any(Object)
    );
  });
});
```

### Test Output

Winston logs will appear during test execution (expected behavior):

```
 PASS  src/application/use-cases/create-customer.use-case.spec.ts
  CreateCustomerUseCase
    ✓ should create customer successfully (25 ms)
    ✓ should handle validation errors (18 ms)

{"level":"info","message":"Creating new customer",...}
{"level":"warn","message":"Validation failed",...}
```

---

## 🚀 Production Deployment

### Environment Variables

Configure log levels via environment variables:

```bash
# .env
LOG_LEVEL=info  # production
# LOG_LEVEL=debug  # development
```

### Log Aggregation

Logs are in JSON format, compatible with:

**Grafana Loki + Promtail**:
```yaml
# promtail-config.yml
scrape_configs:
  - job_name: customer-service
    static_configs:
      - targets:
          - localhost
        labels:
          job: customer-service
          __path__: /var/log/customer-service/*.log
```

**CloudWatch**:
```typescript
// Logs automatically stream to CloudWatch with JSON format
```

**Elasticsearch**:
```typescript
// JSON logs can be indexed directly
```

### Querying Logs

**LogQL (Grafana Loki)**:
```logql
# All errors for customer service
{job="customer-service"} | json | level="error"

# Specific customer operations
{job="customer-service"} | json | customerId="550e8400-e29b-41d4-a716-446655440000"

# Slow operations
{job="customer-service"} | json | duration > 1000
```

**CloudWatch Insights**:
```sql
fields @timestamp, message, metadata.customerId
| filter level = "error"
| sort @timestamp desc
```

---

## 📚 Log Message Guidelines

### ✅ Good Messages

**Clear and Actionable**:
```typescript
this.logger.log("Customer created successfully", { customerId, email });
this.logger.warn("Email already exists", { email, existingCustomerId });
this.logger.error(`Failed to create customer: ${error.message}`, error.stack);
```

**Include Context**:
```typescript
this.logger.log("Customer updated", { 
  customerId, 
  updatedFields: Object.keys(dto),
  userId: currentUser.id 
});
```

### ❌ Bad Messages

**Too Vague**:
```typescript
this.logger.log("Success"); // What succeeded?
this.logger.error("Error"); // What error?
```

**Too Verbose**:
```typescript
this.logger.log(`Starting the process of creating a new customer with the following details: ${JSON.stringify(dto)}`);
```

**No Context**:
```typescript
this.logger.warn("Not found"); // What wasn't found? What ID?
```

---

## 🔍 Debugging Tips

### Finding Logs for Specific Request

Use correlation ID:
```bash
# In Loki
{job="customer-service"} | json | correlationId="550e8400-e29b-41d4-a716-446655440000"
```

### Finding All Errors

```bash
# In Loki
{job="customer-service"} | json | level="error"

# In CloudWatch
fields @timestamp, message
| filter level = "error"
| sort @timestamp desc
| limit 100
```

### Tracking Customer Operations

```bash
# In Loki
{job="customer-service"} | json | customerId="customer-id-here"
```

### Performance Analysis

```typescript
// Add duration tracking
const startTime = Date.now();
// ... operation ...
this.logger.log("Operation completed", { 
  customerId, 
  duration: Date.now() - startTime 
});

// Query slow operations
{job="customer-service"} | json | duration > 1000
```

---

## 📖 Complete Example

```typescript
import { Injectable } from "@nestjs/common";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";

@Injectable()
export class CreateOrderUseCase {
  private readonly logger = new WinstonLoggerService();

  constructor(
    private readonly repository: OrderRepository,
    private readonly validator: OrderValidator,
    private readonly eventBus: EventBus
  ) {
    this.logger.setContext(CreateOrderUseCase.name);
  }

  async execute(dto: CreateOrderDto): Promise<Order> {
    try {
      // Entry log with context
      this.logger.log("Creating new order", {
        customerId: dto.customerId,
        itemCount: dto.items.length,
        totalAmount: dto.totalAmount
      });

      // Validation with warning
      const validation = this.validator.validate(dto);
      if (!validation.isValid) {
        this.logger.warn("Order validation failed", {
          customerId: dto.customerId,
          errors: validation.errors
        });
        throw new ValidationException(validation.errors);
      }

      // Business logic
      const order = await this.repository.create(dto);

      // Success log
      this.logger.log("Order created successfully", {
        orderId: order.id,
        customerId: dto.customerId,
        totalAmount: order.totalAmount
      });

      // Event publishing with debug
      await this.eventBus.publish(new OrderCreatedEvent(order));
      this.logger.debug("OrderCreatedEvent published", {
        orderId: order.id
      });

      return order;
    } catch (error) {
      // Error log with stack trace
      this.logger.error(
        `Failed to create order: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
```

---

## 📊 Summary

### Key Principles
1. **Use appropriate log levels**: Info for success, warn for expected issues, debug for details, error for failures
2. **Add structured metadata**: Use objects, not string interpolation
3. **Include context**: Customer IDs, operation names, user IDs
4. **Handle errors properly**: Log with stack traces, then re-throw
5. **Don't over-log**: Be selective about what you log
6. **Never log sensitive data**: Passwords, tokens, credit cards, etc.

### Quick Reference

| Level | Method | Use For | Example |
|-------|--------|---------|---------|
| Info | `logger.log()` | Success, lifecycle events | Operation completed |
| Warn | `logger.warn()` | Validation, expected issues | Validation failed |
| Debug | `logger.debug()` | Detailed tracking | Event published |
| Error | `logger.error()` | Unexpected failures | Database error |

---

**Last Updated**: January 2024  
**For Questions**: See PHASE-16-STRUCTURED-LOGGING-SUMMARY.md
