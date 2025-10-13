import { Module } from '@nestjs/common';

// Use Cases
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { GetUserUseCase } from './use-cases/get-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { CreateRoleUseCase } from './use-cases/create-role.use-case';
import { GetRoleUseCase } from './use-cases/get-role.use-case';
import { UpdateRoleUseCase } from './use-cases/update-role.use-case';
import { DeleteRoleUseCase } from './use-cases/delete-role.use-case';

// Domain Services
import { UserDomainService } from '../domain/services/user.domain.service';

// Repository Interfaces (will be implemented in infrastructure)
import { UserRepositoryInterface } from '../domain/repositories/user.repository.interface';
import { RoleRepositoryInterface } from '../domain/repositories/role.repository.interface';

// Infrastructure Implementations
import { UserRepository } from '../infrastructure/user.repository';
import { RoleRepository } from '../infrastructure/role.repository';

/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
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
