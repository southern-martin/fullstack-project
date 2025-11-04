import { Module } from '@nestjs/common';

// Domain Services
import { AuthValidationService } from './services/auth-validation.service';
import { AuthBusinessRulesService } from './services/auth-business-rules.service';
import { TokenService } from './services/token.service';
import { SecurityService } from './services/security.service';

// Existing Services
import { AuthDomainService } from './services/auth.domain.service';
import { UserDomainService } from './services/user.domain.service';

// Event Bus
import { InMemoryEventBus } from '../infrastructure/events/in-memory-event-bus';

/**
 * Domain Module
 * Contains all domain services and business logic
 * Follows Clean Architecture principles
 */
@Module({
  providers: [
    // New Granular Services
    AuthValidationService,
    AuthBusinessRulesService,
    TokenService,
    SecurityService,

    // Existing Services
    AuthDomainService,
    UserDomainService,

    // Event Bus
    InMemoryEventBus,
  ],
  exports: [
    // New Granular Services
    AuthValidationService,
    AuthBusinessRulesService,
    TokenService,
    SecurityService,

    // Existing Services
    AuthDomainService,
    UserDomainService,

    // Event Bus
    InMemoryEventBus,
  ],
})
export class DomainModule {}
