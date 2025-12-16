import { test, expect } from '@playwright/test';

test.describe('Debug Tests', () => {
  test('Inspect page after login', async ({ page }) => {
    console.log('Starting debug test...');
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    console.log('Current URL:', page.url());
    await page.screenshot({ path: 'debug-1-login-page.png', fullPage: true });
    
    const username = process.env.TEST_USERNAME || '';
    const password = process.env.TEST_PASSWORD || '';
    
    if (!username || !password) {
      throw new Error('TEST_USERNAME and TEST_PASSWORD environment variables must be set');
    }
    
    console.log('Attempting login with username:', username);
    
    const usernameSelectors = ['#username', 'input[name="username"]', 'input[type="text"]'];
    const passwordSelectors = ['#password', 'input[name="password"]', 'input[type="password"]'];
    
    let usernameFilled = false;
    for (const selector of usernameSelectors) {
      try {
        await page.fill(selector, username, { timeout: 2000 });
        usernameFilled = true;
        console.log('Username filled with selector:', selector);
        break;
      } catch {
        continue;
      }
    }
    
    let passwordFilled = false;
    for (const selector of passwordSelectors) {
      try {
        await page.fill(selector, password, { timeout: 2000 });
        passwordFilled = true;
        console.log('Password filled with selector:', selector);
        break;
      } catch {
        continue;
      }
    }
    
    if (!usernameFilled || !passwordFilled) {
      throw new Error('Could not find login form fields');
    }
    
    const loginButtonSelectors = [
      'button[type="submit"]',
      'button:has-text("Log in")',
      'button:has-text("Login")',
      'button:has-text("Sign in")',
      'input[type="submit"]'
    ];
    
    let loginClicked = false;
    for (const selector of loginButtonSelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
        loginClicked = true;
        console.log('Login button clicked with selector:', selector);
        break;
      } catch {
        continue;
      }
    }
    
    if (!loginClicked) {
      throw new Error('Could not find login button');
    }
    
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.waitForTimeout(5000);
    
    console.log('URL after login:', page.url());
    await page.screenshot({ path: 'debug-2-after-login.png', fullPage: true });
    
    const currentUrl = page.url();
    if (currentUrl.includes('login') || currentUrl.includes('signin')) {
      console.error('WARNING: Still on login page! Authentication may have failed.');
      
      const errorSelectors = ['.error', '.error-message', '[role="alert"]', '.alert-danger'];
      for (const selector of errorSelectors) {
        try {
          const errorText = await page.textContent(selector, { timeout: 1000 });
          console.error('Error message found:', errorText);
        } catch {
        }
      }
    }
    
    console.log('\n=== Clickable Elements ===');
    const clickableElements = await page.$$('button:visible, a:visible, [role="button"]:visible');
    console.log(`Found ${clickableElements.length} clickable elements`);
    
    for (let i = 0; i < Math.min(clickableElements.length, 30); i++) {
      const el = clickableElements[i];
      try {
        const text = await el.textContent();
        const tag = await el.evaluate(e => e.tagName);
        const classes = await el.evaluate(e => e.className);
        console.log(`${i + 1}. ${tag} [${classes}]: "${text?.trim()}"`);
      } catch {
      }
    }
    
    console.log('\n=== Looking for key elements ===');
    const keySelectors = [
      'text=Automation',
      'text=Create',
      'text=Task Bot',
      '[data-testid="automation"]',
      '.menu-item',
      '.navigation',
      '.sidebar'
    ];
    
    for (const selector of keySelectors) {
      try {
        const isVisible = await page.isVisible(selector, { timeout: 1000 });
        console.log(`✓ "${selector}" - ${isVisible ? 'VISIBLE' : 'NOT VISIBLE'}`);
      } catch {
        console.log(`✗ "${selector}" - NOT FOUND`);
      }
    }
    
    console.log('\n=== Test paused for manual inspection ===');
    await page.pause();
  });

  test('Test API authentication directly', async ({ request }) => {
    console.log('Testing API authentication...');
    
    const baseURL = process.env.API_BASE_URL || process.env.BASE_URL;
    const username = process.env.TEST_USERNAME || '';
    const password = process.env.TEST_PASSWORD || '';
    
    console.log('Base URL:', baseURL);
    console.log('Username:', username);
    
    const authEndpoints = [
      '/v1/authentication',
      '/api/v1/authentication',
      '/api/login',
      '/api/auth/login',
      '/authentication',
      '/login'
    ];
    
    for (const endpoint of authEndpoints) {
      try {
        console.log(`\nTrying endpoint: ${endpoint}`);
        
        const response = await request.post(`${baseURL}${endpoint}`, {
          data: {
            username,
            password
          },
          timeout: 10000
        });
        
        const status = response.status();
        console.log(`Status: ${status}`);
        
        let body;
        try {
          body = await response.json();
          console.log('Response body:', JSON.stringify(body, null, 2));
        } catch {
          body = await response.text();
          console.log('Response text:', body);
        }
        
        if (status === 200 || status === 201) {
          console.log('✓ SUCCESS! This endpoint works.');
          console.log('Token fields in response:', Object.keys(body).filter(k => 
            k.toLowerCase().includes('token') || k.toLowerCase().includes('auth')
          ));
          break;
        }
      } catch (error: any) {
        console.log(`✗ Failed: ${error.message}`);
      }
    }
  });

  test('Check environment variables', async ({}) => {
    console.log('\n=== Environment Variables ===');
    console.log('BASE_URL:', process.env.BASE_URL || 'NOT SET');
    console.log('API_BASE_URL:', process.env.API_BASE_URL || 'NOT SET');
    console.log('TEST_USERNAME:', process.env.TEST_USERNAME ? '***SET***' : 'NOT SET');
    console.log('TEST_PASSWORD:', process.env.TEST_PASSWORD ? '***SET***' : 'NOT SET');
    console.log('HEADLESS:', process.env.HEADLESS || 'NOT SET');
    console.log('CI:', process.env.CI || 'NOT SET');
    
    expect(process.env.BASE_URL).toBeDefined();
    expect(process.env.TEST_USERNAME).toBeDefined();
    expect(process.env.TEST_PASSWORD).toBeDefined();
  });
});