import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { FormBuilderPage } from '../pages/FormBuilderPage';
import { TestHelpers } from '../utils/testHelpers';
import * as path from 'path';

test('Create Form With Upload', async ({ page }) => {
  const login = new LoginPage(page);
  const dashboard = new DashboardPage(page);
  const form = new FormBuilderPage(page);

  // Generate a real file for the test
  const fileName = 'test-upload-file.txt';
  const fileContent = 'This is a test file for upload functionality.';
  const filePath = TestHelpers.createTestFile(fileName, fileContent);

  try {
    await login.goto();
    // Use env vars or defaults
    await login.login(
      process.env.TEST_USERNAME || 'default-user', 
      process.env.TEST_PASSWORD || 'default-pass'
    );

    await dashboard.goToAutomation();
    await dashboard.openFormCreate();

    await form.createForm('My Upload Form');
    await form.dragAndDropControls();
    await form.fillTextbox('Hello World');
    
    // Upload the generated file
    await form.uploadFile(filePath);
    
    await form.saveForm();
  } finally {
    // Cleanup the generated file
    TestHelpers.cleanupTestFiles();
  }
});