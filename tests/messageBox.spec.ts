import { test, expect } from '../fixtures/test.fixtures';
import { TestHelpers } from '../utils/testHelpers';

test.describe('Message Box Task Creation', () => {
  test.beforeEach(async () => {
    // Auto-login handled by fixture
  });

  test('should create a message box task successfully', async ({
    dashboardPage,
    taskBotPage,
  }) => {
    // Arrange
    const taskName = TestHelpers.generateUniqueName('MessageTask');

    // Act
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

    // Assert
    await test.step('Verify task was created', async () => {
      await expect(taskBotPage.page).toHaveURL(/.*task.*/);
      // Add more specific assertions based on your application
    });
  });

  test('should validate required fields', async ({ dashboardPage, taskBotPage }) => {
    await dashboardPage.goToAutomation();
    await dashboardPage.openTaskBotCreate();

    // Try to create without name
    await taskBotPage.createTaskBot('');

    // Verify validation message appears
    await expect(taskBotPage.page.locator('.error-message')).toBeVisible();
  });

  test('should handle message box search', async ({ dashboardPage, taskBotPage }) => {
    const taskName = TestHelpers.generateUniqueName('SearchTest');

    await dashboardPage.goToAutomation();
    await dashboardPage.openTaskBotCreate();
    await taskBotPage.createTaskBot(taskName);

    // Search for non-existent action
    await taskBotPage.searchAction('NonExistentAction');
    
    // Verify no results shown
    await expect(taskBotPage.page.locator('.no-results')).toBeVisible();
  });
});

test.describe('Message Box Task - Error Scenarios', () => {
  test.beforeEach(async () => {});

  test('should handle network errors gracefully', async ({
    page,
    dashboardPage,
  }) => {
    // Simulate offline mode
    await page.context().setOffline(true);

    await dashboardPage.goToAutomation();
    
    // Verify error handling
    await expect(page.locator('.network-error')).toBeVisible();

    // Restore connection
    await page.context().setOffline(false);
  });
});