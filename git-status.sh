#!/bin/bash

# Git Status Script for kreatr.app
# Shows current git status and commit history

set -e

echo "📊 Git Status for kreatr.app"
echo "=============================="
echo ""

# Git configuration
echo "👤 Git Configuration:"
echo "   User: $(git config user.name) <$(git config user.email)>"
echo ""

# Current branch
echo "🌿 Current Branch:"
git branch --show-current
echo ""

# Remote information
echo "🔗 Remote Repository:"
git remote -v
echo ""

# Status
echo "📝 Working Directory Status:"
git status -s
if [ -z "$(git status -s)" ]; then
    echo "   ✅ Working directory clean"
fi
echo ""

# Commit count
COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
echo "📈 Total Commits: $COMMIT_COUNT"
echo ""

# Recent commits
echo "📜 Recent Commits (last 10):"
git log --oneline --graph -10 2>/dev/null || echo "   No commits yet"
echo ""

# Unpushed commits
UNPUSHED=$(git log origin/main..HEAD --oneline 2>/dev/null | wc -l || echo "0")
if [ "$UNPUSHED" -gt 0 ]; then
    echo "⬆️  Unpushed Commits: $UNPUSHED"
    git log origin/main..HEAD --oneline
    echo ""
fi

# Files changed
echo "📁 Files in Repository:"
git ls-files | wc -l | xargs echo "   Total files:"
echo ""

# Repository size
echo "💾 Repository Size:"
du -sh .git 2>/dev/null || echo "   N/A"
echo ""

echo "=============================="
echo "✅ Status check complete!"
