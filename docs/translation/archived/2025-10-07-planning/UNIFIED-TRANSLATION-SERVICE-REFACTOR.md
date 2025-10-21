# 🔄 Unified Translation Service Refactor

## 📋 Overview

This document shows how to **unify** your current UI translation (labels) with content translation into a **single, integrated translation service** that handles both UI text and dynamic content seamlessly.

## 🎯 Current vs. Unified Architecture

### **Current System (Separate)**
```
TranslationService (UI Only)
├── translate() - UI text translation
├── addTranslation() - Add UI translations
└── getTranslationsByLanguage() - Get UI translations

ContentTranslationService (Content Only) - NEW
├── translateContent() - Content translation
├── translateCustomer() - Customer translation
└── addContentTranslation() - Add content translations
```

### **Unified System (Integrated)**
```
UnifiedTranslationService (Both UI & Content)
├── translate() - Generic translation (UI + Content)
├── translateText() - Text translation
├── translateContent() - Content object translation
├── translateUI() - UI-specific translation
├── addTranslation() - Add any translation
└── getTranslations() - Get all translations
```

## 🚀 Implementation

### **1. Unified Translation Service**

**File**: `nestjs-app-api/api/src/shared/translation/services/unified-translation.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguageValue } from '../entities/language-value.entity';
import { Language } from '../entities/language.entity';
import * as crypto from 'crypto';

@Injectable()
export class UnifiedTranslationService {
  private readonly cache = new Map<string, string>();
  private readonly cacheExpiry = new Map<string, number>();
  private readonly CACHE_TTL = 3600000; // 1 hour

  constructor(
    @InjectRepository(LanguageValue)
    private readonly languageValueRepository: Repository<LanguageValue>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>
  ) {}

  /**
   * UNIFIED TRANSLATION METHOD
   * Handles both UI text and content translation
   */
  async translate(
    input: string | any,
    params: any = {},
    language: string = "en"
  ): Promise<string | any> {
    try {
      // If input is a string, translate it as text
      if (typeof input === 'string') {
        return this.translateText(input, params, language);
      }

      // If input is an object, translate it as content
      if (typeof input === 'object' && input !== null) {
        return this.translateContent(input, language);
      }

      // Return as-is for other types
      return input;
    } catch (error) {
      console.error('Translation error:', error);
      return input;
    }
  }

  /**
   * TRANSLATE TEXT (UI Labels, Messages, etc.)
   * This replaces your current translate() method
   */
  async translateText(
    text: string,
    params: any = {},
    language: string = "en"
  ): Promise<string> {
    try {
      // Generate MD5 hash of the original text
      const md5Key = this.generateMD5Key(text);

      // Check cache first
      const cacheKey = `${md5Key}:${language}`;
      if (this.isCacheValid(cacheKey)) {
        const cachedTranslation = this.cache.get(cacheKey);
        if (cachedTranslation) {
          return this.replaceParams(cachedTranslation, params);
        }
      }

      // Get translation from database
      const translation = await this.getTranslationFromDatabase(md5Key, language);

      // Cache the translation
      this.cache.set(cacheKey, translation);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL);

      return this.replaceParams(translation, params);
    } catch (error) {
      // Fallback to original text if translation not found
      return text;
    }
  }

  /**
   * TRANSLATE CONTENT OBJECTS (Customers, Carriers, Products, etc.)
   * This is the new content translation functionality
   */
  async translateContent(content: any, language: string = "en"): Promise<any> {
    if (!content) return content;

    // If it's a string, translate it as text
    if (typeof content === 'string') {
      return this.translateText(content, {}, language);
    }

    // If it's an object, translate its properties
    if (typeof content === 'object') {
      const translatedContent = { ...content };

      // Define translatable fields
      const translatableFields = [
        'name', 'title', 'description', 'firstName', 'lastName', 
        'label', 'value', 'metaTitle', 'metaDescription', 'company'
      ];

      // Translate each translatable field
      for (const field of translatableFields) {
        if (content[field] && typeof content[field] === 'string') {
          translatedContent[field] = await this.translateText(content[field], {}, language);
        }
      }

      // Handle nested objects
      for (const [key, value] of Object.entries(content)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          translatedContent[key] = await this.translateContent(value, language);
        }
      }

      return translatedContent;
    }

    return content;
  }

  /**
   * TRANSLATE ARRAY OF CONTENT
   */
  async translateContentArray(items: any[], language: string = "en"): Promise<any[]> {
    if (!Array.isArray(items)) return items;

    return Promise.all(
      items.map(item => this.translateContent(item, language))
    );
  }

  /**
   * SPECIFIC CONTENT TYPE TRANSLATIONS
   */
  async translateCustomer(customer: any, language: string = "en"): Promise<any> {
    if (!customer) return customer;

    return {
      ...customer,
      firstName: await this.translateText(customer.firstName, {}, language),
      lastName: await this.translateText(customer.lastName, {}, language),
      company: customer.company ? await this.translateText(customer.company, {}, language) : customer.company,
    };
  }

  async translateCarrier(carrier: any, language: string = "en"): Promise<any> {
    if (!carrier) return carrier;

    return {
      ...carrier,
      name: await this.translateText(carrier.name, {}, language),
      description: carrier.description ? await this.translateText(carrier.description, {}, language) : carrier.description,
    };
  }

  async translateProduct(product: any, language: string = "en"): Promise<any> {
    if (!product) return product;

    return {
      ...product,
      name: await this.translateText(product.name, {}, language),
      description: product.description ? await this.translateText(product.description, {}, language) : product.description,
      metaTitle: product.metaTitle ? await this.translateText(product.metaTitle, {}, language) : product.metaTitle,
      metaDescription: product.metaDescription ? await this.translateText(product.metaDescription, {}, language) : product.metaDescription,
    };
  }

  /**
   * ADD TRANSLATION (UNIFIED)
   * Handles both UI and content translations
   */
  async addTranslation(
    originalText: string,
    languageCode: string,
    translatedText: string,
    isApproved: boolean = false
  ): Promise<LanguageValue> {
    const md5Key = this.generateMD5Key(originalText);

    const translation = this.languageValueRepository.create({
      key: md5Key,
      languageCode,
      original: originalText,
      destination: translatedText,
      isApproved,
    });

    return this.languageValueRepository.save(translation);
  }

  /**
   * ADD BULK TRANSLATIONS
   */
  async addBulkTranslations(
    translations: Array<{
      originalText: string;
      translatedText: string;
      languageCode: string;
    }>
  ): Promise<LanguageValue[]> {
    const translationEntities = translations.map(({ originalText, translatedText, languageCode }) => {
      const md5Key = this.generateMD5Key(originalText);
      return this.languageValueRepository.create({
        key: md5Key,
        languageCode,
        original: originalText,
        destination: translatedText,
        isApproved: true,
      });
    });

    return this.languageValueRepository.save(translationEntities);
  }

  /**
   * GET TRANSLATIONS BY LANGUAGE
   */
  async getTranslationsByLanguage(languageCode: string): Promise<LanguageValue[]> {
    return this.languageValueRepository.find({
      where: { languageCode, isApproved: true },
      order: { createdAt: "DESC" },
    });
  }

  /**
   * GET PENDING TRANSLATIONS
   */
  async getPendingTranslations(): Promise<LanguageValue[]> {
    return this.languageValueRepository.find({
      where: { isApproved: false },
      order: { createdAt: "DESC" },
    });
  }

  /**
   * GET LANGUAGES
   */
  async getLanguages(): Promise<Language[]> {
    return this.languageRepository.find({
      where: { isActive: true },
      order: { name: "ASC" },
    });
  }

  /**
   * CLEAR CACHE
   */
  async clearCache(language?: string): Promise<void> {
    if (language) {
      // Clear cache for specific language
      for (const [key] of this.cache) {
        if (key.endsWith(`:${language}`)) {
          this.cache.delete(key);
          this.cacheExpiry.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.cache.clear();
      this.cacheExpiry.clear();
    }
  }

  /**
   * PRELOAD TRANSLATIONS
   */
  async preloadTranslations(language: string): Promise<void> {
    const translations = await this.languageValueRepository.find({
      where: { languageCode: language, isApproved: true },
    });

    for (const translation of translations) {
      const cacheKey = `${translation.key}:${language}`;
      this.cache.set(cacheKey, translation.destination);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL);
    }
  }

  /**
   * UPDATE TRANSLATION
   */
  async updateTranslation(
    md5Key: string,
    languageCode: string,
    translatedText: string
  ): Promise<LanguageValue> {
    const translation = await this.languageValueRepository.findOne({
      where: { key: md5Key, languageCode },
    });

    if (translation) {
      translation.destination = translatedText;
      return this.languageValueRepository.save(translation);
    }

    throw new Error("Translation not found");
  }

  /**
   * APPROVE TRANSLATION
   */
  async approveTranslation(
    md5Key: string,
    languageCode: string
  ): Promise<void> {
    await this.languageValueRepository.update(
      { key: md5Key, languageCode },
      { isApproved: true }
    );
  }

  // PRIVATE HELPER METHODS (same as your current implementation)
  private generateMD5Key(text: string): string {
    if (!text || typeof text !== "string") {
      throw new Error("Text must be a non-empty string");
    }
    return crypto
      .createHash("md5")
      .update(text.trim().toLowerCase())
      .digest("hex");
  }

  private async getTranslationFromDatabase(
    md5Key: string,
    language: string
  ): Promise<string> {
    const translation = await this.languageValueRepository.findOne({
      where: {
        key: md5Key,
        languageCode: language,
        isApproved: true,
      },
    });

    if (translation) {
      return translation.destination;
    }

    // Fallback to default language (en)
    if (language !== "en") {
      return this.getTranslationFromDatabase(md5Key, "en");
    }

    // Return original text if no translation found
    return this.getOriginalTextFromMD5(md5Key);
  }

  private async getOriginalTextFromMD5(md5Key: string): Promise<string> {
    const translation = await this.languageValueRepository.findOne({
      where: {
        key: md5Key,
        languageCode: "en",
      },
    });

    return translation ? translation.original : md5Key;
  }

  private replaceParams(translation: string, params: any): string {
    if (!params || Object.keys(params).length === 0) {
      return translation;
    }

    return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] || match;
    });
  }

  private isCacheValid(cacheKey: string): boolean {
    const expiry = this.cacheExpiry.get(cacheKey);
    return expiry ? Date.now() < expiry : false;
  }
}
```

