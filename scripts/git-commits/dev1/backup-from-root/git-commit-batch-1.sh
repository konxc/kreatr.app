#!/bin/bash

# Git Commit Batch 1: Foundation & Documentation
# Commits 1-7: Project setup, docs, database, and basic API

set -e

echo "📦 Batch 1: Foundation & Documentation (Commits 1-7)"
echo ""

# Commit 1: Project Setup & Configuration
echo "1/7: Project setup and configuration..."
git add package.json turbo.json .gitignore docker-compose.yml setup-project.sh LICENSE
git commit -m "feat: initial project setup and configuration

- Add monorepo structure with Turborepo
- Configure package.json with Bun package manager (bun@1.0.0)
- Add Docker Compose for PostgreSQL and Redis
- Add .gitignore with comprehensive rules
- Add MIT License
- Add automated setup script

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 1/7 done"
echo ""

# Commit 2: Documentation
echo "2/7: Add comprehensive documentation..."
git add README.md PROJECT-BLUEPRINT.md SETUP-GUIDE.md QUICK-START.md RUN-PROJECT.md
git add CHANGELOG.md PROJECT-STATUS.md FINAL-STATUS.md
git add docs/ GIT-COMMANDS.md GIT-WORKFLOW.md
git commit -m "docs: add comprehensive project documentation

- Add README with project overview and quick start
- Add PROJECT-BLUEPRINT with 10-week development roadmap
- Add SETUP-GUIDE for step-by-step installation
- Add QUICK-START and RUN-PROJECT guides
- Add complete API documentation (docs/API.md)
- Add CONTRIBUTING guidelines
- Add DEPLOYMENT guide with Vercel instructions
- Add project status tracking documents
- Add Git workflow documentation

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 2/7 done"
echo ""

# Commit 3: Environment Variables Template
echo "3/7: Add environment variables template..."
git add .env.example apps/web/.env.local.example
git commit -m "chore: add environment variables templates

- Add root .env.example for shared backend services
- Add apps/web/.env.local.example for Next.js app
- Include all required API keys and configurations
- Add instructions for generating secrets

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 3/7 done"
echo ""

# Commit 4: Database Schema
echo "4/7: Database schema and Prisma setup..."
git add packages/database/
git commit -m "feat(database): add complete Prisma schema

- Add User and Authentication models (User, Account, Session)
- Add Workspace and Collaboration models (Workspace, WorkspaceMember)
- Add Content Management models (Content, Post, Comment)
- Add Social Media Account models (SocialAccount)
- Add Credit System models (CreditTransaction)
- Configure Prisma client with connection pooling
- Add database package configuration
- Total: 9 tables with proper relations and indexes

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 4/7 done"
echo ""

# Commit 5: API Layer Setup
echo "5/7: API layer with tRPC..."
git add packages/api/src/trpc.ts packages/api/src/context.ts packages/api/src/root.ts packages/api/src/index.ts
git add packages/api/package.json
git commit -m "feat(api): setup tRPC with context and root router

- Configure tRPC with Prisma integration
- Add authentication context with session management
- Setup root router with type safety
- Add protected and public procedures
- Configure API package with dependencies

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 5/7 done"
echo ""

# Commit 6: Authentication Router
echo "6/7: Authentication router..."
git add packages/api/src/routers/auth.ts
git commit -m "feat(api): add authentication router

- Add user registration endpoint with validation
- Add login endpoint with credentials
- Add session management endpoints
- Add user profile endpoints (get, update)
- Add password hashing with bcrypt
- Add input validation with Zod

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 6/7 done"
echo ""

# Commit 7: Content Router
echo "7/7: Content management router..."
git add packages/api/src/routers/content.ts
git commit -m "feat(api): add content management router

- Add CRUD operations for content
- Add AI content generation endpoints
- Add content listing with filters and pagination
- Add content status management (draft, published, scheduled)
- Add content search functionality
- Integrate with AI services for idea generation

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 7/7 done"
echo ""

echo "🎉 Batch 1 completed! (7 commits)"
echo ""
echo "Next: Run 'bash git-commit-batch-2.sh'"
