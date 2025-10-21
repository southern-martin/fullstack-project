# 🏗️ Content Translation Service Architecture

## 📋 Overview

Create a **dedicated Content Translation Service** that works alongside your existing `TranslationService`. This approach is cleaner, more maintainable, and follows separation of concerns.

## 🎯 Architecture Design

### **Current System**
```
TranslationService (UI Translation)
├── translate() - UI text translation
├── addTranslation() - Add UI translations
└── getTranslationsByLanguage() - Get UI translations
```

### **Enhanced System**
```
TranslationService (UI Translation) - UNCHANGED
├── translate() - UI text translation
├── addTranslation() - Add UI translations
└── getTranslationsByLanguage() - Get UI translations

ContentTranslationService (Content Translation) - NEW
├── translateContent() - Generic content translation
├── translateProduct() - Product content translation
├── translateCustomer() - Customer content translation
├── translateCarrier() - Carrier content translation
├── addContentTranslation() - Add content translations
└── getContentTranslations() - Get content translations
```

## 🚀 Implementation

### **1. Content Translation Service**

**File**: `nestjs-app-api/api/src/shared/translation/services/content-translation.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguageValue } from '../entities/language-value.entity';
import { TranslationService } from './translation.service';
import * as crypto from 'crypto';

@Injectable()
export class ContentTranslationService {
  constructor(
    @InjectRepository(LanguageValue)
    private readonly languageValueRepository: Repository<LanguageValue>,
    private readonly translationService: TranslationService, // Use existing service
  ) {}

  /**
   * Generic content translation using existing TranslationService
   */
  async translateContent(text: string, language: string = 'en'): Promise<string> {
    return this.translationService.translate(text, {}, language);
  }

  /**
   * Translate product content
   */
  async translateProduct(product: any, language: string = 'en'): Promise<any> {
    if (!product) return product;

    return {
      ...product,
      name: await this.translateContent(product.name, language),
      description: product.description ? await this.translateContent(product.description, language) : product.description,
      metaTitle: product.metaTitle ? await this.translateContent(product.metaTitle, language) : product.metaTitle,
      metaDescription: product.metaDescription ? await this.translateContent(product.metaDescription, language) : product.metaDescription,
    };
  }

  /**
   * Translate customer content
   */
  async translateCustomer(customer: any, language: string = 'en'): Promise<any> {
    if (!customer) return customer;

    return {
      ...customer,
      firstName: await this.translateContent(customer.firstName, language),
      lastName: await this.translateContent(customer.lastName, language),
    };
  }

  /**
   * Translate carrier content
   */
  async translateCarrier(carrier: any, language: string = 'en'): Promise<any> {
    if (!carrier) return carrier;

    return {
      ...carrier,
      name: await this.translateContent(carrier.name, language),
    };
  }

  /**
   * Translate array of content items
   */
  async translateContentArray(items: any[], language: string = 'en'): Promise<any[]> {
    if (!Array.isArray(items)) return items;

    return Promise.all(
      items.map(async (item) => {
        // Detect content type and translate accordingly
        if (item.name && item.sku) {
          return this.translateProduct(item, language);
        }
        if (item.firstName && item.lastName && item.email) {
          return this.translateCustomer(item, language);
        }
        if (item.name && item.code) {
          return this.translateCarrier(item, language);
        }
        return item;
      })
    );
  }

  /**
   * Add content translation using existing TranslationService
   */
  async addContentTranslation(
    originalText: string,
    translatedText: string,
    languageCode: string
  ): Promise<LanguageValue> {
    return this.translationService.addTranslation(originalText, languageCode, translatedText, true);
  }

  /**
   * Add bulk content translations
   */
  async addBulkContentTranslations(
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
   * Get content translations for a specific language
   */
  async getContentTranslations(languageCode: string): Promise<LanguageValue[]> {
    return this.translationService.getTranslationsByLanguage(languageCode);
  }

  /**
   * Get pending content translations
   */
  async getPendingContentTranslations(): Promise<LanguageValue[]> {
    return this.translationService.getPendingTranslations();
  }

  /**
   * Clear content translation cache
   */
  async clearContentCache(language?: string): Promise<void> {
    return this.translationService.clearCache(language);
  }

  /**
   * Preload content translations
   */
  async preloadContentTranslations(language: string): Promise<void> {
    return this.translationService.preloadTranslations(language);
  }

  /**
   * Generate MD5 key (reuse existing logic)
   */
  private generateMD5Key(text: string): string {
    if (!text || typeof text !== 'string') {
      throw new Error('Text must be a non-empty string');
    }
    return crypto
      .createHash('md5')
      .update(text.trim().toLowerCase())
      .digest('hex');
  }
}
```

