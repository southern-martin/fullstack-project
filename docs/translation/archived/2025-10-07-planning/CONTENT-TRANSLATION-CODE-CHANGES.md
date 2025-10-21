# 🔧 Content Translation - Exact Code Changes

## 📋 Overview

This document shows the **exact code changes** needed to add content translation to your existing system using the same MD5 approach and table structure.

## 🚀 Backend Changes

### **1. Enhanced TranslationService**

**File**: `nestjs-app-api/api/src/shared/translation/services/translation.service.ts`

**Add these methods to your existing TranslationService class:**

```typescript
// Add these new methods to your existing TranslationService class

/**
 * Translate content (same logic as existing translate method)
 */
async translateContent(text: string, language: string = "en"): Promise<string> {
  return this.translate(text, {}, language);
}

/**
 * Translate product content
 */
async translateProduct(product: any, language: string = "en"): Promise<any> {
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
 * Translate category content
 */
async translateCategory(category: any, language: string = "en"): Promise<any> {
  if (!category) return category;

  return {
    ...category,
    name: await this.translateContent(category.name, language),
    description: category.description ? await this.translateContent(category.description, language) : category.description,
  };
}

/**
 * Translate customer content
 */
async translateCustomer(customer: any, language: string = "en"): Promise<any> {
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
async translateCarrier(carrier: any, language: string = "en"): Promise<any> {
  if (!carrier) return carrier;

  return {
    ...carrier,
    name: await this.translateContent(carrier.name, language),
  };
}

/**
 * Translate array of content items
 */
async translateContentArray(items: any[], language: string = "en"): Promise<any[]> {
  if (!Array.isArray(items)) return items;

  return Promise.all(
    items.map(async (item) => {
      // Detect content type and translate accordingly
      if (item.name && item.sku) {
        return this.translateProduct(item, language);
      }
      if (item.name && item.slug) {
        return this.translateCategory(item, language);
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
 * Add content translation (reuse existing addTranslation method)
 */
async addContentTranslation(
  originalText: string,
  translatedText: string,
  languageCode: string
): Promise<LanguageValue> {
  return this.addTranslation(originalText, languageCode, translatedText, true);
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
```

### **2. Content Translation Interceptor**

**File**: `nestjs-app-api/api/src/shared/translation/interceptors/content-translation.interceptor.ts`

**Create this new file:**

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationService } from '../services/translation.service';

@Injectable()
export class ContentTranslationInterceptor implements NestInterceptor {
  constructor(private translationService: TranslationService) {}

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
    // Use existing language detection logic
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
    
    // Check if data contains translatable content
    if (Array.isArray(data)) {
      return data.some(item => this.isTranslatableItem(item));
    }
    
    return this.isTranslatableItem(data);
  }

  private isTranslatableItem(item: any): boolean {
    if (!item || typeof item !== 'object') return false;
    
    // Check for product content (if you have products)
    if (item.name && item.sku) return true;
    
    // Check for category content (if you have categories)
    if (item.name && item.slug) return true;
    
    // Check for customer content
    if (item.firstName && item.lastName && item.email) return true;
    
    // Check for carrier content
    if (item.name && item.code) return true;
    
    return false;
  }

  private async translateResponseData(data: any, languageCode: string): Promise<any> {
    if (Array.isArray(data)) {
      return this.translationService.translateContentArray(data, languageCode);
    }
    
    return this.translateItem(data, languageCode);
  }

  private async translateItem(item: any, languageCode: string): Promise<any> {
    // Translate products (if you have products)
    if (item.name && item.sku) {
      return this.translationService.translateProduct(item, languageCode);
    }
    
    // Translate categories (if you have categories)
    if (item.name && item.slug) {
      return this.translationService.translateCategory(item, languageCode);
    }
    
    // Translate customers
    if (item.firstName && item.lastName && item.email) {
      return this.translationService.translateCustomer(item, languageCode);
    }
    
    // Translate carriers
    if (item.name && item.code) {
      return this.translationService.translateCarrier(item, languageCode);
    }
    
    return item;
  }
}
```

### **3. Content Translation Controller**

**File**: `nestjs-app-api/api/src/shared/translation/controllers/content-translation.controller.ts`

**Create this new file:**

```typescript
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TranslationService } from '../services/translation.service';

@Controller('admin/translations/content')
export class ContentTranslationController {
  constructor(private translationService: TranslationService) {}

