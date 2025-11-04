import { useLabels } from '../../../shared/hooks/useLabels';
import { USER_LABELS, UserLabels } from '../constants/userLabels';

/**
 * Hook for accessing translated User Management module labels
 *
 * This is a convenience wrapper around the generic useLabels hook,
 * pre-configured with User Management module labels.
 *
 * Features:
 * - Type-safe access to all User Management labels
 * - Automatic translation based on current language
 * - English bypass (no API call for English)
 * - Caching via React Query
 * - Graceful fallback to English
 *
 * @returns {Object} Translated labels and loading state
 *
 * @example
 * ```typescript
 * const { labels: L, isLoading } = useUserLabels();
 *
 * return (
 *   <div>
 *     <h3>{L.success.created}</h3>
 *     <span>{L.errors.network}</span>
 *     <button>{L.actions.save}</button>
 *   </div>
 * );
 * ```
 */
export const useUserLabels = () => {
  const { labels, isLoading, error, refetch } = useLabels<UserLabels>(
    USER_LABELS,
    'user'
  );

  return {
    /** Translated labels - access via L.success.created, L.errors.network, etc. */
    labels,
    /** Short alias for labels (L.errors.network instead of labels.errors.network) */
    L: labels,
    /** Loading state */
    isLoading,
    /** Error state */
    error,
    /** Refetch labels (useful after language change) */
    refetch,
  };
};
