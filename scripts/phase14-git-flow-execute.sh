#!/bin/bash

# Phase 14 - Git Flow Execution Script
# Run this script to execute the complete Git Flow process

set -e

echo "🚀 Phase 14 - Git Flow Execution"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Ensure we're on develop and up-to-date
echo -e "${BLUE}Step 1: Checkout and update develop branch${NC}"
git checkout develop
git pull origin develop
echo -e "${GREEN}✅ Develop branch updated${NC}"
echo ""

# Step 2: Create feature branch
echo -e "${BLUE}Step 2: Create feature branch${NC}"
git checkout -b feature/phase14-grafana-dashboard
echo -e "${GREEN}✅ Feature branch created${NC}"
echo ""

# Step 3: Stage all files
echo -e "${BLUE}Step 3: Stage changed files${NC}"

# Documentation files
git add PHASE-14-COMPLETION-SUMMARY.md
git add PHASE-14-GIT-FLOW.md
git add TODO.md
git add LOGGING-ROLLOUT-PLAN.md
git add PHASE-13-COMPLETION-SUMMARY.md
git add WINSTON-DEVELOPER-GUIDE.md

# Grafana dashboard and configuration
git add api-gateway/grafana/dashboards/microservices-logging-overview.json
git add api-gateway/grafana/provisioning/dashboards/microservices.yml

# Testing scripts
git add scripts/phase14-load-test.sh
git add scripts/distributed-tracing-demo.sh
git add scripts/rollout-logging-phase13.sh
git add scripts/phase14-git-flow-execute.sh

# Translation service files
git add translation-service/.env.docker
git add translation-service/SEEDING-SUMMARY.md
git add translation-service/scripts/seed-comprehensive.ts

echo -e "${GREEN}✅ All files staged${NC}"
echo ""

# Step 4: Show what will be committed
echo -e "${BLUE}Step 4: Review staged files${NC}"
git status --short
echo ""

# Step 5: Commit
echo -e "${BLUE}Step 5: Creating commit${NC}"
git commit -m "feat(monitoring): Phase 14 - Grafana Dashboard & Monitoring

- Created comprehensive Grafana dashboard with 13 monitoring panels
- Dashboard UID: ed9d0a9d-7050-4a4a-850b-504bd72e1eaf
- Configured auto-provisioning for dashboard persistence
- Created load testing script for dashboard validation

Features:
- Log volume tracking by service (timeseries)
- Error rate monitoring with color thresholds (stat)
- Response time analysis with heatmap
- Correlation ID tracking for distributed tracing
- HTTP status code distribution (stacked bars)
- Top 10 slow endpoints detection (table)
- Real-time error feed (logs panel)
- Service health status visualization (bar gauge)
- Request distribution pie chart
- Unique correlation IDs counter
- Log levels by service (timeseries)

Dashboard Access:
- URL: http://localhost:3100/d/ed9d0a9d-7050-4a4a-850b-504bd72e1eaf
- Credentials: admin/admin
- Auto-refresh: 10 seconds

Files Created:
- api-gateway/grafana/dashboards/microservices-logging-overview.json (363 lines)
- api-gateway/grafana/provisioning/dashboards/microservices.yml (11 lines)
- scripts/phase14-load-test.sh (68 lines)
- PHASE-14-COMPLETION-SUMMARY.md (500+ lines)
- PHASE-14-GIT-FLOW.md (complete Git Flow guide)

Files Modified:
- TODO.md (marked Phase 14 complete)

Documentation:
- Complete usage guide with common scenarios
- LogQL query reference for all panels
- Panel descriptions and threshold configurations
- Team benefits for developers, DevOps, and QA

Status: Production-ready, pending manual verification"

echo -e "${GREEN}✅ Commit created${NC}"
echo ""

# Step 6: Push to origin
echo -e "${BLUE}Step 6: Pushing feature branch to origin${NC}"
git push -u origin feature/phase14-grafana-dashboard
echo -e "${GREEN}✅ Feature branch pushed${NC}"
echo ""

# Step 7: Next steps
echo "=================================="
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""
echo "1. Create Pull Request on GitHub:"
echo "   - Go to: https://github.com/southern-martin/fullstack-project"
echo "   - Click 'Pull requests' → 'New pull request'"
echo "   - Base: develop"
echo "   - Compare: feature/phase14-grafana-dashboard"
echo "   - Title: feat(monitoring): Phase 14 - Grafana Dashboard & Monitoring Setup"
echo "   - Use description from PHASE-14-GIT-FLOW.md"
echo ""
echo "2. After PR Approval:"
echo "   git checkout develop"
echo "   git pull origin develop"
echo "   git merge --no-ff feature/phase14-grafana-dashboard"
echo "   git push origin develop"
echo ""
echo "3. Tag the release:"
echo "   git tag -a v1.14.0 -m 'Phase 14: Grafana Dashboard & Monitoring - Production Ready'"
echo "   git push origin v1.14.0"
echo ""
echo "4. Clean up (optional):"
echo "   git branch -d feature/phase14-grafana-dashboard"
echo "   git push origin --delete feature/phase14-grafana-dashboard"
echo ""
echo "=================================="
echo -e "${GREEN}✅ Git Flow Execution Complete!${NC}"
echo ""
echo "📊 Dashboard URL: http://localhost:3100/d/ed9d0a9d-7050-4a4a-850b-504bd72e1eaf"
echo "📚 Documentation: PHASE-14-COMPLETION-SUMMARY.md"
echo "🔀 Git Flow Guide: PHASE-14-GIT-FLOW.md"
