# Deployment Guide - kreatr.app

Panduan lengkap untuk deploy kreatr.app ke production.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Vercel Deployment](#vercel-deployment)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Services

- **Vercel Account** (untuk hosting frontend)
- **Supabase/Railway** (untuk PostgreSQL database)
- **Upstash** (untuk Redis cache)
- **Domain** (optional, untuk custom domain)

### API Keys yang Diperlukan

- OpenAI API Key
- Anthropic API Key (optional)
- TikTok Developer Account
- Instagram/Facebook Developer Account
- Twitter Developer Account
- Google Cloud Console (untuk Calendar API)
- Midtrans/Xendit (untuk payment)

---

## 🌍 Environment Setup

### 1. Production Environment Variables

Buat file `.env.production` dengan konfigurasi berikut:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/kreatr_production"

# NextAuth
NEXTAUTH_URL="https://kreatr.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth Providers
TIKTOK_CLIENT_ID="production-client-id"
TIKTOK_CLIENT_SECRET="production-client-secret"

GOOGLE_CLIENT_ID="production-google-client-id"
GOOGLE_CLIENT_SECRET="production-google-client-secret"

# AI Services
OPENAI_API_KEY="sk-prod-..."
ANTHROPIC_API_KEY="sk-ant-prod-..."

# Social Media APIs
INSTAGRAM_APP_ID="production-app-id"
INSTAGRAM_APP_SECRET="production-app-secret"

TWITTER_API_KEY="production-api-key"
TWITTER_API_SECRET="production-api-secret"
TWITTER_BEARER_TOKEN="production-bearer-token"

# Payment Gateway
MIDTRANS_SERVER_KEY="production-server-key"
MIDTRANS_CLIENT_KEY="production-client-key"
MIDTRANS_IS_PRODUCTION="true"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://production-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="production-token"

# Monitoring
SENTRY_DSN="https://production-sentry-dsn"
VERCEL_ANALYTICS_ID="production-analytics-id"

# Email
RESEND_API_KEY="re_prod_..."
EMAIL_FROM="noreply@kreatr.app"

# Storage
UPLOADTHING_SECRET="sk_live_production"
UPLOADTHING_APP_ID="production-app-id"

# App Config
NEXT_PUBLIC_APP_URL="https://kreatr.app"
NEXT_PUBLIC_APP_NAME="kreatr.app"
```

---

## 🚀 Vercel Deployment

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: cd ../.. && bun run build
   Output Directory: .next
   Install Command: cd ../.. && bun install
   ```

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all production environment variables
   - Separate variables for Production, Preview, and Development

4. **Deploy**
   - Push to `main` branch untuk production
   - Push to `develop` branch untuk preview

### Vercel Configuration

Create `vercel.json` di root project:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "apps/web/$1"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  }
}
```

---

## 🗄️ Database Setup

### Option 1: Supabase

1. **Create Project**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Create new project
   - Choose region (Singapore untuk Indonesia)

2. **Get Connection String**
   ```
   Settings → Database → Connection String
   ```

3. **Run Migrations**
   ```bash
   DATABASE_URL="postgresql://..." bun run db:migrate
   ```

4. **Enable Row Level Security (RLS)**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
   -- ... untuk semua tables
   ```

### Option 2: Railway

1. **Create Project**
   - Go to [Railway](https://railway.app)
   - New Project → Provision PostgreSQL

2. **Get Connection String**
   ```
   PostgreSQL → Connect → Connection URL
   ```

3. **Configure**
   - Set environment variables di Railway
   - Connect to GitHub repository
   - Auto-deploy on push

### Database Backup Strategy

```bash
# Automated daily backup
# Add to cron job or GitHub Actions

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE

# Upload to S3 or cloud storage
aws s3 cp $BACKUP_FILE s3://kreatr-backups/
```

---

## 🔐 Environment Variables

### Vercel Environment Variables

```bash
# Add via Vercel CLI
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production

# Or via Vercel Dashboard
# Project Settings → Environment Variables
```

### Secure Secrets Management

1. **Use Vercel Environment Variables** untuk sensitive data
2. **Never commit** `.env.production` ke Git
3. **Rotate secrets** regularly
4. **Use different keys** untuk production vs development

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Run linter
        run: bun run lint
      
      - name: Run type check
        run: bun run type-check
      
      - name: Run tests
        run: bun test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Database Migration Workflow

Create `.github/workflows/migrate.yml`:

```yaml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to migrate'
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: bun run db:migrate
```

---

## 📊 Monitoring & Logging

### Sentry Setup

```typescript
// apps/web/lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies
      delete event.request.headers
    }
    return event
  },
})
```

### Vercel Analytics

```typescript
// apps/web/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Custom Logging

```typescript
// apps/web/lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta)
    // Send to logging service
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error)
    // Send to Sentry
    Sentry.captureException(error)
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta)
  },
}
```

---

## 🔍 Health Checks

Create health check endpoint:

```typescript
// apps/web/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@kreatr/database'

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'up',
        api: 'up',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
      },
      { status: 503 }
    )
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Clear cache and rebuild
vercel --force

# Check build logs
vercel logs
```

#### 2. Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check connection pool
# Increase pool size in Prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connectionLimit = 10
}
```

#### 3. Environment Variables Not Loading

```bash
# Verify variables are set
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

#### 4. API Rate Limits

```typescript
// Implement rate limiting
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function middleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for')
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }
}
```

---

## 📈 Performance Optimization

### 1. Enable Caching

```typescript
// apps/web/next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
    ]
  },
}
```

### 2. Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  quality={85}
/>
```

### 3. Database Query Optimization

```typescript
// Use indexes
@@index([workspaceId, status])
@@index([authorId, createdAt])

// Use select to limit fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
})
```

---

## 🔒 Security Checklist

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secured
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Authentication secured (NextAuth)
- [ ] API keys rotated regularly
- [ ] Database backups automated
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies updated regularly

---

## 📞 Support

Jika mengalami masalah saat deployment:

- **Documentation**: [docs.kreatr.app](https://docs.kreatr.app)
- **Discord**: [discord.gg/kreatr](https://discord.gg/kreatr)
- **Email**: support@kreatr.app

---

**Happy Deploying! 🚀**
