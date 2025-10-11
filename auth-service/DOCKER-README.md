# 🐳 Docker Setup for Auth Service

This document provides comprehensive instructions for running the Auth Service using Docker.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM available for containers

## 🚀 Quick Start

### **1. Build and Start All Services**
```bash
# Build the Docker image
npm run docker:build

# Start all services (database + auth service)
npm run docker:start
```

### **2. Verify Services are Running**
```bash
# Check health
curl http://localhost:3001/api/v1/auth/health

# Test registration
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123","firstName":"Test","lastName":"User"}'
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Architecture                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Auth Service  │  │   MySQL DB      │  │   Redis     │  │
│  │   Port: 3001    │  │   Port: 3307    │  │   Port: 6379│  │
│  │   Container     │  │   Container     │  │   Container │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
│           │                     │                   │        │
│           └─────────────────────┼───────────────────┘        │
│                                 │                            │
│                    ┌─────────────┴─────────────┐             │
│                    │     auth-network          │             │
│                    │     (Bridge Network)      │             │
│                    └───────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
auth-service/
├── docker-compose.yml          # Multi-service orchestration
├── Dockerfile                  # Auth Service container definition
├── .dockerignore              # Files to exclude from Docker build
├── env.production             # Production environment variables
├── docker/
│   └── mysql/
│       ├── init/
│       │   └── 01-init-database.sql  # Database initialization
│       └── conf/
│           └── mysql.cnf             # MySQL configuration
├── scripts/
│   ├── docker-build.sh        # Build Docker image
│   ├── docker-start.sh        # Start all services
│   ├── docker-stop.sh         # Stop all services
│   └── docker-logs.sh         # View service logs
└── DOCKER-README.md           # This documentation
```

## 🔧 Services Configuration

### **Auth Service**
- **Image**: Custom build from Dockerfile
- **Port**: 3001 (mapped to host)
- **Environment**: Production configuration
- **Health Check**: HTTP endpoint `/api/v1/auth/health`
- **Dependencies**: MySQL database

### **MySQL Database**
- **Image**: mysql:8.0
- **Port**: 3307 (mapped to host)
- **Database**: auth_service_db
- **User**: auth_user
- **Password**: auth_password
- **Root Password**: auth_root_password
- **Volumes**: Persistent data storage
- **Health Check**: MySQL ping command

### **Redis (Optional)**
- **Image**: redis:7-alpine
- **Port**: 6379 (mapped to host)
- **Purpose**: Caching and session storage
- **Volumes**: Persistent data storage

## 🛠️ Available Commands

### **NPM Scripts**
```bash
# Docker operations
npm run docker:build    # Build Docker image
npm run docker:start    # Start all services with health checks
npm run docker:stop     # Stop all services
npm run docker:logs     # View service logs
npm run docker:up       # Quick start (docker-compose up -d)
npm run docker:down     # Quick stop (docker-compose down)
npm run docker:restart  # Restart all services
npm run docker:clean    # Stop and remove all data/images
```

### **Direct Docker Commands**
```bash
# Build image
docker build -t auth-service:latest .

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove everything (including data)
docker-compose down -v --rmi all
```

## 🔍 Monitoring and Debugging

### **Health Checks**
```bash
# Auth Service health
curl http://localhost:3001/api/v1/auth/health

# Database health
docker-compose exec auth-db mysqladmin ping -h localhost -u root -pauth_root_password

# Redis health
docker-compose exec auth-redis redis-cli ping
```

### **View Logs**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth-service
docker-compose logs -f auth-db
docker-compose logs -f auth-redis
```

### **Access Database**
```bash
# Connect to MySQL
docker-compose exec auth-db mysql -u root -pauth_root_password auth_service_db

# Connect to Redis
docker-compose exec auth-redis redis-cli
```

## 🗄️ Database Management

### **Default Data**
The database is automatically initialized with:
- **Default Roles**: user, admin, super_admin
- **Default Admin User**: admin@auth-service.com (password: Admin123!)
- **Indexes**: Optimized for performance

### **Persistent Storage**
- **Database Data**: Stored in Docker volume `auth_db_data`
- **Redis Data**: Stored in Docker volume `auth_redis_data`
- **Data Persistence**: Survives container restarts

### **Backup and Restore**
```bash
# Backup database
docker-compose exec auth-db mysqldump -u root -pauth_root_password auth_service_db > backup.sql

# Restore database
docker-compose exec -T auth-db mysql -u root -pauth_root_password auth_service_db < backup.sql
```

## 🔒 Security Configuration

### **Environment Variables**
- **JWT Secret**: Configurable via environment
- **Database Passwords**: Secure random passwords
- **CORS**: Configurable origins
- **Rate Limiting**: Configurable limits

### **Network Security**
- **Internal Network**: Services communicate via private network
- **Port Mapping**: Only necessary ports exposed to host
- **User Permissions**: Non-root user in containers

## 🚀 Production Deployment

### **Environment Configuration**
1. Copy `env.production` to `.env`
2. Update JWT secrets and passwords
3. Configure CORS origins
4. Set appropriate log levels

### **Scaling**
```bash
# Scale auth service
docker-compose up -d --scale auth-service=3

# Use load balancer (nginx, traefik, etc.)
# Configure multiple auth service instances
```

### **Monitoring**
- **Health Checks**: Built-in HTTP health checks
- **Logging**: Structured JSON logs
- **Metrics**: Ready for Prometheus/Grafana integration

## 🧪 Testing

### **API Testing**
```bash
# Health check
curl http://localhost:3001/api/v1/auth/health

# Register user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123","firstName":"Test","lastName":"User"}'

# Login user
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'
```

### **Load Testing**
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test health endpoint
ab -n 1000 -c 10 http://localhost:3001/api/v1/auth/health
```

## 🐛 Troubleshooting

### **Common Issues**

#### **Port Already in Use**
```bash
# Check what's using the port
lsof -i :3001
lsof -i :3307

# Kill the process or change ports in docker-compose.yml
```

#### **Database Connection Issues**
```bash
# Check database logs
docker-compose logs auth-db

# Verify database is ready
docker-compose exec auth-db mysqladmin ping -h localhost -u root -pauth_root_password
```

#### **Service Won't Start**
```bash
# Check service logs
docker-compose logs auth-service

# Verify environment variables
docker-compose exec auth-service env | grep DB_
```

### **Reset Everything**
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v --rmi all

# Remove any orphaned containers
docker system prune -a

# Start fresh
npm run docker:start
```

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [NestJS Docker Best Practices](https://docs.nestjs.com/recipes/docker)

---

**The Auth Service is now fully containerized and ready for production deployment!** 🚀








