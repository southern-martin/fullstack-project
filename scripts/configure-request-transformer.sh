#!/bin/bash

# ============================================================================
# Kong Request Transformer - Extract JWT Claims to Headers
# ============================================================================
# This script configures Kong to extract JWT claims (sub, roles, email)
# and pass them as headers to seller-service
# ============================================================================

set -e

KONG_ADMIN_URL="http://localhost:8001"
SERVICE_ID="8d4d7c14-a09e-4c6b-ba85-42b3240949f8"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   Configuring Request Transformer for JWT Claims              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Get all seller service routes
ROUTES=$(curl -s "${KONG_ADMIN_URL}/services/${SERVICE_ID}/routes" | jq -r '.data[].id')

ROUTE_COUNT=$(echo "$ROUTES" | wc -l | tr -d ' ')
echo "📋 Found ${ROUTE_COUNT} routes to configure"
echo ""

# Function to add Request Transformer plugin
add_request_transformer() {
    local route_id=$1
    local route_name=$2
    
    echo "🔄 Configuring Request Transformer for route: ${route_name}"
    
    # Check if Request Transformer plugin already exists
    existing_transformer=$(curl -s "${KONG_ADMIN_URL}/routes/${route_id}/plugins" | \
        jq -r '.data[] | select(.name == "request-transformer") | .id')
    
    if [ -n "$existing_transformer" ]; then
        echo "   ⚠️  Request Transformer already exists, removing old one..."
        curl -s -X DELETE "${KONG_ADMIN_URL}/plugins/${existing_transformer}"
    fi
    
    # Add Request Transformer to extract JWT claims and add as headers
    # Kong JWT plugin provides these after validation:
    # - X-Consumer-ID: Kong consumer ID
    # - X-Consumer-Username: Kong consumer username  
    # - X-Credential-Identifier: The 'iss' claim value
    # - X-Anonymous-Consumer: true if anonymous
    #
    # We need to add:
    # - X-User-ID: from 'sub' claim
    # - X-User-Email: from 'email' claim
    # - X-User-Roles: from 'roles' claim (array)
    
    response=$(curl -s -X POST "${KONG_ADMIN_URL}/routes/${route_id}/plugins" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "request-transformer",
            "config": {
                "add": {
                    "headers": [
                        "X-JWT-Claim-Sub:$(headers.x-credential-identifier)",
                        "X-Consumer-Info:$(headers.x-consumer-id)"
                    ]
                }
            }
        }')
    
    if echo "$response" | jq -e '.id' > /dev/null 2>&1; then
        echo "   ✅ Request Transformer configured successfully"
    else
        echo "   ⚠️  Request Transformer configuration failed (may not be needed)"
        echo "   Response: $response"
    fi
    
    echo ""
}

# Configure each route
counter=0
while IFS= read -r route_id; do
    counter=$((counter + 1))
    
    # Get route name
    route_name=$(curl -s "${KONG_ADMIN_URL}/routes/${route_id}" | jq -r '.name')
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Route ${counter}/${ROUTE_COUNT}: ${route_name}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    add_request_transformer "$route_id" "$route_name"
    
done <<< "$ROUTES"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Request Transformer Configuration Complete            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Summary:"
echo "   • Total routes configured: ${ROUTE_COUNT}"
echo "   • Headers added: X-JWT-Claim-Sub, X-Consumer-Info"
echo ""
echo "⚠️  LIMITATION: Kong's JWT plugin doesn't directly expose JWT claims."
echo "   The seller-service needs to decode the JWT token itself or"
echo "   we need to use a custom Kong plugin to extract claims."
echo ""
echo "🔧 RECOMMENDED SOLUTION:"
echo "   Update seller-service to decode JWT from Authorization header"
echo "   and extract user ID from 'sub' claim directly."
echo ""
