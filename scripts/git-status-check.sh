#!/bin/bash

# Git Status Check Script
# Check what files need to be committed

echo "📊 Git Status Check"
echo "==================="

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

# Show current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "${BLUE}Current branch: ${BRANCH}${NC}"
echo ""

# Show status
echo -e "${YELLOW}Git Status:${NC}"
git status --short

# Count files
MODIFIED=$(git status --short | grep "^ M" | wc -l)
ADDED=$(git status --short | grep "^A" | wc -l)
UNTRACKED=$(git status --short | grep "^??" | wc -l)
DELETED=$(git status --short | grep "^ D" | wc -l)

echo ""
echo -e "${BLUE}Summary:${NC}"
echo "- Modified: ${MODIFIED}"
echo "- Added: ${ADDED}"
echo "- Untracked: ${UNTRACKED}"
echo "- Deleted: ${DELETED}"
echo ""

# Check if there are changes
if [ $MODIFIED -eq 0 ] && [ $ADDED -eq 0 ] && [ $UNTRACKED -eq 0 ] && [ $DELETED -eq 0 ]; then
    echo -e "${GREEN}✅ Working directory clean${NC}"
    echo ""
    echo "Last 5 commits:"
    git log --oneline -5
else
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    echo ""
    echo "To commit all changes, run:"
    echo "  ./scripts/git-commit-mvp-complete.sh"
fi

echo ""
echo -e "${BLUE}Remote Status:${NC}"
git remote -v
