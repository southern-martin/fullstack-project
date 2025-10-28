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

// Consul Configuration
import { createTypeOrmConsulConfig } from "./infrastructure/config/typeorm-consul.config";
import { createRedisConsulConfig } from "./infrastructure/config/redis-consul.config";

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

    // Database - Configured from Consul KV Store
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return await createTypeOrmConsulConfig();
      },
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
      useFactory: async () => {
        const redisConfig = await createRedisConsulConfig();
        const redisUrl = redisConfig.password
          ? `redis://:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}`
          : `redis://${redisConfig.host}:${redisConfig.port}`;
        
        return new RedisCacheService({
          redisUrl,
          prefix: redisConfig.keyPrefix,
        });
      },
    },
  ],
  exports: [RedisCacheService], // Export globally
})
export class AppModule {}
