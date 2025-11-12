#!/usr/bin/env node

/**
 * Vibes Commit CLI
 * Main entry point for the command-line interface
 */

import { Command } from 'commander';
import { Orchestrator } from './core/orchestrator';
import { SessionTracker } from './core/session-tracker';
import { ConfigManager } from './core/config-manager';
import { Logger } from './utils/logger';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

program
  .name('vibes')
  .description('AI-powered git commit manager')
  .version('0.1.0');

/**
 * vibes auto - Auto-analyze and create commits
 */
program
  .command('auto')
  .description('Automatically analyze changes and create commits')
  .option('-s, --session <name>', 'Session name')
  .option('-h, --host <name>', 'Host machine name')
  .option('-m, --max-files <number>', 'Max files per commit', '10')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('--dry-run', 'Preview without creating commits')
  .option('--script', 'Generate batch script instead of direct commits')
  .action(async (options) => {
    try {
      const config = new ConfigManager();
      const orchestrator = new Orchestrator({
        sessionName: options.session,
        host: options.host,
        maxFilesPerCommit: parseInt(options.maxFiles) || config.get('maxFilesPerCommit'),
        interactive: !options.yes,
        dryRun: options.dryRun,
      });

      Logger.header('🔍 Analyzing changes...');
      const plans = await orchestrator.analyze();

      Logger.section(`Found ${plans.length} commit(s) to create:`);
      console.log('');

      // Display plans
      plans.forEach((plan) => {
        const msg = plan.message;
        Logger.commit(msg.type, msg.scope, msg.subject);
        plan.group.files.forEach((file) => {
          const diff = plan.diffs.find((d) => d.file === file);
          if (diff) {
            const stats = `(+${diff.additions}/-${diff.deletions})`;
            Logger.file(diff.status, file, stats);
          }
        });
        console.log('');
      });

      if (options.dryRun) {
        Logger.warning('[DRY RUN] No commits created');
        return;
      }

      // Confirm if interactive
      if (!options.yes) {
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        const answer = await new Promise<string>((resolve) => {
          readline.question('Proceed with commits? (y/n): ', resolve);
        });
        readline.close();

        if (answer.toLowerCase() !== 'y') {
          Logger.info('Cancelled');
          return;
        }
      }

      // Execute commits
      if (options.script) {
        const scriptPath = await orchestrator.generateBatchScript(plans);
        Logger.success(`Batch script generated: ${scriptPath}`);
        Logger.dim(`Run: bash ${scriptPath}`);
      } else {
        Logger.section('Creating commits...');
        await orchestrator.executeCommits(plans);
        Logger.success('All commits created successfully!');
      }

      await orchestrator.endSession();
    } catch (error: any) {
      Logger.error(error.message);
      process.exit(1);
    }
  });

/**
 * vibes list - List batch scripts
 */
