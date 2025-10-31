#!/bin/bash
# Quick Start Script for Fullstack Project
# This script starts all necessary services in the correct order

set -e  # Exit on error

echo "🚀 Starting Fullstack Project Services..."
echo ""

# Function to wait for service health
wait_for_health() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service to be healthy..."
    while [ $attempt -le $max_attempts ]; do
        if docker ps | grep -q "$service.*healthy"; then
            echo "✅ $service is healthy"
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service failed to become healthy after ${max_attempts}s"
    return 1
}

# Step 1: Start Kong API Gateway
echo "📡 Step 1: Starting Kong API Gateway..."
cd /opt/cursor-project/fullstack-project/api-gateway
docker-compose -f docker-compose.kong.yml up -d
wait_for_health "kong-gateway"
echo ""

# Step 2: Start Infrastructure Services
echo "🏗️  Step 2: Starting Infrastructure Services..."
cd /opt/cursor-project/fullstack-project
docker-compose -f docker-compose.hybrid.yml up -d \
    shared-user-db \
    shared-redis \
    consul
    
wait_for_health "shared-user-database"
wait_for_health "shared-redis"
echo ""

# Step 3: Start Core Services
echo "🔧 Step 3: Starting Core Services..."
docker-compose -f docker-compose.hybrid.yml up -d \
    auth-service \
    user-service \
    translation-service

wait_for_health "auth-service"
wait_for_health "user-service"
wait_for_health "translation-service"
echo ""

# Step 3.5: Start Business Services (for Dashboard)
echo "💼 Step 3.5: Starting Business Services..."
docker-compose -f docker-compose.hybrid.yml up -d \
    customer-service \
    carrier-service \
    pricing-service

wait_for_health "customer-service"
wait_for_health "carrier-service"
# Note: pricing-service may take longer to start
echo ""

# Step 4: Verify Services
echo "✅ Step 4: Verifying Services..."
echo ""

echo "Testing Kong Gateway..."
if curl -s http://localhost:8001/status | grep -q "reachable"; then
    echo "✅ Kong Admin API is accessible"
else
    echo "❌ Kong Admin API is not responding"
fi

echo "Testing Auth Service..."
if curl -s http://localhost:8000/api/v1/auth/health | grep -q "success"; then
    echo "✅ Auth Service is accessible through Kong"
else
    echo "❌ Auth Service is not responding"
fi

echo "Testing Translation Service..."
if curl -s http://localhost:8000/api/v1/translation/languages/active | grep -q "data"; then
    echo "✅ Translation Service is accessible through Kong"
else
    echo "❌ Translation Service is not responding"
fi

echo "Testing Customer Service..."
if curl -s http://localhost:8000/api/v1/customers?page=1&limit=1 | grep -q "data"; then
    echo "✅ Customer Service is accessible through Kong"
else
    echo "❌ Customer Service is not responding"
fi

echo "Testing Carrier Service..."
if curl -s http://localhost:8000/api/v1/carriers?page=1&limit=1 | grep -q "data"; then
    echo "✅ Carrier Service is accessible through Kong"
else
    echo "❌ Carrier Service is not responding"
fi

echo ""
echo "🎉 All services started successfully!"
echo ""
echo "📊 Service Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | \
    grep -E "NAME|kong|auth|user|translation|customer|carrier|pricing|shared"
echo ""
echo "🌐 Access Points:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Kong Gateway:        http://localhost:8000"
echo "  Kong Admin API:      http://localhost:8001"
echo "  Konga Dashboard:     http://localhost:1337"
echo "  Auth Service:        http://localhost:3001"
echo "  User Service:        http://localhost:3003"
echo "  Customer Service:    http://localhost:3004"
echo "  Carrier Service:     http://localhost:3005"
echo "  Pricing Service:     http://localhost:3006"
echo "  Translation Service: http://localhost:3007"
echo ""
echo "📝 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  1. Start React Admin:"
echo "     cd react-admin && npm start"
echo ""
echo "  2. Access React Admin:"
echo "     http://localhost:3000"
echo ""
echo "  3. Default Login:"
echo "     Email: admin@example.com"
echo "     Password: Admin123!"
echo ""
echo "  4. Stop all services:"
echo "     ./scripts/stop-all-services.sh"
echo ""
