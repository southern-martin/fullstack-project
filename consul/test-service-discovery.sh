#!/bin/bash

##############################################################################
# Consul Service Discovery Test Script
# 
# This script demonstrates how to use Consul for service discovery
# by looking up services and testing connectivity.
##############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CONSUL_URL="${CONSUL_URL:-http://localhost:8500}"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Consul Service Discovery Test${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Test 1: Discover all services
echo -e "${YELLOW}→${NC} Discovering all registered services..."
services=$(curl -sf "${CONSUL_URL}/v1/catalog/services" | python3 -c "import sys, json; print(' '.join(json.load(sys.stdin).keys()))")
echo -e "${GREEN}✓${NC} Found services: ${services}"
echo ""

# Test 2: Get service details for each microservice
for service in user-service customer-service carrier-service pricing-service; do
  echo -e "${YELLOW}→${NC} Looking up ${BLUE}${service}${NC}..."
  
  # Get service info from Consul
  service_info=$(curl -sf "${CONSUL_URL}/v1/catalog/service/${service}")
  
  if [ -n "$service_info" ]; then
    address=$(echo "$service_info" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d[0]['ServiceAddress'] if d[0]['ServiceAddress'] else d[0]['Address'])")
    port=$(echo "$service_info" | python3 -c "import sys, json; print(json.load(sys.stdin)[0]['ServicePort'])")
    
    echo -e "  ${GREEN}✓${NC} Service discovered: ${address}:${port}"
    
    # Test connectivity using discovered address
    health_endpoint="http://${address}:${port}/api/v1/health"
    
    if curl -sf "${health_endpoint}" > /dev/null 2>&1; then
      echo -e "  ${GREEN}✓${NC} Health check successful: ${health_endpoint}"
    else
      echo -e "  ${YELLOW}⚠${NC}  Could not reach health endpoint"
    fi
  else
    echo -e "  ${YELLOW}⚠${NC}  Service not found in Consul"
  fi
  
  echo ""
done

# Test 3: Service discovery via DNS
echo -e "${YELLOW}→${NC} Testing DNS-based service discovery..."
echo -e "  ${BLUE}Note:${NC} DNS discovery requires Consul DNS on port 8600"
echo ""

for service in user-service customer-service carrier-service pricing-service; do
  echo -e "  • ${service}.service.consul"
done

echo ""

# Test 4: Health-filtered service discovery
echo -e "${YELLOW}→${NC} Discovering only healthy services..."
for service in user-service customer-service carrier-service pricing-service; do
  healthy=$(curl -sf "${CONSUL_URL}/v1/health/service/${service}?passing=true" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f'{len(d)} healthy instance(s)')" 2>/dev/null || echo "0 instances")
  echo -e "  • ${service}: ${healthy}"
done

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓${NC} Service discovery test complete!"
echo ""
echo -e "${YELLOW}Usage Examples:${NC}"
echo -e "  # Discover service address"
echo -e "  curl ${CONSUL_URL}/v1/catalog/service/user-service"
echo ""
echo -e "  # Get only healthy instances"
echo -e "  curl ${CONSUL_URL}/v1/health/service/user-service?passing=true"
echo ""
echo -e "  # DNS lookup (from containers on same network)"
echo -e "  dig @localhost -p 8600 user-service.service.consul"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
