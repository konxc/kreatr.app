/**
 * Message Generator
 * Generates commit messages that are descriptive and follow conventions
 */

import { CommitGroup, CommitMessage, FileDiff, CommitType } from '../types';
import * as path from 'path';

export class MessageGenerator {
  private maxSubjectLength: number;
  private maxBodyLength: number;

  constructor(maxSubjectLength: number = 72, maxBodyLength: number = 100) {
    this.maxSubjectLength = maxSubjectLength;
    this.maxBodyLength = maxBodyLength;
  }

  /**
   * Generate commit message for a group
   */
  async generateMessage(group: CommitGroup, diffs: FileDiff[]): Promise<CommitMessage> {
    const subject = this.generateSubject(group, diffs);
    const body = this.generateBody(group, diffs);
    const footer = this.generateFooter(group, diffs);
    const breaking = this.detectBreakingChange(diffs);

    return {
      type: group.type,
      scope: group.scope,
      subject,
      body: body || undefined,
      footer: footer || undefined,
      breaking,
    };
  }

  /**
   * Generate commit subject line
   */
  private generateSubject(group: CommitGroup, diffs: FileDiff[]): string {
    const action = this.getActionVerb(group.type, diffs);
    const target = this.getTarget(group, diffs);
    
    let subject = `${action} ${target}`;

    // Truncate if too long
    if (subject.length > this.maxSubjectLength) {
      subject = subject.substring(0, this.maxSubjectLength - 3) + '...';
    }

    return subject;
  }

  /**
   * Get action verb based on commit type
   */
  private getActionVerb(type: CommitType, diffs: FileDiff[]): string {
    // Check for specific patterns
    const allAdded = diffs.every(d => d.status === 'added');
    const allDeleted = diffs.every(d => d.status === 'deleted');
    const allRenamed = diffs.every(d => d.status === 'renamed');

    if (allAdded) return 'add';
    if (allDeleted) return 'remove';
    if (allRenamed) return 'rename';

    // Default verbs by type
    const verbMap: Record<CommitType, string> = {
      'feat': 'add',
      'fix': 'fix',
      'docs': 'update',
      'refactor': 'refactor',
      'test': 'add',
      'chore': 'update',
      'style': 'style',
      'perf': 'optimize',
      'ci': 'update',
      'build': 'update',
    };

    return verbMap[type] || 'update';
  }

  /**
   * Get target description
   */
  private getTarget(group: CommitGroup, diffs: FileDiff[]): string {
    if (diffs.length === 1) {
      return this.describeFile(diffs[0]);
    }

    // Multiple files - describe the group
    const fileTypes = new Set(diffs.map(d => this.getFileCategory(d.file)));
    
    if (fileTypes.size === 1) {
      const type = Array.from(fileTypes)[0];
      return `${type} in ${group.scope || 'project'}`;
    }

    // Mixed types
    if (fileTypes.has('component') && fileTypes.has('test')) {
      return `${group.scope || 'component'} with tests`;
    }

    return `${diffs.length} files in ${group.scope || 'project'}`;
  }

  /**
   * Describe a single file
   */
  private describeFile(diff: FileDiff): string {
    const parsed = path.parse(diff.file);
    const name = parsed.name.replace(/\.(test|spec)$/, '');
    const category = this.getFileCategory(diff.file);

    if (category === 'test') {
      return `tests for ${name}`;
    }

    if (category === 'config') {
      return `${parsed.base} configuration`;
    }

    if (category === 'docs') {
      return `${parsed.base} documentation`;
    }

    return name;
  }

  /**
   * Get file category
   */
  private getFileCategory(filePath: string): string {
    const lower = filePath.toLowerCase();
    
    if (lower.includes('test') || lower.includes('spec')) {
      return 'test';
    }
    
    if (lower.includes('config') || lower.match(/\.(json|yaml|yml|toml)$/)) {
      return 'config';
    }
    
    if (lower.match(/\.(md|txt|rst)$/)) {
      return 'docs';
    }
    
    if (lower.match(/\.(css|scss|sass|less)$/)) {
      return 'styles';
    }
    
    if (lower.match(/\.(ts|tsx|js|jsx)$/)) {
      return 'component';
    }
    
    return 'file';
  }

