#!/bin/bash

# Test Structured Logging Implementation
# This script tests structured logging across services

set -e

echo "🧪 Testing Structured Logging Implementation"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Checking if Loki stack is running...${NC}"
if docker ps | grep -q loki; then
  echo -e "${GREEN}✓ Loki is running${NC}"
else
  echo "⚠ Loki is not running. Start it with:"
  echo "  cd api-gateway && docker-compose -f docker-compose.logging-lite.yml up -d"
  exit 1
fi

echo ""
echo -e "${YELLOW}2. Testing Auth Service structured logging...${NC}"

# Check if auth service is running
if ! curl -s http://localhost:3001/api/v1/auth/health > /dev/null 2>&1; then
  echo "⚠ Auth Service is not running. Please start it:"
  echo "  cd auth-service && npm run start:dev"
  exit 1
fi

# Make a test request
echo "Making test login request..."
CORRELATION_ID=$(uuidgen)
RESPONSE=$(curl -s -w "\n%{http_code}\n%{header_json}" -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: ${CORRELATION_ID}" \
  -d '{"email":"admin@example.com","password":"Admin123!"}' 2>/dev/null || echo "FAILED")

if echo "$RESPONSE" | grep -q "200\|201"; then
  echo -e "${GREEN}✓ Login request successful${NC}"
  echo "  Correlation ID: ${CORRELATION_ID}"
else
  echo "⚠ Login request failed (this is OK if credentials are wrong)"
  echo "  Correlation ID: ${CORRELATION_ID}"
fi

echo ""
echo -e "${YELLOW}3. Checking logs in Loki...${NC}"
sleep 2 # Wait for logs to be ingested

# Query Loki for the correlation ID
LOKI_QUERY="{container=\"auth-service\"} | json | correlationId=\"${CORRELATION_ID}\""
LOKI_URL="http://localhost:3200/loki/api/v1/query_range"

echo "Querying Loki: ${LOKI_QUERY}"
LOGS=$(curl -s -G "${LOKI_URL}" \
  --data-urlencode "query=${LOKI_QUERY}" \
  --data-urlencode "start=$(date -u -v-5M +%s)000000000" \
  --data-urlencode "end=$(date -u +%s)000000000" 2>/dev/null || echo "{}")

if echo "$LOGS" | grep -q "correlationId"; then
  echo -e "${GREEN}✓ Found logs in Loki with correlation ID${NC}"
  echo "  View in Grafana: http://localhost:3100/explore"
else
  echo "⚠ No logs found in Loki yet (may take a few seconds)"
  echo "  View in Grafana: http://localhost:3100/explore"
fi

echo ""
echo -e "${YELLOW}4. Checking log structure...${NC}"

# Check auth service logs directly
AUTH_LOGS=$(docker logs auth-service --tail 20 2>&1 || echo "Service not in Docker")

if echo "$AUTH_LOGS" | grep -q "correlationId"; then
  echo -e "${GREEN}✓ Structured logs found in Auth Service${NC}"
  echo ""
  echo "Sample log entry:"
  echo "$AUTH_LOGS" | grep "correlationId" | tail -1
else
  echo "⚠ Auth Service might not be running in Docker"
  echo "  For local development, check console output"
fi

echo ""
echo -e "${GREEN}✅ Structured Logging Test Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. View logs in Grafana: http://localhost:3100/explore"
echo "2. Query: {container=\"auth-service\"} | json"
echo "3. Filter by correlation ID: correlationId=\"${CORRELATION_ID}\""
echo "4. Check structured fields: level, service, userId, requestPath"
