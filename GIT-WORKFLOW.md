# 🔄 Git Workflow untuk kreatr.app

## 📋 Cara Menggunakan

### Option 1: Automated Script (Recommended)

```bash
# Di WSL Ubuntu terminal
cd /path/to/kreatr-app

# Make script executable
chmod +x git-commit-all.sh

# Run the script
bash git-commit-all.sh
```

Script akan otomatis:
- ✅ Configure git user
- ✅ Initialize repository
- ✅ Switch to main branch
- ✅ Create 21 organized commits
- ✅ Show commit history

---

### Option 2: Manual Commands

Ikuti instruksi di [GIT-COMMANDS.md](./GIT-COMMANDS.md)

---

## 📊 Commit Structure

Total: **21 Commits** terorganisir berdasarkan kategori:

### 1. Foundation (Commits 1-3)
- Project setup & configuration
- Documentation
- Database schema

### 2. Backend API (Commits 4-11)
- tRPC setup
- Authentication router
- Content management
- Workspace collaboration
- Scheduler
- Analytics
- Credit system
- SMM Boost service

### 3. AI & Integrations (Commits 12-13)
- AI services (OpenAI, Claude, TikTok Analyzer)
- Social media APIs (TikTok, Instagram, Twitter, Google Calendar)

### 4. Frontend Auth (Commits 14-17)
- NextAuth configuration
- Auth UI components
- Auth pages
- Route protection

### 5. Frontend UI (Commits 18-20)
- Landing page
- App layout & styling
- Next.js configuration

### 6. DevOps (Commit 21)
- CI/CD pipeline

---

## 🌿 Branch Strategy

### Main Branch
- `main` - Production-ready code
- All commits go here initially

### Future Branches (for development)
```bash
# Feature branches
git checkout -b feature/dashboard-ui
git checkout -b feature/content-creator
git checkout -b feature/analytics-charts

# Bug fix branches
git checkout -b fix/auth-redirect
git checkout -b fix/scheduler-timezone

# Release branches
git checkout -b release/v0.1.0
```

---

## 🚀 Push to GitHub

### First Time Setup

```bash
# 1. Create repository on GitHub
# Go to: https://github.com/new
# Name: kreatr-app
# Don't initialize with README (we already have one)

# 2. Add remote
git remote add origin https://github.com/yourusername/kreatr-app.git

# 3. Push to main
git push -u origin main

# 4. Verify
git remote -v
```

### Subsequent Pushes

```bash
# Push new commits
git push origin main

# Or simply
git push
```

---

## 📝 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance
- `ci`: CI/CD changes

### Examples:
```bash
feat(api): add user authentication
fix(ui): resolve button alignment issue
docs: update API documentation
chore: update dependencies
```

---

## 🔍 Useful Git Commands

### View History
```bash
# Compact view
git log --oneline --graph

# Detailed view
git log --stat

# Last 10 commits
git log --oneline -10

# Search commits
git log --grep="auth"
```

### Check Status
```bash
# Current status
git status

# Short status
git status -s

# Show changes
git diff
```

### Undo Changes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Discard local changes
git checkout -- <file>
```

### Branches
```bash
# List branches
git branch

# Create new branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Delete branch
git branch -d feature/old-feature
```

---

## 🛡️ Before Committing

### Checklist:
- [ ] Code compiles without errors
- [ ] No console.log() left in code
- [ ] Environment variables not committed
- [ ] Sensitive data removed
- [ ] Tests passing (if any)
- [ ] Linting passed

### Run Checks:
```bash
# Type check
bun run type-check

# Lint
bun run lint

# Format
bun run format

# Test
bun test
```

---

## 📦 What's Committed

### ✅ Included:
- Source code
- Configuration files
- Documentation
- Package manifests
- Scripts

### ❌ Excluded (via .gitignore):
- node_modules/
- .env files
- Build outputs (.next/, dist/)
- IDE settings
- OS files (.DS_Store)
- Logs
- Database files

---

## 🎯 Quick Reference

```bash
# Setup
git init
git checkout -b main

# Commit
git add .
git commit -m "feat: add new feature"

# Push
git push origin main

# Pull
git pull origin main

# Status
git status
git log --oneline
```

---

## 🆘 Troubleshooting

### "fatal: not a git repository"
```bash
git init
```

### "rejected - non-fast-forward"
```bash
git pull --rebase origin main
git push origin main
```

### "Permission denied (publickey)"
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy and add to GitHub Settings > SSH Keys
```

### Accidentally committed .env
```bash
# Remove from git but keep file
git rm --cached .env
git commit -m "fix: remove .env from git"

# Add to .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: add .env to gitignore"
```

---

## 📞 Need Help?

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com/
- Conventional Commits: https://www.conventionalcommits.org/

---

**Happy Committing! 🚀**
