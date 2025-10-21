import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../../app/providers/LanguageProvider';
import { translationApiClient } from '../../features/translations/services/translationApiClient';

/**
 * Generic hook for translating static UI labels
 * 
 * This hook provides a reusable pattern for translating any set of labels
 * using the MD5-based Translation Service batch API.
 * 
 * Features:
 * - Batch translation (single API call for all labels)
 * - English bypass (no API call for default language)
 * - React Query caching (5-min stale, 10-min GC)
 * - Graceful fallback to English on error
 * - Type-safe with generics
 * 
 * @template T - The type of the label object (e.g., CarrierLabels)
 * 
 * @example
 * ```typescript
 * const { labels, isLoading, error } = useLabels(CARRIER_LABELS);
 * return <h1>{labels.page.title}</h1>;
 * ```
 */
export const useLabels = <T extends Record<string, any>>(
  sourceLabels: T,
  moduleName: string
): {
  labels: T;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} => {
  const { currentLanguage } = useLanguage();
  const languageCode = currentLanguage?.code || 'en';

  // Extract all text strings from the label object
  const labelTexts = useMemo(() => {
    const texts: string[] = [];
    const extractStrings = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          texts.push(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          extractStrings(obj[key]);
        }
      }
    };
    extractStrings(sourceLabels);
    return texts;
  }, [sourceLabels]);

  // Fetch translations using batch API
  const {
    data: translationMap,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['labels', moduleName, languageCode],
    queryFn: async () => {
      // Skip API call for English (return empty map)
      if (languageCode === 'en') {
        return new Map<string, string>();
      }

      console.log(`🔄 Fetching ${labelTexts.length} ${moduleName} labels for ${languageCode}...`);
      const startTime = Date.now();

      try {
        // Batch translate all labels at once
        const response = await translationApiClient.translateBatch({
          texts: labelTexts,
          targetLanguage: languageCode,
          sourceLanguage: 'en',
        });

        const duration = Date.now() - startTime;
        const cacheHits = response.translations.filter((t: any) => t.fromCache).length;
        console.log(
          `✅ ${moduleName} labels loaded in ${duration}ms. ` +
          `Cache hits: ${cacheHits}/${response.translations.length}`
        );

        // Create map of original text -> translated text
        const map = new Map<string, string>();
        labelTexts.forEach((text, index) => {
          const translation = response.translations[index];
          if (translation) {
            map.set(text, translation.translatedText);
          }
        });

        return map;
      } catch (err) {
        console.error(`❌ Failed to load ${moduleName} labels:`, err);
        // Return empty map on error (will use English fallback)
        return new Map<string, string>();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    enabled: !!languageCode,
    retry: 1, // Only retry once for label translations
  });

  // Apply translations to label object
  const translatedLabels = useMemo(() => {
    // If loading or no translations, return source labels (English)
    if (!translationMap || translationMap.size === 0) {
      return sourceLabels;
    }

    // Deep clone and translate
    const translated = JSON.parse(JSON.stringify(sourceLabels)) as T;

    const translateObject = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          const translatedText = translationMap.get(obj[key]);
          if (translatedText) {
            obj[key] = translatedText;
          }
          // If no translation found, keep original (English fallback)
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          translateObject(obj[key]);
        }
      }
    };

    translateObject(translated);
    return translated;
  }, [sourceLabels, translationMap]);

  return {
    labels: translatedLabels,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};

/**
 * Hook for getting a translation function (similar to i18n's t())
 * 
 * This provides a function-based API for label translation,
 * useful when you need to access labels dynamically.
 * 
 * @example
 * ```typescript
 * const { t } = useTranslationFunction(CARRIER_LABELS, 'carrier');
 * const title = t('page.title'); // "Carriers" or "Transporteurs"
 * ```
 */
export const useTranslationFunction = <T extends Record<string, any>>(
  sourceLabels: T,
  moduleName: string
): {
  t: (path: string) => string;
  isLoading: boolean;
  error: Error | null;
} => {
  const { labels, isLoading, error } = useLabels(sourceLabels, moduleName);

  const t = useCallback(
    (path: string): string => {
      const keys = path.split('.');
      let value: any = labels;

      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) {
          // Fallback to source labels if path not found
          value = sourceLabels;
          for (const k of keys) {
            value = value?.[k];
          }
          console.warn(`Translation path not found: ${path}`);
          return value || path;
        }
      }

      return value || path;
    },
    [labels, sourceLabels]
  );

  return {
    t,
    isLoading,
    error,
  };
};
