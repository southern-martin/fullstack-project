# 🔧 Content Translation Implementation Examples

## 📋 Complete Code Examples

This document shows the complete implementation code for content translation using the existing MD5 approach, before applying any changes to the current system.

## 🚀 Backend Implementation

### **1. Enhanced Translation Service**

```typescript
// src/shared/translation/services/translation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguageValue } from '../entities/language-value.entity';
import { Language } from '../entities/language.entity';
import * as crypto from 'crypto';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(LanguageValue)
    private languageValueRepository: Repository<LanguageValue>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  // Existing method (no changes)
  async translate(text: string, languageCode: string): Promise<string> {
    const key = this.generateMD5Key(text);
    const translation = await this.findTranslation(key, languageCode);
    return translation?.destination || text;
  }

  // New method for content translation (same logic as existing)
  async translateContent(text: string, languageCode: string): Promise<string> {
    return this.translate(text, languageCode);
  }

  // New method for product content translation
  async translateProduct(product: any, languageCode: string): Promise<any> {
    if (!product) return product;

    return {
      ...product,
      name: await this.translateContent(product.name, languageCode),
      description: product.description ? await this.translateContent(product.description, languageCode) : product.description,
      metaTitle: product.metaTitle ? await this.translateContent(product.metaTitle, languageCode) : product.metaTitle,
      metaDescription: product.metaDescription ? await this.translateContent(product.metaDescription, languageCode) : product.metaDescription,
    };
  }

  // New method for category content translation
  async translateCategory(category: any, languageCode: string): Promise<any> {
    if (!category) return category;

    return {
      ...category,
      name: await this.translateContent(category.name, languageCode),
      description: category.description ? await this.translateContent(category.description, languageCode) : category.description,
    };
  }

  // New method for attribute value translation
  async translateAttributeValue(attributeValue: any, languageCode: string): Promise<any> {
    if (!attributeValue) return attributeValue;

    return {
      ...attributeValue,
      label: await this.translateContent(attributeValue.label, languageCode),
      value: await this.translateContent(attributeValue.value, languageCode),
    };
  }

  // New method for translating arrays of content
  async translateContentArray(items: any[], languageCode: string): Promise<any[]> {
    if (!Array.isArray(items)) return items;

    return Promise.all(
      items.map(async (item) => {
        // Detect content type and translate accordingly
        if (item.name && item.sku) {
          return this.translateProduct(item, languageCode);
        }
        if (item.name && item.slug) {
          return this.translateCategory(item, languageCode);
        }
        if (item.label && item.value) {
          return this.translateAttributeValue(item, languageCode);
        }
        return item;
      })
    );
  }

  // Existing method (no changes)
  private generateMD5Key(text: string): string {
    if (!text || typeof text !== 'string') {
      return '';
    }
    return crypto.createHash('md5').update(text.trim()).digest('hex');
  }

  // Existing method (no changes)
  private async findTranslation(key: string, languageCode: string): Promise<LanguageValue | null> {
    if (!key || !languageCode) return null;
    
    return this.languageValueRepository.findOne({
      where: { key, languageCode },
    });
  }

  // New method for adding content translations
  async addContentTranslation(
    originalText: string,
    translatedText: string,
    languageCode: string
  ): Promise<LanguageValue> {
    const key = this.generateMD5Key(originalText);
    
    // Check if translation already exists
    const existing = await this.findTranslation(key, languageCode);
    if (existing) {
      // Update existing translation
      existing.destination = translatedText;
      return this.languageValueRepository.save(existing);
    }

    // Create new translation
    const translation = this.languageValueRepository.create({
      key,
      languageCode,
      original: originalText,
      destination: translatedText,
    });

    return this.languageValueRepository.save(translation);
  }

  // New method for bulk content translation
  async addBulkContentTranslations(
    translations: Array<{
      originalText: string;
      translatedText: string;
      languageCode: string;
    }>
  ): Promise<LanguageValue[]> {
    const translationEntities = translations.map(({ originalText, translatedText, languageCode }) => {
      const key = this.generateMD5Key(originalText);
      return this.languageValueRepository.create({
        key,
        languageCode,
        original: originalText,
        destination: translatedText,
      });
    });

    return this.languageValueRepository.save(translationEntities);
  }
}
```

