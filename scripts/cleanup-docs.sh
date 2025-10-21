#!/bin/bash

# Documentation Cleanup Automation Script
# This script organizes documentation files into a clean structure

set -e  # Exit on error

echo "🧹 Starting Documentation Cleanup..."
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="/opt/cursor-project/fullstack-project"
cd "$BASE_DIR"

echo ""
echo -e "${BLUE}Step 1: Creating directory structure...${NC}"

# Create new directories
mkdir -p docs/translation
mkdir -p docs/archived/20251021_translation_progress
mkdir -p docs/archived/20251020_api_standards
mkdir -p docs/archived/20251020_implementation_plans
mkdir -p docs/archived/20251019_git_flow
mkdir -p docs/archived/20251019_health_checks
mkdir -p docs/archived/20251018_service_migrations
mkdir -p docs/archived/20251020_react_admin

echo -e "${GREEN}✓ Directory structure created${NC}"

echo ""
echo -e "${BLUE}Step 2: Moving active translation documentation...${NC}"

# Move translation feature docs
[ -f "TRANSLATION-FEATURE-COMPLETE-SUMMARY.md" ] && mv TRANSLATION-FEATURE-COMPLETE-SUMMARY.md docs/translation/
[ -f "LANGUAGE-SELECTOR-IMPLEMENTATION.md" ] && mv LANGUAGE-SELECTOR-IMPLEMENTATION.md docs/translation/
[ -f "LANGUAGE-SELECTOR-INTEGRATION-EXAMPLE.md" ] && mv LANGUAGE-SELECTOR-INTEGRATION-EXAMPLE.md docs/translation/
[ -f "LANGUAGE-SELECTOR-DYNAMIC-TRANSLATION-FIX.md" ] && mv LANGUAGE-SELECTOR-DYNAMIC-TRANSLATION-FIX.md docs/translation/
[ -f "CARRIER-MODULE-BATCH-TRANSLATION-COMPLETE.md" ] && mv CARRIER-MODULE-BATCH-TRANSLATION-COMPLETE.md docs/translation/
[ -f "CARRIER-TRANSLATION-TESTING-GUIDE.md" ] && mv CARRIER-TRANSLATION-TESTING-GUIDE.md docs/translation/

echo -e "${GREEN}✓ Translation docs moved${NC}"

echo ""
echo -e "${BLUE}Step 3: Moving API documentation...${NC}"

# Move API documentation
[ -f "API-STANDARDIZATION-COMPLETE.md" ] && mv API-STANDARDIZATION-COMPLETE.md docs/api/
[ -f "POSTMAN-QUICK-REFERENCE.md" ] && mv POSTMAN-QUICK-REFERENCE.md docs/api/
[ -f "POSTMAN-COLLECTION-UPDATE-SUMMARY.md" ] && mv POSTMAN-COLLECTION-UPDATE-SUMMARY.md docs/api/

echo -e "${GREEN}✓ API docs moved${NC}"

echo ""
echo -e "${BLUE}Step 4: Archiving Git Flow documentation...${NC}"

