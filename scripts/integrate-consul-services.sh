#!/bin/bash

# Consul Week 2 Service Integration Script
# Applies Consul configuration to Customer, Carrier, and Pricing services

set -e

echo "=== Consul Week 2: Automated Service Integration ==="
echo ""

# Services to integrate
SERVICES=("customer-service" "carrier-service" "pricing-service")
BASE_DIR="/opt/cursor-project/fullstack-project"

for SERVICE in "${SERVICES[@]}"; do
    echo "=== Integrating $SERVICE with Consul ==="
    
    SERVICE_DIR="$BASE_DIR/$SERVICE"
    CONFIG_DIR="$SERVICE_DIR/src/infrastructure/config"
    
    # Create config directory if it doesn't exist
    mkdir -p "$CONFIG_DIR"
    
    # Copy Consul config files from user-service as template
    echo "  ✓ Copying Consul configuration modules..."
    cp "$BASE_DIR/user-service/src/infrastructure/config/consul.config.ts" "$CONFIG_DIR/"
    cp "$BASE_DIR/user-service/src/infrastructure/config/redis-consul.config.ts" "$CONFIG_DIR/"
    
    # Update service prefix in consul.config.ts
    echo "  ✓ Updating service prefix to $SERVICE..."
    sed -i '' "s/config\/user-service/config\/$SERVICE/g" "$CONFIG_DIR/consul.config.ts"
    sed -i '' "s/'user'/'${SERVICE%-service}'/g" "$CONFIG_DIR/redis-consul.config.ts"
    
    echo "  ✓ $SERVICE Consul integration complete"
    echo ""
done

echo "=== All Services Integrated ==="
echo ""
echo "Next steps:"
echo "1. Update each service's app.module.ts to use Consul configuration"
echo "2. Rebuild services: docker-compose -f docker-compose.hybrid.yml build"
echo "3. Restart services: docker-compose -f docker-compose.hybrid.yml restart"
echo "4. Verify services are loading config from Consul"
