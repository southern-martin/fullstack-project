import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PriceCalculationRepositoryInterface } from "../../domain/repositories/price-calculation.repository.interface";
import { PricingRuleRepositoryInterface } from "../../domain/repositories/pricing-rule.repository.interface";
import { PricingDomainService } from "../../domain/services/pricing.domain.service";
import { CalculatePriceDto } from "../dto/calculate-price.dto";
import { PriceCalculationResponseDto } from "../dto/price-calculation-response.dto";

/**
 * Calculate Price Use Case
 * Application service that orchestrates the price calculation process
 * Follows Clean Architecture principles
 */
@Injectable()
export class CalculatePriceUseCase {
  constructor(
    private readonly pricingRuleRepository: PricingRuleRepositoryInterface,
    private readonly priceCalculationRepository: PriceCalculationRepositoryInterface,
    private readonly pricingDomainService: PricingDomainService
  ) {}

  /**
   * Executes the calculate price use case
   * @param calculatePriceDto - Price calculation request
   * @returns Price calculation response
   */
  async execute(
    calculatePriceDto: CalculatePriceDto
  ): Promise<PriceCalculationResponseDto> {
    // 1. Validate input using domain service
    const validation =
      this.pricingDomainService.validatePriceCalculationRequest(
        calculatePriceDto
      );
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 2. Prepare conditions for rule matching
    const conditions = {
      carrierId: calculatePriceDto.carrierId,
      serviceType: calculatePriceDto.serviceType,
      weight: calculatePriceDto.weight,
      distance: calculatePriceDto.distance,
      originCountry: calculatePriceDto.originCountry,
      destinationCountry: calculatePriceDto.destinationCountry,
      customerType: calculatePriceDto.customerType,
    };

    // 3. Find applicable pricing rules
    const applicableRules =
      await this.pricingRuleRepository.findByConditions(conditions);

    // 4. Sort rules by priority
    const sortedRules =
      this.pricingDomainService.sortRulesByPriority(applicableRules);

    // 5. Calculate price using domain service
    const calculation = this.calculatePriceFromRules(
      sortedRules,
      calculatePriceDto
    );

    // 6. Create price calculation record
    const requestId = randomUUID();
    const priceCalculation = {
      requestId,
      request: {
        carrierId: calculatePriceDto.carrierId,
        serviceType: calculatePriceDto.serviceType,
        weight: calculatePriceDto.weight,
        distance: calculatePriceDto.distance,
        originCountry: calculatePriceDto.originCountry,
        destinationCountry: calculatePriceDto.destinationCountry,
        customerType: calculatePriceDto.customerType,
        customerId: calculatePriceDto.customerId,
      },
      calculation: calculation.calculation,
      appliedRules: calculation.appliedRules,
    };

    // 7. Save calculation in repository
    const savedCalculation =
      await this.priceCalculationRepository.create(priceCalculation);

    // 8. Return response
    return this.mapToResponseDto(savedCalculation);
  }

  /**
   * Calculates price from applicable rules
   * @param rules - Applicable pricing rules
   * @param request - Price calculation request
   * @returns Price calculation result
   */
  private calculatePriceFromRules(
    rules: any[],
    request: CalculatePriceDto
  ): {
    calculation: any;
    appliedRules: any[];
  } {
    let baseRate = 0;
    let weightRate = 0;
    let distanceRate = 0;
    let minimumCharge = 0;
    let maximumCharge = 0;
    const surcharges: any[] = [];
    const discounts: any[] = [];
    const appliedRules: any[] = [];

    // Find the base pricing rule (highest priority with baseRate > 0)
    const baseRule = rules.find((rule) => rule.pricing.baseRate > 0);

    if (baseRule) {
      const basePrice = this.pricingDomainService.calculateBasePrice(
        baseRule.pricing,
        request.weight,
        request.distance
      );

      baseRate = basePrice.baseRate;
      weightRate = basePrice.weightRate;
      distanceRate = basePrice.distanceRate;
      minimumCharge = baseRule.pricing.minimumCharge || 0;
      maximumCharge = baseRule.pricing.maximumCharge || 0;

      appliedRules.push({
        ruleId: baseRule.id,
        ruleName: baseRule.name,
        priority: baseRule.priority,
      });
    }

    // Apply all applicable rules for surcharges and discounts
    const subtotal = baseRate + weightRate + distanceRate;

    for (const rule of rules) {
      // Apply surcharges
      const ruleSurcharges = this.pricingDomainService.calculateSurcharges(
        rule.pricing,
        subtotal
      );
      surcharges.push(...ruleSurcharges);

      // Apply discounts
      const ruleDiscounts = this.pricingDomainService.calculateDiscounts(
        rule.pricing,
        subtotal
      );
      discounts.push(...ruleDiscounts);

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
    const surchargeTotal = surcharges.reduce((sum, s) => sum + s.amount, 0);
    const discountTotal = discounts.reduce((sum, d) => sum + d.amount, 0);
    let total = subtotal + surchargeTotal - discountTotal;

    // Apply minimum and maximum charges
    total = this.pricingDomainService.applyMinMaxCharges(
      total,
      minimumCharge,
      maximumCharge
    );

    return {
      calculation: {
        baseRate,
        weightRate,
        distanceRate,
        surcharges,
        discounts,
        subtotal,
        total,
        currency: baseRule ? baseRule.pricing.currency : "USD",
      },
      appliedRules,
    };
  }

  /**
   * Maps price calculation entity to response DTO
   * @param calculation - Price calculation entity
   * @returns Price calculation response DTO
   */
  private mapToResponseDto(calculation: any): PriceCalculationResponseDto {
    return {
      id: calculation.id,
      requestId: calculation.requestId,
      request: calculation.request,
      calculation: calculation.calculation,
      appliedRules: calculation.appliedRules,
      createdAt: calculation.createdAt,
    };
  }
}
