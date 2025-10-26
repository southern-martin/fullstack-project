import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// Shared Infrastructure
import { WinstonLoggerModule } from "@shared/infrastructure/logging/winston-logger.module";
import { RedisCacheService } from "@shared/infrastructure";

// Clean Architecture Modules
import { ApplicationModule } from "./application/application.module";
import { InterfacesModule } from "./interfaces/interfaces.module";

// TypeORM Entities
import { PriceCalculationTypeOrmEntity } from "./infrastructure/database/typeorm/entities/price-calculation.typeorm.entity";
import { PricingRuleTypeOrmEntity } from "./infrastructure/database/typeorm/entities/pricing-rule.typeorm.entity";

/**
 * Main Application Module
 * Follows Clean Architecture principles
 * Orchestrates all layers
 * @Global makes RedisCacheService available to all modules without explicit imports
 */
@Global()
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),

    // Structured Logging
    WinstonLoggerModule,

    // Database Connection
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "pricing_service_db",
      entities: [PricingRuleTypeOrmEntity, PriceCalculationTypeOrmEntity],
      synchronize: process.env.NODE_ENV !== "production",
      logging: process.env.NODE_ENV === "development",
    }),

    // Clean Architecture Layers
    ApplicationModule,
    InterfacesModule,
  ],
  controllers: [],
  providers: [
    // Global Redis Cache Service
    {
      provide: RedisCacheService,
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get("REDIS_HOST", "shared-redis");
        const redisPort = configService.get("REDIS_PORT", 6379);
        const redisPassword = configService.get("REDIS_PASSWORD", "");
        const redisUrl = redisPassword
          ? `redis://:${redisPassword}@${redisHost}:${redisPort}`
          : `redis://${redisHost}:${redisPort}`;
        
        return new RedisCacheService({
          redisUrl,
          prefix: configService.get("REDIS_KEY_PREFIX", "pricing:"),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisCacheService], // Export globally
})
export class AppModule {}
