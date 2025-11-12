# Requirements Document

## Introduction

Vibes Commit adalah AI-powered git commit manager yang membantu developer mengorganisir commits secara otomatis dari coding sessions yang chaotic. Tool ini dirancang untuk solo developers dalam "flow state" maupun tim yang berkolaborasi, dengan fokus pada automation, consistency, dan ease of use.

## Glossary

- **Vibes Commit**: AI-powered git commit management tool
- **Auto-Analysis**: Fitur untuk menganalisis git changes secara otomatis dan generate commit suggestions
- **Coding Session**: Periode waktu developer melakukan coding tanpa commit
- **Commit Batch**: Kumpulan commits yang diorganisir dalam satu script
- **Smart Grouping**: Algoritma untuk mengelompokkan file changes secara logical
- **Host Machine**: Identifier untuk mesin/developer yang berbeda
- **Conventional Commits**: Format commit message standar (feat:, fix:, docs:, dll)
- **Git Analyzer**: Komponen yang menganalisis git status dan diff
- **Session Tracker**: Komponen yang track coding sessions

## Requirements

### Requirement 1

**User Story:** Sebagai developer dalam flow state, saya ingin sistem otomatis menganalisis semua perubahan saya dan membuat commit batch yang terorganisir, sehingga saya tidak perlu manual menentukan apa yang harus di-commit.

#### Acceptance Criteria

1. WHEN a developer executes auto-analysis command, THE Vibes Commit SHALL scan all git changes (staged and unstaged)
2. THE Vibes Commit SHALL analyze file paths, content changes, and relationships between files
3. THE Vibes Commit SHALL categorize changes by type (feature, fix, docs, refactor, test, chore)
4. THE Vibes Commit SHALL group related changes into logical commits
5. THE Vibes Commit SHALL generate descriptive commit messages following conventional commits format

### Requirement 2

**User Story:** Sebagai developer, saya ingin melihat preview dari commit suggestions sebelum di-execute, sehingga saya bisa review dan adjust jika diperlukan.

#### Acceptance Criteria

1. WHEN auto-analysis completes, THE Vibes Commit SHALL display a formatted preview of suggested commits
2. THE Vibes Commit SHALL show file list for each suggested commit
3. THE Vibes Commit SHALL display commit type, scope, and description for each commit
4. THE Vibes Commit SHALL provide options to approve, edit, or cancel the suggestions
5. IF user chooses to edit, THEN THE Vibes Commit SHALL allow modification of commit messages and file groupings

### Requirement 3

**User Story:** Sebagai developer, saya ingin sistem dapat mendeteksi jenis perubahan secara intelligent, sehingga commit messages yang dihasilkan akurat dan meaningful.

#### Acceptance Criteria

1. THE Vibes Commit SHALL detect new files and classify as "feat" (new feature)
2. THE Vibes Commit SHALL detect bug fixes by analyzing file content and paths
3. THE Vibes Commit SHALL detect documentation changes (README, docs/, *.md files)
4. THE Vibes Commit SHALL detect refactoring by analyzing code structure changes
5. THE Vibes Commit SHALL detect configuration changes (package.json, config files, .env)
6. THE Vibes Commit SHALL detect test files and classify as "test"

### Requirement 4

**User Story:** Sebagai developer, saya ingin sistem mengelompokkan file changes secara logical berdasarkan module atau feature, sehingga setiap commit fokus pada satu concern.

#### Acceptance Criteria

1. THE Vibes Commit SHALL group files by directory structure (e.g., all files in src/auth/ together)
2. THE Vibes Commit SHALL group files by feature relationship (e.g., component + test + style)
3. THE Vibes Commit SHALL separate independent changes into different commits
4. THE Vibes Commit SHALL respect file dependencies when grouping
5. THE Vibes Commit SHALL limit each commit to a reasonable number of files (configurable, default: 10)

### Requirement 5

**User Story:** Sebagai developer, saya ingin track coding sessions saya, sehingga saya bisa melihat productivity dan history dari setiap session.

#### Acceptance Criteria

1. WHEN a developer starts auto-analysis, THE Vibes Commit SHALL detect or create a coding session
2. THE Vibes Commit SHALL record session metadata (start time, duration, files changed, commits created)
3. THE Vibes Commit SHALL allow developer to name sessions (e.g., "morning", "feature-auth", "bugfix")
4. THE Vibes Commit SHALL store session history in a local database or file
5. THE Vibes Commit SHALL provide command to list and view past sessions

### Requirement 6

**User Story:** Sebagai team lead, saya ingin setiap developer di tim menggunakan format commit yang konsisten, sehingga git history mudah dibaca dan di-maintain.

#### Acceptance Criteria

1. THE Vibes Commit SHALL enforce conventional commits format by default
2. THE Vibes Commit SHALL validate commit messages before creating commits
3. THE Vibes Commit SHALL provide configurable commit message templates
4. THE Vibes Commit SHALL support custom commit types beyond conventional commits
5. THE Vibes Commit SHALL allow team-wide configuration via config file

### Requirement 7

**User Story:** Sebagai developer, saya ingin menggunakan tool ini via simple CLI commands, sehingga workflow saya tidak terganggu.

