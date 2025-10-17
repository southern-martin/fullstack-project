import { PaginatedResponse } from '../../../shared/types';
import { translationApiClient } from './translationApiClient';

export interface Language {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
  isActive: boolean;
}

export interface Translation {
  id: number;
  key: string;
  languageId: number;
  languageCode: string;
  value: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLanguageDto {
  code: string;
  name: string;
  nativeName?: string;
  isRTL?: boolean;
  isActive?: boolean;
}

export interface UpdateLanguageDto {
  code?: string;
  name?: string;
  nativeName?: string;
  isRTL?: boolean;
  isActive?: boolean;
}

export interface CreateTranslationDto {
  key: string;
  languageId: number;
  value: string;
  isActive?: boolean;
}

export interface UpdateTranslationDto {
  key?: string;
  languageId?: number;
  value?: string;
  isActive?: boolean;
}

export interface TranslateTextDto {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
  context?: {
    category?: string;
    module?: string;
    component?: string;
    field?: string;
  };
}

class TranslationService {
  // Language Management
  async getLanguages(): Promise<Language[]> {
    try {
      const response = await translationApiClient.getLanguages();
      // The API returns { languages: [...], total: ..., page: ..., limit: ..., totalPages: ... }
      return (
        response.data.languages || response.data.data || response.data || []
      );
    } catch (error) {
      console.error('Error fetching languages:', error);
      // Return empty array on error to prevent crashes
      return [];
    }
  }

  async getActiveLanguages(): Promise<Language[]> {
    try {
      const response = await translationApiClient.getActiveLanguages();
      // The API returns { languages: [...], total: ..., page: ..., limit: ..., totalPages: ... }
      return (
        response.data.languages || response.data.data || response.data || []
      );
    } catch (error) {
      console.error('Error fetching active languages:', error);
      // Return empty array on error to prevent crashes
      return [];
    }
  }

  async getLanguage(id: number): Promise<Language> {
    try {
      const response = await translationApiClient.getLanguage(id);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching language ${id}:`, error);
      throw error;
    }
  }

  async getLanguageByCode(code: string): Promise<Language> {
    try {
      const response = await translationApiClient.getLanguageByCode(code);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching language by code ${code}:`, error);
      throw error;
    }
  }

  async createLanguage(data: CreateLanguageDto): Promise<Language> {
    try {
      const response = await translationApiClient.createLanguage(data);
      return response.data;
    } catch (error) {
      console.error('Error creating language:', error);
      throw error;
    }
  }

  async updateLanguage(id: number, data: UpdateLanguageDto): Promise<Language> {
    try {
      const response = await translationApiClient.updateLanguage(id, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating language ${id}:`, error);
      throw error;
    }
  }

  async deleteLanguage(id: number): Promise<void> {
    try {
      await translationApiClient.deleteLanguage(id);
    } catch (error) {
      console.error(`Error deleting language ${id}:`, error);
      throw error;
    }
  }

  async getLanguageCount(): Promise<{ count: number }> {
    try {
      const response = await translationApiClient.getLanguageCount();
      return response.data;
    } catch (error) {
      console.error('Error fetching language count:', error);
      throw error;
    }
  }

  // Translation Management
  async getTranslations(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Translation>> {
    try {
      const response = await translationApiClient.getTranslations(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching translations:', error);
      throw error;
    }
  }

  async getTranslation(id: number): Promise<Translation> {
    try {
      const response = await translationApiClient.getTranslation(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching translation ${id}:`, error);
      throw error;
    }
  }

  async createTranslation(data: CreateTranslationDto): Promise<Translation> {
    try {
      const response = await translationApiClient.createTranslation(data);
      return response.data;
    } catch (error) {
      console.error('Error creating translation:', error);
      throw error;
    }
  }

  async updateTranslation(
    id: number,
    data: UpdateTranslationDto
  ): Promise<Translation> {
    try {
      const response = await translationApiClient.updateTranslation(id, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating translation ${id}:`, error);
      throw error;
    }
  }

  async deleteTranslation(id: number): Promise<void> {
    try {
      await translationApiClient.deleteTranslation(id);
    } catch (error) {
      console.error(`Error deleting translation ${id}:`, error);
      throw error;
    }
  }

  async getTranslationCount(): Promise<{ count: number }> {
    try {
      const response = await translationApiClient.getTranslationCount();
      return response.data;
    } catch (error) {
      console.error('Error fetching translation count:', error);
      throw error;
    }
  }

  async getPendingApprovals(): Promise<Translation[]> {
    try {
      const response = await translationApiClient.getPendingApprovals();
      return response.data;
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw error;
    }
  }

  async approveTranslation(
    id: number,
    approvedBy: string
  ): Promise<Translation> {
    try {
      const response = await translationApiClient.approveTranslation(
        id,
        approvedBy
      );
      return response.data;
    } catch (error) {
      console.error(`Error approving translation ${id}:`, error);
      throw error;
    }
  }

  // Translation Operations
  async translateText(data: TranslateTextDto): Promise<{
    translatedText: string;
    fromCache: boolean;
  }> {
    try {
      const response = await translationApiClient.translateText(data);
      return response.data;
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  }

  async translateBatch(data: {
    texts: string[];
    targetLanguage: string;
    sourceLanguage: string;
  }): Promise<{
    translations: {
      text: string;
      translatedText: string;
      fromCache: boolean;
    }[];
  }> {
    try {
      const response = await translationApiClient.translateBatch(data);
      return response.data;
    } catch (error) {
      console.error('Error translating batch:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await translationApiClient.healthCheck();
      return true;
    } catch (error) {
      console.error('Translation service health check failed:', error);
      return false;
    }
  }
}

export const translationService = new TranslationService();
export default translationService;
