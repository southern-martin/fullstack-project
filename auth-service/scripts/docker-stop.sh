#!/bin/bash

# Docker Stop Script for Auth Service
set -e

echo "🛑 Stopping Auth Service..."

# Stop all services
docker-compose down

echo "✅ Auth Service stopped successfully!"
echo ""
echo "🗑️  To remove volumes (WARNING: This will delete all data):"
echo "   docker-compose down -v"
echo ""
echo "🧹 To remove images:"
echo "   docker-compose down --rmi all"






