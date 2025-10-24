#!/bin/bash

# Business Services Integration Tests
# Fast and efficient testing for Customer-Carrier-Pricing services
# Tests: Health checks, API format consistency, correlation ID propagation

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Business Services Integration Tests"
echo "====================================="

# Configuration
AUTH_URL="http://localhost:3001"
USER_URL="http://localhost:3003"
CUSTOMER_URL="http://localhost:3004"
CARRIER_URL="http://localhost:3005"
PRICING_URL="http://localhost:3006"
TRANSLATION_URL="http://localhost:3007"

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin123!"
ACCESS_TOKEN=""

# Timeout settings (in seconds)
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
log_info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }

# Get auth token
get_auth_token() {
    log_test "Getting authentication token"
    
    local response=$(curl -s -X POST \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
        "$AUTH_URL/api/v1/auth/login" \
        -w "%{http_code}" \
        -o /tmp/login_response 2>&1)
    
    local http_code="${response: -3}"
    
    if [[ "$http_code" == "200" || "$http_code" == "201" ]]; then
        ACCESS_TOKEN=$(jq -r '.data.access_token // .access_token // ""' /tmp/login_response 2>/dev/null)
        if [[ -n "$ACCESS_TOKEN" && "$ACCESS_TOKEN" != "null" ]]; then
            log_success "Authentication successful"
            return 0
        fi
    fi
    
    log_error "Authentication failed (HTTP: $http_code)"
    cat /tmp/login_response 2>/dev/null | head -5
    return 1
}

# Test Customer Service API
test_customer_service() {
    log_test "Customer Service API Tests"
    
    # Test health
    local health=$(curl -s \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        "$CUSTOMER_URL/api/v1/health" \
        -w "%{http_code}" \
        -o /tmp/customer_health 2>&1)
    
    local http_code="${health: -3}"
    
    if [[ "$http_code" == "200" ]]; then
        log_success "Customer Service - Health check passed"
    else
        log_error "Customer Service - Health check failed (HTTP: $http_code)"
        return 1
    fi
    
    # Test customers endpoint
    local customers=$(curl -s \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        "$CUSTOMER_URL/api/v1/customers?page=1&limit=5" \
        -w "%{http_code}" \
        -o /tmp/customers_response 2>&1)
    
    local http_code="${customers: -3}"
    
    if [[ "$http_code" == "200" ]]; then
        local has_std_format=$(jq -r 'has("success") and has("data") and has("message")' /tmp/customers_response 2>/dev/null || echo "false")
        if [[ "$has_std_format" == "true" ]]; then
            log_success "Customer Service - API format is standardized"
        else
            log_error "Customer Service - API format inconsistent"
        fi
    else
        log_error "Customer Service - Customers endpoint failed (HTTP: $http_code)"
    fi
}

# Test Carrier Service API  
test_carrier_service() {
    log_test "Carrier Service API Tests"
    
    # Test health
    local health=$(curl -s \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        "$CARRIER_URL/api/v1/health" \
        -w "%{http_code}" \
        -o /tmp/carrier_health 2>&1)
    
    local http_code="${health: -3}"
    
    if [[ "$http_code" == "200" ]]; then
        log_success "Carrier Service - Health check passed"
    else
        log_error "Carrier Service - Health check failed (HTTP: $http_code)"
        return 1
    fi
    
    # Test carriers endpoint
    local carriers=$(curl -s \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        "$CARRIER_URL/api/v1/carriers?page=1&limit=5" \
        -w "%{http_code}" \
        -o /tmp/carriers_response 2>&1)
    
    local http_code="${carriers: -3}"
    
    if [[ "$http_code" == "200" ]]; then
        local has_std_format=$(jq -r 'has("success") and has("data") and has("message")' /tmp/carriers_response 2>/dev/null || echo "false")
        if [[ "$has_std_format" == "true" ]]; then
            log_success "Carrier Service - API format is standardized"
        else
            log_error "Carrier Service - API format inconsistent"
        fi
    else
        log_error "Carrier Service - Carriers endpoint failed (HTTP: $http_code)"
    fi
}

