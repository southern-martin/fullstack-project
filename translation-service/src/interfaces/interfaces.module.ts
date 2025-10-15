import { Module } from "@nestjs/common";

// Controllers
import { HealthController } from "./controllers/health.controller";
import { TranslationController } from "./controllers/translation.controller";

// Use Cases (from application layer)
import { ManageLanguageUseCase } from "../application/use-cases/manage-language.use-case";
import { ManageTranslationUseCase } from "../application/use-cases/manage-translation.use-case";
import { TranslateTextUseCase } from "../application/use-cases/translate-text.use-case";

// Domain Services
import { TranslationDomainService } from "../domain/services/translation.domain.service";

// Infrastructure
import { LanguageValueRepository } from "../infrastructure/database/typeorm/repositories/language-value.repository";
import { LanguageRepository } from "../infrastructure/database/typeorm/repositories/language.repository";

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  controllers: [TranslationController, HealthController],
  providers: [
    // Use Cases
    ManageLanguageUseCase,
    ManageTranslationUseCase,
    TranslateTextUseCase,

    // Domain Services
    TranslationDomainService,

    // Repository Implementation
    {
      provide: "LanguageRepositoryInterface",
      useClass: LanguageRepository,
    },
    {
      provide: "LanguageValueRepositoryInterface",
      useClass: LanguageValueRepository,
    },
  ],
  exports: [TranslationController, HealthController],
})
export class InterfacesModule {}
