import { Module } from "@nestjs/common";

// Controllers
import { HealthController } from "./controllers/health.controller";
import { PricingController } from "./controllers/pricing.controller";

// Use Cases (from application layer)
import { CalculatePriceUseCase } from "../application/use-cases/calculate-price.use-case";
import { GetPriceCalculationHistoryUseCase } from "../application/use-cases/get-price-calculation-history.use-case";
import { ManagePricingRuleUseCase } from "../application/use-cases/manage-pricing-rule.use-case";

// Domain Services
import { PricingDomainService } from "../domain/services/pricing.domain.service";

// Infrastructure
import { PriceCalculationRepository } from "../infrastructure/repositories/price-calculation.repository";
import { PricingRuleRepository } from "../infrastructure/repositories/pricing-rule.repository";

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  controllers: [PricingController, HealthController],
  providers: [
    // Use Cases
    CalculatePriceUseCase,
    ManagePricingRuleUseCase,
    GetPriceCalculationHistoryUseCase,

    // Domain Services
    PricingDomainService,

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
})
export class InterfacesModule {}
