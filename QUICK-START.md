# 🚀 Quick Start Guide - kreatr.app

Panduan cepat untuk menjalankan kreatr.app di local development.

---

## ⚡ Prerequisites

- **Bun** >= 1.0 (atau Node.js >= 18)
- **Docker** (untuk PostgreSQL & Redis)
- **Git**

---

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/kreatr-app.git
cd kreatr-app
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Setup Environment Variables

```bash
# Copy example env file
cp apps/web/.env.local.example apps/web/.env.local

# Edit dengan credentials Anda
nano apps/web/.env.local
```

**Minimal configuration untuk development:**

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kreatr"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 4. Start Database

```bash
# Start PostgreSQL & Redis with Docker
docker-compose up -d

# Verify containers are running
docker ps
```

### 5. Setup Database

```bash
# Generate Prisma Client
cd packages/database
bun run db:generate

# Run migrations
bun run db:migrate

# (Optional) Seed database
bun run db:seed

# Back to root
cd ../..
```

### 6. Start Development Server

```bash
# Start all services
bun run dev
```

Buka browser di: **http://localhost:3000**

---

## 🎯 What's Running?

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api/trpc
- **Database:** postgresql://localhost:5432/kreatr
- **Redis:** redis://localhost:6379
- **Prisma Studio:** `bun run db:studio` (http://localhost:5555)

---

## 🧪 Testing the App

### 1. Register New Account

1. Go to http://localhost:3000/register
2. Fill in the form
3. Click "Daftar Sekarang"
4. You'll get 50 free credits!

### 2. Login

1. Go to http://localhost:3000/login
2. Use your credentials
3. Or use "Continue with Google"

### 3. Explore Features

- **Dashboard:** http://localhost:3000/dashboard
- **Content Lab:** Generate AI content ideas
- **Scheduler:** Schedule posts
- **Analytics:** View performance
- **Settings:** Manage account

---

## 🛠️ Development Commands

```bash
# Development
bun run dev              # Start dev server
bun run build            # Build for production
bun run start            # Start production server

# Database
bun run db:push          # Push schema changes
bun run db:migrate       # Create migration
bun run db:studio        # Open Prisma Studio
bun run db:seed          # Seed database

# Code Quality
bun run lint             # Lint code
bun run format           # Format code
bun run type-check       # Check TypeScript

# Testing
bun test                 # Run tests
bun test --watch         # Watch mode
```

---

## 🔧 Troubleshooting

### Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 bun run dev
```

### Database connection error

```bash
# Check Docker containers
docker ps

# Restart containers
docker-compose restart

# Check logs
docker-compose logs postgres
```

### Prisma Client not generated

```bash
cd packages/database
bun run db:generate
cd ../..
```

### Module not found errors

```bash
# Clear cache and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
bun install
```

### Turbo cache issues

```bash
# Clear turbo cache
rm -rf .turbo
bun run dev
```

---

## 📚 Next Steps

1. ✅ Setup OAuth providers (Google, TikTok)
2. ✅ Configure AI services (OpenAI, Claude)
3. ✅ Connect social media accounts
4. ✅ Explore API documentation: [docs/API.md](./docs/API.md)
5. ✅ Read contribution guide: [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)

---

## 🆘 Need Help?

- **Documentation:** Check `/docs` folder
- **Issues:** [GitHub Issues](https://github.com/kreatr-app/kreatr-app/issues)
- **Discord:** [Join our community](https://discord.gg/kreatr)
- **Email:** dev@kreatr.app

---

## 🎉 You're Ready!

Project is now running! Start building amazing features! 🚀

**Happy Coding!** ✨
