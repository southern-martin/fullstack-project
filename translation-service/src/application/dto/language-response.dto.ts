import { Expose } from "class-transformer";

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
}





