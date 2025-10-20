import { Module } from "@nestjs/common";

// Controllers
import { HealthController } from "./controllers/health.controller";
import { PricingController } from "./controllers/pricing.controller";

// Application Layer
import { ApplicationModule } from "../application/application.module";

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [ApplicationModule],
  controllers: [PricingController, HealthController],
})
export class InterfacesModule {}
