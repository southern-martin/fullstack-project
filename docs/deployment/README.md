# Deployment Documentation

## 🚀 Deployment and Build Instructions

This directory contains documentation for building, deploying, and managing the fullstack ecommerce project in various environments.

## 📋 Documents

### Build and Deployment
- **[Build README](BUILD-README.md)** - Comprehensive build and deployment guide
- **[Build Instructions](README-BUILD.md)** - Step-by-step build instructions

## 🎯 Deployment Overview

### Project Structure
- **NestJS API**: Backend API server
- **React Admin**: Frontend admin application
- **Go API**: Secondary backend service (if applicable)
- **MySQL Database**: Primary data storage
- **Translation System**: Multi-language support

### Deployment Environments
- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live production environment
- **Docker**: Containerized deployment option

## 🏗️ Build Process

### Backend Build (NestJS)
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run database migrations
npm run migration:run

# Start production server
npm run start:prod
```

### Frontend Build (React)
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Serve static files
npm run serve
```

### Go API Build (if applicable)
```bash
# Build Go application
go build -o main

# Run application
./main
```

## 🐳 Docker Deployment

### Docker Compose Setup
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: ecommerce
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  nestjs-api:
    build: ./nestjs-app-api
    ports:
      - "3001:3001"
    environment:
      - DATABASE_HOST=mysql
      - DATABASE_PORT=3306
    depends_on:
      - mysql

  react-admin:
    build: ./react-admin
    ports:
      - "3000:3000"
    depends_on:
      - nestjs-api

volumes:
  mysql_data:
```

### Docker Commands
```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## 🌐 Environment Configuration

### Environment Variables

#### NestJS API (.env)
```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
DATABASE_NAME=ecommerce

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

#### React Admin (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_VERSION=v1

# Environment
NODE_ENV=production
```

### Environment-Specific Configurations

#### Development
- **Database**: Local MySQL instance
- **API URL**: http://localhost:3001
- **Frontend URL**: http://localhost:3000
- **Debug Mode**: Enabled
- **Hot Reload**: Enabled

#### Staging
- **Database**: Staging MySQL instance
- **API URL**: https://api-staging.example.com
- **Frontend URL**: https://admin-staging.example.com
- **Debug Mode**: Limited
- **Monitoring**: Enabled

#### Production
- **Database**: Production MySQL cluster
- **API URL**: https://api.example.com
- **Frontend URL**: https://admin.example.com
- **Debug Mode**: Disabled
- **Monitoring**: Full monitoring
- **SSL**: Required

## 🗄️ Database Deployment

### Migration Strategy
```bash
# Run migrations
npm run migration:run

# Rollback migrations
npm run migration:revert

# Generate new migration
npm run migration:generate -- -n MigrationName

# Check migration status
npm run migration:show
```

### Database Setup
```sql
-- Create database
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'ecommerce_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'%';
FLUSH PRIVILEGES;
```

### Seed Data
```bash
# Run seed data
npm run seed

# Run seed for development
npm run seed:dev
```

## 🔧 Build Scripts

### Package.json Scripts

#### Backend (NestJS)
```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "migration:run": "typeorm migration:run",
    "migration:revert": "typeorm migration:revert",
    "migration:generate": "typeorm migration:generate",
    "seed": "ts-node src/seed-data.ts"
  }
}
```

#### Frontend (React)
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "serve": "serve -s build -l 3000"
  }
}
```

## 🚀 Deployment Strategies

### Manual Deployment
1. **Build Applications**: Build both frontend and backend
2. **Database Setup**: Run migrations and seed data
3. **File Upload**: Upload built files to server
4. **Service Start**: Start application services
5. **Health Check**: Verify deployment success

### Automated Deployment
1. **CI/CD Pipeline**: Automated build and test
2. **Artifact Creation**: Create deployment artifacts
3. **Environment Deployment**: Deploy to target environment
4. **Health Monitoring**: Monitor deployment health
5. **Rollback Capability**: Automatic rollback on failure

### Blue-Green Deployment
1. **Green Environment**: Current production environment
2. **Blue Environment**: New deployment environment
3. **Traffic Switch**: Switch traffic to blue environment
4. **Verification**: Verify new deployment
5. **Cleanup**: Clean up old green environment

## 📊 Monitoring and Health Checks

### Health Check Endpoints
```typescript
// Backend health check
GET /api/health

// Response
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "version": "1.0.0"
}
```

### Monitoring Metrics
- **Response Time**: API response times
- **Error Rate**: Error percentage
- **Throughput**: Requests per second
- **Resource Usage**: CPU, memory, disk usage
- **Database Performance**: Query performance

### Logging
- **Application Logs**: Application-level logging
- **Access Logs**: HTTP request logging
- **Error Logs**: Error and exception logging
- **Performance Logs**: Performance metrics logging

## 🔒 Security Considerations

### Production Security
- **HTTPS**: SSL/TLS encryption
- **Firewall**: Network security
- **Authentication**: Secure authentication
- **Authorization**: Role-based access control
- **Input Validation**: Input sanitization

### Environment Security
- **Environment Variables**: Secure configuration
- **Database Security**: Database access control
- **API Security**: API endpoint protection
- **CORS Configuration**: Cross-origin security

## 📈 Performance Optimization

### Backend Optimization
- **Database Indexing**: Optimize database queries
- **Caching**: Implement Redis caching
- **Connection Pooling**: Database connection optimization
- **Compression**: Response compression

### Frontend Optimization
- **Bundle Optimization**: Minimize bundle size
- **CDN**: Content delivery network
- **Caching**: Browser caching strategies
- **Image Optimization**: Optimize images and assets

## 🔄 Backup and Recovery

### Database Backup
```bash
# Create backup
mysqldump -u username -p ecommerce > backup.sql

# Restore backup
mysql -u username -p ecommerce < backup.sql
```

### Application Backup
- **Code Repository**: Git repository backup
- **Configuration**: Environment configuration backup
- **Assets**: Static asset backup
- **Logs**: Log file backup

### Recovery Procedures
1. **Database Recovery**: Restore from backup
2. **Application Recovery**: Redeploy application
3. **Data Recovery**: Restore user data
4. **Service Recovery**: Restart services

## 📞 Support and Troubleshooting

### Common Issues
- **Build Failures**: Check dependencies and configuration
- **Database Connection**: Verify database credentials
- **Port Conflicts**: Check port availability
- **Memory Issues**: Monitor memory usage

### Debugging
- **Log Analysis**: Analyze application logs
- **Performance Profiling**: Profile application performance
- **Database Queries**: Monitor database performance
- **Network Issues**: Check network connectivity

### Support Resources
- **Documentation**: Comprehensive documentation
- **Logs**: Application and system logs
- **Monitoring**: Real-time monitoring dashboards
- **Health Checks**: Automated health monitoring

---

**Last Updated**: $(date)
**Version**: 1.0.0

