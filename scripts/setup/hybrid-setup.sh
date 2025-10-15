#!/bin/bash

# ===========================================
# HYBRID DATABASE ARCHITECTURE SETUP SCRIPT
# ===========================================
# This script sets up the hybrid database architecture
# where Auth + User services share a database, and business
# services use separate databases, all with shared Redis.

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="fullstack-project-hybrid"
COMPOSE_FILE="docker-compose.hybrid.yml"
ENV_FILE="hybrid-environment.example"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
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

# Function to check if required files exist
check_files() {
    print_status "Checking required files..."
    
    local required_files=(
        "$COMPOSE_FILE"
        "$ENV_FILE"
        "shared-database/docker-compose.yml"
        "shared-redis/docker-compose.yml"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            print_error "Required file not found: $file"
            exit 1
        fi
    done
    
    print_success "All required files found"
}

# Function to create environment file
create_env_file() {
    print_status "Creating environment file..."
    
    if [[ ! -f ".env" ]]; then
        cp "$ENV_FILE" ".env"
        print_success "Environment file created from template"
    else
        print_warning "Environment file already exists, skipping creation"
    fi
}

# Function to create shared networks
create_networks() {
    print_status "Creating shared networks..."
    
    # Create shared services network
    if ! docker network ls | grep -q "fullstack-project-hybrid-network"; then
        docker network create fullstack-project-hybrid-network
        print_success "Shared services network created"
    else
        print_warning "Shared services network already exists"
    fi
}

# Function to start shared infrastructure
start_shared_infrastructure() {
    print_status "Starting shared infrastructure..."
    
    # Start shared database
    print_status "Starting shared database..."
    cd shared-database
    docker-compose up -d
    cd ..
    
    # Wait for database to be ready
    print_status "Waiting for shared database to be ready..."
    sleep 10
    
    # Start shared Redis
    print_status "Starting shared Redis..."
    cd shared-redis
    docker-compose up -d
    cd ..
    
    # Wait for Redis to be ready
    print_status "Waiting for shared Redis to be ready..."
    sleep 5
    
    print_success "Shared infrastructure started"
}

# Function to start all services
start_services() {
    print_status "Starting all services with hybrid architecture..."
    
    # Start all services using the hybrid compose file
    docker-compose -f "$COMPOSE_FILE" up -d
    
    print_success "All services started"
}

# Function to wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    local services=(
        "shared-user-database:3306"
        "shared-redis:6379"
        "auth-service:3001"
        "user-service:3003"
        "customer-service:3004"
        "carrier-service:3005"
        "pricing-service:3006"
    )
    
    for service in "${services[@]}"; do
        local name=$(echo "$service" | cut -d: -f1)
        local port=$(echo "$service" | cut -d: -f2)
        
        print_status "Waiting for $name on port $port..."
        
        local max_attempts=30
        local attempt=1
        
        while [[ $attempt -le $max_attempts ]]; do
            if docker exec "$name" nc -z localhost "$port" 2>/dev/null; then
                print_success "$name is ready"
                break
            fi
            
            if [[ $attempt -eq $max_attempts ]]; then
                print_error "$name failed to start after $max_attempts attempts"
                exit 1
            fi
            
            sleep 2
            ((attempt++))
        done
    done
}

# Function to run health checks
run_health_checks() {
    print_status "Running health checks..."
    
    local services=(
        "http://localhost:3001/api/v1/health"
        "http://localhost:3003/api/v1/health"
        "http://localhost:3004/api/v1/health"
        "http://localhost:3005/api/v1/health"
        "http://localhost:3006/api/v1/health"
    )
    
    for service in "${services[@]}"; do
        print_status "Checking $service..."
        
        local max_attempts=10
        local attempt=1
        
        while [[ $attempt -le $max_attempts ]]; do
            if curl -s -f "$service" > /dev/null 2>&1; then
                print_success "$service is healthy"
                break
            fi
            
            if [[ $attempt -eq $max_attempts ]]; then
                print_warning "$service health check failed"
            fi
            
            sleep 3
            ((attempt++))
        done
    done
}

# Function to display service information
display_service_info() {
    print_success "Hybrid Database Architecture Setup Complete!"
    echo
    echo "=========================================="
    echo "SERVICE INFORMATION"
    echo "=========================================="
    echo
    echo "🔐 Auth Service:        http://localhost:3001"
    echo "👤 User Service:        http://localhost:3003"
    echo "🏢 Customer Service:    http://localhost:3004"
    echo "🚚 Carrier Service:     http://localhost:3005"
    echo "💰 Pricing Service:     http://localhost:3006"
    echo "🖥️  React Admin:        http://localhost:3000"
    echo
    echo "=========================================="
    echo "DATABASE INFORMATION"
    echo "=========================================="
    echo
    echo "🗄️  Shared Database:    localhost:3306 (Auth + User)"
    echo "🗄️  Customer Database:  localhost:3309"
    echo "🗄️  Carrier Database:   localhost:3310"
    echo "🗄️  Pricing Database:   localhost:3311"
    echo "🔄 Shared Redis:        localhost:6379"
    echo
    echo "=========================================="
    echo "USEFUL COMMANDS"
    echo "=========================================="
    echo
    echo "📊 View logs:           docker-compose -f $COMPOSE_FILE logs -f"
    echo "🔄 Restart services:    docker-compose -f $COMPOSE_FILE restart"
    echo "🛑 Stop services:       docker-compose -f $COMPOSE_FILE down"
    echo "🧹 Clean up:            docker-compose -f $COMPOSE_FILE down -v"
    echo "🔍 Check status:        docker-compose -f $COMPOSE_FILE ps"
    echo
    echo "=========================================="
    echo "NEXT STEPS"
    echo "=========================================="
    echo
    echo "1. 🌐 Open React Admin: http://localhost:3000"
    echo "2. 🔐 Login with: admin@example.com / admin123"
    echo "3. 🧪 Test all services and features"
    echo "4. 📚 Check documentation in docs/ directory"
    echo
}

# Function to cleanup on error
cleanup() {
    print_error "Setup failed. Cleaning up..."
    docker-compose -f "$COMPOSE_FILE" down -v 2>/dev/null || true
    exit 1
}

# Set trap for cleanup on error
trap cleanup ERR

# Main execution
main() {
    echo "=========================================="
    echo "🚀 HYBRID DATABASE ARCHITECTURE SETUP"
    echo "=========================================="
    echo
    
    check_docker
    check_files
    create_env_file
    create_networks
    start_shared_infrastructure
    start_services
    wait_for_services
    run_health_checks
    display_service_info
    
    print_success "Hybrid Database Architecture setup completed successfully!"
}

# Run main function
main "$@"
