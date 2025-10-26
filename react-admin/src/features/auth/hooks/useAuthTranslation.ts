import { useLabels } from '../../../shared/hooks/useLabels';
import { AuthLabels, authLabels } from '../labels/auth-labels';

/**
 * Authentication Module Labels Hook
 * 
 * This hook provides translated labels for the Authentication module.
 * It wraps the generic useLabels hook with auth-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full AuthLabels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = useAuthLabels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{L.page.signInTitle}</h1>
 *     <button>{L.buttons.signIn}</button>
 *   </div>
 * );
 */
export const useAuthLabels = () => {
  const result = useLabels<AuthLabels>(authLabels, 'auth');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
