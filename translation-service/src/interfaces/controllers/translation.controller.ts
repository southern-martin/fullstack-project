import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { PaginationDto } from "@shared/infrastructure";
import { CreateLanguageDto } from "../../application/dto/create-language.dto";
import { CreateTranslationDto } from "../../application/dto/create-translation.dto";
import { LanguageResponseDto } from "../../application/dto/language-response.dto";
import { TranslateTextDto } from "../../application/dto/translate-text.dto";
import { TranslationResponseDto } from "../../application/dto/translation-response.dto";
import { UpdateLanguageDto } from "../../application/dto/update-language.dto";
import { UpdateTranslationDto } from "../../application/dto/update-translation.dto";
import { ManageLanguageUseCase } from "../../application/use-cases/manage-language.use-case";
import { ManageTranslationUseCase } from "../../application/use-cases/manage-translation.use-case";
import { TranslateTextUseCase } from "../../application/use-cases/translate-text.use-case";

/**
 * TranslationController
 *
 * This controller handles incoming HTTP requests related to translation management.
 * It acts as an adapter, translating HTTP requests into calls to application
 * layer use cases and mapping their results back to HTTP responses.
 */
@Controller("translation")
export class TranslationController {
  constructor(
    private readonly manageLanguageUseCase: ManageLanguageUseCase,
    private readonly manageTranslationUseCase: ManageTranslationUseCase,
    private readonly translateTextUseCase: TranslateTextUseCase
  ) {}

  // Language Management
  /**
   * Creates a new language.
   * POST /translation/languages
   * @param createLanguageDto The data for creating the language.
   * @returns The created language.
   */
  @Post("languages")
  @HttpCode(HttpStatus.CREATED)
  async createLanguage(
    @Body() createLanguageDto: CreateLanguageDto
  ): Promise<LanguageResponseDto> {
    return await this.manageLanguageUseCase.create(createLanguageDto);
  }

  /**
   * Retrieves all languages.
   * GET /translation/languages
   * @returns A list of languages.
   */
  @Get("languages")
  async findAllLanguages(): Promise<LanguageResponseDto[]> {
    const result = await this.manageLanguageUseCase.getAll();
    return result.languages;
  }

  /**
   * Retrieves all active languages.
   * GET /translation/languages/active
   * @returns A list of active languages.
   */
  @Get("languages/active")
  async findActiveLanguages(): Promise<LanguageResponseDto[]> {
    return await this.manageLanguageUseCase.getActive();
  }

  /**
   * Retrieves the total count of languages.
   * GET /translation/languages/count
   * @returns An object containing the total count.
   */
  @Get("languages/count")
  async getLanguageCount(): Promise<{ count: number }> {
    return await this.manageLanguageUseCase.getCount();
  }

  /**
   * Retrieves a language by code (primary key in old system).
   * GET /translation/languages/:code
   * @param code The language code.
   * @returns The language.
   */
  @Get("languages/:code")
  async findLanguageById(
    @Param("code") code: string
  ): Promise<LanguageResponseDto> {
    return await this.manageLanguageUseCase.getById(code);
  }

  /**
   * Retrieves a language by code.
   * GET /translation/languages/code/:code
   * @param code The language code.
   * @returns The language.
   */
  @Get("languages/code/:code")
  async findLanguageByCode(
    @Param("code") code: string
  ): Promise<LanguageResponseDto> {
    return await this.manageLanguageUseCase.getByCode(code);
  }

  /**
   * Updates an existing language.
   * PATCH /translation/languages/:code
   * @param code The language code (primary key).
   * @param updateLanguageDto The data for updating the language.
   * @returns The updated language.
   */
  @Patch("languages/:code")
  async updateLanguage(
    @Param("code") code: string,
    @Body() updateLanguageDto: UpdateLanguageDto
  ): Promise<LanguageResponseDto> {
    return await this.manageLanguageUseCase.update(code, updateLanguageDto);
  }

  /**
   * Deletes a language.
   * DELETE /translation/languages/:code
   * @param code The language code to delete.
   */
  @Delete("languages/:code")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLanguage(@Param("code") code: string): Promise<void> {
    return await this.manageLanguageUseCase.delete(code);
  }

  // Translation Management
  /**
   * Creates a new translation.
   * POST /translation/translations
   * @param createTranslationDto The data for creating the translation.
   * @returns The created translation.
   */
  @Post("translations")
  @HttpCode(HttpStatus.CREATED)
  async createTranslation(
    @Body() createTranslationDto: CreateTranslationDto
  ): Promise<TranslationResponseDto> {
    return await this.manageTranslationUseCase.create(createTranslationDto);
  }

