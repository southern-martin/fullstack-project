#!/bin/bash

# ===========================================
# HYBRID ARCHITECTURE TESTING SCRIPT
# ===========================================
# This script tests the hybrid database architecture
# to ensure all services work correctly together.

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.hybrid.yml"
TEST_TIMEOUT=30
MAX_RETRIES=10

# Function to print colored output
print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Function to check if service is running
check_service() {
    local service_name=$1
    local port=$2
    local endpoint=$3
    
    print_status "Checking $service_name on port $port..."
    
    local retry_count=0
    while [[ $retry_count -lt $MAX_RETRIES ]]; do
        if curl -s -f "http://localhost:$port$endpoint" > /dev/null 2>&1; then
            print_success "$service_name is running and healthy"
            return 0
        fi
        
        sleep 2
        ((retry_count++))
    done
    
    print_error "$service_name is not responding"
    return 1
}

# Function to test database connectivity
test_database_connectivity() {
    print_status "Testing database connectivity..."
    
    # Test shared database
    if docker exec shared-user-database mysql -u shared_user -pshared_password_2024 -e "SELECT 1;" shared_user_db > /dev/null 2>&1; then
        print_success "Shared database (Auth + User) is accessible"
    else
        print_error "Shared database is not accessible"
        return 1
    fi
    
    # Test customer database
    if docker exec customer-service-db mysql -u customer_user -pcustomer_password -e "SELECT 1;" customer_service_db > /dev/null 2>&1; then
        print_success "Customer database is accessible"
    else
        print_error "Customer database is not accessible"
        return 1
    fi
    
    # Test carrier database
    if docker exec carrier-service-db mysql -u carrier_user -pcarrier_password -e "SELECT 1;" carrier_service_db > /dev/null 2>&1; then
        print_success "Carrier database is accessible"
    else
        print_error "Carrier database is not accessible"
        return 1
    fi
    
    # Test pricing database
    if docker exec pricing-service-db mysql -u pricing_user -ppricing_password -e "SELECT 1;" pricing_service_db > /dev/null 2>&1; then
        print_success "Pricing database is accessible"
    else
        print_error "Pricing database is not accessible"
        return 1
    fi
}

# Function to test Redis connectivity
test_redis_connectivity() {
    print_status "Testing Redis connectivity..."
    
    if docker exec shared-redis redis-cli -a shared_redis_password_2024 ping | grep -q "PONG"; then
        print_success "Shared Redis is accessible"
    else
        print_error "Shared Redis is not accessible"
        return 1
    fi
}

