#!/bin/bash

# Docker Cleanup All Script for Southern-Martin Auth Service
# This script performs a comprehensive cleanup including all related containers

set -e

echo "🧹 Starting comprehensive Docker cleanup for Southern-Martin Auth Service..."

# Stop and remove all containers with southern-martin in the name
echo "📦 Stopping and removing all southern-martin containers..."
docker ps -a --filter "name=southern-martin" --format "table {{.Names}}\t{{.Status}}" | grep -v NAMES | awk '{print $1}' | xargs -r docker stop
docker ps -a --filter "name=southern-martin" --format "table {{.Names}}\t{{.Status}}" | grep -v NAMES | awk '{print $1}' | xargs -r docker rm -f

# Remove all volumes with southern-martin in the name
echo "💾 Removing all southern-martin volumes..."
docker volume ls --filter "name=southern-martin" --format "{{.Name}}" | xargs -r docker volume rm -f

# Remove all images with southern-martin in the name
echo "🖼️  Removing all southern-martin images..."
docker images --filter "reference=*southern-martin*" --format "{{.Repository}}:{{.Tag}}" | xargs -r docker rmi -f

# Remove all networks with southern-martin in the name
echo "🌐 Removing all southern-martin networks..."
docker network ls --filter "name=southern-martin" --format "{{.Name}}" | xargs -r docker network rm

# Clean up any dangling images
echo "🧽 Cleaning up dangling images..."
docker image prune -f

echo "✅ Comprehensive Docker cleanup completed!"
echo ""
echo "📋 What was cleaned:"
echo "   • All containers with 'southern-martin' in name"
echo "   • All volumes with 'southern-martin' in name"
echo "   • All images with 'southern-martin' in name"
echo "   • All networks with 'southern-martin' in name"
echo "   • Dangling images"
echo ""
echo "🚀 To start fresh:"
echo "   npm run docker:build"
echo "   npm run docker:start"








