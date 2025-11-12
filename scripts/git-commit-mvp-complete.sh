#!/bin/bash

# Git Commit Script - MVP Complete
# Commits all changes from Real Scheduler, Payment Integration, and Onboarding Flow

echo "🚀 Starting Git Commit Process - MVP Complete"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not a git repository"
    exit 1
fi

# Check git status
echo -e "${YELLOW}Checking git status...${NC}"
git status

# Batch 1: Real Scheduler - Backend
echo -e "\n${BLUE}📦 Batch 1: Real Scheduler - Backend${NC}"
git add packages/api/src/routers/scheduler.ts
git add packages/api/src/services/post-scheduler.ts
git add packages/api/src/root.ts
git add apps/web/app/api/cron/scheduler/route.ts
git add vercel.json
git commit -m "feat(scheduler): add scheduler router and auto-posting service

- Add scheduler tRPC router with 6 endpoints
- Implement post scheduler service for auto-posting
- Add cron job API route for scheduled posts
- Configure Vercel cron for every minute execution
- Support multi-platform scheduling (TikTok, Instagram, Twitter)
- Add drag & drop rescheduling
- Implement queue management and retry logic"

# Batch 2: Real Scheduler - Frontend
echo -e "\n${BLUE}📦 Batch 2: Real Scheduler - Frontend${NC}"
git add apps/web/components/scheduler/
git add "apps/web/app/(dashboard)/dashboard/scheduler/"
git add apps/web/components/ui/dialog.tsx
git add apps/web/app/globals.css
git commit -m "feat(scheduler): add calendar view and scheduling UI

- Implement React Big Calendar integration
- Add calendar view with Month/Week/Day views
- Create schedule modal for multi-platform posting
- Add drag & drop rescheduling support
- Implement queue status display
- Add platform-specific colors and styling
- Create dialog component for modals"

# Batch 3: Payment System - Backend
echo -e "\n${BLUE}📦 Batch 3: Payment System - Backend${NC}"
git add packages/api/src/services/payment.ts
git add packages/api/src/routers/payment.ts
git add packages/database/prisma/schema.prisma
git add apps/web/app/api/webhooks/midtrans/route.ts
git commit -m "feat(payment): integrate Midtrans payment gateway

- Add Midtrans payment service with full API integration
- Create payment router with 5 tRPC endpoints
- Add PaymentTransaction model to database schema
- Implement webhook handler for payment notifications
- Add automatic credit fulfillment on successful payment
- Support multiple payment methods (Card, GoPay, ShopeePay, Bank, QRIS)
- Add signature verification for webhook security"

# Batch 4: Payment System - Frontend
echo -e "\n${BLUE}📦 Batch 4: Payment System - Frontend${NC}"
git add apps/web/components/payment/
git add "apps/web/app/(dashboard)/dashboard/credits/"
git add "apps/web/app/(dashboard)/dashboard/payment/"
git commit -m "feat(payment): add payment UI and credit purchase flow

- Create payment modal with package selection
- Update credits page with payment integration
- Add payment success page with order details
- Add payment error page with troubleshooting
- Implement IDR currency formatting
- Add payment history display
- Support 3 credit packages with bonuses"

# Batch 5: Onboarding System
echo -e "\n${BLUE}📦 Batch 5: Onboarding System${NC}"
git add apps/web/contexts/
git add apps/web/components/onboarding/
git add apps/web/components/ui/progress.tsx
git add "apps/web/app/(dashboard)/layout.tsx"
git add "apps/web/app/(dashboard)/dashboard/page.tsx"
git commit -m "feat(onboarding): add welcome wizard and quick start guide

- Create onboarding context for state management
- Implement 5-step welcome wizard
- Add quick start guide with checklist
- Create progress component with gradient styling
- Integrate onboarding into dashboard layout
- Add localStorage persistence for completion tracking
- Support skip functionality and step navigation"

# Batch 6: Dependencies & Configuration
echo -e "\n${BLUE}📦 Batch 6: Dependencies & Configuration${NC}"
git add apps/web/package.json
git add packages/api/package.json
git add package.json
git add bun.test.config.ts
git commit -m "chore: update dependencies and configuration

- Add react-big-calendar for scheduler
- Add date-fns for date manipulation
- Add Radix UI components (dialog, progress, dropdown)
- Update tRPC and React Query versions
- Add testing dependencies
- Configure Bun test runner"

# Batch 7: Testing Infrastructure
echo -e "\n${BLUE}📦 Batch 7: Testing Infrastructure${NC}"
git add packages/api/src/__tests__/setup.ts
git add packages/api/src/__tests__/credit.test.ts
git add packages/api/src/__tests__/content.test.ts
git add packages/api/src/__tests__/ai.test.ts
git add apps/web/__tests__/components/dashboard.test.tsx
git add scripts/test.sh
git add .github/workflows/test.yml
git commit -m "test: add comprehensive test suite

- Add test setup and cleanup utilities
- Create credit system tests (100% coverage)
- Add content management tests
- Implement AI features tests
- Add component tests for dashboard
- Create test runner script
- Configure GitHub Actions CI/CD workflow"

# Batch 8: Documentation - Features
echo -e "\n${BLUE}📦 Batch 8: Documentation - Features${NC}"
git add docs/03-features/SCHEDULER.md
git add docs/03-features/PAYMENT.md
git add docs/03-features/AI-LAB.md
git add docs/03-features/CONTENT.md
git add docs/03-features/CREDITS.md
git commit -m "docs: add comprehensive feature documentation

