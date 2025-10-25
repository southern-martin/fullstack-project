#!/bin/bash

# Phase 15: API Standards Verification Script
# This script verifies that all microservices are using standardized API response formats

set -e

echo "=================================================="
echo "🔍 Phase 15: API Standards Verification"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test success response format
test_success_response() {
    local service_name=$1
    local endpoint=$2
    local description=$3
    
    echo -e "${BLUE}Testing:${NC} $service_name - $description"
    echo "  Endpoint: $endpoint"
    
    response=$(curl -s "$endpoint")
    
    # Check if response has required fields
    has_data=$(echo "$response" | jq -e '.data' > /dev/null 2>&1 && echo "yes" || echo "no")
    has_message=$(echo "$response" | jq -e '.message' > /dev/null 2>&1 && echo "yes" || echo "no")
    has_status=$(echo "$response" | jq -e '.statusCode' > /dev/null 2>&1 && echo "yes" || echo "no")
    has_timestamp=$(echo "$response" | jq -e '.timestamp' > /dev/null 2>&1 && echo "yes" || echo "no")
    has_success=$(echo "$response" | jq -e '.success' > /dev/null 2>&1 && echo "yes" || echo "no")
    
    if [[ "$has_data" == "yes" && "$has_message" == "yes" && "$has_status" == "yes" && "$has_timestamp" == "yes" && "$has_success" == "yes" ]]; then
        echo -e "  ${GREEN}✅ PASS${NC} - Response follows standard format"
        echo "  Sample: $(echo "$response" | jq -c '{message, statusCode, timestamp, success}')"
        ((TESTS_PASSED++))
    else
        echo -e "  ${RED}❌ FAIL${NC} - Missing required fields"
        echo "  Has data: $has_data, message: $has_message, statusCode: $has_status, timestamp: $has_timestamp, success: $has_success"
        echo "  Response: $(echo "$response" | jq -c '.')"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Function to test error response format
test_error_response() {
    local service_name=$1
    local endpoint=$2
    local description=$3
    
    echo -e "${BLUE}Testing:${NC} $service_name - $description"
    echo "  Endpoint: $endpoint"
    
    response=$(curl -s "$endpoint")
    
    # Check if response has required error fields
    has_message=$(echo "$response" | jq -e '.message' > /dev/null 2>&1 && echo "yes" || echo "no")
    has_status=$(echo "$response" | jq -e '.statusCode' > /dev/null 2>&1 && echo "yes" || echo "no")
    has_error=$(echo "$response" | jq -e '.error' > /dev/null 2>&1 && echo "yes" || echo "no")
    has_timestamp=$(echo "$response" | jq -e '.timestamp' > /dev/null 2>&1 && echo "yes" || echo "no")
    has_path=$(echo "$response" | jq -e '.path' > /dev/null 2>&1 && echo "yes" || echo "no")
    
    if [[ "$has_message" == "yes" && "$has_status" == "yes" && "$has_error" == "yes" && "$has_timestamp" == "yes" ]]; then
        echo -e "  ${GREEN}✅ PASS${NC} - Error response follows standard format"
        echo "  Sample: $(echo "$response" | jq -c '{message, statusCode, error, timestamp}')"
        ((TESTS_PASSED++))
    else
        echo -e "  ${RED}❌ FAIL${NC} - Missing required error fields"
        echo "  Has message: $has_message, statusCode: $has_status, error: $has_error, timestamp: $has_timestamp"
        echo "  Response: $(echo "$response" | jq -c '.')"
        ((TESTS_FAILED++))
    fi
    echo ""
}

echo "=================================================="
echo "📋 SUCCESS RESPONSE FORMAT TESTS"
echo "=================================================="
echo ""

# Auth Service (3001)
test_success_response "Auth Service" "http://localhost:3001/api/v1/auth/health" "Health check"

# User Service (3003)
test_success_response "User Service" "http://localhost:3003/api/v1/users?page=1&limit=1" "List users with pagination"

# Customer Service (3004)
test_success_response "Customer Service" "http://localhost:3004/api/v1/customers?page=1&limit=1" "List customers with pagination"

# Carrier Service (3005)
test_success_response "Carrier Service" "http://localhost:3005/api/v1/carriers?page=1&limit=1" "List carriers with pagination"

# Pricing Service (3006)
test_success_response "Pricing Service" "http://localhost:3006/api/v1/pricing/rules?page=1&limit=1" "List pricing rules with pagination"

# Translation Service (3007)
test_success_response "Translation Service" "http://localhost:3007/api/v1/health" "Health check"
test_success_response "Translation Service" "http://localhost:3007/api/v1/translation/languages?limit=3" "List languages"

echo "=================================================="
echo "❌ ERROR RESPONSE FORMAT TESTS"
echo "=================================================="
echo ""

# Test 404 errors (Not Found)
test_error_response "Auth Service" "http://localhost:3001/api/v1/auth/nonexistent" "404 Not Found"
test_error_response "User Service" "http://localhost:3003/api/v1/users/999999" "404 User Not Found"
test_error_response "Customer Service" "http://localhost:3004/api/v1/customers/999999" "404 Customer Not Found"
test_error_response "Carrier Service" "http://localhost:3005/api/v1/carriers/999999" "404 Carrier Not Found"
test_error_response "Pricing Service" "http://localhost:3006/api/v1/pricing/rules/999999" "404 Pricing Rule Not Found"
test_error_response "Translation Service" "http://localhost:3007/api/v1/translation/languages/zzz" "404 Language Not Found"

echo "=================================================="
echo "📊 TEST SUMMARY"
echo "=================================================="
echo ""
echo -e "${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"
echo ""

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
SUCCESS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))

echo "Success Rate: $SUCCESS_RATE% ($TESTS_PASSED/$TOTAL_TESTS)"
echo ""

if [[ $TESTS_FAILED -eq 0 ]]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}✅ All microservices are using standardized API response formats${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
    echo "Please review the failed tests above and ensure all services are using:"
    echo "  - HttpExceptionFilter for error responses"
    echo "  - TransformInterceptor for success responses"
    echo ""
    exit 1
fi
