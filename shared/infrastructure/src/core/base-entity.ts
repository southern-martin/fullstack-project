import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Base Entity
 *
 * This abstract class provides common fields for all entities.
 * It follows Clean Architecture principles by being framework-agnostic.
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Get the entity ID
   */
  getId(): number {
    return this.id;
  }

  /**
   * Get creation date
   */
  getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * Get last update date
   */
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  /**
   * Check if entity is new (not persisted)
   */
  isNew(): boolean {
    return !this.id;
  }

  /**
   * Get entity age in milliseconds
   */
  getAge(): number {
    return Date.now() - this.createdAt.getTime();
  }

  /**
   * Get time since last update in milliseconds
   */
  getTimeSinceUpdate(): number {
    return Date.now() - this.updatedAt.getTime();
  }
}
