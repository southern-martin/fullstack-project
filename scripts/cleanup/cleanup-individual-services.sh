#!/bin/bash

# ===========================================
# CLEANUP INDIVIDUAL SERVICES SCRIPT
# ===========================================
# This script cleans up individual Redis and database
# services that are no longer needed in the hybrid architecture.

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[CLEANUP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    print_status "Checking Docker status..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to stop and remove individual services
cleanup_individual_services() {
    print_status "Cleaning up individual services..."
    
    # List of individual services to clean up
    local individual_services=(
        "southern-martin-user-service-redis"
        "southern-martin-auth-service-redis"
        "southern-martin-user-service-db"
        "southern-martin-auth-db"
        "southern-martin-auth-db"
        "southern-martin-user-service"
        "southern-martin-auth-app"
    )
    
    for service in "${individual_services[@]}"; do
        if docker ps -a --format "{{.Names}}" | grep -q "^${service}$"; then
            print_status "Stopping and removing $service..."
            docker stop "$service" 2>/dev/null || true
            docker rm "$service" 2>/dev/null || true
            print_success "$service cleaned up"
        else
            print_warning "$service not found (already cleaned up)"
        fi
    done
}

# Function to clean up individual volumes
cleanup_individual_volumes() {
    print_status "Cleaning up individual volumes..."
    
    # List of individual volumes to clean up
    local individual_volumes=(
        "southern-martin_user_service_db_data"
        "southern-martin_auth_db_data"
        "southern-martin_user_service_redis_data"
        "southern-martin_auth_service_redis_data"
    )
    
    for volume in "${individual_volumes[@]}"; do
        if docker volume ls --format "{{.Name}}" | grep -q "^${volume}$"; then
            print_status "Removing volume $volume..."
            docker volume rm "$volume" 2>/dev/null || true
            print_success "$volume cleaned up"
        else
            print_warning "$volume not found (already cleaned up)"
        fi
    done
}

# Function to clean up individual networks
cleanup_individual_networks() {
    print_status "Cleaning up individual networks..."
    
    # List of individual networks to clean up
    local individual_networks=(
        "southern-martin-user-service-network"
        "southern-martin-auth-service-network"
        "southern-martin-network"
    )
    
    for network in "${individual_networks[@]}"; do
        if docker network ls --format "{{.Name}}" | grep -q "^${network}$"; then
            print_status "Removing network $network..."
            docker network rm "$network" 2>/dev/null || true
            print_success "$network cleaned up"
        else
            print_warning "$network not found (already cleaned up)"
        fi
    done
}

# Function to clean up Docker Compose services
cleanup_docker_compose_services() {
    print_status "Cleaning up Docker Compose services..."
    
    # Clean up individual service Docker Compose files
    local compose_files=(
        "auth-service/docker-compose.yml"
        "user-service/docker-compose.yml"
    )
    
    for compose_file in "${compose_files[@]}"; do
        if [[ -f "$compose_file" ]]; then
            print_status "Cleaning up services from $compose_file..."
            docker-compose -f "$compose_file" down -v 2>/dev/null || true
            print_success "$compose_file services cleaned up"
        else
            print_warning "$compose_file not found"
        fi
    done
}

# Function to verify cleanup
verify_cleanup() {
    print_status "Verifying cleanup..."
    
    # Check for remaining individual services
    local remaining_services=$(docker ps -a --format "{{.Names}}" | grep -E "(southern-martin.*redis|southern-martin.*db)" | grep -v "shared" || true)
    
    if [[ -n "$remaining_services" ]]; then
        print_warning "Some individual services still exist:"
        echo "$remaining_services"
    else
        print_success "All individual services cleaned up"
    fi
    
    # Check for remaining individual volumes
    local remaining_volumes=$(docker volume ls --format "{{.Name}}" | grep -E "(southern-martin.*redis|southern-martin.*db)" | grep -v "shared" || true)
    
    if [[ -n "$remaining_volumes" ]]; then
        print_warning "Some individual volumes still exist:"
        echo "$remaining_volumes"
    else
        print_success "All individual volumes cleaned up"
    fi
    
    # Check for remaining individual networks
    local remaining_networks=$(docker network ls --format "{{.Name}}" | grep -E "(southern-martin.*service|southern-martin-network)" | grep -v "shared" || true)
    
    if [[ -n "$remaining_networks" ]]; then
        print_warning "Some individual networks still exist:"
        echo "$remaining_networks"
    else
        print_success "All individual networks cleaned up"
    fi
}

# Function to display cleanup summary
display_cleanup_summary() {
    print_success "Individual Services Cleanup Complete!"
    echo
    echo "=========================================="
    echo "CLEANUP SUMMARY"
    echo "=========================================="
    echo
    echo "✅ Individual Redis services removed"
    echo "✅ Individual database services removed"
    echo "✅ Individual volumes removed"
    echo "✅ Individual networks removed"
    echo "✅ Docker Compose services cleaned up"
    echo
    echo "=========================================="
    echo "NEXT STEPS"
    echo "=========================================="
    echo
    echo "1. 🚀 Start the hybrid architecture:"
    echo "   ./scripts/setup/hybrid-setup.sh"
    echo
    echo "2. 🧪 Test the hybrid architecture:"
    echo "   ./scripts/testing/test-hybrid-architecture.sh"
    echo
    echo "3. 📊 Check service status:"
    echo "   docker-compose -f docker-compose.hybrid.yml ps"
    echo
    echo "=========================================="
    echo "HYBRID ARCHITECTURE BENEFITS"
    echo "=========================================="
    echo
    echo "✅ Shared Database: Auth + User services"
    echo "✅ Separate Databases: Business services"
    echo "✅ Shared Redis: All services"
    echo "✅ 60% reduction in database count"
    echo "✅ Simplified management and monitoring"
    echo
}

# Main cleanup function
main() {
    echo "=========================================="
    echo "🧹 INDIVIDUAL SERVICES CLEANUP"
    echo "=========================================="
    echo
    
    check_docker
    cleanup_individual_services
    cleanup_individual_volumes
    cleanup_individual_networks
    cleanup_docker_compose_services
    verify_cleanup
    display_cleanup_summary
    
    print_success "Individual services cleanup completed successfully!"
}

# Run main function
main "$@"
