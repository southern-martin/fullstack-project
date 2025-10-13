import { SHARED_API_CONFIG } from '../../config/api';

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = SHARED_API_CONFIG.BASE_URL;
    this.defaultHeaders = SHARED_API_CONFIG.HEADERS;
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
        'Accept-Language': currentLanguage, // Use current language instead of hardcoded 'en'
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      // Debug logs removed

      const response = await fetch(url, config);
      // Debug logs removed

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Debug logs removed

        // Handle validation errors (400 Bad Request)
        if (response.status === 400 && errorData.fieldErrors) {
          const validationError = new Error('Validation failed');
          (validationError as any).validationErrors = errorData.fieldErrors;
          (validationError as any).status = response.status;
          throw validationError;
        }

        // Handle custom rule errors (400 Bad Request)
        if (response.status === 400 && errorData.customRuleErrors) {
          const customRuleError = new Error('Custom rule validation failed');
          (customRuleError as any).customRuleErrors =
            errorData.customRuleErrors;
          (customRuleError as any).status = response.status;
          throw customRuleError;
        }

        // Handle other HTTP errors
        const errorMessage =
          errorData.message || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }

      const data = await response.json();
      // Debug logs removed
      return data;
    } catch (error) {
      // Only log non-validation errors and non-404 errors to avoid console spam
      if (!(error as any).validationErrors && (error as any).status !== 404) {
        console.error('API request failed:', error);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: { ...headers },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: { ...headers },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      headers: { ...headers },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    data?: any, // Added data parameter for DELETE requests
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: { ...headers },
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
