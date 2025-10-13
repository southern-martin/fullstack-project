import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

// Controllers
import { AuthController } from './controllers/auth.controller';

// Use Cases (from application layer)
import { LoginUseCase } from '../application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../application/use-cases/auth/register.use-case';
import { ValidateTokenUseCase } from '../application/use-cases/auth/validate-token.use-case';

// Domain Services
import { AuthDomainService } from '../domain/services/auth.domain.service';
import { UserDomainService } from '../domain/services/user.domain.service';

// Infrastructure
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [
    PassportModule,
    InfrastructureModule,
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    // Use Cases
    LoginUseCase,
    RegisterUseCase,
    ValidateTokenUseCase,

    // Domain Services
    AuthDomainService,
    UserDomainService,
  ],
})
export class InterfacesModule {}
