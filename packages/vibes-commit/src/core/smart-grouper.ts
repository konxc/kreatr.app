/**
 * Smart Grouper
 * Groups file changes intelligently based on various criteria
 */

import { FileDiff, CommitGroup, CommitType, FileType } from '../types';
import { GitAnalyzer } from './git-analyzer';
import * as path from 'path';

export class SmartGrouper {
  private analyzer: GitAnalyzer;
  private maxFilesPerCommit: number;

  constructor(analyzer: GitAnalyzer, maxFilesPerCommit: number = 10) {
    this.analyzer = analyzer;
    this.maxFilesPerCommit = maxFilesPerCommit;
  }

  /**
   * Group files into logical commits
   */
  async groupFiles(files: FileDiff[]): Promise<CommitGroup[]> {
    if (files.length === 0) {
      return [];
    }

    // Analyze file types
    const fileTypes = new Map<string, FileType>();
    for (const file of files) {
      fileTypes.set(file.file, this.analyzer.detectFileType(file.file));
    }

    // Apply grouping strategies
    // 1. Group by directory and type
    const directoryGroups = this.groupByDirectory(files, fileTypes);
    
    // 2. Group related files (component + test + style)
    const featureGroups = this.groupByFeature(files, fileTypes);
    
    // 3. Merge strategies
    const mergedGroups = this.mergeGroups(directoryGroups, featureGroups, files);

    // 4. Split large groups
    const finalGroups = this.splitLargeGroups(mergedGroups);

    // 5. Assign priorities
    return this.assignPriorities(finalGroups);
  }

  /**
   * Group files by directory structure
   */
  private groupByDirectory(files: FileDiff[], fileTypes: Map<string, FileType>): Map<string, FileDiff[]> {
    const groups = new Map<string, FileDiff[]>();

    for (const file of files) {
      const dir = path.dirname(file.file);
      const fileType = fileTypes.get(file.file);
      
      // Create key combining directory and file type
      const key = `${dir}:${fileType?.type || 'other'}`;
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(file);
    }

    return groups;
  }

  /**
   * Group files by feature (related files)
   */
  private groupByFeature(files: FileDiff[], fileTypes: Map<string, FileType>): Map<string, FileDiff[]> {
    const groups = new Map<string, FileDiff[]>();

    for (const file of files) {
      const baseName = this.getBaseName(file.file);
      const fileType = fileTypes.get(file.file);

      // Skip if not a source or test file
      if (fileType?.type !== 'source' && fileType?.type !== 'test') {
        continue;
      }

      // Find related files
      const relatedFiles = files.filter(f => {
        const otherBaseName = this.getBaseName(f.file);
        return baseName === otherBaseName;
      });

      if (relatedFiles.length > 1) {
        groups.set(baseName, relatedFiles);
      }
    }

    return groups;
  }

  /**
   * Get base name without extension and test/spec suffix
   */
  private getBaseName(filePath: string): string {
    const parsed = path.parse(filePath);
    let name = parsed.name;
    
    // Remove test/spec suffixes
    name = name.replace(/\.(test|spec)$/, '');
    
    return path.join(parsed.dir, name);
  }

  /**
   * Merge grouping strategies
   */
  private mergeGroups(
    directoryGroups: Map<string, FileDiff[]>,
    featureGroups: Map<string, FileDiff[]>,
    allFiles: FileDiff[]
  ): CommitGroup[] {
    const groups: CommitGroup[] = [];
    const processedFiles = new Set<string>();

    // Prioritize feature groups (component + test)
    for (const [, files] of featureGroups) {
      const group = this.createCommitGroup(files);
      groups.push(group);
      files.forEach(f => processedFiles.add(f.file));
    }

    // Add directory groups for remaining files
    for (const [, files] of directoryGroups) {
      const unprocessedFiles = files.filter(f => !processedFiles.has(f.file));
      
      if (unprocessedFiles.length > 0) {
        const group = this.createCommitGroup(unprocessedFiles);
        groups.push(group);
        unprocessedFiles.forEach(f => processedFiles.add(f.file));
      }
    }

    // Add any remaining files as individual groups
    const remainingFiles = allFiles.filter(f => !processedFiles.has(f.file));
    for (const file of remainingFiles) {
      const group = this.createCommitGroup([file]);
      groups.push(group);
    }

    return groups;
  }

  /**
   * Create a commit group from files
   */
  private createCommitGroup(files: FileDiff[]): CommitGroup {
    const fileTypes = files.map(f => this.analyzer.detectFileType(f.file));
    const type = this.determineCommitType(files, fileTypes);
    const scope = this.determineScope(files);
    const reason = this.determineReason(files, fileTypes);

    return {
      files: files.map(f => f.file),
      type,
      scope,
      reason,
      priority: 0, // Will be assigned later
      dependencies: [],
    };
  }

