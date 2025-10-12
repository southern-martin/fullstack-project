# 🛠️ Development Scripts

This directory contains development and configuration scripts for the Fullstack Project.

## 📁 Files

### `debug-simple.js`
**Purpose:** Simple debugging utility for React Admin development
**Features:**
- ✅ Component debugging
- ✅ State inspection
- ✅ Performance monitoring
- ✅ Error tracking

**Usage:**
```bash
# From project root
node scripts/development/debug-simple.js
```

### `.eslintrc.js`
**Purpose:** ESLint configuration for React Admin
**Features:**
- ✅ Code quality rules
- ✅ React-specific linting
- ✅ TypeScript support
- ✅ Accessibility rules

**Usage:**
```bash
# Lint React Admin code
cd react-admin && npm run lint

# Auto-fix linting issues
cd react-admin && npm run lint:fix
```

### `craco.config.js`
**Purpose:** CRACO (Create React App Configuration Override) configuration
**Features:**
- ✅ Webpack customization
- ✅ Build optimization
- ✅ Development server configuration
- ✅ Plugin management

**Usage:**
```bash
# Development server with custom config
cd react-admin && npm start

# Build with custom configuration
cd react-admin && npm run build
```

## 🚀 Quick Start

### 1. Development Setup
```bash
# Start development server with debugging
node scripts/development/debug-simple.js

# Start React Admin with custom config
cd react-admin && npm start
```

### 2. Code Quality
```bash
# Run ESLint
cd react-admin && npm run lint

# Fix linting issues
cd react-admin && npm run lint:fix

# Type checking
cd react-admin && npm run type-check
```

### 3. Build Process
```bash
# Development build
cd react-admin && npm run build:dev

# Production build
cd react-admin && npm run build

# Analyze bundle
cd react-admin && npm run analyze
```

## 🔧 Configuration

### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    '@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  rules: {
    // Custom rules here
  }
};
```

### CRACO Configuration
```javascript
// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Custom webpack configuration
      return webpackConfig;
    }
  },
  devServer: {
    // Custom dev server configuration
  }
};
```

### Debug Configuration
```javascript
// debug-simple.js
const debugConfig = {
  enableConsoleLogging: true,
  enablePerformanceMonitoring: true,
  enableErrorTracking: true,
  logLevel: 'debug'
};
```

## 📊 Development Tools

### 🔍 Debugging Tools
- **React DevTools:** Component inspection
- **Redux DevTools:** State management debugging
- **Network Tab:** API call monitoring
- **Console:** Error and log tracking

### 🎨 Styling Tools
- **Tailwind CSS:** Utility-first styling
- **CSS Modules:** Scoped styling
- **PostCSS:** CSS processing
- **Autoprefixer:** Browser compatibility

### 🏗️ Build Tools
- **Webpack:** Module bundling
- **Babel:** JavaScript transpilation
- **TypeScript:** Type checking
- **ESLint:** Code quality

## 🧪 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Start development server
cd react-admin && npm start

# Run debugging tools
node scripts/development/debug-simple.js

# Make changes and test
# Commit changes
git add .
git commit -m "feat: add new feature"
```

### 2. Code Quality Checks
```bash
# Run linting
cd react-admin && npm run lint

# Fix auto-fixable issues
cd react-admin && npm run lint:fix

# Type checking
cd react-admin && npm run type-check

# Run tests
cd react-admin && npm test
```

### 3. Build and Deploy
```bash
# Build for production
cd react-admin && npm run build

# Test production build
node scripts/testing/test-built-app.js

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## 🔧 Environment Configuration

### Development Environment
```bash
# .env.development
REACT_APP_API_URL=http://localhost:3001
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
```

### Production Environment
```bash
# .env.production
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error
```

### Local Environment
```bash
# .env.local
REACT_APP_API_URL=http://localhost:3001
REACT_APP_MOCK_SERVER=true
```

## 📋 Development Checklist

### Before Starting Development
- [ ] Pull latest changes from main branch
- [ ] Install dependencies: `npm install`
- [ ] Start required services (database, mock server)
- [ ] Run linting: `npm run lint`
- [ ] Run tests: `npm test`

### During Development
- [ ] Follow coding standards
- [ ] Write meaningful commit messages
- [ ] Test changes thoroughly
- [ ] Update documentation if needed
- [ ] Check for console errors

### Before Committing
- [ ] Run linting: `npm run lint`
- [ ] Fix all linting issues
- [ ] Run type checking: `npm run type-check`
- [ ] Run tests: `npm test`
- [ ] Build successfully: `npm run build`

## 🚨 Troubleshooting

### Common Issues

1. **ESLint Errors**
   ```bash
   # Check ESLint configuration
   cat scripts/development/.eslintrc.js
   
   # Run with verbose output
   cd react-admin && npx eslint src/ --debug
   
   # Fix auto-fixable issues
   cd react-admin && npx eslint src/ --fix
   ```

2. **Build Failures**
   ```bash
   # Clear build cache
   cd react-admin && rm -rf build/ node_modules/.cache/
   
   # Reinstall dependencies
   cd react-admin && npm install
   
   # Check TypeScript errors
   cd react-admin && npx tsc --noEmit
   ```

3. **Development Server Issues**
   ```bash
   # Kill existing processes
   pkill -f "react-scripts"
   
   # Clear port
   lsof -ti:3000 | xargs kill -9
   
   # Restart development server
   cd react-admin && npm start
   ```

4. **Debug Script Issues**
   ```bash
   # Check Node.js version
   node --version
   
   # Run with debug output
   DEBUG=* node scripts/development/debug-simple.js
   
   # Check file permissions
   ls -la scripts/development/debug-simple.js
   ```

### Performance Issues

1. **Slow Build Times**
   ```bash
   # Analyze bundle
   cd react-admin && npm run analyze
   
   # Check webpack configuration
   cat scripts/development/craco.config.js
   
   # Optimize dependencies
   cd react-admin && npm audit fix
   ```

2. **Memory Issues**
   ```bash
   # Monitor memory usage
   node --inspect scripts/development/debug-simple.js
   
   # Increase Node.js memory limit
   NODE_OPTIONS="--max-old-space-size=4096" npm start
   ```

## 🔄 Hot Reloading

### Development Server
```bash
# Start with hot reloading
cd react-admin && npm start

# Custom hot reload configuration
HOT_RELOAD=true npm start
```

### Mock Server
```bash
# Start mock server with auto-restart
nodemon scripts/mock-servers/comprehensive-mock-server.js
```

## 📝 Best Practices

### Code Organization
- Use consistent file naming conventions
- Organize components by feature
- Keep utility functions separate
- Document complex logic

### Performance
- Use React.memo for expensive components
- Implement proper error boundaries
- Optimize bundle size
- Monitor performance metrics

### Testing
- Write unit tests for utilities
- Test component behavior
- Mock external dependencies
- Maintain test coverage

## 🎯 Development Goals

### Short Term
- ✅ Set up development environment
- ✅ Configure build tools
- ✅ Implement debugging utilities
- ✅ Establish code quality standards

### Medium Term
- 🔄 Improve build performance
- 🔄 Enhance debugging tools
- 🔄 Add automated testing
- 🔄 Optimize development workflow

### Long Term
- 🔄 Implement CI/CD pipeline
- 🔄 Add performance monitoring
- 🔄 Enhance developer experience
- 🔄 Maintain code quality standards

---

**🎉 Happy developing!** 🛠️
