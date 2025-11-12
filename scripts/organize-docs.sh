#!/bin/bash

echo "📚 Organizing kreatr.app Documentation"
echo "======================================"

# Create directory structure
mkdir -p docs/01-overview
mkdir -p docs/02-development
mkdir -p docs/03-features
mkdir -p docs/04-deployment
mkdir -p docs/05-progress
mkdir -p docs/06-contributing

# Move overview documents
echo "Moving overview documents..."
[ -f PROJECT-BLUEPRINT.md ] && mv PROJECT-BLUEPRINT.md docs/01-overview/PROJECT-OVERVIEW.md
[ -f SETUP-GUIDE.md ] && mv SETUP-GUIDE.md docs/01-overview/SETUP-GUIDE.md
[ -f QUICK-START.md ] && mv QUICK-START.md docs/01-overview/QUICK-START.md
[ -f RUN-PROJECT.md ] && mv RUN-PROJECT.md docs/01-overview/RUN-PROJECT.md

# Move development documents
echo "Moving development documents..."
[ -f docs/INTEGRATION-GUIDE.md ] && mv docs/INTEGRATION-GUIDE.md docs/02-development/INTEGRATION-GUIDE.md
[ -f docs/TESTING.md ] && mv docs/TESTING.md docs/02-development/TESTING.md
[ -f docs/API.md ] && mv docs/API.md docs/02-development/API.md

# Move progress tracking documents
echo "Moving progress documents..."
[ -f INTEGRATION-COMPLETE.md ] && mv INTEGRATION-COMPLETE.md docs/05-progress/INTEGRATION-COMPLETE.md
[ -f TESTING-COMPLETE.md ] && mv TESTING-COMPLETE.md docs/05-progress/TESTING-COMPLETE.md
[ -f PROJECT-STATUS.md ] && mv PROJECT-STATUS.md docs/05-progress/PROJECT-STATUS.md
[ -f FINAL-STATUS.md ] && mv FINAL-STATUS.md docs/05-progress/FINAL-STATUS.md
[ -f CHANGELOG.md ] && mv CHANGELOG.md docs/05-progress/CHANGELOG-OLD.md

# Move git workflow documents
echo "Moving git workflow documents..."
[ -f GIT-WORKFLOW.md ] && mv GIT-WORKFLOW.md docs/06-contributing/GIT-WORKFLOW.md
[ -f GIT-README.md ] && mv GIT-README.md docs/06-contributing/GIT-README.md
[ -f GIT-COMMANDS.md ] && mv GIT-COMMANDS.md docs/06-contributing/GIT-COMMANDS.md
[ -f GIT-SCRIPTS-INDEX.md ] && mv GIT-SCRIPTS-INDEX.md docs/06-contributing/GIT-SCRIPTS-INDEX.md
[ -f GIT-FINAL-SUMMARY.md ] && mv GIT-FINAL-SUMMARY.md docs/06-contributing/GIT-FINAL-SUMMARY.md

# Move deployment documents
echo "Moving deployment documents..."
[ -f COMMIT-NOW.md ] && mv COMMIT-NOW.md docs/04-deployment/COMMIT-NOW.md
[ -f PUSH-NOW.sh ] && mv PUSH-NOW.sh scripts/push-now.sh

# Move landing page content
echo "Moving feature documents..."
[ -f kreatr-landing-page.md ] && mv kreatr-landing-page.md docs/03-features/LANDING-PAGE.md

echo ""
echo "✅ Documentation organized!"
echo ""
echo "New structure:"
echo "docs/"
echo "├── README.md (Main index)"
echo "├── 01-overview/ (Project overview & setup)"
echo "├── 02-development/ (Development guides)"
echo "├── 03-features/ (Feature documentation)"
echo "├── 04-deployment/ (Deployment guides)"
echo "├── 05-progress/ (Progress tracking)"
echo "└── 06-contributing/ (Contributing guides)"
echo ""
echo "📖 Start reading: docs/README.md"