  /**
   * Retrieves all translations with pagination and optional search.
   * GET /translation/translations
   * @param page The page number (default: 1).
   * @param limit The number of items per page (default: 10).
   * @param search Optional search string.
   * @returns A paginated list of translations.
   */
  @Get("translations")
  async findAllTranslations(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{ translations: TranslationResponseDto[]; total: number }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const pagination = new PaginationDto();
    pagination.page = pageNum;
    pagination.limit = limitNum;
    pagination.search = search || "";
    pagination.sortBy = "createdAt";
    pagination.sortOrder = "desc";
    return await this.manageTranslationUseCase.getAll(pagination);
  }

  /**
   * Retrieves the total count of translations.
   * GET /translation/translations/count
   * @returns An object containing the total count.
   */
  @Get("translations/count")
  async getTranslationCount(): Promise<{ count: number }> {
    return await this.manageTranslationUseCase.getCount();
  }

  /**
   * Retrieves all pending approval translations.
   * GET /translation/translations/pending
   * @returns A list of pending translations.
   */
  @Get("translations/pending")
  async findPendingApprovals(): Promise<TranslationResponseDto[]> {
    return await this.manageTranslationUseCase.getPendingApprovals();
  }

  /**
   * Retrieves a translation by ID.
   * GET /translation/translations/:id
   * @param id The ID of the translation.
   * @returns The translation.
   */
  @Get("translations/:id")
  async findTranslationById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<TranslationResponseDto> {
    return await this.manageTranslationUseCase.getById(id);
  }

  /**
   * Updates an existing translation.
   * PATCH /translation/translations/:id
   * @param id The ID of the translation to update.
   * @param updateTranslationDto The data for updating the translation.
   * @returns The updated translation.
   */
  @Patch("translations/:id")
  async updateTranslation(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTranslationDto: UpdateTranslationDto
  ): Promise<TranslationResponseDto> {
    return await this.manageTranslationUseCase.update(id, updateTranslationDto);
  }

  /**
   * Approves a translation.
   * PATCH /translation/translations/:id/approve
   * @param id The ID of the translation to approve.
   * @param body The approval data.
   * @returns The approved translation.
   */
  @Patch("translations/:id/approve")
  async approveTranslation(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { approvedBy: string }
  ): Promise<TranslationResponseDto> {
    return await this.manageTranslationUseCase.approve(id, body.approvedBy);
  }

  /**
   * Deletes a translation.
   * DELETE /translation/translations/:id
   * @param id The ID of the translation to delete.
   */
  @Delete("translations/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTranslation(
    @Param("id", ParseIntPipe) id: number
  ): Promise<void> {
    return await this.manageTranslationUseCase.delete(id);
  }

  // Translation Operations
  /**
   * Translates a text.
   * POST /translation/translate
   * @param translateTextDto The data for text translation.
   * @returns Translation result with translated text and cache status.
   */
  @Post("translate")
  async translateText(
    @Body() translateTextDto: TranslateTextDto
  ): Promise<{ translatedText: string; fromCache: boolean }> {
    return await this.translateTextUseCase.execute(translateTextDto);
  }

  /**
   * Translates multiple texts in batch.
   * POST /translation/translate/batch
   * @param body The batch translation data.
   * @returns Array of translation results.
   */
  @Post("translate/batch")
  async translateBatch(
    @Body()
    body: {
      texts: string[];
      targetLanguage: string;
      sourceLanguage: string;
    }
  ): Promise<{
    translations: {
      text: string;
      translatedText: string;
      fromCache: boolean;
    }[];
  }> {
    return await this.translateTextUseCase.executeBatch(
      body.texts,
      body.targetLanguage,
      body.sourceLanguage
    );
  }

  /**
   * Gets translation statistics for a language.
   * GET /translation/stats/:languageCode
   * @param languageCode The language code.
   * @returns Translation statistics.
   */
  @Get("stats/:languageCode")
  async getTranslationStats(
    @Param("languageCode") languageCode: string
  ): Promise<{
    totalTranslations: number;
    approvedTranslations: number;
    pendingTranslations: number;
    cacheHitRate: number;
  }> {
    return await this.translateTextUseCase.getTranslationStats(languageCode);
  }
}
