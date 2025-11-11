#!/bin/bash
# Git Commit Batch Script
# Host: {{HOST}}
# Created: {{TIMESTAMP}}
# Description: {{DESCRIPTION}}

set -e  # Exit on error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Git Commit Batch: {{DESCRIPTION}}"
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

# {{COMMITS_PLACEHOLDER}}
# Example commits (replace with actual commits):
# commit "feat: add user authentication" "apps/web/src/auth/*"
# commit "docs: update README" "README.md"
# commit "fix: resolve login issue" "apps/web/src/components/Login.tsx"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Batch completed! ($COMMIT_COUNT commits)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
