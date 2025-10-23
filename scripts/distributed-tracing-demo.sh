#!/bin/bash

# Distributed Tracing Demo - Phase 13
# Demonstrates correlation ID tracking across all 6 microservices

set -e

echo "🔍 Distributed Tracing Demo"
echo "============================"
echo ""

# Generate unique correlation ID
CORRELATION_ID="demo-$(date +%s)-$(uuidgen | cut -d'-' -f1)"
echo "📋 Correlation ID: $CORRELATION_ID"
echo ""

# Define services
SERVICES=(
  "auth-service:3001:/api/v1/auth/health"
  "user-service:3003:/api/v1/health"
  "customer-service:3004:/api/v1/health"
  "carrier-service:3005:/api/v1/health"
  "pricing-service:3006:/api/v1/health"
  "translation-service:3007:/api/v1/health"
)

echo "🚀 Sending requests with correlation ID to all services..."
echo ""

# Send requests to all services
for SERVICE_INFO in "${SERVICES[@]}"; do
    NAME="${SERVICE_INFO%%:*}"
    PORT_PATH="${SERVICE_INFO#*:}"
    PORT="${PORT_PATH%%:*}"
    PATH="${PORT_PATH#*:}"
    
    echo "  ➜ $NAME (port $PORT)..."
    RESPONSE=$(curl -s -H "X-Correlation-ID: $CORRELATION_ID" "http://localhost:$PORT$PATH")
    
    # Check if response contains success
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo "    ✅ Request successful"
    elif echo "$RESPONSE" | grep -q '"status":"ok"'; then
        echo "    ✅ Request successful (auth-service)"
    else
        echo "    ❌ Request failed"
    fi
    
    sleep 0.5
done

echo ""
echo "⏳ Waiting for logs to be ingested by Loki..."
sleep 5

echo ""
echo "📊 Querying Loki for correlation ID: $CORRELATION_ID"
echo ""

# Query Loki for logs with this correlation ID
LOKI_QUERY="{service=~\"auth-service|user-service|customer-service|carrier-service|pricing-service|translation-service\"} | json | metadata_correlationId=\"$CORRELATION_ID\""
START_TIME=$(date -u -v-2M +%s)000000000
END_TIME=$(date -u +%s)000000000

LOKI_RESPONSE=$(curl -s -G "http://localhost:3200/loki/api/v1/query_range" \
  --data-urlencode "query=$LOKI_QUERY" \
  --data-urlencode "start=$START_TIME" \
  --data-urlencode "end=$END_TIME" \
  --data-urlencode "limit=50")

# Count log entries per service
echo "📈 Log Entries by Service:"
echo ""

for SERVICE_INFO in "${SERVICES[@]}"; do
    NAME="${SERVICE_INFO%%:*}"
    COUNT=$(echo "$LOKI_RESPONSE" | grep -o "\"service\":\"$NAME\"" | wc -l | xargs)
    echo "  $NAME: $COUNT entries"
done

echo ""
echo "============================"
echo "✅ Distributed Tracing Demo Complete"
echo ""
echo "View logs in Grafana:"
echo "  URL: http://localhost:3100/explore"
echo "  Query: {metadata_correlationId=\"$CORRELATION_ID\"}"
echo ""
echo "Or query Loki directly:"
echo "  curl -G http://localhost:3200/loki/api/v1/query_range \\"
echo "    --data-urlencode 'query={metadata_correlationId=\"$CORRELATION_ID\"}' \\"
echo "    --data-urlencode 'start=$START_TIME' \\"
echo "    --data-urlencode 'end=$END_TIME'"
