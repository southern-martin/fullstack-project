#!/bin/bash
echo "🚀 Phase 16A: Integration Testing"
echo "=================================="

SUCCESS=0
FAIL=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    SUCCESS=$((SUCCESS + 1))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    FAIL=$((FAIL + 1))
}

# Test Service Health
echo -e "${BLUE}Testing Service Health:${NC}"

for port in 3001 3003 3004 3005 3006 3007; do
    case $port in
        3001) endpoint="/api/v1/auth/health"; name="Auth" ;;
        *) endpoint="/api/v1/health"; name="Service-$port" ;;
    esac
    
    if curl -s "http://localhost:$port$endpoint" | jq -r '.success' | grep -q "true"; then
        log_success "$name Service ($port) is healthy"
    else
        log_error "$name Service ($port) is unhealthy"
    fi
done

echo ""

# Test Authentication
echo -e "${BLUE}Testing Authentication:${NC}"
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"Admin123!"}' \
    "http://localhost:3001/api/v1/auth/login" | jq -r '.data.access_token // ""')

if [[ -n "$TOKEN" && "$TOKEN" != "null" ]]; then
    log_success "Authentication successful"
else
    log_error "Authentication failed"
fi

echo ""

# Test Translation Service
echo -e "${BLUE}Testing Translation Service:${NC}"
if [[ -n "$TOKEN" && "$TOKEN" != "null" ]]; then
    LANG_COUNT=$(curl -s -H "Authorization: Bearer $TOKEN" \
        "http://localhost:3007/api/v1/translation/languages" | jq -r '.data | length // 0')
    
    if [[ "$LANG_COUNT" -gt "0" ]]; then
        log_success "Translation service has $LANG_COUNT languages"
    else
        log_error "Translation service has no languages"
    fi
fi

echo ""
echo "Results: $SUCCESS passed, $FAIL failed"
