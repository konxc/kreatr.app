# Testing Guide for kreatr.app

## Overview

This guide covers the testing strategy and implementation for kreatr.app.

## Test Structure

```
kreatr-app/
├── packages/api/src/__tests__/
│   ├── setup.ts              # Test setup & cleanup
│   ├── credit.test.ts        # Credit system tests
│   ├── content.test.ts       # Content management tests
│   └── ai.test.ts            # AI features tests
├── apps/web/__tests__/
│   └── components/
│       └── dashboard.test.tsx # Component tests
└── scripts/
    └── test.sh               # Test runner script
```

## Running Tests

### All Tests
```bash
# Run all tests
bun test

# Or use the test script
chmod +x scripts/test.sh
./scripts/test.sh
```

### Specific Tests
```bash
# API tests only
cd packages/api && bun test

# Frontend tests only
cd apps/web && bun test

# Watch mode
bun test --watch

# With coverage
bun test --coverage
```

## Test Categories

### 1. Credit System Tests

**File:** `packages/api/src/__tests__/credit.test.ts`

**Coverage:**
- ✅ Get initial balance
- ✅ Purchase credits
- ✅ Deduct credits
- ✅ Insufficient credits error
- ✅ Transaction history
- ✅ Balance calculation

**Example:**
```typescript
test('should purchase credits successfully', async () => {
  const result = await caller.credit.purchase({ amount: 50 })
  
  expect(result.success).toBe(true)
  expect(result.newBalance).toBe(50)
})
```

### 2. Content Management Tests

**File:** `packages/api/src/__tests__/content.test.ts`

**Coverage:**
- ✅ Create content
- ✅ Get recent content
- ✅ Get content stats
- ✅ Update content status
- ✅ Schedule content
- ✅ Delete content

**Example:**
```typescript
test('should create content', async () => {
  const content = await caller.content.create({
    title: 'Test Content',
    caption: 'This is a test',
    workspaceId: testWorkspace.id,
  })
  
  expect(content.id).toBeDefined()
  expect(content.status).toBe('DRAFT')
})
```

### 3. AI Features Tests

**File:** `packages/api/src/__tests__/ai.test.ts`

**Coverage:**
- ✅ AI Brainstorm
  - Generate ideas
  - Deduct credits
  - Insufficient credits error
- ✅ Content Generator
  - Generate for different platforms
  - Different tones
  - Credit deduction
- ✅ TikTok Analyzer
  - Analyze video
  - Extract insights
  - URL validation

**Example:**
```typescript
test('should generate content ideas', async () => {
  const result = await caller.ai.brainstorm({
    topic: 'social media marketing',
    niche: 'tech',
  })
  
  expect(result.ideas).toBeDefined()
  expect(result.ideas.length).toBeGreaterThan(0)
  expect(result.creditsUsed).toBe(5)
})
```

### 4. Component Tests

**File:** `apps/web/__tests__/components/dashboard.test.tsx`

**Coverage:**
- ✅ Dashboard overview renders correctly
- ✅ Handles undefined data
- ✅ Displays stats properly

## Test Setup

### Database Setup

Tests use a separate test database to avoid affecting production data.

**File:** `packages/api/src/__tests__/setup.ts`

```typescript
beforeAll(async () => {
  // Setup test database
})

afterEach(async () => {
  // Clean up test data after each test
  await prisma.creditTransaction.deleteMany()
  await prisma.content.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  // Disconnect from database
  await prisma.$disconnect()
})
```

### Test Context

Each test creates its own isolated context:

```typescript
beforeEach(async () => {
  // Create test user
  testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })

  // Create caller with test context
  caller = createCaller({
    session: {
      user: { id: testUser.id, email: testUser.email },
    },
    prisma,
  })
})
```

## CI/CD Integration

Tests run automatically on GitHub Actions:

**File:** `.github/workflows/test.yml`

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**Steps:**
1. Setup PostgreSQL service
2. Install dependencies
3. Generate Prisma client
4. Run migrations
5. Run tests
6. Upload coverage

## Writing New Tests

### API Test Template

```typescript
import { describe, test, expect, beforeEach } from 'bun:test'
import { createCaller } from '../root'
import { prisma } from '@kreatr/database'

describe('Feature Name', () => {
  let caller: ReturnType<typeof createCaller>
  let testUser: any

  beforeEach(async () => {
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    })

    caller = createCaller({
      session: {
        user: { id: testUser.id, email: testUser.email },
      },
      prisma,
    })
  })

  test('should do something', async () => {
    const result = await caller.feature.method()
    
    expect(result).toBeDefined()
  })
})
```

### Component Test Template

```typescript
import { describe, test, expect } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/my-component'

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent prop="value" />)
    
    expect(screen.getByText('Expected Text')).toBeDefined()
  })
})
```

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Clean up data after each test
- Don't rely on test execution order

### 2. Descriptive Names
```typescript
// ✅ Good
test('should deduct credits when generating content')

// ❌ Bad
test('test1')
```

### 3. Arrange-Act-Assert Pattern
```typescript
test('should purchase credits', async () => {
  // Arrange
  const amount = 50
  
  // Act
  const result = await caller.credit.purchase({ amount })
  
  // Assert
  expect(result.newBalance).toBe(50)
})
```

### 4. Test Edge Cases
```typescript
test('should handle insufficient credits', async () => {
  await expect(
    caller.credit.deduct({ amount: 1000 })
  ).rejects.toThrow('Insufficient credits')
})
```

### 5. Mock External Services
```typescript
// Mock OpenAI API
const mockOpenAI = {
  chat: {
    completions: {
      create: async () => ({
        choices: [{ message: { content: 'Mocked response' } }],
      }),
    },
  },
}
```

## Coverage Goals

### Critical Features (Must be 100%)
- ✅ Credit purchase & deduction
- ✅ Payment processing
- ✅ Authentication

### Important Features (Target 80%+)
- ✅ Content management
- ✅ AI generation
- ✅ Scheduling

### Nice to Have (Target 60%+)
- ✅ UI components
- ✅ Utilities

## Troubleshooting

### Database Connection Issues
```bash
# Check if database is running
docker ps

# Start database
docker-compose up -d postgres

# Reset test database
bunx prisma migrate reset --force
```

### Prisma Client Issues
```bash
# Regenerate Prisma client
cd packages/database
bunx prisma generate
```

### Test Timeout
```typescript
// Increase timeout for slow tests
test('slow operation', async () => {
  // test code
}, { timeout: 10000 }) // 10 seconds
```

## Performance Testing

### Load Testing
```bash
# Install k6
brew install k6

# Run load test
k6 run scripts/load-test.js
```

### Example Load Test
```javascript
import http from 'k6/http'
import { check } from 'k6'

export default function () {
  const res = http.post('http://localhost:3000/api/trpc/ai.brainstorm', {
    topic: 'test',
  })
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })
}
```

## Next Steps

1. **Add E2E Tests** - Playwright for full user flows
2. **Visual Regression** - Screenshot testing
3. **Performance Monitoring** - Track API response times
4. **Security Testing** - Penetration testing

## Resources

- [Bun Test Documentation](https://bun.sh/docs/cli/test)
- [Testing Library](https://testing-library.com/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
