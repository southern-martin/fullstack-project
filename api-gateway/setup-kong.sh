#!/bin/bash
# Kong Gateway Setup Script
# Configures Kong with services, routes, and RBAC policies

set -e

KONG_ADMIN_URL="${KONG_ADMIN_URL:-http://localhost:8001}"
KONG_PROXY_URL="${KONG_PROXY_URL:-http://localhost:8000}"

echo "🚀 Kong Gateway Configuration Script"
echo "======================================"
echo "Admin API: $KONG_ADMIN_URL"
echo "Proxy API: $KONG_PROXY_URL"
echo ""

# Wait for Kong to be ready
echo "⏳ Waiting for Kong Admin API..."
until curl -s "$KONG_ADMIN_URL" > /dev/null 2>&1; do
  echo "   Still waiting..."
  sleep 2
done
echo "✅ Kong is ready!"
echo ""

# ============================================
# CREATE SERVICES
# ============================================

echo "📦 Creating Services..."

# Auth Service
curl -s -X POST "$KONG_ADMIN_URL/services" \
  -d "name=auth-service" \
  -d "url=http://auth-service:3001" \
  -d "tags=microservice" \
  -d "tags=auth" > /dev/null
echo "✅ auth-service created"

# User Service
curl -s -X POST "$KONG_ADMIN_URL/services" \
  -d "name=user-service" \
  -d "url=http://user-service:3003" \
  -d "tags=microservice" \
  -d "tags=users" > /dev/null
echo "✅ user-service created"

# Carrier Service
curl -s -X POST "$KONG_ADMIN_URL/services" \
  -d "name=carrier-service" \
  -d "url=http://carrier-service:3004" \
  -d "tags=microservice" \
  -d "tags=carrier" > /dev/null
echo "✅ carrier-service created"

# Customer Service
curl -s -X POST "$KONG_ADMIN_URL/services" \
  -d "name=customer-service" \
  -d "url=http://customer-service:3005" \
  -d "tags=microservice" \
  -d "tags=customer" > /dev/null
echo "✅ customer-service created"

# Pricing Service
curl -s -X POST "$KONG_ADMIN_URL/services" \
  -d "name=pricing-service" \
  -d "url=http://pricing-service:3006" \
  -d "tags=microservice" \
  -d "tags=pricing" > /dev/null
echo "✅ pricing-service created"

# Translation Service
curl -s -X POST "$KONG_ADMIN_URL/services" \
  -d "name=translation-service" \
  -d "url=http://translation-service:3007" \
  -d "tags=microservice" \
  -d "tags=translation" > /dev/null
echo "✅ translation-service created"

echo ""

# ============================================
# CREATE ROUTES - AUTH SERVICE (Public)
# ============================================

echo "🛣️  Creating Routes..."

# Auth Login (Public)
curl -s -X POST "$KONG_ADMIN_URL/services/auth-service/routes" \
  -d "name=auth-login" \
  -d "paths[]=/api/v1/auth/login" \
  -d "methods[]=POST" \
  -d "strip_path=false" > /dev/null
echo "✅ /api/v1/auth/login"

# Auth Register (Public)
curl -s -X POST "$KONG_ADMIN_URL/services/auth-service/routes" \
  -d "name=auth-register" \
  -d "paths[]=/api/v1/auth/register" \
  -d "methods[]=POST" \
  -d "strip_path=false" > /dev/null
echo "✅ /api/v1/auth/register"

# Auth Refresh (Public)
curl -s -X POST "$KONG_ADMIN_URL/services/auth-service/routes" \
  -d "name=auth-refresh" \
  -d "paths[]=/api/v1/auth/refresh" \
  -d "methods[]=POST" \
  -d "strip_path=false" > /dev/null
echo "✅ /api/v1/auth/refresh"

# Auth Logout (Protected)
curl -s -X POST "$KONG_ADMIN_URL/services/auth-service/routes" \
  -d "name=auth-logout" \
  -d "paths[]=/api/v1/auth/logout" \
  -d "methods[]=POST" \
  -d "strip_path=false" > /dev/null
echo "✅ /api/v1/auth/logout"

# Auth Profile (Protected)
curl -s -X POST "$KONG_ADMIN_URL/services/auth-service/routes" \
  -d "name=auth-profile" \
  -d "paths[]=/api/v1/auth/profile" \
  -d "methods[]=GET" \
  -d "methods[]=PUT" \
  -d "strip_path=false" > /dev/null
echo "✅ /api/v1/auth/profile"

# ============================================
# CREATE ROUTES - USER SERVICE (Protected)
# ============================================

# Users CRUD
curl -s -X POST "$KONG_ADMIN_URL/services/user-service/routes" \
  -d "name=users-routes" \
  -d "paths[]=/api/v1/users" \
  -d "paths[]=/api/v1/users/.*" \
  -d "methods[]=GET" \
  -d "methods[]=POST" \
  -d "methods[]=PUT" \
  -d "methods[]=PATCH" \
  -d "methods[]=DELETE" \
  -d "strip_path=false" > /dev/null
echo "✅ /api/v1/users/*"

# Roles CRUD
curl -s -X POST "$KONG_ADMIN_URL/services/user-service/routes" \
  -d "name=roles-routes" \
  -d "paths[]=/api/v1/roles" \
  -d "paths[]=/api/v1/roles/.*" \
  -d "methods[]=GET" \
  -d "methods[]=POST" \
  -d "methods[]=PUT" \
  -d "methods[]=PATCH" \
  -d "methods[]=DELETE" \
  -d "strip_path=false" > /dev/null
