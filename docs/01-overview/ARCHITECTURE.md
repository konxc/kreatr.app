# Architecture Overview

Understanding kreatr.app's system architecture.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Browser                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js 14 (App Router)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages      │  │  Components  │  │   Providers  │  │
│  │  (Routes)    │  │   (UI/UX)    │  │   (Context)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  tRPC Client Layer                       │
│              (Type-safe API calls)                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  tRPC Server Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Auth Router  │  │  AI Router   │  │Content Router│  │
│  │Credit Router │  │Workspace Rtr │  │Scheduler Rtr │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│   Prisma     │ │AI Services│ │ Integrations │
│    (ORM)     │ │  OpenAI   │ │   TikTok     │
└──────┬───────┘ │  Claude   │ │  Instagram   │
       │         └──────────┘ │   Twitter    │
       ▼                      └──────────────┘
┌──────────────┐
│  PostgreSQL  │
│  (Database)  │
└──────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Query** - Data fetching & caching
- **Zustand** - State management

### Backend
- **Bun** - JavaScript runtime
- **tRPC** - Type-safe API
- **Prisma** - Database ORM
- **Zod** - Schema validation
- **NextAuth** - Authentication

### Database
- **PostgreSQL** - Primary database
- **Prisma** - ORM and migrations

### AI Services
- **OpenAI GPT-4** - Text generation
- **Anthropic Claude** - Alternative AI
- **Custom Models** - Specialized tasks

### Infrastructure
- **Vercel** - Frontend hosting
- **Docker** - Containerization
- **GitHub Actions** - CI/CD

## Monorepo Structure

```
kreatr-app/
├── apps/
│   └── web/                    # Next.js frontend
│       ├── app/                # App Router pages
│       ├── components/         # React components
│       ├── lib/                # Utilities
│       └── providers/          # Context providers
│
├── packages/
│   ├── database/               # Prisma schema
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   │
│   ├── api/                    # tRPC routers
│   │   └── src/
│   │       ├── routers/
│   │       ├── context.ts
│   │       └── root.ts
│   │
│   ├── ai/                     # AI services
│   │   └── src/
│   │       ├── openai.ts
│   │       ├── claude.ts
│   │       └── brainstorm.ts
│   │
│   └── integrations/           # Social media APIs
│       └── src/
│           ├── tiktok.ts
│           ├── instagram.ts
│           └── twitter.ts
│
└── docs/                       # Documentation
```

## Data Flow

### 1. User Request Flow

```
User Action (Click Button)
    ↓
React Component
    ↓
tRPC Hook (useMutation/useQuery)
    ↓
HTTP Request to /api/trpc
    ↓
tRPC Router Handler
    ↓
Business Logic
    ↓
Database Query (Prisma)
    ↓
Response
    ↓
React Query Cache
    ↓
UI Update
```

### 2. AI Generation Flow

```
User Input (Topic)
    ↓
AI Router (tRPC)
    ↓
Check Credits
    ↓
Call AI Service (OpenAI/Claude)
    ↓
Process Response
    ↓
Deduct Credits
    ↓
Save to Database
    ↓
Return to User
```

### 3. Content Scheduling Flow

```
User Creates Content
    ↓
Save to Database (DRAFT)
    ↓
User Schedules Post
    ↓
Update Status (SCHEDULED)
    ↓
Cron Job Checks Schedule
    ↓
Post to Social Media API
    ↓
Update Status (PUBLISHED)
    ↓
Record Analytics
```

## Database Schema

### Core Tables

```
User
├── id, email, name
├── accounts (OAuth)
├── sessions
├── workspaces (many-to-many)
├── contents (one-to-many)
└── credits (one-to-many)

Workspace
├── id, name, slug
├── members (many-to-many)
├── contents (one-to-many)
└── socialAccounts (one-to-many)

Content
├── id, title, caption
├── status (DRAFT, SCHEDULED, PUBLISHED)
├── scheduledAt, publishedAt
├── author (User)
├── workspace (Workspace)
└── posts (one-to-many)

CreditTransaction
├── id, amount, type
├── description, balance
└── user (User)
```

See [Database Schema](../02-development/DATABASE.md) for details.

## API Architecture

### tRPC Routers

```typescript
appRouter
├── auth          # Authentication
├── content       # Content management
├── workspace     # Collaboration
├── scheduler     # Scheduling
├── analytics     # Analytics
├── credit        # Credit system
├── boost         # SMM services
└── ai            # AI features
    ├── brainstorm
    ├── generateContent
    └── analyzeTikTok
```

See [API Documentation](../02-development/API.md) for endpoints.

## Security Architecture

### Authentication Flow

```
User Login
    ↓
NextAuth.js
    ↓
Session Created
    ↓
JWT Token
    ↓
Stored in Cookie
    ↓
Sent with Each Request
    ↓
Verified by Middleware
```

### Authorization

```typescript
// Middleware checks
1. Is user authenticated?
2. Does user have access to workspace?
3. Does user have required role?
4. Does user have sufficient credits?
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Database connection pooling
- Redis for session storage

### Caching Strategy
- React Query for client-side
- Redis for server-side
- CDN for static assets

### Performance Optimization
- Code splitting
- Image optimization
- Database indexing
- Query optimization

## Deployment Architecture

### Production Setup

```
User Request
    ↓
Cloudflare CDN
    ↓
Vercel Edge Network
    ↓
Next.js Server
    ↓
PostgreSQL (Supabase/Railway)
```

### CI/CD Pipeline

```
Git Push
    ↓
GitHub Actions
    ↓
Run Tests
    ↓
Build Application
    ↓
Deploy to Vercel
    ↓
Run Migrations
    ↓
Health Check
```

## Monitoring & Observability

- **Logs:** Vercel Logs
- **Errors:** Sentry
- **Analytics:** Vercel Analytics
- **Performance:** Web Vitals
- **Database:** Prisma Metrics

## Next Steps

- [API Documentation](../02-development/API.md)
- [Database Schema](../02-development/DATABASE.md)
- [Testing Guide](../02-development/TESTING.md)

---

**Last Updated:** 2024-01-15
**Version:** 0.1.0
