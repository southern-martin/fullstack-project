import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { createHash } from "crypto";
import { LanguageValue } from "../../domain/entities/language-value.entity";
import { Language } from "../../domain/entities/language.entity";
import { LanguageValueRepositoryInterface } from "../../domain/repositories/language-value.repository.interface";
import { LanguageRepositoryInterface } from "../../domain/repositories/language.repository.interface";
import { CreateLanguageDto } from "../dto/create-language.dto";
import { CreateTranslationDto } from "../dto/create-translation.dto";
import { LanguageResponseDto } from "../dto/language-response.dto";
import { TranslateTextDto } from "../dto/translate-text.dto";
import { TranslationResponseDto } from "../dto/translation-response.dto";
import { UpdateLanguageDto } from "../dto/update-language.dto";
import { UpdateTranslationDto } from "../dto/update-translation.dto";

@Injectable()
export class TranslationService {
  constructor(
    @Inject("LanguageRepositoryInterface")
    private readonly languageRepository: LanguageRepositoryInterface,
    @Inject("LanguageValueRepositoryInterface")
    private readonly languageValueRepository: LanguageValueRepositoryInterface
  ) {}

  // Language Management
  async createLanguage(
    createLanguageDto: CreateLanguageDto
  ): Promise<LanguageResponseDto> {
    // Check if language code already exists
    const existingLanguage = await this.languageRepository.findByCode(
      createLanguageDto.code
    );
    if (existingLanguage) {
      throw new ConflictException(
        `Language with code ${createLanguageDto.code} already exists`
      );
    }

    // If this is set as default, unset other defaults
    if (createLanguageDto.isDefault) {
      const currentDefault = await this.languageRepository.findDefault();
      if (currentDefault) {
        await this.languageRepository.update(currentDefault.id, {
          isDefault: false,
        });
      }
    }

    const language = new Language();
    language.code = createLanguageDto.code;
    language.name = createLanguageDto.name;
    language.nativeName =
      createLanguageDto.nativeName || createLanguageDto.name;
    language.isActive = createLanguageDto.isActive ?? true;
    language.isDefault = createLanguageDto.isDefault ?? false;
    language.metadata = createLanguageDto.metadata || {};

    const savedLanguage = await this.languageRepository.create(language);
    return plainToClass(LanguageResponseDto, savedLanguage, {
      excludeExtraneousValues: true,
    });
  }

  async findAllLanguages(): Promise<LanguageResponseDto[]> {
    const languages = await this.languageRepository.findAll();
    return languages.map((language) =>
      plainToClass(LanguageResponseDto, language, {
        excludeExtraneousValues: true,
      })
    );
  }

  async findActiveLanguages(): Promise<LanguageResponseDto[]> {
    const languages = await this.languageRepository.findActive();
    return languages.map((language) =>
      plainToClass(LanguageResponseDto, language, {
        excludeExtraneousValues: true,
      })
    );
  }

  async findLanguageById(id: number): Promise<LanguageResponseDto> {
    const language = await this.languageRepository.findById(id);
    if (!language) {
      throw new NotFoundException("Language not found");
    }
    return plainToClass(LanguageResponseDto, language, {
      excludeExtraneousValues: true,
    });
  }

  async findLanguageByCode(code: string): Promise<LanguageResponseDto> {
    const language = await this.languageRepository.findByCode(code);
    if (!language) {
      throw new NotFoundException("Language not found");
    }
    return plainToClass(LanguageResponseDto, language, {
      excludeExtraneousValues: true,
    });
  }

