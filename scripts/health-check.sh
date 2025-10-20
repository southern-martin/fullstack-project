#!/bin/bash

# Microservices Health Check Script
# This script checks the health status of all microservices

echo "========================================"
echo "🏥 Microservices Health Check"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Services configuration (name|port|path)
SERVICES=(
    "Auth Service|3001|api/v1/auth/health"
    "User Service|3003|api/v1/health"
    "Customer Service|3004|api/v1/health"
    "Carrier Service|3005|api/v1/health"
    "Pricing Service|3006|api/v1/health"
    "Translation Service|3007|api/v1/health"
)

# Counters
total=0
healthy=0
unhealthy=0

# Function to check service health
check_service() {
    local name=$1
    local port=$2
    local path=$3
    local url="http://localhost:${port}/${path}"
    
    # Check response
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    total=$((total + 1))
    
    if [ "$response" -eq 200 ]; then
        echo -e "${GREEN}✓${NC} ${name} (${port}): ${GREEN}Healthy${NC}"
        healthy=$((healthy + 1))
    else
        echo -e "${RED}✗${NC} ${name} (${port}): ${RED}Unhealthy${NC} (HTTP ${response})"
        unhealthy=$((unhealthy + 1))
    fi
}

# Check all services
for service_entry in "${SERVICES[@]}"; do
    IFS='|' read -r name port path <<< "$service_entry"
    check_service "$name" "$port" "$path"
done

# Summary
echo ""
echo "========================================"
echo "📊 Summary"
echo "========================================"
echo "Total Services: $total"
echo -e "Healthy: ${GREEN}$healthy${NC}"
echo -e "Unhealthy: ${RED}$unhealthy${NC}"

if [ $unhealthy -eq 0 ]; then
    echo -e "\n${GREEN}✓ All services are healthy!${NC}"
    exit 0
else
    echo -e "\n${YELLOW}⚠ Some services are unhealthy${NC}"
    exit 1
fi
