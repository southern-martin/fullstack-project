import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

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
    // Register TypeORM entity for dependency injection
    TypeOrmModule.forFeature([CarrierTypeOrmEntity]),
  ],
  providers: [
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
