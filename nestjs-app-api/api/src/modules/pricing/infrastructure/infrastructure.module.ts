import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingRule } from '../domain/entities/pricing-rule.entity';
import { PriceCalculation } from '../domain/entities/price-calculation.entity';
import { PricingRuleTypeOrmRepository } from './repositories/pricing-rule.typeorm.repository';
import { PriceCalculationTypeOrmRepository } from './repositories/price-calculation.typeorm.repository';
import { PricingRuleRepositoryInterface } from '../domain/repositories/pricing-rule.repository.interface';
import { PriceCalculationRepositoryInterface } from '../domain/repositories/price-calculation.repository.interface';

/**
 * PricingInfrastructureModule
 * 
 * This module configures the infrastructure layer for the Pricing module.
 * It provides the concrete implementations of repositories and external services.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([PricingRule, PriceCalculation]),
  ],
  providers: [
    {
      provide: PricingRuleRepositoryInterface,
      useClass: PricingRuleTypeOrmRepository,
    },
    {
      provide: PriceCalculationRepositoryInterface,
      useClass: PriceCalculationTypeOrmRepository,
    },
  ],
  exports: [
    PricingRuleRepositoryInterface,
    PriceCalculationRepositoryInterface,
  ],
})
export class PricingInfrastructureModule {}
