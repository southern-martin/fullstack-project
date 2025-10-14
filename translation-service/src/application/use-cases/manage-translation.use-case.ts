import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PaginationDto } from "@shared/infrastructure";
import { LanguageValue } from "../../domain/entities/language-value.entity";
import { LanguageValueRepositoryInterface } from "../../domain/repositories/language-value.repository.interface";
import { TranslationDomainService } from "../../domain/services/translation.domain.service";
import { CreateTranslationDto } from "../dto/create-translation.dto";
import { TranslationResponseDto } from "../dto/translation-response.dto";
import { UpdateTranslationDto } from "../dto/update-translation.dto";

/**
 * ManageTranslationUseCase
 *
 * This use case handles the creation, retrieval, update, and deletion of translations.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
@Injectable()
export class ManageTranslationUseCase {
  constructor(
    @Inject("LanguageValueRepositoryInterface")
    private readonly languageValueRepository: LanguageValueRepositoryInterface,
    private readonly translationDomainService: TranslationDomainService
  ) {}

  /**
   * Creates a new translation.
   * @param createTranslationDto The data for creating the translation.
   * @returns Created translation response
   */
  async create(
    createTranslationDto: CreateTranslationDto
  ): Promise<TranslationResponseDto> {
    // 1. Validate input using domain service
    const validation =
      this.translationDomainService.validateTranslationCreationData(
        createTranslationDto
      );
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 2. Generate MD5 key for translation
    const key = this.translationDomainService.generateTranslationKey(
      createTranslationDto.originalText,
      createTranslationDto.languageId
    );

    // 3. Check if translation already exists
    const existingTranslation =
      await this.languageValueRepository.findByKeyAndLanguage(
        key,
        createTranslationDto.languageId
      );
    if (existingTranslation) {
      throw new ConflictException("Translation already exists");
    }

    // 4. Create translation entity
    const languageValue = new LanguageValue({
      key,
      originalText: createTranslationDto.originalText,
      translatedText: createTranslationDto.translatedText,
      languageId: createTranslationDto.languageId,
      context: createTranslationDto.context || {},
      isApproved: createTranslationDto.isApproved ?? false,
    });

    // 5. Save translation in repository
    const savedTranslation =
      await this.languageValueRepository.create(languageValue);

    // 6. Return response
    return TranslationResponseDto.fromDomain(savedTranslation);
  }

  /**
   * Retrieves a translation by its ID.
   * @param id The ID of the translation.
   * @returns The translation response DTO.
   * @throws NotFoundException if the translation is not found.
   */
  async getById(id: number): Promise<TranslationResponseDto> {
    const translation = await this.languageValueRepository.findById(id);
    if (!translation) {
      throw new NotFoundException("Translation not found");
    }
    return TranslationResponseDto.fromDomain(translation);
  }

  /**
   * Retrieves all translations with pagination and optional search.
   * @param pagination Pagination parameters
   * @returns A paginated list of translation response DTOs.
   */
  async getAll(pagination?: PaginationDto): Promise<{
    translations: TranslationResponseDto[];
    total: number;
  }> {
    if (pagination) {
      const result =
        await this.languageValueRepository.findPaginated(pagination);
      return {
        translations: result.languageValues.map((translation) =>
          this.mapToResponseDto(translation)
        ),
        total: result.total,
      };
    } else {
      const languageValues = await this.languageValueRepository.findMany([]);
      return {
        translations: languageValues.map((translation) =>
          this.mapToResponseDto(translation)
        ),
        total: languageValues.length,
      };
    }
  }

  /**
   * Retrieves all pending approval translations.
   * @returns A list of pending translation response DTOs.
   */
  async getPendingApprovals(): Promise<TranslationResponseDto[]> {
    const pendingTranslations =
      await this.languageValueRepository.findPendingApproval();
    return pendingTranslations.map((translation) =>
      this.mapToResponseDto(translation)
    );
  }

  /**
   * Retrieves the total count of translations.
   * @returns An object containing the total count.
   */
  async getCount(): Promise<{ count: number }> {
    const count = await this.languageValueRepository.count();
    return { count };
  }

  /**
   * Updates an existing translation.
   * @param id The ID of the translation to update.
   * @param updateTranslationDto The data for updating the translation.
   * @returns Updated translation response
   */
  async update(
    id: number,
    updateTranslationDto: UpdateTranslationDto
  ): Promise<TranslationResponseDto> {
    // 1. Find existing translation
    const existingTranslation = await this.languageValueRepository.findById(id);
    if (!existingTranslation) {
      throw new NotFoundException("Translation not found");
    }

    // 2. Validate update data using domain service
    const validation =
      this.translationDomainService.validateTranslationUpdateData(
        updateTranslationDto
      );
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 3. Update translation in repository
    const updatedTranslation = await this.languageValueRepository.update(
      id,
      updateTranslationDto
    );

    // 4. Return response
    return TranslationResponseDto.fromDomain(updatedTranslation);
  }

  /**
   * Approves a translation.
   * @param id The ID of the translation to approve.
   * @param approvedBy The user who approved the translation.
   * @returns Approved translation response
   */
  async approve(
    id: number,
    approvedBy: string
  ): Promise<TranslationResponseDto> {
    // 1. Find existing translation
    const existingTranslation = await this.languageValueRepository.findById(id);
    if (!existingTranslation) {
      throw new NotFoundException("Translation not found");
    }

    // 2. Check if translation can be approved
    if (
      !this.translationDomainService.canApproveTranslation(existingTranslation)
    ) {
      throw new BadRequestException("Translation is already approved");
    }

    // 3. Update translation with approval data
    const updatedTranslation = await this.languageValueRepository.update(id, {
      isApproved: true,
      approvedBy,
      approvedAt: new Date(),
    });

    // 4. Return response
    return TranslationResponseDto.fromDomain(updatedTranslation);
  }

  /**
   * Deletes a translation.
   * @param id The ID of the translation to delete.
   * @throws NotFoundException if the translation is not found.
   * @throws BadRequestException if the translation cannot be deleted due to business rules.
   */
  async delete(id: number): Promise<void> {
    // 1. Find existing translation
    const existingTranslation = await this.languageValueRepository.findById(id);
    if (!existingTranslation) {
      throw new NotFoundException("Translation not found");
    }

    // 2. Apply business rules for deletion
    if (
      !this.translationDomainService.canDeleteTranslation(existingTranslation)
    ) {
      throw new BadRequestException(
        "Cannot delete approved translation with high usage count"
      );
    }

    // 3. Delete translation from repository
    await this.languageValueRepository.delete(id);
  }

  /**
   * Maps a domain LanguageValue entity to a TranslationResponseDto.
   * @param translation The domain LanguageValue entity.
   * @returns The TranslationResponseDto.
   */
  private mapToResponseDto(translation: LanguageValue): TranslationResponseDto {
    return TranslationResponseDto.fromDomain(translation);
  }
}
