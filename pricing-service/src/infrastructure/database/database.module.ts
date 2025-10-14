import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PriceCalculationTypeOrmEntity } from "./typeorm/entities/price-calculation.typeorm.entity";
import { PricingRuleTypeOrmEntity } from "./typeorm/entities/pricing-rule.typeorm.entity";
import { PriceCalculationRepository } from "./typeorm/repositories/price-calculation.repository";
import { PricingRuleRepository } from "./typeorm/repositories/pricing-rule.repository";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get("DB_PORT", 3306),
        username: configService.get("DB_USERNAME", "root"),
        password: configService.get("DB_PASSWORD", "password"),
        database: configService.get("DB_NAME", "pricing_service_db"),
        entities: [PricingRuleTypeOrmEntity, PriceCalculationTypeOrmEntity],
        synchronize: configService.get("NODE_ENV") === "development",
        logging: configService.get("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
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
