import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateTranslationDto {
  @IsString()
  originalText: string;

  @IsString()
  translatedText: string;

  @IsNumber()
  languageId: number;

  @IsOptional()
  @IsObject()
  context?: {
    category?: string;
    module?: string;
    component?: string;
    field?: string;
  };

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}

