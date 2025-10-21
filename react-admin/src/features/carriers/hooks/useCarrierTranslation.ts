import { useCallback, useState } from 'react';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { translationApiClient } from '../../translations/services/translationApiClient';
import { Carrier } from '../services/carrierApiService';

export interface TranslatedCarrier extends Carrier {
  _original?: {
    name: string;
    description?: string;
  };
  _isTranslated?: boolean;
  _translationMeta?: {
    nameFromCache: boolean;
    descriptionFromCache?: boolean;
  };
}

export const useCarrierTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  
  // Get current language from LanguageProvider
  const { currentLanguage: languageObj } = useLanguage();
  const currentLanguage = languageObj?.code || 'en';

  /**
   * Translates an array of carriers using BATCH translation endpoint.
   * This is the MAIN method - translates ALL carriers in ONE request.
   */
  const translateCarriers = useCallback(async (
    carriers: Carrier[]
  ): Promise<TranslatedCarrier[]> => {
    if (!carriers?.length) return [];
    
    // Skip translation if English or no language selected
    if (!currentLanguage || currentLanguage === 'en') {
      return carriers;
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      // Step 1: Extract all texts that need translation
      const textsToTranslate: string[] = [];
      const textIndexMap: Map<number, { nameIndex: number; descIndex?: number }> = new Map();

      carriers.forEach((carrier, index) => {
        const nameIndex = textsToTranslate.length;
        textsToTranslate.push(carrier.name);

        const indices: { nameIndex: number; descIndex?: number } = { nameIndex };

        if (carrier.description) {
          const descIndex = textsToTranslate.length;
          textsToTranslate.push(carrier.description);
          indices.descIndex = descIndex;
        }

        textIndexMap.set(index, indices);
      });

      console.log(`🔄 Translating ${textsToTranslate.length} texts for ${carriers.length} carriers in batch to ${currentLanguage}...`);
      const startTime = Date.now();

      // Step 2: Make SINGLE batch translation request
      const batchResponse = await translationApiClient.translateBatch({
        texts: textsToTranslate,
        targetLanguage: currentLanguage,
        sourceLanguage: 'en',
      });

      const translations = batchResponse.translations;
      const duration = Date.now() - startTime;

      console.log(`✅ Batch translation complete in ${duration}ms. Cache hits: ${translations.filter(t => t.fromCache).length}/${translations.length}`);

      // Step 3: Map translations back to carriers
      const translatedCarriers: TranslatedCarrier[] = carriers.map((carrier, index) => {
        const indices = textIndexMap.get(index)!;
        const nameTranslation = translations[indices.nameIndex];
        const descTranslation = indices.descIndex !== undefined 
          ? translations[indices.descIndex] 
          : undefined;

        return {
          ...carrier,
          name: nameTranslation.translatedText,
          description: descTranslation ? descTranslation.translatedText : carrier.description,
          _original: {
            name: carrier.name,
            description: carrier.description,
          },
          _isTranslated: true,
          _translationMeta: {
            nameFromCache: nameTranslation.fromCache,
            descriptionFromCache: descTranslation?.fromCache,
          },
        };
      });

      return translatedCarriers;

    } catch (error) {
      console.error('❌ Failed to translate carriers:', error);
      setTranslationError('Failed to translate carriers');
      return carriers; // Fallback to original
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  /**
   * Translates a single carrier (uses batch endpoint with 1 item).
   * Useful for real-time translation of newly created carriers.
   */
  const translateCarrier = useCallback(async (
    carrier: Carrier
  ): Promise<TranslatedCarrier> => {
    const [translated] = await translateCarriers([carrier]);
    return translated || carrier;
  }, [translateCarriers]);

  return {
    translateCarrier,
    translateCarriers,
    isTranslating,
    translationError,
    currentLanguage,
  };
};
