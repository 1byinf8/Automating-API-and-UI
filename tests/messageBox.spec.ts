import { test, expect } from '../fixtures/test.fixtures';
import { TestHelpers } from '../utils/testHelpers';

test.describe('Message Box Task Creation', () => {
  test.beforeEach(async () => {});

  test('should create a message box task successfully', async ({
    dashboardPage,
    taskBotPage,
  }) => {
    const taskName = TestHelpers.generateUniqueName('MessageTask');

    await test.step('Navigate to Automation section', async () => {
      await dashboardPage.goToAutomation();
    });

    await test.step('Open Task Bot creation form', async () => {
      await dashboardPage.openTaskBotCreate();
    });

    await test.step('Create new Task Bot', async () => {
      await taskBotPage.createTaskBot(taskName);
    });

    await test.step('Add Message Box action', async () => {
      await taskBotPage.addMessageBox();
    });

    await test.step('Save configuration', async () => {
      await taskBotPage.saveConfig();
    });

    await test.step('Verify task was created', async () => {
      await expect(taskBotPage.page).toHaveURL(/.*task.*/);
    });
  });

  test('should validate required fields', async ({ dashboardPage, taskBotPage }) => {
    await dashboardPage.goToAutomation();
    await dashboardPage.openTaskBotCreate();
    await taskBotPage.createTaskBot('');
    await expect(taskBotPage.page.locator('.error-message')).toBeVisible();
  });

  test('should handle message box search', async ({ dashboardPage, taskBotPage }) => {
    const taskName = TestHelpers.generateUniqueName('SearchTest');

    await dashboardPage.goToAutomation();
    await dashboardPage.openTaskBotCreate();
    await taskBotPage.createTaskBot(taskName);
    await taskBotPage.searchAction('NonExistentAction');
    await expect(taskBotPage.page.locator('.no-results')).toBeVisible();
  });
});

test.describe('Message Box Task - Error Scenarios', () => {
  test.beforeEach(async () => {});

  test('should handle network errors gracefully', async ({
    page,
    dashboardPage,
  }) => {
    await page.context().setOffline(true);
    await dashboardPage.goToAutomation();
    await expect(page.locator('.network-error')).toBeVisible();
    await page.context().setOffline(false);
  });
});