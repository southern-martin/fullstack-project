#!/bin/bash
# React Admin - Kong Integration Verification Script

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🔍 React Admin - Kong Integration Verification         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check Kong is running
echo "1️⃣  Checking Kong Gateway..."
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "   ✅ Kong Gateway is accessible on port 8000"
else
    echo "   ❌ Kong Gateway is NOT accessible on port 8000"
    echo "   Please start Kong: cd api-gateway && docker-compose -f docker-compose.kong.yml up -d"
    exit 1
fi

echo ""

# Check environment configuration
echo "2️⃣  Checking React Admin configuration..."
if [ -f "react-admin/.env" ]; then
    echo "   ✅ .env file exists"
    KONG_URL=$(grep REACT_APP_KONG_GATEWAY_URL react-admin/.env | cut -d '=' -f 2)
    echo "   ✅ Kong Gateway URL: $KONG_URL"
else
    echo "   ❌ .env file not found"
    exit 1
fi

echo ""

# Test Kong endpoints
echo "3️⃣  Testing Kong endpoints..."

# Test login endpoint (public)
echo "   Testing: POST /api/v1/auth/login"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}')

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n 1)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Login endpoint works (200 OK)"
    TOKEN=$(echo "$LOGIN_RESPONSE" | sed '$d' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['access_token'])" 2>/dev/null)
    if [ ! -z "$TOKEN" ]; then
        echo "   ✅ JWT token received"
    fi
else
    echo "   ❌ Login endpoint failed (HTTP $HTTP_CODE)"
fi

echo ""

# Test protected endpoint without token
echo "4️⃣  Testing protected endpoint (no token)..."
PROTECTED_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET http://localhost:8000/api/v1/users)
HTTP_CODE=$(echo "$PROTECTED_RESPONSE" | tail -n 1)
if [ "$HTTP_CODE" = "401" ]; then
    echo "   ✅ Protected endpoint blocked without token (401 Unauthorized)"
else
    echo "   ⚠️  Expected 401 but got HTTP $HTTP_CODE"
fi

echo ""

# Test protected endpoint with token
if [ ! -z "$TOKEN" ]; then
    echo "5️⃣  Testing protected endpoint (with token)..."
    USERS_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET http://localhost:8000/api/v1/users \
      -H "Authorization: Bearer $TOKEN")
    HTTP_CODE=$(echo "$USERS_RESPONSE" | tail -n 1)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ Protected endpoint works with token (200 OK)"
        USER_COUNT=$(echo "$USERS_RESPONSE" | sed '$d' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['total'])" 2>/dev/null)
        if [ ! -z "$USER_COUNT" ]; then
            echo "   ✅ Retrieved $USER_COUNT users from database"
        fi
    else
        echo "   ❌ Protected endpoint failed (HTTP $HTTP_CODE)"
    fi
fi

echo ""

# Check Kong headers
echo "6️⃣  Checking Kong-specific headers..."
HEADERS=$(curl -s -I http://localhost:8000/api/v1/auth/login 2>/dev/null | grep -i "kong\|rate")
if echo "$HEADERS" | grep -q "kong"; then
    echo "   ✅ Kong headers present in responses"
    echo "$HEADERS" | sed 's/^/      /'
else
    echo "   ⚠️  Kong headers not found (requests may be bypassing Kong)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ Verification Complete                                  ║"
echo "║                                                            ║"
echo "║  Next steps:                                               ║"
echo "║  1. Start React Admin: cd react-admin && npm start        ║"
echo "║  2. Open browser: http://localhost:3000                   ║"
echo "║  3. Login with: admin@example.com / Admin123!             ║"
echo "║  4. Check Network tab for Kong headers                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
