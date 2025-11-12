import { MessageGenerator } from '../src/core/message-generator';
import { CommitGroup, FileDiff } from '../src/types';

describe('MessageGenerator', () => {
  let generator: MessageGenerator;

  beforeEach(() => {
    generator = new MessageGenerator();
  });

  it('should create an instance', () => {
    expect(generator).toBeDefined();
  });

  it('should generate commit message', async () => {
    const group: CommitGroup = {
      files: ['src/test.ts'],
      type: 'feat',
      scope: 'core',
      reason: 'New feature',
      priority: 1,
      dependencies: [],
    };

    const diffs: FileDiff[] = [
      {
        file: 'src/test.ts',
        status: 'added',
        additions: 10,
        deletions: 0,
        chunks: [],
        content: '',
      },
    ];

    const message = await generator.generateMessage(group, diffs);

    expect(message.type).toBe('feat');
    expect(message.scope).toBe('core');
    expect(message.subject).toBeTruthy();
  });

  it('should format message correctly', () => {
    const message = {
      type: 'feat' as const,
      scope: 'auth',
      subject: 'add login functionality',
      body: 'Implemented user authentication',
      breaking: false,
    };

    const formatted = generator.formatMessage(message);
    expect(formatted).toContain('feat(auth): add login functionality');
    expect(formatted).toContain('Implemented user authentication');
  });

  it('should validate message', () => {
    const message = {
      type: 'feat' as const,
      scope: 'test',
      subject: 'add new feature',
      breaking: false,
    };

    const result = generator.validateMessage(message);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect invalid message', () => {
    const message = {
      type: 'feat' as const,
      scope: 'test',
      subject: 'Add new feature.', // Should not end with period
      breaking: false,
    };

    const result = generator.validateMessage(message);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
