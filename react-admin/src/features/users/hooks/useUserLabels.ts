import { useLabels } from '../../../shared/hooks/useLabels';
import { UserLabels, userLabels } from '../labels/user-labels';

/**
 * User Module Labels Hook
 * 
 * This hook provides translated labels for the Users module.
 * It wraps the generic useLabels hook with user-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full UserLabels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = useUserLabels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{L.page.title}</h1>
 *     <button>{L.buttons.createUser}</button>
 *   </div>
 * );
 */
export const useUserLabels = () => {
  const result = useLabels<UserLabels>(userLabels, 'user');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
