import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Create Form With Upload', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.loginWithValidation(
    process.env.TEST_USERNAME!,
    process.env.TEST_PASSWORD!
  );

  // Navigate to Forms / Automation page as needed
  await page.getByRole('link', { name: 'Automation', exact: true }).click();

  // Click create form (example)
  await page.getByRole('button', { name: /create/i }).click();

  // ---- FILE UPLOAD FIX ----
  await page.getByRole('button', { name: /upload/i }).click();

  const fileInput = page.locator('input[type="file"]');
  await expect(fileInput).toHaveCount(1);

  await fileInput.setInputFiles('tests/fixtures/sample.pdf');

  // Assert file uploaded
  await expect(page.locator('text=sample.pdf')).toBeVisible();
});
