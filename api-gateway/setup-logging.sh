#!/bin/bash

# Centralized Logging Setup Script
# Loki + Promtail + Grafana Stack

set -e

echo "🔍 Centralized Logging Setup"
echo "=============================="
echo ""
echo "Choose an option:"
echo ""
echo "1) 🚀 Start Logging Stack (Loki + Promtail)"
echo "   - Resource Usage: ~300-400MB RAM"
echo "   - Features: Fast log search, Grafana integration"
echo "   - Startup time: ~30 seconds"
echo ""
echo "2) ❌ Stop Logging Stack"
echo ""

read -p "Select option (1/2): " choice

case $choice in
  1)
    echo ""
    echo "🚀 Starting Centralized Logging Stack..."
    echo ""
    
    # Start Loki stack
    docker-compose -f docker-compose.logging.yml up -d
    
    # Wait for Loki to be ready
    echo "⏳ Waiting for Loki to be ready..."
    sleep 5
    
    # Check if Loki datasource already exists in Grafana
    echo "🔧 Configuring Grafana datasource..."
    DATASOURCE_EXISTS=$(curl -s -u admin:admin123 http://localhost:3100/api/datasources/name/Loki 2>/dev/null || echo "not_found")
    
    if echo "$DATASOURCE_EXISTS" | grep -q "not_found"; then
      # Add Loki datasource to Grafana
      curl -X POST http://admin:admin123@localhost:3100/api/datasources \
        -H "Content-Type: application/json" \
        -d '{
          "name": "Loki",
          "type": "loki",
          "url": "http://loki:3100",
          "access": "proxy",
          "isDefault": false
        }' > /dev/null 2>&1
      echo "✅ Loki datasource added to Grafana"
    else
      echo "ℹ️  Loki datasource already exists in Grafana"
    fi
    
    echo ""
    echo "✅ Logging Stack Started!"
    echo ""
    echo "📊 Access Points:"
    echo "   - Loki API: http://localhost:3200"
    echo "   - Grafana: http://localhost:3100 (admin/admin123)"
    echo ""
    echo "🔧 Next Steps:"
    echo "   1. Open Grafana: http://localhost:3100/explore"
    echo "   2. Select Loki datasource from dropdown"
    echo "   3. Start querying logs!"
    echo ""
    echo "📝 Example LogQL Queries:"
    echo '   {service="auth-service"} | json'
    echo '   {service=~".+"} | json | level="error"'
    echo '   {container=~".*service"} | json | correlationId="abc-123"'
    echo ""
    ;;
    
  2)
    echo ""
    echo "🛑 Stopping logging stack..."
    docker-compose -f docker-compose.logging.yml down
    echo "✅ Logging stack stopped"
    echo ""
    ;;
    
  *)
    echo "Invalid option. Exiting."
    exit 1
    ;;
esac

echo ""
echo "📚 Documentation:"
echo "   - Quick Start: api-gateway/STRUCTURED-LOGGING-README.md"
echo "   - Full Guide: api-gateway/STRUCTURED-LOGGING-GUIDE.md"
echo ""
