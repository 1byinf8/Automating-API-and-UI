import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TaskBotPage } from '../pages/TaskBotPage';
import { FormBuilderPage } from '../pages/FormBuilderPage';
import { ApiClient } from '../utils/apiClient';

type TestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  taskBotPage: TaskBotPage;
  formBuilderPage: FormBuilderPage;
  apiClient: ApiClient;
  authenticatedPage: void;
};

export const test = base.extend<TestFixtures>({
  // Login Page fixture
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Dashboard Page fixture
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  // TaskBot Page fixture
  taskBotPage: async ({ page }, use) => {
    const taskBotPage = new TaskBotPage(page);
    await use(taskBotPage);
  },

  // FormBuilder Page fixture
  formBuilderPage: async ({ page }, use) => {
    const formBuilderPage = new FormBuilderPage(page);
    await use(formBuilderPage);
  },

  // API Client fixture
  apiClient: async ({}, use) => {
    const client = new ApiClient();
    await client.init();
    await use(client);
    await client.dispose();
  },

  // Authenticated page fixture - auto-login before each test
  authenticatedPage: async ({ loginPage }, use) => {
    await loginPage.goto();
    await loginPage.loginWithValidation(
      process.env.TEST_USERNAME!,
      process.env.TEST_PASSWORD!
    );
    await use();
  },
});

export { expect };