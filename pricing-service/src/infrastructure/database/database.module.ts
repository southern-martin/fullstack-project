import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PriceCalculationTypeOrmEntity } from "./typeorm/entities/price-calculation.typeorm.entity";
import { PricingRuleTypeOrmEntity } from "./typeorm/entities/pricing-rule.typeorm.entity";
import { PriceCalculationRepository } from "./typeorm/repositories/price-calculation.repository";
import { PricingRuleRepository } from "./typeorm/repositories/pricing-rule.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PricingRuleTypeOrmEntity,
      PriceCalculationTypeOrmEntity,
    ]),
  ],
  providers: [
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
    TypeOrmModule,
    "PricingRuleRepositoryInterface",
    "PriceCalculationRepositoryInterface",
  ],
})
export class DatabaseModule {}
