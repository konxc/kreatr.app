#!/bin/bash

# Git Commit Batch 3: Integrations & Frontend
# Commits 14-21: Social media APIs, Auth, UI, and CI/CD

set -e

echo "🔗 Batch 3: Integrations & Frontend (Commits 14-21)"
echo ""

# Commit 14: Social Media Integrations
echo "14/21: Social media integrations..."
git add packages/integrations/
git commit -m "feat(integrations): add social media API integrations

- Add TikTok API integration (OAuth, upload, analytics)
- Add Instagram Graph API integration
- Add Twitter/X API v2 integration
- Add Google Calendar API integration
- Add type definitions for all platforms
- Add error handling and rate limiting
- Support for media upload and posting
- Support for analytics and insights

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 14/21 done"
echo ""

# Commit 15: NextAuth Setup
echo "15/21: NextAuth authentication setup..."
git add apps/web/app/api/auth/ apps/web/types/next-auth.d.ts
git commit -m "feat(auth): setup NextAuth with multiple providers

- Configure NextAuth with Prisma adapter
- Add Credentials provider (email/password)
- Add Google OAuth provider with Calendar scope
- Add welcome bonus (50 credits for new users)
- Add auto-create default workspace
- Add custom JWT and session callbacks
- Add type definitions for NextAuth

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 15/21 done"
echo ""

# Commit 16: Auth UI Components
echo "16/21: Authentication UI components..."
git add apps/web/components/auth/ apps/web/components/ui/ apps/web/components/providers/
git add apps/web/lib/utils.ts
git commit -m "feat(ui): add authentication UI components

- Add LoginForm component with email/password and Google OAuth
- Add RegisterForm component with validation
- Add Button, Input, Label, Checkbox components (Shadcn UI)
- Add SessionProvider for client-side session
- Add utility functions (cn for className merging)
- Add error handling and loading states

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 16/21 done"
echo ""

# Commit 17: Auth Pages
echo "17/21: Authentication pages..."
git add "apps/web/app/(auth)/"
git commit -m "feat(pages): add authentication pages

- Add login page with split layout design
- Add register page with benefits showcase
- Add responsive design for mobile and desktop
- Add feature highlights and testimonials
- Add branding section with value propositions
- Add statistics display (1000+ creators, 50K+ content)

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 17/21 done"
echo ""

# Commit 18: Middleware & Protection
echo "18/21: Route protection middleware..."
git add apps/web/middleware.ts
git commit -m "feat(auth): add route protection middleware

- Add protected routes for dashboard, workspace, content, settings
- Add redirect logic for authenticated users
- Add redirect to login for unauthenticated users
- Preserve redirect URL after login
- Add middleware configuration

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 18/21 done"
echo ""

# Commit 19: Landing Page
echo "19/21: Landing page..."
git add apps/web/app/page.tsx kreatr-landing-page.md
git commit -m "feat(pages): add complete landing page

- Add hero section with compelling headline and CTA
- Add problem section highlighting 4 pain points
- Add solution section introducing kreatr.app
- Add features section with 6 key features
- Add pricing section with 3 tiers (Free, Boost, Pro)
- Add testimonials section with user quotes
- Add final CTA section
- Add footer with links and information
- Fully responsive design

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 19/21 done"
echo ""

# Commit 20: App Layout & Styling
echo "20/21: App layout and global styling..."
git add apps/web/app/layout.tsx apps/web/app/globals.css
git add apps/web/tailwind.config.ts apps/web/postcss.config.js apps/web/components.json
git commit -m "feat(ui): add app layout and global styling

- Add root layout with SessionProvider
- Add global CSS with Tailwind configuration
- Configure Tailwind with custom colors (Purple + Orange)
- Add dark mode support with CSS variables
- Add PostCSS configuration
- Add Shadcn UI configuration
- Add custom animations and transitions

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 20/21 done"
echo ""

# Commit 21: Next.js Configuration
echo "21/21: Next.js configuration..."
git add apps/web/next.config.js apps/web/tsconfig.json apps/web/package.json
git commit -m "feat(config): add Next.js configuration

- Configure Next.js with monorepo support
- Add TypeScript configuration with path aliases
- Add package dependencies (NextAuth, tRPC, Prisma, etc.)
- Add image optimization domains
- Add security headers
- Add environment variables configuration
- Add transpilePackages for monorepo

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 21/21 done"
echo ""

# Commit 22: CI/CD Pipeline
echo "22/21: CI/CD pipeline (bonus)..."
git add .github/
git commit -m "ci: add CI/CD pipeline with GitHub Actions

- Add continuous integration workflow
- Add deployment workflow to Vercel
- Add automated testing (lint, type-check, tests)
- Add database migration on deploy
- Add Slack notifications for deployment status
- Configure test environment with PostgreSQL

Co-authored-by: sandikodev <androxoss@hotmail.com>"
echo "✅ Commit 22/21 done"
echo ""

echo "🎉 Batch 3 completed! (9 commits)"
echo ""
echo "📊 Total commits: 22"
echo ""
echo "Next: Run 'bash git-push.sh' to push to GitHub"
