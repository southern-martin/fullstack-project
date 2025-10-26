import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// Shared Infrastructure
import { RedisCacheService } from "@shared/infrastructure";

// Use Cases
import { CreateCarrierUseCase } from "./use-cases/create-carrier.use-case";
import { DeleteCarrierUseCase } from "./use-cases/delete-carrier.use-case";
import { GetCarrierUseCase } from "./use-cases/get-carrier.use-case";
import { UpdateCarrierUseCase } from "./use-cases/update-carrier.use-case";

// Domain Services
import { CarrierDomainService } from "../domain/services/carrier.domain.service";

// Repository Interfaces (will be implemented in infrastructure)

// Infrastructure Implementations
import { CarrierTypeOrmEntity } from "../infrastructure/database/typeorm/entities/carrier.typeorm.entity";
import { CarrierRepository } from "../infrastructure/database/typeorm/repositories/carrier.repository";
import { RedisEventBus } from "../infrastructure/events/redis-event-bus";

/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [
    ConfigModule,
    // Register TypeORM entity for dependency injection
    TypeOrmModule.forFeature([CarrierTypeOrmEntity]),
  ],
  providers: [
    // Redis Cache Service
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
          prefix: configService.get("REDIS_KEY_PREFIX", "carrier:"),
        });
      },
      inject: [ConfigService],
    },

    // Domain Services
    CarrierDomainService,

    // Use Cases
    CreateCarrierUseCase,
    GetCarrierUseCase,
    UpdateCarrierUseCase,
    DeleteCarrierUseCase,

    // Repository Implementations
    {
      provide: "CarrierRepositoryInterface",
      useClass: CarrierRepository,
    },

    // Event Bus Implementation
    {
      provide: "IEventBus",
      useClass: RedisEventBus,
    },
  ],
  exports: [
    // Export use cases for controllers
    CreateCarrierUseCase,
    GetCarrierUseCase,
    UpdateCarrierUseCase,
    DeleteCarrierUseCase,

    // Export domain services
    CarrierDomainService,

    // Export repository interface for controllers if needed
    "CarrierRepositoryInterface",

    // Export event bus for other modules
    "IEventBus",
  ],
})
export class ApplicationModule {}
