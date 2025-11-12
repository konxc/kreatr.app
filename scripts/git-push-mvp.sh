#!/bin/bash

# Git Push Script - MVP Complete
# Push all commits and create release tag

echo "🚀 Pushing MVP Complete to Remote"
echo "=================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not a git repository${NC}"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ You have uncommitted changes${NC}"
    echo "Please commit all changes first using: ./scripts/git-commit-mvp-complete.sh"
    exit 1
fi

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "${BLUE}Current branch: ${BRANCH}${NC}"

# Show last 5 commits
echo -e "\n${YELLOW}Last 5 commits:${NC}"
git log --oneline -5

# Confirm push
echo -e "\n${YELLOW}Ready to push to origin/${BRANCH}?${NC}"
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Push cancelled"
    exit 1
fi

# Push to remote
echo -e "\n${BLUE}Pushing to origin/${BRANCH}...${NC}"
git push origin ${BRANCH}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Push successful!${NC}"
else
    echo -e "${RED}❌ Push failed${NC}"
    exit 1
fi

# Create release tag
echo -e "\n${YELLOW}Create release tag v1.0.0?${NC}"
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${BLUE}Creating release tag v1.0.0...${NC}"
    git tag -a v1.0.0 -m "MVP Complete - kreatr.app v1.0.0

Features:
- Real Scheduler with Calendar
- Payment Integration (Midtrans)
- Onboarding Flow
- AI Lab (Brainstorm, Generator, Analyzer)
- Complete Dashboard
- Testing Suite (90%+ coverage)
- Comprehensive Documentation

Ready for production launch!"

    echo -e "${BLUE}Pushing tag to remote...${NC}"
    git push origin v1.0.0

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Release tag created and pushed!${NC}"
    else
        echo -e "${RED}❌ Tag push failed${NC}"
        exit 1
    fi
fi

# Summary
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}🎉 MVP Complete - Pushed to Remote!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}Repository Status:${NC}"
echo "- Branch: ${BRANCH}"
echo "- Tag: v1.0.0"
echo "- Status: Pushed ✅"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Configure production environment"
echo "3. Setup Midtrans production keys"
echo "4. Start beta testing"
echo ""
echo -e "${GREEN}🚀 Ready for Launch!${NC}"