  // Add single content translation
  @Post('add')
  async addTranslation(@Body() body: {
    originalText: string;
    translatedText: string;
    languageCode: string;
  }) {
    return this.translationService.addContentTranslation(
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
    return this.translationService.addBulkContentTranslations(body.translations);
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
      return this.translationService.translateProduct(content, languageCode);
    }
    if (content.name && content.slug) {
      return this.translationService.translateCategory(content, languageCode);
    }
    if (content.firstName && content.lastName && content.email) {
      return this.translationService.translateCustomer(content, languageCode);
    }
    if (content.name && content.code) {
      return this.translationService.translateCarrier(content, languageCode);
    }
    
    return content;
  }
}
```

### **4. Update Translation Module**

**File**: `nestjs-app-api/api/src/shared/translation/translation.module.ts`

**Add the new controller and interceptor to your existing module:**

```typescript
// Add these imports to your existing imports
import { ContentTranslationController } from './controllers/content-translation.controller';
import { ContentTranslationInterceptor } from './interceptors/content-translation.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, LanguageValue]),
  ],
  controllers: [
    LanguageController,
    ContentTranslationController, // Add this line
  ],
  providers: [
    TranslationService,
    LanguageDetectionService,
    ContentTranslationInterceptor, // Add this line
  ],
  exports: [
    TranslationService,
    LanguageDetectionService,
    ContentTranslationInterceptor, // Add this line
  ],
})
export class TranslationModule {}
```

### **5. Update Existing Controllers (Optional)**

**File**: `nestjs-app-api/api/src/modules/customer/api/customer.controller.ts`

**Add the interceptor to automatically translate responses:**

```typescript
// Add this import
import { UseInterceptors } from '@nestjs/common';
import { ContentTranslationInterceptor } from '../../../shared/translation/interceptors/content-translation.interceptor';

// Add this decorator to your controller class
@Controller('customers')
@UseInterceptors(ContentTranslationInterceptor) // Add this line
export class CustomerController {
  // ... your existing code
}
```

**File**: `nestjs-app-api/api/src/modules/carrier/api/carrier.controller.ts`

```typescript
// Add this import
import { UseInterceptors } from '@nestjs/common';
import { ContentTranslationInterceptor } from '../../../shared/translation/interceptors/content-translation.interceptor';

// Add this decorator to your controller class
@Controller('carriers')
@UseInterceptors(ContentTranslationInterceptor) // Add this line
export class CarrierController {
  // ... your existing code
}
```

## 🎨 Frontend Changes

### **1. Enhanced Translation Hook**

**File**: `react-admin/src/features/translation/hooks/useTranslation.ts`

**Add content translation function to your existing hook:**

```typescript
import { useTranslationContext } from '../../../shared/contexts/TranslationContext';

/**
 * Custom hook for easy translation access
 * Provides a simple t() function and language management
 */
export const useTranslation = () => {
  const context = useTranslationContext();

  // Add this new function
  const translateContent = useCallback(async (content: any): Promise<any> => {
    if (!content) return content;

    // If it's a string, use existing UI translation
    if (typeof content === 'string') {
      return context.t(content);
    }

    // If it's an object, translate its properties
    if (typeof content === 'object') {
      const translatedContent = { ...content };

      // Translate product content (if you have products)
      if (content.name && content.sku) {
        translatedContent.name = context.t(content.name);
        if (content.description) {
          translatedContent.description = context.t(content.description);
        }
        if (content.metaTitle) {
          translatedContent.metaTitle = context.t(content.metaTitle);
        }
        if (content.metaDescription) {
          translatedContent.metaDescription = context.t(content.metaDescription);
        }
      }

      // Translate category content (if you have categories)
      if (content.name && content.slug) {
        translatedContent.name = context.t(content.name);
        if (content.description) {
          translatedContent.description = context.t(content.description);
        }
      }

      // Translate customer content
      if (content.firstName && content.lastName && content.email) {
        translatedContent.firstName = context.t(content.firstName);
        translatedContent.lastName = context.t(content.lastName);
      }

      // Translate carrier content
      if (content.name && content.code) {
        translatedContent.name = context.t(content.name);
      }

      return translatedContent;
    }

    return content;
  }, [context.t]);

  return {
    /**
     * Translate a text key
     * @param key - The text to translate
     * @returns Translated text or original text if translation not found
     */
    t: context.t,

    /**
     * Translate content objects (NEW)
     * @param content - Content object to translate
     * @returns Translated content object
     */
    translateContent, // Add this line

    /**
     * Current language code
     */
    currentLanguage: context.currentLanguage,

    /**
     * Available languages
     */
    availableLanguages: context.getAvailableLanguages(),

    /**
     * Change language
     * @param languageCode - Language code to switch to
     */
    changeLanguage: context.changeLanguage,

    /**
     * Refresh translations for current language
     */
    refreshTranslations: context.refreshTranslations,

    /**
     * Loading state
     */
    isLoading: context.isLoading,

    /**
     * Error state
     */
    error: context.error,
  };
};
```

### **2. Update Customer Component with Content Translation**

**File**: `react-admin/src/features/customers/components/Customers.tsx`

**Add content translation to your existing Customers component:**

```typescript
// Add this import at the top
import { useTranslation } from '../../translation/hooks/useTranslation';

