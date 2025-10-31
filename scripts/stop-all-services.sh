#!/bin/bash
# Stop All Services Script for Fullstack Project

set -e  # Exit on error

echo "🛑 Stopping Fullstack Project Services..."
echo ""

# Step 1: Stop Backend Services
echo "📦 Step 1: Stopping Backend Services..."
cd /opt/cursor-project/fullstack-project
docker-compose -f docker-compose.hybrid.yml down
echo ""

# Step 2: Stop Kong Gateway
echo "📡 Step 2: Stopping Kong API Gateway..."
cd /opt/cursor-project/fullstack-project/api-gateway
docker-compose -f docker-compose.kong.yml down
echo ""

# Step 3: Verify Shutdown
echo "✅ Step 3: Verifying Shutdown..."
echo ""

RUNNING_SERVICES=$(docker ps --format "{{.Names}}" | grep -E "kong|auth|user|translation|shared" || true)

if [ -z "$RUNNING_SERVICES" ]; then
    echo "✅ All services stopped successfully"
else
    echo "⚠️  Some services are still running:"
    echo "$RUNNING_SERVICES"
    echo ""
    echo "To force stop, run:"
    echo "docker stop \$(docker ps -q)"
fi

echo ""
echo "🎉 Shutdown complete!"
