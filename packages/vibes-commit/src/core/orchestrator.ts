/**
 * Orchestrator
 * Coordinates all components and manages the main workflow
 */

import { GitAnalyzer } from './git-analyzer';
import { SmartGrouper } from './smart-grouper';
import { MessageGenerator } from './message-generator';
import { SessionTracker } from './session-tracker';
import { ConfigManager } from './config-manager';
import { CommitGroup, CommitMessage, FileDiff } from '../types';
import { Logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface OrchestratorOptions {
  cwd?: string;
  sessionName?: string;
  host?: string;
  maxFilesPerCommit?: number;
  interactive?: boolean;
  dryRun?: boolean;
}

export interface CommitPlan {
  group: CommitGroup;
  message: CommitMessage;
  diffs: FileDiff[];
}

export class Orchestrator {
  private analyzer: GitAnalyzer;
  private grouper: SmartGrouper;
  private generator: MessageGenerator;
  private tracker: SessionTracker;
  private config: ConfigManager;
  private options: Required<OrchestratorOptions>;

  constructor(options: OrchestratorOptions = {}) {
    this.config = new ConfigManager(options.cwd);

    this.options = {
      cwd: options.cwd || process.cwd(),
      sessionName: options.sessionName || '',
      host: options.host || '',
      maxFilesPerCommit: options.maxFilesPerCommit || this.config.get('maxFilesPerCommit'),
      interactive: options.interactive ?? true,
      dryRun: options.dryRun ?? false,
    };

    this.analyzer = new GitAnalyzer(this.options.cwd);
    this.grouper = new SmartGrouper(this.analyzer, this.options.maxFilesPerCommit);
    this.generator = new MessageGenerator(this.config.get('messageMaxLength'));
    this.tracker = new SessionTracker();
  }

  /**
   * Run full auto-analysis workflow
   */
  async analyze(): Promise<CommitPlan[]> {
    // Start session
    await this.tracker.startSession(this.options.sessionName, this.options.host);

    // Analyze git status
    const status = await this.analyzer.analyzeStatus();
    
    if (status.staged.length === 0 && status.unstaged.length === 0) {
      throw new Error('No changes to commit');
    }

    // Get all changed files
    const allFiles = [...new Set([...status.staged, ...status.unstaged])];
    
    // Get diffs for all files
    const diffs = await this.analyzer.getDiff(allFiles);

    if (diffs.length === 0) {
      throw new Error('No file diffs found');
    }

    // Group files intelligently
    const groups = await this.grouper.groupFiles(diffs);

    // Generate commit messages for each group
    const plans: CommitPlan[] = [];
    for (const group of groups) {
      const groupDiffs = diffs.filter(d => group.files.includes(d.file));
      const message = await this.generator.generateMessage(group, groupDiffs);
      
      plans.push({
        group,
        message,
        diffs: groupDiffs,
      });
    }

    // Update session stats
    await this.tracker.updateSessionStats({
      filesChanged: diffs.length,
      linesAdded: diffs.reduce((sum, d) => sum + d.additions, 0),
      linesDeleted: diffs.reduce((sum, d) => sum + d.deletions, 0),
    });

    return plans;
  }

  /**
   * Generate batch script from commit plans
   */
  async generateBatchScript(plans: CommitPlan[]): Promise<string> {
    const session = this.tracker.getCurrentSession();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const host = session?.host || 'unknown';
    
    const scriptName = `commit-batch-${host}-${timestamp}.sh`;
    const scriptPath = path.join(this.options.cwd, 'scripts', 'commits', scriptName);

    // Ensure directory exists
    const scriptDir = path.dirname(scriptPath);
    if (!fs.existsSync(scriptDir)) {
      fs.mkdirSync(scriptDir, { recursive: true });
    }

    // Generate script content
    const scriptContent = this.buildScriptContent(plans, session?.name || 'unknown');

    // Write script
    fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 });

    return scriptPath;
  }

  /**
   * Build script content
   */
  private buildScriptContent(plans: CommitPlan[], sessionName: string): string {
    const lines: string[] = [];
    
    lines.push('#!/bin/bash');
    lines.push('');
    lines.push('# Auto-generated commit batch script');
    lines.push(`# Session: ${sessionName}`);
    lines.push(`# Generated: ${new Date().toISOString()}`);
    lines.push(`# Total commits: ${plans.length}`);
    lines.push('');
    lines.push('set -e  # Exit on error');
    lines.push('');

    for (let i = 0; i < plans.length; i++) {
      const plan = plans[i];
      const commitNum = i + 1;
      
      lines.push(`# Commit ${commitNum}/${plans.length}: ${plan.message.type}(${plan.message.scope})`);
      lines.push('');
      
      // Stage files
      lines.push('# Stage files');
      for (const file of plan.group.files) {
        lines.push(`git add "${file}"`);
      }
      lines.push('');
      
      // Create commit
      const commitMessage = this.generator.formatMessage(plan.message);
      const escapedMessage = commitMessage.replace(/"/g, '\\"').replace(/\$/g, '\\$');
      lines.push('# Create commit');
      lines.push(`git commit -m "${escapedMessage}"`);
      lines.push('');
      lines.push(`echo "✓ Commit ${commitNum}/${plans.length} created"`);
      lines.push('');
    }

    lines.push('echo "All commits created successfully!"');
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Execute batch script
   */
  async executeBatchScript(scriptPath: string): Promise<void> {
    if (this.options.dryRun) {
      console.log(`[DRY RUN] Would execute: ${scriptPath}`);
      return;
    }

    try {
      execSync(`bash "${scriptPath}"`, {
        cwd: this.options.cwd,
        stdio: 'inherit',
      });

      // Update session stats
      const plans = await this.analyze();
      await this.tracker.updateSessionStats({
        commitsCreated: plans.length,
      });
    } catch (error: any) {
      throw new Error(`Failed to execute batch script: ${error.message}`);
    }
  }

  /**
   * Execute commits directly (without script)
   */
  async executeCommits(plans: CommitPlan[]): Promise<void> {
    if (this.options.dryRun) {
      console.log('[DRY RUN] Would create commits:');
      plans.forEach((plan, i) => {
        console.log(`  ${i + 1}. ${this.generator.formatMessage(plan.message)}`);
      });
      return;
    }

    for (let i = 0; i < plans.length; i++) {
      const plan = plans[i];
      
      // Stage files
      for (const file of plan.group.files) {
        execSync(`git add "${file}"`, { cwd: this.options.cwd });
      }

      // Create commit
      const commitMessage = this.generator.formatMessage(plan.message);
      const escapedMessage = commitMessage.replace(/"/g, '\\"').replace(/\$/g, '\\$');
      execSync(`git commit -m "${escapedMessage}"`, { cwd: this.options.cwd });

      Logger.progress(i + 1, plans.length, plan.message.subject);
    }

    // Update session stats
    await this.tracker.updateSessionStats({
      commitsCreated: plans.length,
    });
  }

  /**
   * End current session
   */
  async endSession(): Promise<void> {
    await this.tracker.endSession();
  }

  /**
   * Get session tracker
   */
  getSessionTracker(): SessionTracker {
    return this.tracker;
  }

  /**
   * Get analyzer
   */
  getAnalyzer(): GitAnalyzer {
    return this.analyzer;
  }
}
