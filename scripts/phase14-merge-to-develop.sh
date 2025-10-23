#!/bin/bash

# Phase 14 - Merge to Develop Script
# This script merges feature/phase14-grafana-dashboard to develop

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔀 Phase 14 - Merge to Develop${NC}"
echo "=================================="
echo ""

# Step 1: Checkout develop
echo -e "${BLUE}Step 1: Checkout develop branch${NC}"
git checkout develop
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Checked out develop${NC}"
else
    echo -e "${RED}❌ Failed to checkout develop${NC}"
    exit 1
fi
echo ""

# Step 2: Pull latest changes
echo -e "${BLUE}Step 2: Pull latest changes from origin/develop${NC}"
git pull origin develop
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Develop branch updated${NC}"
else
    echo -e "${RED}❌ Failed to pull from origin${NC}"
    exit 1
fi
echo ""

# Step 3: Merge feature branch (no fast-forward)
echo -e "${BLUE}Step 3: Merge feature/phase14-grafana-dashboard (--no-ff)${NC}"
git merge --no-ff feature/phase14-grafana-dashboard -m "Merge branch 'feature/phase14-grafana-dashboard' into develop

Phase 14: Grafana Dashboard & Monitoring
- 13 comprehensive monitoring panels
- Dashboard UID: ed9d0a9d-7050-4a4a-850b-504bd72e1eaf
- Auto-provisioning configured
- Complete documentation and testing scripts"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Feature branch merged successfully${NC}"
else
    echo -e "${RED}❌ Merge failed - please resolve conflicts manually${NC}"
    exit 1
fi
echo ""

# Step 4: Push to origin
echo -e "${BLUE}Step 4: Push merged develop to origin${NC}"
git push origin develop
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Pushed to origin/develop${NC}"
else
    echo -e "${RED}❌ Failed to push to origin${NC}"
    exit 1
fi
echo ""

# Step 5: Tag the release
echo -e "${BLUE}Step 5: Create release tag v1.14.0${NC}"
git tag -a v1.14.0 -m "Phase 14: Grafana Dashboard & Monitoring - Production Ready

Dashboard Features:
- 13 comprehensive monitoring panels
- Dashboard UID: ed9d0a9d-7050-4a4a-850b-504bd72e1eaf
- Auto-refresh: 10 seconds
- LogQL queries for all metrics
- Thresholds configured for alerts

Files:
- Grafana dashboard configuration (363 lines)
- Auto-provisioning setup
- Load testing scripts
- Complete documentation

Status: Production-ready"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Tag v1.14.0 created${NC}"
else
    echo -e "${RED}❌ Failed to create tag${NC}"
    exit 1
fi
echo ""

# Step 6: Push tag
echo -e "${BLUE}Step 6: Push tag to origin${NC}"
git push origin v1.14.0
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Tag pushed to origin${NC}"
else
    echo -e "${RED}❌ Failed to push tag${NC}"
    exit 1
fi
echo ""

echo "=================================="
echo -e "${GREEN}✅ Merge to Develop Complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Optional Cleanup:${NC}"
echo ""
echo "Delete local feature branch:"
echo "  git branch -d feature/phase14-grafana-dashboard"
echo ""
echo "Delete remote feature branch:"
echo "  git push origin --delete feature/phase14-grafana-dashboard"
echo ""
echo -e "${BLUE}📊 Verify Dashboard:${NC}"
echo "  URL: http://localhost:3100/d/ed9d0a9d-7050-4a4a-850b-504bd72e1eaf"
echo "  Login: admin/admin"
echo ""
echo -e "${BLUE}📚 View Release:${NC}"
echo "  https://github.com/southern-martin/fullstack-project/releases/tag/v1.14.0"
echo ""
echo -e "${GREEN}🎉 Phase 14 Successfully Merged and Tagged!${NC}"
