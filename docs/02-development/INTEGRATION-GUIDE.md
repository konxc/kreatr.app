# Backend-Frontend Integration Guide

## Overview

This guide documents the integration between the tRPC backend API and Next.js frontend for kreatr.app.

## Architecture

```
Frontend (Next.js)
    ↓
tRPC Client (React Query)
    ↓
API Route (/api/trpc/[trpc])
    ↓
tRPC Router (Backend)
    ↓
Database (Prisma)
```

## Setup

### 1. tRPC Provider

The tRPC provider wraps the entire application and provides React Query integration:

**File:** `apps/web/providers/trpc-provider.tsx`

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'

export function TRPCProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() => trpc.createClient({
    transformer: superjson,
    links: [httpBatchLink({ url: getTRPCUrl() })],
  }))

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
```

### 2. tRPC Client

**File:** `apps/web/lib/trpc.ts`

```typescript
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@kreatr/api'

export const trpc = createTRPCReact<AppRouter>()
```

### 3. API Route Handler

**File:** `apps/web/app/api/trpc/[trpc]/route.ts`

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@kreatr/api'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  })

export { handler as GET, handler as POST }
```

## Integrated Features

### 1. AI Brainstorm

**Page:** `apps/web/app/(dashboard)/dashboard/ai-lab/brainstorm/page.tsx`

**API Call:**
```typescript
const brainstormMutation = trpc.ai.brainstorm.useMutation({
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
})

brainstormMutation.mutate({ topic, niche })
```

**Backend Router:** `packages/api/src/routers/ai.ts`

### 2. Content Generator

**Page:** `apps/web/app/(dashboard)/dashboard/ai-lab/generate/page.tsx`

**API Call:**
```typescript
const generateMutation = trpc.ai.generateContent.useMutation()

generateMutation.mutate({
  topic,
  platform: 'instagram',
  tone: 'casual',
})
```

### 3. TikTok Analyzer

**Page:** `apps/web/app/(dashboard)/dashboard/ai-lab/tiktok-analyzer/page.tsx`

**API Call:**
```typescript
const analyzeMutation = trpc.ai.analyzeTikTok.useMutation()

analyzeMutation.mutate({ videoUrl })
```

**Response Structure:**
```typescript
{
  title: string
  views: number
  likes: number
  comments: number
  shares: number
  hook: string
  strategy: string[]
  hashtags: string[]
  insights: string
}
```

### 4. Dashboard Stats

**Component:** `apps/web/components/dashboard/overview.tsx`

**API Call:**
```typescript
const { data: stats } = trpc.content.getStats.useQuery()
```

**Response:**
```typescript
{
  totalContent: number
  scheduledPosts: number
  totalViews: number
  creditsRemaining: number
}
```

### 5. Recent Content

**Component:** `apps/web/components/dashboard/recent-content.tsx`

**API Call:**
```typescript
const { data: content } = trpc.content.getRecent.useQuery({ limit: 5 })
```

### 6. Credit Management

**Page:** `apps/web/app/(dashboard)/dashboard/credits/page.tsx`

**API Calls:**
```typescript
// Get balance
const { data: balance } = trpc.credit.getBalance.useQuery()

// Get transactions
const { data: transactions } = trpc.credit.getTransactions.useQuery({ limit: 10 })

// Purchase credits
const purchaseMutation = trpc.credit.purchase.useMutation()
purchaseMutation.mutate({ amount: 50 })
```

## Error Handling

All mutations include error handling with toast notifications:

```typescript
const mutation = trpc.ai.brainstorm.useMutation({
  onSuccess: (data) => {
    toast({
      title: 'Success!',
      description: 'Operation completed',
    })
  },
  onError: (error) => {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    })
  },
})
```

## Loading States

All queries and mutations include loading states:

```typescript
const { data, isLoading, error } = trpc.content.getRecent.useQuery()

if (isLoading) {
  return <LoadingSpinner />
}

if (error) {
  return <ErrorMessage error={error} />
}

return <ContentList data={data} />
```

## Type Safety

All API calls are fully type-safe thanks to tRPC:

```typescript
// ✅ Type-safe - TypeScript knows the exact shape
const { data } = trpc.ai.brainstorm.useMutation()
data.ideas // string[]

// ❌ Type error - TypeScript catches this
brainstormMutation.mutate({ wrongField: 'value' })
```

## Best Practices

### 1. Use React Query Features

```typescript
// Automatic refetching
const { data } = trpc.content.getRecent.useQuery(
  { limit: 5 },
  {
    refetchInterval: 30000, // Refetch every 30s
    staleTime: 5000, // Consider data stale after 5s
  }
)
```

### 2. Optimistic Updates

```typescript
const utils = trpc.useContext()

const mutation = trpc.content.create.useMutation({
  onMutate: async (newContent) => {
    // Cancel outgoing refetches
    await utils.content.getRecent.cancel()
    
    // Snapshot previous value
    const previous = utils.content.getRecent.getData()
    
    // Optimistically update
    utils.content.getRecent.setData({ limit: 5 }, (old) => [
      newContent,
      ...(old || []),
    ])
    
    return { previous }
  },
  onError: (err, newContent, context) => {
    // Rollback on error
    utils.content.getRecent.setData({ limit: 5 }, context?.previous)
  },
})
```

### 3. Invalidate Queries

```typescript
const mutation = trpc.content.create.useMutation({
  onSuccess: () => {
    // Invalidate and refetch
    utils.content.getRecent.invalidate()
    utils.content.getStats.invalidate()
  },
})
```

## Testing

### Unit Tests

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { trpc } from '@/lib/trpc'

test('fetches content', async () => {
  const { result } = renderHook(() => trpc.content.getRecent.useQuery())
  
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  
  expect(result.current.data).toHaveLength(5)
})
```

### Integration Tests

```typescript
import { createCaller } from '@kreatr/api'

test('brainstorm generates ideas', async () => {
  const caller = createCaller({ user: mockUser })
  
  const result = await caller.ai.brainstorm({
    topic: 'social media',
    niche: 'tech',
  })
  
  expect(result.ideas).toHaveLength(8)
})
```

## Deployment

### Environment Variables

```env
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
```

### Build

```bash
# Install dependencies
bun install

# Generate Prisma client
bunx prisma generate

# Build
bun run build

# Start production server
bun run start
```

## Troubleshooting

### Common Issues

1. **tRPC not found**
   - Ensure `@kreatr/api` is properly linked in monorepo
   - Run `bun install` in root directory

2. **Type errors**
   - Regenerate Prisma client: `bunx prisma generate`
   - Restart TypeScript server in IDE

3. **API not responding**
   - Check API route is at `/app/api/trpc/[trpc]/route.ts`
   - Verify `createContext` is properly configured

4. **CORS errors**
   - Ensure `NEXTAUTH_URL` matches your domain
   - Check Vercel environment variables

## Next Steps

1. **Add more endpoints** - Implement remaining tRPC routers
2. **Optimize queries** - Add pagination, filtering, sorting
3. **Add caching** - Implement Redis for frequently accessed data
4. **Add webhooks** - Real-time updates for social media events
5. **Add rate limiting** - Protect API from abuse

## Resources

- [tRPC Documentation](https://trpc.io)
- [React Query Documentation](https://tanstack.com/query)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma Documentation](https://www.prisma.io/docs)
