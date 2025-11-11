# 🚀 Cara Menjalankan Project kreatr.app

## ✅ Prerequisites yang Sudah Harus Terinstall:

1. **Bun** (Package Manager)
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Docker** (untuk Database)
   - Download dari: https://www.docker.com/products/docker-desktop

3. **Git**
   ```bash
   git --version
   ```

---

## 📝 Step-by-Step Instructions:

### Step 1: Install Dependencies

```bash
# Di root project
bun install
```

### Step 2: Setup Environment Variables

```bash
# Copy example file
cp apps/web/.env.local.example apps/web/.env.local
```

**Edit `apps/web/.env.local` dengan minimal config:**

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kreatr"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 3: Start Database

```bash
# Start PostgreSQL & Redis
docker-compose up -d

# Check if running
docker ps
```

### Step 4: Setup Database Schema

```bash
# Generate Prisma Client
cd packages/database
bun run db:generate

# Run migrations
bun run db:push

# Back to root
cd ../..
```

### Step 5: Run Development Server

```bash
# Start all services
bun run dev
```

**Tunggu sampai muncul:**
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### Step 6: Open Browser

Buka: **http://localhost:3000**

---

## 🎯 Test Authentication:

### Register New Account:
1. Go to: http://localhost:3000/register
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Daftar Sekarang"
4. You'll get 50 free credits!

### Login:
1. Go to: http://localhost:3000/login
2. Use credentials above
3. You'll be redirected to dashboard

---

## 🛠️ Useful Commands:

```bash
# Development
bun run dev              # Start dev server
bun run build            # Build for production
bun run lint             # Lint code

# Database
bun run db:studio        # Open Prisma Studio (GUI)
bun run db:push          # Push schema changes
bun run db:migrate       # Create migration

# Docker
docker-compose up -d     # Start containers
docker-compose down      # Stop containers
docker-compose logs -f   # View logs
```

---

## ❌ Common Errors & Solutions:

### Error: "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Error: "Cannot connect to database"
```bash
# Check Docker is running
docker ps

# Restart containers
docker-compose restart postgres
```

### Error: "Prisma Client not generated"
```bash
cd packages/database
bun run db:generate
cd ../..
```

### Error: "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
bun install
```

---

## 📊 Project Structure:

```
kreatr-app/
├── apps/
│   └── web/              # Next.js app (Frontend)
│       ├── app/          # Pages & routes
│       ├── components/   # React components
│       └── lib/          # Utilities
│
├── packages/
│   ├── database/         # Prisma (Database)
│   ├── api/              # tRPC (Backend API)
│   ├── ai/               # AI Services
│   └── integrations/     # Social Media APIs
│
└── docs/                 # Documentation
```

---

## 🎉 Success Indicators:

✅ No errors in terminal  
✅ Can access http://localhost:3000  
✅ Can register new account  
✅ Can login successfully  
✅ Database is connected  

---

## 📞 Need Help?

- Check: [QUICK-START.md](./QUICK-START.md)
- Check: [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)
- Issues: https://github.com/kreatr-app/kreatr-app/issues

---

**Happy Coding! 🚀**
