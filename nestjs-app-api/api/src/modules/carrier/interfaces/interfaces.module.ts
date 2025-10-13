import { Module } from "@nestjs/common";

// Controllers
import { CarrierController } from "./controllers/carrier.controller";

@Module({
  controllers: [CarrierController],
})
export class CarrierInterfacesModule {}
