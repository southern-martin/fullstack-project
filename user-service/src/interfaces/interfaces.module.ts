import { Module } from "@nestjs/common";

// Controllers
import { HealthController } from "./controllers/health.controller";
import { ProfileController } from "./controllers/profile.controller";
import { RoleController } from "./controllers/role.controller";
import { UserController } from "./controllers/user.controller";

// Application Layer
import { ApplicationModule } from "../application/application.module";

// Infrastructure Layer
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 * 
 * This module imports Application and Infrastructure modules to get access to:
 * - Use cases from Application layer
 * - Repository implementations from Infrastructure layer
 */
@Module({
  imports: [
    ApplicationModule,
    InfrastructureModule,
  ],
  controllers: [
    UserController, 
    RoleController, 
    ProfileController, 
    HealthController
  ],
})
export class InterfacesModule {}
