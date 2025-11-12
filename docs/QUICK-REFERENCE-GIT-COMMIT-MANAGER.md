# 🚀 Quick Reference: Git Commit Script Manager

> Cheat sheet untuk daily usage

## 📌 Most Used Commands

```bash
# List scripts
bun run commit:dev0:list

# Run latest
bun run commit:dev0:latest

# Run specific
bun run commit:dev0:run <name>

# Help
bun run commit:help
```

## 🎯 Common Workflows

### Create & Execute Commits

```bash
# 1. Ask AI to create script
"Buatkan commit batch untuk perubahan saya"

# 2. Review script
bun run commit:dev0:list

# 3. Execute
bun run commit:dev0:latest
```

### Find & Run Old Script

```bash
# List all scripts
bun run commit:dev0:list

# Run by partial name
bun run commit:dev0:run 20251112
```

### Migrate Old Scripts

```bash
# One-time migration
bun run commit:migrate

# Check results
bun run commit:dev0:list
```

## 💡 AI Prompts

### Basic

```
"Buatkan commit batch untuk perubahan saya"
"Auto commit"
"Analisis dan commit"
```

### Detailed

```
"Buatkan commit batch dengan 5 commits untuk fitur authentication"

"Pisahkan commits berdasarkan: setup, implementation, tests, docs"

"Buat commits dengan conventional format untuk semua perubahan"
```

### Custom

```
"Buatkan commit batch:
1. Setup struktur folder
2. Implementasi core features
3. Tambah tests
4. Update dokumentasi"
```

## 🔧 Direct CLI Usage

```bash
# List
node scripts/utils/commit-manager.js list dev0

# Latest
node scripts/utils/commit-manager.js latest dev0

# Run
node scripts/utils/commit-manager.js run dev0 <name>

# Migrate
node scripts/utils/commit-manager.js migrate dev0

# Help
node scripts/utils/commit-manager.js help
```

## 📁 File Locations

```
scripts/
├── git-commits/
│   ├── dev0/              # Your scripts
│   ├── dev1/              # Team member 1
│   └── dev2/              # Team member 2
└── utils/
    ├── commit-manager.js  # Main utility
    └── script-template.sh # Template
```

## 🎨 Script Template

```bash
#!/bin/bash
set -e

commit() {
  local message="$1"
  local files="$2"
  git add $files
  git commit -m "$message"
}

commit "feat: add feature" "src/*"
commit "docs: update README" "README.md"
```

## 📝 Commit Message Format

```bash
# Type
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation
refactor: # Code refactoring
test:     # Tests
chore:    # Maintenance

# Examples
feat: add user authentication
fix: resolve login issue
docs: update API documentation
refactor: improve code structure
test: add unit tests
chore: update dependencies
```

## ⚡ Keyboard Shortcuts

### In Terminal

```bash
# Previous command
↑

# Search history
Ctrl+R

# Clear screen
Ctrl+L

# Cancel
Ctrl+C
```

### Aliases (Add to ~/.bashrc or ~/.zshrc)

```bash
# Quick aliases
alias cl="bun run commit:dev0:list"
alias cr="bun run commit:dev0:latest"
alias ch="bun run commit:help"

# With host variable
export COMMIT_HOST="dev0"
alias cl="bun run commit:$COMMIT_HOST:list"
alias cr="bun run commit:$COMMIT_HOST:latest"
```

## 🐛 Troubleshooting

### Script Not Found
```bash
# Check available scripts
bun run commit:dev0:list

# Use correct name
bun run commit:dev0:run <correct-name>
```

### Permission Denied
```bash
# Fix permissions
chmod +x scripts/git-commits/dev0/*.sh

# Or let manager fix it
bun run commit:dev0:latest
```

### No Scripts
```bash
# Ask AI to create one
"Buatkan commit batch"

# Or check other hosts
bun run commit:dev1:list
```

## 🎯 Best Practices

### ✅ Do

- Commit regularly (every 1-2 hours)
- Use descriptive messages
- Group related files
- Review before execute
- Keep commits atomic

### ❌ Don't

- Wait days before committing
- Use vague messages
- Mix unrelated changes
- Skip review
- Create massive commits

## 📊 Quick Stats

```bash
# Count scripts
ls scripts/git-commits/dev0/*.sh | wc -l

# Latest script
ls -t scripts/git-commits/dev0/*.sh | head -1

# Total commits in script
grep -c "^commit " scripts/git-commits/dev0/latest.sh
```

## 🔗 Links

- 📖 [Full Documentation](./GIT-COMMIT-MANAGER.md)
- 🤝 [Contributing Guide](./CONTRIBUTING-GIT-COMMIT-MANAGER.md)
- 🗺️ [Roadmap](./ROADMAP-GIT-COMMIT-MANAGER.md)
- 📋 [README](../scripts/git-commits/README.md)

## 💬 Get Help

```bash
# Built-in help
bun run commit:help

# Ask AI
"How do I use git commit manager?"

# Check docs
cat docs/GIT-COMMIT-MANAGER.md
```

## 🎓 Learning Path

1. **Beginner**: Use `commit:latest` command
2. **Intermediate**: Ask AI to create scripts
3. **Advanced**: Create custom scripts manually
4. **Expert**: Contribute to the project

## 📱 Mobile Quick Access

Save these commands in your notes app:

```
List: bun run commit:dev0:list
Run: bun run commit:dev0:latest
Help: bun run commit:help
```

---

**Print this page and keep it handy! 📄**
