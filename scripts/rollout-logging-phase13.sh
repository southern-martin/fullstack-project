#!/bin/bash

# Phase 13 Logging Rollout - Remaining Services
# Services: carrier-service, pricing-service, translation-service

set -e

echo "🚀 Phase 13: Logging Infrastructure Rollout"
echo "==========================================="
echo ""

SERVICES=("carrier-service:3005" "pricing-service:3006" "translation-service:3007")

for SERVICE_PORT in "${SERVICES[@]}"; do
    SERVICE="${SERVICE_PORT%:*}"
    PORT="${SERVICE_PORT#*:}"
    
    echo "📦 Processing $SERVICE (port $PORT)..."
    
    # Add winston and uuid dependencies if not present
    if ! grep -q '"winston"' "$SERVICE/package.json"; then
        echo "  ➜ Adding winston and uuid to package.json"
        cd "$SERVICE"
        npm install winston@^3.18.3 uuid@^9.0.1 --save
        cd ..
    fi
    
    # Build and start service
    echo "  ➜ Building $SERVICE..."
    docker-compose -f docker-compose.hybrid.yml build "$SERVICE" 2>&1 | grep -E "(Building|Built|ERROR)" || true
    
    echo "  ➜ Starting $SERVICE..."
    docker-compose -f docker-compose.hybrid.yml up -d "$SERVICE"
    
    echo "  ➜ Waiting for $SERVICE to be healthy..."
    sleep 15
    
    # Test health endpoint
    echo "  ➜ Testing health endpoint..."
    RESPONSE=$(curl -s -H "X-Correlation-ID: test-$SERVICE-auto" "http://localhost:$PORT/api/v1/health" || echo "FAILED")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo "  ✅ $SERVICE is HEALTHY"
        
        # Check logs for Winston JSON
        echo "  ➜ Verifying Winston JSON logs..."
        docker logs "$SERVICE" --tail 5 | grep -q '"level":"info"' && echo "  ✅ Winston JSON logging confirmed" || echo "  ⚠️  Winston logs not found"
    else
        echo "  ❌ $SERVICE FAILED health check"
        echo "  📋 Last 20 log lines:"
        docker logs "$SERVICE" --tail 20
    fi
    
    echo ""
done

echo "==========================================="
echo "✅ Phase 13 Complete!"
echo ""
echo "Summary:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(auth-service|user-service|customer-service|carrier-service|pricing-service|translation-service)"
echo ""
echo "Next: Test distributed tracing across all services"
