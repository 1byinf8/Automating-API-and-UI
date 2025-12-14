import { APIRequestContext, request, expect } from '@playwright/test';
import { Logger } from './logger';

export interface ApiResponse<T = any> {
  status: number;
  body: T;
  headers: Record<string, string>;
}

export class ApiClient {
  private api!: APIRequestContext;
  private token: string | null = null;
  private logger = new Logger('ApiClient');

  constructor(private baseURL?: string) {}

  /**
   * Initialize API context
   */
  async init(): Promise<void> {
    this.api = await request.newContext({
      baseURL: this.baseURL || process.env.API_BASE_URL || process.env.BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
    this.logger.info('API client initialized');
  }

  /**
   * Login and store authentication token
   */
  async login(username: string, password: string): Promise<string> {
    try {
      this.logger.info(`Attempting login for user: ${username}`);
      
      const response = await this.api.post('/api/login', {
        data: { username, password },
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      this.token = body.token;

      this.logger.info('Login successful');
      return this.token!;
    } catch (error) {
      this.logger.error('Login failed', error);
      throw error;
    }
  }

  /**
   * Build authentication headers
   */
  private authHeaders(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  /**
   * Generic GET request with error handling
   */
  async get<T = any>(endpoint: string, options?: { params?: Record<string, any> }): Promise<ApiResponse<T>> {
    try {
      this.logger.info(`GET ${endpoint}`);
      
      const response = await this.api.get(endpoint, {
        headers: this.authHeaders(),
        params: options?.params,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      this.logger.error(`GET ${endpoint} failed`, error);
      throw error;
    }
  }

  /**
   * Generic POST request with error handling
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      this.logger.info(`POST ${endpoint}`);
      
      const response = await this.api.post(endpoint, {
        headers: this.authHeaders(),
        data,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      this.logger.error(`POST ${endpoint} failed`, error);
      throw error;
    }
  }

  /**
   * Generic PUT request with error handling
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      this.logger.info(`PUT ${endpoint}`);
      
      const response = await this.api.put(endpoint, {
        headers: this.authHeaders(),
        data,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      this.logger.error(`PUT ${endpoint} failed`, error);
      throw error;
    }
  }

  /**
   * Generic PATCH request with error handling
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      this.logger.info(`PATCH ${endpoint}`);
      
      const response = await this.api.patch(endpoint, {
        headers: this.authHeaders(),
        data,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      this.logger.error(`PATCH ${endpoint} failed`, error);
      throw error;
    }
  }

  /**
   * Generic DELETE request with error handling
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      this.logger.info(`DELETE ${endpoint}`);
      
      const response = await this.api.delete(endpoint, {
        headers: this.authHeaders(),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      this.logger.error(`DELETE ${endpoint} failed`, error);
      throw error;
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: any): Promise<ApiResponse<T>> {
    const status = response.status();
    const headers = response.headers();
    
    let body: T;
    try {
      body = await response.json();
    } catch {
      body = await response.text() as T;
    }

    this.logger.info(`Response status: ${status}`);

    return { status, body, headers };
  }

  /**
   * Set authentication token manually
   */
  setToken(token: string): void {
    this.token = token;
    this.logger.info('Token updated manually');
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.token = null;
    this.logger.info('Token cleared');
  }

  /**
   * Dispose API context
   */
  async dispose(): Promise<void> {
    await this.api.dispose();
    this.logger.info('API client disposed');
  }
}