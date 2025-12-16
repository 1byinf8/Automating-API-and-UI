import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Create Form With Upload', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.loginWithValidation(
    process.env.TEST_USERNAME!,
    process.env.TEST_PASSWORD!
  );

  await page.getByRole('link', { name: 'Automation', exact: true }).click();
  await page.getByRole('button', { name: /create/i }).click();
  await page.getByRole('button', { name: /upload/i }).click();

  const fileInput = page.locator('input[type="file"]');
  await expect(fileInput).toHaveCount(1);

  await fileInput.setInputFiles('tests/fixtures/sample.pdf');
  await expect(page.locator('text=sample.pdf')).toBeVisible();
});
