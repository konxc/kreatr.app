# 🚀 Setup Guide - kreatr.app

Panduan lengkap untuk setup project kreatr.app dari awal menggunakan WSL Ubuntu.

---

## Prerequisites

Pastikan Anda sudah install:
- WSL Ubuntu 20.04 atau lebih baru
- Bun >= 1.0 (atau Node.js >= 18)
- Docker Desktop (untuk PostgreSQL & Redis)
- Git

---

## Step 1: Masuk ke WSL Ubuntu

```bash
# Buka WSL Ubuntu
wsl -d Ubuntu-20.04

# Atau jika sudah default
wsl
```

---

## Step 2: Install Bun (jika belum)

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Reload shell
source ~/.bashrc

# Verify installation
bun --version
```

---

## Step 3: Clone atau Buat Project Directory

```bash
# Buat directory project
mkdir -p ~/projects/kreatr-app
cd ~/projects/kreatr-app

# Atau jika sudah ada repo
git clone https://github.com/yourusername/kreatr-app.git
cd kreatr-app
```

---

## Step 4: Initialize Monorepo Structure

```bash
# Buat struktur folder
mkdir -p apps packages docs .github/workflows

# Initialize root package.json
cat > package.json << 'EOF'
{
  "name": "kreatr-app",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "type-check": "turbo run type-check",
    "test": "turbo run test",
    "db:push": "cd packages/database && bunx prisma db push",
    "db:migrate": "cd packages/database && bunx prisma migrate dev",
    "db:studio": "cd packages/database && bunx prisma studio"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "prettier": "^3.1.0",
    "turbo": "^1.11.0",
    "typescript": "^5.3.0"
  }
}
EOF
```

---

## Step 5: Create Next.js App

```bash
# Masuk ke folder apps
cd apps

# Create Next.js app dengan Bun
bunx create-next-app@latest web \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-bun

# Kembali ke root
cd ..
```

---

## Step 6: Setup Database Package

```bash
# Buat struktur database package
mkdir -p packages/database/prisma packages/database/src

# Create package.json
cat > packages/database/package.json << 'EOF'
{
  "name": "@kreatr/database",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0"
  },
  "devDependencies": {
    "prisma": "^5.7.0"
  }
}
EOF

# Initialize Prisma
cd packages/database
bunx prisma init
cd ../..
```

---

## Step 7: Setup API Package (tRPC)

```bash
# Buat struktur API package
mkdir -p packages/api/src/routers

# Create package.json
cat > packages/api/package.json << 'EOF'
{
  "name": "@kreatr/api",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "@kreatr/database": "workspace:*",
    "@trpc/server": "^10.45.0",
    "zod": "^3.22.4"
  }
}
EOF
```

---

## Step 8: Setup AI Package

```bash
# Buat struktur AI package
mkdir -p packages/ai/src

# Create package.json
cat > packages/ai/package.json << 'EOF'
{
  "name": "@kreatr/ai",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "openai": "^4.20.0",
    "@anthropic-ai/sdk": "^0.9.0",
    "zod": "^3.22.4"
  }
}
EOF
```

---

## Step 9: Setup Integrations Package

```bash
# Buat struktur integrations package
mkdir -p packages/integrations/src

# Create package.json
cat > packages/integrations/package.json << 'EOF'
{
  "name": "@kreatr/integrations",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "axios": "^1.6.0",
    "zod": "^3.22.4"
  }
}
EOF
```

---

## Step 10: Setup UI Package

```bash
# Buat struktur UI package
mkdir -p packages/ui/src/components

# Create package.json
cat > packages/ui/package.json << 'EOF'
{
  "name": "@kreatr/ui",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "react": "^18.2.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.45"
  }
}
EOF
```

---

## Step 11: Install All Dependencies

```bash
# Install semua dependencies di root
bun install

# Ini akan install dependencies untuk semua workspaces
```

---

## Step 12: Setup Shadcn UI

```bash
# Masuk ke web app
cd apps/web

# Initialize Shadcn UI
bunx shadcn-ui@latest init

# Pilih options:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Install beberapa components dasar
bunx shadcn-ui@latest add button
bunx shadcn-ui@latest add card
bunx shadcn-ui@latest add input
bunx shadcn-ui@latest add label
bunx shadcn-ui@latest add dropdown-menu
bunx shadcn-ui@latest add dialog
bunx shadcn-ui@latest add calendar

# Kembali ke root
cd ../..
```

---

## Step 13: Setup Environment Variables

```bash
# Copy .env.example ke .env.local
cp .env.example .env.local

# Edit .env.local dengan credentials Anda
nano .env.local
# atau
vim .env.local
```

**Minimal configuration untuk development:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kreatr"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

---

## Step 14: Start Docker Services

```bash
# Start PostgreSQL & Redis
docker-compose up -d

# Verify containers are running
docker ps

# Check logs
docker-compose logs -f postgres
```

---

## Step 15: Setup Database

```bash
# Copy Prisma schema yang sudah dibuat
# (schema.prisma sudah ada di packages/database/prisma/)

# Generate Prisma Client
cd packages/database
bunx prisma generate

# Push schema to database
bunx prisma db push

# Open Prisma Studio (optional)
bunx prisma studio

# Kembali ke root
cd ../..
```

---

## Step 16: Run Development Server

```bash
# Start development server
bun run dev

# Atau jika menggunakan turbo
bunx turbo dev
```

Buka browser di: **http://localhost:3000**

---

## 🎉 Selesai!

Project kreatr.app sudah siap untuk development.

---

## Troubleshooting

### Bun command not found
```bash
# Reload shell
source ~/.bashrc
# atau
source ~/.zshrc
```

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Atau gunakan port lain
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
bunx prisma generate
cd ../..
```

---

## Next Steps

1. ✅ Setup project structure
2. ✅ Install dependencies
3. ✅ Configure database
4. 🔄 Build landing page
5. 🔄 Implement authentication
6. 🔄 Integrate AI services
7. 🔄 Connect social media APIs

Lihat [PROJECT-BLUEPRINT.md](./PROJECT-BLUEPRINT.md) untuk roadmap lengkap.

---

## Useful Commands

```bash
# Development
bun run dev              # Start dev server
bun run build            # Build for production
bun run start            # Start production server

# Database
bun run db:push          # Push schema changes
bun run db:migrate       # Create migration
bun run db:studio        # Open Prisma Studio

# Code Quality
bun run lint             # Lint code
bun run format           # Format code
bun run type-check       # Check TypeScript

# Testing
bun test                 # Run tests
bun test --watch         # Watch mode
```

---

**Happy Coding! 🚀**
