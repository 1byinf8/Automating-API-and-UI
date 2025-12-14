import { Page, expect } from '@playwright/test';

export class FormBuilderPage {
  constructor(private page: Page) {}

  formName = 'input[name="name"]';
  createFormBtn = 'button:has-text("Create")';
  textbox = 'text=Textbox';
  fileUpload = 'text=Select File';
  canvas = '.canvas-area'; 
  saveBtn = 'button:has-text("Save")';
  textboxInput = 'input[type="text"]';
  fileInput = 'input[type="file"]';

  async createForm(name: string) {
    await this.page.fill(this.formName, name);
    await this.page.click(this.createFormBtn);
  }

  async dragAndDropControls() {
    await this.page.dragAndDrop(this.textbox, this.canvas);
    await this.page.dragAndDrop(this.fileUpload, this.canvas);
  }

  async fillTextbox(text: string) {
    await this.page.fill(this.textboxInput, text);
  }

  async uploadFile(path: string) {
    await this.page.setInputFiles(this.fileInput, path);
  }

  async saveForm() {
    await this.page.click(this.saveBtn);
  }
}