### **2. Unified Translation Interceptor**

**File**: `nestjs-app-api/api/src/shared/translation/interceptors/unified-translation.interceptor.ts`

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnifiedTranslationService } from '../services/unified-translation.service';

@Injectable()
export class UnifiedTranslationInterceptor implements NestInterceptor {
  constructor(private unifiedTranslationService: UnifiedTranslationService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const languageCode = this.detectLanguage(request);
    
    return next.handle().pipe(
      map(async (data) => {
        if (this.shouldTranslate(data)) {
          return await this.translateResponseData(data, languageCode);
        }
        return data;
      })
    );
  }

  private detectLanguage(request: any): string {
    const acceptLanguage = request.headers['accept-language'];
    const xLanguage = request.headers['x-language'];
    
    if (xLanguage) return xLanguage;
    if (acceptLanguage) {
      const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
      return languages[0] || 'en';
    }
    return 'en';
  }

  private shouldTranslate(data: any): boolean {
    if (!data) return false;
    
    // Always translate if it's an array
    if (Array.isArray(data)) return true;
    
    // Check if it's a translatable object
    return this.isTranslatableItem(data);
  }

  private isTranslatableItem(item: any): boolean {
    if (!item || typeof item !== 'object') return false;
    
    // Check for common translatable fields
    const translatableFields = ['name', 'firstName', 'lastName', 'title', 'description'];
    return translatableFields.some(field => item[field] && typeof item[field] === 'string');
  }

