import { PaginatedResponse } from '../../../shared/types';
import { translationApiClient } from './translationApiClient';

export interface Language {
  code: string; // Primary key (no separate id in old system)
  name: string;
  localName: string; // Changed from nativeName
  status: string; // 'active' or 'inactive' (changed from isActive boolean)
  flag?: string; // Flag emoji
  isDefault?: boolean;
  metadata?: {
    direction?: 'ltr' | 'rtl'; // Changed from isRTL
    region?: string;
    currency?: string;
    dateFormat?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  
  // Computed property for backward compatibility
  isActive?: boolean; // derived from status === 'active'
  isRTL?: boolean; // derived from metadata.direction === 'rtl'
}

export interface Translation {
  id: number;
  key: string;
  original: string; // Changed from originalText
  destination: string; // Changed from translatedText  
  languageCode: string; // Changed from languageId (number)
  language?: {
    code: string;
    name: string;
    flag?: string;
    localName?: string;
  } | null;
  context?: {
    category?: string;
    module?: string;
    component?: string;
    field?: string;
  };
  isApproved?: boolean;
  approvedBy?: string;
  approvedAt?: string;
  usageCount?: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Backward compatibility aliases
  languageId?: number; // deprecated
  value?: string; // deprecated, use destination
  isActive?: boolean; // deprecated
}

export interface CreateLanguageDto {
  code: string;
  name: string;
  localName?: string; // Changed from nativeName
  status?: string; // 'active' or 'inactive' (changed from isActive)
  flag?: string;
  isDefault?: boolean;
  metadata?: {
    direction?: 'ltr' | 'rtl'; // Changed from isRTL
    region?: string;
    currency?: string;
    dateFormat?: string;
  };
  
  // Backward compatibility (will be converted)
  nativeName?: string; // deprecated, use localName
  isRTL?: boolean; // deprecated, use metadata.direction
  isActive?: boolean; // deprecated, use status
}

export interface UpdateLanguageDto {
  code?: string;
  name?: string;
  localName?: string; // Changed from nativeName
  status?: string; // 'active' or 'inactive'
  flag?: string;
  isDefault?: boolean;
  metadata?: {
    direction?: 'ltr' | 'rtl';
    region?: string;
    currency?: string;
    dateFormat?: string;
  };
  
  // Backward compatibility
  nativeName?: string; // deprecated, use localName
  isRTL?: boolean; // deprecated, use metadata.direction
  isActive?: boolean; // deprecated, use status
}

export interface CreateTranslationDto {
  key: string;
  languageCode: string; // Changed from languageId (number)
  original: string; // Changed from originalText
  destination: string; // Changed from translatedText/value
  context?: {
    category?: string;
    module?: string;
    component?: string;
    field?: string;
  };
  isApproved?: boolean;
  
  // Backward compatibility
  languageId?: number; // deprecated, use languageCode
  value?: string; // deprecated, use destination
  isActive?: boolean; // deprecated
}

export interface UpdateTranslationDto {
  key?: string;
  languageCode?: string; // Changed from languageId
  original?: string; // Changed from originalText
  destination?: string; // Changed from translatedText/value
  context?: {
    category?: string;
    module?: string;
    component?: string;
    field?: string;
  };
  isApproved?: boolean;
  
  // Backward compatibility
  languageId?: number; // deprecated, use languageCode
  value?: string; // deprecated, use destination
  isActive?: boolean; // deprecated
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
  // Helper method to transform language data from backend
  private transformLanguage(lang: any): Language {
    return {
      code: lang.code,
      name: lang.name,
      localName: lang.localName,
      status: lang.status,
      flag: lang.flag,
      isDefault: lang.isDefault,
      metadata: lang.metadata || {},
      createdAt: lang.createdAt,
      updatedAt: lang.updatedAt,
      // Computed backward compatibility properties
      isActive: lang.status === 'active',
      isRTL: lang.metadata?.direction === 'rtl',
    };
  }