  async updateLanguage(
    id: number,
    updateLanguageDto: UpdateLanguageDto
  ): Promise<LanguageResponseDto> {
    const language = await this.languageRepository.findById(id);
    if (!language) {
      throw new NotFoundException("Language not found");
    }

    // If this is set as default, unset other defaults
    if (updateLanguageDto.isDefault) {
      const currentDefault = await this.languageRepository.findDefault();
      if (currentDefault && currentDefault.id !== id) {
        await this.languageRepository.update(currentDefault.id, {
          isDefault: false,
        });
      }
    }

    const updatedLanguage = await this.languageRepository.update(
      id,
      updateLanguageDto
    );
    return plainToClass(LanguageResponseDto, updatedLanguage, {
      excludeExtraneousValues: true,
    });
  }

  async deleteLanguage(id: number): Promise<void> {
    const language = await this.languageRepository.findById(id);
    if (!language) {
      throw new NotFoundException("Language not found");
    }
    await this.languageRepository.delete(id);
  }

  // Translation Management
  async createTranslation(
    createTranslationDto: CreateTranslationDto
  ): Promise<TranslationResponseDto> {
    const key = this.generateMD5Key(
      createTranslationDto.originalText,
      createTranslationDto.languageId
    );

    // Check if translation already exists
    const existingTranslation =
      await this.languageValueRepository.findByKeyAndLanguage(
        key,
        createTranslationDto.languageId
      );
    if (existingTranslation) {
      throw new ConflictException("Translation already exists");
    }

    const languageValue = new LanguageValue();
    languageValue.key = key;
    languageValue.originalText = createTranslationDto.originalText;
    languageValue.translatedText = createTranslationDto.translatedText;
    languageValue.languageId = createTranslationDto.languageId;
    languageValue.context = createTranslationDto.context || {};
    languageValue.isApproved = createTranslationDto.isApproved ?? false;

    const savedTranslation =
      await this.languageValueRepository.create(languageValue);
    return plainToClass(TranslationResponseDto, savedTranslation, {
      excludeExtraneousValues: true,
    });
  }

  async findAllTranslations(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ translations: TranslationResponseDto[]; total: number }> {
    const { languageValues, total } =
      await this.languageValueRepository.findAll(page, limit, search);
    const translationDtos = languageValues.map((translation) =>
      plainToClass(TranslationResponseDto, translation, {
        excludeExtraneousValues: true,
      })
    );
    return { translations: translationDtos, total };
  }

  async findTranslationById(id: number): Promise<TranslationResponseDto> {
    const translation = await this.languageValueRepository.findById(id);
    if (!translation) {
      throw new NotFoundException("Translation not found");
    }
    return plainToClass(TranslationResponseDto, translation, {
      excludeExtraneousValues: true,
    });
  }

  async updateTranslation(
    id: number,
    updateTranslationDto: UpdateTranslationDto
  ): Promise<TranslationResponseDto> {
    const translation = await this.languageValueRepository.findById(id);
    if (!translation) {
      throw new NotFoundException("Translation not found");
    }

    const updatedTranslation = await this.languageValueRepository.update(
      id,
      updateTranslationDto
    );
    return plainToClass(TranslationResponseDto, updatedTranslation, {
      excludeExtraneousValues: true,
    });
  }

  async deleteTranslation(id: number): Promise<void> {
    const translation = await this.languageValueRepository.findById(id);
    if (!translation) {
      throw new NotFoundException("Translation not found");
    }
    await this.languageValueRepository.delete(id);
  }

