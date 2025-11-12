/**
 * Git Analyzer
 * Analyzes git repository and extracts information about changes
 */

import { execSync } from 'child_process';
import { GitStatus, FileDiff, FileType, DiffChunk } from '../types';

export class GitAnalyzer {
  private cwd: string;

  constructor(cwd: string = process.cwd()) {
    this.cwd = cwd;
    this.ensureGitRepo();
  }

  /**
   * Ensure we're in a git repository
   */
  private ensureGitRepo(): void {
    try {
      this.execGit('rev-parse --git-dir');
    } catch (error) {
      throw new Error('Not a git repository');
    }
  }

  /**
   * Execute git command
   */
  private execGit(command: string): string {
    try {
      return execSync(`git ${command}`, {
        cwd: this.cwd,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
    } catch (error: any) {
      if (error.status === 128) {
        throw new Error(`Git error: ${error.stderr?.toString() || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Analyze current git status
   */
  async analyzeStatus(): Promise<GitStatus> {
    const output = this.execGit('status --porcelain=v1');
    
    const status: GitStatus = {
      staged: [],
      unstaged: [],
      untracked: [],
      modified: [],
      deleted: [],
      renamed: [],
    };

    if (!output) {
      return status;
    }

    const lines = output.split('\n').filter(line => line.trim());

    for (const line of lines) {
      const x = line[0]; // staged status
      const y = line[1]; // unstaged status
      const file = line.substring(3);

      // Handle renamed files
      if (x === 'R' || y === 'R') {
        const [from, to] = file.split(' -> ');
        status.renamed.push({ from, to });
        if (x === 'R') status.staged.push(to);
        continue;
      }

      // Staged changes
      if (x !== ' ' && x !== '?') {
        status.staged.push(file);
        if (x === 'D') {
          status.deleted.push(file);
        } else if (x === 'M' || x === 'A') {
          status.modified.push(file);
        }
      }

      // Unstaged changes
      if (y !== ' ' && y !== '?') {
        status.unstaged.push(file);
        if (y === 'D') {
          status.deleted.push(file);
        } else if (y === 'M') {
          status.modified.push(file);
        }
      }

      // Untracked files
      if (x === '?' && y === '?') {
        status.untracked.push(file);
      }
    }

    return status;
  }

  /**
   * Get detailed diff for files
   */
  async getDiff(files: string[]): Promise<FileDiff[]> {
    const diffs: FileDiff[] = [];

    for (const file of files) {
      try {
        const diff = await this.getDiffForFile(file);
        if (diff) {
          diffs.push(diff);
        }
      } catch (error) {
        console.warn(`Failed to get diff for ${file}:`, error);
      }
    }

    return diffs;
  }

  /**
   * Get diff for a single file
   */
  private async getDiffForFile(file: string): Promise<FileDiff | null> {
    let diffOutput: string;
    let status: 'added' | 'modified' | 'deleted' | 'renamed' = 'modified';

    try {
      // Try to get staged diff first
      diffOutput = this.execGit(`diff --cached --unified=3 -- "${file}"`);
      
      // If no staged diff, try unstaged
      if (!diffOutput) {
        diffOutput = this.execGit(`diff --unified=3 -- "${file}"`);
      }

      // If still no diff, file might be new
      if (!diffOutput) {
        try {
          const content = this.execGit(`show :"${file}"`);
          diffOutput = `+++ b/${file}\n${content.split('\n').map(l => '+' + l).join('\n')}`;
          status = 'added';
        } catch {
          return null;
        }
      }
    } catch (error) {
      return null;
    }

    // Detect status from diff
    if (diffOutput.includes('new file mode')) {
      status = 'added';
    } else if (diffOutput.includes('deleted file mode')) {
      status = 'deleted';
    } else if (diffOutput.includes('rename from')) {
      status = 'renamed';
    }

    const chunks = this.parseDiffChunks(diffOutput);
    const { additions, deletions } = this.countChanges(chunks);

    return {
      file,
      status,
      additions,
      deletions,
      chunks,
      content: diffOutput,
    };
  }

  /**
   * Parse diff chunks from diff output
   */
  private parseDiffChunks(diffOutput: string): DiffChunk[] {
    const chunks: DiffChunk[] = [];
    const lines = diffOutput.split('\n');
    let currentChunk: DiffChunk | null = null;

    for (const line of lines) {
      // Match chunk header: @@ -oldStart,oldLines +newStart,newLines @@
      const chunkMatch = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      
      if (chunkMatch) {
        if (currentChunk) {
          chunks.push(currentChunk);
        }
        
        currentChunk = {
          oldStart: parseInt(chunkMatch[1]),
          oldLines: parseInt(chunkMatch[2] || '1'),
          newStart: parseInt(chunkMatch[3]),
          newLines: parseInt(chunkMatch[4] || '1'),
          lines: [],
        };
      } else if (currentChunk && (line.startsWith('+') || line.startsWith('-') || line.startsWith(' '))) {
        currentChunk.lines.push(line);
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  /**
   * Count additions and deletions from chunks
   */
  private countChanges(chunks: DiffChunk[]): { additions: number; deletions: number } {
    let additions = 0;
    let deletions = 0;

    for (const chunk of chunks) {
      for (const line of chunk.lines) {
        if (line.startsWith('+') && !line.startsWith('+++')) {
          additions++;
        } else if (line.startsWith('-') && !line.startsWith('---')) {
          deletions++;
        }
      }
    }

    return { additions, deletions };
  }

  /**
   * Detect file type and purpose
   */
  detectFileType(filePath: string): FileType {
    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    const pathLower = filePath.toLowerCase();
    
    // Detect type
    let type: FileType['type'] = 'other';
    let category = 'unknown';
    let language = 'unknown';
    let framework = 'none';

    // Test files
    if (pathLower.includes('test') || pathLower.includes('spec') || pathLower.includes('__tests__')) {
      type = 'test';
      category = 'test';
    }
    // Config files
    else if (this.isConfigFile(filePath, ext)) {
      type = 'config';
      category = 'configuration';
    }
    // Documentation
    else if (this.isDocFile(ext)) {
      type = 'docs';
      category = 'documentation';
    }
    // Assets
    else if (this.isAssetFile(ext)) {
      type = 'asset';
      category = 'asset';
    }
    // Source code
    else if (this.isSourceFile(ext)) {
      type = 'source';
      category = 'source';
    }

    // Detect language
    language = this.detectLanguage(ext, filePath);
    
    // Detect framework
    framework = this.detectFramework(filePath, ext);

    return { type, category, language, framework };
  }

  private isConfigFile(path: string, ext: string): boolean {
    const configFiles = ['json', 'yaml', 'yml', 'toml', 'ini', 'conf', 'config'];
    const configNames = ['package.json', 'tsconfig', 'webpack', 'babel', 'eslint', 'prettier', 'jest', 'vite', 'rollup'];
    
    return configFiles.includes(ext) || configNames.some(name => path.includes(name));
  }

  private isDocFile(ext: string): boolean {
    return ['md', 'txt', 'rst', 'adoc', 'pdf', 'doc', 'docx'].includes(ext);
  }

  private isAssetFile(ext: string): boolean {
    return ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp', 'mp4', 'mp3', 'wav', 'woff', 'woff2', 'ttf', 'eot'].includes(ext);
  }

  private isSourceFile(ext: string): boolean {
    const sourceExts = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'go', 'rs', 'c', 'cpp', 'h', 'hpp', 'cs', 'php', 'rb', 'swift', 'kt', 'scala', 'vue', 'svelte'];
    return sourceExts.includes(ext);
  }

  private detectLanguage(ext: string, _path: string): string {
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'go': 'go',
      'rs': 'rust',
      'c': 'c',
      'cpp': 'cpp',
      'h': 'c',
      'hpp': 'cpp',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'vue': 'vue',
      'svelte': 'svelte',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
    };

    return langMap[ext] || 'unknown';
  }

  private detectFramework(path: string, ext: string): string {
    const pathLower = path.toLowerCase();
    
    // React
    if ((ext === 'jsx' || ext === 'tsx') || pathLower.includes('react')) {
      return 'react';
    }
    // Vue
    if (ext === 'vue') {
      return 'vue';
    }
    // Svelte
    if (ext === 'svelte') {
      return 'svelte';
    }
    // Angular
    if (pathLower.includes('angular') || pathLower.includes('.component.') || pathLower.includes('.service.')) {
      return 'angular';
    }
    // Next.js
    if (pathLower.includes('next') || pathLower.includes('pages/') || pathLower.includes('app/')) {
      return 'nextjs';
    }
    
    return 'none';
  }

  /**
   * Get commit history
   */
  async getCommitHistory(limit: number = 10): Promise<Array<{ hash: string; message: string; author: string; date: string }>> {
    const output = this.execGit(`log -${limit} --pretty=format:"%H|%s|%an|%ad" --date=iso`);
    
    if (!output) {
      return [];
    }

    return output.split('\n').map(line => {
      const [hash, message, author, date] = line.split('|');
      return { hash, message, author, date };
    });
  }
}
