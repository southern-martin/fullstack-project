#!/bin/bash

# Phase 14 - Load Testing Script
# Generates traffic to all 6 microservices for dashboard testing

set -e

echo "🔄 Phase 14 - Load Testing All Microservices"
echo "=============================================="
echo ""

TOTAL_REQUESTS=0
SERVICES=(
  "auth-service:3001:/api/v1/auth/health"
  "user-service:3003:/api/v1/health"
  "customer-service:3004:/api/v1/health"
  "carrier-service:3005:/api/v1/health"
  "pricing-service:3006:/api/v1/health"
  "translation-service:3007:/api/v1/health"
)

echo "📊 Test Parameters:"
echo "  - Services: 6"
echo "  - Requests per service: 50"
echo "  - Total requests: 300"
echo "  - Correlation ID tracking: Enabled"
echo ""

for ITERATION in {1..50}; do
    CORRELATION_ID="load-test-phase14-$ITERATION"
    
    for SERVICE_INFO in "${SERVICES[@]}"; do
        NAME="${SERVICE_INFO%%:*}"
        PORT_PATH="${SERVICE_INFO#*:}"
        PORT="${PORT_PATH%%:*}"
        PATH="${PORT_PATH#*:}"
        
        # Use wget from inside container
        docker exec "$NAME" wget --quiet --spider \
          --header="X-Correlation-ID: $CORRELATION_ID" \
          "http://localhost:$PORT$PATH" 2>/dev/null || true
        
        ((TOTAL_REQUESTS++))
    done
    
    # Progress indicator every 10 iterations
    if [ $((ITERATION % 10)) -eq 0 ]; then
        echo "  ➜ Progress: $ITERATION/50 iterations ($TOTAL_REQUESTS requests sent)"
    fi
done

echo ""
echo "=============================================="
echo "✅ Load Test Complete!"
echo ""
echo "Summary:"
echo "  Total Requests Sent: $TOTAL_REQUESTS"
echo "  Correlation IDs Used: 50"
echo "  Services Tested: 6"
echo ""
echo "Next Steps:"
echo "  1. Open Grafana: http://localhost:3100"
echo "  2. View Dashboard: Microservices Logging Overview"
echo "  3. Check Log Volume panel for traffic spike"
echo "  4. Verify Correlation IDs in Active Correlation IDs panel"
