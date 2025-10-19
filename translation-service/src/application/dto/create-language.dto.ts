import {
  IsIn,
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
  localName?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string; // 'active' or 'inactive'

  @IsOptional()
  @IsString()
  flag?: string; // Extracted from metadata in old system

  @IsOptional()
  @IsString()
  isDefault?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: {
    direction?: "ltr" | "rtl";
    region?: string;
    currency?: string;
    dateFormat?: string;
  };
}







