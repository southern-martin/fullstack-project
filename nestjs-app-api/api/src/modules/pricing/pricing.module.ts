import { Module } from '@nestjs/common';
import { PricingApplicationModule } from './application/application.module';
import { PricingInfrastructureModule } from './infrastructure/infrastructure.module';
import { PricingInterfacesModule } from './interfaces/interfaces.module';

/**
 * PricingModule
 * 
 * This module integrates all layers of the Pricing module following Clean Architecture principles:
 * - Application Layer: Use cases and domain services
 * - Infrastructure Layer: Repository implementations and external services
 * - Interfaces Layer: HTTP controllers and external interfaces
 * 
 * Features implemented:
 * - Price calculation services
 * - Pricing rules engine
 * - Dynamic pricing algorithms
 * - Price history tracking
 * - Rule-based pricing with conditions and actions
 * - Support for percentage discounts, fixed amounts, quantity breaks, customer types, date ranges
 * - Comprehensive pricing analytics and statistics
 */
@Module({
  imports: [
    PricingApplicationModule,
    PricingInfrastructureModule,
    PricingInterfacesModule,
  ],
  exports: [
    PricingApplicationModule,
    PricingInfrastructureModule,
  ],
})
export class PricingModule {}
