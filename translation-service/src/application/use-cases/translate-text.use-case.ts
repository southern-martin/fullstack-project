import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";
import { LanguageValueRepositoryInterface } from "../../domain/repositories/language-value.repository.interface";
import { LanguageRepositoryInterface } from "../../domain/repositories/language.repository.interface";
import { TranslationDomainService } from "../../domain/services/translation.domain.service";
import { CreateTranslationDto } from "../dto/create-translation.dto";
import { TranslateTextDto } from "../dto/translate-text.dto";
import { ManageTranslationUseCase } from "./manage-translation.use-case";

/**
 * TranslateTextUseCase
 *
 * This use case handles text translation operations, including single text translation
 * and batch translation. It orchestrates between domain services and repositories.
 */
@Injectable()
export class TranslateTextUseCase {
  constructor(
    @Inject("LanguageRepositoryInterface")
    private readonly languageRepository: LanguageRepositoryInterface,
    @Inject("LanguageValueRepositoryInterface")
    private readonly languageValueRepository: LanguageValueRepositoryInterface,
    private readonly translationDomainService: TranslationDomainService,
    private readonly manageTranslationUseCase: ManageTranslationUseCase,
    private readonly logger: WinstonLoggerService
  ) {}

  /**
   * Translates a single text.
   * @param translateTextDto The data for text translation.
   * @returns Translation result with translated text and cache status.
   */
  async execute(translateTextDto: TranslateTextDto): Promise<{
    translatedText: string;
    fromCache: boolean;
  }> {
    // 1. Validate input using domain service
    const validation =
      this.translationDomainService.validateTranslationRequest(
        translateTextDto
      );
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 2. Find target language
    const targetLanguage = await this.languageRepository.findByCode(
      translateTextDto.targetLanguage
    );
    if (!targetLanguage) {
      throw new NotFoundException(
        `Language ${translateTextDto.targetLanguage} not found`
      );
    }

    // 3. Generate translation key using language code (old system)
    const key = this.translationDomainService.generateTranslationKey(
      translateTextDto.text,
      targetLanguage.code
    );

    // 4. Check if translation exists in cache
    const existingTranslation =
      await this.languageValueRepository.findByKeyAndLanguage(
        key,
        targetLanguage.code
      );

    if (existingTranslation) {
      // 5a. Increment usage count for cached translation
      await this.languageValueRepository.incrementUsageCount(
        existingTranslation.id
      );

      return {
        translatedText: existingTranslation.destination,
        fromCache: true,
      };
    }

    // 5b. Perform new translation (placeholder implementation)
    const translatedText = await this.performTranslation(
      translateTextDto.text,
      translateTextDto.sourceLanguage || "auto",
      translateTextDto.targetLanguage
    );

    // 6. Save the translation for future use
    const createTranslationDto: CreateTranslationDto = {
      original: translateTextDto.text,
      destination: translatedText,
      languageCode: targetLanguage.code,
      context: translateTextDto.context,
      isApproved: false, // Mark as pending approval
    };

    await this.manageTranslationUseCase.create(createTranslationDto);

    return {
      translatedText,
      fromCache: false,
    };
  }

  /**
   * Translates multiple texts in batch.
   * @param texts Array of texts to translate.
   * @param targetLanguage Target language code.
   * @param sourceLanguage Source language code (optional).
   * @returns Array of translation results.
   */
  async executeBatch(
    texts: string[],
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<{
    translations: {
      text: string;
      translatedText: string;
      fromCache: boolean;
    }[];
  }> {
    // 1. Validate target language
    const targetLanguageEntity =
      await this.languageRepository.findByCode(targetLanguage);
    if (!targetLanguageEntity) {
      throw new NotFoundException(`Language ${targetLanguage} not found`);
    }

    // 2. Validate texts array
    if (!texts || texts.length === 0) {
      throw new BadRequestException("Texts array cannot be empty");
    }

    if (texts.length > 100) {
      throw new BadRequestException(
        "Cannot translate more than 100 texts at once"
      );
    }

    const results = [];

    // 3. Process each text
    for (const text of texts) {
      try {
        const result = await this.execute({
          text,
          targetLanguage,
          sourceLanguage,
          context: {},
        });

        results.push({
          text,
          translatedText: result.translatedText,
          fromCache: result.fromCache,
        });
      } catch (error) {
        // If individual translation fails, add error result
        results.push({
          text,
          translatedText: text, // Fallback to original text
          fromCache: false,
        });
      }
    }

    return { translations: results };
  }

  /**
   * Gets translation statistics for a language.
   * @param languageCode The language code.
   * @returns Translation statistics.
   */
  async getTranslationStats(languageCode: string): Promise<{
    totalTranslations: number;
    approvedTranslations: number;
    pendingTranslations: number;
    cacheHitRate: number;
  }> {
    const language = await this.languageRepository.findByCode(languageCode);
    if (!language) {
      throw new NotFoundException(`Language ${languageCode} not found`);
    }

    const totalTranslations =
      await this.languageValueRepository.countByLanguage(language.code);
    const approvedTranslations =
      await this.languageValueRepository.countApprovedByLanguage(language.code);
    const pendingTranslations = totalTranslations - approvedTranslations;

    // Calculate cache hit rate (simplified)
    const cacheHitRate =
      approvedTranslations > 0
        ? (approvedTranslations / totalTranslations) * 100
        : 0;

    return {
      totalTranslations,
      approvedTranslations,
      pendingTranslations,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
    };
  }

  /**
   * Performs actual translation using external service.
   * This is a placeholder implementation - in a real scenario,
   * this would integrate with Google Translate, Azure Translator, etc.
   * @param text The text to translate.
   * @param sourceLanguage The source language code.
   * @param targetLanguage The target language code.
   * @returns Translated text.
   */
  private async performTranslation(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> {
    // TODO: Integrate with external translation service
    // For now, return the original text as a placeholder
    // In a real implementation, you would:
    // 1. Call Google Translate API
    // 2. Call Azure Translator API
    // 3. Call AWS Translate API
    // 4. Or any other translation service

    this.logger.debug(
      `Translating "${text}" from ${sourceLanguage} to ${targetLanguage}`,
      "TranslateTextUseCase"
    );

    // Placeholder: return original text with a prefix to indicate it's translated
    return `[${targetLanguage.toUpperCase()}] ${text}`;
  }
}
