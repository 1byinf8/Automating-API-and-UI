import { Page, expect } from '@playwright/test';

export class TaskBotPage {
  constructor(public page: Page) {}

  taskName = 'input[name="name"]';
  createBtn = 'button:has-text("Create")';
  messageBoxSearch = 'input[placeholder="Search actions"]';
  messageBoxItem = 'text=Message Box';
  saveBtn = 'button:has-text("Save")';

  async createTaskBot(name: string) {
    await this.page.fill(this.taskName, name);
    await this.page.click(this.createBtn);
  }

  async addMessageBox() {
    await this.page.fill(this.messageBoxSearch, 'Message Box');
    await this.page.dblclick(this.messageBoxItem);

    await expect(this.page.locator(this.messageBoxItem)).toBeVisible();
  }

  async searchAction(actionName: string) {
    await this.page.fill(this.messageBoxSearch, actionName);
    await this.page.press(this.messageBoxSearch, 'Enter');
  }

  async saveConfig() {
    await this.page.click(this.saveBtn);
  }
}