# Archive Git Flow docs
[ -f "GIT-FLOW-COMPLETE-STRATEGY.md" ] && mv GIT-FLOW-COMPLETE-STRATEGY.md docs/archived/20251019_git_flow/
[ -f "GIT-FLOW-EXECUTIVE-SUMMARY.md" ] && mv GIT-FLOW-EXECUTIVE-SUMMARY.md docs/archived/20251019_git_flow/
[ -f "GIT-FLOW-MERGE-SUMMARY.md" ] && mv GIT-FLOW-MERGE-SUMMARY.md docs/archived/20251019_git_flow/
[ -f "GIT-FLOW-QUICK-NAVIGATION.md" ] && mv GIT-FLOW-QUICK-NAVIGATION.md docs/archived/20251019_git_flow/
[ -f "CARRIER-SERVICE-GIT-FLOW-COMPLETE.md" ] && mv CARRIER-SERVICE-GIT-FLOW-COMPLETE.md docs/archived/20251019_git_flow/
[ -f "CUSTOMER-SERVICE-GIT-FLOW-EXECUTIVE-SUMMARY.md" ] && mv CUSTOMER-SERVICE-GIT-FLOW-EXECUTIVE-SUMMARY.md docs/archived/20251019_git_flow/
[ -f "USER-SERVICE-GIT-FLOW-COMPLETE.md" ] && mv USER-SERVICE-GIT-FLOW-COMPLETE.md docs/archived/20251019_git_flow/
[ -f "TRANSLATION-SERVICE-DOCKER-DEPLOYMENT-GIT-FLOW.md" ] && mv TRANSLATION-SERVICE-DOCKER-DEPLOYMENT-GIT-FLOW.md docs/archived/20251019_git_flow/
[ -f "TRANSLATION-SERVICE-INFRASTRUCTURE-GIT-FLOW.md" ] && mv TRANSLATION-SERVICE-INFRASTRUCTURE-GIT-FLOW.md docs/archived/20251019_git_flow/
[ -f "CUSTOMER-SERVICE-DOCKER-INFRASTRUCTURE-GIT-FLOW.md" ] && mv CUSTOMER-SERVICE-DOCKER-INFRASTRUCTURE-GIT-FLOW.md docs/archived/20251019_git_flow/
[ -f "REACT-ADMIN-TRANSLATION-API-STANDARDS-GIT-FLOW.md" ] && mv REACT-ADMIN-TRANSLATION-API-STANDARDS-GIT-FLOW.md docs/archived/20251019_git_flow/
[ -f "DOCUMENTATION-UPDATES-MERGE-SUMMARY.md" ] && mv DOCUMENTATION-UPDATES-MERGE-SUMMARY.md docs/archived/20251019_git_flow/
[ -f "DOCUMENTATION-CLEANUP-SUMMARY.md" ] && mv DOCUMENTATION-CLEANUP-SUMMARY.md docs/archived/20251019_git_flow/
[ -f "DOCUMENTATION-CONSOLIDATION-PLAN.md" ] && mv DOCUMENTATION-CONSOLIDATION-PLAN.md docs/archived/20251019_git_flow/

echo -e "${GREEN}✓ Git Flow docs archived${NC}"

echo ""
echo -e "${BLUE}Step 5: Archiving implementation plans...${NC}"

# Archive implementation plans
[ -f "CARRIER-MODULE-TRANSLATION-IMPLEMENTATION-PLAN.md" ] && mv CARRIER-MODULE-TRANSLATION-IMPLEMENTATION-PLAN.md docs/archived/20251020_implementation_plans/
[ -f "CARRIER-MODULE-TRANSLATION-IMPLEMENTATION-PLAN-REVISED.md" ] && mv CARRIER-MODULE-TRANSLATION-IMPLEMENTATION-PLAN-REVISED.md docs/archived/20251020_implementation_plans/
[ -f "TRANSLATION-SERVICE-IMPLEMENTATION-PLAN.md" ] && mv TRANSLATION-SERVICE-IMPLEMENTATION-PLAN.md docs/archived/20251020_implementation_plans/
[ -f "TRANSLATION-IMPLEMENTATION-PROGRESS-SUMMARY.md" ] && mv TRANSLATION-IMPLEMENTATION-PROGRESS-SUMMARY.md docs/archived/20251020_implementation_plans/
[ -f "API-STANDARDS-IMPLEMENTATION-PROGRESS.md" ] && mv API-STANDARDS-IMPLEMENTATION-PROGRESS.md docs/archived/20251020_implementation_plans/
[ -f "API-STANDARDS-IMPLEMENTATION-POC-COMPLETE.md" ] && mv API-STANDARDS-IMPLEMENTATION-POC-COMPLETE.md docs/archived/20251020_implementation_plans/
[ -f "CARRIER-BATCH-TRANSLATION-TEST-SUMMARY.md" ] && mv CARRIER-BATCH-TRANSLATION-TEST-SUMMARY.md docs/archived/20251020_implementation_plans/
[ -f "PROJECT-STATUS-UPDATE.md" ] && mv PROJECT-STATUS-UPDATE.md docs/archived/20251020_implementation_plans/
[ -f "TRANSLATION-DATA-UPDATE-SUMMARY.md" ] && mv TRANSLATION-DATA-UPDATE-SUMMARY.md docs/archived/20251020_implementation_plans/
[ -f "TRANSLATION-SERVICE-REVERT-TO-OLD-SYSTEM.md" ] && mv TRANSLATION-SERVICE-REVERT-TO-OLD-SYSTEM.md docs/archived/20251020_implementation_plans/

