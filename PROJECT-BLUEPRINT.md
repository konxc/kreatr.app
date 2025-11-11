# kreatr.app - Project Blueprint
## AI-Powered Social Media Lab

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Development Phases](#development-phases)
3. [Tech Stack Architecture](#tech-stack-architecture)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Integration Plan](#api-integration-plan)
7. [Feature Roadmap](#feature-roadmap)
8. [Deployment Strategy](#deployment-strategy)

---

## 🎯 Project Overview

**kreatr.app** (Creator AI Laboratory) adalah platform SaaS yang memberdayakan kreator konten, marketer, dan UMKM untuk membangun personal branding berbasis AI dan data.

### Core Value Proposition
- 🧪 **AI Lab** - Ruang eksperimen kreatif untuk ide konten
- 🤖 **AI Generator** - Menghasilkan teks, gambar, video, dan suara
- 📅 **Smart Scheduler** - Auto-posting ke TikTok, Instagram, X
- 🤝 **Collaboration** - Multi-user workspace seperti Notion
- ⚡ **Credit System** - Token internal untuk akses AI resources

### Target Users
- Content creators (influencer, vlogger, educator)
- UMKM & small brands
- Marketing agencies & freelancers
- Creator communities

---

## 🚀 Development Phases

### Phase 1: Foundation (Week 1-2)
**Goal:** Setup project infrastructure & core architecture

**Deliverables:**
- ✅ Project structure & monorepo setup
- ✅ Database schema & Prisma models
- ✅ Authentication system (NextAuth + OAuth)
- ✅ Basic UI components (Shadcn UI)
- ✅ Landing page MVP

**Success Metrics:**
- Project runs locally without errors
- User can sign up/login
- Database migrations work

---

### Phase 2: AI Integration (Week 3-4)
**Goal:** Integrate AI services for content generation

**Deliverables:**
- ✅ OpenAI API integration (GPT-4 for text)
- ✅ AI Brainstorm Engine (TikTok profile analysis)
- ✅ Content idea generator
- ✅ Caption & hashtag generator
- ✅ Credit system implementation

**Success Metrics:**
- User can generate 10 content ideas
- AI generates caption in <5 seconds
- Credit deduction works correctly

---

### Phase 3: Social Media Integration (Week 5-6)
**Goal:** Connect to TikTok, Instagram, X APIs

**Deliverables:**
- ✅ TikTok OAuth & API integration
- ✅ Instagram Graph API integration
- ✅ X (Twitter) API v2 integration
- ✅ Google Calendar sync
- ✅ Content scheduler UI

**Success Metrics:**
- User can connect social accounts
- Schedule posts for future dates
- View scheduled content in calendar

---

### Phase 4: Collaboration & Dashboard (Week 7-8)
**Goal:** Build workspace and analytics dashboard

**Deliverables:**
- ✅ Multi-user workspace
- ✅ Role-based access control
- ✅ Comment & approval system
- ✅ Analytics dashboard
- ✅ Performance insights

**Success Metrics:**
- 2+ users can collaborate in workspace
- Dashboard shows real-time metrics
- Approval workflow functions

---

### Phase 5: MVP Launch (Week 9-10)
**Goal:** Polish, test, and launch to early users

**Deliverables:**
- ✅ Bug fixes & performance optimization
- ✅ Onboarding flow
- ✅ Documentation & help center
- ✅ Payment integration (Midtrans/Xendit)
- ✅ Beta user testing

**Success Metrics:**
- 50+ beta users signed up
- <2 second page load time
- 95%+ uptime

---

## 🏗️ Tech Stack Architecture

### Frontend
```
Next.js 14 (App Router)
├── TailwindCSS (Styling)
├── Shadcn UI (Component Library)
├── Framer Motion (Animations)
├── React Query (Data Fetching)
└── Zustand (State Management)
```

### Backend
```
Bun Runtime
├── tRPC (Type-safe API)
├── Prisma (ORM)
├── Zod (Validation)
└── NextAuth (Authentication)
```

### Database
```
PostgreSQL (Primary)
├── Prisma Schema
├── Migrations
└── Turso (Edge-friendly alternative)
```

### AI Services
```
OpenAI (GPT-4, DALL-E)
├── Anthropic Claude (Alternative)
├── HuggingFace Hub (Open models)
└── Z.ai (Custom models)
```

### Infrastructure
```
Vercel (Frontend Hosting)
├── Docker (Containerization)
├── GitHub Actions (CI/CD)
└── Upstash Redis (Caching)
```

---

## 📁 Project Structure

```
kreatr-app/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── workspace/
│   │   │   │   ├── content/
│   │   │   │   ├── scheduler/
│   │   │   │   ├── analytics/
│   │   │   │   └── settings/
│   │   │   ├── (marketing)/
│   │   │   │   ├── page.tsx    # Landing page
│   │   │   │   ├── pricing/
│   │   │   │   └── about/
│   │   │   └── api/
│   │   │       ├── auth/
│   │   │       ├── trpc/
│   │   │       └── webhooks/
│   │   ├── components/
│   │   │   ├── ui/             # Shadcn components
│   │   │   ├── layout/
│   │   │   ├── features/
│   │   │   └── shared/
│   │   ├── lib/
│   │   │   ├── utils.ts
│   │   │   ├── api.ts
│   │   │   └── constants.ts
│   │   └── styles/
│   │       └── globals.css
│   │
│   └── api/                    # Standalone API (optional)
│       └── src/
│           ├── routes/
│           ├── services/
│           └── middleware/
│
├── packages/
│   ├── database/               # Prisma schema & migrations
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   │       └── client.ts
│   │
│   ├── api/                    # tRPC routers
│   │   └── src/
│   │       ├── routers/
│   │       │   ├── auth.ts
│   │       │   ├── content.ts
│   │       │   ├── workspace.ts
│   │       │   ├── scheduler.ts
│   │       │   └── analytics.ts
│   │       ├── context.ts
│   │       └── root.ts
│   │
│   ├── ai/                     # AI integration services
│   │   └── src/
│   │       ├── openai.ts
│   │       ├── claude.ts
│   │       ├── huggingface.ts
│   │       └── brainstorm.ts
│   │
│   ├── integrations/           # Social media APIs
│   │   └── src/
│   │       ├── tiktok.ts
│   │       ├── instagram.ts
│   │       ├── twitter.ts
│   │       └── google-calendar.ts
│   │
│   └── ui/                     # Shared UI components
│       └── src/
│           └── components/
│
├── docs/                       # Documentation
│   ├── API.md
│   ├── CONTRIBUTING.md
│   └── DEPLOYMENT.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml
├── turbo.json
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

### Core Tables

```prisma
// User & Authentication
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  workspaces    WorkspaceMember[]
  contents      Content[]
  credits       CreditTransaction[]
  
  // Settings
  onboardingCompleted Boolean @default(false)
  plan          Plan      @default(FREE)
}

// Workspace (Collaboration)
model Workspace {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  image       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  members     WorkspaceMember[]
  contents    Content[]
  socialAccounts SocialAccount[]
}

model WorkspaceMember {
  id          String   @id @default(cuid())
  role        Role     @default(MEMBER)
  joinedAt    DateTime @default(now())
  
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  
  @@unique([userId, workspaceId])
}

// Content Management
model Content {
  id          String   @id @default(cuid())
  title       String
  caption     String?
  hashtags    String[]
  mediaUrls   String[]
  status      ContentStatus @default(DRAFT)
  scheduledAt DateTime?
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // AI Generated
  aiGenerated Boolean  @default(false)
  aiPrompt    String?
  
  // Relations
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  
  posts       Post[]
  comments    Comment[]
}

// Social Media Posts
model Post {
  id          String   @id @default(cuid())
  platform    Platform
  platformId  String?  // ID from social platform
  url         String?
  status      PostStatus @default(SCHEDULED)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  
  // Analytics
  views       Int      @default(0)
  likes       Int      @default(0)
  comments    Int      @default(0)
  shares      Int      @default(0)
  
  contentId   String
  content     Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  accountId   String
  account     SocialAccount @relation(fields: [accountId], references: [id])
}

// Social Media Accounts
model SocialAccount {
  id          String   @id @default(cuid())
  platform    Platform
  platformId  String
  username    String
  accessToken String   @db.Text
  refreshToken String? @db.Text
  expiresAt   DateTime?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  
  posts       Post[]
  
  @@unique([workspaceId, platform, platformId])
}

// Credit System
model CreditTransaction {
  id          String   @id @default(cuid())
  amount      Int
  type        CreditType
  description String
  balance     Int      // Balance after transaction
  createdAt   DateTime @default(now())
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}

// Comments & Collaboration
model Comment {
  id          String   @id @default(cuid())
  text        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  
  contentId   String
  content     Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)
}

// Enums
enum Plan {
  FREE
  BOOST
  PRO
}

enum Role {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

enum ContentStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  SCHEDULED
  PUBLISHED
  FAILED
}

enum PostStatus {
  SCHEDULED
  PUBLISHING
  PUBLISHED
  FAILED
}

enum Platform {
  TIKTOK
  INSTAGRAM
  TWITTER
}

enum CreditType {
  PURCHASE
  REWARD
  USAGE
  REFUND
}
```

---

## 🔌 API Integration Plan

### 1. TikTok API Integration

**Endpoints Needed:**
- User profile data
- Video upload
- Analytics data

**Implementation:**
```typescript
// packages/integrations/src/tiktok.ts
export class TikTokAPI {
  async getUserProfile(accessToken: string) {
    // Fetch user data
  }
  
  async uploadVideo(accessToken: string, video: File, caption: string) {
    // Upload video to TikTok
  }
  
  async getAnalytics(accessToken: string, videoId: string) {
    // Fetch video analytics
  }
}
```

**OAuth Flow:**
```
1. User clicks "Connect TikTok"
2. Redirect to TikTok OAuth
3. TikTok redirects back with code
4. Exchange code for access token
5. Store token in database
```

---

### 2. Instagram Graph API

**Endpoints Needed:**
- Media publishing
- Insights data
- User profile

**Implementation:**
```typescript
// packages/integrations/src/instagram.ts
export class InstagramAPI {
  async publishPost(accessToken: string, imageUrl: string, caption: string) {
    // Create media container
    // Publish media
  }
  
  async getInsights(accessToken: string, mediaId: string) {
    // Fetch post insights
  }
}
```

---

### 3. X (Twitter) API v2

**Endpoints Needed:**
- Tweet creation
- Media upload
- Analytics

**Implementation:**
```typescript
// packages/integrations/src/twitter.ts
export class TwitterAPI {
  async createTweet(accessToken: string, text: string, mediaIds?: string[]) {
    // Post tweet
  }
  
  async uploadMedia(accessToken: string, media: File) {
    // Upload media
  }
}
```

---

### 4. Google Calendar Integration

**Purpose:** Sync scheduled content to user's calendar

**Implementation:**
```typescript
// packages/integrations/src/google-calendar.ts
export class GoogleCalendarAPI {
  async createEvent(accessToken: string, event: CalendarEvent) {
    // Create calendar event for scheduled post
  }
  
  async updateEvent(accessToken: string, eventId: string, updates: Partial<CalendarEvent>) {
    // Update event when schedule changes
  }
}
```

---

## 🎨 Feature Roadmap

### MVP Features (Phase 1-5)

**✅ Must Have**
- User authentication (email + OAuth)
- AI content idea generator
- Caption & hashtag generator
- Content calendar view
- Schedule posts to TikTok
- Basic analytics dashboard
- Credit system
- Single workspace

**🎯 Should Have**
- Instagram & X integration
- Multi-user collaboration
- Comment & approval flow
- Google Calendar sync
- Advanced analytics
- Mobile responsive design

**💡 Nice to Have**
- AI image generation (DALL-E)
- AI voice-over generation
- Video editing tools
- Template library
- Community features

---

### Post-MVP Features (Phase 6+)

**Q1 2026**
- AI video generation
- Competitor analysis
- Trend discovery engine
- White-label reporting
- API access for developers

**Q2 2026**
- Mobile app (React Native)
- Browser extension
- Zapier integration
- Advanced collaboration (like Figma)
- Marketplace for templates

---

## 🚀 Deployment Strategy

### Development Environment
```bash
# Local development
bun install
bun run dev

# Database
docker-compose up -d postgres
bunx prisma migrate dev
bunx prisma studio
```

### Staging Environment
```
Platform: Vercel Preview
Database: Supabase (staging)
Domain: staging.kreatr.app
```

### Production Environment
```
Platform: Vercel Production
Database: Supabase (production) or Railway
CDN: Cloudflare
Domain: kreatr.app
```

### CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test
      - run: bun run lint
      - run: bun run type-check

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📊 Success Metrics

### Technical Metrics
- Page load time: <2 seconds
- API response time: <500ms
- Uptime: 99.9%
- Test coverage: >80%

### Business Metrics
- User signups: 1000+ in first month
- Active users: 30% retention after 7 days
- Content generated: 10,000+ pieces
- Revenue: $5,000 MRR by month 3

---

## 🎯 Next Steps

1. **Week 1:** Setup project structure & database
2. **Week 2:** Build authentication & landing page
3. **Week 3:** Integrate OpenAI for content generation
4. **Week 4:** Build content calendar & scheduler UI
5. **Week 5:** Integrate TikTok API
6. **Week 6:** Add Instagram & X integration
7. **Week 7:** Build collaboration features
8. **Week 8:** Create analytics dashboard
9. **Week 9:** Testing & bug fixes
10. **Week 10:** Beta launch 🚀

---

**Ready to start building? Let's create the project structure next!**
