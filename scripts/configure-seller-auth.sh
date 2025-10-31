#!/bin/bash

# ============================================================================
# Kong Gateway JWT Authentication Configuration for Seller Service
# ============================================================================
# This script configures JWT authentication on all seller service routes
# to secure the endpoints and ensure only authenticated users can access them.
# ============================================================================

set -e

KONG_ADMIN_URL="http://localhost:8001"
SERVICE_ID="8d4d7c14-a09e-4c6b-ba85-42b3240949f8"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   Configuring JWT Authentication for Seller Service Routes    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Get all seller service routes
ROUTES=$(curl -s "${KONG_ADMIN_URL}/services/${SERVICE_ID}/routes" | jq -r '.data[].id')

if [ -z "$ROUTES" ]; then
    echo "❌ No routes found for seller service"
    exit 1
fi

ROUTE_COUNT=$(echo "$ROUTES" | wc -l | tr -d ' ')
echo "📋 Found ${ROUTE_COUNT} routes to configure"
echo ""

# Function to add JWT plugin to a route
add_jwt_plugin() {
    local route_id=$1
    local route_name=$2
    
    echo "🔐 Configuring JWT for route: ${route_name} (${route_id})"
    
    # Check if JWT plugin already exists
    existing_jwt=$(curl -s "${KONG_ADMIN_URL}/routes/${route_id}/plugins" | \
        jq -r '.data[] | select(.name == "jwt") | .id')
    
    if [ -n "$existing_jwt" ]; then
        echo "   ⚠️  JWT plugin already exists, removing old one..."
        curl -s -X DELETE "${KONG_ADMIN_URL}/plugins/${existing_jwt}"
    fi
    
    # Add JWT plugin
    response=$(curl -s -X POST "${KONG_ADMIN_URL}/routes/${route_id}/plugins" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "jwt",
            "config": {
                "header_names": ["authorization"],
                "uri_param_names": ["jwt"],
                "cookie_names": [],
                "key_claim_name": "iss",
                "secret_is_base64": false,
                "claims_to_verify": ["exp"],
                "maximum_expiration": 0,
                "run_on_preflight": true
            }
        }')
    
    if echo "$response" | jq -e '.id' > /dev/null 2>&1; then
        echo "   ✅ JWT plugin configured successfully"
    else
        echo "   ❌ Failed to configure JWT plugin"
        echo "   Response: $response"
    fi
    
    echo ""
}

# Function to add Request Transformer plugin to pass user info
add_request_transformer() {
    local route_id=$1
    local route_name=$2
    
    echo "🔄 Configuring Request Transformer for route: ${route_name}"
    
    # Check if Request Transformer plugin already exists
    existing_transformer=$(curl -s "${KONG_ADMIN_URL}/routes/${route_id}/plugins" | \
        jq -r '.data[] | select(.name == "request-transformer") | .id')
    
    if [ -n "$existing_transformer" ]; then
        echo "   ⚠️  Request Transformer already exists, skipping..."
        echo ""
        return
    fi
    
    # Add Request Transformer to add headers from JWT claims
    response=$(curl -s -X POST "${KONG_ADMIN_URL}/routes/${route_id}/plugins" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "request-transformer",
            "config": {
                "add": {
                    "headers": [
                        "X-Consumer-ID:$(headers.x-consumer-id)",
                        "X-Consumer-Username:$(headers.x-consumer-username)",
                        "X-Credential-Identifier:$(headers.x-credential-identifier)"
                    ]
                }
            }
        }')
    
    if echo "$response" | jq -e '.id' > /dev/null 2>&1; then
        echo "   ✅ Request Transformer configured successfully"
    else
        echo "   ⚠️  Request Transformer configuration skipped (optional)"
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
    
    # Add JWT plugin
    add_jwt_plugin "$route_id" "$route_name"
    
    # Add Request Transformer (optional, for passing user info)
    # Uncomment if you need to pass additional headers
    # add_request_transformer "$route_id" "$route_name"
    
done <<< "$ROUTES"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              JWT Configuration Complete                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Summary:"
echo "   • Total routes configured: ${ROUTE_COUNT}"
echo "   • Service ID: ${SERVICE_ID}"
echo "   • JWT validation: Enabled on all routes"
echo ""
echo "🧪 Test Authentication:"
echo ""
echo "   # 1. Get JWT token from auth service"
echo "   TOKEN=\$(curl -s -X POST http://localhost:8000/api/v1/auth/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"admin@example.com\",\"password\":\"Admin123!\"}' | jq -r '.data.access_token')"
echo ""
echo "   # 2. Test with valid token (should work)"
echo "   curl -H \"Authorization: Bearer \$TOKEN\" http://localhost:8000/api/v1/sellers | jq"
echo ""
echo "   # 3. Test without token (should fail with 401)"
echo "   curl http://localhost:8000/api/v1/sellers"
echo ""
echo "⚠️  IMPORTANT: Kong JWT plugin expects Kong-issued credentials."
echo "   If using auth-service tokens, you may need to configure Kong consumers."
echo "   See: https://docs.konghq.com/hub/kong-inc/jwt/"
echo ""
