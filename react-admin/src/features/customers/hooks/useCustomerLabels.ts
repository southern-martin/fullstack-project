import { useLabels } from '../../../shared/hooks/useLabels';
import { CUSTOMER_LABELS } from '../labels/customer-labels';

/**
 * Hook for accessing translated Customer module labels
 * 
 * This is a convenience wrapper around the generic useLabels hook,
 * pre-configured with Customer module labels.
 * 
 * Features:
 * - Type-safe access to all Customer labels
 * - Automatic translation based on current language
 * - English bypass (no API call for English)
 * - Caching via React Query
 * - Graceful fallback to English
 * 
 * @returns {Object} Translated labels and loading state
 * 
 * @example
 * ```typescript
 * const { labels: L, isLoading } = useCustomerLabels();
 * 
 * return (
 *   <div>
 *     <h1>{L.PAGE_TITLE}</h1>
 *     <p>{L.PAGE_SUBTITLE}</p>
 *     <button>{L.ADD_CUSTOMER}</button>
 *   </div>
 * );
 * ```
 */
export const useCustomerLabels = () => {
  const { labels, isLoading, error, refetch } = useLabels<typeof CUSTOMER_LABELS>(
    CUSTOMER_LABELS,
    'customer'
  );

  return {
    /** Translated labels */
    labels,
    /** Short alias for labels */
    L: labels,
    /** Loading state */
    isLoading,
    /** Error state */
    error,
    /** Refetch labels (useful after language change) */
    refetch,
  };
};
