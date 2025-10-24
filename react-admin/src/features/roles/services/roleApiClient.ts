import { USER_API_CONFIG } from '../../../config/api';

/**
 * Role API Client
 * Dedicated HTTP client for Role/Permission management in User Service
 * Handles requests for roles and permissions (User Service - port 3003)
 * Part of the roles feature module
 */
class RoleApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = USER_API_CONFIG.BASE_URL;
    this.defaultHeaders = USER_API_CONFIG.HEADERS;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    // Get current language from localStorage
    const currentLanguage =
      localStorage.getItem('current_language') ||
      localStorage.getItem('preferred_language') ||
      'en';

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        'Accept-Language': currentLanguage,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle validation errors (400 Bad Request)
        if (response.status === 400 && errorData.fieldErrors) {
          const validationError = new Error('Validation failed');
          (validationError as any).validationErrors = errorData.fieldErrors;
          (validationError as any).status = 400;
          throw validationError;
        }

        // Handle other error responses
        throw new Error(
          errorData.message ||
            `Request failed with status ${response.status}`
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error('Role API Client Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const roleApiClient = new RoleApiClient();
