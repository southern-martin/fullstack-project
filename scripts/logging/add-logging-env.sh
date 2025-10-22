#!/bin/bash

# Script to add structured logging environment variables to all services
# Usage: ./add-logging-env.sh

set -e

SERVICES=(
  "auth-service"
  "user-service"
  "carrier-service"
  "customer-service"
  "pricing-service"
  "translation-service"
)

LOGGING_VARS='
# Logging Configuration
SERVICE_NAME=replace_service_name
LOG_LEVEL=info
NODE_ENV=development
DB_LOGGING=true
'

echo "Adding logging environment variables to all services..."

for service in "${SERVICES[@]}"; do
  ENV_FILE="../${service}/.env"
  ENV_EXAMPLE="../${service}/env.example"
  
  echo "Processing ${service}..."
  
  # Update service name in logging vars
  SERVICE_LOGGING_VARS="${LOGGING_VARS//replace_service_name/$service}"
  
  # Add to .env if it exists
  if [ -f "$ENV_FILE" ]; then
    # Check if logging vars already exist
    if ! grep -q "# Logging Configuration" "$ENV_FILE"; then
      echo "$SERVICE_LOGGING_VARS" >> "$ENV_FILE"
      echo "  ✓ Added to .env"
    else
      echo "  ℹ Logging configuration already exists in .env"
    fi
  fi
  
  # Add to env.example if it exists
  if [ -f "$ENV_EXAMPLE" ]; then
    # Check if logging vars already exist
    if ! grep -q "# Logging Configuration" "$ENV_EXAMPLE"; then
      echo "$SERVICE_LOGGING_VARS" >> "$ENV_EXAMPLE"
      echo "  ✓ Added to env.example"
    else
      echo "  ℹ Logging configuration already exists in env.example"
    fi
  fi
done

echo ""
echo "✅ Logging environment variables added successfully!"
echo ""
echo "Environment variables added:"
echo "  - SERVICE_NAME: Service identifier for logs"
echo "  - LOG_LEVEL: Logging level (debug, info, warn, error)"
echo "  - NODE_ENV: Environment (development, production)"
echo "  - DB_LOGGING: Enable/disable database query logging"
