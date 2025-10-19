import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PaginationDto } from "@shared/infrastructure";
import { Language } from "../../domain/entities/language.entity";
import { LanguageRepositoryInterface } from "../../domain/repositories/language.repository.interface";
import { TranslationDomainService } from "../../domain/services/translation.domain.service";
import { CreateLanguageDto } from "../dto/create-language.dto";
import { LanguageResponseDto } from "../dto/language-response.dto";
import { UpdateLanguageDto } from "../dto/update-language.dto";

/**
 * ManageLanguageUseCase
 *
 * This use case handles the creation, retrieval, update, and deletion of languages.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
@Injectable()
export class ManageLanguageUseCase {
  constructor(
    @Inject("LanguageRepositoryInterface")
    private readonly languageRepository: LanguageRepositoryInterface,
    private readonly translationDomainService: TranslationDomainService
  ) {}

  /**
   * Creates a new language.
   * @param createLanguageDto The data for creating the language.
   * @returns Created language response
   */
  async create(
    createLanguageDto: CreateLanguageDto
  ): Promise<LanguageResponseDto> {
    // 1. Validate input using domain service
    const validation =
      this.translationDomainService.validateLanguageCreationData(
        createLanguageDto
      );
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 2. Check if language code already exists
    const existingLanguage = await this.languageRepository.findByCode(
      createLanguageDto.code
    );
    if (existingLanguage) {
      throw new ConflictException(
        `Language with code ${createLanguageDto.code} already exists`
      );
    }

    // 3. If this is set as default, unset other defaults
    if (createLanguageDto.isDefault) {
      const currentDefault = await this.languageRepository.findDefault();
      if (currentDefault) {
        await this.languageRepository.update(currentDefault.code, {
          isDefault: false,
        });
      }
    }

    // 4. Create language entity (old system fields)
    const language = new Language({
      code: createLanguageDto.code,
      name: createLanguageDto.name,
      localName: createLanguageDto.localName || createLanguageDto.name,
      status: createLanguageDto.status || 'active',
      flag: createLanguageDto.flag,
      isDefault: createLanguageDto.isDefault ?? false,
      metadata: createLanguageDto.metadata || {},
    });

    // 5. Save language in repository
    const savedLanguage = await this.languageRepository.create(language);

    // 6. Return response
    return LanguageResponseDto.fromDomain(savedLanguage);
  }

  /**
   * Retrieves a language by its code (primary key in old system).
   * @param code The language code.
   * @returns The language response DTO.
   * @throws NotFoundException if the language is not found.
   */
  async getById(code: string): Promise<LanguageResponseDto> {
    const language = await this.languageRepository.findById(code);
    if (!language) {
      throw new NotFoundException("Language not found");
    }
    return LanguageResponseDto.fromDomain(language);
  }

  /**
   * Retrieves a language by its code.
   * @param code The language code.
   * @returns The language response DTO.
   * @throws NotFoundException if the language is not found.
   */
  async getByCode(code: string): Promise<LanguageResponseDto> {
    const language = await this.languageRepository.findByCode(code);
    if (!language) {
      throw new NotFoundException("Language not found");
    }
    return LanguageResponseDto.fromDomain(language);
  }

  /**
   * Retrieves all languages with pagination.
   * @param pagination Pagination parameters
   * @returns A paginated list of language response DTOs.
   */
  async getAll(pagination?: PaginationDto): Promise<{
    languages: LanguageResponseDto[];
    total: number;
  }> {
    if (pagination) {
      const result = await this.languageRepository.findPaginated(pagination);
      return {
        languages: result.languages.map((language) =>
          this.mapToResponseDto(language)
        ),
        total: result.total,
      };
    } else {
      const languages = await this.languageRepository.findActive();
      return {
        languages: languages.map((language) => this.mapToResponseDto(language)),
        total: languages.length,
      };
    }
  }

  /**
   * Retrieves all active languages.
   * @returns A list of active language response DTOs.
   */
  async getActive(): Promise<LanguageResponseDto[]> {
    const languages = await this.languageRepository.findActive();
    return languages.map((language) => this.mapToResponseDto(language));
  }

  /**
   * Retrieves the total count of languages.
   * @returns An object containing the total count.
   */
  async getCount(): Promise<{ count: number }> {
    const count = await this.languageRepository.count();
    return { count };
  }

  /**
   * Updates an existing language.
   * @param code The language code (primary key).
   * @param updateLanguageDto The data for updating the language.
   * @returns Updated language response
   */
  async update(
    code: string,
    updateLanguageDto: UpdateLanguageDto
  ): Promise<LanguageResponseDto> {
    // 1. Find existing language
    const existingLanguage = await this.languageRepository.findById(code);
    if (!existingLanguage) {
      throw new NotFoundException("Language not found");
    }

    // 2. Validate update data using domain service
    const validation =
      this.translationDomainService.validateLanguageUpdateData(
        updateLanguageDto
      );
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 3. If this is set as default, unset other defaults
    if (updateLanguageDto.isDefault) {
      const currentDefault = await this.languageRepository.findDefault();
      if (currentDefault && currentDefault.code !== code) {
        await this.languageRepository.update(currentDefault.code, {
          isDefault: false,
        });
      }
    }

    // 4. Update language in repository
    const updatedLanguage = await this.languageRepository.update(
      code,
      updateLanguageDto
    );

    // 5. Return response
    return LanguageResponseDto.fromDomain(updatedLanguage);
  }

  /**
   * Deletes a language.
   * @param code The language code (primary key).
   * @throws NotFoundException if the language is not found.
   * @throws BadRequestException if the language cannot be deleted due to business rules.
   */
  async delete(code: string): Promise<void> {
    // 1. Find existing language
    const existingLanguage = await this.languageRepository.findById(code);
    if (!existingLanguage) {
      throw new NotFoundException("Language not found");
    }

    // 2. Apply business rules for deletion
    // For now, we'll assume we can check if language has translations
    const hasTranslations = false; // This would come from a translation repository

    if (
      !this.translationDomainService.canDeleteLanguage(
        existingLanguage,
        hasTranslations
      )
    ) {
      throw new BadRequestException(
        "Cannot delete default language or language with existing translations"
      );
    }

    // 3. Delete language from repository
    await this.languageRepository.delete(code);
  }

  /**
   * Maps a domain Language entity to a LanguageResponseDto.
   * @param language The domain Language entity.
   * @returns The LanguageResponseDto.
   */
  private mapToResponseDto(language: Language): LanguageResponseDto {
    return LanguageResponseDto.fromDomain(language);
  }
}
