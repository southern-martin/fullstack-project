import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisCacheService } from "@fullstack-project/shared-infrastructure";
import { PermissionTypeOrmEntity } from "./database/typeorm/entities/permission.typeorm.entity";
import { RoleTypeOrmEntity } from "./database/typeorm/entities/role.typeorm.entity";
import { UserProfileTypeOrmEntity } from "./database/typeorm/entities/user-profile.typeorm.entity";
import { UserTypeOrmEntity } from "./database/typeorm/entities/user.typeorm.entity";
import { PermissionTypeOrmRepository } from "./database/typeorm/repositories/permission.typeorm.repository";
import { RoleTypeOrmRepository } from "./database/typeorm/repositories/role.typeorm.repository";
import { UserProfileTypeOrmRepository } from "./database/typeorm/repositories/user-profile.typeorm.repository";
import { UserTypeOrmRepository } from "./database/typeorm/repositories/user.typeorm.repository";
import { InMemoryEventBus } from "./events/in-memory-event-bus";

/**
 * Infrastructure Module
 *
 * This module configures all infrastructure layer dependencies including:
 * - Database entities and repositories with Redis caching
 * - Event bus for domain events
 * - External service integrations
 * - Infrastructure-specific configurations
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTypeOrmEntity,
      RoleTypeOrmEntity,
      UserProfileTypeOrmEntity,
      PermissionTypeOrmEntity,
    ]),
  ],
  providers: [
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
          prefix: configService.get("REDIS_KEY_PREFIX", "user:"),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: "UserRepositoryInterface",
      useClass: UserTypeOrmRepository,
    },
    {
      provide: "RoleRepositoryInterface",
      useClass: RoleTypeOrmRepository,
    },
    {
      provide: "UserProfileRepositoryInterface",
      useClass: UserProfileTypeOrmRepository,
    },
    {
      provide: "PermissionRepositoryInterface",
      useClass: PermissionTypeOrmRepository,
    },
    {
      provide: "IEventBus",
      useClass: InMemoryEventBus,
    },
  ],
  exports: [
    "UserRepositoryInterface",
    "RoleRepositoryInterface",
    "UserProfileRepositoryInterface",
    "PermissionRepositoryInterface",
    "IEventBus",
    RedisCacheService,
  ],
})
export class InfrastructureModule {}
