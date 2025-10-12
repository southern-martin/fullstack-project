# 🚀 Deployment Guide

This guide covers deployment strategies for the fullstack microservices application, from development to production environments.

## 🎯 **Deployment Overview**

### **Deployment Environments**
- **Development** - Local development with Docker Compose
- **Staging** - Pre-production testing environment
- **Production** - Live production environment

### **Deployment Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│   Docker Compose│    │   Docker Swarm  │    │   Kubernetes    │
│   Local DB      │    │   Shared DB     │    │   Managed DB    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ **Development Deployment**

### **Prerequisites**
- Docker Desktop
- Node.js 18+
- npm or yarn
- Git

### **Quick Start**
```bash
# 1. Clone repository
git clone <repository-url>
cd fullstack-project

# 2. Start shared database
cd shared-database
docker-compose up -d

# 3. Configure services
cp auth-service/.env.shared.example auth-service/.env
cp user-service/.env.shared.example user-service/.env

# 4. Start all services
docker-compose -f docker-compose.services.yml up -d
```

### **Individual Service Setup**
```bash
# Auth Service
cd auth-service
npm install
npm run start:dev

# User Service
cd user-service
npm install
npm run start:dev

# React Admin
cd react-admin
npm install
npm start
```

### **Development URLs**
- **React Admin**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **User Service**: http://localhost:3003
- **Database**: localhost:3306

## 🐳 **Docker Deployment**

### **Docker Compose Services**
```yaml
# shared-database/docker-compose.services.yml
version: '3.8'
services:
  shared-user-db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: shared_root_password_2024
      MYSQL_DATABASE: shared_user_db
      MYSQL_USER: shared_user
      MYSQL_PASSWORD: shared_password_2024

  auth-service:
    build: ../auth-service
    ports:
      - "3001:3001"
    depends_on:
      - shared-user-db
    environment:
      DB_HOST: shared-user-db
      DB_PORT: 3306
      DB_USERNAME: shared_user
      DB_PASSWORD: shared_password_2024
      DB_NAME: shared_user_db

  user-service:
    build: ../user-service
    ports:
      - "3003:3003"
    depends_on:
      - shared-user-db
    environment:
      DB_HOST: shared-user-db
      DB_PORT: 3306
      DB_USERNAME: shared_user
      DB_PASSWORD: shared_password_2024
      DB_DATABASE: shared_user_db
```

### **Build and Deploy**
```bash
# Build all services
docker-compose -f shared-database/docker-compose.services.yml build

# Start all services
docker-compose -f shared-database/docker-compose.services.yml up -d

# View logs
docker-compose -f shared-database/docker-compose.services.yml logs -f

# Stop services
docker-compose -f shared-database/docker-compose.services.yml down
```

### **Docker Commands**
```bash
# Build specific service
docker build -t auth-service ./auth-service

# Run specific service
docker run -p 3001:3001 auth-service

# View running containers
docker ps

# View container logs
docker logs <container-id>

# Execute commands in container
docker exec -it <container-id> /bin/bash
```

## 🌐 **Production Deployment**

### **Production Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   API Gateway   │    │   Microservices │
│   Nginx         │    │   Kong/Traefik  │    │   Docker Swarm  │
│   SSL/TLS       │    │   Rate Limiting │    │   Health Checks │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   Cache         │    │   Monitoring    │
│   MySQL Cluster │    │   Redis Cluster │    │   Prometheus    │
│   Master/Slave  │    │   Session Store │    │   Grafana       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Production Environment Setup**

#### **1. Server Requirements**
- **CPU**: 4+ cores
- **RAM**: 8GB+ 
- **Storage**: 100GB+ SSD
- **OS**: Ubuntu 20.04+ or CentOS 8+

#### **2. Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y
```

#### **3. Configure Nginx**
```nginx
# /etc/nginx/sites-available/fullstack-app
upstream auth_service {
    server localhost:3001;
}

upstream user_service {
    server localhost:3003;
}

