import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class TestHelpers {
  /**
   * Generate random string
   */
  static generateRandomString(length: number = 10): string {
    return Math.random().toString(36).substring(2, length + 2);
  }

  /**
   * Generate unique timestamp-based name
   */
  static generateUniqueName(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = this.generateRandomString(5);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Wait for a specific condition
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    interval: number = 500
  ): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await this.sleep(interval);
    }
    
    return false;
  }

  /**
   * Sleep for specified milliseconds
   */
  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry operation with exponential backoff
   */
  static async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.sleep(delay * Math.pow(2, i));
      }
    }
    throw new Error('Retry failed');
  }

  /**
   * Get file path relative to project root
   */
  static getFilePath(...segments: string[]): string {
    return path.join(process.cwd(), ...segments);
  }

  /**
   * Create test data file
   */
  static createTestFile(filename: string, content: string): string {
    const filePath = this.getFilePath('test-data', filename);
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    return filePath;
  }

  /**
   * Clean up test files
   */
  static cleanupTestFiles(directory: string = 'test-data'): void {
    const dirPath = this.getFilePath(directory);
    
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  }

  /**
   * Format date for testing
   */
  static formatDate(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Parse JSON safely
   */
  static safeJsonParse<T>(json: string, defaultValue: T): T {
    try {
      return JSON.parse(json);
    } catch {
      return defaultValue;
    }
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeTimestampedScreenshot(page: Page, name: string): Promise<string> {
    const timestamp = Date.now();
    const filename = `${name}_${timestamp}.png`;
    const filepath = this.getFilePath('screenshots', filename);
    
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await page.screenshot({ path: filepath, fullPage: true });
    return filepath;
  }

  /**
   * Get environment variable with fallback
   */
  static getEnv(key: string, fallback: string = ''): string {
    return process.env[key] || fallback;
  }

  /**
   * Check if running in CI
   */
  static isCI(): boolean {
    return process.env.CI === 'true';
  }

  /**
   * Sanitize string for filename
   */
  static sanitizeFilename(str: string): string {
    return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
}