import { Page } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  // Updated selectors based on actual UI
  automationMenu = '[href*="/automation"]';
  createButton = 'button:has-text("Create")';
  createBotButton = 'button:has-text("Create a bot")';
  
  async goToAutomation() {
    // Click the Automation menu item in the left sidebar
    await this.page.click(this.automationMenu, { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    
    // Wait for the Automation page heading to appear
    await this.page.waitForSelector('h1:has-text("Automation")', { timeout: 10000 });
  }

  async openTaskBotCreate() {
    // Look for "Create a bot..." button on the home page
    // or the "+ Create" button on the Automation page
    
    // Try the home page button first
    const createBotVisible = await this.page.isVisible('button:has-text("Create a bot")', { timeout: 5000 }).catch(() => false);
    
    if (createBotVisible) {
      await this.page.click('button:has-text("Create a bot")');
    } else {
      // Otherwise use the Create dropdown on Automation page
      await this.page.click('button:has-text("Create")');
      await this.page.waitForTimeout(1000);
      // Select bot option from dropdown
      await this.page.click('text=Bot');
    }
    
    await this.page.waitForLoadState('networkidle');
  }

  async openFormCreate() {
    // Click Create button
    await this.page.click('button:has-text("Create")');
    await this.page.waitForTimeout(1000);
    // Select Form option from dropdown
    await this.page.click('text=Form');
    await this.page.waitForLoadState('networkidle');
  }
}