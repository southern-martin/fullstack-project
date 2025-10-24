import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// TypeORM Entities
import { RoleTypeOrmEntity } from "./database/typeorm/entities/role.typeorm.entity";
import { UserTypeOrmEntity } from "./database/typeorm/entities/user.typeorm.entity";

// Repository Implementations
import { RoleRepository } from "./database/typeorm/repositories/role.repository";
import { UserRepository } from "./database/typeorm/repositories/user.repository";

// Event Bus
import { InMemoryEventBus } from "./events/in-memory-event-bus";

// External Services
import { KongService } from "./external-services/kong.service";

// Repository Interfaces

/**
 * Infrastructure Module
 * Configures infrastructure layer dependencies
 * Follows Clean Architecture principles
 * 
 * Provides:
 * - Database repositories (User, Role)
 * - Event bus for domain events
 * - External services (Kong Gateway)
 */
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserTypeOrmEntity, RoleTypeOrmEntity]),
  ],
  providers: [
    // Repository Implementations
    {
      provide: "UserRepositoryInterface",
      useClass: UserRepository,
    },
    {
      provide: "RoleRepositoryInterface",
      useClass: RoleRepository,
    },
    // Event Bus Implementation
    {
      provide: "EventBusInterface",
      useClass: InMemoryEventBus,
    },
    // External Services
    KongService,
  ],
  exports: [
    // Export repository implementations
    "UserRepositoryInterface",
    "RoleRepositoryInterface",
    // Export event bus
    "EventBusInterface",
    // Export external services
    KongService,
  ],
})
export class InfrastructureModule {}
