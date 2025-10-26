import { Carrier } from "@/domain/entities/carrier.entity";
import { CarrierRepositoryInterface } from "@/domain/repositories/carrier.repository.interface";
import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto, RedisCacheService, BaseTypeOrmRepository } from "@shared/infrastructure";
import { Repository } from "typeorm";
import { CarrierTypeOrmEntity } from "../entities/carrier.typeorm.entity";

/**
 * Carrier Repository Implementation
 * Extends BaseTypeOrmRepository for common CRUD and caching operations
 */
@Injectable()
export class CarrierRepository 
  extends BaseTypeOrmRepository<Carrier, CarrierTypeOrmEntity>
  implements CarrierRepositoryInterface 
{
  constructor(
    @InjectRepository(CarrierTypeOrmEntity)
    repository: Repository<CarrierTypeOrmEntity>,
    @Inject(RedisCacheService)
    cacheService: RedisCacheService
  ) {
    super(repository, cacheService, 'carriers', 300); // 5 min TTL
  }

  /**
   * Find carrier by name
   * Business-specific query method
   */
  async findByName(name: string): Promise<Carrier | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  /**
   * Find all carriers with pagination and search
   * Uses base class findAllWithCache with custom query builder
   */
  async findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ carriers: Carrier[]; total: number }> {
    const paginationDto = pagination || Object.assign(new PaginationDto(), { page: 1, limit: 20 });
    const result = await this.findAllWithCache(
      paginationDto,
      search,
      (queryBuilder, searchTerm) => {
        if (searchTerm) {
          queryBuilder.where(
            "carrier.name ILIKE :search OR carrier.description ILIKE :search OR carrier.contactEmail ILIKE :search",
            { search: `%${searchTerm}%` }
          );
        }
        // Always sort by newest first for consistent pagination
        queryBuilder.orderBy("carrier.createdAt", "DESC").addOrderBy("carrier.id", "DESC");
      }
    );
    return { carriers: result.entities, total: result.total };
  }

  /**
   * Search carriers (delegates to findAll)
   */
  async search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ carriers: Carrier[]; total: number }> {
    return this.findAll(pagination, searchTerm);
  }

  /**
   * Find active carriers only
   */
  async findActive(): Promise<Carrier[]> {
    const entities = await this.repository.find({ where: { isActive: true } });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Count all carriers
   */
  async count(): Promise<number> {
    return this.repository.count();
  }

  /**
   * Count only active carriers
   */
  async countActive(): Promise<number> {
    return this.repository.count({ where: { isActive: true } });
  }

  /**
   * Find carriers with pagination (delegates to findAll)
   */
  async findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ carriers: Carrier[]; total: number }> {
    const pagination = Object.assign(new PaginationDto(), { page, limit });
    return this.findAll(pagination, search);
  }

  /**
   * Map TypeORM entity to domain entity
   */
  protected toDomainEntity(entity: CarrierTypeOrmEntity): Carrier {
    return new Carrier({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      contactEmail: entity.contactEmail,
      contactPhone: entity.contactPhone,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  /**
   * Map domain entity to TypeORM entity
   */
  protected toTypeOrmEntity(carrier: Carrier): Partial<CarrierTypeOrmEntity> {
    return {
      id: carrier.id,
      name: carrier.name,
      description: carrier.description,
      isActive: carrier.isActive,
      contactEmail: carrier.contactEmail,
      contactPhone: carrier.contactPhone,
      metadata: carrier.metadata,
      createdAt: carrier.createdAt,
      updatedAt: carrier.updatedAt,
    };
  }
}
