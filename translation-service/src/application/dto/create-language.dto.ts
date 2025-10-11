import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateLanguageDto {
  @IsString()
  @Length(2, 5)
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nativeName?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: {
    flag?: string;
    direction?: "ltr" | "rtl";
    region?: string;
    currency?: string;
    dateFormat?: string;
  };
}

