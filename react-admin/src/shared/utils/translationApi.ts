import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { TRANSLATION_API_CONFIG } from '../../config/api';

// Translation API Client
class TranslationApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: TRANSLATION_API_CONFIG.BASE_URL,
      timeout: TRANSLATION_API_CONFIG.TIMEOUT,
      headers: TRANSLATION_API_CONFIG.HEADERS,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Language Management
  async getLanguages(): Promise<AxiosResponse<any>> {
    return this.client.get('/translation/languages');
  }

  async getActiveLanguages(): Promise<AxiosResponse<any>> {
    return this.client.get('/translation/languages/active');
  }

  async getLanguage(id: number): Promise<AxiosResponse<any>> {
    return this.client.get(`/translation/languages/${id}`);
  }

  async getLanguageByCode(code: string): Promise<AxiosResponse<any>> {
    return this.client.get(`/translation/languages/code/${code}`);
  }

  async createLanguage(data: any): Promise<AxiosResponse<any>> {
    return this.client.post('/translation/languages', data);
  }

  async updateLanguage(id: number, data: any): Promise<AxiosResponse<any>> {
    return this.client.patch(`/translation/languages/${id}`, data);
  }

  async deleteLanguage(id: number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/translation/languages/${id}`);
  }

  async getLanguageCount(): Promise<AxiosResponse<any>> {
    return this.client.get('/translation/languages/count');
  }

  // Translation Management
  async getTranslations(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AxiosResponse<any>> {
    return this.client.get('/translation/translations', { params });
  }

  async getTranslation(id: number): Promise<AxiosResponse<any>> {
    return this.client.get(`/translation/translations/${id}`);
  }

  async createTranslation(data: any): Promise<AxiosResponse<any>> {
    return this.client.post('/translation/translations', data);
  }

  async updateTranslation(id: number, data: any): Promise<AxiosResponse<any>> {
    return this.client.patch(`/translation/translations/${id}`, data);
  }

  async deleteTranslation(id: number): Promise<AxiosResponse<any>> {
    return this.client.delete(`/translation/translations/${id}`);
  }

  async getTranslationCount(): Promise<AxiosResponse<any>> {
    return this.client.get('/translation/translations/count');
  }

  async getPendingApprovals(): Promise<AxiosResponse<any>> {
    return this.client.get('/translation/translations/pending');
  }

  async approveTranslation(
    id: number,
    approvedBy: string
  ): Promise<AxiosResponse<any>> {
    return this.client.patch(`/translation/translations/${id}/approve`, {
      approvedBy,
    });
  }

  // Translation Operations
  async translateText(data: {
    text: string;
    targetLanguage: string;
    sourceLanguage?: string;
    context?: {
      category?: string;
      module?: string;
      component?: string;
      field?: string;
    };
  }): Promise<AxiosResponse<any>> {
    return this.client.post('/translation/translate', data);
  }

  async translateBatch(data: {
    texts: string[];
    targetLanguage: string;
    sourceLanguage: string;
  }): Promise<AxiosResponse<any>> {
    return this.client.post('/translation/translate/batch', data);
  }

  // Health check
  async healthCheck(): Promise<AxiosResponse<any>> {
    return this.client.get('/health');
  }
}

// Export singleton instance
export const translationApiClient = new TranslationApiClient();
export default translationApiClient;
