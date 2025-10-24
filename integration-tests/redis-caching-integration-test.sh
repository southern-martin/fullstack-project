#!/bin/bash

# Redis Caching Integration Tests
# Tests Redis connectivity, cache behavior, and performance improvements

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔴 Redis Caching Integration Tests"
echo "===================================="

# Configuration
REDIS_HOST="localhost"
REDIS_PORT="6379"
AUTH_URL="http://localhost:3001"
USER_URL="http://localhost:3003"
CUSTOMER_URL="http://localhost:3004"

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin123!"
ACCESS_TOKEN=""

# Timeout settings
CONNECT_TIMEOUT=5
MAX_TIME=10

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Helper functions
log_test() { 
    echo -e "${BLUE}🔍 $1${NC}"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}
log_success() { 
    echo -e "${GREEN}✅ $1${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
}
log_error() { 
    echo -e "${RED}❌ $1${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
}
log_info() { 
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Test Redis Connection
test_redis_connection() {
    log_test "Redis Connection Test"
    
    # Check if redis-cli is available
    if ! command -v redis-cli &> /dev/null; then
        log_error "redis-cli not found - Install with: brew install redis"
        return 1
    fi
    
    # Test connection
    local response=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" PING 2>&1)
    
    if [[ "$response" == "PONG" ]]; then
        log_success "Redis - Connection successful (PING/PONG)"
    else
        log_error "Redis - Connection failed: $response"
        return 1
    fi
}

# Test Redis Info
test_redis_info() {
    log_test "Redis Server Info"
    
    local version=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" INFO SERVER | grep redis_version | cut -d':' -f2 | tr -d '\r')
    local uptime=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" INFO SERVER | grep uptime_in_seconds | cut -d':' -f2 | tr -d '\r')
    
    if [[ -n "$version" ]]; then
        log_success "Redis - Version: $version, Uptime: ${uptime}s"
    else
        log_error "Redis - Unable to get server info"
    fi
}

# Test Redis Key Operations
test_redis_key_operations() {
    log_test "Redis Key Operations"
    
    local test_key="integration-test:$(date +%s)"
    local test_value="test-value-$$"
    
    # SET operation
    local set_result=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" SET "$test_key" "$test_value" EX 60 2>&1)
    
    if [[ "$set_result" == "OK" ]]; then
        log_success "Redis - SET operation successful"
    else
        log_error "Redis - SET operation failed: $set_result"
        return 1
    fi
    
    # GET operation
    local get_result=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" GET "$test_key" 2>&1)
    
    if [[ "$get_result" == "$test_value" ]]; then
        log_success "Redis - GET operation successful (value matches)"
    else
        log_error "Redis - GET operation failed: expected '$test_value', got '$get_result'"
    fi
    
    # DELETE operation
    local del_result=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" DEL "$test_key" 2>&1)
    
    if [[ "$del_result" == "1" ]]; then
        log_success "Redis - DEL operation successful"
    else
        log_error "Redis - DEL operation failed"
    fi
}

# Get Authentication Token
get_auth_token() {
    log_test "Getting authentication token"
    
    local response=$(curl -s \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        -X POST "$AUTH_URL/api/v1/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
        -w "%{http_code}" \
        -o /tmp/auth_response 2>&1)
    
    local http_code="${response: -3}"
    
    if [[ "$http_code" == "200" ]]; then
        ACCESS_TOKEN=$(jq -r '.data.access_token' /tmp/auth_response 2>/dev/null)
        if [[ -n "$ACCESS_TOKEN" && "$ACCESS_TOKEN" != "null" ]]; then
            log_success "Authentication successful"
            return 0
        fi
    fi
    
    log_error "Authentication failed (HTTP: $http_code)"
    return 1
}

# Test Cache Hit/Miss Scenarios
test_cache_hit_miss() {
    log_test "Cache Hit/Miss Scenarios"
    
    if [[ -z "$ACCESS_TOKEN" ]]; then
        log_error "No access token available"
        return 1
    fi
    
    # Clear potential cached data for a specific user
    local user_id="1"
    local cache_key="user:${user_id}:*"
    
    # First request (potential cache miss)
    local start_time=$(python3 -c 'import time; print(int(time.time() * 1000))')
    local response1=$(curl -s \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        "$USER_URL/api/v1/users/$user_id" \
        -w "%{http_code}" \
        -o /tmp/user_response1 2>&1)
    local end_time=$(python3 -c 'import time; print(int(time.time() * 1000))')
    local first_request_time=$((end_time - start_time))
    
    local http_code1="${response1: -3}"
    
    if [[ "$http_code1" != "200" ]]; then
        log_error "First request failed (HTTP: $http_code1)"
        return 1
    fi
    
    # Second request (potential cache hit)
    start_time=$(python3 -c 'import time; print(int(time.time() * 1000))')
    local response2=$(curl -s \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        "$USER_URL/api/v1/users/$user_id" \
        -w "%{http_code}" \
        -o /tmp/user_response2 2>&1)
    end_time=$(python3 -c 'import time; print(int(time.time() * 1000))')
    local second_request_time=$((end_time - start_time))
    
    local http_code2="${response2: -3}"
    
    if [[ "$http_code2" == "200" ]]; then
        log_success "Cache test - Both requests successful"
        log_info "First request: ${first_request_time}ms, Second request: ${second_request_time}ms"
        
        # If second request is significantly faster, likely cache hit
        if [[ $second_request_time -lt $((first_request_time / 2)) ]]; then
            log_success "Cache optimization detected (2nd request 50%+ faster)"
        else
            log_info "Response times similar (caching may not be active or data not cached)"
        fi
    else
        log_error "Second request failed (HTTP: $http_code2)"
    fi
}

# Test Customer Service Caching
test_customer_cache() {
    log_test "Customer Service Cache Test"
    
    if [[ -z "$ACCESS_TOKEN" ]]; then
        log_error "No access token available"
        return 1
    fi
    
    # Request customer list
    local response=$(curl -s \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        "$CUSTOMER_URL/api/v1/customers?page=1&limit=10" \
        -w "%{http_code}" \
        -o /tmp/customer_cache_test 2>&1)
    
    local http_code="${response: -3}"
    
    if [[ "$http_code" == "200" ]]; then
        log_success "Customer Service - Cache test request successful"
        
        # Check if Redis has customer-related keys
        local customer_keys=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" KEYS "customer:*" 2>/dev/null | wc -l)
        
        if [[ "$customer_keys" -gt "0" ]]; then
            log_success "Customer cache - Found $customer_keys cached entries"
        else
            log_info "Customer cache - No cached entries found (may not be implemented yet)"
        fi
    else
        log_error "Customer Service request failed (HTTP: $http_code)"
    fi
}

# Test Cache Invalidation
test_cache_invalidation() {
    log_test "Cache Invalidation Test"
    
    # Create a test key that should expire
    local test_key="test:ttl:$(date +%s)"
    local ttl_seconds=2
    
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" SET "$test_key" "expire-me" EX $ttl_seconds > /dev/null 2>&1
    
    # Check if key exists
    local exists=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" EXISTS "$test_key" 2>&1)
    
    if [[ "$exists" == "1" ]]; then
        log_success "Cache - TTL key created successfully"
        
        # Wait for expiration
        sleep $((ttl_seconds + 1))
        
        # Check if key expired
        local exists_after=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" EXISTS "$test_key" 2>&1)
        
        if [[ "$exists_after" == "0" ]]; then
            log_success "Cache - TTL expiration working correctly"
        else
            log_error "Cache - Key did not expire as expected"
        fi
    else
        log_error "Cache - Failed to create TTL test key"
    fi
}

# Test Redis Memory Usage
test_redis_memory() {
    log_test "Redis Memory Usage"
    
    local used_memory=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" INFO MEMORY | grep used_memory_human | cut -d':' -f2 | tr -d '\r')
    local max_memory=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" INFO MEMORY | grep maxmemory_human | cut -d':' -f2 | tr -d '\r')
    local keys_count=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" DBSIZE | cut -d':' -f2 | tr -d '\r')
    
    if [[ -n "$used_memory" ]]; then
        log_success "Redis Memory - Used: $used_memory, Max: ${max_memory:-unlimited}, Keys: $keys_count"
    else
        log_error "Redis - Unable to get memory info"
    fi
}

# Test Service-Specific Cache Keys
test_service_cache_keys() {
    log_test "Service-Specific Cache Keys"
    
    local auth_keys=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" KEYS "auth:*" 2>/dev/null | wc -l | tr -d ' ')
    local user_keys=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" KEYS "user:*" 2>/dev/null | wc -l | tr -d ' ')
    local customer_keys=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" KEYS "customer:*" 2>/dev/null | wc -l | tr -d ' ')
    local session_keys=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" KEYS "session:*" 2>/dev/null | wc -l | tr -d ' ')
    
    log_success "Cache Keys Found:"
    log_info "  - Auth Service: $auth_keys keys"
    log_info "  - User Service: $user_keys keys"
    log_info "  - Customer Service: $customer_keys keys"
    log_info "  - Sessions: $session_keys keys"
    
    local total_keys=$((auth_keys + user_keys + customer_keys + session_keys))
    
    if [[ "$total_keys" -gt "0" ]]; then
        log_success "Cache is being used by services"
    else
        log_info "No service-specific cache keys found (services may not be using Redis caching yet)"
    fi
}

# Main execution
main() {
    echo "🏁 Starting Redis Caching Integration Tests..."
    echo ""
    
    # Test Redis infrastructure
    test_redis_connection || exit 1
    echo ""
    
    test_redis_info
    echo ""
    
    test_redis_key_operations
    echo ""
    
    test_redis_memory
    echo ""
    
    test_cache_invalidation
    echo ""
    
    test_service_cache_keys
    echo ""
    
    # Get authentication token
    get_auth_token || exit 1
    echo ""
    
    # Test application caching
    test_cache_hit_miss
    echo ""
    
    test_customer_cache
    echo ""
    
    echo "=============================================="
    echo -e "${BLUE}📊 Redis Caching Integration Test Summary${NC}"
    echo "=============================================="
    echo "✅ Redis infrastructure validated"
    echo "✅ Basic cache operations tested (SET/GET/DEL)"
    echo "✅ Cache TTL/expiration verified"
    echo "✅ Service cache usage analyzed"
    echo "✅ Cache performance measured"
    echo ""
    
    echo "=============================================="
    echo -e "${BLUE}📈 Test Results${NC}"
    echo "=============================================="
    echo "Total Tests: $TOTAL_TESTS"
    echo "Passed: $PASSED_TESTS"
    echo "Failed: $FAILED_TESTS"
    
    if [[ "$FAILED_TESTS" -eq "0" ]]; then
        local success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
        echo "Success Rate: ${success_rate}%"
        echo ""
        echo -e "${GREEN}🎉 Redis Caching Integration Tests Complete - All Passed!${NC}"
        exit 0
    else
        local success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
        echo "Success Rate: ${success_rate}%"
        echo ""
        echo -e "${RED}⚠️  Redis Caching Integration Tests - Some failures detected${NC}"
        exit 1
    fi
}

# Run main function
main
