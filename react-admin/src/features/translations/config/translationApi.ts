/**
 * Translation API Configuration
 * 
 * This file contains all API endpoint definitions for the Translation module.
 * All requests go through Kong Gateway at http://localhost:8000
 */

export const TRANSLATION_API_CONFIG = {
  ENDPOINTS: {
    LIST: '/translation/translations',
    CREATE: '/translation/translations',
    UPDATE: (id: number) => `/translation/translations/${id}`,
    DELETE: (id: number) => `/translation/translations/${id}`,
    BY_LANGUAGE: (languageCode: string) => `/translation/translations/language/${languageCode}`,
    TRANSLATE: '/translation/translations/translate',
    BATCH_TRANSLATE: '/translation/translations/batch',
    LANGUAGES: '/translation/languages',
  },
} as const;

export const TRANSLATION_ROUTES = {
  TRANSLATIONS: '/translations',
} as const;
