import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CircuitBreakerService } from "./circuit-breaker.service";
import { EventBusService } from "./event-bus.service";
import { HealthCheckService } from "./health-check.service";
import { HttpClientService } from "./http-client.service";
import { InterServiceAuthDemoService } from "./inter-service-auth-demo.service";
import { InterServiceAuthService } from "./inter-service-auth.service";
import { LoadBalancerDemoService } from "./load-balancer-demo.service";
import { LoadBalancerService } from "./load-balancer.service";
import { MonitoringService } from "./monitoring.service";
import { ObservabilityService } from "./observability.service";
import { ResilienceDemoService } from "./resilience-demo.service";
import { ResilienceService } from "./resilience.service";
import { ServiceClientFactory } from "./service-client.factory";
import { ServiceCommunicationDemoService } from "./service-communication-demo.service";
import { ServiceCommunicationService } from "./service-communication.service";
import { ServiceRegistrationService } from "./service-registration.service";
import { ServiceRegistryService } from "./service-registry.service";

/**
 * Services Module
 * Provides core microservice-oriented infrastructure services
 */
@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "microservice-oriented-secret",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [
    ServiceRegistryService,
    EventBusService,
    ServiceCommunicationService,
    HealthCheckService,
    ServiceRegistrationService,
    HttpClientService,
    ServiceClientFactory,
    LoadBalancerService,
    LoadBalancerDemoService,
    InterServiceAuthService,
    InterServiceAuthDemoService,
    ServiceCommunicationDemoService,
    CircuitBreakerService,
    ResilienceService,
    ResilienceDemoService,
    MonitoringService,
    ObservabilityService,
  ],
  exports: [
    ServiceRegistryService,
    EventBusService,
    ServiceCommunicationService,
    HealthCheckService,
    ServiceRegistrationService,
    HttpClientService,
    ServiceClientFactory,
    LoadBalancerService,
    LoadBalancerDemoService,
    InterServiceAuthService,
    InterServiceAuthDemoService,
    ServiceCommunicationDemoService,
    CircuitBreakerService,
    ResilienceService,
    ResilienceDemoService,
    MonitoringService,
    ObservabilityService,
  ],
})
export class ServicesModule {
  constructor(
    private readonly eventBus: EventBusService,
    private readonly healthCheck: HealthCheckService
  ) {}

  async onModuleInit() {
    // Start event bus
    await this.eventBus.start();

    // Start health monitoring
    await this.healthCheck.startHealthMonitoring();
  }

  async onModuleDestroy() {
    // Stop event bus
    await this.eventBus.stop();
  }
}
