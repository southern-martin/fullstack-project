#!/bin/bash

# Kong RBAC Configuration Script
# This script configures Role-Based Access Control using Kong's ACL plugin

set -e

KONG_ADMIN_URL="${KONG_ADMIN_URL:-http://localhost:8001}"

echo "🔐 Kong RBAC (ACL) Configuration"
echo "========================================"
echo "Admin API: $KONG_ADMIN_URL"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "📋 Step 1: Configure ACL Plugin on Admin-Only Routes"
echo "──────────────────────────────────────────────────────"
echo ""

# Function to add ACL to a route
add_acl_to_route() {
    local ROUTE_NAME=$1
    local ALLOWED_GROUPS=$2
    
    # Get route ID
    ROUTE_ID=$(curl -s "${KONG_ADMIN_URL}/routes/${ROUTE_NAME}" | jq -r '.id')
    
    if [ "$ROUTE_ID" = "null" ] || [ -z "$ROUTE_ID" ]; then
        echo "Route ${ROUTE_NAME} not found, skipping..."
        return 1
    fi
    
    # Add ACL plugin to route
    ACL_RESPONSE=$(curl -s -X POST "${KONG_ADMIN_URL}/routes/${ROUTE_ID}/plugins" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"acl\",
            \"config\": {
                \"allow\": [${ALLOWED_GROUPS}],
                \"hide_groups_header\": true
            }
        }")
    
    if echo "$ACL_RESPONSE" | grep -q "\"name\":\"acl\""; then
        print_success "ACL added to route: ${ROUTE_NAME} (allow: ${ALLOWED_GROUPS})"
        return 0
    else
        echo "Failed to add ACL to ${ROUTE_NAME}"
        return 1
    fi
}

# Admin-only routes (super_admin and admin only)
print_info "Configuring admin-only routes..."
add_acl_to_route "users-routes" '"admin", "super_admin"' || true
add_acl_to_route "roles-routes" '"admin", "super_admin"' || true

echo ""

# Manager routes (admin, super_admin, manager)
print_info "Configuring manager routes..."
add_acl_to_route "carriers-routes" '"admin", "super_admin", "manager"' || true
add_acl_to_route "customers-routes" '"admin", "super_admin", "manager"' || true
add_acl_to_route "pricing-routes" '"admin", "super_admin", "manager"' || true

echo ""

# Step 2: Create a Kong plugin for dynamic role extraction from JWT
echo "📋 Step 2: Create Request Transformer for Role Extraction"
echo "──────────────────────────────────────────────────────"
echo ""

print_info "Kong will extract roles from JWT and validate against ACL groups"
print_warning "This requires Auth Service to create Kong consumers with ACL groups"

echo ""
echo "======================================"
print_success "ACL configuration complete!"
echo ""

echo "📚 Next Steps:"
echo "──────────────────────────────────────────────────────"
echo ""
echo "1. Update Auth Service to create Kong consumers on login/register"
echo "2. Map database roles to Kong ACL groups:"
echo "   - super_admin → super_admin (ACL group)"
echo "   - admin → admin (ACL group)"
echo "   - manager → manager (ACL group)"
echo "   - user → user (ACL group)"
echo "   - guest → guest (ACL group)"
echo ""
echo "3. Test RBAC:"
echo "   # Login as admin (should access /api/v1/users)"
echo "   TOKEN_ADMIN=\$(curl -s -X POST http://localhost:8000/api/v1/auth/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"admin@example.com\",\"password\":\"Admin123!\"}' | \\"
echo "     jq -r '.data.access_token')"
echo ""
echo "   curl http://localhost:8000/api/v1/users \\"
echo "     -H \"Authorization: Bearer \$TOKEN_ADMIN\""
echo ""
echo "   # Login as regular user (should fail on /api/v1/users)"
echo "   TOKEN_USER=\$(curl -s -X POST http://localhost:8000/api/v1/auth/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"user@example.com\",\"password\":\"User123!\"}' | \\"
echo "     jq -r '.data.access_token')"
echo ""
echo "   curl http://localhost:8000/api/v1/users \\"
echo "     -H \"Authorization: Bearer \$TOKEN_USER\""
echo "   # Expected: 403 Forbidden (not in allowed ACL groups)"
echo ""

print_warning "IMPORTANT: ACL requires Kong consumers with group assignments"
print_info "Current setup validates JWT but doesn't enforce ACL yet"
print_info "We need to sync users from Auth Service to Kong consumers"

echo ""
