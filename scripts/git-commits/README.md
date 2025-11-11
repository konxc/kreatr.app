# Git Commit Script Manager

Sistem manajemen untuk batch git commit scripts yang terorganisir berdasarkan mesin host developer.

## 📁 Struktur Direktori

```
scripts/
├── git-commits/
│   ├── dev0/                    # Scripts untuk host machine dev0
│   │   ├── commit-batch-20241112-143022.sh
│   │   ├── commit-batch-20241112-150145.sh
│   │   └── commit-batch-20241112-163530.sh
│   ├── dev1/                    # Scripts untuk host machine dev1
│   │   └── commit-batch-20241112-120000.sh
│   └── README.md               # Dokumentasi ini
└── utils/
    ├── commit-manager.js       # Main utility script
    └── script-template.sh      # Template untuk script baru
```

## 🚀 Quick Start

### List Scripts

Melihat semua script yang tersedia untuk host machine Anda:

```bash
bun run commit:dev0:list
```

### Run Latest Script

Menjalankan script commit batch terbaru:

```bash
bun run commit:dev0:latest
```

### Run Specific Script

Menjalankan script tertentu berdasarkan nama:

```bash
bun run commit:dev0:run commit-batch-20241112-143022.sh

# Atau gunakan partial name matching
bun run commit:dev0:run 20241112-143022
```

## 📝 Naming Convention

Scripts menggunakan timestamp-based naming untuk memastikan urutan yang jelas:

- **Format**: `commit-batch-YYYYMMDD-HHMMSS.sh`
- **Contoh**: `commit-batch-20241112-143022.sh`
- **Benefit**: Alphabetical sorting = chronological sorting

## 🎯 Commands

### Dev0 (Host Machine)

```bash
# List all scripts
bun run commit:dev0:list

# Run latest script
bun run commit:dev0:latest

# Run specific script
bun run commit:dev0:run <script-name>
```

### Dev1 (Host Machine)

```bash
# List all scripts
bun run commit:dev1:list

# Run latest script
bun run commit:dev1:latest

# Run specific script
bun run commit:dev1:run <script-name>
```

### Utility Commands

```bash
# Migrate old scripts to new structure
bun run commit:migrate

# Show help
bun run commit:help
```

## 🤖 AI Assistant Integration

AI assistant dapat membuat script commit batch baru berdasarkan instruksi Anda.

### Example Workflow

```
You: "Buatkan script commit untuk fitur authentication dengan 5 commits"

AI: [Analyzes changes and generates commit list]
AI: [Creates script: commit-batch-20241112-143022.sh]
AI: "Script created! Run with: bun run commit:dev0:latest"
```

### Script Creation Format

AI assistant akan membuat script dengan format:

```javascript
{
  "description": "Authentication feature implementation",
  "commits": [
    {
      "message": "feat: add login component",
      "files": "apps/web/src/components/Login.tsx"
    },
    {
      "message": "feat: add auth API routes",
      "files": "apps/web/src/app/api/auth/*"
    }
  ]
}
```

## 🔄 Migration

Jika Anda memiliki script lama di root project (format: `git-commit-*.sh`), Anda dapat migrasi ke struktur baru:

```bash
bun run commit:migrate
```

Proses migration akan:
1. ✅ Menemukan semua script `git-commit-*.sh` di root
2. ✅ Membuat backup di folder `backup-git-scripts-<timestamp>/`
3. ✅ Memindahkan script ke `scripts/git-commits/dev0/`
4. ✅ Mempertahankan permissions dan timestamps

## 📋 Script Template

Setiap script yang dibuat menggunakan template standar:

```bash
#!/bin/bash
# Git Commit Batch Script
# Host: dev0
# Created: 2024-11-12T14:30:22.000Z
# Description: Feature implementation

set -e  # Exit on error

# Commit counter
COMMIT_COUNT=0

# Function to make commit
commit() {
  local message="$1"
  local files="$2"
  
  echo "📝 Commit $((++COMMIT_COUNT)): $message"
  git add $files
  git commit -m "$message"
  echo "✅ Done"
  echo ""
}

# Your commits here
commit "feat: add feature" "src/feature.ts"
commit "docs: update README" "README.md"

echo "🎉 Batch completed! ($COMMIT_COUNT commits)"
```

