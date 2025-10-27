/**
 * Translation Service Constants
 * 
 * Centralized configuration values for translation operations.
 * These values can be adjusted based on performance requirements and API limits.
 */

/**
 * Maximum number of texts that can be translated in a single batch request.
 * 
 * This limit helps to:
 * - Prevent memory overflow from large batch requests
 * - Maintain reasonable response times
 * - Avoid overwhelming external translation APIs
 * - Ensure fair resource allocation across requests
 * 
 * Adjust this value based on:
 * - Server memory capacity
 * - External API rate limits
 * - Average translation processing time
 * - Application performance requirements
 */
export const MAX_BATCH_TRANSLATION_SIZE = 200;

/**
 * Translation configuration object for easy access to all translation-related constants.
 */
export const TranslationConfig = {
  /**
   * Maximum batch size for translation requests
   */
  maxBatchSize: MAX_BATCH_TRANSLATION_SIZE,

  /**
   * Default source language when not specified
   */
  defaultSourceLanguage: 'auto',

  /**
   * Cache TTL for translations (in seconds)
   * Set to 0 for permanent caching
   */
  cacheTTL: 0,
} as const;
