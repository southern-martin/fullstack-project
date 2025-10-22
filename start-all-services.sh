#!/bin/bash

echo "🚀 Starting Fullstack Project Services..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
echo "📋 Checking Docker status..."
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo ""
    echo "Please start Docker Desktop:"
    echo "  Mac: Open Docker Desktop application"
    echo "  Linux: sudo systemctl start docker"
    echo "  Windows: Start Docker Desktop"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Navigate to project root
cd "$(dirname "$0")"

# Start all services
echo "📦 Starting all backend services..."
docker-compose -f docker-compose.hybrid.yml up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start services${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Services starting...${NC}"
echo ""

# Wait for services to initialize
echo "⏳ Waiting for services to initialize (60 seconds)..."
for i in {1..60}; do
    echo -n "."
    sleep 1
done
echo ""
echo ""

# Check service health
echo "🏥 Checking service health..."
echo ""

check_service() {
    local url=$1
    local name=$2
    local max_retries=3
    local retry=0
    
    while [ $retry -lt $max_retries ]; do
        if curl -s -f "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is healthy${NC}"
            return 0
        fi
        retry=$((retry + 1))
        if [ $retry -lt $max_retries ]; then
            sleep 2
        fi
    done
    
    echo -e "${RED}❌ $name is not responding${NC}"
    return 1
}

# Check each service
check_service "http://localhost:3001/api/v1/auth/health" "Auth Service (3001)"
check_service "http://localhost:3003/api/v1/users/health" "User Service (3003)"
check_service "http://localhost:3004/health" "Customer Service (3004)"
check_service "http://localhost:3005/health" "Carrier Service (3005)"
check_service "http://localhost:3006/health" "Pricing Service (3006)"
check_service "http://localhost:3007/api/v1/health" "Translation Service (3007)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Services are ready!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Service URLs:"
echo "  🌐 React Admin:        http://localhost:3000"
echo "  🔐 Auth Service:       http://localhost:3001"
echo "  👤 User Service:       http://localhost:3003"
echo "  📦 Customer Service:   http://localhost:3004"
echo "  🚚 Carrier Service:    http://localhost:3005"
echo "  💰 Pricing Service:    http://localhost:3006"
echo "  🌍 Translation Service: http://localhost:3007"
echo ""
echo "🔐 Default Login Credentials:"
echo "  📧 Email:    admin@example.com"
echo "  🔑 Password: Admin123!"
echo ""
echo "🌍 Test Translations:"
echo "  1. Open React Admin (http://localhost:3000)"
echo "  2. Login with credentials above"
echo "  3. Click language selector (top-right corner)"
echo "  4. Select 'Français' or 'Español'"
echo "  5. Navigate to Users → View Details → Profile"
echo "  ✅ All labels should be translated!"
echo ""
echo "📊 View Docker Status:"
echo "  docker-compose -f docker-compose.hybrid.yml ps"
echo ""
echo "📝 View Logs:"
echo "  docker-compose -f docker-compose.hybrid.yml logs -f"
echo ""
echo "🛑 Stop Services:"
echo "  docker-compose -f docker-compose.hybrid.yml down"
echo ""
