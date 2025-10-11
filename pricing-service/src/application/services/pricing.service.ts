import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { randomUUID } from "crypto";
import { PriceCalculation } from "../../domain/entities/price-calculation.entity";
import { PricingRule } from "../../domain/entities/pricing-rule.entity";
import { PriceCalculationRepositoryInterface } from "../../domain/repositories/price-calculation.repository.interface";
import { PricingRuleRepositoryInterface } from "../../domain/repositories/pricing-rule.repository.interface";
import { CalculatePriceDto } from "../dto/calculate-price.dto";
import { CreatePricingRuleDto } from "../dto/create-pricing-rule.dto";
import { PriceCalculationResponseDto } from "../dto/price-calculation-response.dto";
import { PricingRuleResponseDto } from "../dto/pricing-rule-response.dto";
import { UpdatePricingRuleDto } from "../dto/update-pricing-rule.dto";

@Injectable()
export class PricingService {
  constructor(
    @Inject("PricingRuleRepositoryInterface")
    private readonly pricingRuleRepository: PricingRuleRepositoryInterface,
    @Inject("PriceCalculationRepositoryInterface")
    private readonly priceCalculationRepository: PriceCalculationRepositoryInterface
  ) {}

  async createPricingRule(
    createPricingRuleDto: CreatePricingRuleDto
  ): Promise<PricingRuleResponseDto> {
    const pricingRule = new PricingRule();
    pricingRule.name = createPricingRuleDto.name;
    pricingRule.description = createPricingRuleDto.description;
    pricingRule.isActive = createPricingRuleDto.isActive ?? true;
    pricingRule.conditions = createPricingRuleDto.conditions;
    pricingRule.pricing = createPricingRuleDto.pricing;
    pricingRule.priority = createPricingRuleDto.priority ?? 0;
    pricingRule.validFrom = createPricingRuleDto.validFrom
      ? new Date(createPricingRuleDto.validFrom)
      : null;
    pricingRule.validTo = createPricingRuleDto.validTo
      ? new Date(createPricingRuleDto.validTo)
      : null;

    const savedPricingRule =
      await this.pricingRuleRepository.create(pricingRule);
    return plainToClass(PricingRuleResponseDto, savedPricingRule, {
      excludeExtraneousValues: true,
    });
  }

  async findAllPricingRules(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ pricingRules: PricingRuleResponseDto[]; total: number }> {
    const { pricingRules, total } = await this.pricingRuleRepository.findAll(
      page,
      limit,
      search
    );
    const pricingRuleDtos = pricingRules.map((rule) =>
      plainToClass(PricingRuleResponseDto, rule, {
        excludeExtraneousValues: true,
      })
    );
    return { pricingRules: pricingRuleDtos, total };
  }

  async findPricingRuleById(id: number): Promise<PricingRuleResponseDto> {
    const pricingRule = await this.pricingRuleRepository.findById(id);
    if (!pricingRule) {
      throw new NotFoundException("Pricing rule not found");
    }
    return plainToClass(PricingRuleResponseDto, pricingRule, {
      excludeExtraneousValues: true,
    });
  }

  async updatePricingRule(
    id: number,
    updatePricingRuleDto: UpdatePricingRuleDto
  ): Promise<PricingRuleResponseDto> {
    const pricingRule = await this.pricingRuleRepository.findById(id);
    if (!pricingRule) {
      throw new NotFoundException("Pricing rule not found");
    }

    // Prepare update data
    const updateData: Partial<PricingRule> = {};

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
    if (updatePricingRuleDto.validFrom !== undefined)
      updateData.validFrom = updatePricingRuleDto.validFrom
        ? new Date(updatePricingRuleDto.validFrom)
        : null;
    if (updatePricingRuleDto.validTo !== undefined)
      updateData.validTo = updatePricingRuleDto.validTo
        ? new Date(updatePricingRuleDto.validTo)
        : null;

    const updatedPricingRule = await this.pricingRuleRepository.update(
      id,
      updateData
    );
    return plainToClass(PricingRuleResponseDto, updatedPricingRule, {
      excludeExtraneousValues: true,
    });
  }

  async deletePricingRule(id: number): Promise<void> {
    const pricingRule = await this.pricingRuleRepository.findById(id);
    if (!pricingRule) {
      throw new NotFoundException("Pricing rule not found");
    }
    await this.pricingRuleRepository.delete(id);
  }

