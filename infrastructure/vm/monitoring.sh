#!/bin/bash
# Monitoring script for Fullstack Project on VM

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

clear

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Fullstack Project - System Monitor${NC}"
echo -e "${BLUE}========================================${NC}\n"

# System Information
echo -e "${GREEN}System Information:${NC}"
echo "  Hostname: $(hostname)"
echo "  Uptime:   $(uptime -p)"
echo "  Load:     $(uptime | awk -F'load average:' '{print $2}')"
echo ""

# Disk Usage
echo -e "${GREEN}Disk Usage:${NC}"
df -h / | tail -1 | awk '{print "  Root:     " $3 " / " $2 " (" $5 " used)"}'
df -h /var | tail -1 | awk '{print "  /var:     " $3 " / " $2 " (" $5 " used)"}'
echo ""

# Memory Usage
echo -e "${GREEN}Memory Usage:${NC}"
free -h | grep Mem | awk '{print "  Total:    " $2 "\n  Used:     " $3 " (" int($3/$2 * 100) "%)\n  Available: " $7}'
echo ""

# Docker Status
echo -e "${GREEN}Docker Containers:${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(NAMES|fullstack|shared)" || echo "  No containers running"
echo ""

# Service Health Checks
echo -e "${GREEN}Service Health:${NC}"

check_service() {
    local name=$1
    local url=$2
    if curl -sf "$url" > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} $name"
    else
        echo -e "  ${RED}✗${NC} $name (not responding)"
    fi
}

check_service "Frontend      " "http://localhost:3000"
check_service "Auth Service  " "http://localhost:3001/api/v1/auth/health"
check_service "User Service  " "http://localhost:3003/health"
check_service "Carrier Service" "http://localhost:3004/health"
check_service "Customer Service" "http://localhost:3005/health"
check_service "Pricing Service" "http://localhost:3006/health"
check_service "Translation Service" "http://localhost:3007/health"
echo ""

# Database Sizes
echo -e "${GREEN}Database Sizes:${NC}"
docker exec shared-user-db du -sh /var/lib/mysql 2>/dev/null | awk '{print "  Shared DB:   " $1}' || echo "  Shared DB:   N/A"
docker exec customer-db du -sh /var/lib/mysql 2>/dev/null | awk '{print "  Customer DB: " $1}' || echo "  Customer DB: N/A"
docker exec carrier-db du -sh /var/lib/mysql 2>/dev/null | awk '{print "  Carrier DB:  " $1}' || echo "  Carrier DB:  N/A"
docker exec pricing-db du -sh /var/lib/mysql 2>/dev/null | awk '{print "  Pricing DB:  " $1}' || echo "  Pricing DB:  N/A"
echo ""

# Redis Info
echo -e "${GREEN}Redis Status:${NC}"
if docker exec shared-redis redis-cli -a "${REDIS_PASSWORD}" info stats 2>/dev/null | grep -q "total_connections_received"; then
    REDIS_MEM=$(docker exec shared-redis redis-cli -a "${REDIS_PASSWORD}" info memory 2>/dev/null | grep used_memory_human | cut -d: -f2 | tr -d '\r')
    REDIS_KEYS=$(docker exec shared-redis redis-cli -a "${REDIS_PASSWORD}" dbsize 2>/dev/null | cut -d: -f2 | tr -d '\r')
    echo "  Memory: $REDIS_MEM"
    echo "  Keys:   $REDIS_KEYS"
else
    echo "  Status: Not available"
fi
echo ""

# Recent Logs (Errors)
echo -e "${GREEN}Recent Errors (last 10):${NC}"
docker compose -f /opt/fullstack-project/docker-compose.vm.yml logs --tail=100 2>/dev/null | \
    grep -i error | tail -10 | sed 's/^/  /' || echo "  No recent errors"
echo ""

# Backup Status
echo -e "${GREEN}Backup Status:${NC}"
if [ -d "/var/backups/fullstack-project" ]; then
    LATEST_BACKUP=$(ls -t /var/backups/fullstack-project/backup_*.tar.gz 2>/dev/null | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        BACKUP_DATE=$(stat -c %y "$LATEST_BACKUP" | cut -d' ' -f1)
        BACKUP_SIZE=$(du -h "$LATEST_BACKUP" | cut -f1)
        echo "  Latest: $BACKUP_DATE ($BACKUP_SIZE)"
        echo "  Total:  $(ls -1 /var/backups/fullstack-project/backup_*.tar.gz 2>/dev/null | wc -l) backups"
    else
        echo "  No backups found"
    fi
else
    echo "  Backup directory not configured"
fi
echo ""

echo -e "${BLUE}========================================${NC}"
echo "Commands: docker ps | docker logs <container> | systemctl status fullstack-project"
