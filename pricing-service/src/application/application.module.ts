import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// Use Cases
import { CalculatePriceUseCase } from "./use-cases/calculate-price.use-case";
import { GetPriceCalculationHistoryUseCase } from "./use-cases/get-price-calculation-history.use-case";
import { ManagePricingRuleUseCase } from "./use-cases/manage-pricing-rule.use-case";

// Domain Services
import { PricingDomainService } from "../domain/services/pricing.domain.service";

// Infrastructure Implementations (repositories)
import { PriceCalculationRepository } from "../infrastructure/database/typeorm/repositories/price-calculation.repository";
import { PricingRuleRepository } from "../infrastructure/database/typeorm/repositories/pricing-rule.repository";

// TypeORM Entities
import { PriceCalculationTypeOrmEntity } from "../infrastructure/database/typeorm/entities/price-calculation.typeorm.entity";
import { PricingRuleTypeOrmEntity } from "../infrastructure/database/typeorm/entities/pricing-rule.typeorm.entity";

// Event Bus
// import { RedisEventBus } from "../infrastructure/events/redis-event-bus";

/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [
    ConfigModule,
    // Register TypeORM entities for dependency injection
    TypeOrmModule.forFeature([
      PricingRuleTypeOrmEntity,
      PriceCalculationTypeOrmEntity,
    ]),
  ],
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

    // Event Bus Implementation (TODO: Create RedisEventBus)
    // {
    //   provide: "EventBusInterface",
    //   useClass: RedisEventBus,
    // },
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
