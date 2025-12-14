import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators
  private readonly usernameInput = '#username';
  private readonly passwordInput = '#password';
  private readonly loginButton = 'button[type="submit"]';
  private readonly errorMessage = '.error-message';
  private readonly loadingSpinner = '.loading-spinner';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await super.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Wait for login page to load
   */
  private async waitForPageLoad(): Promise<void> {
    await this.waitForVisible(this.usernameInput);
    await this.waitForVisible(this.passwordInput);
  }

  /**
   * Perform login
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.page.click(this.loginButton);
    
    // Wait for navigation or error
    await Promise.race([
      this.waitForNavigation(),
      this.waitForVisible(this.errorMessage, 5000).catch(() => {}),
    ]);
  }

  /**
   * Login with validation
   */
  async loginWithValidation(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.verifyLoginSuccess();
  }

  /**
   * Verify successful login
   */
  async verifyLoginSuccess(): Promise<void> {
    await expect(this.page).not.toHaveURL(/login/);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getTextContent(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.page.locator(this.loginButton).isEnabled();
  }

  /**
   * Wait for loading spinner
   */
  async waitForLoading(): Promise<void> {
    const spinner = this.page.locator(this.loadingSpinner);
    if (await spinner.isVisible()) {
      await this.waitForHidden(this.loadingSpinner);
    }
  }
}