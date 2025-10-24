#!/bin/bash

# Run All Integration Tests
# This script executes all integration test suites

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Track results
TOTAL_SUITES=0
PASSED_SUITES=0
FAILED_SUITES=0

# Function to run a test suite
run_test_suite() {
    local suite_name=$1
    local test_script=$2
    
    TOTAL_SUITES=$((TOTAL_SUITES + 1))
    
    echo "======================================================"
    echo -e "${BLUE}Running: $suite_name${NC}"
    echo "======================================================"
    
    if bash "$test_script"; then
        echo -e "${GREEN}✅ $suite_name - PASSED${NC}"
        PASSED_SUITES=$((PASSED_SUITES + 1))
        echo ""
        return 0
    else
        echo -e "${RED}❌ $suite_name - FAILED${NC}"
        FAILED_SUITES=$((FAILED_SUITES + 1))
        echo ""
        return 1
    fi
}

echo "======================================================"
echo "🚀 Running All Integration Tests"
echo "=================================="
echo ""

# Test Suite 1: Business Services Integration
run_test_suite "Business Services Integration" "./integration-tests/business-services-integration-test.sh"

# Test Suite 2: Redis Caching Integration
if command -v redis-cli &> /dev/null && redis-cli PING &> /dev/null; then
    run_test_suite "Redis Caching Integration" "./integration-tests/redis-caching-integration-test.sh"
else
    echo "⚠️  Skipping Redis Caching tests - redis-cli not available or Redis not running"
    echo ""
fi

# Test Suite 3: Kong Gateway Integration
if docker ps | grep -q kong-gateway; then
    run_test_suite "Kong Gateway Integration" "./integration-tests/kong-gateway-integration-test.sh"
else
    echo "⚠️  Skipping Kong Gateway tests - Kong not running"
    echo ""
fi

# Test Suite 4: End-to-End Workflow Tests
run_test_suite "End-to-End Workflows" "./integration-tests/end-to-end-workflow-test.sh"

# Test Suite 5: Performance and Load Tests
run_test_suite "Performance and Load Testing" "./integration-tests/performance-load-test.sh"

echo "======================================================"
echo -e "${BLUE}📊 Final Summary${NC}"
echo "======================================================"
echo "Total Test Suites: $TOTAL_SUITES"
echo "Passed: $PASSED_SUITES"
echo "Failed: $FAILED_SUITES"

if [[ "$FAILED_SUITES" -eq "0" ]]; then
    echo -e "${GREEN}🎉 All Test Suites Passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some Test Suites Failed${NC}"
    exit 1
fi

# Track results
TOTAL_SUITES=0
PASSED_SUITES=0
FAILED_SUITES=0

# Function to run a test suite
run_test_suite() {
    local suite_name=$1
    local test_script=$2
    
    TOTAL_SUITES=$((TOTAL_SUITES + 1))
    
    echo "======================================================"
    echo -e "${BLUE}Running: $suite_name${NC}"
    echo "======================================================"
    
    if bash "$test_script"; then
        echo -e "${GREEN}✅ $suite_name - PASSED${NC}"
        PASSED_SUITES=$((PASSED_SUITES + 1))
        echo ""
        return 0
    else
        echo -e "${RED}❌ $suite_name - FAILED${NC}"
        FAILED_SUITES=$((FAILED_SUITES + 1))
        echo ""
        return 1
    fi
}

# Check if services are running
echo "Checking if services are running..."
if ! docker-compose -f docker-compose.hybrid.yml ps | grep -q "Up"; then
    echo -e "${YELLOW}⚠️  Services may not be running. Starting services...${NC}"
    docker-compose -f docker-compose.hybrid.yml up -d
    echo "Waiting 30 seconds for services to start..."
    sleep 30
fi

echo -e "${GREEN}✅ Services are running${NC}"
echo ""

# Run test suites
run_test_suite "Business Services Integration Tests" "integration-tests/business-services-integration-test.sh"

# Check if Redis is running before running Redis tests
if redis-cli -h localhost -p 6379 PING &>/dev/null; then
    run_test_suite "Redis Caching Integration Tests" "integration-tests/redis-caching-integration-test.sh"
else
    echo -e "${YELLOW}⚠️  Redis not running - skipping Redis caching tests${NC}"
    echo -e "${YELLOW}   To run Redis tests, ensure Redis is running on localhost:6379${NC}"
    echo ""
fi

# Check if Kong is running before running Kong tests
if docker ps | grep -q "kong-gateway"; then
    run_test_suite "Kong Gateway Integration Tests" "integration-tests/kong-gateway-integration-test.sh"
else
    echo -e "${YELLOW}⚠️  Kong Gateway not running - skipping Kong tests${NC}"
    echo -e "${YELLOW}   To run Kong tests, start Kong with: cd api-gateway && docker-compose -f docker-compose.kong.yml up -d${NC}"
    echo ""
fi

# Add more test suites here as they are created
# run_test_suite "Another Test Suite" "integration-tests/another-test.sh"

# Final summary
echo "======================================================"
echo -e "${BLUE}📊 Integration Test Summary${NC}"
echo "======================================================"
echo "Total Test Suites: $TOTAL_SUITES"
echo -e "${GREEN}Passed: $PASSED_SUITES${NC}"

if [[ "$FAILED_SUITES" -gt "0" ]]; then
    echo -e "${RED}Failed: $FAILED_SUITES${NC}"
    echo ""
    echo -e "${RED}❌ Some test suites failed${NC}"
    exit 1
else
    echo "Failed: $FAILED_SUITES"
    echo ""
    echo -e "${GREEN}🎉 All integration tests passed!${NC}"
    exit 0
fi
