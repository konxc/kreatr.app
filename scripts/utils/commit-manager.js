#!/usr/bin/env node

/**
 * Git Commit Script Manager
 * Manages batch git commit scripts organized by host machine
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Custom error class for commit manager operations
 */
class CommitManagerError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'CommitManagerError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Main CommitManager class
 * Handles all operations for managing git commit scripts
 */
class CommitManager {
  /**
   * @param {string} host - Host machine identifier (e.g., 'dev0', 'dev1')
   */
  constructor(host) {
    this.host = host;
    this.projectRoot = path.resolve(__dirname, '../..');
    this.scriptsDir = path.join(this.projectRoot, 'scripts', 'git-commits', host);
    this.utilsDir = path.join(this.projectRoot, 'scripts', 'utils');
    this.templatePath = path.join(this.utilsDir, 'script-template.sh');
  }

  /**
   * Ensure the scripts directory exists
   * @private
   */
  _ensureDirectoryExists() {
    if (!fs.existsSync(this.scriptsDir)) {
      fs.mkdirSync(this.scriptsDir, { recursive: true });
    }
  }

  /**
   * Validate host name (alphanumeric only, prevent path traversal)
   * @param {string} host - Host name to validate
   * @returns {boolean}
   * @private
   */
  _validateHostName(host) {
    return /^[a-zA-Z0-9_-]+$/.test(host);
  }