echo "✅ /api/v1/roles/*"

# ============================================
# CREATE ROUTES - CARRIER SERVICE (Protected)
# ============================================

curl -s -X POST "$KONG_ADMIN_URL/services/carrier-service/routes" \
  -d "name=carriers-routes" \
  -d "paths[]=/api/carriers" \
  -d "paths[]=/api/carriers/.*" \
  -d "methods[]=GET" \
  -d "methods[]=POST" \
  -d "methods[]=PUT" \
  -d "methods[]=PATCH" \
  -d "methods[]=DELETE" \
  -d "strip_path=false" > /dev/null
echo "✅ /api/carriers/*"

# ============================================
# CREATE ROUTES - CUSTOMER SERVICE (Protected)
# ============================================

curl -s -X POST "$KONG_ADMIN_URL/services/customer-service/routes" \
  -d "name=customers-routes" \
  -d "paths[]=/api/customers" \
  -d "paths[]=/api/customers/.*" \
  -d "methods[]=GET" \
  -d "methods[]=POST" \
  -d "methods[]=PUT" \
  -d "methods[]=PATCH" \
  -d "methods[]=DELETE" \
  -d "strip_path=false" > /dev/null
echo "✅ /api/customers/*"

# ============================================
# CREATE ROUTES - PRICING SERVICE (Protected)
# ============================================

curl -s -X POST "$KONG_ADMIN_URL/services/pricing-service/routes" \
  -d "name=pricing-routes" \
  -d "paths[]=/api/pricing" \
  -d "paths[]=/api/pricing/.*" \
  -d "methods[]=GET" \
  -d "methods[]=POST" \
  -d "methods[]=PUT" \
  -d "methods[]=PATCH" \
  -d "methods[]=DELETE" \
  -d "strip_path=false" > /dev/null
echo "✅ /api/pricing/*"

# ============================================
# CREATE ROUTES - TRANSLATION SERVICE (Protected)
# ============================================

curl -s -X POST "$KONG_ADMIN_URL/services/translation-service/routes" \
  -d "name=translations-routes" \
  -d "paths[]=/api/v1/translations" \
  -d "paths[]=/api/v1/translations/.*" \
  -d "methods[]=GET" \
  -d "methods[]=POST" \
  -d "methods[]=PUT" \
  -d "methods[]=PATCH" \
  -d "methods[]=DELETE" \
  -d "strip_path=false" > /dev/null
echo "✅ /api/v1/translations/*"

echo ""

# ============================================
# CONFIGURE GLOBAL PLUGINS
# ============================================

echo "🔌 Configuring Global Plugins..."

# CORS Plugin
curl -s -X POST "$KONG_ADMIN_URL/plugins" \
  -d "name=cors" \
  -d "config.origins=http://localhost:3000" \
  -d "config.origins=http://localhost:3001" \
  -d "config.origins=http://react-admin:3000" \
  -d "config.credentials=true" \
  -d "config.max_age=3600" > /dev/null
echo "✅ CORS plugin enabled"

# Rate Limiting Plugin
curl -s -X POST "$KONG_ADMIN_URL/plugins" \
  -d "name=rate-limiting" \
  -d "config.minute=100" \
  -d "config.hour=1000" \
  -d "config.policy=local" > /dev/null
echo "✅ Rate limiting enabled"

echo ""

# ============================================
# CONFIGURE JWT AUTHENTICATION
# ============================================

echo "🔐 Configuring JWT Authentication..."

# Enable JWT on protected routes (all except auth login/register/refresh)
for route in auth-logout auth-profile users-routes roles-routes carriers-routes customers-routes pricing-routes translations-routes; do
  curl -s -X POST "$KONG_ADMIN_URL/routes/$route/plugins" \
    -d "name=jwt" \
    -d "config.key_claim_name=sub" > /dev/null
  echo "✅ JWT enabled on $route"
done

echo ""

# ============================================
# CREATE JWT CREDENTIALS
# ============================================

echo "🔑 Creating JWT Credentials..."

# This will be integrated with your Auth Service's JWT secret
# For now, create a sample consumer and JWT credential

# Create consumer
curl -s -X POST "$KONG_ADMIN_URL/consumers" \
  -d "username=test-user" \
  -d "custom_id=1" > /dev/null
echo "✅ Consumer 'test-user' created"

# Create JWT credential for consumer
# Note: Replace with your actual JWT secret from Auth Service
JWT_SECRET="${JWT_SECRET:-your-secret-key-from-auth-service}"

curl -s -X POST "$KONG_ADMIN_URL/consumers/test-user/jwt" \
  -d "key=user-issuer" \
  -d "algorithm=HS256" \
  -d "secret=$JWT_SECRET" > /dev/null
echo "✅ JWT credential created"

echo ""
echo "======================================"
echo "✅ Kong configuration complete!"
echo ""
echo "📊 Kong Admin UI (Konga): http://localhost:1337"
echo "🌐 Kong Proxy: http://localhost:8000"
echo "🔧 Kong Admin API: http://localhost:8001"
echo ""
echo "Next steps:"
echo "1. Access Konga at http://localhost:1337"
echo "2. Create admin user and connect to Kong"
echo "3. Configure JWT plugin with your Auth Service secret"
echo "4. Test routes: curl http://localhost:8000/api/v1/auth/login"
echo ""
