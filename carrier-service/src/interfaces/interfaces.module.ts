import { Module } from "@nestjs/common";

// Controllers
import { CarrierController } from "./controllers/carrier.controller";
import { HealthController } from "./controllers/health.controller";

// Application Module - provides all use cases, domain services, and infrastructure
import { ApplicationModule } from "../application/application.module";

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [ApplicationModule],
  controllers: [CarrierController, HealthController],
})
export class InterfacesModule {}