echo -e "${GREEN}✓ Implementation plans archived${NC}"

echo ""
echo -e "${BLUE}Step 6: Archiving service infrastructure docs...${NC}"

# Archive service infrastructure
[ -f "CARRIER-SERVICE-INFRASTRUCTURE-QUICK-REFERENCE.md" ] && mv CARRIER-SERVICE-INFRASTRUCTURE-QUICK-REFERENCE.md docs/archived/20251018_service_migrations/
[ -f "CUSTOMER-SERVICE-DOCKER-INFRASTRUCTURE-EXECUTIVE-SUMMARY.md" ] && mv CUSTOMER-SERVICE-DOCKER-INFRASTRUCTURE-EXECUTIVE-SUMMARY.md docs/archived/20251018_service_migrations/
[ -f "CUSTOMER-SERVICE-400-SEED-GIT-FLOW.md" ] && mv CUSTOMER-SERVICE-400-SEED-GIT-FLOW.md docs/archived/20251018_service_migrations/
[ -f "TRANSLATION-SERVICE-INFRASTRUCTURE-QUICK-REFERENCE.md" ] && mv TRANSLATION-SERVICE-INFRASTRUCTURE-QUICK-REFERENCE.md docs/archived/20251018_service_migrations/
[ -f "DOCKER-INFRASTRUCTURE-INVESTIGATION.md" ] && mv DOCKER-INFRASTRUCTURE-INVESTIGATION.md docs/archived/20251018_service_migrations/
[ -f "CUSTOMER-SERVICE-QUICK-REFERENCE.md" ] && mv CUSTOMER-SERVICE-QUICK-REFERENCE.md docs/archived/20251018_service_migrations/
[ -f "TRANSLATION-SERVICE-REVERSION-COMPLETE.md" ] && mv TRANSLATION-SERVICE-REVERSION-COMPLETE.md docs/archived/20251018_service_migrations/
[ -f "TRANSLATION-SERVICE-TYPESCRIPT-FIX.md" ] && mv TRANSLATION-SERVICE-TYPESCRIPT-FIX.md docs/archived/20251018_service_migrations/

echo -e "${GREEN}✓ Service infrastructure docs archived${NC}"

echo ""
echo -e "${BLUE}Step 7: Archiving health check docs...${NC}"

# Archive health check docs
[ -f "MICROSERVICES-HEALTH-CHECK-GUIDE.md" ] && mv MICROSERVICES-HEALTH-CHECK-GUIDE.md docs/archived/20251019_health_checks/
[ -f "HEALTH-CHECK-ISSUE-RESOLUTION.md" ] && mv HEALTH-CHECK-ISSUE-RESOLUTION.md docs/archived/20251019_health_checks/
[ -f "HEALTH-CHECK-FINAL-FIX-SUMMARY.md" ] && mv HEALTH-CHECK-FINAL-FIX-SUMMARY.md docs/archived/20251019_health_checks/
[ -f "CUSTOMER-SERVICE-HEALTH-CHECK.md" ] && mv CUSTOMER-SERVICE-HEALTH-CHECK.md docs/archived/20251019_health_checks/

echo -e "${GREEN}✓ Health check docs archived${NC}"

echo ""
echo -e "${BLUE}Step 8: Archiving API standards history...${NC}"