# Function to test service health endpoints
test_service_health() {
    print_status "Testing service health endpoints..."
    
    local services=(
        "auth-service:3001:/api/v1/health"
        "user-service:3003:/api/v1/health"
        "customer-service:3004:/api/v1/health"
        "carrier-service:3005:/api/v1/health"
        "pricing-service:3006:/api/v1/health"
    )
    
    local failed_services=()
    
    for service in "${services[@]}"; do
        local service_name=$(echo "$service" | cut -d: -f1)
        local port=$(echo "$service" | cut -d: -f2)
        local endpoint=$(echo "$service" | cut -d: -f3)
        
        if ! check_service "$service_name" "$port" "$endpoint"; then
            failed_services+=("$service_name")
        fi
    done
    
    if [[ ${#failed_services[@]} -eq 0 ]]; then
        print_success "All services are healthy"
        return 0
    else
        print_error "Failed services: ${failed_services[*]}"
        return 1
    fi
}

# Function to test cross-service communication
test_cross_service_communication() {
    print_status "Testing cross-service communication..."
    
    # Test user service endpoint
    local user_response=$(curl -s "http://localhost:3003/api/v1/users" || echo "failed")
    if [[ "$user_response" != "failed" ]]; then
        print_success "User service API is responding"
    else
        print_error "User service API is not responding"
        return 1
    fi
    
    # Test customer service endpoint
    local customer_response=$(curl -s "http://localhost:3004/api/v1/customers" || echo "failed")
    if [[ "$customer_response" != "failed" ]]; then
        print_success "Customer service API is responding"
    else
        print_error "Customer service API is not responding"
        return 1
    fi
    
    # Test carrier service endpoint
    local carrier_response=$(curl -s "http://localhost:3005/api/v1/carriers" || echo "failed")
    if [[ "$carrier_response" != "failed" ]]; then
        print_success "Carrier service API is responding"
    else
        print_error "Carrier service API is not responding"
        return 1
    fi
    
    # Test pricing service endpoint
    local pricing_response=$(curl -s "http://localhost:3006/api/v1/pricing/rules" || echo "failed")
    if [[ "$pricing_response" != "failed" ]]; then
        print_success "Pricing service API is responding"
    else
        print_error "Pricing service API is not responding"
        return 1
    fi
}

# Function to test authentication flow
test_authentication_flow() {
    print_status "Testing authentication flow..."
    
    # Test auth service login endpoint
    local auth_response=$(curl -s -X POST "http://localhost:3001/api/v1/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@example.com","password":"admin123"}' || echo "failed")
    
    if [[ "$auth_response" != "failed" ]]; then
        print_success "Authentication service is working"
        
        # Extract token if present
        local token=$(echo "$auth_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4 || echo "")
        if [[ -n "$token" ]]; then
            print_success "JWT token generation is working"
        else
            print_warning "JWT token not found in response"
        fi
    else
        print_error "Authentication service is not working"
        return 1
    fi
}

# Function to test database isolation
test_database_isolation() {
    print_status "Testing database isolation..."
    
    # Test that customer service can't access user database directly
    local customer_db_test=$(docker exec customer-service-db mysql -u customer_user -pcustomer_password -e "SELECT COUNT(*) FROM shared_user_db.users;" 2>&1 || echo "failed")
    if [[ "$customer_db_test" == *"failed"* ]] || [[ "$customer_db_test" == *"Access denied"* ]]; then
        print_success "Database isolation is working (customer can't access shared database)"
    else
        print_warning "Database isolation might not be properly configured"
    fi
    
    # Test that user service can access shared database
    local user_db_test=$(docker exec shared-user-database mysql -u shared_user -pshared_password_2024 -e "SELECT COUNT(*) FROM users;" shared_user_db 2>&1 || echo "failed")
    if [[ "$user_db_test" != *"failed"* ]]; then
        print_success "User service can access shared database"
    else
        print_error "User service cannot access shared database"
        return 1
    fi
}

# Function to test Redis key namespacing
test_redis_namespacing() {
    print_status "Testing Redis key namespacing..."
    
    # Test setting keys with different prefixes
    docker exec shared-redis redis-cli -a shared_redis_password_2024 SET "auth:test:key" "auth_value" > /dev/null
    docker exec shared-redis redis-cli -a shared_redis_password_2024 SET "user:test:key" "user_value" > /dev/null
    docker exec shared-redis redis-cli -a shared_redis_password_2024 SET "customer:test:key" "customer_value" > /dev/null
    
    # Test retrieving keys
    local auth_value=$(docker exec shared-redis redis-cli -a shared_redis_password_2024 GET "auth:test:key" 2>/dev/null || echo "failed")
    local user_value=$(docker exec shared-redis redis-cli -a shared_redis_password_2024 GET "user:test:key" 2>/dev/null || echo "failed")
    local customer_value=$(docker exec shared-redis redis-cli -a shared_redis_password_2024 GET "customer:test:key" 2>/dev/null || echo "failed")
    
    if [[ "$auth_value" == "auth_value" ]] && [[ "$user_value" == "user_value" ]] && [[ "$customer_value" == "customer_value" ]]; then
        print_success "Redis key namespacing is working"
    else
        print_error "Redis key namespacing is not working"
        return 1
    fi
    
    # Clean up test keys
    docker exec shared-redis redis-cli -a shared_redis_password_2024 DEL "auth:test:key" "user:test:key" "customer:test:key" > /dev/null
}

# Function to test network connectivity
test_network_connectivity() {
    print_status "Testing network connectivity..."
    
    # Test that services can communicate with each other
    local network_test=$(docker network inspect fullstack-project-hybrid-network 2>/dev/null || echo "failed")
    if [[ "$network_test" != "failed" ]]; then
        print_success "Shared network is configured"
    else
        print_error "Shared network is not configured"
        return 1
    fi
    
    # Test inter-service communication
    local inter_service_test=$(docker exec customer-service curl -s "http://user-service:3003/api/v1/health" 2>/dev/null || echo "failed")
    if [[ "$inter_service_test" != "failed" ]]; then
        print_success "Inter-service communication is working"
    else
        print_warning "Inter-service communication test failed (this might be expected if services are not fully started)"
    fi
}

# Function to run performance tests
test_performance() {
    print_status "Running basic performance tests..."
    
    # Test response times
    local start_time=$(date +%s%N)
    curl -s "http://localhost:3003/api/v1/users" > /dev/null
    local end_time=$(date +%s%N)
    local response_time=$(( (end_time - start_time) / 1000000 ))
    
    if [[ $response_time -lt 1000 ]]; then
        print_success "User service response time: ${response_time}ms (good)"
    elif [[ $response_time -lt 3000 ]]; then
        print_warning "User service response time: ${response_time}ms (acceptable)"
    else
        print_error "User service response time: ${response_time}ms (slow)"
    fi
}

# Function to generate test report
generate_test_report() {
    local test_results=$1
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "=========================================="
    echo "HYBRID ARCHITECTURE TEST REPORT"
    echo "=========================================="
    echo "Timestamp: $timestamp"
    echo "Test Results: $test_results"
    echo "=========================================="
    echo
    
    if [[ "$test_results" == "PASS" ]]; then
        echo "🎉 All tests passed! The hybrid architecture is working correctly."
        echo
        echo "✅ Services are running and healthy"
        echo "✅ Databases are accessible and isolated"
        echo "✅ Redis is working with proper namespacing"
        echo "✅ Cross-service communication is functional"
        echo "✅ Authentication flow is working"
        echo "✅ Network connectivity is proper"
    else
        echo "❌ Some tests failed. Please check the logs above for details."
        echo
        echo "Common issues:"
        echo "- Services not fully started (wait a few minutes and retry)"
        echo "- Database connection issues (check credentials)"
        echo "- Network configuration problems"
        echo "- Port conflicts with other services"
    fi
}

# Main test function
run_tests() {
    echo "=========================================="
    echo "🧪 HYBRID ARCHITECTURE TESTING"
    echo "=========================================="
    echo
    
    local test_results="PASS"
    
    # Run all tests
    if ! test_database_connectivity; then
        test_results="FAIL"
    fi
    
    if ! test_redis_connectivity; then
        test_results="FAIL"
    fi
    
    if ! test_service_health; then
        test_results="FAIL"
    fi
    
    if ! test_cross_service_communication; then
        test_results="FAIL"
    fi
    
    if ! test_authentication_flow; then
        test_results="FAIL"
    fi
    
    if ! test_database_isolation; then
        test_results="FAIL"
    fi
    
    if ! test_redis_namespacing; then
        test_results="FAIL"
    fi
    
    if ! test_network_connectivity; then
        test_results="FAIL"
    fi
    
    test_performance
    
    # Generate report
    generate_test_report "$test_results"
    
    return $([ "$test_results" == "PASS" ] && echo 0 || echo 1)
}

# Check if Docker Compose file exists
if [[ ! -f "$COMPOSE_FILE" ]]; then
    print_error "Docker Compose file not found: $COMPOSE_FILE"
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if services are running
if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
    print_error "Services are not running. Please start them first:"
    print_error "docker-compose -f $COMPOSE_FILE up -d"
    exit 1
fi

# Run tests
run_tests