### **2. Content Translation Interceptor**

**File**: `nestjs-app-api/api/src/shared/translation/interceptors/content-translation.interceptor.ts`

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentTranslationService } from '../services/content-translation.service';

@Injectable()
export class ContentTranslationInterceptor implements NestInterceptor {
  constructor(private contentTranslationService: ContentTranslationService) {}

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
    
    if (Array.isArray(data)) {
      return data.some(item => this.isTranslatableItem(item));
    }
    
    return this.isTranslatableItem(data);
  }

  private isTranslatableItem(item: any): boolean {
    if (!item || typeof item !== 'object') return false;
    
    // Check for product content
    if (item.name && item.sku) return true;
    
    // Check for customer content
    if (item.firstName && item.lastName && item.email) return true;
    
    // Check for carrier content
    if (item.name && item.code) return true;
    
    return false;
  }

  private async translateResponseData(data: any, languageCode: string): Promise<any> {
    if (Array.isArray(data)) {
      return this.contentTranslationService.translateContentArray(data, languageCode);
    }
    
    return this.translateItem(data, languageCode);
  }

  private async translateItem(item: any, languageCode: string): Promise<any> {
    // Use ContentTranslationService methods
    if (item.name && item.sku) {
      return this.contentTranslationService.translateProduct(item, languageCode);
    }
    
    if (item.firstName && item.lastName && item.email) {
      return this.contentTranslationService.translateCustomer(item, languageCode);
    }
    
    if (item.name && item.code) {
      return this.contentTranslationService.translateCarrier(item, languageCode);
    }
    
    return item;
  }
}
```

### **3. Content Translation Controller**

**File**: `nestjs-app-api/api/src/shared/translation/controllers/content-translation.controller.ts`

```typescript
import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ContentTranslationService } from '../services/content-translation.service';

@Controller('admin/translations/content')
export class ContentTranslationController {
  constructor(private contentTranslationService: ContentTranslationService) {}

  // Add single content translation
  @Post('add')
  async addTranslation(@Body() body: {
    originalText: string;
    translatedText: string;
    languageCode: string;
  }) {
    return this.contentTranslationService.addContentTranslation(
      body.originalText,
      body.translatedText,
      body.languageCode
    );
  }

  // Add bulk content translations
  @Post('bulk')
  async addBulkTranslations(@Body() body: {
    translations: Array<{
      originalText: string;
      translatedText: string;
      languageCode: string;
    }>;
  }) {
    return this.contentTranslationService.addBulkContentTranslations(body.translations);
  }

  // Get content translations for a language
  @Get('language/:languageCode')
  async getContentTranslations(@Param('languageCode') languageCode: string) {
    return this.contentTranslationService.getContentTranslations(languageCode);
  }

  // Get pending content translations
  @Get('pending')
  async getPendingTranslations() {
    return this.contentTranslationService.getPendingContentTranslations();
  }

