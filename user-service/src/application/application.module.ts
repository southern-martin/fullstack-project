import { Module } from "@nestjs/common";

// Use Cases
import { CreateRoleUseCase } from "./use-cases/create-role.use-case";
import { CreateUserUseCase } from "./use-cases/create-user.use-case";
import { DeleteRoleUseCase } from "./use-cases/delete-role.use-case";
import { DeleteUserUseCase } from "./use-cases/delete-user.use-case";
import { GetRoleUseCase } from "./use-cases/get-role.use-case";
import { GetUserUseCase } from "./use-cases/get-user.use-case";
import { GetPermissionsUseCase } from "./use-cases/get-permissions.use-case";
import { UpdateRoleUseCase } from "./use-cases/update-role.use-case";
import { UpdateUserUseCase } from "./use-cases/update-user.use-case";

// Profile Use Cases
import { CreateProfileUseCase } from "./use-cases/profile/create-profile.use-case";
import { DeleteProfileUseCase } from "./use-cases/profile/delete-profile.use-case";
import { GetProfileUseCase } from "./use-cases/profile/get-profile.use-case";
import { UpdateProfileUseCase } from "./use-cases/profile/update-profile.use-case";

// Domain Services
import { UserDomainService } from "../domain/services/user.domain.service";

// Application Services
import { PasswordService } from "./services/password.service";

// Infrastructure
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
 *
 * Note: Repository implementations are provided by the Infrastructure Module
 */
@Module({
  imports: [InfrastructureModule],
  providers: [
    // Domain Services - provide with token for @Inject consistency
    {
      provide: "UserDomainService",
      useClass: UserDomainService,
    },

    // Application Services
    PasswordService,

    // User Use Cases
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,

    // Role Use Cases
    CreateRoleUseCase,
    GetRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,

    // Permission Use Cases
    GetPermissionsUseCase,

    // Profile Use Cases
    CreateProfileUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    DeleteProfileUseCase,
  ],
  exports: [
    // Export user use cases
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,

    // Export role use cases
    CreateRoleUseCase,
    GetRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,

    // Export permission use cases
    GetPermissionsUseCase,

    // Export profile use cases
    CreateProfileUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    DeleteProfileUseCase,

    // Export domain services
    "UserDomainService",

    // Export application services
    PasswordService,
  ],
})
export class ApplicationModule {}