## 🛠️ Advanced Usage

### Direct CLI Usage

Anda juga bisa menggunakan commit-manager secara langsung:

```bash
# List scripts
node scripts/utils/commit-manager.js list dev0

# Run latest
node scripts/utils/commit-manager.js latest dev0

# Run specific
node scripts/utils/commit-manager.js run dev0 <script-name>

# Create new script (with JSON data)
node scripts/utils/commit-manager.js create dev0 '{"description":"...","commits":[...]}'

# Migrate old scripts
node scripts/utils/commit-manager.js migrate dev0

# Show help
node scripts/utils/commit-manager.js help
```

### Partial Name Matching

Anda tidak perlu mengetik nama lengkap script:

```bash
# Full name
bun run commit:dev0:run commit-batch-20241112-143022.sh

# Partial match (works!)
bun run commit:dev0:run 20241112-143022
bun run commit:dev0:run 143022
```

## 🎨 Features

- ✅ **Organized Structure**: Scripts terorganisir per host machine
- ✅ **Easy Commands**: Simple shortcuts via npm/bun scripts
- ✅ **Latest Script**: Otomatis jalankan script terbaru
- ✅ **Partial Matching**: Tidak perlu ketik nama lengkap
- ✅ **Migration Tool**: Mudah migrasi script lama
- ✅ **AI Integration**: AI assistant bisa buat script otomatis
- ✅ **Colored Output**: Terminal output yang mudah dibaca
- ✅ **Error Handling**: Error messages yang helpful
- ✅ **Auto Permissions**: Otomatis set executable permissions

## 🔒 Security

- ✅ Host name validation (alphanumeric only)
- ✅ Path traversal prevention
- ✅ Script syntax validation
- ✅ Safe path construction
- ✅ Restricted permissions (755)

## 📚 Troubleshooting

### Script Not Found

```bash
❌ Error: Script not found: my-script.sh

💡 Suggestions:
  - List all scripts with: bun run commit:dev0:list
  - Check the script name spelling
  - Use partial name matching
```

### No Scripts Available

```bash
📭 No commit batch scripts found
Directory: /path/to/scripts/git-commits/dev0

💡 Create a new script with: bun run commit:create
```

### Permission Errors

Script manager akan otomatis fix permissions. Jika masih error:

```bash
chmod +x scripts/git-commits/dev0/*.sh
```

## 🌟 Best Practices

1. **Descriptive Names**: Gunakan description yang jelas saat membuat script
2. **Atomic Commits**: Setiap commit fokus pada satu perubahan
3. **Conventional Commits**: Gunakan format `feat:`, `fix:`, `docs:`, dll
4. **Test First**: Review script sebelum execute
5. **Backup**: Migration otomatis buat backup, tapi manual backup juga bagus

## 🚦 Adding New Host Machines

Untuk menambah host machine baru (contoh: dev2):

1. **Buat directory**:
   ```bash
   mkdir -p scripts/git-commits/dev2
   ```

2. **Update package.json**:
   ```json
   {
     "scripts": {
       "commit:dev2:latest": "node scripts/utils/commit-manager.js latest dev2",
       "commit:dev2:list": "node scripts/utils/commit-manager.js list dev2",
       "commit:dev2:run": "node scripts/utils/commit-manager.js run dev2"
     }
   }
   ```

3. **Done!** Sekarang bisa gunakan:
   ```bash
   bun run commit:dev2:list
   bun run commit:dev2:latest
   ```

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check dokumentasi ini
2. Run `bun run commit:help` untuk usage info
3. Review error messages dan suggestions
4. Ask AI assistant untuk bantuan

---

**Happy Committing! 🚀**
