#!/bin/bash

# Git Setup Script for kreatr.app
# Configures git and initializes repository

set -e

echo "🔧 Setting up Git for kreatr.app..."
echo ""

# Configure git user
git config user.name "sandikodev"
git config user.email "androxoss@hotmail.com"
echo "✅ Git user configured: sandikodev <androxoss@hotmail.com>"

# Initialize git if needed
if [ ! -d .git ]; then
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Switch to main branch
git checkout -b main 2>/dev/null || git checkout main
echo "✅ On main branch"

# Add remote if not exists
if ! git remote | grep -q origin; then
    git remote add origin git@github.com:konxc/kreatr.app.git
    echo "✅ Remote 'origin' added: git@github.com:konxc/kreatr.app.git"
else
    echo "✅ Remote 'origin' already exists"
    git remote -v
fi

echo ""
echo "🎉 Git setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run: bash git-commit-batch-1.sh"
echo "  2. Run: bash git-commit-batch-2.sh"
echo "  3. Run: bash git-commit-batch-3.sh"
echo "  4. Run: bash git-commit-batch-4.sh"
echo "  5. Run: bash git-push.sh"
echo ""
echo "Or run all at once:"
echo "  bash git-commit-all.sh"
