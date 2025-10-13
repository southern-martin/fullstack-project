import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { PricingRule } from '../../domain/entities/pricing-rule.entity';
import { PricingRuleRepositoryInterface } from '../../domain/repositories/pricing-rule.repository.interface';
import { PaginationDto } from '../../../../shared/dto';

/**
 * PricingRuleTypeOrmRepository
 * 
 * This class provides the concrete TypeORM implementation for the PricingRuleRepositoryInterface.
 * It handles all database operations for pricing rule entities.
 */
@Injectable()
export class PricingRuleTypeOrmRepository implements PricingRuleRepositoryInterface {
  constructor(
    @InjectRepository(PricingRule)
    private readonly pricingRuleRepository: Repository<PricingRule>
  ) {}

  async create(pricingRule: PricingRule): Promise<PricingRule> {
    return await this.pricingRuleRepository.save(pricingRule);
  }

  async findById(id: number): Promise<PricingRule | null> {
    return await this.pricingRuleRepository.findOne({ where: { id } });
  }

  async findAll(paginationDto: PaginationDto): Promise<{ pricingRules: PricingRule[]; total: number }> {
    const [pricingRules, total] = await this.pricingRuleRepository.findAndCount({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { priority: 'DESC', createdAt: 'DESC' },
    });

    return { pricingRules, total };
  }

  async findActive(): Promise<PricingRule[]> {
    const now = new Date();
    return await this.pricingRuleRepository.find({
      where: { 
        isActive: true,
        // Add date range conditions if needed
      },
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByType(ruleType: string): Promise<PricingRule[]> {
    return await this.pricingRuleRepository.find({
      where: { ruleType, isActive: true },
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
  }

  async findApplicable(inputData: any): Promise<PricingRule[]> {
    const now = new Date();
    const queryBuilder = this.pricingRuleRepository.createQueryBuilder('rule');
    
    // Base conditions
    queryBuilder.where('rule.isActive = :isActive', { isActive: true });
    
    // Date validity conditions
    queryBuilder.andWhere('(rule.validFrom IS NULL OR rule.validFrom <= :now)', { now });
    queryBuilder.andWhere('(rule.validUntil IS NULL OR rule.validUntil >= :now)', { now });

    // Rule-specific conditions
    if (inputData.customerType) {
      queryBuilder.andWhere(
        '(rule.ruleType != :customerTypeRule OR JSON_CONTAINS(rule.conditions->"$.customerType", :customerType))',
        { 
          customerTypeRule: 'CUSTOMER_TYPE',
          customerType: JSON.stringify(inputData.customerType)
        }
      );
    }

    if (inputData.quantity) {
      queryBuilder.andWhere(
        '(rule.ruleType != :quantityRule OR (rule.conditions->"$.minQuantity" IS NULL OR rule.conditions->"$.minQuantity" <= :quantity))',
        { 
          quantityRule: 'QUANTITY_BREAK',
          quantity: inputData.quantity
        }
      );
      queryBuilder.andWhere(
        '(rule.ruleType != :quantityRule OR (rule.conditions->"$.maxQuantity" IS NULL OR rule.conditions->"$.maxQuantity" >= :quantity))',
        { 
          quantityRule: 'QUANTITY_BREAK',
          quantity: inputData.quantity
        }
      );
    }

    return await queryBuilder
      .orderBy('rule.priority', 'DESC')
      .addOrderBy('rule.createdAt', 'DESC')
      .getMany();
  }

  async search(searchTerm: string, paginationDto: PaginationDto): Promise<{ pricingRules: PricingRule[]; total: number }> {
    const queryBuilder = this.pricingRuleRepository.createQueryBuilder('rule');
    
    queryBuilder.where(
      '(rule.name LIKE :searchTerm OR rule.description LIKE :searchTerm)',
      { searchTerm: `%${searchTerm}%` }
    );

    const [pricingRules, total] = await queryBuilder
      .skip((paginationDto.page - 1) * paginationDto.limit)
      .take(paginationDto.limit)
      .orderBy('rule.priority', 'DESC')
      .addOrderBy('rule.createdAt', 'DESC')
      .getManyAndCount();

    return { pricingRules, total };
  }

  async update(id: number, pricingRule: Partial<PricingRule>): Promise<PricingRule> {
    await this.pricingRuleRepository.update(id, pricingRule);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.pricingRuleRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.pricingRuleRepository.count();
  }

  async countActive(): Promise<number> {
    return await this.pricingRuleRepository.count({
      where: { isActive: true }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<PricingRule[]> {
    return await this.pricingRuleRepository.find({
      where: [
        {
          validFrom: Between(startDate, endDate),
          isActive: true,
        },
        {
          validUntil: Between(startDate, endDate),
          isActive: true,
        },
      ],
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByPriorityRange(minPriority: number, maxPriority: number): Promise<PricingRule[]> {
    return await this.pricingRuleRepository.find({
      where: {
        priority: Between(minPriority, maxPriority),
        isActive: true,
      },
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
  }
}