  // Translation Operations
  async translateText(
    translateTextDto: TranslateTextDto
  ): Promise<{ translatedText: string; fromCache: boolean }> {
    // Find target language
    const targetLanguage = await this.languageRepository.findByCode(
      translateTextDto.targetLanguage
    );
    if (!targetLanguage) {
      throw new NotFoundException(
        `Language ${translateTextDto.targetLanguage} not found`
      );
    }

    const key = this.generateMD5Key(translateTextDto.text, targetLanguage.id);

    // Check if translation exists in cache
    const existingTranslation =
      await this.languageValueRepository.findByKeyAndLanguage(
        key,
        targetLanguage.id
      );

    if (existingTranslation) {
      // Increment usage count
      await this.languageValueRepository.incrementUsageCount(
        existingTranslation.id
      );
      return {
        translatedText: existingTranslation.translatedText,
        fromCache: true,
      };
    }

    // For now, return the original text (in a real implementation, you would call an external translation API)
    // TODO: Integrate with external translation service (Google Translate, Azure Translator, etc.)
    const translatedText = translateTextDto.text; // Placeholder

    // Save the translation for future use
    const createTranslationDto: CreateTranslationDto = {
      originalText: translateTextDto.text,
      translatedText,
      languageId: targetLanguage.id,
      context: translateTextDto.context,
      isApproved: false, // Mark as pending approval
    };

    await this.createTranslation(createTranslationDto);

    return {
      translatedText,
      fromCache: false,
    };
  }

  async translateBatch(body: {
    texts: string[];
    targetLanguage: string;
    sourceLanguage: string;
  }): Promise<{
    translations: {
      text: string;
      translatedText: string;
      fromCache: boolean;
    }[];
  }> {
    // Find target language
    const targetLanguage = await this.languageRepository.findByCode(
      body.targetLanguage
    );
    if (!targetLanguage) {
      throw new NotFoundException(`Language ${body.targetLanguage} not found`);
    }

    const results = [];

    // Process each text
    for (const text of body.texts) {
      const key = this.generateMD5Key(text, targetLanguage.id);

      // Check if translation exists in cache
      const existingTranslation =
        await this.languageValueRepository.findByKeyAndLanguage(
          key,
          targetLanguage.id
        );

      if (existingTranslation) {
        // Increment usage count
        await this.languageValueRepository.update(existingTranslation.id, {
          usageCount: existingTranslation.usageCount + 1,
          lastUsedAt: new Date(),
        });

        results.push({
          text,
          translatedText: existingTranslation.translatedText,
          fromCache: true,
        });
      } else {
        // For now, return the original text (in a real implementation, you would call an external translation API)
        // TODO: Integrate with external translation service (Google Translate, Azure Translator, etc.)
        const translatedText = text; // Placeholder

        // Save the translation for future use
        const createTranslationDto: CreateTranslationDto = {
          originalText: text,
          translatedText,
          languageId: targetLanguage.id,
          context: {},
          isApproved: false, // Mark as pending approval
        };

        await this.createTranslation(createTranslationDto);

        results.push({
          text,
          translatedText,
          fromCache: false,
        });
      }
    }

    return { translations: results };
  }

  async approveTranslation(
    id: number,
    approvedBy: string
  ): Promise<TranslationResponseDto> {
    const translation = await this.languageValueRepository.findById(id);
    if (!translation) {
      throw new NotFoundException("Translation not found");
    }

    const updatedTranslation = await this.languageValueRepository.update(id, {
      isApproved: true,
      approvedBy,
      approvedAt: new Date(),
    });

    return plainToClass(TranslationResponseDto, updatedTranslation, {
      excludeExtraneousValues: true,
    });
  }

  async findPendingApprovals(): Promise<TranslationResponseDto[]> {
    const pendingTranslations =
      await this.languageValueRepository.findPendingApproval();
    return pendingTranslations.map((translation) =>
      plainToClass(TranslationResponseDto, translation, {
        excludeExtraneousValues: true,
      })
    );
  }

  // Utility Methods
  private generateMD5Key(text: string, languageId?: number): string {
    if (!text || typeof text !== "string") {
      throw new Error("Text must be a non-empty string");
    }
    const keyData = languageId ? `${text.trim()}_${languageId}` : text.trim();
    return createHash("md5").update(keyData).digest("hex");
  }

  async getLanguageCount(): Promise<{ count: number }> {
    const count = await this.languageRepository.count();
    return { count };
  }

  async getTranslationCount(): Promise<{ count: number }> {
    const count = await this.languageValueRepository.count();
    return { count };
  }
}