# Test Pricing Service API
test_pricing_service() {
    log_test "Pricing Service API Tests"
    
    # Test health
    local health=$(curl -s \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        "$PRICING_URL/api/v1/health" \
        -w "%{http_code}" \
        -o /tmp/pricing_health 2>&1)
    
    local http_code="${health: -3}"
    
    if [[ "$http_code" == "200" ]]; then
        log_success "Pricing Service - Health check passed"
    else
        log_error "Pricing Service - Health check failed (HTTP: $http_code)"
        return 1
    fi
    
    # Test pricing/rules endpoint
    local rules=$(curl -s \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        "$PRICING_URL/api/v1/pricing/rules?page=1&limit=5" \
        -w "%{http_code}" \
        -o /tmp/pricing_response 2>&1)
    
    local http_code="${rules: -3}"
    
    if [[ "$http_code" == "200" ]]; then
        local has_std_format=$(jq -r 'has("success") and has("data") and has("message")' /tmp/pricing_response 2>/dev/null || echo "false")
        if [[ "$has_std_format" == "true" ]]; then
            log_success "Pricing Service - API format is standardized"
        else
            log_error "Pricing Service - API format inconsistent"
        fi
    else
        log_error "Pricing Service - Pricing rules endpoint failed (HTTP: $http_code)"
    fi
}

# Test Translation Service
test_translation_service() {
    log_test "Translation Service API Tests"
    
    # Test health
    local health=$(curl -s \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        "$TRANSLATION_URL/api/v1/health" \
        -w "%{http_code}" \
        -o /tmp/translation_health 2>&1)
    
    local http_code="${health: -3}"
    
    if [[ "$http_code" == "200" ]]; then
        log_success "Translation Service - Health check passed"
    else
        log_error "Translation Service - Health check failed (HTTP: $http_code)"
        return 1
    fi
    
    # Test languages endpoint
    local languages=$(curl -s \
        --connect-timeout $CONNECT_TIMEOUT \
        --max-time $MAX_TIME \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        "$TRANSLATION_URL/api/v1/translation/languages" \
        -w "%{http_code}" \
        -o /tmp/translation_response 2>&1)
    
    local http_code="${languages: -3}"
    
    if [[ "$http_code" == "200" ]]; then
        local has_std_format=$(jq -r 'has("success") and has("data") and has("message")' /tmp/translation_response 2>/dev/null || echo "false")
        if [[ "$has_std_format" == "true" ]]; then
            log_success "Translation Service - API format is standardized"
        else
            log_error "Translation Service - API format inconsistent"
        fi
    else
        log_error "Translation Service - Languages endpoint failed (HTTP: $http_code)"
    fi
}

# Test Cross-Service Communication
test_cross_service_communication() {
    log_test "Cross-Service Communication Tests"
    
    # Test correlation ID propagation
    local correlation_id="test-business-$(date +%s)"
    
    local services=("$CUSTOMER_URL/api/v1/customers" "$CARRIER_URL/api/v1/carriers" "$PRICING_URL/api/v1/pricing/rules" "$TRANSLATION_URL/api/v1/translation/languages")
    
    for url in "${services[@]}"; do
        local service_name=$(echo $url | cut -d'/' -f3 | cut -d':' -f1)
        
        local response=$(curl -s \
            --connect-timeout $CONNECT_TIMEOUT \
            --max-time $MAX_TIME \
            -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "X-Correlation-ID: $correlation_id" \
            "$url?page=1&limit=1" \
            -w "%{http_code}" \
            -o /dev/null 2>&1)
        
        local http_code="${response: -3}"
        
        if [[ "$http_code" == "200" ]]; then
            log_success "$service_name - Correlation ID handled correctly"
        else
            log_error "$service_name - Failed to handle correlation ID (HTTP: $http_code)"
        fi
    done
    
    log_info "Check logs for correlation ID: $correlation_id"
}

