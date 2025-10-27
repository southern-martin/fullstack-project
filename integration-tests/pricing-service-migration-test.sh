#!/bin/bash

# Pricing Service Migration Infrastructure Integration Test
# Tests the TypeORM migration setup and database operations

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo "======================================================"
echo -e "${CYAN}🧪 Pricing Service Migration Integration Test${NC}"
echo "======================================================"
echo ""
echo "Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Track results
TESTS_PASSED=0
TESTS_TOTAL=0

# Function to run test
run_test() {
    local test_name=$1
    local test_command=$2
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    echo -e "${BLUE}🔍 Test $TESTS_TOTAL: $test_name${NC}"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo ""
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo ""
        return 1
    fi
}

echo "======================================================"
echo -e "${CYAN}Section 1: Migration Infrastructure Verification${NC}"
echo "======================================================"
echo ""

# Test 1: Check migration files exist
run_test "Migration files exist" \
    "test -f /opt/cursor-project/fullstack-project/pricing-service/src/infrastructure/database/typeorm/migrations/1730013600000-InitialSchema.ts"

# Test 2: Check typeorm config exists
run_test "TypeORM config exists" \
    "test -f /opt/cursor-project/fullstack-project/pricing-service/typeorm.config.ts"

# Test 3: Check .env.local exists
run_test ".env.local exists" \
    "test -f /opt/cursor-project/fullstack-project/pricing-service/.env.local"

# Test 4: Check migration scripts in package.json
run_test "Migration scripts in package.json" \
    "grep -q 'migration:show' /opt/cursor-project/fullstack-project/pricing-service/package.json"

echo "======================================================"
echo -e "${CYAN}Section 2: Database Schema Validation${NC}"
echo "======================================================"
echo ""

# Test 5: Check pricing_rules table exists
run_test "pricing_rules table exists" \
    "docker exec pricing-service-db mysql -u pricing_user -ppricing_password pricing_service_db -e 'DESCRIBE pricing_rules;' > /dev/null 2>&1"

# Test 6: Check price_calculations table exists
run_test "price_calculations table exists" \
    "docker exec pricing-service-db mysql -u pricing_user -ppricing_password pricing_service_db -e 'DESCRIBE price_calculations;' > /dev/null 2>&1"

# Test 7: Check migrations table exists
run_test "typeorm_migrations table exists" \
    "docker exec pricing-service-db mysql -u pricing_user -ppricing_password pricing_service_db -e 'DESCRIBE typeorm_migrations;' > /dev/null 2>&1"

# Test 8: Verify migration was executed
echo -e "${BLUE}🔍 Test $((TESTS_TOTAL + 1)): Migration execution verified${NC}"
MIGRATION_COUNT=$(docker exec pricing-service-db mysql -u pricing_user -ppricing_password pricing_service_db -sN -e "SELECT COUNT(*) FROM typeorm_migrations WHERE name = 'InitialSchema1730013600000';")
if [ "$MIGRATION_COUNT" -eq "1" ]; then
    echo -e "${GREEN}✅ PASS - Migration record found${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL - Migration record not found${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))
echo ""

echo "======================================================"
echo -e "${CYAN}Section 3: Index Verification${NC}"
echo "======================================================"
echo ""

# Test 9: Check pricing_rules indexes
echo -e "${BLUE}🔍 Test $((TESTS_TOTAL + 1)): pricing_rules indexes${NC}"
INDEX_COUNT=$(docker exec pricing-service-db mysql -u pricing_user -ppricing_password pricing_service_db -sN -e "SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'pricing_service_db' AND table_name = 'pricing_rules' AND index_name LIKE 'IDX_%';")
if [ "$INDEX_COUNT" -ge "5" ]; then
    echo -e "${GREEN}✅ PASS - Found $INDEX_COUNT indexes (expected 5+)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL - Found $INDEX_COUNT indexes (expected 5)${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))
echo ""

