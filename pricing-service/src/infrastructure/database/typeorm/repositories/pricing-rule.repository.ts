import { PricingRule } from "@/domain/entities/pricing-rule.entity";
import { PricingRuleRepositoryInterface } from "@/domain/repositories/pricing-rule.repository.interface";
import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto, RedisCacheService, BaseTypeOrmRepository } from "@shared/infrastructure";
import { Repository } from "typeorm";
import { PricingRuleTypeOrmEntity } from "../entities/pricing-rule.typeorm.entity";

/**
 * Pricing Rule Repository Implementation
 * Extends BaseTypeOrmRepository for common CRUD and caching operations
 */
@Injectable()
export class PricingRuleRepository 
  extends BaseTypeOrmRepository<PricingRule, PricingRuleTypeOrmEntity>
  implements PricingRuleRepositoryInterface 
{
  constructor(
    @InjectRepository(PricingRuleTypeOrmEntity)
    repository: Repository<PricingRuleTypeOrmEntity>,
    @Inject(RedisCacheService)
    cacheService: RedisCacheService
  ) {
    super(repository, cacheService, 'pricing', 300); // 5 min TTL
  }

  /**
   * Find all pricing rules with pagination and search
   * Uses base class findAllWithCache with custom query builder
   */
  async findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ pricingRules: PricingRule[]; total: number }> {
    const paginationDto = pagination || Object.assign(new PaginationDto(), { page: 1, limit: 20 });
    const result = await this.findAllWithCache(
      paginationDto,
      search,
      (queryBuilder, searchTerm) => {
        if (searchTerm) {
          queryBuilder.where(
            "pricingRule.name ILIKE :search OR pricingRule.description ILIKE :search",
            { search: `%${searchTerm}%` }
          );
        }
        // Always sort by newest first for consistent pagination
        queryBuilder.orderBy("pricingRule.createdAt", "DESC").addOrderBy("pricingRule.id", "DESC");
      }
    );
    return { pricingRules: result.entities, total: result.total };
  }

  /**
   * Search pricing rules (delegates to findAll)
   */
  async search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ pricingRules: PricingRule[]; total: number }> {
    return this.findAll(pagination, searchTerm);
  }

  /**
   * Find active pricing rules only
   */
  async findActive(): Promise<PricingRule[]> {
    const entities = await this.repository.find({ where: { isActive: true } });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Find pricing rules by specific conditions
   * Business-specific query with JSON extraction
   */
  async findByConditions(conditions: any): Promise<PricingRule[]> {
    const queryBuilder = this.repository.createQueryBuilder("pricingRule");

    queryBuilder.where("pricingRule.isActive = :isActive", { isActive: true });

    if (conditions.carrierId) {
      queryBuilder.andWhere(
        "JSON_EXTRACT(pricingRule.conditions, '$.carrierId') = :carrierId",
        {
          carrierId: conditions.carrierId,
        }
      );
    }

    if (conditions.serviceType) {
      queryBuilder.andWhere(
        "JSON_EXTRACT(pricingRule.conditions, '$.serviceType') = :serviceType",
        {
          serviceType: conditions.serviceType,
        }
      );
    }

    if (conditions.originCountry) {
      queryBuilder.andWhere(
        "JSON_EXTRACT(pricingRule.conditions, '$.originCountry') = :originCountry",
        {
          originCountry: conditions.originCountry,
        }
      );
    }

    if (conditions.destinationCountry) {
      queryBuilder.andWhere(
        "JSON_EXTRACT(pricingRule.conditions, '$.destinationCountry') = :destinationCountry",
        {
          destinationCountry: conditions.destinationCountry,
        }
      );
    }

    if (conditions.customerType) {
      queryBuilder.andWhere(
        "JSON_EXTRACT(pricingRule.conditions, '$.customerType') = :customerType",
        {
          customerType: conditions.customerType,
        }
      );
    }

    queryBuilder.orderBy("pricingRule.priority", "DESC");

    const entities = await queryBuilder.getMany();
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Count all pricing rules
   */
  async count(): Promise<number> {
    return this.repository.count();
  }

  /**
   * Count only active pricing rules
   */
  async countActive(): Promise<number> {
    return this.repository.count({ where: { isActive: true } });
  }

  /**
   * Find pricing rules with pagination (delegates to findAll)
   */
  async findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ pricingRules: PricingRule[]; total: number }> {
    const pagination = Object.assign(new PaginationDto(), { page, limit });
    return this.findAll(pagination, search);
  }

  /**
   * Map TypeORM entity to domain entity
   */
  protected toDomainEntity(entity: PricingRuleTypeOrmEntity): PricingRule {
    return new PricingRule({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      conditions: entity.conditions,
      pricing: entity.pricing,
      priority: entity.priority,
      validFrom: entity.validFrom,
      validTo: entity.validTo,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  /**
   * Map domain entity to TypeORM entity
   */
  protected toTypeOrmEntity(pricingRule: PricingRule): Partial<PricingRuleTypeOrmEntity> {
    return {
      id: pricingRule.id,
      name: pricingRule.name,
      description: pricingRule.description,
      isActive: pricingRule.isActive,
      conditions: pricingRule.conditions,
      pricing: pricingRule.pricing,
      priority: pricingRule.priority,
      validFrom: pricingRule.validFrom,
      validTo: pricingRule.validTo,
      createdAt: pricingRule.createdAt,
      updatedAt: pricingRule.updatedAt,
    };
  }
}
