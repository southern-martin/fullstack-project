import { Module } from "@nestjs/common";

// Use Cases
import { CalculatePriceUseCase } from "./use-cases/calculate-price.use-case";
import { GetPriceCalculationHistoryUseCase } from "./use-cases/get-price-calculation-history.use-case";
import { ManagePricingRuleUseCase } from "./use-cases/manage-pricing-rule.use-case";

// Domain Services
import { PricingDomainService } from "../domain/services/pricing.domain.service";

// Repository Interfaces (will be implemented in infrastructure)

// Infrastructure Implementations
import { PriceCalculationRepository } from "../infrastructure/database/typeorm/repositories/price-calculation.repository";
import { PricingRuleRepository } from "../infrastructure/database/typeorm/repositories/pricing-rule.repository";

/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  providers: [
    // Domain Services
    PricingDomainService,

    // Use Cases
    CalculatePriceUseCase,
    ManagePricingRuleUseCase,
    GetPriceCalculationHistoryUseCase,

    // Repository Implementations
    {
      provide: "PricingRuleRepositoryInterface",
      useClass: PricingRuleRepository,
    },
    {
      provide: "PriceCalculationRepositoryInterface",
      useClass: PriceCalculationRepository,
    },
  ],
  exports: [
    // Export use cases for controllers
    CalculatePriceUseCase,
    ManagePricingRuleUseCase,
    GetPriceCalculationHistoryUseCase,

    // Export domain services
    PricingDomainService,
  ],
})
export class ApplicationModule {}
