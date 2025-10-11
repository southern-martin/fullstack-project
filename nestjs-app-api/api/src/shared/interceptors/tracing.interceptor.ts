import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ObservabilityService } from "../services/observability.service";

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TracingInterceptor.name);

  constructor(private readonly observabilityService: ObservabilityService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Extract trace information from headers
    const traceId = request.headers["x-trace-id"] || this.generateTraceId();
    const parentSpanId = request.headers["x-parent-span-id"];

    // Determine service name and operation
    const serviceName = this.getServiceName(context);
    const operation = this.getOperation(context);

    // Start trace
    const trace = this.observabilityService.startTrace(
      traceId,
      serviceName,
      operation,
      parentSpanId
    );

    // Add request information to trace
    this.observabilityService.addTraceTag(
      trace.spanId,
      "http.method",
      request.method
    );
    this.observabilityService.addTraceTag(
      trace.spanId,
      "http.url",
      request.url
    );
    this.observabilityService.addTraceTag(
      trace.spanId,
      "http.user_agent",
      request.headers["user-agent"] || ""
    );
    this.observabilityService.addTraceTag(
      trace.spanId,
      "http.remote_addr",
      request.ip
    );

    // Add trace headers to response
    response.setHeader("X-Trace-Id", traceId);
    response.setHeader("X-Span-Id", trace.spanId);

    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;

        // Add response information to trace
        this.observabilityService.addTraceTag(
          trace.spanId,
          "http.status_code",
          response.statusCode.toString()
        );
        this.observabilityService.addTraceTag(
          trace.spanId,
          "http.response_size",
          JSON.stringify(data).length.toString()
        );
        this.observabilityService.addTraceLog(
          trace.spanId,
          "INFO",
          "Request completed successfully",
          {
            duration,
            statusCode: response.statusCode,
          }
        );

        // Finish trace with success
        this.observabilityService.finishTrace(trace.spanId, "SUCCESS");

        this.logger.debug(
          `Request completed: ${request.method} ${request.url} - ${duration}ms`
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;

        // Add error information to trace
        this.observabilityService.addTraceTag(trace.spanId, "error", "true");
        this.observabilityService.addTraceTag(
          trace.spanId,
          "error.message",
          error.message
        );
        this.observabilityService.addTraceTag(
          trace.spanId,
          "error.type",
          error.constructor.name
        );
        this.observabilityService.addTraceLog(
          trace.spanId,
          "ERROR",
          "Request failed",
          {
            duration,
            error: error.message,
            stack: error.stack,
          }
        );

        // Finish trace with error
        this.observabilityService.finishTrace(
          trace.spanId,
          "ERROR",
          error.message
        );

        this.logger.error(
          `Request failed: ${request.method} ${request.url} - ${duration}ms - ${error.message}`
        );

        throw error;
      })
    );
  }

  private getServiceName(context: ExecutionContext): string {
    const controller = context.getClass();
    const controllerName = controller.name
      .replace("Controller", "")
      .toLowerCase();

    // Map controller names to service names
    const serviceMapping: Record<string, string> = {
      auth: "auth-service",
      user: "user-service",
      customer: "customer-service",
      carrier: "carrier-service",
      pricing: "pricing-service",
      health: "health-service",
      monitoring: "monitoring-service",
      resilience: "resilience-service",
      loadbalancer: "load-balancer-service",
      interserviceauth: "inter-service-auth-service",
      servicecommunication: "service-communication-service",
    };

    return serviceMapping[controllerName] || `${controllerName}-service`;
  }

  private getOperation(context: ExecutionContext): string {
    const handler = context.getHandler();
    const methodName = handler.name;
    const request = context.switchToHttp().getRequest();
    const httpMethod = request.method;

    return `${httpMethod.toLowerCase()}.${methodName}`;
  }

  private generateTraceId(): string {
    return Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  }
}
