import { Expose } from "class-transformer";

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
}