  /**
   * Get colored output for terminal
   * @param {string} text - Text to colorize
   * @param {string} color - Color name
   * @returns {string}
   * @private
   */
  _colorize(text, color) {
    const colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
    };
    return `${colors[color] || colors.reset}${text}${colors.reset}`;
  }

  /**
   * Format file size to human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string}
   * @private
   */
  _formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * Format date to readable format
   * @param {Date} date - Date object
   * @returns {string}
   * @private
   */
  _formatDate(date) {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  /**
   * List all commit batch scripts for the host
   * @returns {Promise<Array>} Array of script info objects
   */
  async listScripts() {
    this._ensureDirectoryExists();

    try {
      const files = fs.readdirSync(this.scriptsDir);
      const scripts = files
        .filter(file => {
          // Accept both new format (commit-batch-*) and old format (git-commit-*)
          return file.endsWith('.sh') && 
                 (file.startsWith('commit-batch-') || file.startsWith('git-commit-'));
        })
        .map(file => {
          const filePath = path.join(this.scriptsDir, file);
          const stats = fs.statSync(filePath);
          
          return {
            name: file,
            path: filePath,
            created: stats.birthtime,
            modified: stats.mtime,
            size: stats.size,
          };
        })
        .sort((a, b) => b.modified.getTime() - a.modified.getTime()); // Newest first

      return scripts;
    } catch (error) {
      throw new CommitManagerError(
        `Failed to list scripts: ${error.message}`,
        1,
        { originalError: error }
      );
    }
  }

  /**
   * Display scripts in a formatted table
   * @returns {Promise<void>}
   */
  async displayScriptList() {
    const scripts = await this.listScripts();

    if (scripts.length === 0) {
      console.log(this._colorize('\n📭 No commit batch scripts found', 'yellow'));
      console.log(this._colorize(`Directory: ${this.scriptsDir}`, 'cyan'));
      console.log(this._colorize('\n💡 Create a new script with: bun run commit:create', 'blue'));
      return;
    }

    console.log(this._colorize(`\n📋 Commit Batch Scripts for ${this.host}`, 'cyan'));
    console.log(this._colorize('━'.repeat(80), 'cyan'));
    console.log('');

    // Table header
    console.log(
      this._colorize('Name'.padEnd(40), 'white') +
      this._colorize('Modified'.padEnd(22), 'white') +
      this._colorize('Size'.padEnd(10), 'white')
    );
    console.log('─'.repeat(80));

    // Table rows
    scripts.forEach((script, index) => {
      const isLatest = index === 0;
      const nameColor = isLatest ? 'green' : 'white';
      const badge = isLatest ? ' 🌟' : '';
      
      console.log(
        this._colorize(script.name.padEnd(40), nameColor) +
        this._colorize(this._formatDate(script.modified).padEnd(22), 'cyan') +
        this._colorize(this._formatFileSize(script.size).padEnd(10), 'yellow') +
        badge
      );
    });

    console.log('');
    console.log(this._colorize(`Total: ${scripts.length} script(s)`, 'blue'));
    console.log(this._colorize(`\n💡 Run latest: bun run commit:${this.host}:latest`, 'blue'));
    console.log(this._colorize(`💡 Run specific: bun run commit:${this.host}:run <script-name>`, 'blue'));
    console.log('');
  }

  /**
   * Get the latest script based on modification time
   * @returns {Promise<string|null>} Path to latest script or null if none found
   */
  async getLatestScript() {
    const scripts = await this.listScripts();
    
    if (scripts.length === 0) {
      return null;
    }

    return scripts[0].path; // Already sorted by newest first
  }

  /**
   * Check and fix script permissions
   * @param {string} scriptPath - Path to script file
   * @returns {Promise<void>}
   * @private
   */
  async _ensureExecutable(scriptPath) {
    try {
      const stats = fs.statSync(scriptPath);
      const isExecutable = (stats.mode & fs.constants.S_IXUSR) !== 0;

      if (!isExecutable) {
        console.log(this._colorize('⚙️  Setting executable permissions...', 'yellow'));
        fs.chmodSync(scriptPath, '755');
      }
    } catch (error) {
      throw new CommitManagerError(
        `Failed to set permissions: ${error.message}`,
        4,
        { scriptPath, originalError: error }
      );
    }
  }

  /**
   * Execute a shell script
   * @param {string} scriptPath - Path to script to execute
   * @returns {Promise<void>}
   */
  async executeScript(scriptPath) {
    // Validate script exists
    if (!fs.existsSync(scriptPath)) {
      throw new CommitManagerError(
        `Script not found: ${path.basename(scriptPath)}`,
        1,
        {
          scriptPath,
          suggestions: [
            `Check available scripts with: bun run commit:${this.host}:list`,
            'Make sure the script name is correct',
          ],
        }
      );
    }

    // Ensure script is executable
    await this._ensureExecutable(scriptPath);

    // Execute script
    try {
      console.log(this._colorize(`\n🚀 Executing: ${path.basename(scriptPath)}`, 'cyan'));
      console.log(this._colorize('━'.repeat(80), 'cyan'));
      console.log('');

      execSync(`bash "${scriptPath}"`, {
        cwd: this.projectRoot,
        stdio: 'inherit',
      });

      console.log('');
      console.log(this._colorize('✅ Script execution completed successfully!', 'green'));
      console.log('');
    } catch (error) {
      throw new CommitManagerError(
        `Script execution failed: ${error.message}`,
        2,
        {
          scriptPath,
          originalError: error,
          suggestions: [
            'Check the script for syntax errors',
            'Make sure all files referenced in the script exist',
            'Review git status to see if there are uncommitted changes',
          ],
        }
      );
    }
  }

  /**
   * Execute the latest script
   * @returns {Promise<void>}
   */
  async executeLatest() {
    const latestScript = await this.getLatestScript();

    if (!latestScript) {
      throw new CommitManagerError(
        'No commit batch scripts found',
        1,
        {
          suggestions: [
            `Create a new script with: bun run commit:create`,
            `Check directory: ${this.scriptsDir}`,
          ],
        }
      );
    }

    await this.executeScript(latestScript);
  }

  /**
   * Find script by name (supports partial matching)
   * @param {string} scriptName - Script name or partial name
   * @returns {Promise<string|null>} Path to matched script or null
   * @private
   */
  async _findScriptByName(scriptName) {
    const scripts = await this.listScripts();

    // Exact match first
    let match = scripts.find(s => s.name === scriptName);
    if (match) return match.path;

    // Try with .sh extension if not provided
    if (!scriptName.endsWith('.sh')) {
      match = scripts.find(s => s.name === `${scriptName}.sh`);
      if (match) return match.path;
    }

    // Partial match
    const partialMatches = scripts.filter(s => s.name.includes(scriptName));
    if (partialMatches.length === 1) {
      return partialMatches[0].path;
    } else if (partialMatches.length > 1) {
      throw new CommitManagerError(
        `Multiple scripts match "${scriptName}"`,
        1,
        {
          matches: partialMatches.map(s => s.name),
          suggestions: [
            'Be more specific with the script name',
            'Use the full script name',
          ],
        }
      );
    }

    return null;
  }

  /**
   * Execute a specific script by name
   * @param {string} scriptName - Script name or partial name
   * @returns {Promise<void>}
   */
  async runSpecificScript(scriptName) {
    const scriptPath = await this._findScriptByName(scriptName);

    if (!scriptPath) {
      const scripts = await this.listScripts();
      throw new CommitManagerError(
        `Script not found: ${scriptName}`,
        1,
        {
          availableScripts: scripts.map(s => s.name),
          suggestions: [
            `List all scripts with: bun run commit:${this.host}:list`,
            'Check the script name spelling',
            'Use partial name matching (e.g., "20241112" to match "commit-batch-20241112-143022.sh")',
          ],
        }
      );
    }

    await this.executeScript(scriptPath);
  }

  /**
   * Generate timestamp-based filename
   * @returns {string} Filename in format: commit-batch-YYYYMMDD-HHMMSS.sh
   * @private
   */
  _generateFilename() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    
    return `commit-batch-${year}${month}${day}-${hours}${minutes}${seconds}.sh`;
  }

  /**
   * Validate script syntax (basic check)
   * @param {string} scriptContent - Script content to validate
   * @returns {boolean}
   * @private
   */
  _validateScriptSyntax(scriptContent) {
    // Basic validation checks
    if (!scriptContent.includes('#!/bin/bash')) {
      return false;
    }
    
    // Check for balanced quotes (simple check)
    const singleQuotes = (scriptContent.match(/'/g) || []).length;
    const doubleQuotes = (scriptContent.match(/"/g) || []).length;
    
    if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
      return false;
    }
    
    return true;
  }

  /**
   * Create a new commit batch script
   * @param {Object} commitData - Commit data object
   * @param {string} commitData.description - Batch description
   * @param {Array} commitData.commits - Array of commit objects with message and files
   * @returns {Promise<string>} Path to created script
   */
  async createScript(commitData) {
    this._ensureDirectoryExists();

    // Validate input
    if (!commitData.description) {
      throw new CommitManagerError(
        'Description is required',
        3,
        { suggestions: ['Provide a description for the commit batch'] }
      );
    }

    if (!commitData.commits || commitData.commits.length === 0) {
      throw new CommitManagerError(
        'At least one commit is required',
        3,
        { suggestions: ['Provide an array of commits with message and files'] }
      );
    }

    try {
      // Load template
      const template = fs.readFileSync(this.templatePath, 'utf8');

      // Generate filename
      const filename = this._generateFilename();
      const scriptPath = path.join(this.scriptsDir, filename);

      // Generate timestamp
      const timestamp = new Date().toISOString();

      // Generate commits section
      const commitsSection = commitData.commits
        .map(commit => `commit "${commit.message}" "${commit.files}"`)
        .join('\n');

      // Populate template
      let scriptContent = template
        .replace(/\{\{HOST\}\}/g, this.host)
        .replace(/\{\{TIMESTAMP\}\}/g, timestamp)
        .replace(/\{\{DESCRIPTION\}\}/g, commitData.description)
        .replace(/# \{\{COMMITS_PLACEHOLDER\}\}[\s\S]*?(?=\n\necho)/, commitsSection);

      // Validate syntax
      if (!this._validateScriptSyntax(scriptContent)) {
        throw new CommitManagerError(
          'Generated script has syntax errors',
          3,
          { suggestions: ['Check the commit data format', 'Review the template'] }
        );
      }

      // Write script file
      fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 });

      console.log(this._colorize('\n✅ Script created successfully!', 'green'));
      console.log(this._colorize(`📄 File: ${filename}`, 'cyan'));
      console.log(this._colorize(`📁 Path: ${scriptPath}`, 'cyan'));
      console.log(this._colorize(`📝 Commits: ${commitData.commits.length}`, 'cyan'));
      console.log(this._colorize(`\n💡 Run with: bun run commit:${this.host}:latest`, 'blue'));
      console.log('');

      return scriptPath;
    } catch (error) {
      if (error instanceof CommitManagerError) {
        throw error;
      }
      throw new CommitManagerError(
        `Failed to create script: ${error.message}`,
        3,
        { originalError: error }
      );
    }
  }

  /**
   * Migrate old git commit scripts to new structure
   * @param {string} pattern - Glob pattern for old scripts (default: 'git-commit-*.sh')
   * @returns {Promise<Object>} Migration report
   */
  async migrateScripts(pattern = 'git-commit-*.sh') {
    this._ensureDirectoryExists();

    const report = {
      success: true,
      scriptsFound: 0,
      scriptsMigrated: 0,
      backupPath: null,
      errors: [],
    };

    try {
      // Find old scripts in project root
      const files = fs.readdirSync(this.projectRoot);
      const oldScripts = files.filter(file => {
        // Match pattern: git-commit-*.sh
        return file.startsWith('git-commit-') && file.endsWith('.sh');
      });

      report.scriptsFound = oldScripts.length;

      if (oldScripts.length === 0) {
        console.log(this._colorize('\n📭 No old scripts found to migrate', 'yellow'));
        console.log(this._colorize(`Pattern: ${pattern}`, 'cyan'));
        console.log(this._colorize(`Directory: ${this.projectRoot}`, 'cyan'));
        console.log('');
        return report;
      }

      console.log(this._colorize(`\n🔄 Migrating ${oldScripts.length} script(s)...`, 'cyan'));
      console.log(this._colorize('━'.repeat(80), 'cyan'));
      console.log('');

      // Create backup directory
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(this.projectRoot, `backup-git-scripts-${timestamp}`);
      fs.mkdirSync(backupDir, { recursive: true });
      report.backupPath = backupDir;

      console.log(this._colorize(`📦 Backup directory: ${backupDir}`, 'blue'));
      console.log('');

      // Migrate each script
      for (const scriptFile of oldScripts) {
        try {
          const oldPath = path.join(this.projectRoot, scriptFile);
          const newPath = path.join(this.scriptsDir, scriptFile);
          const backupPath = path.join(backupDir, scriptFile);

          // Copy to backup
          fs.copyFileSync(oldPath, backupPath);
          console.log(this._colorize(`✓ Backed up: ${scriptFile}`, 'green'));

          // Move to new location
          fs.renameSync(oldPath, newPath);
          console.log(this._colorize(`✓ Migrated: ${scriptFile}`, 'green'));

          // Preserve permissions
          const stats = fs.statSync(newPath);
          fs.chmodSync(newPath, stats.mode);

          report.scriptsMigrated++;
        } catch (error) {
          report.errors.push({
            file: scriptFile,
            error: error.message,
          });
          console.log(this._colorize(`✗ Failed: ${scriptFile} - ${error.message}`, 'red'));
        }
      }

      console.log('');
      console.log(this._colorize('━'.repeat(80), 'cyan'));
      console.log(this._colorize(`✅ Migration completed!`, 'green'));
      console.log(this._colorize(`📊 Migrated: ${report.scriptsMigrated}/${report.scriptsFound}`, 'cyan'));
      console.log(this._colorize(`📦 Backup: ${backupDir}`, 'cyan'));
      
      if (report.errors.length > 0) {
        console.log(this._colorize(`⚠️  Errors: ${report.errors.length}`, 'yellow'));
        report.success = false;
      }

      console.log(this._colorize(`\n💡 View migrated scripts: bun run commit:${this.host}:list`, 'blue'));
      console.log('');

      return report;
    } catch (error) {
      report.success = false;
      throw new CommitManagerError(
        `Migration failed: ${error.message}`,
        5,
        {
          originalError: error,
          report,
          suggestions: [
            'Check file permissions',
            'Ensure no scripts are currently running',
            'Verify disk space is available',
          ],
        }
      );
    }
  }
}

/**
 * Display help text
 */
function displayHelp() {
  console.log(`
${'\x1b[36m'}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${'\x1b[0m'}
${'\x1b[36m'}                    Git Commit Script Manager${'\x1b[0m'}
${'\x1b[36m'}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${'\x1b[0m'}

${'\x1b[33m'}USAGE:${'\x1b[0m'}
  node scripts/utils/commit-manager.js <command> <host> [options]

${'\x1b[33m'}COMMANDS:${'\x1b[0m'}
  ${'\x1b[32m'}list <host>${'\x1b[0m'}              List all scripts for the specified host
  ${'\x1b[32m'}latest <host>${'\x1b[0m'}            Run the latest script for the specified host
  ${'\x1b[32m'}run <host> <name>${'\x1b[0m'}        Run a specific script by name
  ${'\x1b[32m'}create <host>${'\x1b[0m'}            Create a new script (interactive or with JSON data)
  ${'\x1b[32m'}migrate <host>${'\x1b[0m'}           Migrate old scripts to new structure
  ${'\x1b[32m'}help${'\x1b[0m'}                     Display this help message

${'\x1b[33m'}EXAMPLES:${'\x1b[0m'}
  ${'\x1b[90m'}# List all scripts for dev0${'\x1b[0m'}
  node scripts/utils/commit-manager.js list dev0

  ${'\x1b[90m'}# Run latest script for dev0${'\x1b[0m'}
  node scripts/utils/commit-manager.js latest dev0

  ${'\x1b[90m'}# Run specific script${'\x1b[0m'}
  node scripts/utils/commit-manager.js run dev0 commit-batch-20241112-143022.sh

  ${'\x1b[90m'}# Migrate old scripts${'\x1b[0m'}
  node scripts/utils/commit-manager.js migrate dev0

${'\x1b[33m'}NPM/BUN SHORTCUTS:${'\x1b[0m'}
  ${'\x1b[32m'}bun run commit:dev0:list${'\x1b[0m'}       List scripts for dev0
  ${'\x1b[32m'}bun run commit:dev0:latest${'\x1b[0m'}     Run latest script for dev0
  ${'\x1b[32m'}bun run commit:dev0:run${'\x1b[0m'} <name> Run specific script for dev0
  ${'\x1b[32m'}bun run commit:migrate${'\x1b[0m'}         Migrate old scripts

${'\x1b[33m'}HOST MACHINES:${'\x1b[0m'}
  Host identifiers (e.g., dev0, dev1, dev2) organize scripts by developer machine.
  Each host has its own directory: scripts/git-commits/<host>/

${'\x1b[36m'}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${'\x1b[0m'}
`);
}

/**
 * Main CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    displayHelp();
    process.exit(0);
  }

  const command = args[0];
  const host = args[1];

  try {
    // Validate host for commands that require it
    if (command !== 'help' && !host) {
      throw new CommitManagerError(
        'Host machine identifier is required',
        1,
        {
          suggestions: [
            'Specify a host (e.g., dev0, dev1)',
            'Example: node scripts/utils/commit-manager.js list dev0',
            'Run "node scripts/utils/commit-manager.js help" for more info',
          ],
        }
      );
    }

    const manager = new CommitManager(host);

    // Validate host name
    if (host && !manager._validateHostName(host)) {
      throw new CommitManagerError(
        `Invalid host name: ${host}`,
        1,
        {
          suggestions: [
            'Host names must be alphanumeric (letters, numbers, hyphens, underscores)',
            'Examples: dev0, dev1, developer-1, machine_a',
          ],
        }
      );
    }

    // Route commands
    switch (command) {
      case 'list':
        await manager.displayScriptList();
        break;

      case 'latest':
        await manager.executeLatest();
        break;

      case 'run':
        const scriptName = args[2];
        if (!scriptName) {
          throw new CommitManagerError(
            'Script name is required',
            1,
            {
              suggestions: [
                'Specify a script name',
                'Example: node scripts/utils/commit-manager.js run dev0 commit-batch-20241112.sh',
                `List available scripts: bun run commit:${host}:list`,
              ],
            }
          );
        }
        await manager.runSpecificScript(scriptName);
        break;

      case 'create':
        // Check if JSON data is provided via stdin or as argument
        const jsonData = args[2];
        if (jsonData) {
          try {
            const commitData = JSON.parse(jsonData);
            await manager.createScript(commitData);
          } catch (error) {
            throw new CommitManagerError(
              'Invalid JSON data',
              3,
              {
                originalError: error,
                suggestions: [
                  'Provide valid JSON with description and commits array',
                  'Example: \'{"description":"My batch","commits":[{"message":"feat: add feature","files":"src/*"}]}\'',
                ],
              }
            );
          }
        } else {
          console.log('\x1b[33m⚠️  Interactive mode not yet implemented\x1b[0m');
          console.log('\x1b[36mProvide JSON data as argument:\x1b[0m');
          console.log('node scripts/utils/commit-manager.js create dev0 \'{"description":"...","commits":[...]}\'');
        }
        break;

      case 'migrate':
        await manager.migrateScripts();
        break;

      default:
        throw new CommitManagerError(
          `Unknown command: ${command}`,
          1,
          {
            suggestions: [
              'Valid commands: list, latest, run, create, migrate, help',
              'Run "node scripts/utils/commit-manager.js help" for usage info',
            ],
          }
        );
    }

    process.exit(0);
  } catch (error) {
    if (error instanceof CommitManagerError) {
      console.error('\n\x1b[31m❌ Error (' + error.code + '): ' + error.message + '\x1b[0m\n');
      
      if (error.details.suggestions && error.details.suggestions.length > 0) {
        console.log('\x1b[34m💡 Suggestions:\x1b[0m');
        error.details.suggestions.forEach(s => console.log('  \x1b[36m- ' + s + '\x1b[0m'));
        console.log('');
      }

      if (error.details.availableScripts && error.details.availableScripts.length > 0) {
        console.log('\x1b[34m📋 Available scripts:\x1b[0m');
        error.details.availableScripts.forEach(s => console.log('  \x1b[36m- ' + s + '\x1b[0m'));
        console.log('');
      }

      if (error.details.matches && error.details.matches.length > 0) {
        console.log('\x1b[34m🔍 Matching scripts:\x1b[0m');
        error.details.matches.forEach(s => console.log('  \x1b[36m- ' + s + '\x1b[0m'));
        console.log('');
      }

      process.exit(error.code);
    }

    // Unexpected error
    console.error('\n\x1b[31m❌ Unexpected error: ' + error.message + '\x1b[0m\n');
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(99);
  }
}

// Run CLI if executed directly
if (require.main === module) {
  main();
}

module.exports = CommitManager;
