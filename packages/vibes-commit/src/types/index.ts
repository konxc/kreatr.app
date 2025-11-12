/**
 * Core type definitions for Vibes Commit
 */

export type CommitType =
  | 'feat'
  | 'fix'
  | 'docs'
  | 'refactor'
  | 'test'
  | 'chore'
  | 'style'
  | 'perf'
  | 'ci'
  | 'build';

export interface GitStatus {
  staged: string[];
  unstaged: string[];
  untracked: string[];
  modified: string[];
  deleted: string[];
  renamed: Array<{ from: string; to: string }>;
}

export interface FileDiff {
  file: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  chunks: DiffChunk[];
  content: string;
}

export interface DiffChunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
}

export interface FileType {
  type: 'source' | 'test' | 'config' | 'docs' | 'asset' | 'other';
  category: string;
  language: string;
  framework: string;
}

export interface CommitGroup {
  files: string[];
  type: CommitType;
  scope: string;
  reason: string;
  priority: number;
  dependencies: string[];
}

export interface CommitMessage {
  type: CommitType;
  scope: string;
  subject: string;
  body?: string;
  footer?: string;
  breaking?: boolean;
}

export interface Session {
  id: string;
  name: string;
  host: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  filesChanged: number;
  commitsCreated: number;
  linesAdded: number;
  linesDeleted: number;
}
