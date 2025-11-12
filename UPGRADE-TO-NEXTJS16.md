# 🚀 Upgrade to Next.js 16 & React 19

## ✅ Changes Made

### 1. **Next.js 14 → 16**
- Updated from `14.0.4` to `^16.0.1`
- Removed deprecated `swcMinify` (now default)
- Updated `images.domains` to `images.remotePatterns` (new format)
- Removed `experimental.serverActions` (now stable)

### 2. **React 18 → 19**
- Updated React from `^18.2.0` to `^19.0.0`
- Updated React DOM from `^18.2.0` to `^19.0.0`
- Updated `@types/react` to `^19.0.2`
- Updated `@types/react-dom` to `^19.0.2`

### 3. **tRPC v10 → v11**
- Updated `@trpc/client` from `^10.45.0` to `^11.0.0`
- Updated `@trpc/server` from `^10.45.0` to `^11.0.0`
- Updated `@trpc/react-query` from `^10.45.0` to `^11.0.0`

### 4. **Turbo v1 → v2**
- Updated Turbo from `^1.11.0` to `^2.3.3`
- Changed `pipeline` to `tasks` in `turbo.json`

### 5. **Other Dependencies**
- Updated `@tanstack/react-query` to `^5.62.8`
- Updated `lucide-react` to `^0.468.0`
- Updated `zustand` to `^5.0.2`
- Updated `zod` to `^3.24.1`
- Updated `tailwind-merge` to `^2.6.0`
- Updated `tailwindcss` to `^3.4.17`
- Updated `typescript` to `^5.7.2`
- Updated `@types/node` to `^22.10.2`
- Updated `eslint` to `^9`
- Updated `prettier` to `^3.4.2`

### 6. **Node.js Requirement**
- Updated minimum Node.js version from `>=18.0.0` to `>=20.0.0`

---

## 📦 Installation

Run the following command to install updated dependencies:

```bash
# Remove old node_modules and lock files
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -f bun.lockb

# Install fresh dependencies
bun install
```

---

## 🔄 Breaking Changes & Migration

### 1. **React 19 Changes**

#### a. `children` prop is no longer implicit
```typescript
// ❌ Before (React 18)
interface Props {
  title: string
}

function Component({ title, children }: Props) {
  return <div>{children}</div>
}

// ✅ After (React 19)
interface Props {
  title: string
  children?: React.ReactNode
}

function Component({ title, children }: Props) {
  return <div>{children}</div>
}
```

#### b. `ref` is now a regular prop
```typescript
// ❌ Before (React 18)
const Component = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return <div ref={ref}>{props.children}</div>
})

// ✅ After (React 19)
function Component({ ref, ...props }: Props & { ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref}>{props.children}</div>
}
```

### 2. **Next.js 16 Changes**

#### a. Image domains → remotePatterns
Already updated in `next.config.js`:
```javascript
// ❌ Old format
images: {
  domains: ['example.com']
}

// ✅ New format
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'example.com',
    }
  ]
}
```

#### b. Server Actions are now stable
Removed from experimental config - they just work!

### 3. **tRPC v11 Changes**

#### a. Import changes
```typescript
// ❌ Before (v10)
import { createTRPCReact } from '@trpc/react-query'

// ✅ After (v11) - same, but check for any deprecated imports
import { createTRPCReact } from '@trpc/react-query'
```

Most tRPC v11 changes are internal. Your existing code should work with minimal changes.

### 4. **Turbo v2 Changes**

Already updated in `turbo.json`:
```json
// ❌ Old format
{
  "pipeline": { ... }
}

// ✅ New format
{
  "tasks": { ... }
}
```

---

## 🧪 Testing After Upgrade

### 1. **Check for Type Errors**
```bash
bun run type-check
```

### 2. **Run Linter**
```bash
bun run lint
```

### 3. **Build Project**
```bash
bun run build
```

### 4. **Start Development Server**
```bash
bun run dev
```

### 5. **Test Key Features**
- [ ] Landing page loads correctly
- [ ] Authentication works (login/register)
- [ ] API calls work (tRPC)
- [ ] Images load properly
- [ ] No console errors

---

## 🐛 Common Issues & Solutions

### Issue 1: Type errors with `children`
**Solution:** Add explicit `children?: React.ReactNode` to component props

### Issue 2: `ref` forwarding errors
**Solution:** Use `ref` as a regular prop instead of `forwardRef`

### Issue 3: Build errors
**Solution:** Clear `.next` folder and rebuild
```bash
rm -rf apps/web/.next
bun run build
```

### Issue 4: Module resolution errors
**Solution:** Clear all caches and reinstall
```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules .turbo
rm -f bun.lockb
bun install
```

### Issue 5: Turbopack webpack config error
**Error:** "This build is using Turbopack, with a `webpack` config and no `turbopack` config"

**Solution:** Add empty turbopack config to next.config.js
```javascript
turbopack: {
  // Empty config to silence the warning
}
```

### Issue 6: Prisma Client warnings in Turbopack
**Warning:** "Package @prisma/client can't be external"

**Solution:** Add @prisma/client to apps/web/package.json dependencies
```json
"@prisma/client": "^5.22.0"
```

---

## 📚 Resources

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [tRPC v11 Migration Guide](https://trpc.io/docs/migrate-from-v10-to-v11)
- [Turbo v2 Migration Guide](https://turbo.build/repo/docs/getting-started/migrate-from-v1)

---

## ✅ Checklist

- [x] Updated Next.js to v16
- [x] Updated React to v19
- [x] Updated tRPC to v11
- [x] Updated Turbo to v2
- [x] Updated all dependencies
- [x] Updated `next.config.js`
- [x] Updated `turbo.json`
- [x] Updated `tsconfig.json`
- [ ] Run `bun install`
- [ ] Test application
- [ ] Fix any type errors
- [ ] Update documentation

---

**Status:** ✅ Configuration Updated - Ready for Installation

**Next Step:** Run `bun install` to install updated dependencies