### **2. Content Translation Interceptor**

```typescript
// src/shared/translation/interceptors/content-translation.interceptor.ts
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
    
    // Check for product content
    if (item.name && item.sku) return true;
    
    // Check for category content
    if (item.name && item.slug) return true;
    
    // Check for attribute value content
    if (item.label && item.value) return true;
    
    return false;
  }

  private async translateResponseData(data: any, languageCode: string): Promise<any> {
    if (Array.isArray(data)) {
      return this.translationService.translateContentArray(data, languageCode);
    }
    
    return this.translateItem(data, languageCode);
  }

  private async translateItem(item: any, languageCode: string): Promise<any> {
    // Translate products
    if (item.name && item.sku) {
      return this.translationService.translateProduct(item, languageCode);
    }
    
    // Translate categories
    if (item.name && item.slug) {
      return this.translationService.translateCategory(item, languageCode);
    }
    
    // Translate attribute values
    if (item.label && item.value) {
      return this.translationService.translateAttributeValue(item, languageCode);
    }
    
    return item;
  }
}
```

### **3. Content Translation Controller**

```typescript
// src/shared/translation/controllers/content-translation.controller.ts
import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
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

  // Get content translations for a specific language
  @Get('language/:languageCode')
  async getContentTranslations(@Param('languageCode') languageCode: string) {
    // This would return all content translations for a specific language
    // Implementation depends on your existing translation repository
    return { message: 'Content translations retrieved', languageCode };
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
    if (content.label && content.value) {
      return this.translationService.translateAttributeValue(content, languageCode);
    }
    
    return content;
  }
}
```

### **4. Updated Product Controller (Example)**

```typescript
// src/modules/products/api/product.controller.ts
import { Controller, Get, Post, Body, Param, UseInterceptors } from '@nestjs/common';
import { ProductService } from '../application/services/product.service';
import { ContentTranslationInterceptor } from '../../../shared/translation/interceptors/content-translation.interceptor';

@Controller('products')
@UseInterceptors(ContentTranslationInterceptor) // Apply content translation to all endpoints
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async findAll() {
    // This will automatically translate product content based on Accept-Language header
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    // This will automatically translate the single product
    return this.productService.findOne(id);
  }

  @Post()
  async create(@Body() createProductDto: any) {
    // Create product (no translation needed for creation)
    return this.productService.create(createProductDto);
  }
}
```

## 🎨 Frontend Implementation

### **1. Enhanced Translation Hook**

```typescript
// src/shared/hooks/useTranslation.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

interface TranslationHook {
  t: (text: string) => string;
  translateContent: (content: any) => Promise<any>;
  language: string;
  setLanguage: (language: string) => void;
  isLoading: boolean;
}

export const useTranslation = (): TranslationHook => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load translations when language changes
  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  const loadTranslations = async (lang: string) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/v1/translations/language/${lang}`);
      const translationMap: Record<string, string> = {};
      
      response.data.forEach((translation: any) => {
        translationMap[translation.original] = translation.destination;
      });
      
      setTranslations(translationMap);
    } catch (error) {
      console.error('Failed to load translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Existing UI translation function
  const t = useCallback((text: string): string => {
    return translations[text] || text;
  }, [translations]);

  // New content translation function
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

      // Translate category content
      if (content.name && content.slug) {
        translatedContent.name = t(content.name);
        if (content.description) {
          translatedContent.description = t(content.description);
        }
      }

      // Translate attribute value content
      if (content.label && content.value) {
        translatedContent.label = t(content.label);
        translatedContent.value = t(content.value);
      }

      return translatedContent;
    }

    return content;
  }, [t]);

  return {
    t,
    translateContent,
    language,
    setLanguage,
    isLoading,
  };
};
```

### **2. Product Component with Content Translation**

```typescript
// src/features/products/components/ProductCard.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../shared/hooks/useTranslation';

interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  metaTitle?: string;
  metaDescription?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { translateContent, t } = useTranslation();
  const [translatedProduct, setTranslatedProduct] = useState<Product | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateProduct = async () => {
      setIsTranslating(true);
      try {
        const translated = await translateContent(product);
        setTranslatedProduct(translated);
      } catch (error) {
        console.error('Failed to translate product:', error);
        setTranslatedProduct(product);
      } finally {
        setIsTranslating(false);
      }
    };

    translateProduct();
  }, [product, translateContent]);

  if (isTranslating) {
    return (
      <div className="product-card loading">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!translatedProduct) {
    return <div className="product-card error">Failed to load product</div>;
  }

  return (
    <div className="product-card bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {translatedProduct.name}
      </h3>
      
      <p className="text-gray-600 text-sm mb-3">
        {translatedProduct.description}
      </p>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          SKU: {translatedProduct.sku}
        </span>
        <span className="text-lg font-bold text-blue-600">
          ${translatedProduct.price}
        </span>
      </div>
      
      <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        {t('Add to Cart')}
      </button>
    </div>
  );
};
```

### **3. Category Navigation with Content Translation**

```typescript
// src/features/categories/components/CategoryMenu.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import { api } from '../../../shared/utils/api';

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export const CategoryMenu: React.FC = () => {
  const { translateContent, t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [translatedCategories, setTranslatedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get('/api/v1/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const translateCategories = async () => {
      if (categories.length > 0) {
        try {
          const translated = await Promise.all(
            categories.map(category => translateContent(category))
          );
          setTranslatedCategories(translated);
        } catch (error) {
          console.error('Failed to translate categories:', error);
          setTranslatedCategories(categories);
        }
      }
    };

    translateCategories();
  }, [categories, translateContent]);

  if (isLoading) {
    return (
      <nav className="category-menu">
        <div className="animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="category-menu bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">{t('Categories')}</h3>
      <ul className="space-y-2">
        {translatedCategories.map(category => (
          <li key={category.id}>
            <Link
              to={`/category/${category.slug}`}
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              {category.name}
            </Link>
            {category.description && (
              <p className="text-sm text-gray-600 ml-2">
                {category.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

### **4. Content Translation Admin Interface**

```typescript
// src/features/admin/components/ContentTranslationManager.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import { api } from '../../../shared/utils/api';

interface TranslationFormData {
  originalText: string;
  translatedText: string;
  languageCode: string;
}

export const ContentTranslationManager: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [translationForm, setTranslationForm] = useState<TranslationFormData>({
    originalText: '',
    translatedText: '',
    languageCode: 'fr',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/api/v1/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    loadProducts();
  }, []);

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setTranslationForm({
      originalText: product.name,
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

  const handleBulkTranslation = async () => {
    if (!selectedProduct) return;

    const translations = [
      {
        originalText: selectedProduct.name,
        translatedText: translationForm.translatedText,
        languageCode: translationForm.languageCode,
      },
    ];

    if (selectedProduct.description) {
      translations.push({
        originalText: selectedProduct.description,
        translatedText: '', // Admin would fill this
        languageCode: translationForm.languageCode,
      });
    }

    try {
      await api.post('/api/v1/admin/translations/content/bulk', {
        translations,
      });
      alert('Bulk translations added successfully!');
    } catch (error) {
      console.error('Failed to add bulk translations:', error);
      alert('Failed to add bulk translations');
    }
  };

  return (
    <div className="content-translation-manager p-6">
      <h2 className="text-2xl font-bold mb-6">{t('Content Translation Manager')}</h2>

      {/* Product Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('Select Product')}
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={(e) => {
            const product = products.find(p => p.id === parseInt(e.target.value));
            handleProductSelect(product);
          }}
        >
          <option value="">{t('Choose a product...')}</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {/* Translation Form */}
      {selectedProduct && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {t('Translate Product')}: {selectedProduct.name}
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

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? t('Adding...') : t('Add Translation')}
              </button>

              <button
                type="button"
                onClick={handleBulkTranslation}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {t('Add Bulk Translations')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
```

## 📊 Database Examples

### **Sample Data for Content Translation**

```sql
-- UI Translations (existing)
INSERT INTO language_values (language_code, key, original, destination) VALUES
('fr', MD5('First Name'), 'First Name', 'Prénom'),
('fr', MD5('Last Name'), 'Last Name', 'Nom'),
('fr', MD5('Email'), 'Email', 'E-mail'),
('fr', MD5('Add to Cart'), 'Add to Cart', 'Ajouter au panier');

-- Content Translations (new)
INSERT INTO language_values (language_code, key, original, destination) VALUES
-- Product translations
('fr', MD5('Wireless Bluetooth Headphones'), 'Wireless Bluetooth Headphones', 'Casque Bluetooth Sans Fil'),
('fr', MD5('High-quality wireless headphones with noise cancellation'), 'High-quality wireless headphones with noise cancellation', 'Casque sans fil de haute qualité avec réduction de bruit'),
('fr', MD5('Premium Audio Experience'), 'Premium Audio Experience', 'Expérience Audio Premium'),

-- Category translations
('fr', MD5('Electronics'), 'Electronics', 'Électronique'),
('fr', MD5('Latest electronic devices and gadgets'), 'Latest electronic devices and gadgets', 'Derniers appareils électroniques et gadgets'),
('fr', MD5('Clothing'), 'Clothing', 'Vêtements'),
('fr', MD5('Fashion and apparel for all occasions'), 'Fashion and apparel for all occasions', 'Mode et vêtements pour toutes occasions'),

-- Attribute translations
('fr', MD5('Color'), 'Color', 'Couleur'),
('fr', MD5('Size'), 'Size', 'Taille'),
('fr', MD5('Red'), 'Red', 'Rouge'),
('fr', MD5('Blue'), 'Blue', 'Bleu'),
('fr', MD5('Green'), 'Green', 'Vert'),
('fr', MD5('Large'), 'Large', 'Grand'),
('fr', MD5('Medium'), 'Medium', 'Moyen'),
('fr', MD5('Small'), 'Small', 'Petit');
```

## 🎯 API Usage Examples

### **1. Get Translated Products**

```bash
# Request with French language header
GET /api/v1/products
Accept-Language: fr
X-Language: fr

# Response with translated content
{
  "data": [
    {
      "id": 1,
      "name": "Casque Bluetooth Sans Fil", // Translated
      "description": "Casque sans fil de haute qualité avec réduction de bruit", // Translated
      "sku": "WBH-001",
      "price": 99.99,
      "category": "Électronique" // Translated
    }
  ],
  "message": "Produits récupérés avec succès" // UI translated
}
```

### **2. Add Content Translation**

```bash
# Add product name translation
POST /api/v1/admin/translations/content/add
Content-Type: application/json

{
  "originalText": "Wireless Bluetooth Headphones",
  "translatedText": "Casque Bluetooth Sans Fil",
  "languageCode": "fr"
}

# Response
{
  "id": 123,
  "key": "a1b2c3d4e5f6...", // MD5 hash
  "languageCode": "fr",
  "original": "Wireless Bluetooth Headphones",
  "destination": "Casque Bluetooth Sans Fil",
  "createdAt": "2024-01-10T10:00:00.000Z"
}
```

### **3. Bulk Content Translation**

```bash
# Add multiple translations at once
POST /api/v1/admin/translations/content/bulk
Content-Type: application/json

{
  "translations": [
    {
      "originalText": "Wireless Bluetooth Headphones",
      "translatedText": "Casque Bluetooth Sans Fil",
      "languageCode": "fr"
    },
    {
      "originalText": "High-quality wireless headphones with noise cancellation",
      "translatedText": "Casque sans fil de haute qualité avec réduction de bruit",
      "languageCode": "fr"
    },
    {
      "originalText": "Electronics",
      "translatedText": "Électronique",
      "languageCode": "fr"
    }
  ]
}
```

## 🚀 Implementation Steps

### **Step 1: Backend Implementation (2-3 days)**
1. Extend `TranslationService` with content translation methods
2. Create `ContentTranslationInterceptor`
3. Add `ContentTranslationController`
4. Update existing controllers to use the interceptor

### **Step 2: Frontend Implementation (2-3 days)**
1. Enhance `useTranslation` hook with content translation
2. Update product and category components
3. Create content translation admin interface
4. Add loading states and error handling

### **Step 3: Testing and Integration (1-2 days)**
1. Test content translation with sample data
2. Verify API responses include translated content
3. Test admin interface for adding translations
4. Performance testing with large datasets

### **Step 4: Content Population (ongoing)**
1. Add translations for existing products
2. Add translations for categories
3. Add translations for attributes
4. Set up translation workflow for new content

---

**This implementation provides complete content translation using your existing MD5 approach and table structure!** 🌍✨

