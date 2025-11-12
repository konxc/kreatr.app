# Vibes Commit - Quick Start Guide

## Installation

```bash
npm install -g @kreatr/vibes-commit
```

Or use locally in your project:

```bash
npm install --save-dev @kreatr/vibes-commit
```

## Basic Usage

### 1. Initialize

```bash
vibes init
```

This creates:
- `scripts/commits/` - Directory for batch scripts
- `.vibes/config.json` - Configuration file

### 2. Make Changes

Edit your code as usual. Make multiple changes across different files.

### 3. Auto-Commit

```bash
vibes auto
```

This will:
1. Analyze all changes
2. Group related files
3. Generate commit messages
4. Show preview
5. Ask for confirmation
6. Create commits

## Commands

### `vibes auto`

Auto-analyze and create commits.

```bash
# Interactive mode (default)
vibes auto

# Skip confirmation
vibes auto --yes

# Preview without committing
vibes auto --dry-run

# Generate batch script instead
vibes auto --script

# With session name
vibes auto --session "feature-auth"

# With host name
vibes auto --host "laptop"

# Max files per commit
vibes auto --max-files 5
```

### `vibes list`

List available batch scripts.

```bash
# List all scripts
vibes list

# Filter by host
vibes list --host laptop
```

### `vibes run`

Execute a batch script.

```bash
# Run by full name
vibes run commit-batch-laptop-2025-11-12.sh

# Run by partial name
vibes run laptop
```

### `vibes session`

Manage coding sessions.

```bash
# List session history
vibes session --list

# Show statistics
vibes session --stats

# Filter by host
vibes session --host laptop

# Limit results
vibes session --list --limit 5
```

### `vibes config`

Manage configuration.

```bash
# Show all config
vibes config --list

# Get specific value
vibes config --get maxFilesPerCommit

# Reset to defaults
vibes config --reset
```

## Configuration

Edit `.vibes/config.json`:

```json
{
  "maxFilesPerCommit": 10,
  "autoStage": false,
  "conventionalCommits": true,
  "messageMaxLength": 72,
  "groupingStrategy": "smart",
  "excludePatterns": [
    "node_modules/**",
    "dist/**",
    "build/**",
    ".git/**"
  ],
  "customRules": []
}
```

### Options

- `maxFilesPerCommit`: Maximum files per commit (default: 10)
- `autoStage`: Auto-stage files before commit (default: false)
- `conventionalCommits`: Use conventional commits format (default: true)
- `messageMaxLength`: Max subject line length (default: 72)
- `groupingStrategy`: How to group files - "directory", "feature", or "smart" (default: "smart")
- `excludePatterns`: Glob patterns to exclude
- `customRules`: Custom grouping rules (advanced)

## Examples

### Example 1: Quick Commit

```bash
# Make changes
echo "console.log('hello')" > src/index.ts

# Auto-commit
vibes auto --yes
```

### Example 2: Feature Development

```bash
# Start session
vibes auto --session "feature-login"

# Make changes to multiple files
# - src/components/Login.tsx
# - src/components/Login.test.tsx
# - src/services/auth.ts

# Analyze and commit
vibes auto

# Output:
# Found 2 commit(s):
# 1. feat(components): add login component with tests
# 2. feat(services): add authentication service
```

### Example 3: Generate Script

```bash
# Generate script without committing
vibes auto --script

# Review the script
cat scripts/commits/commit-batch-*.sh

# Execute when ready
vibes run commit-batch-*
```

### Example 4: View Statistics

```bash
# View session stats
vibes session --stats

# Output:
# Total Sessions: 5
# Total Commits: 23
# Total Files: 67
# Avg Commits/Session: 4.6
```

## Tips

1. **Use sessions** to track your work:
   ```bash
   vibes auto --session "fix-bug-123"
   ```

2. **Preview first** with dry-run:
   ```bash
   vibes auto --dry-run
   ```

3. **Generate scripts** for review:
   ```bash
   vibes auto --script
   ```

4. **Adjust max files** for large changes:
   ```bash
   vibes auto --max-files 20
   ```

5. **Check config** before starting:
   ```bash
   vibes config --list
   ```

## Commit Types

Vibes automatically detects commit types:

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test files
- `chore`: Build/config changes
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

## Troubleshooting

### No changes detected

```bash
# Make sure you have unstaged changes
git status

# Or stage files first
git add .
vibes auto
```

### Config not found

```bash
# Initialize first
vibes init
```

### Script not executable

```bash
# Make script executable
chmod +x scripts/commits/*.sh
```

## Next Steps

- Read [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md) for features
- Read [COMPLETION-SUMMARY.md](./COMPLETION-SUMMARY.md) for overview
- Check [README.md](./README.md) for detailed documentation
- View [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute

## Support

- Issues: https://github.com/kreatr/vibes-commit/issues
- Docs: https://github.com/kreatr/vibes-commit#readme
