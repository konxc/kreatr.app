#!/bin/bash

# Make all git scripts executable

echo "🔧 Making Git Scripts Executable"
echo "================================="

chmod +x COMMIT-NOW.sh
chmod +x scripts/git-status-check.sh
chmod +x scripts/git-commit-mvp-complete.sh
chmod +x scripts/git-push-mvp.sh
chmod +x scripts/organize-docs.sh
chmod +x scripts/test.sh

echo "✅ All scripts are now executable!"
echo ""
echo "Available commands:"
echo "  ./COMMIT-NOW.sh                        - Master script (commit + push)"
echo "  ./scripts/git-status-check.sh         - Check git status"
echo "  ./scripts/git-commit-mvp-complete.sh  - Commit all changes"
echo "  ./scripts/git-push-mvp.sh             - Push to remote"
echo ""
echo "🚀 Ready to commit? Run: ./COMMIT-NOW.sh"
