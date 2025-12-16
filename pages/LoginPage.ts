import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Updated locators based on actual login page
  private readonly usernameInput = 'input[name="username"]';
  private readonly passwordInput = 'input[name="password"]';
  private readonly loginButton = 'button[type="submit"]';
  private readonly errorMessage = '.error-message, [role="alert"], .alert-danger';

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/');
    await this.waitForPageLoad();
  }

  private async waitForPageLoad(): Promise<void> {
    // Wait for either login form or dashboard (if already logged in)
    await Promise.race([
      this.page.waitForSelector(this.usernameInput, { timeout: 10000 }),
      this.page.waitForSelector('text=Automation', { timeout: 10000 })
    ]);
  }

  async login(username: string, password: string): Promise<void> {
    // Check if already logged in
    const isLoggedIn = await this.page.isVisible('text=Automation', { timeout: 2000 }).catch(() => false);
    if (isLoggedIn) {
      console.log('Already logged in, skipping login step');
      return;
    }

    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    
    await this.page.click(this.loginButton);
    
    // Wait for navigation - look for the Home page elements
    await Promise.race([
      this.page.waitForSelector('text=HELLO, HUMAN', { timeout: 30000 }),
      this.page.waitForSelector('h1:has-text("Automation")', { timeout: 30000 }),
      this.waitForVisible(this.errorMessage, 30000).catch(() => {})
    ]);
  }

  async loginWithValidation(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.verifyLoginSuccess();
  }

  async verifyLoginSuccess(): Promise<void> {
    // Wait for the page to fully load
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // Verify we're on the dashboard by checking for sidebar elements
    const sidebarVisible = await this.page.isVisible('text=Explore', { timeout: 5000 }).catch(() => false);
    if (!sidebarVisible) {
      throw new Error('Login appears to have failed - sidebar not visible');
    }
    
    // Check we're not on login page
    const url = this.page.url();
    if (url.includes('login') || url.includes('signin')) {
      throw new Error('Still on login page after authentication');
    }
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getTextContent(this.errorMessage);
    }
    return '';
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.page.locator(this.loginButton).isEnabled();
  }
}