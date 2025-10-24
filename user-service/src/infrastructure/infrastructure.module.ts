import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
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
 * - Database entities and repositories
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
      provide: "EventBusInterface",
      useClass: InMemoryEventBus,
    },
  ],
  exports: [
    "UserRepositoryInterface",
    "RoleRepositoryInterface",
    "UserProfileRepositoryInterface",
    "PermissionRepositoryInterface",
    "EventBusInterface",
  ],
})
export class InfrastructureModule {}
