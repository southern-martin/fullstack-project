import { Expose } from "class-transformer";
import { Language } from "../../domain/entities/language.entity";

export class LanguageResponseDto {
  @Expose()
  code: string; // Primary key in old system (no separate id)

  @Expose()
  name: string;

  @Expose()
  localName: string;

  @Expose()
  status: string; // 'active' or 'inactive'

  @Expose()
  flag: string; // Extracted from metadata

  @Expose()
  isDefault: boolean;

  @Expose()
  metadata: {
    direction?: "ltr" | "rtl";
    region?: string;
    currency?: string;
    dateFormat?: string;
  };

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Convenience getter for backward compatibility
  get isActive(): boolean {
    return this.status === 'active';
  }

  static fromDomain(language: Language): LanguageResponseDto {
    const dto = new LanguageResponseDto();
    dto.code = language.code;
    dto.name = language.name;
    dto.localName = language.localName;
    dto.status = language.status;
    dto.flag = language.flag;
    dto.isDefault = language.isDefault;
    dto.metadata = language.metadata;
    dto.createdAt = language.createdAt;
    dto.updatedAt = language.updatedAt;
    return dto;
  }
}
