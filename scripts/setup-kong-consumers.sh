#!/bin/bash

# ============================================================================
# Kong Consumer and JWT Credential Setup for Auth Service Integration
# ============================================================================
# This script creates Kong consumers and configures JWT credentials
# to work with tokens issued by the auth-service.
# ============================================================================

set -e

KONG_ADMIN_URL="http://localhost:8001"
JWT_SECRET="${JWT_SECRET:-your-jwt-secret-key-change-in-production}"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        Kong Consumer & JWT Credential Configuration           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Function to create or update Kong consumer
create_consumer() {
    local username=$1
    
    echo "👤 Creating/Updating consumer: ${username}"
    
    # Check if consumer exists
    existing_consumer=$(curl -s "${KONG_ADMIN_URL}/consumers/${username}" | jq -r '.id // empty')
    
    if [ -n "$existing_consumer" ]; then
        echo "   ℹ️  Consumer already exists: ${existing_consumer}"
    else
        # Create consumer
        response=$(curl -s -X POST "${KONG_ADMIN_URL}/consumers" \
            -d "username=${username}")
        
        if echo "$response" | jq -e '.id' > /dev/null 2>&1; then
            echo "   ✅ Consumer created successfully"
        else
            echo "   ❌ Failed to create consumer"
            echo "   Response: $response"
            return 1
        fi
    fi
    echo ""
}

# Function to add JWT credential to consumer
add_jwt_credential() {
    local username=$1
    local key=$2
    local secret=$3
    
    echo "🔑 Adding JWT credential for consumer: ${username}"
    echo "   Key: ${key}"
    
    # Check if JWT credential already exists
    existing_jwt=$(curl -s "${KONG_ADMIN_URL}/consumers/${username}/jwt" | \
        jq -r ".data[] | select(.key == \"${key}\") | .id // empty")
    
    if [ -n "$existing_jwt" ]; then
        echo "   ⚠️  JWT credential already exists, removing old one..."
        curl -s -X DELETE "${KONG_ADMIN_URL}/consumers/${username}/jwt/${existing_jwt}"
    fi
    
    # Add JWT credential
    response=$(curl -s -X POST "${KONG_ADMIN_URL}/consumers/${username}/jwt" \
        -d "key=${key}" \
        -d "secret=${secret}" \
        -d "algorithm=HS256")
    
    if echo "$response" | jq -e '.id' > /dev/null 2>&1; then
        echo "   ✅ JWT credential added successfully"
        echo "   Credential ID: $(echo "$response" | jq -r '.id')"
    else
        echo "   ❌ Failed to add JWT credential"
        echo "   Response: $response"
    fi
    
    echo ""
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Creating Kong Consumers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create consumers for different user types
create_consumer "auth-service"
create_consumer "admin-user"
create_consumer "seller-user"
create_consumer "customer-user"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Adding JWT Credentials"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Add JWT credentials using the same secret as auth-service
# The 'key' should match the 'iss' claim in your JWT tokens
add_jwt_credential "auth-service" "auth-service" "$JWT_SECRET"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              Consumer Configuration Complete                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Summary:"
echo "   • Consumers created: 4"
echo "   • JWT credentials added: 1"
echo "   • JWT Secret: ${JWT_SECRET:0:10}..."
echo ""
echo "⚠️  NEXT STEPS:"
echo ""
echo "   1. Update auth-service to include 'iss' claim in JWT tokens:"
echo "      iss: 'auth-service'"
echo ""
echo "   2. Run the authentication configuration script:"
echo "      ./scripts/configure-seller-auth.sh"
echo ""
echo "   3. Test authentication:"
echo "      TOKEN=\$(curl -s -X POST http://localhost:8000/api/v1/auth/login \\"
echo "        -H 'Content-Type: application/json' \\"
echo "        -d '{\"email\":\"admin@example.com\",\"password\":\"Admin123!\"}' | jq -r '.data.access_token')"
echo ""
echo "      curl -H \"Authorization: Bearer \$TOKEN\" http://localhost:8000/api/v1/sellers | jq"
echo ""
