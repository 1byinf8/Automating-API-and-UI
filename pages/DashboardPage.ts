import { Page, expect, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private getAutomationElement(): Locator {
    return this.page.getByText('Automation', { exact: true });
  }

  async goToAutomation() {
    const automation = this.getAutomationElement();

    await expect(automation).toBeVisible({ timeout: 60000 });
    await automation.click();

    await expect(this.page).toHaveURL(/bots\/repository/);
  }

  async openTaskBotCreate() {
    const createBotBtn = this.page.getByRole('button', {
      name: /create a bot/i,
    });

    await expect(createBotBtn).toBeVisible({ timeout: 60000 });
    await createBotBtn.click();
  }
}
