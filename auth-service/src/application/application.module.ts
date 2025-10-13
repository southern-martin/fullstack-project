import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Use Cases
import { LoginUseCase } from './use-cases/auth/login.use-case';
import { RegisterUseCase } from './use-cases/auth/register.use-case';
import { ValidateTokenUseCase } from './use-cases/auth/validate-token.use-case';

// Domain Services
import { AuthDomainService } from '../domain/services/auth.domain.service';
import { UserDomainService } from '../domain/services/user.domain.service';

// Repository Interfaces (will be implemented in infrastructure)
import { UserRepositoryInterface } from '../domain/repositories/user.repository.interface';
import { RoleRepositoryInterface } from '../domain/repositories/role.repository.interface';

// Infrastructure Implementations
import { UserTypeOrmRepository } from '../infrastructure/database/typeorm/repositories/user.typeorm.repository';
import { RoleTypeOrmRepository } from '../infrastructure/database/typeorm/repositories/role.typeorm.repository';

/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    // Domain Services
    AuthDomainService,
    UserDomainService,

    // Use Cases
    LoginUseCase,
    RegisterUseCase,
    ValidateTokenUseCase,

    // Repository Implementations
    {
      provide: 'UserRepositoryInterface',
      useClass: UserTypeOrmRepository,
    },
    {
      provide: 'RoleRepositoryInterface',
      useClass: RoleTypeOrmRepository,
    },
  ],
  exports: [
    // Export use cases for controllers
    LoginUseCase,
    RegisterUseCase,
    ValidateTokenUseCase,
    
    // Export domain services
    AuthDomainService,
    UserDomainService,
  ],
})
export class ApplicationModule {}