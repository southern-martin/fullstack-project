import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PricingController } from "./api/pricing.controller";
import { PricingService } from "./application/services/pricing.service";
import { HealthController } from "./health/health.controller";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { PriceCalculationRepository } from "./infrastructure/repositories/price-calculation.repository";
import { PricingRuleRepository } from "./infrastructure/repositories/pricing-rule.repository";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    DatabaseModule,
  ],
  controllers: [PricingController, HealthController],
  providers: [
    PricingService,
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
export class AppModule {}
