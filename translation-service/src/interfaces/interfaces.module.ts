import { Module } from "@nestjs/common";

// Controllers
import { HealthController } from "./controllers/health.controller";
import { TranslationController } from "./controllers/translation.controller";

// Application Module - provides all use cases, domain services, and infrastructure
import { ApplicationModule } from "../application/application.module";

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [ApplicationModule],
  controllers: [TranslationController, HealthController],
})
export class InterfacesModule {}
