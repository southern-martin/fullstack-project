import { IsObject, IsOptional, IsString } from "class-validator";

export class TranslateTextDto {
  @IsString()
  text: string;

  @IsString()
  targetLanguage: string;

  @IsOptional()
  @IsString()
  sourceLanguage?: string;

  @IsOptional()
  @IsObject()
  context?: {
    category?: string;
    module?: string;
    component?: string;
    field?: string;
  };
}







