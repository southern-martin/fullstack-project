import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

// Use Cases
import { LoginUseCase } from "./use-cases/auth/login.use-case";
import { RegisterUseCase } from "./use-cases/auth/register.use-case";
import { ValidateTokenUseCase } from "./use-cases/auth/validate-token.use-case";

// Domain Services
import { AuthDomainService } from "../domain/services/auth.domain.service";
import { UserDomainService } from "../domain/services/user.domain.service";

// Repository Interfaces (will be implemented in infrastructure)

// Infrastructure Implementations
import { RoleRepository } from "../infrastructure/database/typeorm/repositories/role.repository";
import { UserRepository } from "../infrastructure/database/typeorm/repositories/user.repository";

/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "1h" },
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
      provide: "UserRepositoryInterface",
      useClass: UserRepository,
    },
    {
      provide: "RoleRepositoryInterface",
      useClass: RoleRepository,
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
