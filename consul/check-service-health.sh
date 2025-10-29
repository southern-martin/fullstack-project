#!/bin/bash

##############################################################################
# Consul Service Health Check Script
# 
# This script checks the health status of all registered services in Consul
#
# Usage:
#   ./check-service-health.sh
#   ./check-service-health.sh --consul-url http://localhost:8500
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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
echo -e "${BLUE}  Consul Service Health Check${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check Consul connectivity
echo -e "${YELLOW}→${NC} Checking Consul at ${CONSUL_URL}..."
if ! curl -sf "${CONSUL_URL}/v1/status/leader" > /dev/null; then
  echo -e "${RED}✗${NC} Failed to connect to Consul"
  exit 1
fi
echo -e "${GREEN}✓${NC} Consul is accessible"
echo ""

# Get all services
echo -e "${YELLOW}→${NC} Fetching registered services..."
services=$(curl -sf "${CONSUL_URL}/v1/agent/services" | python3 -m json.tool 2>/dev/null)

if [ -z "$services" ] || [ "$services" = "{}" ]; then
  echo -e "${YELLOW}⚠${NC}  No services registered in Consul"
  exit 0
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Service Health Status${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Counter for summary
HEALTHY_COUNT=0
WARNING_COUNT=0
CRITICAL_COUNT=0
TOTAL_COUNT=0

# Check health for each service
echo "$services" | python3 -c "
import sys, json
services = json.load(sys.stdin)
for svc_id in services:
    print(svc_id)
" | while read -r service_id; do
  if [ -z "$service_id" ]; then
    continue
  fi
  
  ((TOTAL_COUNT++))
  
  # Get service details
  service_info=$(curl -sf "${CONSUL_URL}/v1/agent/service/${service_id}")
  service_name=$(echo "$service_info" | python3 -c "import sys, json; print(json.load(sys.stdin)['Service'])" 2>/dev/null || echo "$service_id")
  service_port=$(echo "$service_info" | python3 -c "import sys, json; print(json.load(sys.stdin)['Port'])" 2>/dev/null || echo "N/A")
  
  # Get health checks
  health_checks=$(curl -sf "${CONSUL_URL}/v1/health/service/${service_name}")
  
  # Determine overall health status
  if [ -z "$health_checks" ] || [ "$health_checks" = "[]" ]; then
    status="unknown"
    status_color="${YELLOW}"
    status_symbol="?"
  else
    # Parse health status
    check_status=$(echo "$health_checks" | python3 -c "
import sys, json
try:
    checks = json.load(sys.stdin)
    if not checks:
        print('unknown')
    else:
        statuses = []
        for check in checks:
            if 'Checks' in check:
                for c in check['Checks']:
                    statuses.append(c.get('Status', 'unknown'))
        
        if 'critical' in statuses:
            print('critical')
        elif 'warning' in statuses:
            print('warning')
        elif all(s == 'passing' for s in statuses):
            print('passing')
        else:
            print('unknown')
except:
    print('unknown')
" 2>/dev/null)
    
    case "$check_status" in
      passing)
        status="healthy"
        status_color="${GREEN}"
        status_symbol="✓"
        ((HEALTHY_COUNT++))
        ;;
      warning)
        status="warning"
        status_color="${YELLOW}"
        status_symbol="⚠"
        ((WARNING_COUNT++))
        ;;
      critical)
        status="critical"
        status_color="${RED}"
        status_symbol="✗"
        ((CRITICAL_COUNT++))
        ;;
      *)
        status="unknown"
        status_color="${YELLOW}"
        status_symbol="?"
        ;;
    esac
  fi
  
  # Print service status
  printf "${status_color}${status_symbol}${NC} %-25s ${CYAN}%-15s${NC} Port: %-6s Status: ${status_color}%-10s${NC}\n" \
    "$service_name" "($service_id)" "$service_port" "$status"
  
  # Show individual check details
  if [ "$health_checks" != "[]" ]; then
    echo "$health_checks" | python3 -c "
import sys, json
try:
    checks = json.load(sys.stdin)
    for check in checks:
        if 'Checks' in check:
            for c in check['Checks']:
                check_name = c.get('Name', 'Unknown')
                check_status = c.get('Status', 'unknown')
                check_output = c.get('Output', '').strip()[:60]
                
                symbol = '✓' if check_status == 'passing' else '✗' if check_status == 'critical' else '⚠'
                color = '32' if check_status == 'passing' else '31' if check_status == 'critical' else '33'
                
                print(f'  \033[0;{color}m{symbol}\033[0m {check_name}: {check_status}')
                if check_output:
                    print(f'    └─ {check_output}')
except Exception as e:
    pass
" 2>/dev/null || true
  fi
  
  echo ""
done

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Get actual counts from Consul health API
echo ""
echo -e "${CYAN}Service Health Overview:${NC}"

# List all services and their health
curl -sf "${CONSUL_URL}/v1/health/state/any" | python3 -c "
import sys, json
from collections import defaultdict

try:
    checks = json.load(sys.stdin)
    
    # Group by service and status
    service_status = defaultdict(lambda: defaultdict(int))
    
    for check in checks:
        service = check.get('ServiceName', 'consul')
        status = check.get('Status', 'unknown')
        service_status[service][status] += 1
    
    # Calculate totals
    total_healthy = 0
    total_warning = 0
    total_critical = 0
    
    for service in sorted(service_status.keys()):
        statuses = service_status[service]
        passing = statuses.get('passing', 0)
        warning = statuses.get('warning', 0)
        critical = statuses.get('critical', 0)
        
        # Determine overall service health
        if critical > 0:
            status_text = '\033[0;31m✗ CRITICAL\033[0m'
            total_critical += 1
        elif warning > 0:
            status_text = '\033[1;33m⚠ WARNING\033[0m'
            total_warning += 1
        elif passing > 0:
            status_text = '\033[0;32m✓ HEALTHY\033[0m'
            total_healthy += 1
        else:
            status_text = '\033[1;33m? UNKNOWN\033[0m'
        
        print(f'  {status_text:40} {service}')
        print(f'    └─ Checks: {passing} passing, {warning} warning, {critical} critical')
    
    print()
    print(f'\033[0;32m✓\033[0m Healthy services:  {total_healthy}')
    print(f'\033[1;33m⚠\033[0m Warning services:  {total_warning}')
    print(f'\033[0;31m✗\033[0m Critical services: {total_critical}')
    
except Exception as e:
    print(f'Error parsing health data: {e}', file=sys.stderr)
" 2>/dev/null || echo -e "${YELLOW}Unable to parse service health data${NC}"

echo ""
echo -e "${YELLOW}Consul UI:${NC} ${CONSUL_URL}/ui/dc1/services"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

exit 0
