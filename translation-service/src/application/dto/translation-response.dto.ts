import { Expose } from "class-transformer";
import { LanguageValue } from "../../domain/entities/language-value.entity";

export class TranslationResponseDto {
  @Expose()
  id: number;

  @Expose()
  key: string;

  @Expose()
  originalText: string;

  @Expose()
  translatedText: string;

  @Expose()
  languageId: number;

  @Expose()
  language: {
    id: number;
    code: string;
    name: string;
  };

  @Expose()
  context: {
    category?: string;
    module?: string;
    component?: string;
    field?: string;
  };

  @Expose()
  isApproved: boolean;

  @Expose()
  approvedBy: string;

  @Expose()
  approvedAt: Date;

  @Expose()
  usageCount: number;

  @Expose()
  lastUsedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  static fromDomain(languageValue: LanguageValue): TranslationResponseDto {
    const dto = new TranslationResponseDto();
    dto.id = languageValue.id;
    dto.key = languageValue.key;
    dto.originalText = languageValue.originalText;
    dto.translatedText = languageValue.translatedText;
    dto.languageId = languageValue.languageId;
    dto.language = languageValue.language
      ? {
          id: languageValue.language.id,
          code: languageValue.language.code,
          name: languageValue.language.name,
        }
      : null;
    dto.context = languageValue.context;
    dto.isApproved = languageValue.isApproved;
    dto.approvedBy = languageValue.approvedBy;
    dto.approvedAt = languageValue.approvedAt;
    dto.usageCount = languageValue.usageCount;
    dto.lastUsedAt = languageValue.lastUsedAt;
    dto.createdAt = languageValue.createdAt;
    dto.updatedAt = languageValue.updatedAt;
    return dto;
  }
}
