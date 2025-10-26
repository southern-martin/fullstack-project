# Unit Testing Quick Reference

## 🚀 Quick Commands

### Run All Tests
```bash
cd customer-service
npm test
```

### Run Tests with Coverage
```bash
cd customer-service
npm run test:cov
```

### Run Specific Test File
```bash
cd customer-service
npm test src/domain/services/__tests__/customer.domain.service.spec.ts
npm test src/application/use-cases/__tests__/create-customer.use-case.spec.ts
```

### Run Tests in Watch Mode
```bash
cd customer-service
npm test -- --watch
```

### Run Tests with Verbose Output
```bash
cd customer-service
npm test -- --verbose
```

## 📊 Current Test Status

### Customer Service Tests

| Test Suite | Tests | Coverage | Status |
|------------|-------|----------|--------|
| CustomerDomainService | 35 | 92% | ✅ Passing |
| CreateCustomerUseCase | 14 | 100% | ✅ Passing |
| **Total** | **49** | **92-100%** | **✅ All Passing** |

## 🧪 Test Files

### Domain Layer Tests
```
customer-service/src/domain/services/__tests__/
└── customer.domain.service.spec.ts (35 tests)
```

### Application Layer Tests
```
customer-service/src/application/use-cases/__tests__/
└── create-customer.use-case.spec.ts (13 tests + 1 setup)
```

## 📝 Test Patterns

### Arrange-Act-Assert Structure
```typescript
it('should successfully create a customer', async () => {
  // Arrange
  const dto = { ... };
  mockRepository.create.mockResolvedValue(savedCustomer);
  
  // Act
  const result = await useCase.execute(dto);
  
  // Assert
  expect(result).toBeDefined();
  expect(result.email).toBe(dto.email);
});
```

### Mocking Repositories
```typescript
const mockRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
```

### Mocking Event Bus
```typescript
const mockEventBus = {
  publish: jest.fn(),
  subscribe: jest.fn(),
};
```

## 🎯 Coverage Targets

- **Minimum Coverage**: 80%
- **Current Coverage**: 92-100%
- **Target Components**:
  - Domain Services: 100%
  - Use Cases: 100%
  - Controllers: 80%+ (integration tests)

## 🔍 Debugging Tests

### Run Single Test
```bash
npm test -- -t "should successfully create a customer"
```

### Run Tests for Specific Suite
```bash
npm test -- -t "validateCustomerCreationData"
```

### View Coverage Report
```bash
npm run test:cov
# Open coverage/lcov-report/index.html in browser
```

## 📦 Test Dependencies

```json
{
  "devDependencies": {
    "@nestjs/testing": "^10.0.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "@types/jest": "^29.5.0"
  }
}
```

## 🛠️ Common Issues & Solutions

### Issue: Tests Not Finding Modules
**Solution**: Check `tsconfig.json` paths and `moduleNameMapper` in `jest.config.js`

### Issue: Mock Type Errors
**Solution**: Use `jest.Mocked<T>` for interface mocks, real instances for services

### Issue: Async Test Timeout
**Solution**: Increase Jest timeout or use `--testTimeout` flag
```bash
npm test -- --testTimeout=10000
```

### Issue: Coverage Not Generated
**Solution**: Ensure `collectCoverageFrom` in `jest.config.js` includes test targets

## 📚 Best Practices

1. **Test Naming**: Use descriptive names starting with "should"
2. **Test Organization**: Group related tests in `describe` blocks
3. **Mock Everything External**: Databases, APIs, event buses
4. **Test Edge Cases**: Boundary conditions, invalid inputs, errors
5. **One Assertion Focus**: Each test should verify one specific behavior
6. **Clean Mocks**: Reset mocks in `beforeEach` hooks
7. **DRY Principle**: Extract common test data to constants

## 🎓 Next Steps

1. **Add More Use Case Tests**
   - UpdateCustomerUseCase
   - DeleteCustomerUseCase
   - GetCustomerUseCase

2. **Add Controller Tests**
   - Integration tests for CustomerController
   - Request/response validation
   - Error handling

3. **Add E2E Tests**
   - Full customer creation flow
   - API endpoint testing
   - Database integration

4. **Extend to Other Services**
   - Pricing Service tests
   - Carrier Service tests
   - User Service tests

---

**Quick Start**: `cd customer-service && npm test`  
**Coverage Report**: `cd customer-service && npm run test:cov`  
**Current Status**: ✅ 49/49 tests passing
