import { PricingRule } from "@/domain/entities/pricing-rule.entity";
import { PricingRuleRepositoryInterface } from "@/domain/repositories/pricing-rule.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "@shared/infrastructure";
import { Repository } from "typeorm";
import { PricingRuleTypeOrmEntity } from "../entities/pricing-rule.typeorm.entity";

@Injectable()
export class PricingRuleRepository implements PricingRuleRepositoryInterface {
  constructor(
    @InjectRepository(PricingRuleTypeOrmEntity)
    private readonly repository: Repository<PricingRuleTypeOrmEntity>
  ) {}

  async create(pricingRule: PricingRule): Promise<PricingRule> {
    const entity = this.toTypeOrmEntity(pricingRule);
    const savedEntity = await this.repository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async findById(id: number): Promise<PricingRule | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ pricingRules: PricingRule[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder("pricingRule");

    if (search) {
      queryBuilder.where(
        "pricingRule.name ILIKE :search OR pricingRule.description ILIKE :search",
        { search: `%${search}%` }
      );
    }

    // Always sort by newest first for consistent pagination
    queryBuilder.orderBy("pricingRule.createdAt", "DESC").addOrderBy("pricingRule.id", "DESC");

    if (pagination) {
      queryBuilder
        .skip((pagination.page - 1) * pagination.limit)
        .take(pagination.limit);
    }

    const [entities, total] = await queryBuilder.getManyAndCount();
    const pricingRules = entities.map((entity) => this.toDomainEntity(entity));
    return { pricingRules, total };
  }

  async search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ pricingRules: PricingRule[]; total: number }> {
    return this.findAll(pagination, searchTerm);
  }

  async update(
    id: number,
    pricingRuleData: Partial<PricingRule>
  ): Promise<PricingRule> {
    await this.repository.update(id, pricingRuleData);
    const updatedPricingRule = await this.findById(id);
    if (!updatedPricingRule) {
      throw new Error("PricingRule not found after update");
    }
    return updatedPricingRule;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findActive(): Promise<PricingRule[]> {
    const entities = await this.repository.find({ where: { isActive: true } });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

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

  async count(): Promise<number> {
    return this.repository.count();
  }

  async countActive(): Promise<number> {
    return this.repository.count({ where: { isActive: true } });
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ pricingRules: PricingRule[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder("pricingRule");

    if (search) {
      queryBuilder.where(
        "pricingRule.name ILIKE :search OR pricingRule.description ILIKE :search",
        { search: `%${search}%` }
      );
    }

    const [entities, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const pricingRules = entities.map((entity) => this.toDomainEntity(entity));

    return { pricingRules, total };
  }

  private toDomainEntity(entity: PricingRuleTypeOrmEntity): PricingRule {
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

  private toTypeOrmEntity(pricingRule: PricingRule): PricingRuleTypeOrmEntity {
    const entity = new PricingRuleTypeOrmEntity();
    entity.id = pricingRule.id;
    entity.name = pricingRule.name;
    entity.description = pricingRule.description;
    entity.isActive = pricingRule.isActive;
    entity.conditions = pricingRule.conditions;
    entity.pricing = pricingRule.pricing;
    entity.priority = pricingRule.priority;
    entity.validFrom = pricingRule.validFrom;
    entity.validTo = pricingRule.validTo;
    entity.createdAt = pricingRule.createdAt;
    entity.updatedAt = pricingRule.updatedAt;
    return entity;
  }
}