  /**
   * Generate commit body
   */
  private generateBody(_group: CommitGroup, diffs: FileDiff[]): string {
    const lines: string[] = [];

    // Add file list if multiple files
    if (diffs.length > 1) {
      lines.push('Changes:');
      for (const diff of diffs) {
        const status = this.getStatusSymbol(diff.status);
        const stats = this.getStats(diff);
        lines.push(`${status} ${diff.file} ${stats}`);
      }
      lines.push('');
    }

    // Add change summary
    const summary = this.generateChangeSummary(diffs);
    if (summary) {
      lines.push(summary);
    }

    // Wrap lines
    const wrappedLines = lines.flatMap(line => this.wrapLine(line, this.maxBodyLength));

    return wrappedLines.join('\n');
  }

  /**
   * Get status symbol
   */
  private getStatusSymbol(status: string): string {
    const symbols: Record<string, string> = {
      'added': '+',
      'modified': '~',
      'deleted': '-',
      'renamed': '→',
    };
    return symbols[status] || '•';
  }

  /**
   * Get file stats
   */
  private getStats(diff: FileDiff): string {
    if (diff.status === 'deleted') {
      return `(-${diff.deletions})`;
    }
    if (diff.status === 'added') {
      return `(+${diff.additions})`;
    }
    return `(+${diff.additions}/-${diff.deletions})`;
  }

  /**
   * Generate change summary
   */
  private generateChangeSummary(diffs: FileDiff[]): string {
    const totalAdditions = diffs.reduce((sum, d) => sum + d.additions, 0);
    const totalDeletions = diffs.reduce((sum, d) => sum + d.deletions, 0);

    if (totalAdditions === 0 && totalDeletions === 0) {
      return '';
    }

    return `Total: +${totalAdditions} -${totalDeletions} lines`;
  }

  /**
   * Generate footer
   */
  private generateFooter(_group: CommitGroup, diffs: FileDiff[]): string {
    const footerLines: string[] = [];

    // Add breaking change notice
    if (this.detectBreakingChange(diffs)) {
      footerLines.push('BREAKING CHANGE: API changes detected');
    }

    return footerLines.join('\n');
  }

  /**
   * Detect breaking changes
   */
  private detectBreakingChange(diffs: FileDiff[]): boolean {
    // Simple heuristic: check for deleted exports or major API changes
    for (const diff of diffs) {
      const content = diff.content.toLowerCase();
      
      // Check for deleted exports
      if (content.includes('-export') || content.includes('-public')) {
        return true;
      }
      
      // Check for breaking change keywords in diff
      if (content.includes('breaking') || content.includes('breaking change')) {
        return true;
      }
    }

    return false;
  }

  /**
   * Wrap line to max length
   */
  private wrapLine(line: string, maxLength: number): string[] {
    if (line.length <= maxLength) {
      return [line];
    }

    const words = line.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Format commit message for display
   */
  formatMessage(message: CommitMessage): string {
    let formatted = `${message.type}`;
    
    if (message.scope) {
      formatted += `(${message.scope})`;
    }
    
    if (message.breaking) {
      formatted += '!';
    }
    
    formatted += `: ${message.subject}`;
    
    if (message.body) {
      formatted += `\n\n${message.body}`;
    }
    
    if (message.footer) {
      formatted += `\n\n${message.footer}`;
    }
    
    return formatted;
  }

  /**
   * Validate commit message
   */
  validateMessage(message: CommitMessage): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check subject length
    if (message.subject.length > this.maxSubjectLength) {
      errors.push(`Subject too long (${message.subject.length} > ${this.maxSubjectLength})`);
    }

    // Check subject format
    if (message.subject.length === 0) {
      errors.push('Subject cannot be empty');
    }

    if (message.subject[0] === message.subject[0].toUpperCase()) {
      errors.push('Subject should start with lowercase');
    }

    if (message.subject.endsWith('.')) {
      errors.push('Subject should not end with period');
    }

    // Check type
    const validTypes: CommitType[] = ['feat', 'fix', 'docs', 'refactor', 'test', 'chore', 'style', 'perf', 'ci', 'build'];
    if (!validTypes.includes(message.type)) {
      errors.push(`Invalid commit type: ${message.type}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
