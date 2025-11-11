# Contributing to kreatr.app

Terima kasih atas minat Anda untuk berkontribusi pada kreatr.app! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

---

## 🤝 Code of Conduct

Kami berkomitmen untuk menyediakan lingkungan yang ramah dan inklusif. Dengan berpartisipasi dalam project ini, Anda setuju untuk:

- Bersikap hormat dan profesional
- Menerima kritik konstruktif dengan lapang dada
- Fokus pada apa yang terbaik untuk komunitas
- Menunjukkan empati terhadap anggota komunitas lainnya

---

## 🚀 Getting Started

### Prerequisites

- Bun >= 1.0 atau Node.js >= 18
- PostgreSQL >= 14
- Docker (optional, untuk development)
- Git

### Setup Development Environment

1. **Fork dan Clone Repository**

```bash
git clone https://github.com/yourusername/kreatr-app.git
cd kreatr-app
```

2. **Install Dependencies**

```bash
bun install
```

3. **Setup Environment Variables**

```bash
cp .env.example .env.local
# Edit .env.local dengan credentials Anda
```

4. **Start Database**

```bash
docker-compose up -d postgres redis
```

5. **Run Database Migrations**

```bash
bun run db:migrate
```

6. **Start Development Server**

```bash
bun run dev
```

---

## 💻 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Creating a Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes
2. Test your changes locally
3. Run linter and type checker

```bash
bun run lint
bun run type-check
bun test
```

4. Commit your changes (see [Commit Guidelines](#commit-guidelines))
5. Push to your fork

```bash
git push origin feature/your-feature-name
```

---

## 📝 Coding Standards

### TypeScript

- Use TypeScript untuk semua code
- Avoid `any` type, gunakan proper types
- Use interfaces untuk object shapes
- Export types yang akan digunakan di tempat lain

```typescript
// ✅ Good
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Bad
function getUser(id: any): Promise<any> {
  // ...
}
```

### React Components

- Use functional components dengan hooks
- Prefer named exports
- Keep components small dan focused
- Extract reusable logic ke custom hooks

```typescript
// ✅ Good
export function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useUser(userId)
  
  if (isLoading) return <Skeleton />
  
  return <div>{data.name}</div>
}

// ❌ Bad
export default function Component(props: any) {
  // ...
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Hooks: `use*.ts` (e.g., `useUser.ts`)
- Types: `types.ts` atau `*.types.ts`

### Code Organization

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── features/     # Feature-specific components
│   └── layout/       # Layout components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── types/            # TypeScript types
└── utils/            # Helper functions
```

---

## 📝 Commit Guidelines

Kami menggunakan [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add OAuth login with TikTok

- Implement TikTok OAuth flow
- Add callback handler
- Store tokens in database

Closes #123
```

```bash
fix(scheduler): resolve timezone issue in post scheduling

The scheduler was using local timezone instead of UTC,
causing posts to be scheduled at wrong times.

Fixes #456
```

---

## 🔄 Pull Request Process

### Before Submitting

1. ✅ Code passes all tests
2. ✅ Code follows coding standards
3. ✅ No linting errors
4. ✅ Type checking passes
5. ✅ Documentation updated (if needed)
6. ✅ Commit messages follow guidelines

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. Submit PR to `develop` branch
2. Wait for CI/CD checks to pass
3. Request review from maintainers
4. Address review comments
5. Once approved, PR will be merged

---

## 🏗️ Project Structure

```
kreatr-app/
├── apps/
│   └── web/              # Next.js frontend
│       ├── app/          # App router pages
│       ├── components/   # React components
│       └── lib/          # Utilities
│
├── packages/
│   ├── database/         # Prisma schema & client
│   ├── api/              # tRPC routers
│   ├── ai/               # AI integrations
│   ├── integrations/     # Social media APIs
│   └── ui/               # Shared UI components
│
├── docs/                 # Documentation
└── .github/              # GitHub workflows
```

---

## 🧪 Testing

### Running Tests

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

### Writing Tests

```typescript
import { describe, it, expect } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

---

## 📚 Additional Resources

- [Project Blueprint](../PROJECT-BLUEPRINT.md)
- [Setup Guide](../SETUP-GUIDE.md)
- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## 💬 Getting Help

- **Discord**: [Join our community](https://discord.gg/kreatr)
- **GitHub Issues**: [Report bugs or request features](https://github.com/kreatr-app/kreatr-app/issues)
- **Email**: dev@kreatr.app

---

## 🎉 Recognition

Contributors akan diakui di:
- README.md Contributors section
- Release notes
- Project website

Terima kasih atas kontribusi Anda! 🙏
