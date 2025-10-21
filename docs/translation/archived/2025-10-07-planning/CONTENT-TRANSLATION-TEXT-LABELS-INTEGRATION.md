# 🔤 Content Translation with Text/Labels Integration

## 📋 Overview

This document shows how the **Content Translation Service** handles text/labels and integrates seamlessly with your existing UI translation system.

## 🎯 How It Works

### **Current UI Translation System (Unchanged)**
```typescript
// Your existing TranslationService handles UI text/labels
const { t } = useTranslation();

// UI Labels and Text
t('First Name')        // → 'Prénom'
t('Last Name')         // → 'Nom'
t('Email Address')     // → 'Adresse e-mail'
t('Save')              // → 'Enregistrer'
t('Cancel')            // → 'Annuler'
t('Delete')            // → 'Supprimer'
```

### **New Content Translation System (Added)**
```typescript
// New ContentTranslationService handles dynamic content
const { translateContent } = useContentTranslation();

// Dynamic Content (Customer Names, Product Names, etc.)
translateContent({ firstName: 'John', lastName: 'Doe' })
// → { firstName: 'Jean', lastName: 'Dupont' }

translateContent({ name: 'Wireless Headphones' })
// → { name: 'Casque Sans Fil' }
```

## 🔄 Integration Architecture

### **How Both Systems Work Together**

```typescript
// 1. UI Translation (Existing - Unchanged)
const { t } = useTranslation();

// 2. Content Translation (New - Added)
const { translateContent } = useContentTranslation();

// 3. Combined Usage in Components
const CustomerForm = () => {
  const [customer, setCustomer] = useState({ firstName: 'John', lastName: 'Doe' });
  const [translatedCustomer, setTranslatedCustomer] = useState(null);

  useEffect(() => {
    translateContent(customer).then(setTranslatedCustomer);
  }, [customer]);

  return (
    <form>
      <label>{t('First Name')}</label> {/* UI Translation */}
      <input value={translatedCustomer?.firstName || customer.firstName} /> {/* Content Translation */}
      
      <label>{t('Last Name')}</label> {/* UI Translation */}
      <input value={translatedCustomer?.lastName || customer.lastName} /> {/* Content Translation */}
      
      <button>{t('Save')}</button> {/* UI Translation */}
    </form>
  );
};
```

## 🚀 Backend Implementation

### **Content Translation Service with Text/Label Support**

**File**: `nestjs-app-api/api/src/shared/translation/services/content-translation.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguageValue } from '../entities/language-value.entity';
import { TranslationService } from './translation.service';

@Injectable()
export class ContentTranslationService {
  constructor(
    @InjectRepository(LanguageValue)
    private readonly languageValueRepository: Repository<LanguageValue>,
    private readonly translationService: TranslationService, // Use existing service
  ) {}

  /**
   * Generic text/label translation using existing TranslationService
   * This is the core method that handles any text content
   */
  async translateText(text: string, language: string = 'en'): Promise<string> {
    return this.translationService.translate(text, {}, language);
  }

  /**
   * Translate any content object with text fields
   */
  async translateContent(content: any, language: string = 'en'): Promise<any> {
    if (!content) return content;

    // If it's a string, translate it directly
    if (typeof content === 'string') {
      return this.translateText(content, language);
    }

    // If it's an object, translate its text properties
    if (typeof content === 'object') {
      const translatedContent = { ...content };

      // Translate common text fields
      const textFields = ['name', 'title', 'description', 'firstName', 'lastName', 'label', 'value'];
      
      for (const field of textFields) {
        if (content[field] && typeof content[field] === 'string') {
          translatedContent[field] = await this.translateText(content[field], language);
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
   * Translate customer content (specific implementation)
   */
  async translateCustomer(customer: any, language: string = 'en'): Promise<any> {
    if (!customer) return customer;

    return {
      ...customer,
      firstName: await this.translateText(customer.firstName, language),
      lastName: await this.translateText(customer.lastName, language),
      // Translate any other text fields
      company: customer.company ? await this.translateText(customer.company, language) : customer.company,
    };
  }

  /**
   * Translate carrier content (specific implementation)
   */
  async translateCarrier(carrier: any, language: string = 'en'): Promise<any> {
    if (!carrier) return carrier;

    return {
      ...carrier,
      name: await this.translateText(carrier.name, language),
      description: carrier.description ? await this.translateText(carrier.description, language) : carrier.description,
    };
  }

  /**
   * Translate product content (for future use)
   */
  async translateProduct(product: any, language: string = 'en'): Promise<any> {
    if (!product) return product;

    return {
      ...product,
      name: await this.translateText(product.name, language),
      description: product.description ? await this.translateText(product.description, language) : product.description,
      metaTitle: product.metaTitle ? await this.translateText(product.metaTitle, language) : product.metaTitle,
      metaDescription: product.metaDescription ? await this.translateText(product.metaDescription, language) : product.metaDescription,
    };
  }

  /**
   * Translate array of content items
   */
  async translateContentArray(items: any[], language: string = 'en'): Promise<any[]> {
    if (!Array.isArray(items)) return items;

    return Promise.all(
      items.map(item => this.translateContent(item, language))
    );
  }

  /**
   * Add text/label translation using existing TranslationService
   */
  async addTextTranslation(
    originalText: string,
    translatedText: string,
    languageCode: string
  ): Promise<LanguageValue> {
    return this.translationService.addTranslation(originalText, languageCode, translatedText, true);
  }

  /**
   * Add bulk text translations
   */
  async addBulkTextTranslations(
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
   * Get all text translations for a language
   */
  async getTextTranslations(languageCode: string): Promise<LanguageValue[]> {
    return this.translationService.getTranslationsByLanguage(languageCode);
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

## 🎨 Frontend Implementation

### **Enhanced Content Translation Hook**

**File**: `react-admin/src/features/translation/hooks/useContentTranslation.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from './useTranslation';
import { api } from '../../../shared/utils/api';

