# Next.js 16 & React 19 - Quick Reference

## 🚀 What's New

### Next.js 16
- ✅ Server Actions are now stable (no longer experimental)
- ✅ Improved performance and build times
- ✅ Better TypeScript support
- ✅ Enhanced image optimization
- ✅ New `remotePatterns` for images (replaces `domains`)

### React 19
- ✅ `ref` is now a regular prop (no more `forwardRef` needed)
- ✅ Better TypeScript support
- ✅ Improved performance
- ✅ New hooks and features
- ✅ `children` prop must be explicit

---

## 📝 Common Patterns

### 1. Component with Children (React 19)

```typescript
// ✅ Correct way
interface Props {
  title: string
  children?: React.ReactNode
}

export function Card({ title, children }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

### 2. Component with Ref (React 19)

```typescript
// ✅ New way - ref as regular prop
interface Props {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

export function Box({ className, ref }: Props) {
  return <div ref={ref} className={className} />
}

// Usage
const boxRef = useRef<HTMLDivElement>(null)
<Box ref={boxRef} />
```

### 3. Server Actions (Next.js 16)

```typescript
// app/actions.ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  // ... save to database
  return { success: true }
}

// app/page.tsx
import { createPost } from './actions'

export default function Page() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  )
}
```

### 4. Image Optimization (Next.js 16)

```typescript
import Image from 'next/image'

export function Avatar({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt="Avatar"
      width={40}
      height={40}
      className="rounded-full"
    />
  )
}
```

### 5. Metadata API (Next.js 16)

```typescript
// app/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home - kreatr.app',
  description: 'AI-Powered Social Media Lab',
}

export default function Page() {
  return <div>Home</div>
}
```

### 6. Route Handlers (Next.js 16)

```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello' })
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ received: body })
}
```

### 7. Loading & Error States (Next.js 16)

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading...</div>
}

// app/dashboard/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### 8. Client Components (Next.js 16)

```typescript
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### 9. Server Components (Next.js 16)

```typescript
// Default - no 'use client' needed
import { prisma } from '@/lib/prisma'

export default async function Page() {
  const posts = await prisma.post.findMany()
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

### 10. Parallel Routes (Next.js 16)

```typescript
// app/dashboard/@analytics/page.tsx
export default function Analytics() {
  return <div>Analytics</div>
}

// app/dashboard/@team/page.tsx
export default function Team() {
  return <div>Team</div>
}

// app/dashboard/layout.tsx
export default function Layout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <div>
      {children}
      {analytics}
      {team}
    </div>
  )
}
```

---

## 🎨 Styling Patterns

### 1. Tailwind with cn() utility

```typescript
import { cn } from '@/lib/utils'

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg bg-purple-600 text-white',
        className
      )}
      {...props}
    />
  )
}
```

### 2. CSS Modules

```typescript
import styles from './button.module.css'

export function Button() {
  return <button className={styles.button}>Click me</button>
}
```

---

## 🔧 Configuration

### next.config.js (Next.js 16)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### tsconfig.json (React 19)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

---

## 🐛 Common Errors & Fixes

### Error: "Property 'children' does not exist"
```typescript
// ❌ Wrong
interface Props {
  title: string
}

// ✅ Correct
interface Props {
  title: string
  children?: React.ReactNode
}
```

### Error: "Cannot use forwardRef"
```typescript
// ❌ Old way (React 18)
const Component = forwardRef((props, ref) => {
  return <div ref={ref} />
})

// ✅ New way (React 19)
function Component({ ref, ...props }) {
  return <div ref={ref} />
}
```

### Error: "Image domains deprecated"
```javascript
// ❌ Old way
images: {
  domains: ['example.com']
}

// ✅ New way
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'example.com' }
  ]
}
```

---

## 📚 Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

---

**Happy coding with Next.js 16 & React 19! 🚀**
