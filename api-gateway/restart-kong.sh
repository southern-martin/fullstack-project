#!/bin/bash

###############################################################################
# Kong Gateway Restart Script
# 
# This script properly restarts Kong Gateway services in the correct order
# to avoid startup issues caused by race conditions.
#
# Usage:
#   ./restart-kong.sh
#   
# Or make it executable:
#   chmod +x restart-kong.sh
#   ./restart-kong.sh
###############################################################################

set -e  # Exit on error

echo "🔄 Restarting Kong Gateway Services..."
echo ""

# Navigate to api-gateway directory
cd "$(dirname "$0")"

# Step 1: Stop all Kong services
echo "📦 Step 1: Stopping Kong services..."
docker-compose -f docker-compose.kong.yml down
echo "✅ Kong services stopped"
echo ""

# Step 2: Start Kong database
echo "📦 Step 2: Starting Kong database..."
docker-compose -f docker-compose.kong.yml up -d kong-database
echo "✅ Kong database starting..."
echo ""

# Step 3: Wait for database to be healthy
echo "⏳ Step 3: Waiting for database to be ready..."
echo "   (This usually takes 10-15 seconds)"

max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if docker exec kong-database pg_isready -U kong > /dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    
    attempt=$((attempt + 1))
    echo -n "."
    sleep 1
done

if [ $attempt -eq $max_attempts ]; then
    echo ""
    echo "❌ Database failed to become ready after 30 seconds"
    echo "   Check logs: docker logs kong-database"
    exit 1
fi

echo ""
echo ""

# Step 4: Run migrations
echo "📦 Step 4: Running database migrations..."
docker-compose -f docker-compose.kong.yml up kong-migration
echo "✅ Migrations completed"
echo ""

# Step 5: Start Kong Gateway
echo "📦 Step 5: Starting Kong Gateway..."
docker-compose -f docker-compose.kong.yml up -d kong
echo "✅ Kong Gateway starting..."
echo ""

# Step 6: Wait for Kong to be healthy
echo "⏳ Step 6: Waiting for Kong Gateway to be ready..."
echo "   (This usually takes 10-15 seconds)"

max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:8001/ > /dev/null 2>&1; then
        echo "✅ Kong Gateway is ready!"
        break
    fi
    
    attempt=$((attempt + 1))
    echo -n "."
    sleep 1
done

if [ $attempt -eq $max_attempts ]; then
    echo ""
    echo "❌ Kong Gateway failed to become ready after 30 seconds"
    echo "   Check logs: docker logs kong-gateway"
    exit 1
fi

echo ""
echo ""

# Step 7: Start Konga (optional UI)
echo "📦 Step 7: Starting Konga UI..."
docker-compose -f docker-compose.kong.yml up -d konga
echo "✅ Konga UI started"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Kong Gateway Services Successfully Restarted!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Service Status:"
docker ps --filter name=kong --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "🔗 Available Endpoints:"
echo "   Kong Admin API:  http://localhost:8001/"
echo "   Kong Proxy:      http://localhost:8000/"
echo "   Konga UI:        http://localhost:1337/"
echo ""
echo "💡 Verify Kong is working:"
echo "   curl http://localhost:8001/"
echo ""