upstream react_admin {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    # React Admin
    location / {
        proxy_pass http://react_admin;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Auth Service
    location /api/v1/auth/ {
        proxy_pass http://auth_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # User Service
    location /api/v1/users/ {
        proxy_pass http://user_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### **4. SSL Configuration**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### **5. Environment Configuration**
```bash
# Create production environment files
cp auth-service/.env.shared.example auth-service/.env.production
cp user-service/.env.shared.example user-service/.env.production

# Update production values
nano auth-service/.env.production
nano user-service/.env.production
```

#### **6. Production Docker Compose**
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  shared-user-db:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - app-network

  auth-service:
    build: ./auth-service
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DB_HOST: shared-user-db
      DB_PORT: 3306
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - shared-user-db
    networks:
      - app-network

  user-service:
    build: ./user-service
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DB_HOST: shared-user-db
      DB_PORT: 3306
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_DATABASE: ${DB_NAME}
    depends_on:
      - shared-user-db
    networks:
      - app-network

volumes:
  mysql_data:

networks:
  app-network:
    driver: bridge
```

#### **7. Deploy to Production**
```bash
# Set environment variables
export DB_ROOT_PASSWORD="your-secure-password"
export DB_NAME="shared_user_db"
export DB_USERNAME="shared_user"
export DB_PASSWORD="your-secure-password"
export JWT_SECRET="your-jwt-secret"

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push images
      run: |
        docker build -t ${{ secrets.DOCKER_USERNAME }}/auth-service:latest ./auth-service
        docker build -t ${{ secrets.DOCKER_USERNAME }}/user-service:latest ./user-service
        docker push ${{ secrets.DOCKER_USERNAME }}/auth-service:latest
        docker push ${{ secrets.DOCKER_USERNAME }}/user-service:latest
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/fullstack-project
          docker-compose -f docker-compose.prod.yml pull
          docker-compose -f docker-compose.prod.yml up -d
```

## 📊 **Monitoring and Health Checks**

### **Health Check Endpoints**
```bash
# Check service health
curl http://localhost:3001/api/v1/auth/health
curl http://localhost:3003/health

# Expected response
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

### **Monitoring Setup**
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  grafana_data:
```

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Database Connection Issues**
```bash
# Check database status
docker-compose logs shared-user-db

# Test database connection
docker exec -it <db-container> mysql -u shared_user -p shared_user_db

# Reset database
docker-compose down -v
docker-compose up -d
```

#### **Service Not Starting**
```bash
# Check service logs
docker-compose logs auth-service
docker-compose logs user-service

# Check service status
docker-compose ps

# Restart specific service
docker-compose restart auth-service
```

#### **Port Conflicts**
```bash
# Check port usage
netstat -tulpn | grep :3001
netstat -tulpn | grep :3306

# Kill process using port
sudo kill -9 <PID>
```

### **Performance Issues**
```bash
# Check resource usage
docker stats

# Check database performance
docker exec -it <db-container> mysql -u root -p -e "SHOW PROCESSLIST;"

# Monitor logs
docker-compose logs -f --tail=100
```

## 🔒 **Security Considerations**

### **Production Security Checklist**
- [ ] Change default passwords
- [ ] Enable SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up log monitoring
- [ ] Enable database encryption
- [ ] Configure backup strategy
- [ ] Set up intrusion detection
- [ ] Regular security updates

### **Environment Variables Security**
```bash
# Use secrets management
docker secret create db_password ./secrets/db_password.txt
docker secret create jwt_secret ./secrets/jwt_secret.txt

# Reference in docker-compose
services:
  auth-service:
    secrets:
      - db_password
      - jwt_secret
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password
      JWT_SECRET_FILE: /run/secrets/jwt_secret
```

## 📋 **Deployment Checklist**

### **Pre-Deployment**
- [ ] Code review completed
- [ ] Tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates obtained
- [ ] Backup strategy in place

### **Deployment**
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Verify all services running
- [ ] Check health endpoints
- [ ] Monitor logs for errors

### **Post-Deployment**
- [ ] Verify application functionality
- [ ] Check performance metrics
- [ ] Monitor error rates
- [ ] Update documentation
- [ ] Notify stakeholders

---

**This deployment guide ensures a smooth transition from development to production with proper monitoring and security measures.**