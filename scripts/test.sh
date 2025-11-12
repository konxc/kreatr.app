#!/bin/bash

echo "🧪 Running kreatr.app Test Suite"
echo "=================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if database is running
echo -e "${YELLOW}Checking database connection...${NC}"
if ! bunx prisma db push --skip-generate > /dev/null 2>&1; then
    echo -e "${RED}❌ Database not accessible${NC}"
    echo "Please start your database first:"
    echo "  docker-compose up -d postgres"
    exit 1
fi
echo -e "${GREEN}✅ Database connected${NC}"

# Generate Prisma client
echo -e "${YELLOW}Generating Prisma client...${NC}"
cd packages/database && bunx prisma generate && cd ../..
echo -e "${GREEN}✅ Prisma client generated${NC}"

# Run tests
echo -e "${YELLOW}Running tests...${NC}"
echo ""

# API tests
echo "📦 Testing API..."
cd packages/api && bun test
API_EXIT=$?

# Frontend tests
echo ""
echo "🎨 Testing Frontend..."
cd ../../apps/web && bun test
WEB_EXIT=$?

cd ../..

# Summary
echo ""
echo "=================================="
echo "Test Summary"
echo "=================================="

if [ $API_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ API Tests: PASSED${NC}"
else
    echo -e "${RED}❌ API Tests: FAILED${NC}"
fi

if [ $WEB_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Frontend Tests: FAILED${NC}"
fi

# Exit with error if any test failed
if [ $API_EXIT -ne 0 ] || [ $WEB_EXIT -ne 0 ]; then
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All tests passed!${NC}"
