#!/bin/bash

# Upgrade Script for Next.js 16 & React 19
# This script will clean and reinstall all dependencies

set -e

echo "🚀 Starting upgrade to Next.js 16 & React 19..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Clean old dependencies
echo "${YELLOW}Step 1: Cleaning old dependencies...${NC}"
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf .turbo
rm -rf apps/*/.next
rm -f bun.lockb
echo "${GREEN}✓ Cleaned${NC}"
echo ""

# Step 2: Install new dependencies
echo "${YELLOW}Step 2: Installing new dependencies...${NC}"
bun install
echo "${GREEN}✓ Installed${NC}"
echo ""

# Step 3: Generate Prisma Client
echo "${YELLOW}Step 3: Generating Prisma Client...${NC}"
cd packages/database
bun run db:generate
cd ../..
echo "${GREEN}✓ Generated${NC}"
echo ""

# Step 4: Type check
echo "${YELLOW}Step 4: Running type check...${NC}"
if bun run type-check; then
    echo "${GREEN}✓ Type check passed${NC}"
else
    echo "${RED}⚠ Type check failed - please review errors${NC}"
fi
echo ""

# Step 5: Lint
echo "${YELLOW}Step 5: Running linter...${NC}"
if bun run lint; then
    echo "${GREEN}✓ Lint passed${NC}"
else
    echo "${RED}⚠ Lint failed - please review errors${NC}"
fi
echo ""

# Step 6: Build
echo "${YELLOW}Step 6: Building project...${NC}"
if bun run build; then
    echo "${GREEN}✓ Build successful${NC}"
else
    echo "${RED}⚠ Build failed - please review errors${NC}"
    exit 1
fi
echo ""

echo "${GREEN}🎉 Upgrade complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Review UPGRADE-TO-NEXTJS16.md for breaking changes"
echo "2. Test your application: bun run dev"
echo "3. Check for any type errors or warnings"
echo ""
echo "Happy coding! ✨"
