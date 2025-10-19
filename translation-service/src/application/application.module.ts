import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// Use Cases
import { ManageLanguageUseCase } from "./use-cases/manage-language.use-case";
import { ManageTranslationUseCase } from "./use-cases/manage-translation.use-case";
import { TranslateTextUseCase } from "./use-cases/translate-text.use-case";

// Domain Services
import { TranslationDomainService } from "../domain/services/translation.domain.service";

// Repository Interfaces (will be implemented in infrastructure)

// Infrastructure Implementations
import { LanguageValueRepository } from "../infrastructure/database/typeorm/repositories/language-value.repository";
import { LanguageRepository } from "../infrastructure/database/typeorm/repositories/language.repository";
import { LanguageTypeOrmEntity } from "../infrastructure/database/typeorm/entities/language.typeorm.entity";
import { LanguageValueTypeOrmEntity } from "../infrastructure/database/typeorm/entities/language-value.typeorm.entity";

/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [
    // Register TypeORM entities for dependency injection
    TypeOrmModule.forFeature([LanguageTypeOrmEntity, LanguageValueTypeOrmEntity]),
  ],
  providers: [
    // Domain Services
    TranslationDomainService,

    // Use Cases
    ManageLanguageUseCase,
    ManageTranslationUseCase,
    TranslateTextUseCase,

    // Repository Implementations
    {
      provide: "LanguageRepositoryInterface",
      useClass: LanguageRepository,
    },
    {
      provide: "LanguageValueRepositoryInterface",
      useClass: LanguageValueRepository,
    },
  ],
  exports: [
    // Export use cases and domain services for use by the interfaces layer
    ManageLanguageUseCase,
    ManageTranslationUseCase,
    TranslateTextUseCase,

    // Export domain services
    TranslationDomainService,

    // Export repository interfaces for controllers if needed
    "LanguageRepositoryInterface",
    "LanguageValueRepositoryInterface",
  ],
})
export class ApplicationModule {}
