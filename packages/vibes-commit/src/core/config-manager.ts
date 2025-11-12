/**
 * Configuration Manager
 * Handles loading, validation, and management of configuration
 */

import * as fs from 'fs';
import * as path from 'path';

export interface VibesConfig {
  maxFilesPerCommit: number;
  autoStage: boolean;
  conventionalCommits: boolean;
  messageMaxLength: number;
  groupingStrategy: 'directory' | 'feature' | 'smart';
  excludePatterns: string[];
  customRules: CustomRule[];
  ai?: {
    enabled: boolean;
    provider?: 'kiro' | 'openai' | 'anthropic';
    apiKey?: string;
  };
}

export interface CustomRule {
  name: string;
  pattern: string;
  type: string;
  scope?: string;
  priority?: number;
}

const DEFAULT_CONFIG: VibesConfig = {
  maxFilesPerCommit: 10,
  autoStage: false,
  conventionalCommits: true,
  messageMaxLength: 72,
  groupingStrategy: 'smart',
  excludePatterns: ['node_modules/**', 'dist/**', 'build/**', '.git/**'],
  customRules: [],
};

export class ConfigManager {
  private config: VibesConfig;
  private configPath: string;

  constructor(cwd: string = process.cwd()) {
    this.configPath = this.findConfigPath(cwd);
    this.config = this.loadConfig();
  }

  /**
   * Find config file path
   */
  private findConfigPath(cwd: string): string {
    const possiblePaths = [
      path.join(cwd, '.vibes', 'config.json'),
      path.join(cwd, '.vibes.json'),
      path.join(cwd, 'vibes.config.json'),
    ];

    for (const configPath of possiblePaths) {
      if (fs.existsSync(configPath)) {
        return configPath;
      }
    }

    // Return default path if none found
    return path.join(cwd, '.vibes', 'config.json');
  }

  /**
   * Load configuration
   */
  private loadConfig(): VibesConfig {
    if (!fs.existsSync(this.configPath)) {
      return { ...DEFAULT_CONFIG };
    }

    try {
      const content = fs.readFileSync(this.configPath, 'utf-8');
      const userConfig = JSON.parse(content);
      return this.mergeConfig(DEFAULT_CONFIG, userConfig);
    } catch (error) {
      console.warn(`Failed to load config from ${this.configPath}, using defaults`);
      return { ...DEFAULT_CONFIG };
    }
  }

  /**
   * Merge user config with defaults
   */
  private mergeConfig(defaults: VibesConfig, user: Partial<VibesConfig>): VibesConfig {
    return {
      ...defaults,
      ...user,
      ai: user.ai ? { ...defaults.ai, ...user.ai } : defaults.ai,
    };
  }

  /**
   * Get configuration
   */
  getConfig(): VibesConfig {
    return { ...this.config };
  }

  /**
   * Get specific config value
   */
  get<K extends keyof VibesConfig>(key: K): VibesConfig[K] {
    return this.config[key];
  }

  /**
   * Set config value
   */
  set<K extends keyof VibesConfig>(key: K, value: VibesConfig[K]): void {
    this.config[key] = value;
  }

  /**
   * Save configuration
   */
  save(): void {
    const dir = path.dirname(this.configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf-8');
  }

  /**
   * Validate configuration
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.config.maxFilesPerCommit < 1) {
      errors.push('maxFilesPerCommit must be at least 1');
    }

    if (this.config.messageMaxLength < 20) {
      errors.push('messageMaxLength must be at least 20');
    }

    const validStrategies = ['directory', 'feature', 'smart'];
    if (!validStrategies.includes(this.config.groupingStrategy)) {
      errors.push(`groupingStrategy must be one of: ${validStrategies.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Reset to defaults
   */
  reset(): void {
    this.config = { ...DEFAULT_CONFIG };
  }

  /**
   * Get config file path
   */
  getConfigPath(): string {
    return this.configPath;
  }

  /**
   * Create default config file
   */
  static createDefaultConfig(cwd: string): string {
    const configPath = path.join(cwd, '.vibes', 'config.json');
    const dir = path.dirname(configPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8');

    return configPath;
  }
}
