import { Page } from '@playwright/test';

export class FormBuilderPage {
  constructor(private page: Page) {}

  formNameInput = 'input[name="formName"], input[placeholder*="name"]';
  createButton = 'button:has-text("Create")';
  textboxControl = '.control-item:has-text("Textbox"), [data-control="textbox"]';
  fileUploadControl = '.control-item:has-text("File"), [data-control="file"]';
  canvas = '.form-canvas, .form-builder-canvas';
  saveButton = 'button:has-text("Save")';

  async createForm(name: string) {
    await this.page.waitForSelector(this.formNameInput, { timeout: 10000 });
    await this.page.fill(this.formNameInput, name);
    
    const createVisible = await this.page.isVisible(this.createButton, { timeout: 5000 });
    if (createVisible) {
      await this.page.click(this.createButton);
      await this.page.waitForLoadState('networkidle');
    }
  }

  async dragAndDropControls() {
    // Wait for form builder to load
    await this.page.waitForTimeout(2000);
    
    // Drag textbox to canvas
    const textboxVisible = await this.page.isVisible(this.textboxControl, { timeout: 5000 });
    const canvasVisible = await this.page.isVisible(this.canvas, { timeout: 5000 });
    
    if (textboxVisible && canvasVisible) {
      await this.page.dragAndDrop(this.textboxControl, this.canvas);
      await this.page.waitForTimeout(1000);
    }
    
    // Drag file upload to canvas
    const fileVisible = await this.page.isVisible(this.fileUploadControl, { timeout: 5000 });
    if (fileVisible && canvasVisible) {
      await this.page.dragAndDrop(this.fileUploadControl, this.canvas);
      await this.page.waitForTimeout(1000);
    }
  }

  async fillTextbox(text: string) {
    const textInput = await this.page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill(text);
    }
  }

  async uploadFile(path: string) {
    const fileInput = await this.page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path);
    }
  }

  async saveForm() {
    const saveVisible = await this.page.isVisible(this.saveButton, { timeout: 5000 });
    if (saveVisible) {
      await this.page.click(this.saveButton);
      await this.page.waitForLoadState('networkidle');
    }
  }
}