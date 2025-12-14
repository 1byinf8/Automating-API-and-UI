import { APIRequestContext, request, expect } from '@playwright/test';

export class ApiClient {
  private api: APIRequestContext;
  private token: string | null = null;

  constructor() {}

  // Initialize API context
  async init() {
    this.api = await request.newContext({
      baseURL: 'https://community.cloud.automationanywhere.digital',
    });
  }

  // Login and store token
  async login(username: string, password: string) {
    const response = await this.api.post('/api/login', {
      data: { username, password },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    this.token = body.token;

    return this.token;
  }

  // Private method to build headers
  private authHeaders() {
    return this.token
      ? { Authorization: `Bearer ${this.token}` }
      : {};
  }

  // Generic GET
  async get(endpoint: string) {
    const res = await this.api.get(endpoint, {
      headers: this.authHeaders(),
    });
    return res;
  }

  // Generic POST
  async post(endpoint: string, data: any) {
    const res = await this.api.post(endpoint, {
      headers: this.authHeaders(),
      data,
    });
    return res;
  }

  // Generic PUT
  async put(endpoint: string, data: any) {
    const res = await this.api.put(endpoint, {
      headers: this.authHeaders(),
      data,
    });
    return res;
  }

  // Generic DELETE
  async delete(endpoint: string) {
    const res = await this.api.delete(endpoint, {
      headers: this.authHeaders(),
    });
    return res;
  }
}
