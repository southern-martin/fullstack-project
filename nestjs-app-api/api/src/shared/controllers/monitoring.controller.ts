import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { AlertRule, MonitoringService } from "../services/monitoring.service";
import { ObservabilityService } from "../services/observability.service";

@Controller("api/v1/monitoring")
export class MonitoringController {
  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly observabilityService: ObservabilityService
  ) {}

  // Service Metrics
  @Get("metrics/services")
  getServiceMetrics(@Query("serviceName") serviceName?: string) {
    return {
      success: true,
      data: this.monitoringService.getServiceMetrics(serviceName),
      timestamp: Date.now(),
    };
  }

  @Get("metrics/services/:serviceName/history")
  getServiceHistory(
    @Param("serviceName") serviceName: string,
    @Query("limit") limit?: number
  ) {
    return {
      success: true,
      data: this.monitoringService.getServiceHistory(serviceName, limit),
      timestamp: Date.now(),
    };
  }

  // System Metrics
  @Get("metrics/system")
  getSystemMetrics() {
    return {
      success: true,
      data: this.monitoringService.getSystemMetrics(),
      timestamp: Date.now(),
    };
  }

  // Performance Metrics
  @Get("metrics/performance")
  getPerformanceMetrics(
    @Query("serviceName") serviceName?: string,
    @Query("operation") operation?: string
  ) {
    return {
      success: true,
      data: this.observabilityService.getPerformanceMetrics(
        serviceName,
        operation
      ),
      timestamp: Date.now(),
    };
  }

  // Alerts
  @Get("alerts")
  getAlerts(
    @Query("serviceName") serviceName?: string,
    @Query("severity") severity?: string,
    @Query("resolved") resolved?: boolean
  ) {
    return {
      success: true,
      data: this.monitoringService.getAlerts(serviceName, severity, resolved),
      timestamp: Date.now(),
    };
  }

  @Post("alerts/:alertId/resolve")
  resolveAlert(@Param("alertId") alertId: string) {
    const success = this.monitoringService.resolveAlert(alertId);
    return {
      success,
      message: success ? "Alert resolved successfully" : "Alert not found",
      timestamp: Date.now(),
    };
  }

  // Alert Rules
  @Get("alerts/rules")
  getAlertRules() {
    return {
      success: true,
      data: this.monitoringService.getAlertRules(),
      timestamp: Date.now(),
    };
  }

  @Post("alerts/rules")
  createAlertRule(@Body() rule: Omit<AlertRule, "id">) {
    const newRule = this.monitoringService.createAlertRule(rule);
    return {
      success: true,
      data: newRule,
      message: "Alert rule created successfully",
      timestamp: Date.now(),
    };
  }

  @Put("alerts/rules/:ruleId")
  updateAlertRule(
    @Param("ruleId") ruleId: string,
    @Body() updates: Partial<AlertRule>
  ) {
    const updatedRule = this.monitoringService.updateAlertRule(ruleId, updates);
    return {
      success: !!updatedRule,
      data: updatedRule,
      message: updatedRule
        ? "Alert rule updated successfully"
        : "Alert rule not found",
      timestamp: Date.now(),
    };
  }

  @Delete("alerts/rules/:ruleId")
  deleteAlertRule(@Param("ruleId") ruleId: string) {
    const success = this.monitoringService.deleteAlertRule(ruleId);
    return {
      success,
      message: success
        ? "Alert rule deleted successfully"
        : "Alert rule not found",
      timestamp: Date.now(),
    };
  }

  // Traces
  @Get("traces")
  getTraces(
    @Query("serviceName") serviceName?: string,
    @Query("operation") operation?: string,
    @Query("limit") limit?: number
  ) {
    return {
      success: true,
      data: this.observabilityService.getTraces(serviceName, operation, limit),
      timestamp: Date.now(),
    };
  }

  @Get("traces/:traceId")
  getTrace(@Param("traceId") traceId: string) {
    const trace = this.observabilityService.getTrace(traceId);
    return {
      success: !!trace,
      data: trace,
      message: trace ? "Trace found" : "Trace not found",
      timestamp: Date.now(),
    };
  }

  @Get("traces/active")
  getActiveTraces() {
    return {
      success: true,
      data: this.observabilityService.getActiveTraces(),
      timestamp: Date.now(),
    };
  }

  // Service Dependencies
  @Get("dependencies")
  getServiceDependencies() {
    return {
      success: true,
      data: this.observabilityService.getServiceDependencies(),
      timestamp: Date.now(),
    };
  }

  @Get("topology")
  getServiceTopology() {
    return {
      success: true,
      data: this.observabilityService.getServiceTopology(),
      timestamp: Date.now(),
    };
  }

  // Summary and Health
  @Get("summary")
  getMetricsSummary() {
    return {
      success: true,
      data: this.monitoringService.getMetricsSummary(),
      timestamp: Date.now(),
    };
  }

  @Get("observability/summary")
  getObservabilitySummary() {
    return {
      success: true,
      data: this.observabilityService.getObservabilitySummary(),
      timestamp: Date.now(),
    };
  }

  @Get("health")
  getHealth() {
    const monitoringHealthy = this.monitoringService.isHealthy();
    const observabilityHealthy = this.observabilityService.isHealthy();

    return {
      success: monitoringHealthy && observabilityHealthy,
      data: {
        monitoring: monitoringHealthy,
        observability: observabilityHealthy,
        overall: monitoringHealthy && observabilityHealthy,
      },
      timestamp: Date.now(),
    };
  }

  // Dashboard Data
  @Get("dashboard")
  getDashboardData() {
    const metricsSummary = this.monitoringService.getMetricsSummary();
    const observabilitySummary =
      this.observabilityService.getObservabilitySummary();
    const serviceTopology = this.observabilityService.getServiceTopology();
    const recentAlerts = this.monitoringService
      .getAlerts(undefined, undefined, false)
      .slice(0, 10);

    return {
      success: true,
      data: {
        metrics: metricsSummary,
        observability: observabilitySummary,
        topology: serviceTopology,
        recentAlerts,
        timestamp: Date.now(),
      },
    };
  }
}
