#!/bin/bash

# Docker Start Script for Auth Service
set -e

echo "🚀 Starting Auth Service with Docker Compose..."

# Start all services
docker-compose up -d

echo "⏳ Waiting for services to be ready..."

# Wait for database to be ready
echo "📊 Waiting for database..."
until docker-compose exec auth-db mysqladmin ping -h localhost -u root -pauth_root_password --silent; do
    echo "⏳ Database is unavailable - sleeping"
    sleep 2
done
echo "✅ Database is ready!"

# Wait for auth service to be ready
echo "🔐 Waiting for Auth Service..."
until curl -f http://localhost:3001/api/v1/auth/health > /dev/null 2>&1; do
    echo "⏳ Auth Service is unavailable - sleeping"
    sleep 2
done
echo "✅ Auth Service is ready!"

echo ""
echo "🎉 Auth Service is running successfully!"
echo ""
echo "📋 Service URLs:"
echo "   🔐 Auth Service: http://localhost:3001"
echo "   📊 Health Check: http://localhost:3001/api/v1/auth/health"
echo "   🗄️  Database: localhost:3307"
echo "   🔴 Redis: localhost:6379"
echo ""
echo "📚 API Documentation:"
echo "   POST /api/v1/auth/register - User registration"
echo "   POST /api/v1/auth/login - User login"
echo "   POST /api/v1/auth/validate-token - Token validation"
echo "   GET  /api/v1/auth/profile - Get user profile"
echo "   GET  /api/v1/auth/health - Health check"
echo ""
echo "🔍 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop:"
echo "   docker-compose down"








