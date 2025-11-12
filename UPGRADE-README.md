# 🚀 Upgrade to Next.js 16 & React 19

## Quick Start

```bash
# Run automated upgrade script
./upgrade.sh
```

That's it! The script will:
1. Clean old dependencies
2. Install new dependencies
3. Generate Prisma Client
4. Run type check
5. Run linter
6. Build project

---

## Manual Installation

If you prefer manual installation:

```bash
# 1. Clean
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -f bun.lockb

# 2. Install
bun install

# 3. Generate Prisma
cd packages/database && bun run db:generate && cd ../..

# 4. Build
bun run build
```

---

## What Changed?

### Major Updates
- ✅ **Next.js 14 → 16** - Latest features and performance
- ✅ **React 18 → 19** - Better DX and performance
- ✅ **tRPC v10 → v11** - Enhanced type safety
- ✅ **Turbo v1 → v2** - Faster builds

### Configuration
- ✅ Updated `next.config.js` for Next.js 16
- ✅ Updated `turbo.json` for Turbo v2
- ✅ Updated `tsconfig.json` for React 19
- ✅ Updated all dependencies to latest

---

## Documentation

- 📖 [Complete Upgrade Guide](./UPGRADE-TO-NEXTJS16.md)
- 📖 [Quick Reference](./NEXTJS16-QUICK-REFERENCE.md)
- 📖 [Upgrade Summary](./UPGRADE-SUMMARY.md)

---

## Need Help?

Check the documentation files above or:
- Review [Next.js 16 Docs](https://nextjs.org/docs)
- Review [React 19 Docs](https://react.dev)
- Check [tRPC v11 Migration](https://trpc.io/docs/migrate-from-v10-to-v11)

---

**Status:** ✅ Ready for Installation

**Time Required:** ~5 minutes

**Difficulty:** Easy (automated script provided)
