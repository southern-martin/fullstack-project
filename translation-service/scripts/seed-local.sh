#!/bin/bash

# Translation Service Seed Script
# Runs the seed data TypeScript file using ts-node

# Set script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVICE_DIR="$(dirname "$SCRIPT_DIR")"

echo "🌱 Starting Translation Service data seeding..."
echo "📂 Service directory: $SERVICE_DIR"

# Change to service directory
cd "$SERVICE_DIR" || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "❌ node_modules not found. Please run 'npm install' first."
  exit 1
fi

# Run the seed script using ts-node
echo "🚀 Running seed script..."
npx ts-node scripts/seed-data.ts

# Check exit code
if [ $? -eq 0 ]; then
  echo "✅ Seeding completed successfully!"
else
  echo "❌ Seeding failed with exit code $?"
  exit 1
fi