  private async translateResponseData(data: any, languageCode: string): Promise<any> {
    if (Array.isArray(data)) {
      return this.unifiedTranslationService.translateContentArray(data, languageCode);
    }
    
    return this.unifiedTranslationService.translateContent(data, languageCode);
  }
}
```

### **3. Updated Translation Module**

**File**: `nestjs-app-api/api/src/shared/translation/translation.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { LanguageValue } from './entities/language-value.entity';
import { UnifiedTranslationService } from './services/unified-translation.service'; // REPLACE
import { LanguageDetectionService } from './services/language-detection.service';
import { LanguageController } from './controllers/language.controller';
import { UnifiedTranslationInterceptor } from './interceptors/unified-translation.interceptor'; // REPLACE

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, LanguageValue]),
  ],
  controllers: [
    LanguageController,
  ],
  providers: [
    UnifiedTranslationService, // REPLACE TranslationService
    LanguageDetectionService,
    UnifiedTranslationInterceptor, // REPLACE ContentTranslationInterceptor
  ],
  exports: [
    UnifiedTranslationService, // REPLACE TranslationService
    LanguageDetectionService,
    UnifiedTranslationInterceptor, // REPLACE ContentTranslationInterceptor
  ],
})
export class TranslationModule {}
```

## 🎨 Frontend Implementation

### **1. Unified Translation Hook**

**File**: `react-admin/src/features/translation/hooks/useUnifiedTranslation.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useTranslationContext } from '../../../shared/contexts/TranslationContext';
import { api } from '../../../shared/utils/api';

