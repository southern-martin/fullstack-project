import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";
import { BaseEntity } from "../core/base-entity";
import { PaginationDto } from "../dto/pagination.dto";

/**
 * Base Repository Interface
 */
export interface IBaseRepository<T extends BaseEntity> {
  findById(id: number): Promise<T | null>;
  findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ entities: T[]; total: number }>;
  create(entity: Partial<T>): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
  exists(id: number): Promise<boolean>;
  count(): Promise<number>;
}

/**
 * Base Repository
 *
 * Abstract base repository providing common database operations
 * following Clean Architecture principles.
 */
export abstract class BaseRepository<T extends BaseEntity>
  implements IBaseRepository<T>
{
  constructor(protected repository: Repository<T>) {}

  /**
   * Find entity by ID
   */
  async findById(id: number): Promise<T | null> {
    try {
      return await this.repository.findOne({
        where: { id } as FindOptionsWhere<T>,
      });
    } catch (error) {
      throw new Error(`Failed to find entity by ID ${id}: ${error}`);
    }
  }

  /**
   * Find all entities with pagination and search
   */
  async findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ entities: T[]; total: number }> {
    try {
      const options: FindManyOptions<T> = {};

      // Apply pagination
      if (pagination) {
        options.skip = pagination.getOffset();
        options.take = pagination.getLimit();
      }

      // Apply sorting
      if (pagination?.hasSorting()) {
        options.order = {
          [pagination.getSortBy()!]: pagination.getSortOrder(),
        } as any;
      }

      // Apply search
      if (search && pagination?.hasSearch()) {
        options.where = this.buildSearchConditions(search);
      }

      const [entities, total] = await this.repository.findAndCount(options);
      return { entities, total };
    } catch (error) {
      throw new Error(`Failed to find entities: ${error}`);
    }
  }

  /**
   * Create new entity
   */
  async create(entity: Partial<T>): Promise<T> {
    try {
      const newEntity = this.repository.create(entity as any);
      const savedEntity = await this.repository.save(newEntity);
      return Array.isArray(savedEntity) ? savedEntity[0] : savedEntity;
    } catch (error) {
      throw new Error(`Failed to create entity: ${error}`);
    }
  }

  /**
   * Update existing entity
   */
  async update(id: number, entity: Partial<T>): Promise<T | null> {
    try {
      const existingEntity = await this.findById(id);
      if (!existingEntity) {
        return null;
      }

      Object.assign(existingEntity, entity);
      return await this.repository.save(existingEntity);
    } catch (error) {
      throw new Error(`Failed to update entity with ID ${id}: ${error}`);
    }
  }

  /**
   * Delete entity by ID
   */
  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      throw new Error(`Failed to delete entity with ID ${id}: ${error}`);
    }
  }

  /**
   * Check if entity exists
   */
  async exists(id: number): Promise<boolean> {
    try {
      const count = await this.repository.count({
        where: { id } as FindOptionsWhere<T>,
      });
      return count > 0;
    } catch (error) {
      throw new Error(
        `Failed to check if entity exists with ID ${id}: ${error}`
      );
    }
  }

  /**
   * Count total entities
   */
  async count(): Promise<number> {
    try {
      return await this.repository.count();
    } catch (error) {
      throw new Error(`Failed to count entities: ${error}`);
    }
  }

  /**
   * Find entities by criteria
   */
  async findBy(criteria: FindOptionsWhere<T>): Promise<T[]> {
    try {
      return await this.repository.find({ where: criteria });
    } catch (error) {
      throw new Error(`Failed to find entities by criteria: ${error}`);
    }
  }

  /**
   * Find one entity by criteria
   */
  async findOneBy(criteria: FindOptionsWhere<T>): Promise<T | null> {
    try {
      return await this.repository.findOne({ where: criteria });
    } catch (error) {
      throw new Error(`Failed to find entity by criteria: ${error}`);
    }
  }

  /**
   * Save entity (create or update)
   */
  async save(entity: T): Promise<T> {
    try {
      return await this.repository.save(entity);
    } catch (error) {
      throw new Error(`Failed to save entity: ${error}`);
    }
  }

  /**
   * Soft delete entity (if soft delete is implemented)
   */
  async softDelete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.softDelete(id);
      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      throw new Error(`Failed to soft delete entity with ID ${id}: ${error}`);
    }
  }

  /**
   * Restore soft deleted entity
   */
  async restore(id: number): Promise<boolean> {
    try {
      const result = await this.repository.restore(id);
      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      throw new Error(`Failed to restore entity with ID ${id}: ${error}`);
    }
  }

  /**
   * Build search conditions (to be implemented by subclasses)
   */
  protected abstract buildSearchConditions(
    search: string
  ): FindOptionsWhere<T> | FindOptionsWhere<T>[];

  /**
   * Get repository instance
   */
  getRepository(): Repository<T> {
    return this.repository;
  }

  /**
   * Execute raw query
   */
  async executeRawQuery(query: string, parameters?: any[]): Promise<any> {
    try {
      return await this.repository.query(query, parameters);
    } catch (error) {
      throw new Error(`Failed to execute raw query: ${error}`);
    }
  }

  /**
   * Start transaction
   */
  async startTransaction(): Promise<void> {
    try {
      await this.repository.manager.query("START TRANSACTION");
    } catch (error) {
      throw new Error(`Failed to start transaction: ${error}`);
    }
  }

  /**
   * Commit transaction
   */
  async commitTransaction(): Promise<void> {
    try {
      await this.repository.manager.query("COMMIT");
    } catch (error) {
      throw new Error(`Failed to commit transaction: ${error}`);
    }
  }

  /**
   * Rollback transaction
   */
  async rollbackTransaction(): Promise<void> {
    try {
      await this.repository.manager.query("ROLLBACK");
    } catch (error) {
      throw new Error(`Failed to rollback transaction: ${error}`);
    }
  }
}
