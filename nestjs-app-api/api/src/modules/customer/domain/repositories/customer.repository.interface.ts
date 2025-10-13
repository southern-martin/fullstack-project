import { Customer } from '../entities/customer.entity';
import { PaginationDto } from '../../../../shared/dto';

/**
 * CustomerRepositoryInterface
 * 
 * This interface defines the contract for customer data access operations.
 * It abstracts the data persistence layer and allows for different implementations
 * (TypeORM, MongoDB, etc.) without affecting the business logic.
 */
export interface CustomerRepositoryInterface {
  /**
   * Creates a new customer in the repository.
   * @param customer The customer entity to create.
   * @returns Promise<Customer> The created customer with generated ID.
   */
  create(customer: Customer): Promise<Customer>;

  /**
   * Finds a customer by their ID.
   * @param id The customer ID.
   * @returns Promise<Customer | null> The customer if found, null otherwise.
   */
  findById(id: number): Promise<Customer | null>;

  /**
   * Finds a customer by their email address.
   * @param email The customer email address.
   * @returns Promise<Customer | null> The customer if found, null otherwise.
   */
  findByEmail(email: string): Promise<Customer | null>;

  /**
   * Finds all customers with pagination.
   * @param paginationDto Pagination parameters.
   * @returns Promise<{ customers: Customer[]; total: number }> Paginated customers and total count.
   */
  findAll(paginationDto: PaginationDto): Promise<{ customers: Customer[]; total: number }>;

  /**
   * Finds all active customers.
   * @returns Promise<Customer[]> Array of active customers.
   */
  findActive(): Promise<Customer[]>;

  /**
   * Finds customers by search criteria.
   * @param searchTerm Search term to match against name or email.
   * @param paginationDto Pagination parameters.
   * @returns Promise<{ customers: Customer[]; total: number }> Paginated search results.
   */
  search(searchTerm: string, paginationDto: PaginationDto): Promise<{ customers: Customer[]; total: number }>;

  /**
   * Updates an existing customer.
   * @param id The customer ID.
   * @param customer Partial customer data to update.
   * @returns Promise<Customer> The updated customer.
   */
  update(id: number, customer: Partial<Customer>): Promise<Customer>;

  /**
   * Deletes a customer by ID.
   * @param id The customer ID.
   * @returns Promise<void>
   */
  delete(id: number): Promise<void>;

  /**
   * Checks if a customer exists by email.
   * @param email The customer email address.
   * @returns Promise<boolean> True if customer exists, false otherwise.
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Gets the total count of customers.
   * @returns Promise<number> Total number of customers.
   */
  count(): Promise<number>;

  /**
   * Gets the count of active customers.
   * @returns Promise<number> Number of active customers.
   */
  countActive(): Promise<number>;

  /**
   * Finds customers by date range.
   * @param startDate Start date for the range.
   * @param endDate End date for the range.
   * @returns Promise<Customer[]> Customers created within the date range.
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<Customer[]>;

  /**
   * Finds customers by location (city, state, country).
   * @param location Location criteria.
   * @returns Promise<Customer[]> Customers matching the location criteria.
   */
  findByLocation(location: { city?: string; state?: string; country?: string }): Promise<Customer[]>;
}