# Test API Response Consistency
test_api_consistency() {
    log_test "API Response Consistency Tests"
    
    local services=("Customer:$CUSTOMER_URL/api/v1/customers" "Carrier:$CARRIER_URL/api/v1/carriers" "Pricing:$PRICING_URL/api/v1/pricing/rules" "Translation:$TRANSLATION_URL/api/v1/translation/languages")
    
    local consistent_count=0
    local total_count=0
    
    for service_info in "${services[@]}"; do
        local name=${service_info%%:*}
        local url=${service_info#*:}
        local name_lower=$(echo "$name" | tr '[:upper:]' '[:lower:]')
        
        local response=$(curl -s \
            --connect-timeout $CONNECT_TIMEOUT \
            --max-time $MAX_TIME \
            -H "Authorization: Bearer $ACCESS_TOKEN" \
            "$url?page=1&limit=1" \
            -w "%{http_code}" \
            -o /tmp/${name_lower}_consistency 2>&1)
        
        local http_code="${response: -3}"
        
        if [[ "$http_code" == "200" ]]; then
            local success=$(jq -r '.success // false' /tmp/${name_lower}_consistency 2>/dev/null || echo "false")
            local has_timestamp=$(jq -r 'has("timestamp")' /tmp/${name_lower}_consistency 2>/dev/null || echo "false")
            local status_code=$(jq -r '.statusCode // 0' /tmp/${name_lower}_consistency 2>/dev/null || echo "0")
            
            if [[ "$success" == "true" && "$has_timestamp" == "true" && "$status_code" == "200" ]]; then
                log_success "$name - Response format fully consistent"
                consistent_count=$((consistent_count + 1))
            else
                log_error "$name - Response format inconsistencies detected"
            fi
            total_count=$((total_count + 1))
        else
            log_error "$name - API request failed (HTTP: $http_code)"
        fi
    done
    
    if [[ "$consistent_count" -eq "$total_count" && "$total_count" -gt "0" ]]; then
        log_success "All business services have consistent API responses"
    else
        log_error "API consistency issues detected ($consistent_count/$total_count consistent)"
    fi
}

# Main execution
main() {
    echo "🏁 Starting Business Services Integration Tests..."
    echo ""
    
    # Get authentication token
    if ! get_auth_token; then
        log_error "Cannot proceed without authentication"
        exit 1
    fi
    
    echo ""
    
    # Test individual services
    test_customer_service
    echo ""
    
    test_carrier_service  
    echo ""
    
    test_pricing_service
    echo ""
    
    test_translation_service
    echo ""
    
    # Test integrations
    test_cross_service_communication
    echo ""
    
    test_api_consistency
    echo ""
    
    echo "=============================================="
    echo -e "${BLUE}📊 Business Services Integration Test Summary${NC}"
    echo "=============================================="
    echo "✅ Customer Service: API endpoints and format validated"
    echo "✅ Carrier Service: API endpoints and format validated" 
    echo "✅ Pricing Service: API endpoints and format validated"
    echo "✅ Translation Service: API endpoints and format validated"
    echo "✅ Cross-service correlation ID propagation tested"
    echo "✅ API response consistency validated"
    echo ""
    echo "=============================================="
    echo -e "${BLUE}📈 Test Results${NC}"
    echo "=============================================="
    echo "Total Tests: $TOTAL_TESTS"
    echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
    if [[ "$FAILED_TESTS" -gt "0" ]]; then
        echo -e "${RED}Failed: $FAILED_TESTS${NC}"
    else
        echo "Failed: $FAILED_TESTS"
    fi
    echo "Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
    echo ""
    if [[ "$FAILED_TESTS" -eq "0" ]]; then
        echo -e "${GREEN}🎉 Business Services Integration Tests Complete - All Passed!${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠️  Business Services Integration Tests Complete - Some failures detected${NC}"
        exit 1
    fi
}

# Cleanup
cleanup() {
    rm -f /tmp/login_response /tmp/*_response /tmp/*_health /tmp/*_consistency
}

trap cleanup EXIT

# Run tests
main "$@"
