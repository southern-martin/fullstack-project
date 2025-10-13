import { Module } from '@nestjs/common';
import { PricingDomainService } from '../domain/services/pricing.domain.service';
import { CalculatePriceUseCase } from './use-cases/calculate-price.use-case';
import { ManagePricingRuleUseCase } from './use-cases/manage-pricing-rule.use-case';

/**
 * PricingApplicationModule
 * 
 * This module configures the application layer for the Pricing module.
 * It provides all the use cases and domain services needed for pricing operations.
 */
@Module({
  providers: [
    // Domain Services
    PricingDomainService,
    
    // Use Cases
    CalculatePriceUseCase,
    ManagePricingRuleUseCase,
  ],
  exports: [
    // Domain Services
    PricingDomainService,
    
    // Use Cases
    CalculatePriceUseCase,
    ManagePricingRuleUseCase,
  ],
})
export class PricingApplicationModule {}
