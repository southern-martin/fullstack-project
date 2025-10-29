import { Module } from "@nestjs/common";

// Controllers
import { HealthController } from "./controllers/health.controller";
import { PermissionController } from "./controllers/permission.controller";
import { ProfileController } from "./controllers/profile.controller";
import { RoleController } from "./controllers/role.controller";
import { UserController } from "./controllers/user.controller";

// Application Layer
import { ApplicationModule } from "../application/application.module";

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 * 
 * This module imports Application module which provides:
 * - Use cases from Application layer
 * - Infrastructure layer (including repositories, RedisCacheService) via re-export
 */
@Module({
  imports: [
    ApplicationModule,
  ],
  controllers: [
    UserController, 
    RoleController,
    PermissionController,
    ProfileController, 
    HealthController
  ],
})
export class InterfacesModule {}
