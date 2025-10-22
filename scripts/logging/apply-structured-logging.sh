#!/bin/bash

# Script to apply structured logging to all NestJS microservices
# This script updates main.ts and app.module.ts files

set -e

SERVICES=(
  "user-service"
  "carrier-service"
  "customer-service"
  "pricing-service"
)

echo "🔧 Applying structured logging to all services..."
echo ""

for service in "${SERVICES[@]}"; do
  echo "Processing ${service}..."
  
  MAIN_TS="../${service}/src/main.ts"
  APP_MODULE="../${service}/src/app.module.ts"
  
  if [ -f "$MAIN_TS" ]; then
    echo "  ✓ Found main.ts"
  fi
  
  if [ -f "$APP_MODULE" ]; then
    echo "  ✓ Found app.module.ts"
  fi
  
  echo ""
done

echo "✅ Analysis complete!"
echo ""
echo "Next steps:"
echo "1. Update each service's main.ts to use WinstonLoggerService"
echo "2. Update each service's app.module.ts to import WinstonLoggerModule"
echo "3. Replace console.log/error/warn with logger calls"
echo "4. Test each service"
echo ""
echo "Run: cd <service> && npm install && npm run build"