  /**
   * Determine commit type based on files
   */
  private determineCommitType(files: FileDiff[], fileTypes: FileType[]): CommitType {
    // Check if all files are tests
    if (fileTypes.every(ft => ft.type === 'test')) {
      return 'test';
    }

    // Check if all files are docs
    if (fileTypes.every(ft => ft.type === 'docs')) {
      return 'docs';
    }

    // Check if all files are config
    if (fileTypes.every(ft => ft.type === 'config')) {
      return 'chore';
    }

    // Check for new files (likely a feature)
    const hasNewFiles = files.some(f => f.status === 'added');
    if (hasNewFiles) {
      return 'feat';
    }

    // Check for deleted files
    const hasDeletedFiles = files.some(f => f.status === 'deleted');
    if (hasDeletedFiles && files.length === files.filter(f => f.status === 'deleted').length) {
      return 'chore';
    }

    // Check file content for keywords
    const hasFixKeywords = files.some(f => 
      f.content.toLowerCase().includes('fix') || 
      f.content.toLowerCase().includes('bug')
    );
    if (hasFixKeywords) {
      return 'fix';
    }

    // Check for refactoring patterns
    const hasRefactorPatterns = files.some(f => {
      const additions = f.additions;
      const deletions = f.deletions;
      return Math.abs(additions - deletions) < Math.min(additions, deletions) * 0.3;
    });
    if (hasRefactorPatterns) {
      return 'refactor';
    }

    // Default to feat for source files, chore for others
    const hasSourceFiles = fileTypes.some(ft => ft.type === 'source');
    return hasSourceFiles ? 'feat' : 'chore';
  }

  /**
   * Determine scope from file paths
   */
  private determineScope(files: FileDiff[]): string {
    if (files.length === 0) {
      return '';
    }

    // Find common directory
    const dirs = files.map(f => path.dirname(f.file));
    const commonDir = this.findCommonPath(dirs);

    if (commonDir && commonDir !== '.') {
      // Use the last segment of the common directory
      const segments = commonDir.split(path.sep).filter(s => s);
      return segments[segments.length - 1] || '';
    }

    // Use filename if single file
    if (files.length === 1) {
      const parsed = path.parse(files[0].file);
      return parsed.name.replace(/\.(test|spec)$/, '');
    }

    return '';
  }

  /**
   * Find common path among multiple paths
   */
  private findCommonPath(paths: string[]): string {
    if (paths.length === 0) return '';
    if (paths.length === 1) return paths[0];

    const splitPaths = paths.map(p => p.split(path.sep));
    const minLength = Math.min(...splitPaths.map(p => p.length));

    const common: string[] = [];
    for (let i = 0; i < minLength; i++) {
      const segment = splitPaths[0][i];
      if (splitPaths.every(p => p[i] === segment)) {
        common.push(segment);
      } else {
        break;
      }
    }

    return common.join(path.sep);
  }

  /**
   * Determine reason for grouping
   */
  private determineReason(files: FileDiff[], fileTypes: FileType[]): string {
    if (files.length === 1) {
      return `Single file change: ${files[0].file}`;
    }

    const types = new Set(fileTypes.map(ft => ft.type));
    
    if (types.size === 1) {
      const type = Array.from(types)[0];
      return `Related ${type} files in same directory`;
    }

    // Check for component + test pattern
    const hasSource = fileTypes.some(ft => ft.type === 'source');
    const hasTest = fileTypes.some(ft => ft.type === 'test');
    if (hasSource && hasTest) {
      return 'Component with tests';
    }

    return 'Related files';
  }

  /**
   * Split groups that are too large
   */
  private splitLargeGroups(groups: CommitGroup[]): CommitGroup[] {
    const result: CommitGroup[] = [];

    for (const group of groups) {
      if (group.files.length <= this.maxFilesPerCommit) {
        result.push(group);
      } else {
        // Split into smaller groups
        const chunks = this.chunkArray(group.files, this.maxFilesPerCommit);
        for (let i = 0; i < chunks.length; i++) {
          result.push({
            ...group,
            files: chunks[i],
            reason: `${group.reason} (part ${i + 1}/${chunks.length})`,
          });
        }
      }
    }

    return result;
  }

  /**
   * Split array into chunks
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Assign priorities to groups
   */
  private assignPriorities(groups: CommitGroup[]): CommitGroup[] {
    // Priority rules:
    // 1. Config and build files first
    // 2. Tests after their source files
    // 3. Features and fixes
    // 4. Documentation last

    const priorityMap: Record<CommitType, number> = {
      'build': 1,
      'ci': 1,
      'chore': 2,
      'fix': 3,
      'feat': 4,
      'refactor': 5,
      'perf': 5,
      'test': 6,
      'style': 7,
      'docs': 8,
    };

    return groups.map(group => ({
      ...group,
      priority: priorityMap[group.type] || 5,
    })).sort((a, b) => a.priority - b.priority);
  }
}
