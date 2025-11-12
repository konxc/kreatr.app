#!/bin/bash
# Git Commit Batch Script
# Host: dev0
# Created: 2025-11-12T09:53:36.977Z
# Description: Dev0 Infrastructure: Next.js 16 Upgrade, Git Commit Manager, and Vibes Commit Package

set -e  # Exit on error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Git Commit Batch: Dev0 Infrastructure: Next.js 16 Upgrade, Git Commit Manager, and Vibes Commit Package"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Commit counter
COMMIT_COUNT=0

# Function to make commit
commit() {
  local message="$1"
  local files="$2"
  
  echo "📝 Commit $((++COMMIT_COUNT)): $message"
  
  # Check if files exist before adding
  if [ -z "$files" ]; then
    echo "⚠️  Warning: No files specified, skipping..."
    echo ""
    return
  fi
  
  # Add files
  git add $files 2>/dev/null || {
    echo "⚠️  Warning: Some files may not exist, continuing..."
  }
  
  # Check if there are changes to commit
  if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit, skipping..."
    ((COMMIT_COUNT--))
  else
    git commit -m "$message"
    echo "✅ Done"
  fi
  
  echo ""
}

commit "feat(upgrade): upgrade to Next.js 16 with App Router" "apps/web/next.config.mjs apps/web/postcss.config.mjs apps/web/.eslintrc.json apps/web/proxy.ts"
commit "docs(upgrade): add comprehensive Next.js 16 upgrade documentation" "NEXTJS16-MIGRATION-COMPLETE.md NEXTJS16-QUICK-REFERENCE.md UPGRADE-COMPLETE.md UPGRADE-FIXES.md UPGRADE-INDEX.md UPGRADE-QUICKSTART.md UPGRADE-README.md UPGRADE-REPORT.md UPGRADE-SUMMARY.md UPGRADE-TO-NEXTJS16.md UPGRADE-VISUAL-SUMMARY.md upgrade.sh"
commit "feat(scripts): implement git commit script manager with CLI" "scripts/git-commits/dev1/backup-from-root/ scripts/git-commits/dev2/"
commit "docs(git): add comprehensive git commit manager documentation" "docs/GIT-COMMIT-MANAGER.md docs/CONTRIBUTING-GIT-COMMIT-MANAGER.md docs/QUICK-REFERENCE-GIT-COMMIT-MANAGER.md docs/ROADMAP-GIT-COMMIT-MANAGER.md"
commit "feat(vibes-commit): create vibes-commit package structure" "packages/vibes-commit/"
commit "feat(ui): add UI package structure" "packages/ui/package.json packages/ui/tsconfig.json packages/ui/.eslintrc.js packages/ui/README.md packages/ui/src/"
commit "feat(config): add vibes configuration" ".vibes/"
commit "chore(github): add upgrade checklist" ".github/UPGRADE-CHECKLIST.md"
commit "chore(deps): update bun.lock" "bun.lock"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Batch completed! ($COMMIT_COUNT commits)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