  async calculatePrice(
    calculatePriceDto: CalculatePriceDto
  ): Promise<PriceCalculationResponseDto> {
    const requestId = randomUUID();
    const conditions = {
      carrierId: calculatePriceDto.carrierId,
      serviceType: calculatePriceDto.serviceType,
      weight: calculatePriceDto.weight,
      distance: calculatePriceDto.distance,
      originCountry: calculatePriceDto.originCountry,
      destinationCountry: calculatePriceDto.destinationCountry,
      customerType: calculatePriceDto.customerType,
    };

    // Find applicable pricing rules
    const applicableRules =
      await this.pricingRuleRepository.findByConditions(conditions);

    // Calculate base price
    let baseRate = 0;
    let weightRate = 0;
    let distanceRate = 0;
    let minimumCharge = 0;
    let maximumCharge = 0;
    const surcharges: Array<{
      type: string;
      amount: number;
      description: string;
    }> = [];
    const discounts: Array<{
      type: string;
      amount: number;
      description: string;
    }> = [];
    const appliedRules: Array<{
      ruleId: number;
      ruleName: string;
      priority: number;
    }> = [];

    // Find the base pricing rule (highest priority with baseRate > 0)
    const baseRule = applicableRules.find((rule) => rule.pricing.baseRate > 0);

    if (baseRule) {
      baseRate = baseRule.pricing.baseRate;
      weightRate = (baseRule.pricing.perKgRate || 0) * calculatePriceDto.weight;
      distanceRate = calculatePriceDto.distance
        ? (baseRule.pricing.perKmRate || 0) * calculatePriceDto.distance
        : 0;
      minimumCharge = baseRule.pricing.minimumCharge || 0;
      maximumCharge = baseRule.pricing.maximumCharge || 0;

      appliedRules.push({
        ruleId: baseRule.id,
        ruleName: baseRule.name,
        priority: baseRule.priority,
      });
    }

    // Apply all applicable rules for surcharges and discounts
    for (const rule of applicableRules) {
      // Apply surcharges
      if (rule.pricing.surcharges) {
        for (const surcharge of rule.pricing.surcharges) {
          const amount = surcharge.percentage
            ? (baseRate + weightRate + distanceRate) *
              (surcharge.percentage / 100)
            : surcharge.amount || 0;
          surcharges.push({
            type: surcharge.type,
            amount,
            description: `${surcharge.type} surcharge`,
          });
        }
      }

      // Apply discounts
      if (rule.pricing.discounts) {
        for (const discount of rule.pricing.discounts) {
          const amount = discount.percentage
            ? (baseRate + weightRate + distanceRate) *
              (discount.percentage / 100)
            : discount.amount || 0;
          discounts.push({
            type: discount.type,
            amount,
            description: `${discount.type} discount`,
          });
        }
      }

      // Track applied rules
      if (rule.id !== baseRule?.id) {
        appliedRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
          priority: rule.priority,
        });
      }
    }

    // Calculate totals
    const subtotal = baseRate + weightRate + distanceRate;
    const surchargeTotal = surcharges.reduce((sum, s) => sum + s.amount, 0);
    const discountTotal = discounts.reduce((sum, d) => sum + d.amount, 0);
    let total = subtotal + surchargeTotal - discountTotal;

    // Apply minimum and maximum charges
    if (minimumCharge > 0 && total < minimumCharge) {
      total = minimumCharge;
    }
    if (maximumCharge > 0 && total > maximumCharge) {
      total = maximumCharge;
    }

    // Create price calculation record
    const priceCalculation = new PriceCalculation();
    priceCalculation.requestId = requestId;
    priceCalculation.request = {
      carrierId: calculatePriceDto.carrierId,
      serviceType: calculatePriceDto.serviceType,
      weight: calculatePriceDto.weight,
      distance: calculatePriceDto.distance,
      originCountry: calculatePriceDto.originCountry,
      destinationCountry: calculatePriceDto.destinationCountry,
      customerType: calculatePriceDto.customerType,
      customerId: calculatePriceDto.customerId,
    };
    priceCalculation.calculation = {
      baseRate,
      weightRate,
      distanceRate,
      surcharges,
      discounts,
      subtotal,
      total,
      currency: baseRule ? baseRule.pricing.currency : "USD",
    };
    priceCalculation.appliedRules = appliedRules;

    const savedCalculation =
      await this.priceCalculationRepository.create(priceCalculation);

    return plainToClass(PriceCalculationResponseDto, savedCalculation, {
      excludeExtraneousValues: true,
    });
  }

  async getPriceCalculationHistory(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    priceCalculations: PriceCalculationResponseDto[];
    total: number;
  }> {
    const { priceCalculations, total } =
      await this.priceCalculationRepository.findAll(page, limit, search);
    const calculationDtos = priceCalculations.map((calc) =>
      plainToClass(PriceCalculationResponseDto, calc, {
        excludeExtraneousValues: true,
      })
    );
    return { priceCalculations: calculationDtos, total };
  }

  async getPricingRuleCount(): Promise<{ count: number }> {
    const count = await this.pricingRuleRepository.count();
    return { count };
  }

  async getPriceCalculationCount(): Promise<{ count: number }> {
    const count = await this.priceCalculationRepository.count();
    return { count };
  }
}
