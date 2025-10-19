import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateTranslationDto {
  @IsString()
  original: string; // Changed from originalText

  @IsString()
  destination: string; // Changed from translatedText

  @IsString()
  languageCode: string; // Changed from languageId (number)

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