  // Helper method to transform translation data from backend
  private transformTranslation(trans: any): Translation {
    return {
      id: trans.id,
      key: trans.key,
      original: trans.original,
      destination: trans.destination,
      languageCode: trans.languageCode,
      language: trans.language,
      context: trans.context,
      isApproved: trans.isApproved,
      approvedBy: trans.approvedBy,
      approvedAt: trans.approvedAt,
      usageCount: trans.usageCount,
      lastUsedAt: trans.lastUsedAt,
      createdAt: trans.createdAt,
      updatedAt: trans.updatedAt,
      // Backward compatibility
      value: trans.destination,
    };
  }

  // Language Management
  async getLanguages(): Promise<Language[]> {
    try {
      const response = await translationApiClient.getLanguages();
      const languages = response.data?.languages || response.data?.data || response.data || [];
      return languages.map((lang: any) => this.transformLanguage(lang));
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  }

  async getActiveLanguages(): Promise<Language[]> {
    try {
      const response = await translationApiClient.getActiveLanguages();
      const languages = response.data?.languages || response.data?.data || response.data || [];
      return languages.map((lang: any) => this.transformLanguage(lang));
    } catch (error) {
      console.error('Error fetching active languages:', error);
      return [];
    }
  }

  async getLanguage(code: string): Promise<Language> {
    try {
      const response = await translationApiClient.getLanguage(code);
      const lang = response.data?.data || response.data;
      return this.transformLanguage(lang);
    } catch (error) {
      console.error(`Error fetching language ${code}:`, error);
      throw error;
    }
  }

  async getLanguageByCode(code: string): Promise<Language> {
    try {
      const response = await translationApiClient.getLanguageByCode(code);
      const lang = response.data?.data || response.data;
      return this.transformLanguage(lang);
    } catch (error) {
      console.error(`Error fetching language by code ${code}:`, error);
      throw error;
    }
  }

  async createLanguage(data: CreateLanguageDto): Promise<Language> {
    try {
      const response = await translationApiClient.createLanguage(data);
      const lang = response.data?.data || response.data;
      return this.transformLanguage(lang);
    } catch (error) {
      console.error('Error creating language:', error);
      throw error;
    }
  }

  async updateLanguage(code: string, data: UpdateLanguageDto): Promise<Language> {
    try {
      const response = await translationApiClient.updateLanguage(code, data);
      const lang = response.data?.data || response.data;
      return this.transformLanguage(lang);
    } catch (error) {
      console.error(`Error updating language ${code}:`, error);
      throw error;
    }
  }

  async deleteLanguage(code: string): Promise<void> {
    try {
      await translationApiClient.deleteLanguage(code);
    } catch (error) {
      console.error(`Error deleting language ${code}:`, error);
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
      // Backend returns { translations: [...], total: ... } directly
      const responseData = response.data || response;
      
      // Transform translations
      const translations = responseData.translations || responseData.data || [];
      const transformedTranslations = translations.map((trans: any) => this.transformTranslation(trans));
      
      return {
        data: transformedTranslations,
        total: responseData.total || 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil((responseData.total || 0) / (params?.limit || 10))
      };
    } catch (error) {
      console.error('Error fetching translations:', error);
      throw error;
    }
  }

  async getTranslation(id: number): Promise<Translation> {
    try {
      const response = await translationApiClient.getTranslation(id);
      const trans = response.data?.data || response.data;
      return this.transformTranslation(trans);
    } catch (error) {
      console.error(`Error fetching translation ${id}:`, error);
      throw error;
    }
  }

  async createTranslation(data: CreateTranslationDto): Promise<Translation> {
    try {
      const response = await translationApiClient.createTranslation(data);
      const trans = response.data?.data || response.data;
      return this.transformTranslation(trans);
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
      const trans = response.data?.data || response.data;
      return this.transformTranslation(trans);
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
      return response; // Already unwrapped by translationApiClient
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
