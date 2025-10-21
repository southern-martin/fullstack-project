import { TRANSLATION_API_CONFIG } from '../../../config/api';

class TranslationApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = TRANSLATION_API_CONFIG.BASE_URL;
    this.defaultHeaders = TRANSLATION_API_CONFIG.HEADERS;
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
      return data;
    } catch (error) {
      if (!(error as any).validationErrors && (error as any).status !== 404) {
        console.error('Translation API request failed:', error);
      }
      throw error;
    }
  }

  async getLanguages(): Promise<any> {
    return this.request<any>('/languages', { method: 'GET' });
  }

  async getActiveLanguages(): Promise<any> {
    return this.request<any>('/languages/active', { method: 'GET' });
  }

  async getLanguage(code: string): Promise<any> {
    return this.request<any>(`/languages/${code}`, { method: 'GET' });
  }

  async getLanguageByCode(code: string): Promise<any> {
    return this.request<any>(`/languages/code/${code}`, { method: 'GET' });
  }

  async createLanguage(data: any): Promise<any> {
    return this.request<any>('/languages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLanguage(code: string, data: any): Promise<any> {
    return this.request<any>(`/languages/${code}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteLanguage(code: string): Promise<any> {
    return this.request<any>(`/languages/${code}`, { method: 'DELETE' });
  }

  async getLanguageCount(): Promise<any> {
    return this.request<any>('/languages/count', { method: 'GET' });
  }

  async getTranslations(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = `/translations${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    return this.request<any>(endpoint, { method: 'GET' });
  }

  async getTranslation(id: number): Promise<any> {
    return this.request<any>(`/translations/${id}`, { method: 'GET' });
  }

  async createTranslation(data: any): Promise<any> {
    return this.request<any>('/translations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTranslation(id: number, data: any): Promise<any> {
    return this.request<any>(`/translations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTranslation(id: number): Promise<any> {
    return this.request<any>(`/translations/${id}`, { method: 'DELETE' });
  }

  async getTranslationCount(): Promise<any> {
    return this.request<any>('/translations/count', { method: 'GET' });
  }

  async getPendingApprovals(): Promise<any> {
    return this.request<any>('/translations/pending', { method: 'GET' });
  }

  async approveTranslation(id: number, approvedBy: string): Promise<any> {
    return this.request<any>(`/translations/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approvedBy }),
    });
  }

  async translateText(data: any): Promise<any> {
    return this.request<any>('/translate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Convenience method for single text translation
   */
  async translate(params: {
    text: string;
    targetLanguage: string;
    sourceLanguage?: string;
  }): Promise<{
    translatedText: string;
    fromCache: boolean;
  }> {
    const response = await this.request<any>('/translate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.data;
  }

  /**
   * Batch translate multiple texts at once
   */
  async translateBatch(params: {
    texts: string[];
    targetLanguage: string;
    sourceLanguage?: string;
  }): Promise<{
    translations: {
      text: string;
      translatedText: string;
      fromCache: boolean;
    }[];
  }> {
    const response = await this.request<any>('/translate/batch', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.data;
  }

  async healthCheck(): Promise<any> {
    // Health endpoint is at /api/v1/health, not /api/v1/translation/health
    // So we need to call it directly without using the base URL
    const healthUrl = this.baseURL.replace('/api/v1/translation', '/api/v1/health');
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error(`Cannot GET ${healthUrl.replace(this.baseURL.split('/api')[0], '')}`);
    }
    
    return response.json();
  }
}

export const translationApiClient = new TranslationApiClient();
export default translationApiClient;
