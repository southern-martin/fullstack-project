import { Expose } from "class-transformer";
import { LanguageValue } from "../../domain/entities/language-value.entity";

export class TranslationResponseDto {
  @Expose()
  id: number;

  @Expose()
  key: string;

  @Expose()
  original: string; // Changed from originalText

  @Expose()
  destination: string; // Changed from translatedText

  @Expose()
  languageCode: string; // Changed from languageId (number)

  @Expose()
  language: {
    code: string; // Primary key in old system (no separate id)
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
    dto.original = languageValue.original;
    dto.destination = languageValue.destination;
    dto.languageCode = languageValue.languageCode;
    dto.language = languageValue.language
      ? {
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
