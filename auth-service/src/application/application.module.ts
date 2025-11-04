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
import { AuthValidationService } from "../domain/services/auth-validation.service";
import { AuthBusinessRulesService } from "../domain/services/auth-business-rules.service";
import { TokenService } from "../domain/services/token.service";
import { SecurityService } from "../domain/services/security.service";

// Infrastructure Module
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

// Domain Module
import { DomainModule } from "../domain/domain.module";

// JWT Strategy
import { JwtStrategy } from "../infrastructure/auth/jwt.strategy";

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
    // Import infrastructure module for repository implementations
    InfrastructureModule,
    // Import domain module for new services
    DomainModule,
  ],
  providers: [
    // JWT Strategy
    JwtStrategy,

    // Domain Services
    AuthDomainService,
    UserDomainService,

    // New Granular Services
    AuthValidationService,
    AuthBusinessRulesService,
    TokenService,
    SecurityService,

    // Use Cases
    LoginUseCase,
    RegisterUseCase,
    ValidateTokenUseCase,
  ],
  exports: [
    // Export use cases for controllers
    LoginUseCase,
    RegisterUseCase,
    ValidateTokenUseCase,

    // Export domain services
    AuthDomainService,
    UserDomainService,

    // Export new granular services
    AuthValidationService,
    AuthBusinessRulesService,
    TokenService,
    SecurityService,
  ],
})
export class ApplicationModule {}
