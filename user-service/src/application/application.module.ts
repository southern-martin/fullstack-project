import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Shared Infrastructure
import { RedisCacheService } from '@shared/infrastructure';

// Use Cases
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { CreateRoleUseCase } from './use-cases/create-role.use-case';
import { DeleteRoleUseCase } from './use-cases/delete-role.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { GetRoleUseCase } from './use-cases/get-role.use-case';
import { GetUserUseCase } from './use-cases/get-user.use-case';
import { GetPermissionsUseCase } from './use-cases/get-permissions.use-case';
import { UpdateRoleUseCase } from './use-cases/update-role.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';

// Profile Use Cases
import { CreateProfileUseCase } from './use-cases/profile/create-profile.use-case';
import { DeleteProfileUseCase } from './use-cases/profile/delete-profile.use-case';
import { GetProfileUseCase } from './use-cases/profile/get-profile.use-case';
import { UpdateProfileUseCase } from './use-cases/profile/update-profile.use-case';

// Domain Services
import { UserDomainService } from '../domain/services/user.domain.service';
import { UserValidationService } from '../domain/services/user-validation.service';
import { UserBusinessRulesService } from '../domain/services/user-business-rules.service';
import { UserFactoryService } from '../domain/services/user-factory.service';
import { UserPermissionService } from '../domain/services/user-permission.service';
import { UserDisplayService } from '../domain/services/user-display.service';

// Application Services
import { PasswordService } from './services/password.service';

// Infrastructure
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
 *
 * Note: Repository implementations are provided by by Infrastructure Module
 */
@Module({
  imports: [
    ConfigModule,
    InfrastructureModule,
  ],
  providers: [
    // Redis Cache Service
    {
      provide: RedisCacheService,
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get('REDIS_HOST', 'shared-redis');
        const redisPort = configService.get('REDIS_PORT', 6379);
        const redisPassword = configService.get('REDIS_PASSWORD', '');
        const redisUrl = redisPassword
          ? `redis://:${redisPassword}@${redisHost}:${redisPort}`
          : `redis://${redisHost}:${redisPort}`;

        return new RedisCacheService({
          redisUrl,
          prefix: configService.get('REDIS_KEY_PREFIX', 'user:'),
        });
      },
      inject: [ConfigService],
    },

    // Domain Services - provide with token for @Inject consistency
    {
      provide: 'UserDomainService',
      useClass: UserDomainService,
    },

    // Validation Service
    UserValidationService,

    // Business Rules Service
    UserBusinessRulesService,

    // Factory Service
    UserFactoryService,

    // Permission Service
    UserPermissionService,

    // Display Service
    UserDisplayService,

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
    // Re-export infrastructure module (includes repositories, event bus, etc.)
    InfrastructureModule,

    // Export Redis cache service for health checks
    RedisCacheService,

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
    'UserDomainService',
    UserValidationService,
    UserBusinessRulesService,
    UserFactoryService,
    UserPermissionService,
    UserDisplayService,

    // Export application services
    PasswordService,
  ],
})
export class ApplicationModule {}
