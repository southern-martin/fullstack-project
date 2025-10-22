#!/bin/bash

# Centralized Logging Setup Script
# Choose between lightweight (Loki) or full (ELK) stack

set -e

echo "🔍 Centralized Logging Setup"
echo "=============================="
echo ""
echo "Choose your logging stack:"
echo ""
echo "1) 🚀 Lightweight (Loki + Promtail + Grafana)"
echo "   - Resource Usage: ~300-400MB RAM"
echo "   - Best for: Local development"
echo "   - Features: Fast log search, Grafana integration"
echo "   - Startup time: ~30 seconds"
echo ""
echo "2) 🔥 ELK Stack (Elasticsearch + Logstash + Kibana + Filebeat)"
echo "   - Resource Usage: ~1-1.5GB RAM (optimized)"
echo "   - Best for: Production-like setup, advanced analysis"
echo "   - Features: Full-text search, complex queries, ML features"
echo "   - Startup time: ~2-3 minutes"
echo ""
echo "3) ❌ Stop logging stack"
echo ""

read -p "Select option (1/2/3): " choice

case $choice in
  1)
    echo ""
    echo "🚀 Starting Lightweight Logging Stack..."
    echo ""
    
    # Stop ELK if running
    docker-compose -f docker-compose.logging.yml down 2>/dev/null || true
    
    # Start Loki stack
    docker-compose -f docker-compose.logging-lite.yml up -d
    
    echo ""
    echo "✅ Loki Stack Started!"
    echo ""
    echo "📊 Access Points:"
    echo "   - Loki API: http://localhost:3200"
    echo "   - Grafana: http://localhost:3100 (already running)"
    echo ""
    echo "🔧 Next Steps:"
    echo "   1. Open Grafana: http://localhost:3100"
    echo "   2. Go to: Configuration → Data Sources"
    echo "   3. Add Loki datasource: http://loki:3100"
    echo "   4. Go to Explore and start querying logs!"
    echo ""
    echo "📝 Example Queries:"
    echo '   {service="auth-service"}'
    echo '   {service="kong"} |= "error"'
    echo '   {container_name=~".*service"} | json | level="error"'
    echo ""
    ;;
    
  2)
    echo ""
    echo "🔥 Starting ELK Stack (Optimized)..."
    echo "⚠️  This will use ~1-1.5GB RAM. Make sure Docker has enough memory allocated."
    echo ""
    
    # Stop Loki if running
    docker-compose -f docker-compose.logging-lite.yml down 2>/dev/null || true
    
    # Create required directories
    mkdir -p logstash/pipeline logstash/config filebeat
    
    # Start ELK stack
    docker-compose -f docker-compose.logging.yml up -d
    
    echo ""
    echo "⏳ ELK Stack is starting... This may take 2-3 minutes."
    echo ""
    echo "Waiting for Elasticsearch..."
    until curl -s http://localhost:9200/_cluster/health > /dev/null 2>&1; do
      echo -n "."
      sleep 5
    done
    
    echo ""
    echo "✅ ELK Stack Started!"
    echo ""
    echo "📊 Access Points:"
    echo "   - Elasticsearch: http://localhost:9200"
    echo "   - Kibana: http://localhost:5601"
    echo "   - Logstash: http://localhost:9600"
    echo ""
    echo "🔧 Next Steps:"
    echo "   1. Open Kibana: http://localhost:5601"
    echo "   2. Wait for it to fully load (~1-2 min)"
    echo "   3. Go to: Management → Stack Management → Index Patterns"
    echo "   4. Create index pattern: filebeat-* or logstash-*"
    echo "   5. Go to Discover and start exploring logs!"
    echo ""
    echo "💡 Tip: Stop the stack when not debugging to save resources:"
    echo "   docker-compose -f docker-compose.logging.yml down"
    echo ""
    ;;
    
  3)
    echo ""
    echo "🛑 Stopping all logging stacks..."
    docker-compose -f docker-compose.logging.yml down 2>/dev/null || true
    docker-compose -f docker-compose.logging-lite.yml down 2>/dev/null || true
    echo "✅ Logging stacks stopped"
    echo ""
    ;;
    
  *)
    echo "Invalid option. Exiting."
    exit 1
    ;;
esac

echo ""
echo "📚 Documentation: See api-gateway/LOGGING-GUIDE.md for more details"
echo ""
