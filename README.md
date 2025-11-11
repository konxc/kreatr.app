# 🧪 kreatr.app

> **AI-Powered Social Media Lab** — Tempat ide berevolusi menjadi pengaruh

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0-orange)](https://bun.sh/)

---

## 🎯 Apa itu kreatr.app?

**kreatr.app** (Creator AI Laboratory) adalah platform SaaS yang memberdayakan kreator konten, marketer, dan UMKM untuk membangun personal branding dengan AI dan data.

### ✨ Fitur Utama

- 🧠 **AI Brainstorm Engine** — Analisis profil TikTok & saran konten berbasis tren
- ✍️ **AI Content Generator** — Caption, hashtag, visual, dan voice-over otomatis
- 📅 **Smart Scheduler** — Auto-posting ke TikTok, Instagram, dan X
- 📊 **Analytics Dashboard** — Insight performa konten real-time
- 🤝 **Collaboration Space** — Multi-user workspace seperti Notion
- ⚡ **Credit System** — Token internal untuk akses AI resources

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- [Node.js](https://nodejs.org/) >= 18
- [PostgreSQL](https://www.postgresql.org/) >= 14
- [Docker](https://www.docker.com/) (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/kreatr-app.git
cd kreatr-app

# Install dependencies
bun install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan credentials Anda

# Setup database
docker-compose up -d postgres
bunx prisma migrate dev
bunx prisma db seed

# Run development server
bun run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📁 Project Structure

```
kreatr-app/
├── apps/
│   └── web/              # Next.js frontend
├── packages/
│   ├── database/         # Prisma schema
│   ├── api/              # tRPC routers
│   ├── ai/               # AI integrations
│   ├── integrations/     # Social media APIs
│   └── ui/               # Shared components
├── docs/                 # Documentation
└── .github/              # CI/CD workflows
```

Lihat [PROJECT-BLUEPRINT.md](./PROJECT-BLUEPRINT.md) untuk detail lengkap.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS + Shadcn UI
- **State:** Zustand + React Query
- **Animation:** Framer Motion

### Backend
- **Runtime:** Bun
- **API:** tRPC (Type-safe)
- **ORM:** Prisma
- **Auth:** NextAuth.js

### Database
- **Primary:** PostgreSQL
- **Cache:** Upstash Redis
- **Alternative:** Turso (edge-friendly)

### AI Services
- OpenAI (GPT-4, DALL-E)
- Anthropic Claude
- HuggingFace Hub
- Z.ai

### Infrastructure
- **Hosting:** Vercel
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry
- **Analytics:** Vercel Analytics

---

## 🔑 Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kreatr"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
TIKTOK_CLIENT_ID="your-tiktok-client-id"
TIKTOK_CLIENT_SECRET="your-tiktok-client-secret"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Services
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."

# Social Media APIs
INSTAGRAM_APP_ID="your-instagram-app-id"
INSTAGRAM_APP_SECRET="your-instagram-app-secret"

TWITTER_API_KEY="your-twitter-api-key"
TWITTER_API_SECRET="your-twitter-api-secret"

# Payment (optional)
MIDTRANS_SERVER_KEY="your-midtrans-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
```

---

## 📚 API Documentation

### tRPC Endpoints

#### Authentication
```typescript
// Register new user
trpc.auth.register.mutate({
  email: "user@example.com",
  password: "securepassword",
  name: "John Doe"
})

// Login
trpc.auth.login.mutate({
  email: "user@example.com",
  password: "securepassword"
})
```

#### Content Generation
```typescript
// Generate content ideas
trpc.content.generateIdeas.mutate({
  topic: "tips produktivitas",
  platform: "TIKTOK",
  count: 10
})

// Generate caption
trpc.content.generateCaption.mutate({
  idea: "5 cara meningkatkan produktivitas",
  tone: "casual",
  length: "medium"
})
```

#### Scheduler
```typescript
// Schedule post
trpc.scheduler.schedulePost.mutate({
  contentId: "clx...",
  platform: "TIKTOK",
  scheduledAt: new Date("2025-12-01T10:00:00Z")
})

// Get scheduled posts
trpc.scheduler.getScheduled.query({
  workspaceId: "clx...",
  startDate: new Date("2025-12-01"),
  endDate: new Date("2025-12-31")
})
```

Lihat [docs/API.md](./docs/API.md) untuk dokumentasi lengkap.

---

## 🧪 Testing

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage

# Run specific test file
bun test src/components/Button.test.tsx
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Docker

```bash
# Build image
docker build -t kreatr-app .

# Run container
docker run -p 3000:3000 kreatr-app
```

### Manual Deployment

```bash
# Build for production
bun run build

# Start production server
bun run start
```

---

## 🤝 Contributing

Kami sangat terbuka untuk kontribusi! Lihat [CONTRIBUTING.md](./docs/CONTRIBUTING.md) untuk panduan.

### Development Workflow

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style

```bash
# Format code
bun run format

# Lint code
bun run lint

# Type check
bun run type-check
```

---

## 📖 Documentation

- [Project Blueprint](./PROJECT-BLUEPRINT.md) - Arsitektur & roadmap lengkap
- [API Documentation](./docs/API.md) - Endpoint & usage examples
- [Contributing Guide](./docs/CONTRIBUTING.md) - Panduan kontribusi
- [Deployment Guide](./docs/DEPLOYMENT.md) - Cara deploy ke production

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--purple-blue: #6366F1;      /* Futuristic */
--orange-pastel: #FB923C;    /* Creative Energy */

/* Neutral Colors */
--gray-50: #F9FAFB;
--gray-900: #111827;

/* Semantic Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Typography

```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

---

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (Week 1-2)
- [x] Project setup
- [x] Database schema
- [x] Authentication
- [x] Landing page

### 🚧 Phase 2: AI Integration (Week 3-4)
- [ ] OpenAI integration
- [ ] Content idea generator
- [ ] Caption generator
- [ ] Credit system

### 📋 Phase 3: Social Media (Week 5-6)
- [ ] TikTok API integration
- [ ] Instagram API integration
- [ ] X (Twitter) API integration
- [ ] Content scheduler

### 📋 Phase 4: Collaboration (Week 7-8)
- [ ] Multi-user workspace
- [ ] Comment & approval system
- [ ] Analytics dashboard

### 📋 Phase 5: MVP Launch (Week 9-10)
- [ ] Beta testing
- [ ] Bug fixes
- [ ] Documentation
- [ ] Public launch 🚀

---

## 📊 Project Status

- **Current Phase:** Phase 1 - Foundation
- **Progress:** 25%
- **Next Milestone:** AI Integration
- **Target Launch:** Q1 2026

---

## 💰 Pricing

### Free Plan
- 10 AI-generated ideas/month
- 5 scheduled posts/month
- 1 social account
- 50 credits/month

### Boost Plan - Rp 199.000/month
- Unlimited AI ideas
- 50 scheduled posts/month
- 5 social accounts
- 500 credits/month
- Collaboration (3 members)

### Pro Plan - Rp 499.000/month
- Everything in Boost
- Unlimited posts
- Unlimited accounts
- 2000 credits/month
- Unlimited collaboration
- White-label reporting
- API access

---

## 🌟 Community

- **Discord:** [Join our community](https://discord.gg/kreatr)
- **Twitter:** [@kreatrapp](https://twitter.com/kreatrapp)
- **Instagram:** [@kreatr.app](https://instagram.com/kreatr.app)
- **TikTok:** [@kreatr.app](https://tiktok.com/@kreatr.app)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Bun](https://bun.sh/) - Fast JavaScript runtime
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Shadcn UI](https://ui.shadcn.com/) - Beautiful components
- [OpenAI](https://openai.com/) - AI capabilities

---

## 📞 Contact

- **Email:** hello@kreatr.app
- **Website:** [kreatr.app](https://kreatr.app)
- **GitHub:** [@kreatr-app](https://github.com/kreatr-app)

---

<div align="center">

**Dibuat dengan ❤️ untuk kreator Indonesia dan global**

[Website](https://kreatr.app) • [Documentation](./docs) • [Community](https://discord.gg/kreatr)

</div>
