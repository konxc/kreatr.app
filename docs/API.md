# API Documentation - kreatr.app

Complete API reference untuk kreatr.app menggunakan tRPC.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Content API](#content-api)
- [Workspace API](#workspace-api)
- [Scheduler API](#scheduler-api)
- [Analytics API](#analytics-api)
- [Credit API](#credit-api)
- [Error Handling](#error-handling)

---

## 🌐 Overview

kreatr.app menggunakan [tRPC](https://trpc.io/) untuk type-safe API communication antara frontend dan backend.

### Base URL

```
Development: http://localhost:3000/api/trpc
Production: https://kreatr.app/api/trpc
```

### Client Setup

```typescript
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@kreatr/api'

export const trpc = createTRPCReact<AppRouter>()
```

---

## 🔐 Authentication

### Register

Create new user account.

```typescript
const { mutate: register } = trpc.auth.register.useMutation()

register({
  email: 'user@example.com',
  password: 'securepassword',
  name: 'John Doe',
})
```

**Input:**
```typescript
{
  email: string
  password: string (min 8 characters)
  name: string (optional)
}
```

**Response:**
```typescript
{
  user: {
    id: string
    email: string
    name: string | null
  }
}
```

### Login

Authenticate user and create session.

```typescript
const { mutate: login } = trpc.auth.login.useMutation()

login({
  email: 'user@example.com',
  password: 'securepassword',
})
```

**Input:**
```typescript
{
  email: string
  password: string
}
```

**Response:**
```typescript
{
  user: {
    id: string
    email: string
    name: string | null
  }
  session: {
    expires: Date
  }
}
```

### Get Current User

Get authenticated user information.

```typescript
const { data: user } = trpc.auth.getSession.useQuery()
```

**Response:**
```typescript
{
  user: {
    id: string
    email: string
    name: string | null
    image: string | null
    plan: 'FREE' | 'BOOST' | 'PRO'
    creditBalance: number
  }
}
```

---

## 📝 Content API

### Generate Ideas

Generate content ideas using AI.

```typescript
const { mutate: generateIdeas } = trpc.content.generateIdeas.useMutation()

generateIdeas({
  topic: 'tips produktivitas',
  platform: 'TIKTOK',
  count: 10,
  tone: 'casual',
})
```

**Input:**
```typescript
{
  topic: string
  platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER'
  count?: number (default: 10)
  tone?: 'casual' | 'professional' | 'funny' | 'inspirational'
  audience?: string
}
```

**Response:**
```typescript
{
  ideas: Array<{
    id: string
    title: string
    description: string
    category: string
    difficulty: 'easy' | 'medium' | 'hard'
    estimatedEngagement: 'low' | 'medium' | 'high'
    hashtags: string[]
    hooks: string[]
  }>
  creditsUsed: number
}
```

### Generate Caption

Generate caption for content.

```typescript
const { mutate: generateCaption } = trpc.content.generateCaption.useMutation()

generateCaption({
  idea: '5 cara meningkatkan produktivitas',
  platform: 'INSTAGRAM',
  tone: 'inspirational',
})
```

**Input:**
```typescript
{
  idea: string
  platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER'
  tone?: string
  length?: 'short' | 'medium' | 'long'
}
```

**Response:**
```typescript
{
  caption: string
  hashtags: string[]
  hooks: string[]
  callToAction: string
  creditsUsed: number
}
```

### Create Content

Create new content in workspace.

```typescript
const { mutate: createContent } = trpc.content.create.useMutation()

createContent({
  workspaceId: 'clx...',
  title: 'My Content',
  caption: 'This is my caption',
  hashtags: ['#productivity', '#tips'],
  mediaUrls: ['https://...'],
})
```

**Input:**
```typescript
{
  workspaceId: string
  title: string
  caption?: string
  hashtags?: string[]
  mediaUrls?: string[]
  aiGenerated?: boolean
  aiPrompt?: string
}
```

**Response:**
```typescript
{
  id: string
  title: string
  caption: string | null
  hashtags: string[]
  mediaUrls: string[]
  status: 'DRAFT'
  createdAt: Date
}
```

### List Content

Get all content in workspace.

```typescript
const { data: contents } = trpc.content.list.useQuery({
  workspaceId: 'clx...',
  status: 'DRAFT',
  limit: 20,
})
```

**Input:**
```typescript
{
  workspaceId: string
  status?: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED'
  limit?: number (default: 20)
  offset?: number (default: 0)
}
```

**Response:**
```typescript
{
  contents: Array<{
    id: string
    title: string
    caption: string | null
    hashtags: string[]
    status: string
    createdAt: Date
    author: {
      id: string
      name: string
    }
  }>
  total: number
  hasMore: boolean
}
```

### Update Content

Update existing content.

```typescript
const { mutate: updateContent } = trpc.content.update.useMutation()

updateContent({
  id: 'clx...',
  title: 'Updated Title',
  caption: 'Updated caption',
})
```

### Delete Content

Delete content.

```typescript
const { mutate: deleteContent } = trpc.content.delete.useMutation()

deleteContent({ id: 'clx...' })
```

---

## 🏢 Workspace API

### Create Workspace

Create new workspace.

```typescript
const { mutate: createWorkspace } = trpc.workspace.create.useMutation()

createWorkspace({
  name: 'My Workspace',
  slug: 'my-workspace',
  description: 'Workspace description',
})
```

**Input:**
```typescript
{
  name: string
  slug: string (lowercase, alphanumeric, hyphens)
  description?: string
  image?: string (URL)
}
```

**Response:**
```typescript
{
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: Date
  members: Array<{
    id: string
    role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
    user: {
      id: string
      name: string
      email: string
    }
  }>
}
```

### List Workspaces

Get all workspaces for current user.

```typescript
const { data: workspaces } = trpc.workspace.list.useQuery()
```

**Response:**
```typescript
Array<{
  id: string
  name: string
  slug: string
  currentUserRole: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  _count: {
    contents: number
    socialAccounts: number
  }
}>
```

### Get Workspace

Get workspace details.

```typescript
const { data: workspace } = trpc.workspace.get.useQuery({
  id: 'clx...',
})
```

### Invite Member

Invite user to workspace.

```typescript
const { mutate: inviteMember } = trpc.workspace.inviteMember.useMutation()

inviteMember({
  workspaceId: 'clx...',
  email: 'user@example.com',
  role: 'MEMBER',
})
```

**Input:**
```typescript
{
  workspaceId: string
  email: string
  role: 'ADMIN' | 'MEMBER' | 'VIEWER'
}
```

### Remove Member

Remove member from workspace.

```typescript
const { mutate: removeMember } = trpc.workspace.removeMember.useMutation()

removeMember({
  workspaceId: 'clx...',
  userId: 'user-id',
})
```

### Update Member Role

Change member's role.

```typescript
const { mutate: updateRole } = trpc.workspace.updateMemberRole.useMutation()

updateRole({
  workspaceId: 'clx...',
  userId: 'user-id',
  role: 'ADMIN',
})
```

---

## 📅 Scheduler API

### Schedule Post

Schedule content for posting.

```typescript
const { mutate: schedulePost } = trpc.scheduler.schedulePost.useMutation()

schedulePost({
  contentId: 'clx...',
  platform: 'TIKTOK',
  accountId: 'account-id',
  scheduledAt: new Date('2025-12-01T10:00:00Z'),
})
```

**Input:**
```typescript
{
  contentId: string
  platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER'
  accountId: string
  scheduledAt: Date
}
```

### Get Scheduled Posts

Get all scheduled posts.

```typescript
const { data: scheduled } = trpc.scheduler.getScheduled.useQuery({
  workspaceId: 'clx...',
  startDate: new Date('2025-12-01'),
  endDate: new Date('2025-12-31'),
})
```

**Response:**
```typescript
Array<{
  id: string
  platform: string
  status: 'SCHEDULED'
  content: {
    id: string
    title: string
    caption: string
    scheduledAt: Date
  }
  account: {
    platform: string
    username: string
  }
}>
```

### Get Calendar Data

Get calendar view of scheduled posts.

```typescript
const { data: calendar } = trpc.scheduler.getCalendarData.useQuery({
  workspaceId: 'clx...',
  month: 12,
  year: 2025,
})
```

**Response:**
```typescript
Record<string, Array<{
  id: string
  title: string
  platform: string
  time: string
  status: string
}>>
```

### Cancel Scheduled Post

Cancel a scheduled post.

```typescript
const { mutate: cancel } = trpc.scheduler.cancelScheduled.useMutation()

cancel({ postId: 'post-id' })
```

---

## 📊 Analytics API

### Get Workspace Overview

Get analytics overview for workspace.

```typescript
const { data: overview } = trpc.analytics.getWorkspaceOverview.useQuery({
  workspaceId: 'clx...',
  timeRange: '30d',
})
```

**Input:**
```typescript
{
  workspaceId: string
  timeRange: '7d' | '30d' | '90d'
}
```

**Response:**
```typescript
{
  totalPosts: number
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  platformBreakdown: Array<{
    platform: string
    posts: number
    views: number
    likes: number
  }>
  topPosts: Array<{
    id: string
    title: string
    platform: string
    views: number
    engagementRate: number
  }>
}
```

### Get Content Performance

Get detailed performance for specific content.

```typescript
const { data: performance } = trpc.analytics.getContentPerformance.useQuery({
  contentId: 'clx...',
})
```

### Get Engagement Trends

Get engagement trends over time.

```typescript
const { data: trends } = trpc.analytics.getEngagementTrends.useQuery({
  workspaceId: 'clx...',
  timeRange: '30d',
  platform: 'TIKTOK',
})
```

### Get Hashtag Performance

Analyze hashtag performance.

```typescript
const { data: hashtags } = trpc.analytics.getHashtagPerformance.useQuery({
  workspaceId: 'clx...',
  timeRange: '30d',
  limit: 20,
})
```

---

## 💰 Credit API

### Get Balance

Get current credit balance.

```typescript
const { data: balance } = trpc.credit.getBalance.useQuery()
```

**Response:**
```typescript
number // Current credit balance
```

### Get Transactions

Get credit transaction history.

```typescript
const { data: transactions } = trpc.credit.getTransactions.useQuery({
  limit: 20,
  offset: 0,
  type: 'USAGE',
})
```

**Response:**
```typescript
{
  transactions: Array<{
    id: string
    amount: number
    type: 'PURCHASE' | 'REWARD' | 'USAGE' | 'REFUND'
    description: string
    balance: number
    createdAt: Date
  }>
  total: number
  hasMore: boolean
}
```

### Use Credits

Deduct credits for AI operations.

```typescript
const { mutate: useCredits } = trpc.credit.useCredits.useMutation()

useCredits({
  amount: 5,
  description: 'AI content generation',
  metadata: { feature: 'caption-generator' },
})
```

### Get Pricing Tiers

Get available credit packages.

```typescript
const { data: tiers } = trpc.credit.getPricingTiers.useQuery()
```

**Response:**
```typescript
Array<{
  id: string
  name: string
  credits: number
  price: number
  bonus: number
  popular: boolean
}>
```

---

## ❌ Error Handling

### Error Types

```typescript
try {
  await trpc.content.create.mutate(data)
} catch (error) {
  if (error.data?.code === 'UNAUTHORIZED') {
    // User not authenticated
  } else if (error.data?.code === 'FORBIDDEN') {
    // User doesn't have permission
  } else if (error.data?.code === 'NOT_FOUND') {
    // Resource not found
  } else if (error.data?.code === 'BAD_REQUEST') {
    // Invalid input
  } else {
    // Other errors
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` - User not authenticated
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid input
- `CONFLICT` - Resource conflict (e.g., duplicate slug)
- `INTERNAL_SERVER_ERROR` - Server error

---

## 🔗 Useful Links

- [tRPC Documentation](https://trpc.io/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Project Repository](https://github.com/kreatr-app/kreatr-app)

---

**Need help? Join our [Discord](https://discord.gg/kreatr) or email dev@kreatr.app**
