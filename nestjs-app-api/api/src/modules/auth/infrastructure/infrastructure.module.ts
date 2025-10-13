import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// Entities
import { Role } from "../domain/entities/role.entity";
import { User } from "../domain/entities/user.entity";

// Repository Implementations
import { RoleTypeOrmRepository } from "./repositories/role.typeorm.repository";
import { UserTypeOrmRepository } from "./repositories/user.typeorm.repository";

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserTypeOrmRepository, RoleTypeOrmRepository],
  exports: [UserTypeOrmRepository, RoleTypeOrmRepository],
})
export class AuthInfrastructureModule {}
