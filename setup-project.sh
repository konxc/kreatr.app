#!/bin/bash

# kreatr.app Project Setup Script
# This script initializes the entire project structure

set -e

echo "🚀 Setting up kreatr.app project..."

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
fi

echo "✅ Bun version: $(bun --version)"

# Create project structure
echo "📁 Creating project structure..."

# Create main directories
mkdir -p apps packages docs .github/workflows

# Initialize Next.js app
echo "⚡ Initializing Next.js app..."
cd apps
if [ ! -d "web" ]; then
    bunx create-next-app@latest web \
        --typescript \
        --tailwind \
        --app \
        --src-dir \
        --import-alias "@/*" \
        --no-git
fi
cd ..

# Create packages structure
echo "📦 Creating packages..."

# Database package
mkdir -p packages/database/prisma packages/database/src
if [ ! -f "packages/database/package.json" ]; then
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
    "db:seed": "bun run prisma/seed.ts",
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
fi

# API package (tRPC)
mkdir -p packages/api/src/routers
if [ ! -f "packages/api/package.json" ]; then
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
fi

# AI package
mkdir -p packages/ai/src
if [ ! -f "packages/ai/package.json" ]; then
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
fi

# Integrations package
mkdir -p packages/integrations/src
if [ ! -f "packages/integrations/package.json" ]; then
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
fi

# UI package (Shadcn components)
mkdir -p packages/ui/src/components
if [ ! -f "packages/ui/package.json" ]; then
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
fi

# Install dependencies
echo "📥 Installing dependencies..."
bun install

# Initialize Prisma
echo "🗄️  Initializing Prisma..."
cd packages/database
if [ ! -f "prisma/schema.prisma" ]; then
    bunx prisma init
fi
cd ../..

# Setup Shadcn UI
echo "🎨 Setting up Shadcn UI..."
cd apps/web
if [ ! -f "components.json" ]; then
    bunx shadcn-ui@latest init -y
fi
cd ../..

echo ""
echo "✅ Project setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy .env.example to .env.local and fill in your credentials"
echo "2. Start Docker containers: docker-compose up -d"
echo "3. Run database migrations: bun run db:migrate"
echo "4. Start development server: bun run dev"
echo ""
echo "🎉 Happy coding!"
