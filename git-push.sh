#!/bin/bash

# Git Push Script for kreatr.app
# Pushes all commits to GitHub

set -e

echo "🚀 Pushing to GitHub..."
echo ""

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: Not on main branch (current: $CURRENT_BRANCH)"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Push cancelled"
        exit 1
    fi
fi

# Check if remote exists
if ! git remote | grep -q origin; then
    echo "❌ Error: Remote 'origin' not found"
    echo "Run: git remote add origin git@github.com:konxc/kreatr.app.git"
    exit 1
fi

# Show what will be pushed
echo "📊 Commits to be pushed:"
git log --oneline origin/main..HEAD 2>/dev/null || git log --oneline -10
echo ""

# Confirm push
read -p "Push to origin/main? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Push cancelled"
    exit 1
fi

# Push to GitHub
echo ""
echo "⬆️  Pushing to git@github.com:konxc/kreatr.app.git..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "🌐 View your repository:"
echo "   https://github.com/konxc/kreatr.app"
echo ""
echo "📊 View commits:"
echo "   https://github.com/konxc/kreatr.app/commits/main"
echo ""
echo "🎉 All done!"
