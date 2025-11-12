# Implementation Plan

- [x] 1. Setup project structure and directories
  - Create `scripts/git-commits/` directory structure
  - Create `scripts/utils/` directory for utility scripts
  - Create initial `dev0` host directory
  - Add `.gitkeep` files to maintain empty directories
  - Update `.gitignore` to exclude temporary files and backups
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Create script template
  - [x] 2.1 Implement shell script template with placeholders
    - Create `scripts/utils/script-template.sh` with template structure
    - Include header section with metadata (host, timestamp, description)
    - Add commit helper function
    - Add error handling with `set -e`
    - Include progress indicators and summary output
    - _Requirements: 5.1_

- [x] 3. Implement commit manager utility
  - [x] 3.1 Create CommitManager class structure
    - Create `scripts/utils/commit-manager.js` file
    - Implement class constructor with host parameter
    - Setup directory path management
    - Add required Node.js imports (fs, path, child_process)
    - _Requirements: 2.4, 3.4_

  - [x] 3.2 Implement script listing functionality
    - Write `listScripts()` method to read directory contents
    - Parse script metadata (name, created date, size)
    - Sort scripts by timestamp (newest first)
    - Format output as readable table
    - Handle empty directory case
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 3.3 Implement latest script execution
    - Write `getLatestScript()` method to find newest script
    - Implement `executeScript()` method to run shell scripts
    - Add permission checking and auto-fix
    - Capture and display script output
    - Handle execution errors gracefully
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 3.4 Implement specific script execution
    - Write `runSpecificScript()` method with name parameter
    - Add script name validation and existence check
    - Support partial name matching
    - Provide helpful error messages with available scripts
    - Execute script with proper permissions
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 3.5 Implement script creation functionality
    - Write `createScript()` method with commit data parameter
    - Generate timestamp-based filename
    - Load and populate template with data
    - Write script file to host directory
    - Set executable permissions (chmod +x)
    - Return created script path
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [x] 3.6 Implement migration utility
    - Write `migrateScripts()` method to find old scripts
    - Identify `git-commit-*.sh` files in project root
    - Create backup directory with timestamp
    - Copy scripts to backup location
    - Move scripts to new structure under dev0
    - Preserve file permissions and timestamps
    - Generate migration report
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 3.7 Add CLI interface and command routing
    - Parse command line arguments (command, host, options)
    - Implement command router (list, latest, run, create, migrate)
    - Add help text and usage information
    - Handle invalid commands with suggestions
    - Add colored output for better readability
    - _Requirements: 2.1, 3.1, 4.1, 5.1, 6.1, 6.2, 6.3, 7.1_

  - [x] 3.8 Implement error handling and validation
    - Create custom error classes with error codes
    - Add script syntax validation
    - Validate host names (alphanumeric only)
    - Prevent path traversal attacks
    - Add helpful error messages with suggestions
    - _Requirements: 2.3, 4.3, 5.4_

- [x] 4. Update package.json with script shortcuts
  - [x] 4.1 Add commit management scripts for dev0
    - Add `commit:dev0:latest` script
    - Add `commit:dev0:list` script
    - Add `commit:dev0:run` script with parameter support
    - _Requirements: 2.1, 3.1, 4.1, 6.2, 6.3_

  - [x] 4.2 Add commit management scripts for dev1
    - Add `commit:dev1:latest` script
    - Add `commit:dev1:list` script
    - Add `commit:dev1:run` script with parameter support
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 4.3 Add utility scripts
    - Add `commit:migrate` script for migration
    - Add `commit:create` script for creating new scripts
    - Add `commit:help` script for usage information
    - _Requirements: 7.1_

- [x] 5. Create initial documentation
  - [x] 5.1 Create README for scripts directory
    - Document directory structure
    - Explain naming conventions
    - Provide usage examples for all commands
    - Include troubleshooting section
    - Add examples for AI assistant integration
    - _Requirements: 2.1, 3.1, 4.1, 5.1, 6.2, 6.3_

  - [x] 5.2 Add inline code documentation
    - Add JSDoc comments to all functions
    - Document parameters and return values
    - Include usage examples in comments
    - _Requirements: All_

- [x] 6. Perform migration of existing scripts
  - [x] 6.1 Run migration utility on existing scripts
    - Execute migration command
    - Verify all scripts moved correctly
    - Check backup was created
    - Test migrated scripts execute properly
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 6.2 Update existing documentation references
    - Update GIT-README.md with new commands
    - Update COMMIT-NOW.md with new workflow
    - Update GIT-SCRIPTS-INDEX.md with new structure
    - Add deprecation notices for old script locations
    - _Requirements: 7.1_

- [x] 7. Create example scripts and test scenarios
  - [x] 7.1 Create example commit batch script
    - Generate example script using create command
    - Include 3-5 sample commits
    - Add descriptive commit messages
    - Test execution of example script
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [x] 7.2 Test all command shortcuts
    - Test `bun run commit:dev0:list` command
    - Test `bun run commit:dev0:latest` command
    - Test `bun run commit:dev0:run <name>` command
    - Test `bun run commit:dev1:*` commands
    - Test `bun run commit:migrate` command
    - Verify all commands work from project root
    - _Requirements: 2.1, 3.1, 4.1, 6.2, 6.3, 7.1_

  - [x] 7.3 Test error scenarios
    - Test with non-existent script name
    - Test with empty scripts directory
    - Test with invalid host name
    - Test with non-executable script
    - Verify error messages are helpful
    - _Requirements: 2.3, 4.3_

- [x] 8. Add support for additional host machines
  - [x] 8.1 Create dev1 and dev2 directories
    - Create `scripts/git-commits/dev1/` directory
    - Create `scripts/git-commits/dev2/` directory
    - Add `.gitkeep` files
    - _Requirements: 6.1, 6.4, 6.5_

  - [x] 8.2 Document how to add new host machines
    - Add instructions to README
    - Provide package.json script template
    - Include example for adding dev3, dev4, etc.
    - _Requirements: 6.5_
