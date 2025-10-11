import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

// Infrastructure modules
import { DatabaseModule } from "./infrastructure/database/database.module";
import { ObservabilityModule } from "./infrastructure/observability/observability.module";

// Domain modules
import { AuthModule } from "./modules/auth/auth.module";
import { CarrierModule } from "./modules/carrier/carrier.module";
import { CustomerModule } from "./modules/customer/customer.module";
import { PricingModule } from "./modules/pricing/pricing.module";
import { UsersModule } from "./modules/users/users.module";

// Shared modules
import { ServicesModule } from "./shared/services/services.module";
import { SharedModule } from "./shared/shared.module";

// Controllers
import { HealthController } from "./health/health.controller";
import { InterServiceAuthDemoController } from "./shared/controllers/inter-service-auth-demo.controller";
import { LoadBalancerDemoController } from "./shared/controllers/load-balancer-demo.controller";
import { MonitoringController } from "./shared/controllers/monitoring.controller";
import { ResilienceDemoController } from "./shared/controllers/resilience-demo.controller";
import { ResilienceController } from "./shared/controllers/resilience.controller";
import { ServiceCommunicationController } from "./shared/controllers/service-communication.controller";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),

    // Infrastructure
    DatabaseModule,
    ObservabilityModule,

    // Services Infrastructure
    ServicesModule,

    // Domain modules
    CarrierModule,
    CustomerModule,
    PricingModule,
    UsersModule,
    AuthModule,

    // Shared
    SharedModule,
  ],
  controllers: [
    HealthController,
    ServiceCommunicationController,
    ResilienceController,
    ResilienceDemoController,
    LoadBalancerDemoController,
    InterServiceAuthDemoController,
    MonitoringController,
  ],
  providers: [],
})
export class AppModule {}
