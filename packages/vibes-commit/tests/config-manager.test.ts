import { ConfigManager } from '../src/core/config-manager';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('ConfigManager', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vibes-test-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  it('should create an instance with defaults', () => {
    const config = new ConfigManager(tempDir);
    expect(config).toBeDefined();
    expect(config.get('maxFilesPerCommit')).toBe(10);
  });

  it('should load config from file', () => {
    const configDir = path.join(tempDir, '.vibes');
    fs.mkdirSync(configDir, { recursive: true });

    const customConfig = {
      maxFilesPerCommit: 5,
      autoStage: true,
      conventionalCommits: true,
    };

    fs.writeFileSync(path.join(configDir, 'config.json'), JSON.stringify(customConfig));

    const config = new ConfigManager(tempDir);
    expect(config.get('maxFilesPerCommit')).toBe(5);
    expect(config.get('autoStage')).toBe(true);
  });

  it('should validate config', () => {
    const config = new ConfigManager(tempDir);
    const result = config.validate();
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect invalid config', () => {
    const config = new ConfigManager(tempDir);
    config.set('maxFilesPerCommit', 0);
    const result = config.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should save config', () => {
    const config = new ConfigManager(tempDir);
    config.set('maxFilesPerCommit', 15);
    config.save();

    const savedConfig = new ConfigManager(tempDir);
    expect(savedConfig.get('maxFilesPerCommit')).toBe(15);
  });

  it('should reset to defaults', () => {
    const config = new ConfigManager(tempDir);
    config.set('maxFilesPerCommit', 20);
    config.reset();
    expect(config.get('maxFilesPerCommit')).toBe(10);
  });
});
