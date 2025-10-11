import { PartialType } from "@nestjs/mapped-types";
import { CreateLanguageDto } from "./create-language.dto";

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {
  // All properties from CreateLanguageDto are now optional
}




