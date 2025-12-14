import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/apiClient';

test('Learning Instance API Automation', async () => {
  const client = new ApiClient();
  await client.init();

  // 1. Login
  await client.login('your-username', 'your-password');

  // 2. Create Learning Instance
  const createRes = await client.post('/api/learningInstance', {
    name: 'My Learning Instance',
  });

  expect(createRes.status()).toBe(201);
  const body = await createRes.json();

  expect(body.id).toBeTruthy();
  expect(body.name).toBe('My Learning Instance');
});
