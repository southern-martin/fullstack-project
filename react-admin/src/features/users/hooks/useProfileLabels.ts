import { useLabels } from '../../../shared/hooks/useLabels';
import { PROFILE_LABELS, ProfileLabels } from '../constants/profile-labels';

/**
 * Hook for accessing translated Profile module labels
 * 
 * This is a convenience wrapper around the generic useLabels hook,
 * pre-configured with Profile module labels.
 * 
 * Features:
 * - Type-safe access to all Profile labels
 * - Automatic translation based on current language
 * - English bypass (no API call for English)
 * - Caching via React Query
 * - Graceful fallback to English
 * 
 * @returns {Object} Translated labels and loading state
 * 
 * @example
 * ```typescript
 * const { labels: L, isLoading } = useProfileLabels();
 * 
 * return (
 *   <div>
 *     <h3>{L.sections.basicInfo}</h3>
 *     <label>{L.fields.bio}</label>
 *     <button>{L.actions.save}</button>
 *   </div>
 * );
 * ```
 */
export const useProfileLabels = () => {
  const { labels, isLoading, error, refetch } = useLabels<ProfileLabels>(
    PROFILE_LABELS,
    'profile'
  );

  return {
    /** Translated labels - access via L.sections.basicInfo, L.actions.save, etc. */
    labels,
    /** Short alias for labels (L.fields.bio instead of labels.fields.bio) */
    L: labels,
    /** Loading state */
    isLoading,
    /** Error state */
    error,
    /** Refetch labels (useful after language change) */
    refetch,
  };
};
