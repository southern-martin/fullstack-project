import { useLabels } from '../../../shared/hooks/useLabels';
import { TranslationLabels, translationLabels } from '../labels/translation-labels';

/**
 * Translation Module Labels Hook
 * 
 * Provides translated labels for the Translation module.
 * Wraps the generic useLabels hook with module-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full TranslationLabels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = useTranslationLabels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{L.page.title}</h1>
 *     <p>{L.page.subtitle}</p>
 *     <button>{L.buttons.createTranslation}</button>
 *   </div>
 * );
 */
export const useTranslationLabels = () => {
  const result = useLabels<TranslationLabels>(translationLabels, 'translations');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
