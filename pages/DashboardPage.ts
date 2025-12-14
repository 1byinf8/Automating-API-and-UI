import { Page } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  automationMenu = 'text=Automation';
  createDropdown = 'button:has-text("Create")';
  taskBotOption = 'text=Task Bot';
  formOption = 'text=Form';

  async goToAutomation() {
    await this.page.click(this.automationMenu);
  }

  async openTaskBotCreate() {
    await this.page.click(this.createDropdown);
    await this.page.click(this.taskBotOption);
  }

  async openFormCreate() {
    await this.page.click(this.createDropdown);
    await this.page.click(this.formOption);
  }
}
