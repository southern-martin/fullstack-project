import { Expose } from "class-transformer";
import { Language } from "../../domain/entities/language.entity";

export class LanguageResponseDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  nativeName: string;

  @Expose()
  isActive: boolean;

  @Expose()
  isDefault: boolean;

  @Expose()
  metadata: {
    flag?: string;
    direction?: "ltr" | "rtl";
    region?: string;
    currency?: string;
    dateFormat?: string;
  };

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  static fromDomain(language: Language): LanguageResponseDto {
    const dto = new LanguageResponseDto();
    dto.id = language.id;
    dto.code = language.code;
    dto.name = language.name;
    dto.nativeName = language.nativeName;
    dto.isActive = language.isActive;
    dto.isDefault = language.isDefault;
    dto.metadata = language.metadata;
    dto.createdAt = language.createdAt;
    dto.updatedAt = language.updatedAt;
    return dto;
  }
}
