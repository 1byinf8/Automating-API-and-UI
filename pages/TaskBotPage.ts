import { Page } from '@playwright/test';

export class TaskBotPage {
  constructor(public page: Page) {}

  taskNameInput = 'input[name="botName"], input[placeholder*="name"]';
  folderDropdown = 'button:has-text("Select folder")';
  createButton = 'button:has-text("Create"), button:has-text("Create and edit")';
  actionSearch = 'input[placeholder*="Search"], input[placeholder*="actions"]';
  messageBoxAction = '[data-action="messagebox"], .action-item:has-text("Message Box")';
  saveButton = 'button:has-text("Save")';
  
  async createTaskBot(name: string) {
    await this.page.waitForSelector(this.taskNameInput, { timeout: 10000 });
    await this.page.fill(this.taskNameInput, name);
    
    const createBtnVisible = await this.page.isVisible(this.createButton, { timeout: 5000 });
    if (createBtnVisible) {
      await this.page.click(this.createButton);
      await this.page.waitForLoadState('networkidle');
    }
  }

  async addMessageBox() {
    await this.page.waitForTimeout(2000);
    
    const searchVisible = await this.page.isVisible(this.actionSearch, { timeout: 5000 });
    if (searchVisible) {
      await this.page.fill(this.actionSearch, 'Message Box');
      await this.page.waitForTimeout(1000);
    }
    
    const actionVisible = await this.page.isVisible(this.messageBoxAction, { timeout: 5000 });
    if (actionVisible) {
      await this.page.dblclick(this.messageBoxAction);
    }
    
    await this.page.waitForTimeout(1000);
  }

  async searchAction(actionName: string) {
    await this.page.fill(this.actionSearch, actionName);
    await this.page.waitForTimeout(500);
  }

  async saveConfig() {
    const saveVisible = await this.page.isVisible(this.saveButton, { timeout: 5000 });
    if (saveVisible) {
      await this.page.click(this.saveButton);
      await this.page.waitForLoadState('networkidle');
    }
  }
}
