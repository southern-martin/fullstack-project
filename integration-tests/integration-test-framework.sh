#!/bin/bash

# Phase 16A - Integration Testing Framework Setup
# Comprehensive service validation script

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧪 Phase 16A - Integration Testing Framework"
echo "=============================================="
echo ""

# Service configuration
declare -A SERVICES=(
    ["auth"]="3001:/api/v1/auth/health"
    ["user"]="3003:/api/v1/health" 
    ["customer"]="3004:/api/v1/health"
    ["carrier"]="3005:/api/v1/health"
    ["pricing"]="3006:/api/v1/health"
    ["translation"]="3007:/api/v1/translation/languages"
)

# Function to test service health
test_service_health() {
    local service_name=$1
    local port_endpoint=$2
    local port=$(echo $port_endpoint | cut -d: -f1)
    local endpoint=$(echo $port_endpoint | cut -d: -f2)
    
    echo -e "${BLUE}Testing ${service_name} service health...${NC}"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${port}${endpoint}")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ ${service_name} service (port ${port}) - HEALTHY${NC}"
        return 0
    else
        echo -e "${RED}❌ ${service_name} service (port ${port}) - UNHEALTHY (HTTP ${response})${NC}"
        return 1
    fi
}

# Main execution - simplified version for initial test
main() {
    echo "🔍 Starting service validation..."
    echo ""
    
    # Test all service health endpoints
    echo "=== SERVICE HEALTH VALIDATION ==="
    local healthy_services=0
    local total_services=${#SERVICES[@]}
    
    for service in "${!SERVICES[@]}"; do
        if test_service_health "$service" "${SERVICES[$service]}"; then
            ((healthy_services++))
        fi
    done
    
    echo ""
    echo -e "${BLUE}Health Summary: ${healthy_services}/${total_services} services healthy${NC}"
    
    if [ $healthy_services -eq $total_services ]; then
        echo -e "${GREEN}✅ All services are operational!${NC}"
        echo -e "${GREEN}🎉 Ready for integration testing!${NC}"
    else
        echo -e "${RED}❌ Some services are down. Check service status.${NC}"
    fi
}

# Execute main function
main
