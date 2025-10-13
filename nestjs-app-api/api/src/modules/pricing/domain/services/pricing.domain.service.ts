import { Injectable } from '@nestjs/common';
import { PricingRule } from '../entities/pricing-rule.entity';
import { PriceCalculation } from '../entities/price-calculation.entity';

/**
 * PricingDomainService
 * 
 * This service encapsulates the core business logic and rules related to pricing.
 * It operates on PricingRule and PriceCalculation entities and ensures that business rules
 * are enforced independently of application-specific concerns.
 */
@Injectable()
export class PricingDomainService {
  
  /**
   * Validates pricing rule creation data against business rules.
   * @param ruleData Partial pricing rule data for creation.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validatePricingRuleCreationData(ruleData: Partial<PricingRule>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Name validation
    if (!ruleData.name || ruleData.name.trim().length < 3) {
      errors.push('Rule name must be at least 3 characters');
    }

    if (ruleData.name && ruleData.name.length > 100) {
      errors.push('Rule name must not exceed 100 characters');
    }

    // Rule type validation
    const validRuleTypes = ['PERCENTAGE', 'FIXED_AMOUNT', 'QUANTITY_BREAK', 'CUSTOMER_TYPE', 'DATE_RANGE', 'COMPOSITE'];
    if (!ruleData.ruleType || !validRuleTypes.includes(ruleData.ruleType)) {
      errors.push('Valid rule type is required');
    }

    // Conditions validation
    if (!ruleData.conditions || typeof ruleData.conditions !== 'object') {
      errors.push('Valid conditions object is required');
    } else {
      const conditionErrors = this.validateConditions(ruleData.conditions, ruleData.ruleType);
      errors.push(...conditionErrors);
    }

    // Actions validation
    if (!ruleData.actions || typeof ruleData.actions !== 'object') {
      errors.push('Valid actions object is required');
    } else {
      const actionErrors = this.validateActions(ruleData.actions, ruleData.ruleType);
      errors.push(...actionErrors);
    }

    // Priority validation
    if (ruleData.priority !== undefined && (ruleData.priority < 0 || ruleData.priority > 1000)) {
      errors.push('Priority must be between 0 and 1000');
    }

    // Date validation
    if (ruleData.validFrom && ruleData.validUntil) {
      if (new Date(ruleData.validFrom) >= new Date(ruleData.validUntil)) {
        errors.push('Valid from date must be before valid until date');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates pricing rule update data against business rules.
   * @param updateData Partial pricing rule data for update.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validatePricingRuleUpdateData(updateData: Partial<PricingRule>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Name validation
    if (updateData.name !== undefined) {
      if (!updateData.name || updateData.name.trim().length < 3) {
        errors.push('Rule name must be at least 3 characters');
      }
      if (updateData.name.length > 100) {
        errors.push('Rule name must not exceed 100 characters');
      }
    }

    // Rule type validation
    if (updateData.ruleType !== undefined) {
      const validRuleTypes = ['PERCENTAGE', 'FIXED_AMOUNT', 'QUANTITY_BREAK', 'CUSTOMER_TYPE', 'DATE_RANGE', 'COMPOSITE'];
      if (!validRuleTypes.includes(updateData.ruleType)) {
        errors.push('Valid rule type is required');
      }
    }

    // Conditions validation
    if (updateData.conditions !== undefined) {
      if (typeof updateData.conditions !== 'object') {
        errors.push('Valid conditions object is required');
      } else {
        const conditionErrors = this.validateConditions(updateData.conditions, updateData.ruleType);
        errors.push(...conditionErrors);
      }
    }

    // Actions validation
    if (updateData.actions !== undefined) {
      if (typeof updateData.actions !== 'object') {
        errors.push('Valid actions object is required');
      } else {
        const actionErrors = this.validateActions(updateData.actions, updateData.ruleType);
        errors.push(...actionErrors);
      }
    }

    // Priority validation
    if (updateData.priority !== undefined && (updateData.priority < 0 || updateData.priority > 1000)) {
      errors.push('Priority must be between 0 and 1000');
    }

    // Date validation
    if (updateData.validFrom && updateData.validUntil) {
      if (new Date(updateData.validFrom) >= new Date(updateData.validUntil)) {
        errors.push('Valid from date must be before valid until date');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculates the final price based on base price and applied rules.
   * @param basePrice The base price to calculate from.
   * @param rules Array of pricing rules to apply.
   * @param inputData Input data for rule evaluation.
   * @returns Calculated price result.
   */
  calculatePrice(
    basePrice: number,
    rules: PricingRule[],
    inputData: any
  ): {
    finalPrice: number;
    totalDiscount: number;
    totalMarkup: number;
    appliedRules: Array<{
      ruleId: number;
      ruleName: string;
      ruleType: string;
      discountAmount: number;
      markupAmount: number;
      priority: number;
    }>;
    calculationSteps: Array<{
      step: string;
      description: string;
      value: number;
      timestamp: Date;
    }>;
  } {
    let finalPrice = basePrice;
    let totalDiscount = 0;
    let totalMarkup = 0;
    const appliedRules: any[] = [];
    const calculationSteps: any[] = [];

    // Sort rules by priority (higher priority first)
    const sortedRules = rules.sort((a, b) => b.priority - a.priority);

    calculationSteps.push({
      step: 'INITIAL',
      description: 'Starting with base price',
      value: basePrice,
      timestamp: new Date(),
    });

    for (const rule of sortedRules) {
      if (this.isRuleApplicable(rule, inputData)) {
        const result = this.applyRule(finalPrice, rule, inputData);
        
        if (result.discountAmount > 0 || result.markupAmount > 0) {
          finalPrice = result.newPrice;
          totalDiscount += result.discountAmount;
          totalMarkup += result.markupAmount;

          appliedRules.push({
            ruleId: rule.id,
            ruleName: rule.name,
            ruleType: rule.ruleType,
            discountAmount: result.discountAmount,
            markupAmount: result.markupAmount,
            priority: rule.priority,
          });

          calculationSteps.push({
            step: `RULE_${rule.id}`,
            description: `Applied rule: ${rule.name}`,
            value: finalPrice,
            timestamp: new Date(),
          });
        }
      }
    }

    calculationSteps.push({
      step: 'FINAL',
      description: 'Final calculated price',
      value: finalPrice,
      timestamp: new Date(),
    });

    return {
      finalPrice,
      totalDiscount,
      totalMarkup,
      appliedRules,
      calculationSteps,
    };
  }