  // Translate specific content
  @Post('translate')
  async translateContent(@Body() body: {
    content: any;
    languageCode: string;
  }) {
    const { content, languageCode } = body;
    
    // Detect content type and translate
    if (content.name && content.sku) {
      return this.contentTranslationService.translateProduct(content, languageCode);
    }
    if (content.firstName && content.lastName && content.email) {
      return this.contentTranslationService.translateCustomer(content, languageCode);
    }
    if (content.name && content.code) {
      return this.contentTranslationService.translateCarrier(content, languageCode);
    }
    
    return content;
  }

  // Clear content translation cache
  @Post('cache/clear')
  async clearCache(@Body() body: { language?: string }) {
    await this.contentTranslationService.clearContentCache(body.language);
    return { message: 'Cache cleared successfully' };
  }

  // Preload content translations
  @Post('cache/preload')
  async preloadCache(@Body() body: { language: string }) {
    await this.contentTranslationService.preloadContentTranslations(body.language);
    return { message: 'Cache preloaded successfully' };
  }
}
```

### **4. Updated Translation Module**

**File**: `nestjs-app-api/api/src/shared/translation/translation.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { LanguageValue } from './entities/language-value.entity';
import { TranslationService } from './services/translation.service';
import { ContentTranslationService } from './services/content-translation.service'; // NEW
import { LanguageDetectionService } from './services/language-detection.service';
import { LanguageController } from './controllers/language.controller';
import { ContentTranslationController } from './controllers/content-translation.controller'; // NEW
import { ContentTranslationInterceptor } from './interceptors/content-translation.interceptor'; // NEW

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, LanguageValue]),
  ],
  controllers: [
    LanguageController,
    ContentTranslationController, // NEW
  ],
  providers: [
    TranslationService,
    ContentTranslationService, // NEW
    LanguageDetectionService,
    ContentTranslationInterceptor, // NEW
  ],
  exports: [
    TranslationService,
    ContentTranslationService, // NEW
    LanguageDetectionService,
    ContentTranslationInterceptor, // NEW
  ],
})
export class TranslationModule {}
```

## 🎨 Frontend Implementation

### **1. Content Translation Hook**

**File**: `react-admin/src/features/translation/hooks/useContentTranslation.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from './useTranslation';
import { api } from '../../../shared/utils/api';

interface ContentTranslationHook {
  translateContent: (content: any) => Promise<any>;
  translateContentArray: (contentArray: any[]) => Promise<any[]>;
  addContentTranslation: (originalText: string, translatedText: string, languageCode: string) => Promise<any>;
  addBulkContentTranslations: (translations: Array<{originalText: string, translatedText: string, languageCode: string}>) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export const useContentTranslation = (): ContentTranslationHook => {
  const { t, currentLanguage } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Translate single content object
  const translateContent = useCallback(async (content: any): Promise<any> => {
    if (!content) return content;

    // If it's a string, use existing UI translation
    if (typeof content === 'string') {
      return t(content);
    }

    // If it's an object, translate its properties
    if (typeof content === 'object') {
      const translatedContent = { ...content };

      // Translate product content
      if (content.name && content.sku) {
        translatedContent.name = t(content.name);
        if (content.description) {
          translatedContent.description = t(content.description);
        }
        if (content.metaTitle) {
          translatedContent.metaTitle = t(content.metaTitle);
        }
        if (content.metaDescription) {
          translatedContent.metaDescription = t(content.metaDescription);
        }
      }

      // Translate customer content
      if (content.firstName && content.lastName && content.email) {
        translatedContent.firstName = t(content.firstName);
        translatedContent.lastName = t(content.lastName);
      }

      // Translate carrier content
      if (content.name && content.code) {
        translatedContent.name = t(content.name);
      }

      return translatedContent;
    }

    return content;
  }, [t]);

  // Translate array of content objects
  const translateContentArray = useCallback(async (contentArray: any[]): Promise<any[]> => {
    if (!Array.isArray(contentArray)) return contentArray;

    return Promise.all(contentArray.map(content => translateContent(content)));
  }, [translateContent]);

  // Add single content translation
  const addContentTranslation = useCallback(async (
    originalText: string,
    translatedText: string,
    languageCode: string
  ): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/v1/admin/translations/content/add', {
        originalText,
        translatedText,
        languageCode,
      });
      return response.data;
    } catch (err) {
      setError('Failed to add content translation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add bulk content translations
  const addBulkContentTranslations = useCallback(async (
    translations: Array<{
      originalText: string;
      translatedText: string;
      languageCode: string;
    }>
  ): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/v1/admin/translations/content/bulk', {
        translations,
      });
      return response.data;
    } catch (err) {
      setError('Failed to add bulk content translations');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    translateContent,
    translateContentArray,
    addContentTranslation,
    addBulkContentTranslations,
    isLoading,
    error,
  };
};
```

### **2. Updated Components**

**File**: `react-admin/src/features/customers/components/Customers.tsx`

```typescript
// Add this import
import { useContentTranslation } from '../../translation/hooks/useContentTranslation';

