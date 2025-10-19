#!/bin/bash

# Seed Carrier Service with common carriers for local development
# This script temporarily overrides Redis password for local development

echo "🌱 Seeding Carrier Service with common carriers..."
echo ""

# Set local environment (no Redis password for local development)
export REDIS_PASSWORD=""
export NODE_ENV=development

# Run the seed script
npm run seed

echo ""
echo "✅ Carrier Service seeding completed!"
echo "📊 Check http://localhost:3005/api/v1/carriers to see the carriers"