  /**
   * Determines if a pricing rule can be deleted based on business rules.
   * @param rule The pricing rule entity.
   * @param hasCalculations True if the rule has been used in calculations.
   * @returns True if the rule can be deleted, false otherwise.
   */
  canDeletePricingRule(rule: PricingRule, hasCalculations: boolean): boolean {
    // Business rule: Cannot delete active rules that have been used
    if (rule.isActive && hasCalculations) {
      return false;
    }

    // Business rule: Cannot delete rules that are currently valid
    const now = new Date();
    if (rule.validFrom && rule.validUntil) {
      if (now >= rule.validFrom && now <= rule.validUntil) {
        return false;
      }
    }

    return true;
  }

  /**
   * Determines if a pricing rule can be edited based on business rules.
   * @param rule The pricing rule entity.
   * @returns True if the rule can be edited, false otherwise.
   */
  canEditPricingRule(rule: PricingRule): boolean {
    // Business rule: Can edit any rule
    // In a real application, you might have restrictions like:
    // - Cannot edit rules that are currently being used
    // - Cannot edit rules in certain states
    // - etc.
    
    return true;
  }

  /**
   * Calculates a performance score for a pricing rule.
   * @param rule The pricing rule entity.
   * @param usageCount Number of times the rule has been used.
   * @param averageDiscount Average discount amount applied.
   * @returns A performance score (0-100).
   */
  calculateRulePerformanceScore(
    rule: PricingRule,
    usageCount: number = 0,
    averageDiscount: number = 0
  ): number {
    let score = 0;

    // Base score for being active
    if (rule.isActive) {
      score += 20;
    }

    // Score based on usage count
    score += Math.min(40, Math.floor(usageCount / 10));

    // Score based on average discount effectiveness
    if (averageDiscount > 0) {
      score += Math.min(30, Math.floor(averageDiscount / 10));
    }

    // Bonus for having complete configuration
    if (rule.validFrom && rule.validUntil && rule.description) {
      score += 10;
    }

    return Math.min(100, score);
  }

  // --- Private Helper Methods ---

