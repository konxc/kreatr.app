#!/bin/bash

# Git Commit Master Script for kreatr.app
# Orchestrates all git operations in sequence
# Run this in WSL: bash git-commit-all.sh

set -e

echo "╔════════════════════════════════════════╗"
echo "║   kreatr.app - Git Commit Master      ║"
echo "║   Automated Git Workflow               ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Make all scripts executable
chmod +x git-setup.sh
chmod +x git-commit-batch-1.sh
chmod +x git-commit-batch-2.sh
chmod +x git-commit-batch-3.sh
chmod +x git-commit-batch-4.sh
chmod +x git-push.sh
chmod +x git-status.sh

echo "✅ All scripts are now executable"
echo ""

# Step 1: Setup
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1/6: Git Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bash git-setup.sh
echo ""

# Step 2: Batch 1 (Foundation)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2/6: Batch 1 - Foundation (7 commits)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bash git-commit-batch-1.sh
echo ""

# Step 3: Batch 2 (Backend API)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3/6: Batch 2 - Backend API (6 commits)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bash git-commit-batch-2.sh
echo ""

# Step 4: Batch 3 (Frontend & CI/CD)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4/6: Batch 3 - Frontend & CI/CD (9 commits)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bash git-commit-batch-3.sh
echo ""

# Step 5: Batch 4 (Git Workflow)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5/6: Batch 4 - Git Workflow (2 commits)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bash git-commit-batch-4.sh
echo ""

# Step 6: Show Status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6/6: Final Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bash git-status.sh
echo ""

# Summary
echo "╔════════════════════════════════════════╗"
echo "║          🎉 ALL DONE! 🎉               ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📊 Summary:"
echo "   ✅ Total commits created: 24"
echo "   ✅ Branch: main"
echo "   ✅ Remote: git@github.com:konxc/kreatr.app.git"
echo "   ✅ Author: sandikodev <androxoss@hotmail.com>"
echo ""
echo "📦 Commit Breakdown:"
echo "   • Batch 1: 7 commits (Foundation)"
echo "   • Batch 2: 6 commits (Backend API)"
echo "   • Batch 3: 9 commits (Frontend & CI/CD)"
echo "   • Batch 4: 2 commits (Git Workflow)"
echo ""
echo "🚀 Next Step:"
echo "   Run: bash git-push.sh"
echo ""
echo "   This will push all 24 commits to GitHub"
echo ""
