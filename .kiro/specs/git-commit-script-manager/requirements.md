# Requirements Document

## Introduction

Sistem manajemen script git commit yang terorganisir untuk memudahkan developer mengelola dan menjalankan batch commit scripts berdasarkan mesin host masing-masing. Sistem ini akan menyediakan struktur folder yang jelas dan command shortcuts untuk menjalankan script commit dengan mudah dari root project.

## Glossary

- **Git Commit Script Manager**: Sistem yang mengelola script git commit dalam struktur folder terorganisir
- **Host Machine**: Mesin/komputer yang digunakan oleh developer (contoh: dev0, dev1, dev2)
- **Batch Commit Script**: Script shell yang berisi serangkaian perintah git commit untuk multiple files
- **Command Shortcut**: Perintah npm/bun script yang dapat dipanggil dari root project
- **Script Registry**: Daftar script commit batch yang tersimpan untuk setiap host machine

## Requirements

### Requirement 1

**User Story:** Sebagai developer, saya ingin memiliki struktur folder yang terorganisir untuk menyimpan script git commit, sehingga script dapat dikelola dengan rapi berdasarkan mesin host yang saya gunakan.

#### Acceptance Criteria

1. THE Git Commit Script Manager SHALL create a directory structure at `scripts/git-commits/` in the project root
2. THE Git Commit Script Manager SHALL create subdirectories for each host machine using the pattern `scripts/git-commits/{host-name}/`
3. THE Git Commit Script Manager SHALL store batch commit scripts within the host-specific subdirectories
4. THE Git Commit Script Manager SHALL support the initial host machine named "dev0"
5. THE Git Commit Script Manager SHALL allow additional host machine directories to be created as needed

### Requirement 2

**User Story:** Sebagai developer, saya ingin dapat menjalankan script commit batch terbaru dengan perintah sederhana, sehingga saya tidak perlu mengingat path lengkap atau nama file script.

#### Acceptance Criteria

1. WHEN a developer executes `bun run commit:dev0:latest`, THE Git Commit Script Manager SHALL execute the most recently created batch commit script for dev0
2. THE Git Commit Script Manager SHALL determine the latest script based on file modification timestamp or naming convention
3. IF no batch commit scripts exist for the specified host, THEN THE Git Commit Script Manager SHALL display an error message indicating no scripts are available
4. THE Git Commit Script Manager SHALL execute the script from the project root directory
5. THE Git Commit Script Manager SHALL display the script execution output to the developer

### Requirement 3

**User Story:** Sebagai developer, saya ingin dapat melihat daftar semua script commit batch yang telah saya buat, sehingga saya dapat memilih script mana yang ingin dijalankan.

#### Acceptance Criteria

1. WHEN a developer executes `bun run commit:dev0:list`, THE Git Commit Script Manager SHALL display a list of all batch commit scripts for dev0
2. THE Git Commit Script Manager SHALL display each script with its filename, creation date, and file size
3. THE Git Commit Script Manager SHALL sort the list by creation date with newest first
4. IF no batch commit scripts exist for the specified host, THEN THE Git Commit Script Manager SHALL display a message indicating the directory is empty
5. THE Git Commit Script Manager SHALL format the output in a readable table or list format

### Requirement 4

**User Story:** Sebagai developer, saya ingin dapat menjalankan script commit batch tertentu berdasarkan nama atau nomor, sehingga saya memiliki kontrol penuh atas script mana yang dieksekusi.

#### Acceptance Criteria

1. WHEN a developer executes `bun run commit:dev0:run <script-name>`, THE Git Commit Script Manager SHALL execute the specified batch commit script
2. THE Git Commit Script Manager SHALL validate that the specified script exists before execution
3. IF the specified script does not exist, THEN THE Git Commit Script Manager SHALL display an error message with available script names
4. THE Git Commit Script Manager SHALL support both full filename and partial name matching
5. THE Git Commit Script Manager SHALL execute the script with proper permissions

### Requirement 5

**User Story:** Sebagai AI assistant, saya ingin dapat membuat script commit batch baru berdasarkan instruksi developer, sehingga developer dapat dengan mudah mengotomatisasi proses commit mereka.

#### Acceptance Criteria

1. THE Git Commit Script Manager SHALL provide a template for creating new batch commit scripts
2. THE Git Commit Script Manager SHALL generate script filenames using a timestamp-based naming convention (e.g., `commit-batch-YYYYMMDD-HHMMSS.sh`)
3. THE Git Commit Script Manager SHALL set executable permissions on newly created scripts
4. THE Git Commit Script Manager SHALL validate script syntax before saving
5. THE Git Commit Script Manager SHALL store the new script in the appropriate host machine directory

### Requirement 6

**User Story:** Sebagai developer, saya ingin script commit batch dapat dipanggil dengan mudah untuk host machine yang berbeda, sehingga tim dapat bekerja dengan konsisten di berbagai mesin sekalipun dengan bantuan ai assistant.

#### Acceptance Criteria

1. THE Git Commit Script Manager SHALL support multiple host machine identifiers (dev0, dev1, dev2, etc.)
2. WHEN a developer executes `bun run commit:{host}:latest`, THE Git Commit Script Manager SHALL execute the latest script for the specified host
3. WHEN a developer executes `bun run commit:{host}:list`, THE Git Commit Script Manager SHALL list scripts for the specified host
4. THE Git Commit Script Manager SHALL maintain separate script collections for each host machine
5. THE Git Commit Script Manager SHALL allow developers to easily add new host machine configurations

### Requirement 7

**User Story:** Sebagai developer, saya ingin script yang ada saat ini (git-commit-*.sh) dapat dimigrasikan ke struktur baru, sehingga saya tidak kehilangan script yang sudah ada.

#### Acceptance Criteria

1. THE Git Commit Script Manager SHALL provide a migration utility to move existing git commit scripts
2. THE Git Commit Script Manager SHALL identify all existing `git-commit-*.sh` files in the project root
3. THE Git Commit Script Manager SHALL move identified scripts to `scripts/git-commits/dev0/` directory
4. THE Git Commit Script Manager SHALL preserve the original script content and permissions
5. THE Git Commit Script Manager SHALL create a backup of original scripts before migration
