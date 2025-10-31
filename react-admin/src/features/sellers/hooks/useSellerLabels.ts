import { useLabels } from '../../../shared/hooks/useLabels';
import { SellerLabels, sellerLabels } from '../labels/seller-labels';

/**
 * Seller Module Labels Hook
 * 
 * Provides translated labels for the Seller module.
 * Wraps the generic useLabels hook with module-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full SellerLabels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = useSellerLabels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{L.page.title}</h1>
 *     <button>{L.buttons.createSeller}</button>
 *   </div>
 * );
 */
export const useSellerLabels = () => {
  const result = useLabels<SellerLabels>(sellerLabels, 'seller');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
