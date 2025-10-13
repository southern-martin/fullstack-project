import { Module } from "@nestjs/common";

// Controllers
import { HealthController } from "./controllers/health.controller";
import { RoleController } from "./controllers/role.controller";
import { UserController } from "./controllers/user.controller";

// Use Cases (from application layer)
import { CreateRoleUseCase } from "../application/use-cases/create-role.use-case";
import { CreateUserUseCase } from "../application/use-cases/create-user.use-case";
import { DeleteRoleUseCase } from "../application/use-cases/delete-role.use-case";
import { DeleteUserUseCase } from "../application/use-cases/delete-user.use-case";
import { GetRoleUseCase } from "../application/use-cases/get-role.use-case";
import { GetUserUseCase } from "../application/use-cases/get-user.use-case";
import { UpdateRoleUseCase } from "../application/use-cases/update-role.use-case";
import { UpdateUserUseCase } from "../application/use-cases/update-user.use-case";

// Domain Services
import { UserDomainService } from "../domain/services/user.domain.service";

// Infrastructure
import { RoleRepository } from "../infrastructure/role.repository";
import { UserRepository } from "../infrastructure/user.repository";

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  controllers: [UserController, RoleController, HealthController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    CreateRoleUseCase,
    GetRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,

    // Domain Services
    UserDomainService,

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
})
export class InterfacesModule {}