program
  .command('list')
  .description('List available commit batch scripts')
  .option('-h, --host <name>', 'Filter by host')
  .action(async (options) => {
    try {
      const scriptsDir = path.join(process.cwd(), 'scripts', 'commits');

      if (!fs.existsSync(scriptsDir)) {
        console.log('No batch scripts found');
        return;
      }

      const files = fs
        .readdirSync(scriptsDir)
        .filter((f) => f.endsWith('.sh'))
        .filter((f) => !options.host || f.includes(options.host));

      if (files.length === 0) {
        console.log('No batch scripts found');
        return;
      }

      console.log('Available batch scripts:\n');
      files.forEach((file, i) => {
        const filePath = path.join(scriptsDir, file);
        const stats = fs.statSync(filePath);
        console.log(`${i + 1}. ${file}`);
        console.log(`   Modified: ${stats.mtime.toLocaleString()}`);
        console.log('');
      });
    } catch (error: any) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

/**
 * vibes run - Execute a batch script
 */
program
  .command('run')
  .description('Execute a commit batch script')
  .argument('<script>', 'Script name or path')
  .action(async (scriptName) => {
    try {
      let scriptPath = scriptName;

      // If not a full path, look in scripts/commits
      if (!path.isAbsolute(scriptName)) {
        const scriptsDir = path.join(process.cwd(), 'scripts', 'commits');
        scriptPath = path.join(scriptsDir, scriptName);

        // Try to find partial match
        if (!fs.existsSync(scriptPath)) {
          const files = fs.readdirSync(scriptsDir).filter((f) => f.includes(scriptName));
          if (files.length === 1) {
            scriptPath = path.join(scriptsDir, files[0]);
          } else if (files.length > 1) {
            console.error('Multiple scripts match. Please be more specific:');
            files.forEach((f) => console.log(`  - ${f}`));
            process.exit(1);
          }
        }
      }

      if (!fs.existsSync(scriptPath)) {
        console.error(`Script not found: ${scriptPath}`);
        process.exit(1);
      }

      console.log(`Executing: ${scriptPath}\n`);

      const orchestrator = new Orchestrator();
      await orchestrator.executeBatchScript(scriptPath);

      console.log('\n✓ Script executed successfully!');
    } catch (error: any) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

/**
 * vibes session - Manage sessions
 */
program
  .command('session')
  .description('Manage coding sessions')
  .option('-l, --list', 'List session history')
  .option('-s, --stats', 'Show session statistics')
  .option('-h, --host <name>', 'Filter by host')
  .option('--limit <number>', 'Limit results', '10')
  .action(async (options) => {
    try {
      const tracker = new SessionTracker();

      if (options.stats) {
        const stats = await tracker.getSessionStats(options.host);
        console.log('Session Statistics:\n');
        console.log(`Total Sessions: ${stats.totalSessions}`);
        console.log(`Total Commits: ${stats.totalCommits}`);
        console.log(`Total Files: ${stats.totalFiles}`);
        console.log(`Total Lines: ${stats.totalLines}`);
        console.log(`Avg Commits/Session: ${stats.averageCommitsPerSession.toFixed(1)}`);
        console.log(`Avg Duration: ${tracker.formatDuration(stats.averageDuration)}`);
      } else {
        const sessions = await tracker.getSessionHistory(parseInt(options.limit), options.host);

        if (sessions.length === 0) {
          console.log('No sessions found');
          return;
        }

        console.log('Session History:\n');
        sessions.forEach((session, i) => {
          console.log(`${i + 1}. ${session.name}`);
          console.log(`   Host: ${session.host}`);
          console.log(`   Started: ${session.startTime.toLocaleString()}`);
          if (session.endTime) {
            console.log(`   Duration: ${tracker.formatDuration(session.duration || 0)}`);
          }
          console.log(`   Commits: ${session.commitsCreated}, Files: ${session.filesChanged}`);
          console.log('');
        });
      }
    } catch (error: any) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

/**
 * vibes config - Manage configuration
 */
program
  .command('config')
  .description('Manage configuration')
  .option('-l, --list', 'List all configuration')
  .option('-g, --get <key>', 'Get configuration value')
  .option('-s, --set <key> <value>', 'Set configuration value')
  .option('--reset', 'Reset to default configuration')
  .action(async (options) => {
    try {
      const config = new ConfigManager();

      if (options.reset) {
        config.reset();
        config.save();
        Logger.success('Configuration reset to defaults');
        return;
      }

      if (options.get) {
        const value = config.get(options.get as any);
        console.log(JSON.stringify(value, null, 2));
        return;
      }

      if (options.set) {
        // This would need proper parsing for complex values
        Logger.warning('Set command not fully implemented yet');
        Logger.info('Please edit config file directly: ' + config.getConfigPath());
        return;
      }

      // Default: list all config
      Logger.header('Configuration');
      const currentConfig = config.getConfig();
      console.log(JSON.stringify(currentConfig, null, 2));
      console.log('');
      Logger.dim(`Config file: ${config.getConfigPath()}`);
    } catch (error: any) {
      Logger.error(error.message);
      process.exit(1);
    }
  });

/**
 * vibes init - Initialize vibes in project
 */
program
  .command('init')
  .description('Initialize vibes in current project')
  .action(async () => {
    try {
      const cwd = process.cwd();

      Logger.header('Initializing Vibes...');

      // Create directories
      const dirs = ['scripts/commits', '.vibes'];

      for (const dir of dirs) {
        const dirPath = path.join(cwd, dir);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
          Logger.success(`Created ${dir}/`);
        }
      }

      // Create config file
      ConfigManager.createDefaultConfig(cwd);
      Logger.success('Created configuration file');

      Logger.header('✓ Vibes initialized successfully!');
      Logger.section('Next steps:');
      Logger.dim('  1. Make some changes to your code');
      Logger.dim('  2. Run: vibes auto');
    } catch (error: any) {
      Logger.error(error.message);
      process.exit(1);
    }
  });

program.parse();
