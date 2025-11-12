/**
 * Session Tracker
 * Tracks coding sessions and maintains history
 */

import { Session } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { randomUUID } from 'crypto';

export class SessionTracker {
  private dataDir: string;
  private currentSession: Session | null = null;
  private sessionsFile: string;

  constructor(dataDir?: string) {
    this.dataDir = dataDir || path.join(os.homedir(), '.vibes-commit');
    this.sessionsFile = path.join(this.dataDir, 'sessions.json');
    this.ensureDataDir();
  }

  /**
   * Ensure data directory exists
   */
  private ensureDataDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  /**
   * Start or resume a session
   */
  async startSession(name?: string, host?: string): Promise<Session> {
    const hostname = host || os.hostname();
    const sessionName = name || this.generateSessionName();

    // Check if there's an active session
    if (this.currentSession && !this.currentSession.endTime) {
      console.log(`Resuming existing session: ${this.currentSession.name}`);
      return this.currentSession;
    }

    // Create new session
    this.currentSession = {
      id: randomUUID(),
      name: sessionName,
      host: hostname,
      startTime: new Date(),
      filesChanged: 0,
      commitsCreated: 0,
      linesAdded: 0,
      linesDeleted: 0,
    };

    await this.saveSession(this.currentSession);
    return this.currentSession;
  }

  /**
   * End current session
   */
  async endSession(): Promise<Session | null> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    this.currentSession.endTime = new Date();
    this.currentSession.duration = 
      this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime();

    await this.saveSession(this.currentSession);
    
    const endedSession = this.currentSession;
    this.currentSession = null;
    
    return endedSession;
  }

  /**
   * Get current session
   */
  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  /**
   * Update session statistics
   */
  async updateSessionStats(stats: {
    filesChanged?: number;
    commitsCreated?: number;
    linesAdded?: number;
    linesDeleted?: number;
  }): Promise<void> {
    if (!this.currentSession) {
      return;
    }

    if (stats.filesChanged !== undefined) {
      this.currentSession.filesChanged += stats.filesChanged;
    }
    if (stats.commitsCreated !== undefined) {
      this.currentSession.commitsCreated += stats.commitsCreated;
    }
    if (stats.linesAdded !== undefined) {
      this.currentSession.linesAdded += stats.linesAdded;
    }
    if (stats.linesDeleted !== undefined) {
      this.currentSession.linesDeleted += stats.linesDeleted;
    }

    await this.saveSession(this.currentSession);
  }

  /**
   * Save session to storage
   */
  private async saveSession(session: Session): Promise<void> {
    const sessions = await this.loadAllSessions();
    
    // Update or add session
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }

    // Save to file
    fs.writeFileSync(
      this.sessionsFile,
      JSON.stringify(sessions, null, 2),
      'utf-8'
    );
  }

  /**
   * Load all sessions
   */
  private async loadAllSessions(): Promise<Session[]> {
    if (!fs.existsSync(this.sessionsFile)) {
      return [];
    }

    try {
      const data = fs.readFileSync(this.sessionsFile, 'utf-8');
      const sessions = JSON.parse(data);
      
      // Convert date strings back to Date objects
      return sessions.map((s: any) => ({
        ...s,
        startTime: new Date(s.startTime),
        endTime: s.endTime ? new Date(s.endTime) : undefined,
      }));
    } catch (error) {
      console.error('Failed to load sessions:', error);
      return [];
    }
  }

  /**
   * Get session history
   */
  async getSessionHistory(limit?: number, host?: string): Promise<Session[]> {
    let sessions = await this.loadAllSessions();

    // Filter by host if specified
    if (host) {
      sessions = sessions.filter(s => s.host === host);
    }

    // Sort by start time (newest first)
    sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

    // Limit results
    if (limit) {
      sessions = sessions.slice(0, limit);
    }

    return sessions;
  }

  /**
   * Get session by ID
   */
  async getSessionById(id: string): Promise<Session | null> {
    const sessions = await this.loadAllSessions();
    return sessions.find(s => s.id === id) || null;
  }

  /**
   * Get session statistics
   */
  async getSessionStats(host?: string): Promise<{
    totalSessions: number;
    totalCommits: number;
    totalFiles: number;
    totalLines: number;
    averageCommitsPerSession: number;
    averageDuration: number;
  }> {
    let sessions = await this.loadAllSessions();

    // Filter by host if specified
    if (host) {
      sessions = sessions.filter(s => s.host === host);
    }

    // Filter completed sessions
    const completedSessions = sessions.filter(s => s.endTime);

    const totalSessions = completedSessions.length;
    const totalCommits = completedSessions.reduce((sum, s) => sum + s.commitsCreated, 0);
    const totalFiles = completedSessions.reduce((sum, s) => sum + s.filesChanged, 0);
    const totalLines = completedSessions.reduce(
      (sum, s) => sum + s.linesAdded + s.linesDeleted,
      0
    );
    const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    return {
      totalSessions,
      totalCommits,
      totalFiles,
      totalLines,
      averageCommitsPerSession: totalSessions > 0 ? totalCommits / totalSessions : 0,
      averageDuration: totalSessions > 0 ? totalDuration / totalSessions : 0,
    };
  }

  /**
   * Generate session name
   */
  private generateSessionName(): string {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    return `session-${date}-${time}`;
  }

  /**
   * Delete session
   */
  async deleteSession(id: string): Promise<boolean> {
    const sessions = await this.loadAllSessions();
    const filtered = sessions.filter(s => s.id !== id);
    
    if (filtered.length === sessions.length) {
      return false; // Session not found
    }

    fs.writeFileSync(
      this.sessionsFile,
      JSON.stringify(filtered, null, 2),
      'utf-8'
    );

    return true;
  }

  /**
   * Clear all sessions
   */
  async clearAllSessions(): Promise<void> {
    if (fs.existsSync(this.sessionsFile)) {
      fs.unlinkSync(this.sessionsFile);
    }
    this.currentSession = null;
  }

  /**
   * Format session duration
   */
  formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }
}
