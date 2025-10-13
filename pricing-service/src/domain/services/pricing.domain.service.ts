import { Injectable } from "@nestjs/common";
import { PricingRule } from "../entities/pricing-rule.entity";

/**
 * Domain service for pricing business logic
 * Contains pure business rules without infrastructure concerns
 */
@Injectable()
export class PricingDomainService {
  /**
   * Validates pricing rule creation data
   * Business rule: All required fields must be present and valid
   */
  validatePricingRuleCreationData(ruleData: {
    name: string;
    description?: string;
    conditions: any;
    pricing: any;
    priority?: number;
    validFrom?: string;
    validTo?: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Name validation
    if (!ruleData.name || ruleData.name.trim().length < 2) {
      errors.push("Pricing rule name must be at least 2 characters");
    }

    if (ruleData.name && ruleData.name.length > 100) {
      errors.push("Pricing rule name must not exceed 100 characters");
    }

    // Conditions validation
    if (!ruleData.conditions || typeof ruleData.conditions !== "object") {
      errors.push("Pricing conditions are required and must be valid");
    }

    // Pricing validation
    if (!ruleData.pricing || typeof ruleData.pricing !== "object") {
      errors.push("Pricing configuration is required and must be valid");
    }

    // Priority validation
    if (
      ruleData.priority !== undefined &&
      (ruleData.priority < 0 || ruleData.priority > 1000)
    ) {
      errors.push("Priority must be between 0 and 1000");
    }

    // Date validation
    if (ruleData.validFrom && ruleData.validTo) {
      const fromDate = new Date(ruleData.validFrom);
      const toDate = new Date(ruleData.validTo);

      if (fromDate >= toDate) {
        errors.push("Valid from date must be before valid to date");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates pricing rule update data
   * Business rule: Cannot update certain fields after creation
   */
  validatePricingRuleUpdateData(updateData: Partial<PricingRule>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Name validation
    if (updateData.name !== undefined) {
      if (!updateData.name || updateData.name.trim().length < 2) {
        errors.push("Pricing rule name must be at least 2 characters");
      }
      if (updateData.name.length > 100) {
        errors.push("Pricing rule name must not exceed 100 characters");
      }
    }

    // Priority validation
    if (
      updateData.priority !== undefined &&
      (updateData.priority < 0 || updateData.priority > 1000)
    ) {
      errors.push("Priority must be between 0 and 1000");
    }

    // Date validation
    if (updateData.validFrom && updateData.validTo) {
      const fromDate = new Date(updateData.validFrom);
      const toDate = new Date(updateData.validTo);

      if (fromDate >= toDate) {
        errors.push("Valid from date must be before valid to date");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Determines if pricing rule is currently valid
   * Business rule: Rule is valid if current date is within valid period
   */
  isPricingRuleValid(rule: PricingRule): boolean {
    const now = new Date();

    if (rule.validFrom && now < rule.validFrom) {
      return false;
    }

    if (rule.validTo && now > rule.validTo) {
      return false;
    }

    return rule.isActive;
  }

  /**
   * Determines if pricing rule can be deleted
   * Business rule: Cannot delete rule if it has been used in calculations
   */
  canDeletePricingRule(rule: PricingRule, hasBeenUsed: boolean): boolean {
    if (!hasBeenUsed) {
      return true;
    }

    // Business rule: Cannot delete rule that has been used in calculations
    return false;
  }

  /**
   * Calculates base price from pricing rule
   * Business rule: Base price calculation logic
   */
  calculateBasePrice(
    pricing: any,
    weight: number,
    distance?: number
  ): {
    baseRate: number;
    weightRate: number;
    distanceRate: number;
  } {
    const baseRate = pricing.baseRate || 0;
    const weightRate = (pricing.perKgRate || 0) * weight;
    const distanceRate = distance ? (pricing.perKmRate || 0) * distance : 0;

    return {
      baseRate,
      weightRate,
      distanceRate,
    };
  }

  /**
   * Calculates surcharges from pricing rule
   * Business rule: Surcharge calculation logic
   */
  calculateSurcharges(
    pricing: any,
    subtotal: number
  ): Array<{
    type: string;
    amount: number;
    description: string;
  }> {
    const surcharges: Array<{
      type: string;
      amount: number;
      description: string;
    }> = [];

    if (pricing.surcharges) {
      for (const surcharge of pricing.surcharges) {
        const amount = surcharge.percentage
          ? subtotal * (surcharge.percentage / 100)
          : surcharge.amount || 0;

        surcharges.push({
          type: surcharge.type,
          amount,
          description: `${surcharge.type} surcharge`,
        });
      }
    }

    return surcharges;
  }

  /**
   * Calculates discounts from pricing rule
   * Business rule: Discount calculation logic
   */
  calculateDiscounts(
    pricing: any,
    subtotal: number
  ): Array<{
    type: string;
    amount: number;
    description: string;
  }> {
    const discounts: Array<{
      type: string;
      amount: number;
      description: string;
    }> = [];

    if (pricing.discounts) {
      for (const discount of pricing.discounts) {
        const amount = discount.percentage
          ? subtotal * (discount.percentage / 100)
          : discount.amount || 0;

        discounts.push({
          type: discount.type,
          amount,
          description: `${discount.type} discount`,
        });
      }
    }

    return discounts;
  }

  /**
   * Applies minimum and maximum charges
   * Business rule: Final price must respect minimum and maximum limits
   */
  applyMinMaxCharges(
    total: number,
    minimumCharge?: number,
    maximumCharge?: number
  ): number {
    let finalTotal = total;

    if (minimumCharge && finalTotal < minimumCharge) {
      finalTotal = minimumCharge;
    }

    if (maximumCharge && finalTotal > maximumCharge) {
      finalTotal = maximumCharge;
    }

    return finalTotal;
  }

  /**
   * Determines if pricing rule applies to given conditions
   * Business rule: Rule matching logic
   */
  doesRuleApply(rule: PricingRule, conditions: any): boolean {
    if (!rule.conditions || typeof rule.conditions !== "object") {
      return false;
    }

    // Check if rule is currently valid
    if (!this.isPricingRuleValid(rule)) {
      return false;
    }

    // Check condition matching
    for (const [key, value] of Object.entries(rule.conditions)) {
      if (conditions[key] !== value) {
        return false;
      }
    }

    return true;
  }

  /**
   * Sorts pricing rules by priority
   * Business rule: Higher priority rules are applied first
   */
  sortRulesByPriority(rules: PricingRule[]): PricingRule[] {
    return rules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Validates price calculation request
   * Business rule: Request must have required fields
   */
  validatePriceCalculationRequest(request: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!request.carrierId) {
      errors.push("Carrier ID is required");
    }

    if (!request.serviceType) {
      errors.push("Service type is required");
    }

    if (!request.weight || request.weight <= 0) {
      errors.push("Weight must be greater than 0");
    }

    if (request.distance !== undefined && request.distance < 0) {
      errors.push("Distance cannot be negative");
    }

    if (!request.originCountry) {
      errors.push("Origin country is required");
    }

    if (!request.destinationCountry) {
      errors.push("Destination country is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
