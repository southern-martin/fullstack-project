import { PriceCalculation } from '../entities/price-calculation.entity';
import { PaginationDto } from '../../../../shared/dto';

/**
 * PriceCalculationRepositoryInterface
 * 
 * This interface defines the contract for price calculation data access operations.
 * It abstracts the data persistence layer and allows for different implementations
 * without affecting the business logic.
 */
export interface PriceCalculationRepositoryInterface {
  /**
   * Creates a new price calculation record in the repository.
   * @param priceCalculation The price calculation entity to create.
   * @returns Promise<PriceCalculation> The created price calculation with generated ID.
   */
  create(priceCalculation: PriceCalculation): Promise<PriceCalculation>;

  /**
   * Finds a price calculation by its ID.
   * @param id The price calculation ID.
   * @returns Promise<PriceCalculation | null> The price calculation if found, null otherwise.
   */
  findById(id: number): Promise<PriceCalculation | null>;

  /**
   * Finds a price calculation by request ID.
   * @param requestId The request ID.
   * @returns Promise<PriceCalculation | null> The price calculation if found, null otherwise.
   */
  findByRequestId(requestId: string): Promise<PriceCalculation | null>;

  /**
   * Finds all price calculations with pagination.
   * @param paginationDto Pagination parameters.
   * @returns Promise<{ priceCalculations: PriceCalculation[]; total: number }> Paginated price calculations and total count.
   */
  findAll(paginationDto: PaginationDto): Promise<{ priceCalculations: PriceCalculation[]; total: number }>;

  /**
   * Finds price calculations by customer ID.
   * @param customerId The customer ID.
   * @param paginationDto Pagination parameters.
   * @returns Promise<{ priceCalculations: PriceCalculation[]; total: number }> Paginated price calculations for the customer.
   */
  findByCustomerId(customerId: number, paginationDto: PaginationDto): Promise<{ priceCalculations: PriceCalculation[]; total: number }>;

  /**
   * Finds price calculations by date range.
   * @param startDate Start date for the range.
   * @param endDate End date for the range.
   * @param paginationDto Pagination parameters.
   * @returns Promise<{ priceCalculations: PriceCalculation[]; total: number }> Paginated price calculations within the date range.
   */
  findByDateRange(startDate: Date, endDate: Date, paginationDto: PaginationDto): Promise<{ priceCalculations: PriceCalculation[]; total: number }>;

  /**
   * Searches price calculations by search criteria.
   * @param searchTerm Search term to match against request ID or customer data.
   * @param paginationDto Pagination parameters.
   * @returns Promise<{ priceCalculations: PriceCalculation[]; total: number }> Paginated search results.
   */
  search(searchTerm: string, paginationDto: PaginationDto): Promise<{ priceCalculations: PriceCalculation[]; total: number }>;

  /**
   * Updates an existing price calculation.
   * @param id The price calculation ID.
   * @param priceCalculation Partial price calculation data to update.
   * @returns Promise<PriceCalculation> The updated price calculation.
   */
  update(id: number, priceCalculation: Partial<PriceCalculation>): Promise<PriceCalculation>;

  /**
   * Deletes a price calculation by ID.
   * @param id The price calculation ID.
   * @returns Promise<void>
   */
  delete(id: number): Promise<void>;

  /**
   * Gets the total count of price calculations.
   * @returns Promise<number> Total number of price calculations.
   */
  count(): Promise<number>;

  /**
   * Gets the count of price calculations for a specific customer.
   * @param customerId The customer ID.
   * @returns Promise<number> Number of price calculations for the customer.
   */
  countByCustomerId(customerId: number): Promise<number>;

  /**
   * Gets the count of cached price calculations.
   * @returns Promise<number> Number of cached price calculations.
   */
  countCached(): Promise<number>;

  /**
   * Finds price calculations by base price range.
   * @param minPrice Minimum base price.
   * @param maxPrice Maximum base price.
   * @param paginationDto Pagination parameters.
   * @returns Promise<{ priceCalculations: PriceCalculation[]; total: number }> Paginated price calculations within the price range.
   */
  findByPriceRange(minPrice: number, maxPrice: number, paginationDto: PaginationDto): Promise<{ priceCalculations: PriceCalculation[]; total: number }>;

  /**
   * Gets statistics for price calculations.
   * @param startDate Start date for statistics.
   * @param endDate End date for statistics.
   * @returns Promise<any> Statistics object with various metrics.
   */
  getStatistics(startDate: Date, endDate: Date): Promise<{
    totalCalculations: number;
    averageBasePrice: number;
    averageFinalPrice: number;
    averageDiscount: number;
    averageMarkup: number;
    averageCalculationTime: number;
    cacheHitRate: number;
  }>;

  /**
   * Deletes old price calculation records.
   * @param olderThan Date threshold for deletion.
   * @returns Promise<number> Number of records deleted.
   */
  deleteOldRecords(olderThan: Date): Promise<number>;
}
