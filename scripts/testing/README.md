# 🧪 Testing Scripts

This directory contains testing and validation scripts for the Fullstack Project.

## 📁 Files

### `test-db-connection.js`
**Purpose:** Test database connectivity for Auth Service
**Features:**
- ✅ Database connection testing
- ✅ Connection pool validation
- ✅ Error handling and reporting
- ✅ Environment configuration testing

**Usage:**
```bash
# From project root
node scripts/testing/test-db-connection.js
```

### `test-built-app.js`
**Purpose:** Test the built React Admin application
**Features:**
- ✅ Built app validation
- ✅ Static file serving test
- ✅ Route testing
- ✅ Performance checks

**Usage:**
```bash
# From project root
node scripts/testing/test-built-app.js
```

### `test-current-state.js`
**Purpose:** Test current application state and functionality
**Features:**
- ✅ Component state validation
- ✅ API integration testing
- ✅ User flow testing
- ✅ Error boundary testing

**Usage:**
```bash
# From project root
node scripts/testing/test-current-state.js
```

### `test-new-architecture.js`
**Purpose:** Test new microservices architecture
**Features:**
- ✅ Service discovery testing
- ✅ Inter-service communication
- ✅ Load balancing validation
- ✅ Failover testing

**Usage:**
```bash
# From project root
node scripts/testing/test-new-architecture.js
```

### `test-tailwind.js`
**Purpose:** Test Tailwind CSS integration and styling
**Features:**
- ✅ CSS compilation testing
- ✅ Class name validation
- ✅ Responsive design testing
- ✅ Theme configuration testing

**Usage:**
```bash
# From project root
node scripts/testing/test-tailwind.js
```

## 🚀 Quick Start

### 1. Database Connection Test
```bash
# Test Auth Service database connection
node scripts/testing/test-db-connection.js
```

### 2. Application Testing
```bash
# Test built React Admin app
node scripts/testing/test-built-app.js

# Test current application state
node scripts/testing/test-current-state.js
```

### 3. Architecture Testing
```bash
# Test new microservices architecture
node scripts/testing/test-new-architecture.js
```

### 4. Styling Tests
```bash
# Test Tailwind CSS integration
node scripts/testing/test-tailwind.js
```

## 🔧 Configuration

### Environment Variables
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database

# API Configuration
API_BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# Test Configuration
TEST_TIMEOUT=30000
TEST_RETRIES=3
```

### Test Data
```bash
# Test Users
TEST_ADMIN_EMAIL=admin@example.com
TEST_ADMIN_PASSWORD=Admin123
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=Admin123
```

## 📊 Test Categories

### 🔗 Integration Tests
- Database connectivity
- API endpoint functionality
- Service communication
- Authentication flow

### 🎨 UI Tests
- Component rendering
- User interactions
- Responsive design
- Accessibility

### 🏗️ Architecture Tests
- Service discovery
- Load balancing
- Failover mechanisms
- Performance metrics

### 🔒 Security Tests
- Authentication validation
- Authorization checks
- Input sanitization
- CORS configuration

## 🧪 Test Execution

### Individual Tests
```bash
# Run specific test
node scripts/testing/test-db-connection.js
node scripts/testing/test-built-app.js
node scripts/testing/test-current-state.js
node scripts/testing/test-new-architecture.js
node scripts/testing/test-tailwind.js
```

### Batch Testing
```bash
# Run all tests
for test in scripts/testing/test-*.js; do
  echo "Running $test..."
  node "$test"
  echo "Completed $test"
  echo "---"
done
```

### Continuous Testing
```bash
# Watch mode for development
nodemon scripts/testing/test-*.js
```

## 📋 Test Results

### Expected Outputs

**Database Connection Test:**
```
✅ Database connection successful
✅ Connection pool initialized
✅ Environment variables loaded
✅ Test queries executed
```

**Built App Test:**
```
✅ Static files served correctly
✅ Routes accessible
✅ Performance metrics within limits
✅ No console errors
```

**Current State Test:**
```
✅ Components render correctly
✅ API calls successful
✅ User flows working
✅ Error handling functional
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database service
   sudo systemctl status mysql
   
   # Verify credentials
   mysql -u username -p -h localhost
   
   # Check environment variables
   echo $DB_HOST $DB_PORT $DB_USERNAME
   ```

2. **API Tests Failing**
   ```bash
   # Check if services are running
   curl http://localhost:3001/health
   
   # Verify CORS configuration
   curl -H "Origin: http://localhost:3000" http://localhost:3001/api/v1/auth/health
   ```

3. **Build Tests Failing**
   ```bash
   # Rebuild the application
   cd react-admin && npm run build
   
   # Check build output
   ls -la react-admin/build/
   ```

4. **Tailwind Tests Failing**
   ```bash
   # Rebuild CSS
   cd react-admin && npm run build:css
   
   # Check Tailwind config
   cat react-admin/tailwind.config.js
   ```

### Debug Mode

Enable verbose output:
```bash
# Set debug environment
export DEBUG=*
export NODE_ENV=development

# Run tests with debug info
node scripts/testing/test-db-connection.js
```

## 📈 Performance Testing

### Load Testing
```bash
# Test API endpoints under load
for i in {1..100}; do
  curl -s http://localhost:3001/api/v1/auth/health > /dev/null &
done
wait
```

### Memory Testing
```bash
# Monitor memory usage
node --inspect scripts/testing/test-current-state.js
```

### Response Time Testing
```bash
# Measure response times
time curl -s http://localhost:3001/api/v1/auth/health
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
- name: Run Tests
  run: |
    node scripts/testing/test-db-connection.js
    node scripts/testing/test-built-app.js
    node scripts/testing/test-current-state.js
```

### Docker Testing
```bash
# Test in Docker environment
docker run --rm -v $(pwd):/app -w /app node:18 node scripts/testing/test-db-connection.js
```

## 📝 Best Practices

1. **Test Isolation:** Each test should be independent
2. **Clean State:** Reset state between tests
3. **Error Handling:** Test both success and failure cases
4. **Performance:** Monitor test execution time
5. **Documentation:** Document test scenarios and expected results

## 🎯 Test Coverage

### Areas Covered
- ✅ Database connectivity
- ✅ API functionality
- ✅ User authentication
- ✅ Component rendering
- ✅ Service communication
- ✅ Error handling
- ✅ Performance metrics

### Areas to Expand
- 🔄 End-to-end user flows
- 🔄 Cross-browser compatibility
- 🔄 Mobile responsiveness
- 🔄 Accessibility compliance
- 🔄 Security vulnerability scanning

---

**🎉 Happy testing!** 🧪