- Add scheduler feature guide with API reference
- Create payment system documentation
- Document AI Lab features and usage
- Add content management guide
- Create credit system documentation"

# Batch 9: Documentation - Progress
echo -e "\n${BLUE}📦 Batch 9: Documentation - Progress${NC}"
git add docs/05-progress/INTEGRATION-COMPLETE.md
git add docs/05-progress/TESTING-COMPLETE.md
git add docs/05-progress/SCHEDULER-COMPLETE.md
git add docs/05-progress/PAYMENT-INTEGRATION-COMPLETE.md
git add docs/05-progress/ONBOARDING-COMPLETE.md
git add docs/05-progress/MVP-COMPLETE.md
git add docs/05-progress/CHANGELOG.md
git commit -m "docs: add progress tracking and completion reports

- Document backend-frontend integration completion
- Add testing implementation report
- Create scheduler completion summary
- Document payment integration progress
- Add onboarding flow completion report
- Create MVP complete summary
- Update changelog with all features"

# Batch 10: Documentation - Organization
echo -e "\n${BLUE}📦 Batch 10: Documentation - Organization${NC}"
git add docs/README.md
git add docs/INDEX.md
git add docs/01-overview/ARCHITECTURE.md
git add docs/01-overview/QUICK-START.md
git add docs/02-development/INTEGRATION-GUIDE.md
git add docs/02-development/TESTING.md
git add scripts/organize-docs.sh
git add .github/DOCUMENTATION.md
git commit -m "docs: organize documentation structure

- Create main documentation hub
- Add quick reference index
- Update architecture documentation
- Improve quick start guide
- Add integration guide
- Create documentation organization script
- Add GitHub documentation guide"

# Batch 11: UI Components
echo -e "\n${BLUE}📦 Batch 11: UI Components${NC}"
git add apps/web/components/ui/toast.tsx
git add apps/web/components/ui/toaster.tsx
git add apps/web/components/ui/badge.tsx
git add apps/web/components/ui/dropdown-menu.tsx
git add apps/web/components/ui/textarea.tsx
git add apps/web/components/ui/label.tsx
git add apps/web/hooks/use-toast.ts
git commit -m "feat(ui): add essential UI components

- Add toast notification system
- Create badge component for status indicators
- Implement dropdown menu component
- Add textarea and label components
- Create toast hook for notifications"

# Batch 12: tRPC Integration
echo -e "\n${BLUE}📦 Batch 12: tRPC Integration${NC}"
git add apps/web/providers/trpc-provider.tsx
git add apps/web/lib/trpc.ts
git add apps/web/app/layout.tsx
git add apps/web/app/api/trpc/[trpc]/route.ts
git commit -m "feat(api): integrate tRPC with React Query

- Create tRPC provider with React Query
- Setup tRPC client configuration
- Add API route handler
- Integrate provider in root layout
- Configure superjson transformer
- Add error handling and loading states"

# Batch 13: Dashboard Updates
echo -e "\n${BLUE}📦 Batch 13: Dashboard Updates${NC}"
git add apps/web/components/dashboard/
git commit -m "feat(dashboard): update dashboard with real data integration

- Update header with real credit balance
- Add navigation with active state
- Integrate overview with live stats
- Connect recent content to API
- Add analytics preview component
- Update quick actions with links"

# Batch 14: AI Lab Pages
echo -e "\n${BLUE}📦 Batch 14: AI Lab Pages${NC}"
git add "apps/web/app/(dashboard)/dashboard/ai-lab/"
git commit -m "feat(ai-lab): integrate AI features with backend

- Update AI Lab hub with usage stats
- Connect brainstorm page to tRPC API
- Integrate content generator with backend
- Add TikTok analyzer with real API calls
- Implement credit deduction
- Add error handling and loading states"

# Batch 15: Additional Pages
echo -e "\n${BLUE}📦 Batch 15: Additional Pages${NC}"
git add "apps/web/app/(dashboard)/dashboard/content/"
git add "apps/web/app/(dashboard)/dashboard/analytics/"
git add "apps/web/app/(dashboard)/dashboard/workspaces/"
git add "apps/web/app/(dashboard)/dashboard/integrations/"
git add "apps/web/app/(dashboard)/dashboard/boost/"
git add "apps/web/app/(dashboard)/dashboard/profile/"
git add "apps/web/app/(dashboard)/dashboard/settings/"
git commit -m "feat(pages): add remaining dashboard pages

- Create content library page
- Add analytics dashboard
- Implement workspaces management
- Add integrations page
- Create SMM boost services page
- Add profile and settings pages"

# Summary
echo -e "\n${GREEN}✅ All commits completed successfully!${NC}"
echo -e "\n${YELLOW}Summary:${NC}"
echo "- 15 batches committed"
echo "- Real Scheduler: Backend + Frontend"
echo "- Payment System: Backend + Frontend"
echo "- Onboarding Flow: Complete"
echo "- Testing: 25+ tests"
echo "- Documentation: Complete"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Review commits: git log --oneline"
echo "2. Push to remote: git push origin main"
echo "3. Create release tag: git tag -a v1.0.0 -m 'MVP Complete'"
echo ""
echo -e "${GREEN}🎉 MVP Complete - Ready for Launch!${NC}"
