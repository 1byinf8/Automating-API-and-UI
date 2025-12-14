import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TaskBotPage } from '../pages/TaskBotPage';

test('Create Message Box Task', async ({ page }) => {
  const login = new LoginPage(page);
  const dashboard = new DashboardPage(page);
  const task = new TaskBotPage(page);

  await login.goto();
  await login.login('your-username', 'your-password');

  await dashboard.goToAutomation();
  await dashboard.openTaskBotCreate();

  await task.createTaskBot('My Message Task');
  await task.addMessageBox();
  await task.saveConfig();
});
