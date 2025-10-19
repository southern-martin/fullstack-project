import { Module } from "@nestjs/common";

// Controllers
import { CustomerController } from "./controllers/customer.controller";
import { HealthController } from "./controllers/health.controller";

// Application Layer
import { ApplicationModule } from "../application/application.module";

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [ApplicationModule],
  controllers: [CustomerController, HealthController],
  providers: [],
})
export class InterfacesModule {}
