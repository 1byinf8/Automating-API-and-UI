import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/', { timeout: 60000 });
    await this.waitForReady();
  }

  async waitForReady() {
    const automationLink = this.page.getByRole('link', {
      name: 'Automation',
      exact: true,
    });

    if (await automationLink.isVisible().catch(() => false)) {
      return;
    }

    const iframe = this.page.frameLocator('iframe');
    const iframeUsername = iframe.locator(
      'input[name="username"], #username'
    );

    if (await iframeUsername.count() > 0) {
      await expect(iframeUsername).toBeVisible({ timeout: 30000 });
      return;
    }

    const pageUsername = this.page.locator(
      'input[name="username"], #username'
    );
    await expect(pageUsername).toBeVisible({ timeout: 30000 });
  }

  async login(username: string, password: string) {
    const automationLink = this.page.getByRole('link', {
      name: 'Automation',
      exact: true,
    });

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

    await expect(automationLink).toBeVisible({ timeout: 60000 });
  }

  async loginWithValidation(username: string, password: string) {
    await this.login(username, password);
  }
}
