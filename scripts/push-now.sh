#!/bin/bash

# Quick Push Script - Run Everything at Once
# For ultimate convenience!

set -e

echo "╔════════════════════════════════════════╗"
echo "║   🚀 PUSH NOW - Ultimate Shortcut     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if already committed
if [ -d .git ] && [ "$(git log --oneline 2>/dev/null | wc -l)" -gt 0 ]; then
    echo "⚠️  Git repository already has commits"
    echo ""
    echo "Options:"
    echo "  1. Just push existing commits: bash git-push.sh"
    echo "  2. View status: bash git-status.sh"
    echo "  3. Reset and recommit: git reset --hard HEAD~24 && bash git-commit-all.sh"
    echo ""
    read -p "Just push existing commits? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        bash git-push.sh
        exit 0
    else
        echo "❌ Cancelled"
        exit 1
    fi
fi

# Run everything
echo "🎬 Running complete workflow..."
echo ""

bash git-commit-all.sh

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Ready to push!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

bash git-push.sh

echo ""
echo "╔════════════════════════════════════════╗"
echo "║     🎉 COMPLETE! 🎉                    ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🌐 View your repository:"
echo "   https://github.com/konxc/kreatr.app"
echo ""
