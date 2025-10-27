import { Injectable, Logger } from "@nestjs/common";
import { RedisCacheService } from "../cache/redis-cache.service";
import { PaginationDto } from "../dto/pagination.dto";

/**
 * Base TypeORM Repository with built-in caching support
 * Eliminates code duplication across all service repositories
 *
 * Uses type erasure for repository parameter to avoid TypeORM version conflicts
 * across package boundaries.
 *
 * @template TDomain - Domain entity type (Customer, Carrier, etc.)
 * @template TTypeOrm - TypeORM entity type (must have id property)
 *
 * @example
 * export class CustomerRepository extends BaseTypeOrmRepository<
 *   Customer,
 *   CustomerTypeOrmEntity
 * > implements CustomerRepositoryInterface {
 *   constructor(
 *     @InjectRepository(CustomerTypeOrmEntity)
 *     repository: Repository<CustomerTypeOrmEntity>,
 *     @Inject(RedisCacheService)
 *     cacheService: RedisCacheService
 *   ) {
 *     super(repository, cacheService, 'customers');
 *   }
 *
 *   protected toDomainEntity(entity: CustomerTypeOrmEntity): Customer {
 *     // Mapping logic
 *   }
 *
 *   protected toTypeOrmEntity(domain: Customer): Partial<CustomerTypeOrmEntity> {
 *     // Mapping logic
 *   }
 * }
 */
@Injectable()
export abstract class BaseTypeOrmRepository<
  TDomain,
  TTypeOrm extends { id?: number }
> {
  protected readonly logger: Logger;

  constructor(
    // Use 'any' to avoid TypeORM type conflicts between shared package and services
    protected readonly repository: any,
    protected readonly cacheService: RedisCacheService,
    protected readonly cacheKeyPrefix: string,
    protected readonly cacheTTL: number = 300 // 5 minutes default
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Convert TypeORM entity to domain entity
   * Must be implemented by concrete repositories
   */
  protected abstract toDomainEntity(entity: TTypeOrm): TDomain;

  /**
   * Convert domain entity to TypeORM entity
   * Must be implemented by concrete repositories
   */
  protected abstract toTypeOrmEntity(domain: TDomain): Partial<TTypeOrm>;

  /**
   * Find entity by ID
   * No caching for individual entity retrieval (can be overridden if needed)
   */
  async findById(id: number): Promise<TDomain | null> {
    const entity = await this.repository.findOne({ where: { id } as any });
    return entity ? this.toDomainEntity(entity) : null;
  }

  /**
   * Create new entity
   * Invalidates list cache after creation
   */
  async create(domain: TDomain): Promise<TDomain> {
    const entity = this.toTypeOrmEntity(domain);
    const savedEntity = await this.repository.save(entity as any);
    await this.invalidateListCache();
    return this.toDomainEntity(savedEntity);
  }

  /**
   * Update existing entity
   * Invalidates list cache after update
   */
  async update(id: number, domain: Partial<TDomain>): Promise<TDomain> {
    await this.repository.update(id, domain as any);
    await this.invalidateListCache();
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new Error(`Entity with id ${id} not found after update`);
    }
    return this.toDomainEntity(entity);
  }

  /**
   * Delete entity by ID
   * Invalidates list cache after deletion
   */
  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
    await this.invalidateListCache();
  }

  /**
   * Find all entities with pagination and optional search
   * Implements caching for list queries
   *
   * @param pagination - Page and limit parameters
   * @param search - Optional search term
   * @returns Paginated result with entities and total count
   */
  protected async findAllWithCache(
    pagination?: PaginationDto,
    search?: string,
    queryBuilder?: (qb: any, search: string) => void
  ): Promise<{ entities: TDomain[]; total: number }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const searchKey = search ? search.trim().toLowerCase() : "all";
    const cacheKey = `list:${page}:${limit}:${searchKey}`;

    // Try cache first
    const cached = await this.getCached<{ entities: TDomain[]; total: number }>(
      cacheKey
    );
    if (cached) {
      this.logger.debug(`Cache HIT: ${this.cacheKeyPrefix}:${cacheKey}`);
      return cached;
    }

    this.logger.debug(`Cache MISS: ${this.cacheKeyPrefix}:${cacheKey}`);

    // Query database
    const qb = this.repository.createQueryBuilder("entity");

    // Apply search if provided and queryBuilder callback exists
    if (search && queryBuilder) {
      queryBuilder(qb, search);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    qb.skip(offset).take(limit);

    const [entities, total] = await qb.getManyAndCount();
    const domainEntities = entities.map((entity) =>
      this.toDomainEntity(entity)
    );

    const result = { entities: domainEntities, total };

    // Store in cache
    await this.setCache(cacheKey, result);

    return result;
  }

  /**
   * Invalidate all list caches for this repository
   */
  protected async invalidateListCache(): Promise<void> {
    await this.cacheService.invalidatePattern(`${this.cacheKeyPrefix}:list:*`);
    this.logger.debug(`Cache invalidated: ${this.cacheKeyPrefix}:list:*`);
  }

  /**
   * Get value from cache with repository prefix
   */
  protected async getCached<T>(key: string): Promise<T | null> {
    return this.cacheService.get<T>(`${this.cacheKeyPrefix}:${key}`);
  }

  /**
   * Set value in cache with repository prefix and TTL
   */
  protected async setCache<T>(
    key: string,
    value: T,
    ttl?: number
  ): Promise<void> {
    await this.cacheService.set(`${this.cacheKeyPrefix}:${key}`, value, {
      ttl: ttl || this.cacheTTL,
    });
  }

  /**
   * Delete specific cache key
   */
  protected async deleteCache(key: string): Promise<void> {
    await this.cacheService.del(`${this.cacheKeyPrefix}:${key}`);
  }

  /**
   * Invalidate cache by pattern
   */
  protected async invalidateCachePattern(pattern: string): Promise<void> {
    await this.cacheService.invalidatePattern(
      `${this.cacheKeyPrefix}:${pattern}`
    );
  }
}
