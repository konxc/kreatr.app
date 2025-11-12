#!/bin/bash

# Master Commit Script - MVP Complete
# One command to commit and push everything

echo "🚀 kreatr.app MVP - Git Commit & Push"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Make scripts executable
chmod +x scripts/*.sh

# Step 1: Check Status
echo -e "${BLUE}Step 1: Checking Git Status${NC}"
echo "----------------------------"
./scripts/git-status-check.sh

echo ""
echo -e "${YELLOW}Continue with commit?${NC}"
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Step 2: Commit All Changes
echo ""
echo -e "${BLUE}Step 2: Committing All Changes${NC}"
echo "-------------------------------"
./scripts/git-commit-mvp-complete.sh

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Commit failed${NC}"
    exit 1
fi

# Step 3: Push to Remote
echo ""
echo -e "${BLUE}Step 3: Push to Remote${NC}"
echo "----------------------"
./scripts/git-push-mvp.sh

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Push failed${NC}"
    exit 1
fi

# Success
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}🎉 SUCCESS!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}All changes committed and pushed!${NC}"
echo ""
echo "✅ 15 batches committed"
echo "✅ Pushed to remote"
echo "✅ Release tag v1.0.0 created"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Deploy: vercel --prod"
echo "2. Configure production environment"
echo "3. Start beta testing"
echo ""
echo -e "${GREEN}🚀 kreatr.app MVP is Ready for Launch!${NC}"
