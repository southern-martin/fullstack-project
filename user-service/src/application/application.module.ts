import { Module } from "@nestjs/common";

// Use Cases
import { CreateRoleUseCase } from "./use-cases/create-role.use-case";
import { CreateUserUseCase } from "./use-cases/create-user.use-case";
import { DeleteRoleUseCase } from "./use-cases/delete-role.use-case";
import { DeleteUserUseCase } from "./use-cases/delete-user.use-case";
import { GetRoleUseCase } from "./use-cases/get-role.use-case";
import { GetUserUseCase } from "./use-cases/get-user.use-case";
import { UpdateRoleUseCase } from "./use-cases/update-role.use-case";
import { UpdateUserUseCase } from "./use-cases/update-user.use-case";

// Domain Services
import { UserDomainService } from "../domain/services/user.domain.service";

/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
 * 
 * Note: Repository implementations are provided by the Infrastructure Module
 */
@Module({
  providers: [
    // Domain Services
    UserDomainService,

    // Use Cases
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    CreateRoleUseCase,
    GetRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
  ],
  exports: [
    // Export use cases for controllers
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    CreateRoleUseCase,
    GetRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,

    // Export domain services
    UserDomainService,
  ],
})
export class ApplicationModule {}
