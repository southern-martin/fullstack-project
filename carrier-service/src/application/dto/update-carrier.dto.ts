import { PartialType } from "@nestjs/mapped-types";
import { CreateCarrierDto } from "./create-carrier.dto";

export class UpdateCarrierDto extends PartialType(CreateCarrierDto) {
  // All properties from CreateCarrierDto are now optional
}





