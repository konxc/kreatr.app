/**
 * Logger utility with colored output
 */

import chalk from 'chalk';

export class Logger {
  static success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  static error(message: string): void {
    console.error(chalk.red('✗'), message);
  }

  static warning(message: string): void {
    console.warn(chalk.yellow('⚠'), message);
  }

  static info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  static header(message: string): void {
    console.log(chalk.bold.cyan(`\n${message}\n`));
  }

  static section(message: string): void {
    console.log(chalk.bold(`\n${message}`));
  }

  static dim(message: string): void {
    console.log(chalk.dim(message));
  }

  static highlight(message: string): void {
    console.log(chalk.bold.yellow(message));
  }

  static commit(type: string, scope: string, subject: string): void {
    const typeColor = this.getTypeColor(type);
    console.log(
      `  ${typeColor(type)}${scope ? chalk.cyan(`(${scope})`) : ''}: ${chalk.white(subject)}`
    );
  }

  static file(status: string, file: string, stats?: string): void {
    const statusSymbol = this.getStatusSymbol(status);
    const statusColor = this.getStatusColor(status);
    console.log(`    ${statusColor(statusSymbol)} ${chalk.dim(file)} ${stats ? chalk.gray(stats) : ''}`);
  }

  private static getTypeColor(type: string): (text: string) => string {
    const colors: Record<string, (text: string) => string> = {
      feat: chalk.green,
      fix: chalk.red,
      docs: chalk.blue,
      style: chalk.magenta,
      refactor: chalk.yellow,
      test: chalk.cyan,
      chore: chalk.gray,
      perf: chalk.magenta,
      ci: chalk.blue,
      build: chalk.yellow,
    };
    return colors[type] || chalk.white;
  }

  private static getStatusSymbol(status: string): string {
    const symbols: Record<string, string> = {
      added: '+',
      modified: '~',
      deleted: '-',
      renamed: '→',
    };
    return symbols[status] || '•';
  }

  private static getStatusColor(status: string): (text: string) => string {
    const colors: Record<string, (text: string) => string> = {
      added: chalk.green,
      modified: chalk.yellow,
      deleted: chalk.red,
      renamed: chalk.blue,
    };
    return colors[status] || chalk.white;
  }

  static table(headers: string[], rows: string[][]): void {
    const colWidths = headers.map((h, i) => {
      const maxWidth = Math.max(h.length, ...rows.map((r) => r[i]?.length || 0));
      return maxWidth + 2;
    });

    // Header
    const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join('');
    console.log(chalk.bold(headerRow));
    console.log(chalk.dim('─'.repeat(headerRow.length)));

    // Rows
    rows.forEach((row) => {
      const rowStr = row.map((cell, i) => cell.padEnd(colWidths[i])).join('');
      console.log(rowStr);
    });
  }

  static progress(current: number, total: number, message: string): void {
    const percentage = Math.round((current / total) * 100);
    const bar = this.createProgressBar(percentage);
    console.log(`${bar} ${chalk.cyan(`${current}/${total}`)} ${message}`);
  }

  private static createProgressBar(percentage: number, width: number = 20): string {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  }
}
