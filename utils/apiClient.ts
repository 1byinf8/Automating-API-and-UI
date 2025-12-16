import { APIRequestContext, request } from '@playwright/test';

type ApiResponse<T = any> = {
  status: number;
  body: T;
};

export class ApiClient {
  private api: APIRequestContext | null = null;
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl || 'https://community.cloud.automationanywhere.digital';
  }

  async init() {
    this.api = await request.newContext({
      baseURL: this.baseUrl,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }

  // ✅ REQUIRED by your tests
  async login(username: string, password: string) {
    if (!this.api) throw new Error('API client not initialized');

    const response = await this.api.post('/api/login', {
      data: { username, password },
    });

    if (response.status() !== 200) {
      throw new Error(`Login failed with status ${response.status()}`);
    }
  }

  async get(url: string, options?: any): Promise<ApiResponse> {
    if (!this.api) throw new Error('API client not initialized');

    const res = await this.api.get(url, options);
    return {
      status: res.status(),
      body: await res.json().catch(() => ({})),
    };
  }

  async post(url: string, data?: any): Promise<ApiResponse> {
    if (!this.api) throw new Error('API client not initialized');

    const res = await this.api.post(url, { data });
    return {
      status: res.status(),
      body: await res.json().catch(() => ({})),
    };
  }

  async put(url: string, data?: any): Promise<ApiResponse> {
    if (!this.api) throw new Error('API client not initialized');

    const res = await this.api.put(url, { data });
    return {
      status: res.status(),
      body: await res.json().catch(() => ({})),
    };
  }

  async delete(url: string): Promise<ApiResponse> {
    if (!this.api) throw new Error('API client not initialized');

    const res = await this.api.delete(url);
    return {
      status: res.status(),
      body: await res.json().catch(() => ({})),
    };
  }

  async dispose() {
    if (this.api) {
      await this.api.dispose();
    }
  }
}
