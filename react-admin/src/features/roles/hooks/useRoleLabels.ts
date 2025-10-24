import { useLabels } from '../../../shared/hooks/useLabels';
import { roleLabels } from '../labels/role-labels';

/**
 * Role Module Labels Hook
 * 
 * This hook provides translated labels for the Roles module.
 * It wraps the generic useLabels hook with role-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full roleLabels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = useRoleLabels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{L.PAGE_TITLE}</h1>
 *     <button>{L.BUTTONS.CREATE_ROLE}</button>
 *   </div>
 * );
 */
export const useRoleLabels = () => {
  const result = useLabels(roleLabels, 'role');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