// In your Customers component, add this after existing hooks
const { translateContentArray } = useContentTranslation();

// Add this state for translated customers
const [translatedCustomers, setTranslatedCustomers] = useState<Customer[]>([]);

// Add this useEffect to translate customers when they load
useEffect(() => {
  const translateCustomers = async () => {
    if (customers.length > 0) {
      try {
        const translated = await translateContentArray(customers);
        setTranslatedCustomers(translated);
      } catch (error) {
        console.error('Failed to translate customers:', error);
        setTranslatedCustomers(customers);
      }
    }
  };

  translateCustomers();
}, [customers, translateContentArray]);

// Update your table to use translatedCustomers instead of customers
// In your table config, change:
// data: customers
// to:
// data: translatedCustomers
```

## 🎯 Benefits of This Architecture

### **✅ Separation of Concerns**
- **TranslationService**: Handles UI text translation
- **ContentTranslationService**: Handles content translation
- **Clear responsibilities** for each service

### **✅ Reusability**
- **ContentTranslationService** can be used independently
- **Easy to extend** for new content types
- **Modular design** for better maintainability

### **✅ No Breaking Changes**
- **TranslationService** remains unchanged
- **Existing UI translation** continues to work
- **Backward compatible** with current system

### **✅ Better Testing**
- **Independent services** are easier to test
- **Mock dependencies** more easily
- **Unit tests** for each service separately

### **✅ Scalability**
- **Add new content types** without modifying existing services
- **Plugin architecture** for different translation strategies
- **Easy to extend** for future requirements

## 🚀 Implementation Steps

### **Step 1: Create Content Translation Service (1 day)**
1. Create `ContentTranslationService`
2. Add to `TranslationModule`
3. Test with existing data

### **Step 2: Create Interceptor and Controller (1 day)**
1. Create `ContentTranslationInterceptor`
2. Create `ContentTranslationController`
3. Update module exports

### **Step 3: Frontend Integration (1 day)**
1. Create `useContentTranslation` hook
2. Update components to use new hook
3. Test content translation

### **Step 4: Admin Interface (1 day)**
1. Create content translation management UI
2. Test adding and managing translations
3. Verify end-to-end functionality

## 📊 Usage Examples

### **Backend Usage**
```typescript
// Inject ContentTranslationService
constructor(private contentTranslationService: ContentTranslationService) {}

// Translate customer
const translatedCustomer = await this.contentTranslationService.translateCustomer(customer, 'fr');

// Translate array of customers
const translatedCustomers = await this.contentTranslationService.translateContentArray(customers, 'fr');
```

### **Frontend Usage**
```typescript
// Use content translation hook
const { translateContent, translateContentArray } = useContentTranslation();

// Translate single customer
const translatedCustomer = await translateContent(customer);

// Translate array of customers
const translatedCustomers = await translateContentArray(customers);
```

---

**This architecture provides a clean, maintainable, and scalable solution for content translation!** 🏗️✨

