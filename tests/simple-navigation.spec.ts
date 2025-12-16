import { test, expect } from '@playwright/test';

test.describe('Basic Navigation Tests', () => {
  test('should login and see dashboard', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[name="username"]', process.env.TEST_USERNAME!);
    await page.fill('input[name="password"]', process.env.TEST_PASSWORD!);
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForLoadState('networkidle');
    
    // Verify we're logged in by checking for sidebar
    await expect(page.locator('text=Explore')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Automation')).toBeVisible();
    
    await page.screenshot({ path: 'test-results/dashboard.png', fullPage: true });
  });

  test('should navigate to Automation section', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[name="username"]', process.env.TEST_USERNAME!);
    await page.fill('input[name="password"]', process.env.TEST_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Click Automation in sidebar
    await page.click('[href*="/automation"]');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on Automation page
    await expect(page.locator('h1:has-text("Automation")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Folders')).toBeVisible();
    
    await page.screenshot({ path: 'test-results/automation-page.png', fullPage: true });
  });

  test('should see Create button on Automation page', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[name="username"]', process.env.TEST_USERNAME!);
    await page.fill('input[name="password"]', process.env.TEST_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Go to Automation
    await page.click('[href*="/automation"]');
    await page.waitForLoadState('networkidle');
    
    // Verify Create button exists
    const createBtn = page.locator('button:has-text("Create")').first();
    await expect(createBtn).toBeVisible({ timeout: 10000 });
    
    // Click it to see options
    await createBtn.click();
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'test-results/create-menu.png', fullPage: true });
  });
});