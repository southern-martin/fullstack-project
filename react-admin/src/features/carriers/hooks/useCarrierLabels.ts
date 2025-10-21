import { useLabels } from '../../../shared/hooks/useLabels';
import { CARRIER_LABELS, CarrierLabels } from '../constants/carrier-labels';

/**
 * Hook for accessing translated Carrier module labels
 * 
 * This is a convenience wrapper around the generic useLabels hook,
 * pre-configured with Carrier module labels.
 * 
 * Features:
 * - Type-safe access to all Carrier labels
 * - Automatic translation based on current language
 * - English bypass (no API call for English)
 * - Caching via React Query
 * - Graceful fallback to English
 * 
 * @returns {Object} Translated labels and loading state
 * 
 * @example
 * ```typescript
 * const { labels: L, isLoading } = useCarrierLabels();
 * 
 * return (
 *   <div>
 *     <h1>{L.page.title}</h1>
 *     <p>{L.page.subtitle}</p>
 *     <button>{L.actions.add}</button>
 *   </div>
 * );
 * ```
 */
export const useCarrierLabels = () => {
  const { labels, isLoading, error, refetch } = useLabels<CarrierLabels>(
    CARRIER_LABELS,
    'carrier'
  );

  return {
    /** Translated labels - access via L.page.title, L.actions.add, etc. */
    labels,
    /** Short alias for labels (L.page.title instead of labels.page.title) */
    L: labels,
    /** Loading state */
    isLoading,
    /** Error state */
    error,
    /** Refetch labels (useful after language change) */
    refetch,
  };
};