interface UnifiedTranslationHook {
  // UNIFIED TRANSLATION METHOD
  translate: (input: string | any) => string | any;
  
  // SPECIFIC METHODS
  translateText: (text: string) => string;
  translateContent: (content: any) => Promise<any>;
  translateContentArray: (contentArray: any[]) => Promise<any[]>;
  
  // SPECIFIC CONTENT TYPES
  translateCustomer: (customer: any) => Promise<any>;
  translateCarrier: (carrier: any) => Promise<any>;
  
  // ADMIN METHODS
  addTranslation: (originalText: string, translatedText: string, languageCode: string) => Promise<any>;
  addBulkTranslations: (translations: Array<{originalText: string, translatedText: string, languageCode: string}>) => Promise<any>;
  
  // STATE
  currentLanguage: string;
  availableLanguages: any[];
  changeLanguage: (language: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useUnifiedTranslation = (): UnifiedTranslationHook => {
  const context = useTranslationContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UNIFIED TRANSLATION METHOD
  const translate = useCallback((input: string | any): string | any => {
    // If input is a string, translate it as text
    if (typeof input === 'string') {
      return context.t(input);
    }

    // If input is an object, return it for async translation
    if (typeof input === 'object' && input !== null) {
      return input; // Will be handled by translateContent
    }

    return input;
  }, [context.t]);

  // TRANSLATE TEXT (UI Labels, Messages, etc.)
  const translateText = useCallback((text: string): string => {
    return context.t(text);
  }, [context.t]);

  // TRANSLATE CONTENT OBJECTS
  const translateContent = useCallback(async (content: any): Promise<any> => {
    if (!content) return content;

    // If it's a string, translate it as text
    if (typeof content === 'string') {
      return translateText(content);
    }

    // If it's an object, translate its properties
    if (typeof content === 'object') {
      const translatedContent = { ...content };

      // Define translatable fields
      const translatableFields = [
        'name', 'title', 'description', 'firstName', 'lastName', 
        'label', 'value', 'metaTitle', 'metaDescription', 'company'
      ];

      // Translate each translatable field
      for (const field of translatableFields) {
        if (content[field] && typeof content[field] === 'string') {
          translatedContent[field] = translateText(content[field]);
        }
      }

      // Handle nested objects
      for (const [key, value] of Object.entries(content)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          translatedContent[key] = await translateContent(value);
        }
      }

      return translatedContent;
    }

    return content;
  }, [translateText]);

  // TRANSLATE ARRAY OF CONTENT
  const translateContentArray = useCallback(async (contentArray: any[]): Promise<any[]> => {
    if (!Array.isArray(contentArray)) return contentArray;

    return Promise.all(contentArray.map(content => translateContent(content)));
  }, [translateContent]);

  // TRANSLATE CUSTOMER SPECIFICALLY
  const translateCustomer = useCallback(async (customer: any): Promise<any> => {
    if (!customer) return customer;

    return {
      ...customer,
      firstName: translateText(customer.firstName),
      lastName: translateText(customer.lastName),
      company: customer.company ? translateText(customer.company) : customer.company,
    };
  }, [translateText]);

  // TRANSLATE CARRIER SPECIFICALLY
  const translateCarrier = useCallback(async (carrier: any): Promise<any> => {
    if (!carrier) return carrier;

    return {
      ...carrier,
      name: translateText(carrier.name),
      description: carrier.description ? translateText(carrier.description) : carrier.description,
    };
  }, [translateText]);

  // ADD TRANSLATION
  const addTranslation = useCallback(async (
    originalText: string,
    translatedText: string,
    languageCode: string
  ): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/v1/admin/translations/add', {
        originalText,
        translatedText,
        languageCode,
      });
      return response.data;
    } catch (err) {
      setError('Failed to add translation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ADD BULK TRANSLATIONS
  const addBulkTranslations = useCallback(async (
    translations: Array<{
      originalText: string;
      translatedText: string;
      languageCode: string;
    }>
  ): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/v1/admin/translations/bulk', {
        translations,
      });
      return response.data;
    } catch (err) {
      setError('Failed to add bulk translations');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    translate,
    translateText,
    translateContent,
    translateContentArray,
    translateCustomer,
    translateCarrier,
    addTranslation,
    addBulkTranslations,
    currentLanguage: context.currentLanguage,
    availableLanguages: context.getAvailableLanguages(),
    changeLanguage: context.changeLanguage,
    isLoading,
    error,
  };
};
```

### **2. Updated Components**

**File**: `react-admin/src/features/customers/components/Customers.tsx`

```typescript
// REPLACE the existing useTranslation import
import { useUnifiedTranslation } from '../../translation/hooks/useUnifiedTranslation';

