#!/bin/bash

# Configure Route-Specific Rate Limiting for Kong Gateway
# This script adds different rate limits based on route types

set -e

KONG_ADMIN_URL="${KONG_ADMIN_URL:-http://localhost:8001}"

echo "🔧 Configuring route-specific rate limiting..."
echo "Kong Admin URL: $KONG_ADMIN_URL"
echo ""

# First, remove the global rate limiting plugin if it exists
echo "📋 Checking for global rate limiting plugin..."
GLOBAL_RATE_LIMIT=$(curl -s "$KONG_ADMIN_URL/plugins" | jq -r '.data[] | select(.name=="rate-limiting" and .service == null and .route == null) | .id' | head -1)

if [ ! -z "$GLOBAL_RATE_LIMIT" ]; then
  echo "🗑️  Removing global rate limiting plugin: $GLOBAL_RATE_LIMIT"
  curl -s -X DELETE "$KONG_ADMIN_URL/plugins/$GLOBAL_RATE_LIMIT"
  echo "✅ Global rate limiting removed"
else
  echo "ℹ️  No global rate limiting plugin found"
fi

echo ""
echo "🚀 Adding route-specific rate limiting..."
echo ""

# Strategy:
# - Auth routes (login, register): HIGH limits (300/min) - critical for user experience
# - Admin routes (users, roles): LOW limits (50/min) - sensitive operations
# - Business routes (carriers, customers, pricing): MEDIUM limits (100/min)
# - Translation routes: HIGH limits (200/min) - frequently accessed
# - Public profile routes: MEDIUM limits (100/min)

# Function to add rate limiting to a route
add_rate_limit() {
  local ROUTE_NAME=$1
  local MINUTE_LIMIT=$2
  local HOUR_LIMIT=$3
  local DESCRIPTION=$4
  
  # Get route ID
  ROUTE_ID=$(curl -s "$KONG_ADMIN_URL/routes" | jq -r ".data[] | select(.name==\"$ROUTE_NAME\") | .id")
  
  if [ -z "$ROUTE_ID" ]; then
    echo "⚠️  Route '$ROUTE_NAME' not found, skipping..."
    return
  fi
  
  echo "📊 Adding rate limit to: $ROUTE_NAME ($DESCRIPTION)"
  echo "   Limits: $MINUTE_LIMIT/min, $HOUR_LIMIT/hour"
  
  RESPONSE=$(curl -s -X POST "$KONG_ADMIN_URL/routes/$ROUTE_ID/plugins" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"rate-limiting\",
      \"config\": {
        \"minute\": $MINUTE_LIMIT,
        \"hour\": $HOUR_LIMIT,
        \"policy\": \"local\",
        \"fault_tolerant\": true,
        \"hide_client_headers\": false,
        \"limit_by\": \"consumer\"
      }
    }")
  
  PLUGIN_ID=$(echo "$RESPONSE" | jq -r '.id // empty')
  
  if [ ! -z "$PLUGIN_ID" ]; then
    echo "   ✅ Plugin added: $PLUGIN_ID"
  else
    ERROR=$(echo "$RESPONSE" | jq -r '.message // "Unknown error"')
    echo "   ❌ Failed: $ERROR"
  fi
  echo ""
}

# ============================================
# HIGH PRIORITY - Authentication Routes
# ============================================
echo "🔐 Authentication Routes (HIGH limits - 300/min):"
add_rate_limit "auth-login" 300 5000 "User login"
add_rate_limit "auth-register" 300 5000 "User registration"
add_rate_limit "auth-refresh" 300 5000 "Token refresh"

# ============================================
# LOW PRIORITY - Admin Routes
# ============================================
echo "👑 Admin Routes (LOW limits - 50/min):"
add_rate_limit "users-routes" 50 1000 "User management"
add_rate_limit "roles-routes" 50 1000 "Role management"

# ============================================
# MEDIUM PRIORITY - Business Routes
# ============================================
echo "📦 Business Routes (MEDIUM limits - 100/min):"
add_rate_limit "carriers-routes" 100 2000 "Carrier management"
add_rate_limit "customers-routes" 100 2000 "Customer management"
add_rate_limit "pricing-routes" 100 2000 "Pricing management"

# ============================================
# HIGH PRIORITY - Translation Routes
# ============================================
echo "🌐 Translation Routes (HIGH limits - 200/min):"
add_rate_limit "translations-routes" 200 4000 "Translation service"

# ============================================
# MEDIUM PRIORITY - Profile Routes
# ============================================
echo "👤 Profile Routes (MEDIUM limits - 100/min):"
add_rate_limit "auth-logout" 100 2000 "User logout"
add_rate_limit "auth-profile" 100 2000 "User profile"

echo ""
echo "============================================"
echo "✅ Route-specific rate limiting configured!"
echo "============================================"
echo ""

# Display summary
echo "📊 Rate Limiting Summary:"
echo ""
curl -s "$KONG_ADMIN_URL/plugins" | jq -r '
  .data[] 
  | select(.name=="rate-limiting") 
  | "Route: \(.route.name // "global") | Limits: \(.config.minute // 0)/min, \(.config.hour // 0)/hour"
' | sort

echo ""
echo "🔍 Test rate limiting:"
echo "  # Make multiple rapid requests to test limits"
echo "  for i in {1..60}; do curl -s http://localhost:8000/api/v1/auth/login -X POST > /dev/null && echo \"Request \$i: OK\" || echo \"Request \$i: Rate limited\"; done"
echo ""
