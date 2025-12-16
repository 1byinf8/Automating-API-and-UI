import { Page } from '@playwright/test';

export class TaskBotPage {
  constructor(public page: Page) {}

  // Updated selectors
  taskNameInput = 'input[name="botName"], input[placeholder*="name"]';
  folderDropdown = 'button:has-text("Select folder")';
  createButton = 'button:has-text("Create"), button:has-text("Create and edit")';
  actionSearch = 'input[placeholder*="Search"], input[placeholder*="actions"]';
  messageBoxAction = '[data-action="messagebox"], .action-item:has-text("Message Box")';
  saveButton = 'button:has-text("Save")';
  
  async createTaskBot(name: string) {
    // Wait for the create bot form
    await this.page.waitForSelector(this.taskNameInput, { timeout: 10000 });
    
    // Fill in the bot name
    await this.page.fill(this.taskNameInput, name);
    
    // Select a folder (usually Bots folder is default)
    // Skip folder selection if not required
    
    // Click create
    const createBtnVisible = await this.page.isVisible(this.createButton, { timeout: 5000 });
    if (createBtnVisible) {
      await this.page.click(this.createButton);
      await this.page.waitForLoadState('networkidle');
    }
  }

  async addMessageBox() {
    // Wait for the bot editor to load
    await this.page.waitForTimeout(2000);
    
    // Search for Message Box action
    const searchVisible = await this.page.isVisible(this.actionSearch, { timeout: 5000 });
    if (searchVisible) {
      await this.page.fill(this.actionSearch, 'Message Box');
      await this.page.waitForTimeout(1000);
    }
    
    // Double click or drag the action
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