// REPLACE the existing useTranslation usage
const { translateText, translateContentArray } = useUnifiedTranslation();

// The rest of your component remains the same
// translateText() works exactly like your current t() function
// translateContentArray() handles content translation

// Example usage:
<label>{translateText('First Name')}</label> {/* UI Translation */}
<input value={translatedCustomer?.firstName} /> {/* Content Translation */}
```

## 🔄 Migration Steps

### **Step 1: Create Unified Service (1 day)**
1. Create `UnifiedTranslationService`
2. Test with existing UI translations
3. Verify all current functionality works

### **Step 2: Update Module (30 minutes)**
1. Replace `TranslationService` with `UnifiedTranslationService`
2. Update imports in existing code
3. Test compilation

### **Step 3: Update Frontend Hook (1 day)**
1. Create `useUnifiedTranslation` hook
2. Update components to use new hook
3. Test both UI and content translation

### **Step 4: Update Controllers (30 minutes)**
1. Add `UnifiedTranslationInterceptor` to controllers
2. Test automatic content translation
3. Verify API responses

### **Step 5: Testing (1 day)**
1. Test all existing UI translations
2. Test new content translations
3. Test admin interface
4. Verify end-to-end functionality

## 🎯 Benefits of Unified Approach

### **✅ Single Service**
- **One service** handles both UI and content translation
- **Consistent API** for all translation needs
- **Easier maintenance** and testing

### **✅ Backward Compatible**
- **Same methods** for UI translation
- **Existing code** continues to work
- **Gradual migration** possible

### **✅ Enhanced Functionality**
- **Automatic content translation** via interceptor
- **Unified admin interface** for all translations
- **Better performance** with single service

### **✅ Developer Experience**
- **Single hook** for all translation needs
- **Consistent patterns** across the application
- **Easier to understand** and use

## 📊 Usage Examples

### **Backend Usage**
```typescript
// Inject UnifiedTranslationService
constructor(private translationService: UnifiedTranslationService) {}

// UI Translation (same as before)
const message = await this.translationService.translateText('User created successfully', {}, 'fr');

// Content Translation (new)
const translatedCustomer = await this.translationService.translateCustomer(customer, 'fr');

// Unified Translation (new)
const result = await this.translationService.translate('First Name', {}, 'fr'); // Text
const result2 = await this.translationService.translate(customer, {}, 'fr'); // Content
```

### **Frontend Usage**
```typescript
// Use unified translation hook
const { translate, translateText, translateContent } = useUnifiedTranslation();

// UI Translation (same as before)
translateText('First Name') // → 'Prénom'

// Content Translation (new)
translateContent({ firstName: 'John', lastName: 'Doe' })
// → { firstName: 'Jean', lastName: 'Dupont' }

// Unified Translation (new)
translate('First Name') // → 'Prénom' (text)
translate(customer) // → translated customer (content)
```

---

**This unified approach gives you a single, powerful translation service that handles both UI and content translation seamlessly!** 🔄✨

