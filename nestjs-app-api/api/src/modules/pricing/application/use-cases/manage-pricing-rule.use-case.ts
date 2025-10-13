import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PricingRule } from '../../domain/entities/pricing-rule.entity';
import { PricingRuleRepositoryInterface } from '../../domain/repositories/pricing-rule.repository.interface';
import { PricingDomainService } from '../../domain/services/pricing.domain.service';
import { PricingRuleCreatedEvent } from '../../domain/events/pricing-rule-created.event';
import { CreatePricingRuleDto } from '../dto/create-pricing-rule.dto';
import { PricingRuleResponseDto } from '../dto/pricing-rule-response.dto';
import { UpdatePricingRuleDto } from '../dto/update-pricing-rule.dto';
import { PaginationDto } from '../../../../shared/dto';

/**
 * ManagePricingRuleUseCase
 * 
 * This use case handles the creation, retrieval, update, and deletion of pricing rules.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
@Injectable()
export class ManagePricingRuleUseCase {
  constructor(
    private readonly pricingRuleRepository: PricingRuleRepositoryInterface,
    private readonly pricingDomainService: PricingDomainService
  ) {}

  /**
   * Creates a new pricing rule.
   * @param createPricingRuleDto The data for creating the pricing rule.
   * @returns Created pricing rule response
   */
  async create(createPricingRuleDto: CreatePricingRuleDto): Promise<PricingRuleResponseDto> {
    // 1. Validate input using domain service
    const validation = this.pricingDomainService.validatePricingRuleCreationData(createPricingRuleDto);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    // 2. Create pricing rule entity
    const pricingRule = new PricingRule();
    pricingRule.name = createPricingRuleDto.name;
    pricingRule.description = createPricingRuleDto.description;
    pricingRule.ruleType = createPricingRuleDto.ruleType;
    pricingRule.conditions = createPricingRuleDto.conditions;
    pricingRule.actions = createPricingRuleDto.actions;
    pricingRule.priority = createPricingRuleDto.priority ?? 0;
    pricingRule.isActive = createPricingRuleDto.isActive ?? true;
    pricingRule.validFrom = createPricingRuleDto.validFrom ? new Date(createPricingRuleDto.validFrom) : null;
    pricingRule.validUntil = createPricingRuleDto.validUntil ? new Date(createPricingRuleDto.validUntil) : null;
    pricingRule.metadata = createPricingRuleDto.metadata || {};

    // 3. Save pricing rule in repository
    const savedPricingRule = await this.pricingRuleRepository.create(pricingRule);

    // 4. Raise domain event
    const pricingRuleCreatedEvent = new PricingRuleCreatedEvent(savedPricingRule);
    // In a real application, you would publish this event to an event bus
    // this.eventBus.publish(pricingRuleCreatedEvent);

    // 5. Return response
    return PricingRuleResponseDto.fromDomain(savedPricingRule);
  }

  /**
   * Retrieves a pricing rule by its ID.
   * @param id The ID of the pricing rule.
   * @returns The pricing rule response DTO.
   * @throws NotFoundException if the pricing rule is not found.
   */
  async getById(id: number): Promise<PricingRuleResponseDto> {
    const pricingRule = await this.pricingRuleRepository.findById(id);
    if (!pricingRule) {
      throw new NotFoundException('Pricing rule not found');
    }
    return PricingRuleResponseDto.fromDomain(pricingRule);
  }

  /**
   * Retrieves all pricing rules with pagination.
   * @param paginationDto Pagination parameters.
   * @returns A paginated list of pricing rule response DTOs.
   */
  async getAll(paginationDto: PaginationDto): Promise<{ pricingRules: PricingRuleResponseDto[]; total: number }> {
    const result = await this.pricingRuleRepository.findAll(paginationDto);
    return {
      pricingRules: result.pricingRules.map(rule => PricingRuleResponseDto.fromDomain(rule)),
      total: result.total,
    };
  }

  /**
   * Retrieves all active pricing rules.
   * @returns A list of active pricing rule response DTOs.
   */
  async getActive(): Promise<PricingRuleResponseDto[]> {
    const pricingRules = await this.pricingRuleRepository.findActive();
    return pricingRules.map(rule => PricingRuleResponseDto.fromDomain(rule));
  }

  /**
   * Retrieves pricing rules by type.
   * @param ruleType The type of pricing rule.
   * @returns A list of pricing rule response DTOs of the specified type.
   */
  async getByType(ruleType: string): Promise<PricingRuleResponseDto[]> {
    const pricingRules = await this.pricingRuleRepository.findByType(ruleType);
    return pricingRules.map(rule => PricingRuleResponseDto.fromDomain(rule));
  }

  /**
   * Updates an existing pricing rule.
   * @param id The ID of the pricing rule to update.
   * @param updatePricingRuleDto The data for updating the pricing rule.
   * @returns Updated pricing rule response
   */
  async update(id: number, updatePricingRuleDto: UpdatePricingRuleDto): Promise<PricingRuleResponseDto> {
    // 1. Find existing pricing rule
    const existingPricingRule = await this.pricingRuleRepository.findById(id);
    if (!existingPricingRule) {
      throw new NotFoundException('Pricing rule not found');
    }

    // 2. Check if pricing rule can be edited
    if (!this.pricingDomainService.canEditPricingRule(existingPricingRule)) {
      throw new BadRequestException('Pricing rule cannot be edited at this time');
    }

    // 3. Validate update data using domain service
    const validation = this.pricingDomainService.validatePricingRuleUpdateData(updatePricingRuleDto);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    // 4. Update pricing rule in repository
    const updatedPricingRule = await this.pricingRuleRepository.update(id, updatePricingRuleDto);

    // 5. Return response
    return PricingRuleResponseDto.fromDomain(updatedPricingRule);
  }

  /**
   * Deletes a pricing rule.
   * @param id The ID of the pricing rule to delete.
   * @throws NotFoundException if the pricing rule is not found.
   * @throws BadRequestException if the pricing rule cannot be deleted due to business rules.
   */
  async delete(id: number): Promise<void> {
    // 1. Find existing pricing rule
    const existingPricingRule = await this.pricingRuleRepository.findById(id);
    if (!existingPricingRule) {
      throw new NotFoundException('Pricing rule not found');
    }

    // 2. Check if pricing rule can be deleted based on business rules
    // In a real application, you would check if the rule has been used in calculations
    const hasCalculations = false; // Placeholder
    if (!this.pricingDomainService.canDeletePricingRule(existingPricingRule, hasCalculations)) {
      throw new BadRequestException('Pricing rule cannot be deleted due to business rules');
    }

    // 3. Delete pricing rule from repository
    await this.pricingRuleRepository.delete(id);
  }
}