# Archive API standards history
[ -f "API-STANDARDS-REVIEW-COMPLETE.md" ] && mv API-STANDARDS-REVIEW-COMPLETE.md docs/archived/20251020_api_standards/
[ -f "TRANSLATION-SERVICE-API-STANDARDS-VERIFICATION.md" ] && mv TRANSLATION-SERVICE-API-STANDARDS-VERIFICATION.md docs/archived/20251020_api_standards/
[ -f "TRANSLATION-API-STANDARDS-VERIFICATION-SUMMARY.md" ] && mv TRANSLATION-API-STANDARDS-VERIFICATION-SUMMARY.md docs/archived/20251020_api_standards/
[ -f "USER-SERVICE-API-STANDARDS-INTEGRATION.md" ] && mv USER-SERVICE-API-STANDARDS-INTEGRATION.md docs/archived/20251020_api_standards/

echo -e "${GREEN}✓ API standards history archived${NC}"

echo ""
echo -e "${BLUE}Step 9: Archiving React Admin update docs...${NC}"

# Archive React Admin updates
[ -f "REACT-ADMIN-AUTH-API-STANDARDS-INTEGRATION.md" ] && mv REACT-ADMIN-AUTH-API-STANDARDS-INTEGRATION.md docs/archived/20251020_react_admin/
[ -f "REACT-ADMIN-CARRIER-ACTIONS-QUICK-REFERENCE.md" ] && mv REACT-ADMIN-CARRIER-ACTIONS-QUICK-REFERENCE.md docs/archived/20251020_react_admin/
[ -f "REACT-ADMIN-CARRIER-ACTIONS-UPDATE.md" ] && mv REACT-ADMIN-CARRIER-ACTIONS-UPDATE.md docs/archived/20251020_react_admin/
[ -f "REACT-ADMIN-CUSTOMER-ACTIONS-QUICK-REFERENCE.md" ] && mv REACT-ADMIN-CUSTOMER-ACTIONS-QUICK-REFERENCE.md docs/archived/20251020_react_admin/
[ -f "REACT-ADMIN-CUSTOMER-ACTIONS-UPDATE.md" ] && mv REACT-ADMIN-CUSTOMER-ACTIONS-UPDATE.md docs/archived/20251020_react_admin/
[ -f "REACT-ADMIN-DATA-LOADING-ANALYSIS.md" ] && mv REACT-ADMIN-DATA-LOADING-ANALYSIS.md docs/archived/20251020_react_admin/
[ -f "REACT-ADMIN-CONNECTION-STATUS.md" ] && mv REACT-ADMIN-CONNECTION-STATUS.md docs/archived/20251020_react_admin/
[ -f "REACT-ADMIN-TRANSLATION-FIX-COMPLETE.md" ] && mv REACT-ADMIN-TRANSLATION-FIX-COMPLETE.md docs/archived/20251020_react_admin/
[ -f "TRANSLATION-SERVICE-API-TESTING-GUIDE.md" ] && mv TRANSLATION-SERVICE-API-TESTING-GUIDE.md docs/archived/20251020_react_admin/

echo -e "${GREEN}✓ React Admin docs archived${NC}"

echo ""
echo -e "${BLUE}Step 10: Updating README...${NC}"

# Backup old README and use new one
if [ -f "README.md" ]; then
    mv README.md docs/archived/README-OLD.md
fi

if [ -f "README-NEW.md" ]; then
    mv README-NEW.md README.md
    echo -e "${GREEN}✓ README updated${NC}"
else
    echo -e "${YELLOW}⚠ README-NEW.md not found, keeping old README${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}✓ Documentation cleanup complete!${NC}"
echo ""
echo "Summary:"
echo "  • Root directory cleaned"
echo "  • Active docs moved to docs/translation/ and docs/api/"
echo "  • Historical docs archived by date and category"
echo "  • README updated with clean structure"
echo ""
echo "Next steps:"
echo "  1. Review docs/DOCUMENTATION-INDEX.md for navigation"
echo "  2. Check that all important docs are accessible"
echo "  3. Update any broken links in remaining documents"
echo ""
