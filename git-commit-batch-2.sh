#!/bin/bash

# Git Commit Batch 2: Backend API Routers
# Commits 8-13: Workspace, Scheduler, Analytics, Credit, Boost, AI Services

set -e

echo "🔌 Batch 2: Backend API Routers (Commits 8-13)"
echo ""

# Commit 8: Workspace Router
echo "8/13: Workspace collaboration router..."
git add packages/api/src/routers/workspace.ts
git commit -m "feat(api): add workspace collaboration router

- Add workspace CRUD operations
- Add member management (invite, remove, update role)
- Add role-based access control (OWNER, ADMIN, MEMBER, VIEWER)
- Add workspace statistics and analytics
- Add ownership transfer functionality
- Add leave workspace endpoint
- Support multi-user collaboration like Notion/Figma

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 8/13 done"
echo ""

# Commit 9: Scheduler Router
echo "9/13: Content scheduler router..."
git add packages/api/src/routers/scheduler.ts
git commit -m "feat(api): add content scheduler router

- Add post scheduling functionality
- Add calendar view data endpoint
- Add scheduled posts management
- Add cancel scheduling endpoint
- Add best time to post recommendations
- Support multi-platform scheduling (TikTok, Instagram, X)
- Integrate with Google Calendar

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 9/13 done"
echo ""

# Commit 10: Analytics Router
echo "10/13: Analytics and insights router..."
git add packages/api/src/routers/analytics.ts
git commit -m "feat(api): add analytics and insights router

- Add workspace overview analytics
- Add content performance tracking
- Add engagement trends analysis
- Add hashtag performance analysis
- Add platform breakdown statistics
- Add top performing posts
- Add competitor benchmarking data structure

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 10/13 done"
echo ""

# Commit 11: Credit System Router
echo "11/13: Credit system router..."
git add packages/api/src/routers/credit.ts
git commit -m "feat(api): add credit system router

- Add credit balance management
- Add transaction history with pagination
- Add credit usage tracking
- Add pricing tiers (Starter, Popular, Pro, Enterprise)
- Add usage statistics by feature
- Add credit purchase flow
- Add check credits endpoint

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 11/13 done"
echo ""

# Commit 12: SMM Boost Router
echo "12/13: SMM Boost service router..."
git add packages/api/src/routers/boost.ts
git commit -m "feat(api): add SMM Boost service router

- Add boost services (views, likes, followers, comments, shares)
- Add order management system
- Add package deals (Starter, Growth, Viral Pack)
- Add order tracking and status updates
- Add boost statistics
- Add cost calculation endpoint
- Support for TikTok boost services

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 12/13 done"
echo ""

# Commit 13: AI Services
echo "13/13: AI services integration..."
git add packages/ai/
git commit -m "feat(ai): add AI services integration

- Add OpenAI integration (GPT-4, DALL-E)
- Add Anthropic Claude integration
- Add Brainstorm Engine for content strategy
- Add Content Generator with multiple variations
- Add TikTok Analyzer with deep profile analysis
- Add FYP optimization strategy generator
- Add 4-phase branding roadmap generator
- Add content idea generation
- Add caption and hashtag generation
- Add voice-over script generation
- Add image generation with DALL-E

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 13/13 done"
echo ""

echo "🎉 Batch 2 completed! (6 commits)"
echo ""
echo "Next: Run 'bash git-commit-batch-3.sh'"
