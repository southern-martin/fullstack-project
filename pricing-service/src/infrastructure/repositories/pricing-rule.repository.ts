import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PricingRule } from "../../domain/entities/pricing-rule.entity";
import { PricingRuleRepositoryInterface } from "../../domain/repositories/pricing-rule.repository.interface";

@Injectable()
export class PricingRuleRepository implements PricingRuleRepositoryInterface {
  constructor(
    @InjectRepository(PricingRule)
    private readonly pricingRuleRepository: Repository<PricingRule>
  ) {}

  async create(pricingRule: PricingRule): Promise<PricingRule> {
    return await this.pricingRuleRepository.save(pricingRule);
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ pricingRules: PricingRule[]; total: number }> {
    const queryBuilder = this.pricingRuleRepository.createQueryBuilder("rule");

    if (search) {
      queryBuilder.where(
        "rule.name LIKE :search OR rule.description LIKE :search",
        { search: `%${search}%` }
      );
    }

    const [pricingRules, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("rule.priority", "DESC")
      .addOrderBy("rule.createdAt", "DESC")
      .getManyAndCount();

    return { pricingRules, total };
  }

  async findById(id: number): Promise<PricingRule | null> {
    return await this.pricingRuleRepository.findOne({ where: { id } });
  }

  async findActive(): Promise<PricingRule[]> {
    const now = new Date();
    return await this.pricingRuleRepository
      .createQueryBuilder("rule")
      .where("rule.isActive = :isActive", { isActive: true })
      .andWhere("(rule.validFrom IS NULL OR rule.validFrom <= :now)", { now })
      .andWhere("(rule.validTo IS NULL OR rule.validTo >= :now)", { now })
      .orderBy("rule.priority", "DESC")
      .getMany();
  }

  async findByConditions(conditions: any): Promise<PricingRule[]> {
    const now = new Date();
    const queryBuilder = this.pricingRuleRepository
      .createQueryBuilder("rule")
      .where("rule.isActive = :isActive", { isActive: true })
      .andWhere("(rule.validFrom IS NULL OR rule.validFrom <= :now)", { now })
      .andWhere("(rule.validTo IS NULL OR rule.validTo >= :now)", { now });

    // Apply condition filters
    if (conditions.carrierId) {
      queryBuilder.andWhere(
        "(rule.conditions->>'$.carrierId' IS NULL OR rule.conditions->>'$.carrierId' = :carrierId)",
        { carrierId: conditions.carrierId }
      );
    }

    if (conditions.serviceType) {
      queryBuilder.andWhere(
        "(rule.conditions->>'$.serviceType' IS NULL OR rule.conditions->>'$.serviceType' = :serviceType)",
        { serviceType: conditions.serviceType }
      );
    }

    if (conditions.weight) {
      queryBuilder.andWhere(
        "(rule.conditions->>'$.weightRange' IS NULL OR (rule.conditions->>'$.weightRange.min' IS NULL OR rule.conditions->>'$.weightRange.min' <= :weight) AND (rule.conditions->>'$.weightRange.max' IS NULL OR rule.conditions->>'$.weightRange.max' >= :weight))",
        { weight: conditions.weight }
      );
    }

    if (conditions.originCountry) {
      queryBuilder.andWhere(
        "(rule.conditions->>'$.originCountry' IS NULL OR rule.conditions->>'$.originCountry' = :originCountry)",
        { originCountry: conditions.originCountry }
      );
    }

    if (conditions.destinationCountry) {
      queryBuilder.andWhere(
        "(rule.conditions->>'$.destinationCountry' IS NULL OR rule.conditions->>'$.destinationCountry' = :destinationCountry)",
        { destinationCountry: conditions.destinationCountry }
      );
    }

    if (conditions.customerType) {
      queryBuilder.andWhere(
        "(rule.conditions->>'$.customerType' IS NULL OR rule.conditions->>'$.customerType' = :customerType)",
        { customerType: conditions.customerType }
      );
    }

    return await queryBuilder.orderBy("rule.priority", "DESC").getMany();
  }

  async update(
    id: number,
    pricingRule: Partial<PricingRule>
  ): Promise<PricingRule> {
    await this.pricingRuleRepository.update(id, pricingRule);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.pricingRuleRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.pricingRuleRepository.count();
  }
}




