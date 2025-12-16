import { test, expect } from '@playwright/test';

test.describe('Basic Navigation Tests', () => {
  test('should navigate to Automation section', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });

    console.log('Landed URL:', page.url());
    await page.screenshot({ path: 'before-login.png', fullPage: true });


    let usernameField;

    const iframe = page.frameLocator('iframe');
    const iframeUsername = iframe.locator(
      'input[name="username"], #username, [placeholder*="User"]'
    );

    if (await iframeUsername.count() > 0) {
      usernameField = iframeUsername;
      await expect(usernameField).toBeVisible({ timeout: 30000 });

      await usernameField.fill(process.env.TEST_USERNAME!);
      await iframe
        .locator('input[name="password"], #password, [placeholder*="Pass"]')
        .fill(process.env.TEST_PASSWORD!);

      await iframe.locator('button[type="submit"]').click();
    } else {
      usernameField = page.locator(
        'input[name="username"], #username, [placeholder*="User"]'
      );

      await expect(usernameField).toBeVisible({ timeout: 30000 });

      await usernameField.fill(process.env.TEST_USERNAME!);
      await page
        .locator('input[name="password"], #password, [placeholder*="Pass"]')
        .fill(process.env.TEST_PASSWORD!);

      await page.locator('button[type="submit"]').click();
    }

    const automationLink = page.getByRole('link', {
      name: 'Automation',
      exact: true,
    });

    await expect(automationLink).toBeVisible({ timeout: 60000 });

    await automationLink.click();
    await expect(page).toHaveURL(/bots\/repository/);


  });
});
