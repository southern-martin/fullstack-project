#!/bin/bash

# Docker System Cleanup Script
# WARNING: This script performs a system-wide Docker cleanup
# It will remove ALL unused containers, networks, images, and volumes

set -e

echo "⚠️  WARNING: This will perform a system-wide Docker cleanup!"
echo "   This will remove ALL unused containers, networks, images, and volumes."
echo "   Make sure you don't have any important data in unused Docker resources."
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled."
    exit 1
fi

echo "🧹 Starting system-wide Docker cleanup..."

# Remove all stopped containers
echo "📦 Removing all stopped containers..."
docker container prune -f

# Remove all unused networks
echo "🌐 Removing all unused networks..."
docker network prune -f

# Remove all unused images
echo "🖼️  Removing all unused images..."
docker image prune -a -f

# Remove all unused volumes
echo "💾 Removing all unused volumes..."
docker volume prune -f

# Remove all unused build cache
echo "🔨 Removing all unused build cache..."
docker builder prune -a -f

# System prune (removes everything unused)
echo "🧽 Performing system prune..."
docker system prune -a -f --volumes

echo "✅ System-wide Docker cleanup completed!"
echo ""
echo "📋 What was cleaned:"
echo "   • All stopped containers"
echo "   • All unused networks"
echo "   • All unused images"
echo "   • All unused volumes"
echo "   • All unused build cache"
echo "   • All unused system resources"
echo ""
echo "💡 This should free up significant disk space."
echo "🚀 To start fresh:"
echo "   npm run docker:build"
echo "   npm run docker:start"








