import { Module } from '@nestjs/common';

// Controllers
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { HealthController } from './controllers/health.controller';

// Use Cases (from application layer)
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { CreateRoleUseCase } from '../application/use-cases/create-role.use-case';
import { GetRoleUseCase } from '../application/use-cases/get-role.use-case';
import { UpdateRoleUseCase } from '../application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from '../application/use-cases/delete-role.use-case';

// Domain Services
import { UserDomainService } from '../domain/services/user.domain.service';

// Infrastructure
import { UserRepository } from '../infrastructure/user.repository';
import { RoleRepository } from '../infrastructure/role.repository';

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  controllers: [
    UserController,
    RoleController,
    HealthController,
  ],
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
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'RoleRepositoryInterface',
      useClass: RoleRepository,
    },
  ],
})
export class InterfacesModule {}
