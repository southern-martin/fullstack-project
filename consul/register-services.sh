#!/bin/bash

##############################################################################
# Consul Service Registration Script
# 
# This script registers all microservices with Consul for service discovery
# and health monitoring.
#
# Usage:
#   ./register-services.sh
#   ./register-services.sh --consul-url http://localhost:8500
#
# Requirements:
#   - Consul server running and accessible
#   - curl installed
#   - Service JSON files in consul/services/ directory
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default Consul URL
CONSUL_URL="${CONSUL_URL:-http://localhost:8500}"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --consul-url)
      CONSUL_URL="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --consul-url URL    Consul server URL (default: http://localhost:8500)"
      echo "  -h, --help          Show this help message"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Consul Service Registration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVICES_DIR="${SCRIPT_DIR}/services"

# Check if Consul is accessible
echo -e "${YELLOW}→${NC} Checking Consul connectivity at ${CONSUL_URL}..."
if ! curl -sf "${CONSUL_URL}/v1/status/leader" > /dev/null; then
  echo -e "${RED}✗${NC} Failed to connect to Consul at ${CONSUL_URL}"
  echo -e "${YELLOW}  Hint: Make sure Consul server is running and accessible${NC}"
  exit 1
fi
echo -e "${GREEN}✓${NC} Consul is accessible"
echo ""

# Check if services directory exists
if [ ! -d "$SERVICES_DIR" ]; then
  echo -e "${RED}✗${NC} Services directory not found: $SERVICES_DIR"
  exit 1
fi

# Register each service
SERVICES_REGISTERED=0
SERVICES_FAILED=0

for service_file in "$SERVICES_DIR"/*.json; do
  if [ ! -f "$service_file" ]; then
    echo -e "${YELLOW}⚠${NC}  No service files found in $SERVICES_DIR"
    break
  fi
  
  service_name=$(basename "$service_file" .json)
  
  echo -e "${YELLOW}→${NC} Registering ${BLUE}${service_name}${NC}..."
  
  # Validate JSON
  if ! cat "$service_file" | python3 -m json.tool > /dev/null 2>&1; then
    echo -e "${RED}✗${NC} Invalid JSON in $service_file"
    ((SERVICES_FAILED++))
    continue
  fi
  
  # Register service with Consul
  response=$(curl -sf \
    -X PUT \
    -H "Content-Type: application/json" \
    --data @"$service_file" \
    "${CONSUL_URL}/v1/agent/service/register" 2>&1)
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Successfully registered ${service_name}"
    ((SERVICES_REGISTERED++))
    
    # Verify registration
    service_id=$(cat "$service_file" | python3 -c "import sys, json; print(json.load(sys.stdin)['ID'])")
    sleep 1
    
    if curl -sf "${CONSUL_URL}/v1/agent/service/${service_id}" > /dev/null; then
      echo -e "  ${GREEN}└─${NC} Verified in Consul catalog"
    else
      echo -e "  ${YELLOW}└─${NC} Warning: Could not verify registration"
    fi
  else
    echo -e "${RED}✗${NC} Failed to register ${service_name}"
    echo -e "  ${RED}└─${NC} Error: $response"
    ((SERVICES_FAILED++))
  fi
  
  echo ""
done

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Registration Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓${NC} Services registered: ${SERVICES_REGISTERED}"
if [ $SERVICES_FAILED -gt 0 ]; then
  echo -e "${RED}✗${NC} Services failed:     ${SERVICES_FAILED}"
fi
echo ""

# Show registered services
echo -e "${YELLOW}→${NC} Listing all registered services..."
echo ""
consul_services=$(curl -sf "${CONSUL_URL}/v1/agent/services" | python3 -m json.tool 2>/dev/null || echo "{}")

if [ "$consul_services" != "{}" ]; then
  echo "$consul_services" | python3 -c "
import sys, json
services = json.load(sys.stdin)
for svc_id, svc in services.items():
    print(f\"  • {svc['Service']} ({svc['ID']}) - {svc['Address']}:{svc['Port']}\")
    if 'Tags' in svc and svc['Tags']:
        print(f\"    Tags: {', '.join(svc['Tags'][:3])}{'...' if len(svc['Tags']) > 3 else ''}\")
" || echo -e "${YELLOW}  (Unable to parse service list)${NC}"
else
  echo -e "${YELLOW}  No services found${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓${NC} Service registration complete!"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Check Consul UI: ${CONSUL_URL}/ui/dc1/services"
echo -e "  2. Verify health checks: ./check-service-health.sh"
echo -e "  3. Test service discovery"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Exit with error if any services failed
if [ $SERVICES_FAILED -gt 0 ]; then
  exit 1
fi

exit 0
