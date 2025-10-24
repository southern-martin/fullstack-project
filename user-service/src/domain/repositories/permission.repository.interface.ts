import { Permission } from "../entities/permission.entity";

/**
 * Permission Repository Interface
 * Defines the contract for permission data access
 * Following Clean Architecture - domain layer defines interfaces
 */
export interface PermissionRepositoryInterface {
  /**
   * Find all permissions
   */
  findAll(): Promise<Permission[]>;

  /**
   * Find permission by ID
   */
  findById(id: number): Promise<Permission | null>;

  /**
   * Find permission by name
   */
  findByName(name: string): Promise<Permission | null>;

  /**
   * Find permissions by category
   */
  findByCategory(category: string): Promise<Permission[]>;

  /**
   * Find permissions by IDs
   */
  findByIds(ids: number[]): Promise<Permission[]>;

  /**
   * Find permissions by names
   */
  findByNames(names: string[]): Promise<Permission[]>;

  /**
   * Get all permission categories
   */
  getCategories(): Promise<string[]>;

  /**
   * Create a new permission
   */
  create(permission: Permission): Promise<Permission>;

  /**
   * Update a permission
   */
  update(id: number, permission: Partial<Permission>): Promise<Permission>;

  /**
   * Delete a permission
   */
  delete(id: number): Promise<void>;

  /**
   * Count total permissions
   */
  count(): Promise<number>;
}
