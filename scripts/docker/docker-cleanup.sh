#!/bin/bash

# Docker Cleanup Script for Southern-Martin Auth Service
# This script cleans up containers, volumes, and images for the current project

set -e

echo "🧹 Starting Docker cleanup for Southern-Martin Auth Service..."

# Stop and remove containers
echo "📦 Stopping and removing containers..."
docker-compose down --remove-orphans

# Remove project-specific volumes
echo "💾 Removing project volumes..."
docker volume rm -f southern-martin-auth_southern-martin_auth_db_data 2>/dev/null || true
docker volume rm -f southern-martin-auth_southern-martin_auth_redis_data 2>/dev/null || true

# Remove project-specific images
echo "🖼️  Removing project images..."
docker rmi -f southern-martin-auth-auth-service 2>/dev/null || true
docker rmi -f southern-martin-auth-auth-db 2>/dev/null || true

# Remove project network
echo "🌐 Removing project network..."
docker network rm southern-martin-auth_southern-martin-network 2>/dev/null || true

echo "✅ Docker cleanup completed!"
echo ""
echo "📋 What was cleaned:"
echo "   • Containers: southern-martin-auth-*"
echo "   • Volumes: southern-martin-auth_*"
echo "   • Images: southern-martin-auth-*"
echo "   • Network: southern-martin-auth_southern-martin-network"
echo ""
echo "🚀 To start fresh:"
echo "   npm run docker:build"
echo "   npm run docker:start"








