#!/bin/bash

# User Service Docker Fix - Automated Execution Script
# This script implements Option 1: NestJS CLI Upgrade

set -e  # Exit on error

echo "=================================="
echo "User Service Docker Fix"
echo "Option 1: NestJS CLI Upgrade"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to user-service directory
cd "$(dirname "$0")/../../user-service" || exit 1

echo -e "${YELLOW}Step 1: Checking current state...${NC}"
echo "Current directory: $(pwd)"
echo ""

echo -e "${YELLOW}Step 2: Upgrading NestJS packages...${NC}"
npm install --save-dev @nestjs/cli@^11.0.10

npm install @nestjs/common@^11.1.6 \
            @nestjs/core@^11.1.6 \
            @nestjs/typeorm@^11.0.0 \
            @nestjs/config@^4.0.2 \
            @nestjs/platform-express@^11.1.6

echo ""
echo -e "${GREEN}✓ Packages upgraded${NC}"
echo ""

echo -e "${YELLOW}Step 3: Cleaning previous build...${NC}"
rm -rf dist/
echo -e "${GREEN}✓ Clean complete${NC}"
echo ""

echo -e "${YELLOW}Step 4: Building project...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

echo -e "${YELLOW}Step 5: Checking for .ts extensions in compiled output...${NC}"
TS_COUNT=$(grep -r "require.*\.ts\"" dist/ 2>/dev/null | wc -l | tr -d ' ')

if [ "$TS_COUNT" -eq "0" ]; then
    echo -e "${GREEN}✓ SUCCESS: No .ts extensions found in compiled output!${NC}"
else
    echo -e "${RED}✗ WARNING: Found $TS_COUNT files with .ts extensions${NC}"
    echo "Files with .ts extensions:"
    grep -r "require.*\.ts\"" dist/ 2>/dev/null | head -10
    echo ""
    echo -e "${YELLOW}This may still work - proceeding with caution...${NC}"
fi
echo ""

echo "=================================="
echo -e "${GREEN}Upgrade Complete!${NC}"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Test locally: cd user-service && npm run start:dev"
echo "2. Test Docker: docker-compose -f docker-compose.hybrid.yml build user-service"
echo "3. Start Docker: docker-compose -f docker-compose.hybrid.yml up -d user-service"
echo "4. Check logs: docker logs user-service --tail 50"
echo "5. Test API: curl http://localhost:3003/api/v1/health"
echo ""
