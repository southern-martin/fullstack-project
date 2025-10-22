# Custom VM Deployment Guide

Deploy the Fullstack Project on your own VM, whether it's on-premises, cloud provider, or dedicated server.

## 📋 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04/22.04, Debian 11/12, CentOS 8+, or Rocky Linux 8+
- **CPU**: Minimum 4 cores (8 recommended for production)
- **RAM**: Minimum 8GB (16GB+ recommended for production)
- **Disk**: Minimum 50GB SSD (100GB+ recommended)
- **Network**: Public IP address with ports 80, 443, and 22 open

### Domain Setup (Optional but Recommended)
- Domain name pointing to your server's IP address
- DNS A record: `example.com` → `your-server-ip`
- DNS A record: `www.example.com` → `your-server-ip`

## 🚀 Quick Start (5 Steps)

### Step 1: Install System Dependencies

SSH into your VM and run the installation script:

```bash
# Download and run the installer
curl -fsSL https://raw.githubusercontent.com/your-repo/main/infrastructure/vm/install-vm.sh | sudo bash

# Or clone the repo first
git clone https://github.com/your-repo/fullstack-project.git /opt/fullstack-project
cd /opt/fullstack-project
sudo ./infrastructure/vm/install-vm.sh
```

This installs:
- Docker & Docker Compose
- Nginx
- Certbot (Let's Encrypt)
- Monitoring tools
- Configures firewall
- Optimizes system settings

### Step 2: Configure Environment

```bash
cd /opt/fullstack-project

# Generate secrets
./scripts/init-local-secrets.sh

# Create production environment file
cp infrastructure/environments/production.env .env

# Edit .env with your settings
nano .env
```

**Important settings to update in `.env`:**
```bash
# Database passwords (auto-generated, can keep as-is)
SHARED_DB_PASSWORD=...
CUSTOMER_DB_PASSWORD=...
CARRIER_DB_PASSWORD=...
PRICING_DB_PASSWORD=...
REDIS_PASSWORD=...

# JWT secrets (auto-generated, can keep as-is)
JWT_SECRET=...
JWT_REFRESH_SECRET=...

# API URLs (replace example.com with your domain)
REACT_APP_AUTH_API_URL=https://example.com/api/v1/auth
REACT_APP_USER_API_URL=https://example.com/api/users
REACT_APP_CUSTOMER_API_URL=https://example.com/api/customers
REACT_APP_CARRIER_API_URL=https://example.com/api/carriers
REACT_APP_PRICING_API_URL=https://example.com/api/pricing
REACT_APP_TRANSLATION_API_URL=https://example.com/api/translations
```

### Step 3: Deploy Application

```bash
sudo ./infrastructure/vm/deploy-vm.sh
```

This will:
- Build all Docker images
- Start all services
- Configure systemd for auto-start on boot
- Show deployment status

### Step 4: Configure Nginx Reverse Proxy

```bash
# Copy Nginx configuration
sudo cp infrastructure/vm/nginx.conf /etc/nginx/sites-available/fullstack-project

# Edit to replace example.com with your domain
sudo nano /etc/nginx/sites-available/fullstack-project

# Enable the site
sudo ln -s /etc/nginx/sites-available/fullstack-project /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 5: Setup SSL Certificate (with Let's Encrypt)

```bash
# Replace example.com with your domain
sudo certbot --nginx -d example.com -d www.example.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

**That's it! Your application is now live at `https://example.com`**

## 📊 Management Commands

### Service Management

```bash
# Start services
sudo systemctl start fullstack-project

# Stop services
sudo systemctl stop fullstack-project

# Restart services
sudo systemctl restart fullstack-project

# Check status
sudo systemctl status fullstack-project

# View service logs
docker compose -f docker-compose.vm.yml logs -f

# View specific service logs
docker compose -f docker-compose.vm.yml logs -f auth-service
```

### Container Management

```bash
# List running containers
docker ps

# Execute command in container
docker exec -it auth-service sh

# View container logs
docker logs auth-service -f

# Restart a specific service
docker restart auth-service
```

### Database Management

```bash
# Access MySQL databases
docker exec -it shared-user-db mysql -u root -p

# Export database
docker exec shared-user-db mysqldump -u root -p shared_user_db > backup.sql

# Import database
docker exec -i shared-user-db mysql -u root -p shared_user_db < backup.sql

# Access Redis CLI
docker exec -it shared-redis redis-cli -a "your-redis-password"
```

## 🔄 Backup & Restore

### Setup Automated Backups

```bash
sudo ./infrastructure/vm/setup-backup.sh
```

This configures:
- Daily backups at 2:00 AM
- Backs up all databases, Redis, and configuration
- Compresses backups
- Retains backups for 30 days
- Stores in `/var/backups/fullstack-project`

### Manual Backup

```bash
sudo /usr/local/bin/fullstack-backup.sh
```

### Restore from Backup

```bash
# List available backups
ls -lh /var/backups/fullstack-project/

# Extract backup
cd /var/backups/fullstack-project
tar -xzf backup_20250101_020000.tar.gz

# Restore databases
docker exec -i shared-user-db mysql -u root -p < backup_20250101_020000/shared-db.sql
docker exec -i customer-db mysql -u root -p < backup_20250101_020000/customer-db.sql
docker exec -i carrier-db mysql -u root -p < backup_20250101_020000/carrier-db.sql
docker exec -i pricing-db mysql -u root -p < backup_20250101_020000/pricing-db.sql

# Restore Redis
docker cp backup_20250101_020000/redis-dump.rdb shared-redis:/data/dump.rdb
docker restart shared-redis
```

## 📈 Monitoring

### System Monitor

```bash
./infrastructure/vm/monitoring.sh
```

Shows:
- System information (CPU, memory, disk)
- Container status
- Service health checks
- Database sizes
- Redis statistics
- Recent errors
- Backup status

### Log Monitoring

```bash
# Real-time logs for all services
docker compose -f docker-compose.vm.yml logs -f

# Tail recent errors
docker compose -f docker-compose.vm.yml logs --tail=100 | grep -i error

# Nginx access logs
sudo tail -f /var/log/nginx/fullstack-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/fullstack-error.log
```

### Resource Monitoring

```bash
# CPU and memory usage
htop

# Disk I/O
iotop

# Network usage
nethogs

# Disk usage analysis
ncdu /var/lib/docker
```

## 🔧 Updating the Application

### Update Application Code

```bash
cd /opt/fullstack-project

# Pull latest changes
git pull origin main

# Rebuild and restart services
sudo ./infrastructure/vm/deploy-vm.sh
```

### Update Individual Service

```bash
# Rebuild specific service
docker compose -f docker-compose.vm.yml build auth-service

# Restart service
docker compose -f docker-compose.vm.yml up -d --no-deps auth-service
```

### Update System Packages

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/Rocky
sudo yum update -y

# Reboot if kernel updated
sudo reboot
```

## 🛡️ Security Best Practices

### 1. Firewall Configuration

```bash
# Ubuntu/Debian (UFW)
sudo ufw status
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable

# CentOS/Rocky (firewalld)
sudo firewall-cmd --list-all
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. SSH Hardening

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Recommended settings:
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
# Port 22 (or change to non-standard port)

# Restart SSH
sudo systemctl restart sshd
```

### 3. Fail2Ban (Brute-force Protection)

```bash
# Install fail2ban
sudo apt install fail2ban  # Ubuntu/Debian
sudo yum install fail2ban  # CentOS/Rocky

# Configure
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. Regular Security Updates

```bash
# Enable automatic security updates (Ubuntu/Debian)
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 5. SSL/TLS Certificate Auto-Renewal

Certbot automatically sets up renewal. Verify it's working:

```bash
# Test renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer
```

## 🔍 Troubleshooting

### Services Not Starting

```bash
# Check Docker daemon
sudo systemctl status docker

# Check container logs
docker compose -f docker-compose.vm.yml logs

# Check for port conflicts
sudo netstat -tulpn | grep -E ':(3000|3001|3003|3004|3005|3006|3007|80|443)'

# Restart everything
sudo systemctl restart docker
sudo systemctl restart fullstack-project
```

### Database Connection Issues

```bash
# Check database containers
docker ps | grep -E '(db|mysql)'

# Test database connection
docker exec -it shared-user-db mysql -u root -p -e "SELECT 1"

# Check database logs
docker logs shared-user-db
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Clean Docker resources
docker system prune -a --volumes

# Clean old logs
sudo journalctl --vacuum-time=7d
sudo find /var/log -name "*.log" -mtime +30 -delete

# Clean old backups
sudo find /var/backups/fullstack-project -name "backup_*.tar.gz" -mtime +30 -delete
```

### SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Check Nginx SSL config
sudo nginx -t
```

## 💰 Cost Optimization

### For Low-Traffic Sites

1. **Use smaller VM**: 2 CPUs, 4GB RAM is sufficient for low traffic
2. **Reduce container resources**: Edit docker-compose.vm.yml resource limits
3. **Disable unused services**: Comment out services you don't need
4. **Use BASIC Redis**: Already configured in docker-compose.vm.yml

### For Production Sites

1. **Use larger VM**: 8+ CPUs, 16GB+ RAM
2. **Enable Redis persistence**: Already configured
3. **Configure database replication**: Use multiple MySQL instances
4. **Use CDN**: CloudFlare, AWS CloudFront for static assets
5. **Enable caching**: Nginx caching, Redis caching

## 📊 Performance Tuning

### Database Optimization

Add to MySQL configuration in docker-compose.vm.yml:

```yaml
command: >
  --default-authentication-plugin=mysql_native_password
  --max_connections=200
  --innodb_buffer_pool_size=1G
  --innodb_log_file_size=256M
```

### Nginx Optimization

Add to nginx.conf:

```nginx
# Enable gzip compression
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;

# Enable caching
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;
proxy_cache my_cache;
```

### Docker Optimization

```bash
# Increase Docker log rotation
echo '{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}' | sudo tee /etc/docker/daemon.json

sudo systemctl restart docker
```

## 🆘 Support & Resources

### Log Locations
- **Application logs**: `docker compose logs`
- **Nginx access**: `/var/log/nginx/fullstack-access.log`
- **Nginx errors**: `/var/log/nginx/fullstack-error.log`
- **System logs**: `journalctl -u fullstack-project`
- **Backup logs**: `/var/log/syslog` (search for "fullstack-backup")

### Useful Commands
- **Monitor**: `./infrastructure/vm/monitoring.sh`
- **Backup**: `sudo /usr/local/bin/fullstack-backup.sh`
- **Logs**: `docker compose -f docker-compose.vm.yml logs -f`
- **Restart**: `sudo systemctl restart fullstack-project`

### Documentation
- Main README: `/opt/fullstack-project/README.md`
- GCP Migration: `/opt/fullstack-project/QUICK-REFERENCE-GCP.md`
- API Documentation: `/opt/fullstack-project/docs/`

---

**Need help?** Check the troubleshooting section or review the logs for error messages.
