import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PricingRule } from "../../domain/entities/pricing-rule.entity";
import { PricingRuleRepositoryInterface } from "../../domain/repositories/pricing-rule.repository.interface";
import { PricingDomainService } from "../../domain/services/pricing.domain.service";
import { CreatePricingRuleDto } from "../dto/create-pricing-rule.dto";
import { PricingRuleResponseDto } from "../dto/pricing-rule-response.dto";
import { UpdatePricingRuleDto } from "../dto/update-pricing-rule.dto";

/**
 * Manage Pricing Rule Use Case
 * Application service that orchestrates pricing rule management
 * Follows Clean Architecture principles
 */
@Injectable()
export class ManagePricingRuleUseCase {
  constructor(
    @Inject("PricingRuleRepositoryInterface")
    private readonly pricingRuleRepository: PricingRuleRepositoryInterface,
    private readonly pricingDomainService: PricingDomainService
  ) {}

  /**
   * Creates a new pricing rule
   * @param createPricingRuleDto - Pricing rule creation data
   * @returns Created pricing rule response
   */
  async create(
    createPricingRuleDto: CreatePricingRuleDto
  ): Promise<PricingRuleResponseDto> {
    // 1. Validate input using domain service
    const validation =
      this.pricingDomainService.validatePricingRuleCreationData(
        createPricingRuleDto
      );
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 2. Create pricing rule entity
    const pricingRule = new PricingRule({
      name: createPricingRuleDto.name,
      description: createPricingRuleDto.description,
      isActive: createPricingRuleDto.isActive ?? true,
      conditions: createPricingRuleDto.conditions,
      pricing: createPricingRuleDto.pricing,
      priority: createPricingRuleDto.priority ?? 0,
      validFrom: createPricingRuleDto.validFrom
        ? new Date(createPricingRuleDto.validFrom)
        : undefined,
      validTo: createPricingRuleDto.validTo
        ? new Date(createPricingRuleDto.validTo)
        : undefined,
    });

    // 3. Save pricing rule in repository
    const savedRule = await this.pricingRuleRepository.create(pricingRule);

    // 4. Return response
    return this.mapToResponseDto(savedRule);
  }

  /**
   * Gets a pricing rule by ID
   * @param id - Pricing rule ID
   * @returns Pricing rule response
   */
  async getById(id: number): Promise<PricingRuleResponseDto> {
    const rule = await this.pricingRuleRepository.findById(id);
    if (!rule) {
      throw new NotFoundException("Pricing rule not found");
    }

    return this.mapToResponseDto(rule);
  }

  /**
   * Gets all pricing rules with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @param search - Search term
   * @returns Pricing rules and pagination info
   */
  async getAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    pricingRules: PricingRuleResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { pricingRules, total } =
      await this.pricingRuleRepository.findPaginated(page, limit, search);
    const totalPages = Math.ceil(total / limit);

    return {
      pricingRules: pricingRules.map((rule) => this.mapToResponseDto(rule)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Updates a pricing rule
   * @param id - Pricing rule ID
   * @param updatePricingRuleDto - Update data
   * @returns Updated pricing rule response
   */
  async update(
    id: number,
    updatePricingRuleDto: UpdatePricingRuleDto
  ): Promise<PricingRuleResponseDto> {
    // 1. Find existing rule
    const existingRule = await this.pricingRuleRepository.findById(id);
    if (!existingRule) {
      throw new NotFoundException("Pricing rule not found");
    }

    // 2. Prepare update data for validation
    const updateDataForValidation: Partial<PricingRule> = {
      ...updatePricingRuleDto,
      validFrom: updatePricingRuleDto.validFrom
        ? new Date(updatePricingRuleDto.validFrom)
        : undefined,
      validTo: updatePricingRuleDto.validTo
        ? new Date(updatePricingRuleDto.validTo)
        : undefined,
    };

    // 3. Validate update data using domain service
    const validation = this.pricingDomainService.validatePricingRuleUpdateData(
      updateDataForValidation
    );
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 4. Prepare update data
    const updateData: Partial<any> = {};

    if (updatePricingRuleDto.name !== undefined)
      updateData.name = updatePricingRuleDto.name;
    if (updatePricingRuleDto.description !== undefined)
      updateData.description = updatePricingRuleDto.description;
    if (updatePricingRuleDto.isActive !== undefined)
      updateData.isActive = updatePricingRuleDto.isActive;
    if (updatePricingRuleDto.conditions !== undefined)
      updateData.conditions = updatePricingRuleDto.conditions;
    if (updatePricingRuleDto.pricing !== undefined)
      updateData.pricing = updatePricingRuleDto.pricing;
    if (updatePricingRuleDto.priority !== undefined)
      updateData.priority = updatePricingRuleDto.priority;
    if (updatePricingRuleDto.validFrom !== undefined) {
      updateData.validFrom = updatePricingRuleDto.validFrom
        ? new Date(updatePricingRuleDto.validFrom)
        : null;
    }
    if (updatePricingRuleDto.validTo !== undefined) {
      updateData.validTo = updatePricingRuleDto.validTo
        ? new Date(updatePricingRuleDto.validTo)
        : null;
    }

    // 5. Update rule in repository
    const updatedRule = await this.pricingRuleRepository.update(id, updateData);

    // 6. Return response
    return this.mapToResponseDto(updatedRule);
  }

  /**
   * Deletes a pricing rule
   * @param id - Pricing rule ID
   */
  async delete(id: number): Promise<void> {
    // 1. Find existing rule
    const existingRule = await this.pricingRuleRepository.findById(id);
    if (!existingRule) {
      throw new NotFoundException("Pricing rule not found");
    }

    // 2. Check if rule can be deleted (business rule)
    // Note: In a real application, you would check if rule has been used in calculations
    const hasBeenUsed = false; // This would come from price calculation repository

    if (
      !this.pricingDomainService.canDeletePricingRule(existingRule, hasBeenUsed)
    ) {
      throw new BadRequestException(
        "Cannot delete pricing rule that has been used in calculations"
      );
    }

    // 3. Delete rule from repository
    await this.pricingRuleRepository.delete(id);
  }

  /**
   * Gets pricing rule count
   * @returns Pricing rule count
   */
  async getCount(): Promise<{ count: number }> {
    const count = await this.pricingRuleRepository.count();
    return { count };
  }

  /**
   * Maps pricing rule entity to response DTO
   * @param rule - Pricing rule entity
   * @returns Pricing rule response DTO
   */
  private mapToResponseDto(rule: any): PricingRuleResponseDto {
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description,
      isActive: rule.isActive,
      conditions: rule.conditions,
      pricing: rule.pricing,
      priority: rule.priority,
      validFrom: rule.validFrom,
      validTo: rule.validTo,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    };
  }
}
