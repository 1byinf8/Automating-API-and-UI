import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { FormBuilderPage } from '../pages/FormBuilderPage';

test('Create Form With Upload', async ({ page }) => {
  const login = new LoginPage(page);
  const dashboard = new DashboardPage(page);
  const form = new FormBuilderPage(page);

  await login.goto();
  await login.login('your-username', 'your-password');

  await dashboard.goToAutomation();
  await dashboard.openFormCreate();

  await form.createForm('My Upload Form');
  await form.dragAndDropControls();
  await form.fillTextbox('Hello World');
  await form.uploadFile('tests/data/sample.pdf');
  await form.saveForm();
});
