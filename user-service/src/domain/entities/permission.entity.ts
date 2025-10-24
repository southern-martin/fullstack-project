/**
 * Permission Domain Entity
 * Represents a permission in the system following Clean Architecture principles
 * This is a core domain entity independent of any framework
 */
export class Permission {
  id?: number;
  name: string;
  description?: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<Permission>) {
    Object.assign(this, partial);
  }

  /**
   * Validates if the permission has required fields
   */
  validate(): boolean {
    return !!(this.name && this.category);
  }

  /**
   * Gets the display name of the permission
   */
  getDisplayName(): string {
    return this.name
      .split('.')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Checks if permission belongs to a specific category
   */
  isInCategory(category: string): boolean {
    return this.category === category;
  }
}
