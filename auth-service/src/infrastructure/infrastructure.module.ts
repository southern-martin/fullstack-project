import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// TypeORM Entities
import { RoleTypeOrmEntity } from "./database/typeorm/entities/role.typeorm.entity";
import { UserTypeOrmEntity } from "./database/typeorm/entities/user.typeorm.entity";

// Repository Implementations
import { RoleRepository } from "./database/typeorm/repositories/role.repository";
import { UserRepository } from "./database/typeorm/repositories/user.repository";

// Repository Interfaces

/**
 * Infrastructure Module
 * Configures infrastructure layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity, RoleTypeOrmEntity])],
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
  ],
  exports: [
    // Export repository implementations
    "UserRepositoryInterface",
    "RoleRepositoryInterface",
  ],
})
export class InfrastructureModule {}
