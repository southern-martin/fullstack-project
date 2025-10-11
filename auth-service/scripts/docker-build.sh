#!/bin/bash

# Docker Build Script for Auth Service
set -e

echo "🐳 Building Auth Service Docker Image..."

# Build the Docker image
docker build -t auth-service:latest .

echo "✅ Docker image built successfully!"
echo "📦 Image: auth-service:latest"
echo ""
echo "🚀 To run the service:"
echo "   docker-compose up -d"
echo ""
echo "🔍 To view logs:"
echo "   docker-compose logs -f auth-service"
echo ""
echo "🛑 To stop the service:"
echo "   docker-compose down"