  private validateConditions(conditions: any, ruleType?: string): string[] {
    const errors: string[] = [];

    if (ruleType === 'QUANTITY_BREAK') {
      if (conditions.minQuantity === undefined && conditions.maxQuantity === undefined) {
        errors.push('Quantity break rules must specify minQuantity or maxQuantity');
      }
      if (conditions.minQuantity && conditions.maxQuantity && conditions.minQuantity >= conditions.maxQuantity) {
        errors.push('minQuantity must be less than maxQuantity');
      }
    }

    if (ruleType === 'DATE_RANGE') {
      if (!conditions.startDate || !conditions.endDate) {
        errors.push('Date range rules must specify startDate and endDate');
      }
      if (conditions.startDate && conditions.endDate && new Date(conditions.startDate) >= new Date(conditions.endDate)) {
        errors.push('startDate must be before endDate');
      }
    }

    if (ruleType === 'CUSTOMER_TYPE') {
      if (!conditions.customerType || !Array.isArray(conditions.customerType) || conditions.customerType.length === 0) {
        errors.push('Customer type rules must specify at least one customerType');
      }
    }

    return errors;
  }

  private validateActions(actions: any, ruleType?: string): string[] {
    const errors: string[] = [];

    if (!actions.type) {
      errors.push('Action type is required');
    } else {
      const validActionTypes = ['DISCOUNT', 'MARKUP', 'SET_PRICE', 'FREE_SHIPPING'];
      if (!validActionTypes.includes(actions.type)) {
        errors.push('Valid action type is required');
      }
    }

    if (actions.value === undefined || actions.value === null) {
      errors.push('Action value is required');
    } else if (typeof actions.value !== 'number' || actions.value < 0) {
      errors.push('Action value must be a non-negative number');
    }

    if (actions.type === 'PERCENTAGE' && actions.value > 100) {
      errors.push('Percentage discount cannot exceed 100%');
    }

    return errors;
  }

  private isRuleApplicable(rule: PricingRule, inputData: any): boolean {
    if (!rule.isActive) return false;

    // Check date validity
    const now = new Date();
    if (rule.validFrom && now < rule.validFrom) return false;
    if (rule.validUntil && now > rule.validUntil) return false;

    // Check conditions based on rule type
    switch (rule.ruleType) {
      case 'CUSTOMER_TYPE':
        return rule.conditions.customerType?.includes(inputData.customerType);
      
      case 'QUANTITY_BREAK':
        const quantity = inputData.quantity || 0;
        if (rule.conditions.minQuantity && quantity < rule.conditions.minQuantity) return false;
        if (rule.conditions.maxQuantity && quantity > rule.conditions.maxQuantity) return false;
        return true;
      
      case 'DATE_RANGE':
        const date = new Date(inputData.date || now);
        if (rule.conditions.startDate && date < new Date(rule.conditions.startDate)) return false;
        if (rule.conditions.endDate && date > new Date(rule.conditions.endDate)) return false;
        return true;
      
      case 'PERCENTAGE':
      case 'FIXED_AMOUNT':
      case 'COMPOSITE':
      default:
        return true;
    }
  }

  private applyRule(currentPrice: number, rule: PricingRule, inputData: any): {
    newPrice: number;
    discountAmount: number;
    markupAmount: number;
  } {
    let newPrice = currentPrice;
    let discountAmount = 0;
    let markupAmount = 0;

    switch (rule.actions.type) {
      case 'DISCOUNT':
        if (rule.ruleType === 'PERCENTAGE') {
          const discount = (currentPrice * rule.actions.value) / 100;
          discountAmount = Math.min(discount, rule.actions.maxDiscount || discount);
          newPrice = currentPrice - discountAmount;
        } else {
          discountAmount = Math.min(rule.actions.value, rule.actions.maxDiscount || rule.actions.value);
          newPrice = currentPrice - discountAmount;
        }
        break;
      
      case 'MARKUP':
        markupAmount = rule.actions.value;
        newPrice = currentPrice + markupAmount;
        break;
      
      case 'SET_PRICE':
        if (rule.actions.value < currentPrice) {
          discountAmount = currentPrice - rule.actions.value;
        } else {
          markupAmount = rule.actions.value - currentPrice;
        }
        newPrice = rule.actions.value;
        break;
      
      case 'FREE_SHIPPING':
        // This would typically be handled separately in shipping calculations
        break;
    }

    return { newPrice, discountAmount, markupAmount };
  }
}
