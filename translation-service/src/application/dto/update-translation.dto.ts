import { PartialType } from "@nestjs/mapped-types";
import { CreateTranslationDto } from "./create-translation.dto";

export class UpdateTranslationDto extends PartialType(CreateTranslationDto) {
  // All properties from CreateTranslationDto are now optional
}







