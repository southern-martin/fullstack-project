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
import { CreateLanguageDto } from "../application/dto/create-language.dto";
import { CreateTranslationDto } from "../application/dto/create-translation.dto";
import { LanguageResponseDto } from "../application/dto/language-response.dto";
import { TranslateTextDto } from "../application/dto/translate-text.dto";
import { TranslationResponseDto } from "../application/dto/translation-response.dto";
import { UpdateLanguageDto } from "../application/dto/update-language.dto";
import { UpdateTranslationDto } from "../application/dto/update-translation.dto";
import { TranslationService } from "../application/services/translation.service";

@Controller("translation")
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  // Language Management
  @Post("languages")
  @HttpCode(HttpStatus.CREATED)
  async createLanguage(
    @Body() createLanguageDto: CreateLanguageDto
  ): Promise<LanguageResponseDto> {
    return await this.translationService.createLanguage(createLanguageDto);
  }

  @Get("languages")
  async findAllLanguages(): Promise<LanguageResponseDto[]> {
    return await this.translationService.findAllLanguages();
  }

  @Get("languages/active")
  async findActiveLanguages(): Promise<LanguageResponseDto[]> {
    return await this.translationService.findActiveLanguages();
  }

  @Get("languages/count")
  async getLanguageCount(): Promise<{ count: number }> {
    return await this.translationService.getLanguageCount();
  }

  @Get("languages/:id")
  async findLanguageById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<LanguageResponseDto> {
    return await this.translationService.findLanguageById(id);
  }

  @Get("languages/code/:code")
  async findLanguageByCode(
    @Param("code") code: string
  ): Promise<LanguageResponseDto> {
    return await this.translationService.findLanguageByCode(code);
  }

  @Patch("languages/:id")
  async updateLanguage(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateLanguageDto: UpdateLanguageDto
  ): Promise<LanguageResponseDto> {
    return await this.translationService.updateLanguage(id, updateLanguageDto);
  }

  @Delete("languages/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLanguage(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.translationService.deleteLanguage(id);
  }

  // Translation Management
  @Post("translations")
  @HttpCode(HttpStatus.CREATED)
  async createTranslation(
    @Body() createTranslationDto: CreateTranslationDto
  ): Promise<TranslationResponseDto> {
    return await this.translationService.createTranslation(
      createTranslationDto
    );
  }

  @Get("translations")
  async findAllTranslations(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{ translations: TranslationResponseDto[]; total: number }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return await this.translationService.findAllTranslations(
      pageNum,
      limitNum,
      search
    );
  }

  @Get("translations/count")
  async getTranslationCount(): Promise<{ count: number }> {
    return await this.translationService.getTranslationCount();
  }

  @Get("translations/pending")
  async findPendingApprovals(): Promise<TranslationResponseDto[]> {
    return await this.translationService.findPendingApprovals();
  }

  @Get("translations/:id")
  async findTranslationById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<TranslationResponseDto> {
    return await this.translationService.findTranslationById(id);
  }

  @Patch("translations/:id")
  async updateTranslation(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTranslationDto: UpdateTranslationDto
  ): Promise<TranslationResponseDto> {
    return await this.translationService.updateTranslation(
      id,
      updateTranslationDto
    );
  }

  @Patch("translations/:id/approve")
  async approveTranslation(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { approvedBy: string }
  ): Promise<TranslationResponseDto> {
    return await this.translationService.approveTranslation(
      id,
      body.approvedBy
    );
  }

  @Delete("translations/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTranslation(
    @Param("id", ParseIntPipe) id: number
  ): Promise<void> {
    return await this.translationService.deleteTranslation(id);
  }

  // Translation Operations
  @Post("translate")
  async translateText(
    @Body() translateTextDto: TranslateTextDto
  ): Promise<{ translatedText: string; fromCache: boolean }> {
    return await this.translationService.translateText(translateTextDto);
  }

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
    return await this.translationService.translateBatch(body);
  }
}
