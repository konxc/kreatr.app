import { SessionTracker } from '../src/core/session-tracker';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('SessionTracker', () => {
  let tempDir: string;
  let tracker: SessionTracker;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vibes-test-'));
    tracker = new SessionTracker(tempDir);
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  it('should create an instance', () => {
    expect(tracker).toBeDefined();
  });

  it('should start a session', async () => {
    const session = await tracker.startSession('test-session');
    expect(session).toBeDefined();
    expect(session.name).toBe('test-session');
    expect(session.startTime).toBeInstanceOf(Date);
  });

  it('should end a session', async () => {
    await tracker.startSession('test-session');
    // Wait a bit to ensure duration > 0
    await new Promise((resolve) => setTimeout(resolve, 10));
    const endedSession = await tracker.endSession();
    expect(endedSession).toBeDefined();
    expect(endedSession?.endTime).toBeInstanceOf(Date);
    expect(endedSession?.duration).toBeGreaterThanOrEqual(0);
  });

  it('should update session stats', async () => {
    await tracker.startSession('test-session');
    await tracker.updateSessionStats({
      filesChanged: 5,
      commitsCreated: 2,
      linesAdded: 100,
      linesDeleted: 50,
    });

    const session = tracker.getCurrentSession();
    expect(session?.filesChanged).toBe(5);
    expect(session?.commitsCreated).toBe(2);
    expect(session?.linesAdded).toBe(100);
    expect(session?.linesDeleted).toBe(50);
  });

  it('should get session history', async () => {
    await tracker.startSession('session-1');
    await tracker.endSession();

    await tracker.startSession('session-2');
    await tracker.endSession();

    const history = await tracker.getSessionHistory(10);
    expect(history.length).toBe(2);
  });

  it('should calculate session stats', async () => {
    await tracker.startSession('session-1');
    await tracker.updateSessionStats({ commitsCreated: 3 });
    await tracker.endSession();

    const stats = await tracker.getSessionStats();
    expect(stats.totalSessions).toBe(1);
    expect(stats.totalCommits).toBe(3);
  });

  it('should format duration', () => {
    const formatted = tracker.formatDuration(125000); // 2m 5s
    expect(formatted).toContain('m');
    expect(formatted).toContain('s');
  });
});
