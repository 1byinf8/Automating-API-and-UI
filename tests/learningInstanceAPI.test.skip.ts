import { test, expect } from '../fixtures/test.fixtures';
import { TestHelpers } from '../utils/testHelpers';

test.describe('Learning Instance API', () => {
  let instanceId: string;

  test.beforeEach(async ({ apiClient }) => {
    await apiClient.login(
      process.env.TEST_USERNAME!,
      process.env.TEST_PASSWORD!
    );
  });

  test('should create learning instance successfully', async ({ apiClient }) => {
    const instanceName = TestHelpers.generateUniqueName('LearningInstance');
    const payload = {
      name: instanceName,
      description: 'Test learning instance',
      type: 'automation',
    };

    const response = await apiClient.post('/api/learningInstance', payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(instanceName);
    expect(response.body.description).toBe(payload.description);
    
    instanceId = response.body.id;
  });

  test('should get learning instance by id', async ({ apiClient }) => {
    const instanceName = TestHelpers.generateUniqueName('GetTest');
    const createResponse = await apiClient.post('/api/learningInstance', {
      name: instanceName,
    });
    
    const id = createResponse.body.id;
    const response = await apiClient.get(`/api/learningInstance/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id);
    expect(response.body.name).toBe(instanceName);
  });

  test('should update learning instance', async ({ apiClient }) => {
    const createResponse = await apiClient.post('/api/learningInstance', {
      name: TestHelpers.generateUniqueName('UpdateTest'),
    });
    
    const id = createResponse.body.id;
    const updatedName = TestHelpers.generateUniqueName('Updated');

    const response = await apiClient.put(`/api/learningInstance/${id}`, {
      name: updatedName,
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedName);
  });

  test('should delete learning instance', async ({ apiClient }) => {
    const createResponse = await apiClient.post('/api/learningInstance', {
      name: TestHelpers.generateUniqueName('DeleteTest'),
    });
    
    const id = createResponse.body.id;
    const response = await apiClient.delete(`/api/learningInstance/${id}`);

    expect(response.status).toBe(204);

    const getResponse = await apiClient.get(`/api/learningInstance/${id}`);
    expect(getResponse.status).toBe(404);
  });

  test('should list all learning instances', async ({ apiClient }) => {
    const response = await apiClient.get('/api/learningInstance', {
      params: { page: 1, limit: 10 },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('page');
  });

  test('should handle invalid instance id', async ({ apiClient }) => {
    const response = await apiClient.get('/api/learningInstance/invalid-id');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  test('should validate required fields on create', async ({ apiClient }) => {
    const response = await apiClient.post('/api/learningInstance', {});

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('name');
  });

  test('should handle unauthorized access', async ({}) => {
    const unauthClient = new (await import('../utils/apiClient')).ApiClient();
    await unauthClient.init();

    const response = await unauthClient.get('/api/learningInstance');

    expect(response.status).toBe(401);

    await unauthClient.dispose();
  });

  test.afterEach(async ({ apiClient }) => {
    if (instanceId) {
      try {
        await apiClient.delete(`/api/learningInstance/${instanceId}`);
      } catch {
      }
    }
  });
});