// In your Customers component, add this after the existing useTranslation
const { t, translateContent } = useTranslation();

// Add this state for translated customers
const [translatedCustomers, setTranslatedCustomers] = useState<Customer[]>([]);

// Add this useEffect to translate customers when they load
useEffect(() => {
  const translateCustomers = async () => {
    if (customers.length > 0) {
      try {
        const translated = await Promise.all(
          customers.map(customer => translateContent(customer))
        );
        setTranslatedCustomers(translated);
      } catch (error) {
        console.error('Failed to translate customers:', error);
        setTranslatedCustomers(customers);
      }
    }
  };

  translateCustomers();
}, [customers, translateContent]);

// Update your table to use translatedCustomers instead of customers
// In your table config, change:
// data: customers
// to:
// data: translatedCustomers
```

### **3. Update Carrier Component with Content Translation**

**File**: `react-admin/src/features/carriers/components/Carriers.tsx`

**Add similar changes to your Carriers component:**

```typescript
// Add this import at the top
import { useTranslation } from '../../translation/hooks/useTranslation';

// In your Carriers component, add this after the existing useTranslation
const { t, translateContent } = useTranslation();

// Add this state for translated carriers
const [translatedCarriers, setTranslatedCarriers] = useState<Carrier[]>([]);

// Add this useEffect to translate carriers when they load
useEffect(() => {
  const translateCarriers = async () => {
    if (carriers.length > 0) {
      try {
        const translated = await Promise.all(
          carriers.map(carrier => translateContent(carrier))
        );
        setTranslatedCarriers(translated);
      } catch (error) {
        console.error('Failed to translate carriers:', error);
        setTranslatedCarriers(carriers);
      }
    }
  };

  translateCarriers();
}, [carriers, translateContent]);

// Update your table to use translatedCarriers instead of carriers
// In your table config, change:
// data: carriers
// to:
// data: translatedCarriers
```

### **4. Content Translation Admin Interface**

**File**: `react-admin/src/features/admin/components/ContentTranslationManager.tsx`

**Create this new component:**

```typescript
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../translation/hooks/useTranslation';
import { api } from '../../../shared/utils/api';

interface TranslationFormData {
  originalText: string;
  translatedText: string;
  languageCode: string;
}

