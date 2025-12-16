import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to app
  async goto() {
    await this.page.goto('/', { timeout: 60000 });
    await this.waitForReady();
  }

  // Wait until either login OR dashboard is ready
  async waitForReady() {
    const automationLink = this.page.getByRole('link', {
      name: 'Automation',
      exact: true,
    });

    // Case 1: Already logged in
    if (await automationLink.isVisible().catch(() => false)) {
      return;
    }

    // Case 2: Login inside iframe
    const iframe = this.page.frameLocator('iframe');
    const iframeUsername = iframe.locator(
      'input[name="username"], #username'
    );

    if (await iframeUsername.count() > 0) {
      await expect(iframeUsername).toBeVisible({ timeout: 30000 });
      return;
    }

    // Case 3: Login on main page
    const pageUsername = this.page.locator(
      'input[name="username"], #username'
    );
    await expect(pageUsername).toBeVisible({ timeout: 30000 });
  }

  // Core login logic
  async login(username: string, password: string) {
    const automationLink = this.page.getByRole('link', {
      name: 'Automation',
      exact: true,
    });

    // Skip login if already logged in
    if (await automationLink.isVisible().catch(() => false)) {
      return;
    }

    const iframe = this.page.frameLocator('iframe');
    const iframeUsername = iframe.locator(
      'input[name="username"], #username'
    );

    if (await iframeUsername.count() > 0) {
      await iframeUsername.fill(username);
      await iframe
        .locator('input[name="password"], #password')
        .fill(password);
      await iframe.locator('button[type="submit"]').click();
    } else {
      await this.page
        .locator('input[name="username"], #username')
        .fill(username);
      await this.page
        .locator('input[name="password"], #password')
        .fill(password);
      await this.page.locator('button[type="submit"]').click();
    }

    // Wait for dashboard
    await expect(automationLink).toBeVisible({ timeout: 60000 });
  }

  // 🔥 BACKWARD-COMPATIBLE METHOD (FIXES TS ERROR)
  async loginWithValidation(username: string, password: string) {
    await this.login(username, password);
  }
}
