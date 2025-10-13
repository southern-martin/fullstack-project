import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Use Cases
import { LoginUseCase } from './use-cases/login.use-case';
import { RegisterUseCase } from './use-cases/register.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';

// Domain Services
import { AuthDomainService } from '../domain/services/auth.domain.service';
import { UserDomainService } from '../domain/services/user.domain.service';

// Repository Interfaces
import { UserRepositoryInterface } from '../domain/repositories/user.repository.interface';
import { RoleRepositoryInterface } from '../domain/repositories/role.repository.interface';

// Infrastructure
import { UserTypeOrmRepository } from '../infrastructure/repositories/user.typeorm.repository';
import { RoleTypeOrmRepository } from '../infrastructure/repositories/role.typeorm.repository';

// Shared Services
import { EventBusService } from '../../../shared/services/event-bus.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn', '24h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    // Use Cases
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,

    // Domain Services
    AuthDomainService,
    UserDomainService,

    // Repository Implementations
    {
      provide: 'UserRepositoryInterface',
      useClass: UserTypeOrmRepository,
    },
    {
      provide: 'RoleRepositoryInterface',
      useClass: RoleTypeOrmRepository,
    },

    // Shared Services
    EventBusService,
  ],
  exports: [
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    AuthDomainService,
    UserDomainService,
  ],
})
export class AuthApplicationModule {}
