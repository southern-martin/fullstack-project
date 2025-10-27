import { RedisCacheService } from "@fullstack-project/shared-infrastructure";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// TypeORM Entities
import { PermissionTypeOrmEntity } from "./database/typeorm/entities/permission.typeorm.entity";
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
 * - Redis caching service
 */
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      UserTypeOrmEntity,
      RoleTypeOrmEntity,
      PermissionTypeOrmEntity,
    ]),
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
          prefix: configService.get("REDIS_KEY_PREFIX", "auth:"),
        });
      },
      inject: [ConfigService],
    },
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
      provide: "IEventBus",
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
    "IEventBus",
    // Export external services
    KongService,
  ],
})
export class InfrastructureModule {}