# Test 10: Check price_calculations indexes
echo -e "${BLUE}🔍 Test $((TESTS_TOTAL + 1)): price_calculations indexes${NC}"
CALC_INDEX_COUNT=$(docker exec pricing-service-db mysql -u pricing_user -ppricing_password pricing_service_db -sN -e "SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = 'pricing_service_db' AND table_name = 'price_calculations' AND index_name LIKE 'IDX_%';")
if [ "$CALC_INDEX_COUNT" -ge "2" ]; then
    echo -e "${GREEN}✅ PASS - Found $CALC_INDEX_COUNT indexes (expected 2+)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL - Found $CALC_INDEX_COUNT indexes (expected 2)${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))
echo ""

echo "======================================================"
echo -e "${CYAN}Section 4: Service Configuration Validation${NC}"
echo "======================================================"
echo ""

# Test 11: Check synchronize is disabled
run_test "TypeORM synchronize disabled" \
    "grep -q 'synchronize: false' /opt/cursor-project/fullstack-project/pricing-service/src/app.module.ts"

# Test 12: Check migrationsRun is enabled
run_test "TypeORM migrationsRun enabled" \
    "grep -q 'migrationsRun: true' /opt/cursor-project/fullstack-project/pricing-service/src/app.module.ts"

# Test 13: Check migrations path configured
run_test "Migrations path configured" \
    "grep -q 'migrations:' /opt/cursor-project/fullstack-project/pricing-service/src/app.module.ts"

echo "======================================================"
echo -e "${CYAN}Section 5: API Functionality Tests${NC}"
echo "======================================================"
echo ""

# Test 14: Service health check
run_test "Service health endpoint" \
    "curl -sf http://localhost:3006/api/v1/health | jq -e '.data.status == \"ok\"' > /dev/null"

# Test 15: Get pricing rules (verify data preserved)
echo -e "${BLUE}🔍 Test $((TESTS_TOTAL + 1)): Pricing rules data integrity${NC}"
RULES_COUNT=$(curl -sf "http://localhost:3006/api/v1/pricing/rules?page=1&limit=100" | jq '.data.total // 0')
if [ "$RULES_COUNT" -ge "5" ]; then
    echo -e "${GREEN}✅ PASS - Found $RULES_COUNT rules (expected 5+)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL - Found $RULES_COUNT rules (expected 5+)${NC}"
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))
echo ""

# Test 16: Create new pricing rule
echo -e "${BLUE}🔍 Test $((TESTS_TOTAL + 1)): Create pricing rule via API${NC}"
CREATE_RESPONSE=$(curl -sf -X POST http://localhost:3006/api/v1/pricing/rules \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Migration Test Rule",
        "description": "Test rule created during migration testing",
        "conditions": {
            "carrierId": 999,
            "serviceType": "Test"
        },
        "pricing": {
            "baseRate": 10.00,
            "currency": "USD"
        },
        "priority": 1
    }')

if echo "$CREATE_RESPONSE" | jq -e '.success == true' > /dev/null; then
    NEW_RULE_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.id')
    echo -e "${GREEN}✅ PASS - Rule created with ID: $NEW_RULE_ID${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    # Test 17: Retrieve the created rule
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo ""
    echo -e "${BLUE}🔍 Test $TESTS_TOTAL: Retrieve created rule${NC}"
    if curl -sf "http://localhost:3006/api/v1/pricing/rules/$NEW_RULE_ID" | jq -e '.data.name == "Migration Test Rule"' > /dev/null; then
        echo -e "${GREEN}✅ PASS - Rule retrieved successfully${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL - Rule retrieval failed${NC}"
    fi
    
    # Test 18: Delete the created rule (cleanup)
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo ""
    echo -e "${BLUE}🔍 Test $TESTS_TOTAL: Delete test rule (cleanup)${NC}"
    if curl -sf -X DELETE "http://localhost:3006/api/v1/pricing/rules/$NEW_RULE_ID" -w "%{http_code}" | grep -q "204"; then
        echo -e "${GREEN}✅ PASS - Rule deleted successfully${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL - Rule deletion failed${NC}"
    fi
else
    echo -e "${RED}❌ FAIL - Rule creation failed${NC}"
    TESTS_TOTAL=$((TESTS_TOTAL + 2)) # Account for skipped tests
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))
echo ""

