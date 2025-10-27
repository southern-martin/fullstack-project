import { useLabels } from '../../../shared/hooks/useLabels';
import { CustomerLabels, customerLabels } from '../labels/customer-labels';

/**
 * Customer Module Labels Hook
 * 
 * Provides translated labels for the Customer module.
 * Wraps the generic useLabels hook with module-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full CustomerLabels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = useCustomerLabels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{L.page.title}</h1>
 *     <button>{L.buttons.add}</button>
 *     <p>{L.messages.createSuccess}</p>
 *   </div>
 * );
 */
export const useCustomerLabels = () => {
  const result = useLabels<CustomerLabels>(customerLabels, 'customer');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
