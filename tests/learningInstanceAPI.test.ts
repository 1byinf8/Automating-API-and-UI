import { test, expect, request } from '@playwright/test';

test('Learning Instance API Automation', async () => {
  const api = await request.newContext();

  // 1. Login API
  const loginRes = await api.post('/api/login', {
    data: {
      username: 'your-username',
      password: 'your-password'
    }
  });

  expect(loginRes.status()).toBe(200);
  const token = (await loginRes.json()).token;

  // 2. Create Learning Instance API
  const createRes = await api.post('/api/learningInstance', {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: 'My Learning Instance' }
  });

  expect(createRes.status()).toBe(201);

  const body = await createRes.json();
  expect(body.name).toBe('My Learning Instance');
  expect(body.id).toBeTruthy();
});
