#!/bin/bash

# Setup Seller Service Routes in Kong Gateway
# This script adds all seller service routes with appropriate JWT and ACL plugins

set -e

KONG_ADMIN_URL="http://localhost:8001"
SERVICE_NAME="seller-service"

echo "🚀 Setting up Seller Service routes in Kong Gateway..."
echo ""

# Function to add a route and its plugins
add_route() {
  local route_name=$1
  local paths=$2
  local methods=$3
  local needs_acl=$4
  
  echo "📍 Adding route: $route_name"
  
  # Create route
  ROUTE_RESPONSE=$(curl -s -X POST "$KONG_ADMIN_URL/services/$SERVICE_NAME/routes" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$route_name\",
      \"paths\": $paths,
      \"methods\": $methods,
      \"strip_path\": false
    }")
  
  ROUTE_ID=$(echo $ROUTE_RESPONSE | jq -r '.id')
  
  if [ "$ROUTE_ID" == "null" ] || [ -z "$ROUTE_ID" ]; then
    echo "❌ Failed to create route: $route_name"
    echo "$ROUTE_RESPONSE" | jq
    return 1
  fi
  
  echo "   ✅ Route created with ID: $ROUTE_ID"
  
  # Add JWT plugin
  echo "   🔐 Adding JWT plugin..."
  curl -s -X POST "$KONG_ADMIN_URL/routes/$ROUTE_ID/plugins" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "jwt",
      "config": {
        "key_claim_name": "sub"
      }
    }' > /dev/null
  
  # Add ACL plugin if needed (admin-only routes)
  if [ "$needs_acl" == "true" ]; then
    echo "   👮 Adding ACL plugin (admin-only)..."
    curl -s -X POST "$KONG_ADMIN_URL/routes/$ROUTE_ID/plugins" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "acl",
        "config": {
          "whitelist": ["admin", "super_admin"]
        }
      }' > /dev/null
  fi
  
  echo "   ✅ Route $route_name configured successfully"
  echo ""
}

# 1. Seller Registration (POST)
add_route "sellers-register" \
  '["/api/v1/sellers"]' \
  '["POST"]' \
  "false"

# 2. Seller "me" endpoint
add_route "sellers-me" \
  '["/api/v1/sellers/me"]' \
  '["GET"]' \
  "false"

# 3. Seller by user ID
add_route "sellers-by-user" \
  '["~/api/v1/sellers/user/\\d+$"]' \
  '["GET"]' \
  "false"

# 4. Seller profile updates (PATCH)
add_route "sellers-profile-update" \
  '["~/api/v1/sellers/\\d+/(profile|banking)$", "~/api/v1/sellers/\\d+$"]' \
  '["PATCH"]' \
  "false"

# 5. Seller verification submission
add_route "sellers-verify" \
  '["~/api/v1/sellers/\\d+/verify$"]' \
  '["POST"]' \
  "false"

# 6. Admin - Pending verification list
add_route "sellers-pending-verification" \
  '["/api/v1/sellers/pending-verification"]' \
  '["GET"]' \
  "true"

# 7. Admin - Approve seller
add_route "sellers-approve" \
  '["~/api/v1/sellers/\\d+/approve$"]' \
  '["POST"]' \
  "true"

# 8. Admin - Reject seller
add_route "sellers-reject" \
  '["~/api/v1/sellers/\\d+/reject$"]' \
  '["POST"]' \
  "true"

# 9. Admin - Suspend seller
add_route "sellers-suspend" \
  '["~/api/v1/sellers/\\d+/suspend$"]' \
  '["POST"]' \
  "true"

# 10. Admin - Reactivate seller
add_route "sellers-reactivate" \
  '["~/api/v1/sellers/\\d+/reactivate$"]' \
  '["POST"]' \
  "true"

# 11. Admin - Delete seller
add_route "sellers-delete" \
  '["~/api/v1/sellers/\\d+$"]' \
  '["DELETE"]' \
  "true"

# === Analytics Routes (Owner or Admin) ===

# 12. Analytics - Overview
add_route "sellers-analytics-overview" \
  '["~/api/v1/sellers/\\d+/analytics/overview$"]' \
  '["GET"]' \
  "false"

# 13. Analytics - Sales Trend
add_route "sellers-analytics-trend" \
  '["~/api/v1/sellers/\\d+/analytics/sales-trend$"]' \
  '["GET"]' \
  "false"

# 14. Analytics - Product Performance
add_route "sellers-analytics-products" \
  '["~/api/v1/sellers/\\d+/analytics/products$"]' \
  '["GET"]' \
  "false"

# 15. Analytics - Revenue Breakdown
add_route "sellers-analytics-revenue" \
  '["~/api/v1/sellers/\\d+/analytics/revenue$"]' \
  '["GET"]' \
  "false"

echo "✅ All seller service routes configured successfully!"
echo ""
echo "📊 Summary:"
curl -s "$KONG_ADMIN_URL/services/$SERVICE_NAME/routes" | jq -r '.data[] | "  - " + .name'
echo ""
echo "🎉 Seller Service is now accessible through Kong Gateway at http://localhost:8000"