interface ContentTranslationHook {
  // Generic text translation
  translateText: (text: string) => string;
  
  // Content object translation
  translateContent: (content: any) => Promise<any>;
  translateContentArray: (contentArray: any[]) => Promise<any[]>;
  
  // Specific content type translations
  translateCustomer: (customer: any) => Promise<any>;
  translateCarrier: (carrier: any) => Promise<any>;
  
  // Admin functions
  addTextTranslation: (originalText: string, translatedText: string, languageCode: string) => Promise<any>;
  addBulkTextTranslations: (translations: Array<{originalText: string, translatedText: string, languageCode: string}>) => Promise<any>;
  
  // State
  isLoading: boolean;
  error: string | null;
}

export const useContentTranslation = (): ContentTranslationHook => {
  const { t, currentLanguage } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Translate single text (uses existing UI translation)
  const translateText = useCallback((text: string): string => {
    return t(text);
  }, [t]);

  // Translate content object
  const translateContent = useCallback(async (content: any): Promise<any> => {
    if (!content) return content;

    // If it's a string, use existing UI translation
    if (typeof content === 'string') {
      return translateText(content);
    }

    // If it's an object, translate its text properties
    if (typeof content === 'object') {
      const translatedContent = { ...content };

      // Translate common text fields
      const textFields = ['name', 'title', 'description', 'firstName', 'lastName', 'label', 'value'];
      
      for (const field of textFields) {
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

  // Translate array of content objects
  const translateContentArray = useCallback(async (contentArray: any[]): Promise<any[]> => {
    if (!Array.isArray(contentArray)) return contentArray;

    return Promise.all(contentArray.map(content => translateContent(content)));
  }, [translateContent]);

  // Translate customer specifically
  const translateCustomer = useCallback(async (customer: any): Promise<any> => {
    if (!customer) return customer;

    return {
      ...customer,
      firstName: translateText(customer.firstName),
      lastName: translateText(customer.lastName),
      company: customer.company ? translateText(customer.company) : customer.company,
    };
  }, [translateText]);

  // Translate carrier specifically
  const translateCarrier = useCallback(async (carrier: any): Promise<any> => {
    if (!carrier) return carrier;

    return {
      ...carrier,
      name: translateText(carrier.name),
      description: carrier.description ? translateText(carrier.description) : carrier.description,
    };
  }, [translateText]);

  // Add single text translation
  const addTextTranslation = useCallback(async (
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
      setError('Failed to add text translation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add bulk text translations
  const addBulkTextTranslations = useCallback(async (
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
      setError('Failed to add bulk text translations');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    translateText,
    translateContent,
    translateContentArray,
    translateCustomer,
    translateCarrier,
    addTextTranslation,
    addBulkTextTranslations,
    isLoading,
    error,
  };
};
```

## 📊 Real-World Examples

### **1. Customer Form with Both UI and Content Translation**

```typescript
const CustomerForm: React.FC<{ customer?: Customer }> = ({ customer }) => {
  const { t } = useTranslation(); // UI translation
  const { translateCustomer } = useContentTranslation(); // Content translation
  const [translatedCustomer, setTranslatedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (customer) {
      translateCustomer(customer).then(setTranslatedCustomer);
    }
  }, [customer, translateCustomer]);

  return (
    <form className="space-y-4">
      {/* UI Labels (translated) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('First Name')} {/* UI Translation */}
        </label>
        <input
          type="text"
          value={translatedCustomer?.firstName || customer?.firstName || ''}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('Last Name')} {/* UI Translation */}
        </label>
        <input
          type="text"
          value={translatedCustomer?.lastName || customer?.lastName || ''}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('Email Address')} {/* UI Translation */}
        </label>
        <input
          type="email"
          value={customer?.email || ''}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Action Buttons (UI Translation) */}
      <div className="flex space-x-3">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {t('Save')} {/* UI Translation */}
        </button>
        <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
          {t('Cancel')} {/* UI Translation */}
        </button>
      </div>
    </form>
  );
};
```

### **2. Customer List with Content Translation**

```typescript
const CustomerList: React.FC = () => {
  const { t } = useTranslation(); // UI translation
  const { translateContentArray } = useContentTranslation(); // Content translation
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [translatedCustomers, setTranslatedCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    // Load customers
    api.get('/api/v1/customers').then(response => {
      setCustomers(response.data);
    });
  }, []);

  useEffect(() => {
    // Translate customer content
    if (customers.length > 0) {
      translateContentArray(customers).then(setTranslatedCustomers);
    }
  }, [customers, translateContentArray]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {t('Customers')} {/* UI Translation */}
      </h2>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('First Name')} {/* UI Translation */}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('Last Name')} {/* UI Translation */}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('Email')} {/* UI Translation */}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('Actions')} {/* UI Translation */}
            </th>
          </tr>
        </thead>
        <tbody>
          {translatedCustomers.map(customer => (
            <tr key={customer.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {customer.firstName} {/* Content Translation */}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {customer.lastName} {/* Content Translation */}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {customer.email} {/* No translation needed */}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900">
                  {t('Edit')} {/* UI Translation */}
                </button>
                <button className="text-red-600 hover:text-red-900 ml-2">
                  {t('Delete')} {/* UI Translation */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### **3. Text Translation Admin Interface**

```typescript
const TextTranslationManager: React.FC = () => {
  const { t } = useTranslation(); // UI translation
  const { addTextTranslation, addBulkTextTranslations } = useContentTranslation();
  const [formData, setFormData] = useState({
    originalText: '',
    translatedText: '',
    languageCode: 'fr',
  });

  const handleAddTranslation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addTextTranslation(
        formData.originalText,
        formData.translatedText,
        formData.languageCode
      );
      
      alert(t('Translation added successfully!')); // UI Translation
      setFormData({ originalText: '', translatedText: '', languageCode: 'fr' });
    } catch (error) {
      alert(t('Failed to add translation')); // UI Translation
    }
  };

  const handleBulkTranslation = async () => {
    const bulkTranslations = [
      { originalText: 'John Doe', translatedText: 'Jean Dupont', languageCode: 'fr' },
      { originalText: 'Jane Smith', translatedText: 'Jeanne Martin', languageCode: 'fr' },
      { originalText: 'FedEx', translatedText: 'FedEx', languageCode: 'fr' },
    ];

    try {
      await addBulkTextTranslations(bulkTranslations);
      alert(t('Bulk translations added successfully!')); // UI Translation
    } catch (error) {
      alert(t('Failed to add bulk translations')); // UI Translation
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {t('Text Translation Manager')} {/* UI Translation */}
      </h2>

      <form onSubmit={handleAddTranslation} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Original Text')} {/* UI Translation */}
          </label>
          <input
            type="text"
            value={formData.originalText}
            onChange={(e) => setFormData({ ...formData, originalText: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder={t('Enter original text...')} /* UI Translation */
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Translated Text')} {/* UI Translation */}
          </label>
          <input
            type="text"
            value={formData.translatedText}
            onChange={(e) => setFormData({ ...formData, translatedText: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder={t('Enter translated text...')} /* UI Translation */
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Language')} {/* UI Translation */}
          </label>
          <select
            value={formData.languageCode}
            onChange={(e) => setFormData({ ...formData, languageCode: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <div className="flex space-x-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {t('Add Translation')} {/* UI Translation */}
          </button>
          <button type="button" onClick={handleBulkTranslation} className="bg-green-600 text-white px-4 py-2 rounded">
            {t('Add Bulk Translations')} {/* UI Translation */}
          </button>
        </div>
      </form>
    </div>
  );
};
```

## 🎯 Key Benefits

### **✅ Unified Translation System**
- **UI Translation**: Handles labels, buttons, messages
- **Content Translation**: Handles dynamic content (names, descriptions)
- **Same Database**: Both use the same `language_values` table
- **Same MD5 Logic**: Both use the same key generation

### **✅ Seamless Integration**
- **No Conflicts**: Both systems work together perfectly
- **Easy to Use**: Simple hooks for both translation types
- **Consistent API**: Same patterns for both systems
- **Unified Management**: Single admin interface for both

### **✅ Real-World Usage**
```typescript
// UI Translation (existing)
t('First Name') // → 'Prénom'

// Content Translation (new)
translateText('John Doe') // → 'Jean Dupont'

// Combined in components
<label>{t('First Name')}</label> {/* UI */}
<input value={translateText(customer.firstName)} /> {/* Content */}
```

---

**This approach provides a complete translation solution for both UI text/labels and dynamic content!** 🔤✨