#### Acceptance Criteria

1. THE Vibes Commit SHALL provide `vibes auto` command for auto-analysis
2. THE Vibes Commit SHALL provide `vibes list` command to list commit scripts
3. THE Vibes Commit SHALL provide `vibes run` command to execute specific script
4. THE Vibes Commit SHALL provide `vibes session` command to manage sessions
5. THE Vibes Commit SHALL provide `vibes config` command to manage configuration
6. THE Vibes Commit SHALL provide helpful error messages and suggestions
7. THE Vibes Commit SHALL support both interactive and non-interactive modes

### Requirement 8

**User Story:** Sebagai developer, saya ingin tool ini bekerja dengan AI assistant (seperti Kiro), sehingga saya bisa memberikan instruksi natural language.

#### Acceptance Criteria

1. THE Vibes Commit SHALL provide API for AI assistant integration
2. THE Vibes Commit SHALL accept natural language instructions for commit creation
3. THE Vibes Commit SHALL return structured data that AI can interpret
4. THE Vibes Commit SHALL support context-aware commit message generation
5. THE Vibes Commit SHALL allow AI to override or enhance auto-analysis results

### Requirement 9

**User Story:** Sebagai open source maintainer, saya ingin tool ini mudah di-install dan di-configure, sehingga adoption rate tinggi.

#### Acceptance Criteria

1. THE Vibes Commit SHALL be installable via npm/yarn/bun as global package
2. THE Vibes Commit SHALL provide `vibes init` command for initial setup
3. THE Vibes Commit SHALL auto-detect project structure and suggest configuration
4. THE Vibes Commit SHALL work without configuration (sensible defaults)
5. THE Vibes Commit SHALL provide interactive setup wizard for first-time users

### Requirement 10

**User Story:** Sebagai developer, saya ingin tool ini support multiple host machines, sehingga saya bisa track commits dari laptop, desktop, atau server yang berbeda.

#### Acceptance Criteria

1. THE Vibes Commit SHALL detect host machine automatically (hostname or custom identifier)
2. THE Vibes Commit SHALL organize commit scripts by host machine
3. THE Vibes Commit SHALL allow manual host machine specification
4. THE Vibes Commit SHALL sync host machine data across team (optional)
5. THE Vibes Commit SHALL provide command to list all host machines

### Requirement 11

**User Story:** Sebagai developer, saya ingin tool ini lightweight dan fast, sehingga tidak mengganggu workflow saya.

#### Acceptance Criteria

1. THE Vibes Commit SHALL complete auto-analysis in less than 5 seconds for typical projects
2. THE Vibes Commit SHALL have minimal dependencies (core Node.js modules preferred)
3. THE Vibes Commit SHALL not require external services for basic functionality
4. THE Vibes Commit SHALL cache analysis results for performance
5. THE Vibes Commit SHALL provide progress indicators for long-running operations

### Requirement 12

**User Story:** Sebagai developer, saya ingin tool ini extensible, sehingga saya bisa customize behavior sesuai kebutuhan project.

#### Acceptance Criteria

1. THE Vibes Commit SHALL support plugin system for custom analyzers
2. THE Vibes Commit SHALL support custom commit message templates
3. THE Vibes Commit SHALL support hooks (pre-analysis, post-analysis, pre-commit, post-commit)
4. THE Vibes Commit SHALL allow custom file grouping rules
5. THE Vibes Commit SHALL provide API for programmatic usage

### Requirement 13

**User Story:** Sebagai developer, saya ingin tool ini terintegrasi dengan CI/CD pipeline, sehingga commit quality bisa di-enforce otomatis.

#### Acceptance Criteria

1. THE Vibes Commit SHALL provide validation mode for CI/CD
2. THE Vibes Commit SHALL exit with appropriate error codes for CI/CD
3. THE Vibes Commit SHALL generate reports in machine-readable format (JSON)
4. THE Vibes Commit SHALL support dry-run mode for testing
5. THE Vibes Commit SHALL integrate with popular CI/CD platforms (GitHub Actions, GitLab CI)

### Requirement 14

**User Story:** Sebagai package maintainer, saya ingin comprehensive documentation, sehingga users bisa adopt tool dengan mudah.

#### Acceptance Criteria

1. THE Vibes Commit SHALL include README with quick start guide
2. THE Vibes Commit SHALL include API documentation with examples
3. THE Vibes Commit SHALL include contributing guidelines
4. THE Vibes Commit SHALL include troubleshooting guide
5. THE Vibes Commit SHALL include video tutorials or GIFs for common workflows
6. THE Vibes Commit SHALL include migration guide from other tools

### Requirement 15

**User Story:** Sebagai open source contributor, saya ingin codebase yang clean dan well-tested, sehingga saya bisa contribute dengan confidence.

#### Acceptance Criteria

1. THE Vibes Commit SHALL have unit tests with minimum 80% coverage
2. THE Vibes Commit SHALL have integration tests for main workflows
3. THE Vibes Commit SHALL use consistent code style (ESLint + Prettier)
4. THE Vibes Commit SHALL have clear code documentation (JSDoc)
5. THE Vibes Commit SHALL have automated testing in CI/CD
