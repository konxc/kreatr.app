# Contributing to Git Commit Script Manager

Thank you for your interest in contributing! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers
- ✅ Focus on what is best for the community
- ✅ Show empathy towards others

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- Bun >= 1.0.0
- Git
- Basic understanding of shell scripting

### Setup Development Environment

```bash
# 1. Clone repository
git clone https://github.com/your-org/kreatr.app.git
cd kreatr.app

# 2. Install dependencies
bun install

# 3. Test the system
bun run commit:help
bun run commit:dev0:list

# 4. Create your host directory
mkdir -p scripts/git-commits/$(hostname)
```

### Project Structure

```
scripts/
├── git-commits/          # Commit batch scripts
│   ├── dev0/            # Host-specific scripts
│   ├── dev1/
│   └── README.md        # User documentation
├── utils/
│   ├── commit-manager.js    # Main utility
│   └── script-template.sh   # Script template
└── .gitkeep

.kiro/specs/
├── git-commit-script-manager/  # Current implementation
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
└── vibes-commit-package/       # Future package
    ├── requirements.md
    ├── design.md
    └── tasks.md

docs/
├── GIT-COMMIT-MANAGER.md
├── CONTRIBUTING-GIT-COMMIT-MANAGER.md
└── ROADMAP-GIT-COMMIT-MANAGER.md
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Follow the spec-driven development process:

1. **Requirements** - Define what you're building
2. **Design** - Plan how to build it
3. **Tasks** - Break down into steps
4. **Implementation** - Write code
5. **Testing** - Verify it works
6. **Documentation** - Update docs

### 3. Test Your Changes

```bash
# Test manually
bun run commit:dev0:list
bun run commit:dev0:latest

# Test with different scenarios
# - Empty directory
# - Multiple scripts
# - Error cases
```

### 4. Commit Your Changes

Use the commit manager itself!

```bash
# Ask AI to create commit batch
"Buatkan commit batch untuk fitur [your-feature]"

# Or create manually
bun run commit:dev0:latest
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create Pull Request on GitHub.

## Coding Standards

### JavaScript Style

We follow standard JavaScript conventions:

```javascript
// ✅ Good
class CommitManager {
  constructor(host) {
    this.host = host;
    this.scriptsDir = path.join(__dirname, '..', 'git-commits', host);
  }

  async listScripts() {
    // Implementation
  }
}

// ❌ Bad
class commitManager {
  constructor(host){
    this.host=host
    this.scriptsDir=path.join(__dirname,'..','git-commits',host)
  }
  
  async listScripts(){
    // Implementation
  }
}
```

### Documentation

Use JSDoc for all functions:

```javascript
/**
 * List all commit batch scripts for the host
 * @returns {Promise<Array<ScriptInfo>>} Array of script info objects
 * @throws {CommitManagerError} If directory cannot be read
 * 
 * @example
 * const scripts = await manager.listScripts();
 * console.log(scripts[0].name); // 'commit-batch-20251112-063700.sh'
 */
async listScripts() {
  // Implementation
}
```

### Error Handling

Always use custom error classes:

```javascript
// ✅ Good
throw new CommitManagerError(
  'Script not found',
  1,
  {
    scriptName,
    suggestions: [
      'List available scripts with: bun run commit:dev0:list',
      'Check the script name spelling'
    ]
  }
);

// ❌ Bad
throw new Error('Script not found');
```

### Shell Scripts

Follow bash best practices:

```bash
#!/bin/bash
# Always include shebang

set -e  # Exit on error

# Use functions
commit() {
  local message="$1"
  local files="$2"
  
  # Validate inputs
  if [ -z "$files" ]; then
    echo "⚠️  Warning: No files specified"
    return
  fi
  
  # Execute
  git add $files
  git commit -m "$message"
}

# Clear output
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Git Commit Batch: Description"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

## Testing

### Manual Testing Checklist

Before submitting PR, test these scenarios:

#### List Command
- [ ] Empty directory
- [ ] Single script
- [ ] Multiple scripts
- [ ] Scripts with different timestamps
- [ ] Invalid host name

#### Latest Command
- [ ] No scripts available
- [ ] Single script
- [ ] Multiple scripts (should run newest)
- [ ] Script with errors

#### Run Command
- [ ] Full script name
- [ ] Partial script name
- [ ] Non-existent script
- [ ] Multiple matches
- [ ] Script without execute permission

#### Create Command
- [ ] Valid commit data
- [ ] Invalid commit data
- [ ] Empty commits array
- [ ] Missing description

#### Migrate Command
- [ ] No old scripts
- [ ] Single old script
- [ ] Multiple old scripts
- [ ] Scripts with special characters

### Automated Testing (Future)

```bash
# Run unit tests
bun test

# Run integration tests
bun test:integration

# Check coverage
bun test:coverage
```

## Documentation

### When to Update Documentation

Update documentation when you:
- Add new feature
- Change existing behavior
- Fix bug that affects usage
- Add new command or option
- Change configuration

### Documentation Files

- `scripts/git-commits/README.md` - User-facing documentation
- `docs/GIT-COMMIT-MANAGER.md` - Comprehensive guide
- `docs/CONTRIBUTING-GIT-COMMIT-MANAGER.md` - This file
- `.kiro/specs/*/design.md` - Technical design
- JSDoc comments - Code documentation

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots/GIFs when helpful
- Use emoji for visual hierarchy
- Keep it up-to-date

## Pull Request Process

### 1. PR Title

Use conventional commits format:

```
feat: add auto-analysis command
fix: resolve permission issue
docs: update README with examples
refactor: improve error handling
test: add unit tests for GitAnalyzer
chore: update dependencies
```

### 2. PR Description

Include:

```markdown
## Description
Brief description of changes

## Motivation
Why is this change needed?

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots or GIFs

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] No breaking changes (or documented)
```

### 3. Review Process

- At least one approval required
- All comments must be resolved
- CI checks must pass (when available)
- Documentation must be updated

### 4. Merge

- Squash and merge preferred
- Delete branch after merge
- Update changelog

## Release Process

### Versioning

We use Semantic Versioning (SemVer):

- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes

### Release Checklist

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Create git tag
- [ ] Create GitHub release
- [ ] Publish to npm (for package)
- [ ] Announce in team chat

### Changelog Format

```markdown
## [1.2.0] - 2025-11-12

### Added
- Auto-analysis command for AI-powered commit generation
- Session tracking for coding sessions
- Interactive mode for step-by-step approval

### Changed
- Improved error messages with suggestions
- Enhanced file grouping algorithm

### Fixed
- Permission issue with script execution
- Partial name matching bug

### Deprecated
- Old script format (will be removed in 2.0.0)
```

## Feature Requests

### How to Request Features

1. Check existing issues first
2. Create new issue with template:

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this needed? Who will use it?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Screenshots, examples, etc.
```

### Feature Prioritization

Features are prioritized based on:
- Impact on users
- Alignment with roadmap
- Implementation complexity
- Community interest

## Bug Reports

### How to Report Bugs

1. Check existing issues first
2. Create new issue with template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Environment
- OS: [e.g., macOS 14.0]
- Node version: [e.g., 20.0.0]
- Bun version: [e.g., 1.0.0]

## Additional Context
Logs, screenshots, etc.
```

## Questions?

- 📖 Read the documentation first
- 💬 Ask in team chat
- 🐛 Create issue for bugs
- 💡 Create issue for feature requests
- 📧 Email maintainers for sensitive issues

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing! 🎉