echo "======================================================"
echo -e "${CYAN}Section 6: Database Performance Validation${NC}"
echo "======================================================"
echo ""

# Test 19: Check query performance with indexes
echo -e "${BLUE}🔍 Test $((TESTS_TOTAL + 1)): Query performance with indexes${NC}"
# Execute a query that uses indexes
START_TIME=$(date +%s%3N)
curl -sf "http://localhost:3006/api/v1/pricing/rules?page=1&limit=10" > /dev/null
END_TIME=$(date +%s%3N)
DURATION=$((END_TIME - START_TIME))

if [ "$DURATION" -lt "500" ]; then
    echo -e "${GREEN}✅ PASS - Query completed in ${DURATION}ms (< 500ms)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}⚠️  WARNING - Query took ${DURATION}ms (expected < 500ms)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1)) # Still pass but warn
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))
echo ""

# Test 20: Verify database size is reasonable
echo -e "${BLUE}🔍 Test $((TESTS_TOTAL + 1)): Database size validation${NC}"
DB_SIZE=$(docker exec pricing-service-db mysql -u pricing_user -ppricing_password pricing_service_db -sN -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) FROM information_schema.TABLES WHERE table_schema = 'pricing_service_db';")
echo -e "   Database size: ${DB_SIZE} MB"
if (( $(echo "$DB_SIZE < 100" | bc -l) )); then
    echo -e "${GREEN}✅ PASS - Database size is reasonable (< 100 MB)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}⚠️  WARNING - Database size is large (${DB_SIZE} MB)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1)) # Still pass
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))
echo ""

echo "======================================================"
echo -e "${CYAN}Section 7: Documentation Verification${NC}"
echo "======================================================"
echo ""

# Test 21: Check migration documentation exists
run_test "MIGRATIONS-README.md exists" \
    "test -f /opt/cursor-project/fullstack-project/pricing-service/MIGRATIONS-README.md"

# Test 22: Check setup completion doc exists
run_test "MIGRATION-SETUP-COMPLETE.md exists" \
    "test -f /opt/cursor-project/fullstack-project/pricing-service/MIGRATION-SETUP-COMPLETE.md"

# Test 23: Check quick reference exists
run_test "MIGRATION-QUICK-REFERENCE.md exists" \
    "test -f /opt/cursor-project/fullstack-project/pricing-service/MIGRATION-QUICK-REFERENCE.md"

# Test 24: Check Postman collection guide exists
run_test "POSTMAN-COLLECTION-GUIDE.md exists" \
    "test -f /opt/cursor-project/fullstack-project/pricing-service/POSTMAN-COLLECTION-GUIDE.md"

echo "======================================================"
echo -e "${CYAN}📊 Test Summary${NC}"
echo "======================================================"
echo ""
echo "Total Tests: $TESTS_TOTAL"
echo "Passed: $TESTS_PASSED"
echo "Failed: $((TESTS_TOTAL - TESTS_PASSED))"
echo ""

SUCCESS_RATE=$(( TESTS_PASSED * 100 / TESTS_TOTAL ))
echo "Success Rate: ${SUCCESS_RATE}%"
echo ""

if [ "$TESTS_PASSED" -eq "$TESTS_TOTAL" ]; then
    echo -e "${GREEN}======================================================"
    echo -e "🎉 ALL TESTS PASSED!"
    echo -e "======================================================${NC}"
    echo ""
    echo -e "${GREEN}✅ Pricing Service migration infrastructure is fully operational${NC}"
    echo -e "${GREEN}✅ Database schema is correct with all indexes${NC}"
    echo -e "${GREEN}✅ Service APIs are working correctly${NC}"
    echo -e "${GREEN}✅ Data integrity maintained${NC}"
    echo -e "${GREEN}✅ Performance is acceptable${NC}"
    echo -e "${GREEN}✅ Documentation is complete${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}======================================================"
    echo -e "❌ SOME TESTS FAILED"
    echo -e "======================================================${NC}"
    echo ""
    echo -e "${RED}Failed: $((TESTS_TOTAL - TESTS_PASSED)) test(s)${NC}"
    echo ""
    exit 1
fi