export const ContentTranslationManager: React.FC = () => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<any[]>([]);
  const [carriers, setCarriers] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [translationForm, setTranslationForm] = useState<TranslationFormData>({
    originalText: '',
    translatedText: '',
    languageCode: 'fr',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersResponse, carriersResponse] = await Promise.all([
          api.get('/api/v1/customers'),
          api.get('/api/v1/carriers')
        ]);
        setCustomers(customersResponse.data);
        setCarriers(carriersResponse.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  const handleItemSelect = (item: any, type: 'customer' | 'carrier') => {
    setSelectedItem({ ...item, type });
    setTranslationForm({
      originalText: type === 'customer' ? `${item.firstName} ${item.lastName}` : item.name,
      translatedText: '',
      languageCode: 'fr',
    });
  };

  const handleAddTranslation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/api/v1/admin/translations/content/add', {
        originalText: translationForm.originalText,
        translatedText: translationForm.translatedText,
        languageCode: translationForm.languageCode,
      });

      alert('Translation added successfully!');
      setTranslationForm({
        originalText: '',
        translatedText: '',
        languageCode: 'fr',
      });
    } catch (error) {
      console.error('Failed to add translation:', error);
      alert('Failed to add translation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-translation-manager p-6">
      <h2 className="text-2xl font-bold mb-6">{t('Content Translation Manager')}</h2>

      {/* Customer Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('Select Customer')}
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={(e) => {
            const customer = customers.find(c => c.id === parseInt(e.target.value));
            if (customer) handleItemSelect(customer, 'customer');
          }}
        >
          <option value="">{t('Choose a customer...')}</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Carrier Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('Select Carrier')}
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={(e) => {
            const carrier = carriers.find(c => c.id === parseInt(e.target.value));
            if (carrier) handleItemSelect(carrier, 'carrier');
          }}
        >
          <option value="">{t('Choose a carrier...')}</option>
          {carriers.map(carrier => (
            <option key={carrier.id} value={carrier.id}>
              {carrier.name}
            </option>
          ))}
        </select>
      </div>

      {/* Translation Form */}
      {selectedItem && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {t('Translate')}: {selectedItem.type === 'customer' ? `${selectedItem.firstName} ${selectedItem.lastName}` : selectedItem.name}
          </h3>

          <form onSubmit={handleAddTranslation} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Original Text')}
              </label>
              <input
                type="text"
                value={translationForm.originalText}
                onChange={(e) => setTranslationForm({
                  ...translationForm,
                  originalText: e.target.value,
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Translated Text')}
              </label>
              <input
                type="text"
                value={translationForm.translatedText}
                onChange={(e) => setTranslationForm({
                  ...translationForm,
                  translatedText: e.target.value,
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={t('Enter translation...')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Language')}
              </label>
              <select
                value={translationForm.languageCode}
                onChange={(e) => setTranslationForm({
                  ...translationForm,
                  languageCode: e.target.value,
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? t('Adding...') : t('Add Translation')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
```

## 📊 Database Examples

### **Sample Content Translations**

```sql
-- Add these content translations to your existing language_values table

-- Customer name translations
INSERT INTO language_values (language_code, key, original, destination, is_approved) VALUES
('fr', MD5('John Doe'), 'John Doe', 'Jean Dupont', true),
('fr', MD5('Jane Smith'), 'Jane Smith', 'Jeanne Martin', true),
('fr', MD5('Bob Johnson'), 'Bob Johnson', 'Robert Johnson', true);

-- Carrier name translations
INSERT INTO language_values (language_code, key, original, destination, is_approved) VALUES
('fr', MD5('FedEx'), 'FedEx', 'FedEx', true),
('fr', MD5('UPS'), 'UPS', 'UPS', true),
('fr', MD5('DHL'), 'DHL', 'DHL', true);

-- Product translations (if you add products later)
INSERT INTO language_values (language_code, key, original, destination, is_approved) VALUES
('fr', MD5('Wireless Bluetooth Headphones'), 'Wireless Bluetooth Headphones', 'Casque Bluetooth Sans Fil', true),
('fr', MD5('High-quality wireless headphones with noise cancellation'), 'High-quality wireless headphones with noise cancellation', 'Casque sans fil de haute qualité avec réduction de bruit', true);

-- Category translations (if you add categories later)
INSERT INTO language_values (language_code, key, original, destination, is_approved) VALUES
('fr', MD5('Electronics'), 'Electronics', 'Électronique', true),
('fr', MD5('Clothing'), 'Clothing', 'Vêtements', true);
```

## 🚀 Implementation Steps

### **Step 1: Backend Changes (1-2 days)**
1. Add new methods to `TranslationService`
2. Create `ContentTranslationInterceptor`
3. Create `ContentTranslationController`
4. Update `TranslationModule`
5. Optionally add interceptors to existing controllers

### **Step 2: Frontend Changes (1-2 days)**
1. Add `translateContent` function to `useTranslation` hook
2. Update `Customers` component with content translation
3. Update `Carriers` component with content translation
4. Create `ContentTranslationManager` component

### **Step 3: Testing (1 day)**
1. Add sample translations to database
2. Test API endpoints with language headers
3. Test frontend components with translated content
4. Test admin interface for adding translations

### **Step 4: Content Population (ongoing)**
1. Add translations for existing customers
2. Add translations for existing carriers
3. Set up workflow for new content translations

## 🎯 Key Benefits

- **✅ No Database Changes**: Uses existing `language_values` table
- **✅ Same MD5 Logic**: Reuses existing key generation
- **✅ Same API Endpoints**: Extends existing translation system
- **✅ Fast Implementation**: 1-2 weeks vs 3-4 weeks
- **✅ Unified System**: UI and content translation in one place

---

**These are the exact code changes needed to add content translation to your existing system!** 🌍✨

