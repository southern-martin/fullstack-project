#!/bin/bash

# Kong JWT Configuration Script
# This script configures Kong to validate JWTs issued by the Auth Service

set -e

KONG_ADMIN_URL="${KONG_ADMIN_URL:-http://localhost:8001}"
JWT_SECRET="${JWT_SECRET:-your-jwt-secret-key-change-in-production}"

echo "🔐 Kong JWT Configuration"
echo "========================================"
echo "Admin API: $KONG_ADMIN_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Wait for Kong Admin API
echo "⏳ Waiting for Kong Admin API..."
until curl -s "${KONG_ADMIN_URL}/status" > /dev/null; do
    echo "Waiting for Kong..."
    sleep 2
done
print_success "Kong is ready!"
echo ""

# Step 1: Create an anonymous consumer for JWT validation
echo "📝 Step 1: Creating anonymous consumer for JWT validation..."

# Delete if exists
curl -s -X DELETE "${KONG_ADMIN_URL}/consumers/auth-service-jwt" > /dev/null 2>&1 || true

# Create consumer
CONSUMER_RESPONSE=$(curl -s -X POST "${KONG_ADMIN_URL}/consumers" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "auth-service-jwt",
        "custom_id": "auth-service"
    }')

if echo "$CONSUMER_RESPONSE" | grep -q "auth-service-jwt"; then
    print_success "Consumer 'auth-service-jwt' created"
else
    print_error "Failed to create consumer"
    echo "$CONSUMER_RESPONSE"
    exit 1
fi
echo ""

# Step 2: Add JWT credential with the shared secret
echo "🔑 Step 2: Configuring JWT credential with shared secret..."

# Kong JWT plugin validates tokens signed with HS256
# We need to add a JWT credential that matches our Auth Service configuration

JWT_CREDENTIAL_RESPONSE=$(curl -s -X POST "${KONG_ADMIN_URL}/consumers/auth-service-jwt/jwt" \
    -H "Content-Type: application/json" \
    -d "{
        \"algorithm\": \"HS256\",
        \"key\": \"auth-service\",
        \"secret\": \"$JWT_SECRET\"
    }")

if echo "$JWT_CREDENTIAL_RESPONSE" | grep -q "auth-service"; then
    print_success "JWT credential configured with shared secret"
    JWT_KEY=$(echo "$JWT_CREDENTIAL_RESPONSE" | jq -r '.key')
    print_success "JWT Key: $JWT_KEY"
else
    print_error "Failed to configure JWT credential"
    echo "$JWT_CREDENTIAL_RESPONSE"
    exit 1
fi
echo ""

# Step 3: Update JWT plugins to use the correct key claim
echo "🔧 Step 3: Updating JWT plugins configuration..."

# Get all JWT plugins
JWT_PLUGINS=$(curl -s "${KONG_ADMIN_URL}/plugins" | jq -r '.data[] | select(.name=="jwt") | .id')

PLUGIN_COUNT=0
for PLUGIN_ID in $JWT_PLUGINS; do
    # Update plugin to use 'iss' claim for issuer matching
    UPDATE_RESPONSE=$(curl -s -X PATCH "${KONG_ADMIN_URL}/plugins/$PLUGIN_ID" \
        -H "Content-Type: application/json" \
        -d '{
            "config": {
                "claims_to_verify": ["exp"],
                "key_claim_name": "iss",
                "secret_is_base64": false,
                "anonymous": null
            }
        }')
    
    if echo "$UPDATE_RESPONSE" | grep -q "jwt"; then
        ((PLUGIN_COUNT++))
    fi
done

print_success "Updated $PLUGIN_COUNT JWT plugins"
echo ""

# Step 4: Test JWT validation
echo "🧪 Step 4: Testing JWT validation..."
echo ""

print_warning "To test JWT validation, you need to:"
echo "1. Modify Auth Service to include 'iss' claim in JWT payload"
echo "2. Set 'iss': 'auth-service' in the JWT payload"
echo "3. Login to get a new JWT token"
echo "4. Use the token to access protected routes"
echo ""

echo "Example Auth Service modification (login.use-case.ts):"
echo "───────────────────────────────────────────────────────"
echo "const payload = {"
echo "  sub: user.id,"
echo "  email: user.email,"
echo "  iss: 'auth-service',  // ← Add this line"
echo "  roles: user.roles?.map((role: any) => role.name) || [],"
echo "  permissions: this.getUserPermissions(user),"
echo "};"
echo ""

# Step 5: Display test commands
echo "📋 Step 5: Test Commands"
echo "──────────────────────────────────────────────────"
echo ""
echo "# 1. Login to get JWT token:"
echo "curl -X POST http://localhost:8000/api/v1/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"admin@example.com\",\"password\":\"Admin123!\"}'"
echo ""
echo "# 2. Extract token:"
echo "TOKEN=\$(curl -s -X POST http://localhost:8000/api/v1/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"admin@example.com\",\"password\":\"Admin123!\"}' | \\"
echo "  jq -r '.data.access_token')"
echo ""
echo "# 3. Test protected endpoint:"
echo "curl http://localhost:8000/api/v1/users \\"
echo "  -H \"Authorization: Bearer \$TOKEN\""
echo ""
echo "# 4. Decode JWT to verify 'iss' claim:"
echo "echo \$TOKEN | cut -d. -f2 | base64 -d 2>/dev/null | jq"
echo ""

echo "======================================"
print_success "JWT configuration complete!"
echo ""
print_warning "Next step: Update Auth Service to include 'iss' claim"
echo "See: auth-service/src/application/use-cases/auth/login.use-case.ts"
echo ""
