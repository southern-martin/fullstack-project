import { Injectable, Logger } from "@nestjs/common";
import { EventBusService } from "./event-bus.service";

export interface ServiceMetrics {
  serviceName: string;
  timestamp: number;
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  activeConnections: number;
  circuitBreakerState: "CLOSED" | "OPEN" | "HALF_OPEN";
  lastHealthCheck: number;
}

export interface SystemMetrics {
  timestamp: number;
  totalServices: number;
  healthyServices: number;
  unhealthyServices: number;
  totalRequests: number;
  totalErrors: number;
  averageResponseTime: number;
  systemMemoryUsage: number;
  systemCpuUsage: number;
  activeConnections: number;
  eventBusStatus: "ACTIVE" | "INACTIVE";
  serviceRegistryStatus: "ACTIVE" | "INACTIVE";
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  enabled: boolean;
  cooldownPeriod: number;
  lastTriggered?: number;
}

export interface Alert {
  id: string;
  ruleId: string;
  serviceName?: string;
  message: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: number;
  resolved: boolean;
  resolvedAt?: number;
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private readonly serviceMetrics = new Map<string, ServiceMetrics>();
  private readonly systemMetrics: SystemMetrics[] = [];
  private readonly alertRules = new Map<string, AlertRule>();
  private readonly alerts: Alert[] = [];
  private readonly metricsHistory = new Map<string, ServiceMetrics[]>();

  private readonly MAX_HISTORY_SIZE = 1000;
  private readonly METRICS_COLLECTION_INTERVAL = 30000; // 30 seconds
  private readonly SYSTEM_METRICS_RETENTION = 24 * 60 * 60 * 1000; // 24 hours

  constructor(private readonly eventBusService: EventBusService) {
    this.initializeDefaultAlertRules();
    this.startMetricsCollection();
    this.startSystemMetricsCollection();
    this.startAlertProcessing();
  }

  private initializeDefaultAlertRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: "high-error-rate",
        name: "High Error Rate",
        condition: "error_rate > threshold",
        threshold: 0.1, // 10%
        severity: "HIGH",
        enabled: true,
        cooldownPeriod: 300000, // 5 minutes
      },
      {
        id: "high-response-time",
        name: "High Response Time",
        condition: "response_time > threshold",
        threshold: 5000, // 5 seconds
        severity: "MEDIUM",
        enabled: true,
        cooldownPeriod: 300000, // 5 minutes
      },
      {
        id: "service-down",
        name: "Service Down",
        condition: "health_check_failed",
        threshold: 1,
        severity: "CRITICAL",
        enabled: true,
        cooldownPeriod: 60000, // 1 minute
      },
      {
        id: "high-memory-usage",
        name: "High Memory Usage",
        condition: "memory_usage > threshold",
        threshold: 0.9, // 90%
        severity: "HIGH",
        enabled: true,
        cooldownPeriod: 300000, // 5 minutes
      },
      {
        id: "circuit-breaker-open",
        name: "Circuit Breaker Open",
        condition: "circuit_breaker_state == OPEN",
        threshold: 1,
        severity: "HIGH",
        enabled: true,
        cooldownPeriod: 300000, // 5 minutes
      },
    ];

    defaultRules.forEach((rule) => {
      this.alertRules.set(rule.id, rule);
    });

    this.logger.log(`Initialized ${defaultRules.length} default alert rules`);
  }

  private startMetricsCollection(): void {
    setInterval(() => {
      this.collectServiceMetrics();
    }, this.METRICS_COLLECTION_INTERVAL);

    this.logger.log("Started service metrics collection");
  }

  private startSystemMetricsCollection(): void {
    setInterval(() => {
      this.collectSystemMetrics();
    }, this.METRICS_COLLECTION_INTERVAL);

    this.logger.log("Started system metrics collection");
  }

  private startAlertProcessing(): void {
    setInterval(() => {
      this.processAlerts();
    }, 10000); // Check every 10 seconds

    this.logger.log("Started alert processing");
  }

  private collectServiceMetrics(): void {
    // This would typically collect real metrics from services
    // For now, we'll simulate some metrics
    const services = [
      "auth-service",
      "user-service",
      "customer-service",
      "carrier-service",
      "pricing-service",
    ];

    services.forEach((serviceName) => {
      const existingMetrics = this.serviceMetrics.get(serviceName);

      const metrics: ServiceMetrics = {
        serviceName,
        timestamp: Date.now(),
        requestCount:
          (existingMetrics?.requestCount || 0) + Math.floor(Math.random() * 10),
        successCount:
          (existingMetrics?.successCount || 0) + Math.floor(Math.random() * 8),
        errorCount:
          (existingMetrics?.errorCount || 0) + Math.floor(Math.random() * 2),
        averageResponseTime: Math.random() * 1000 + 100,
        memoryUsage: Math.random() * 0.5 + 0.2,
        cpuUsage: Math.random() * 0.3 + 0.1,
        activeConnections: Math.floor(Math.random() * 50) + 10,
        circuitBreakerState: Math.random() > 0.9 ? "OPEN" : "CLOSED",
        lastHealthCheck: Date.now(),
      };

      this.serviceMetrics.set(serviceName, metrics);
      this.addToHistory(serviceName, metrics);
    });
  }

  private collectSystemMetrics(): void {
    const services = Array.from(this.serviceMetrics.values());
    const healthyServices = services.filter(
      (s) => s.circuitBreakerState === "CLOSED"
    ).length;
    const unhealthyServices = services.length - healthyServices;

    const systemMetrics: SystemMetrics = {
      timestamp: Date.now(),
      totalServices: services.length,
      healthyServices,
      unhealthyServices,
      totalRequests: services.reduce((sum, s) => sum + s.requestCount, 0),
      totalErrors: services.reduce((sum, s) => sum + s.errorCount, 0),
      averageResponseTime:
        services.reduce((sum, s) => sum + s.averageResponseTime, 0) /
        services.length,
      systemMemoryUsage: Math.random() * 0.3 + 0.4,
      systemCpuUsage: Math.random() * 0.2 + 0.1,
      activeConnections: services.reduce(
        (sum, s) => sum + s.activeConnections,
        0
      ),
      eventBusStatus: "ACTIVE",
      serviceRegistryStatus: "ACTIVE",
    };

    this.systemMetrics.push(systemMetrics);

    // Keep only last 24 hours of system metrics
    const cutoffTime = Date.now() - this.SYSTEM_METRICS_RETENTION;
    const filteredMetrics = this.systemMetrics.filter(
      (m) => m.timestamp > cutoffTime
    );
    this.systemMetrics.splice(
      0,
      this.systemMetrics.length - filteredMetrics.length
    );
  }

  private addToHistory(serviceName: string, metrics: ServiceMetrics): void {
    if (!this.metricsHistory.has(serviceName)) {
      this.metricsHistory.set(serviceName, []);
    }

    const history = this.metricsHistory.get(serviceName)!;
    history.push(metrics);

    // Keep only last MAX_HISTORY_SIZE entries
    if (history.length > this.MAX_HISTORY_SIZE) {
      history.splice(0, history.length - this.MAX_HISTORY_SIZE);
    }
  }

  private processAlerts(): void {
    const services = Array.from(this.serviceMetrics.values());

    services.forEach((service) => {
      this.alertRules.forEach((rule) => {
        if (!rule.enabled) return;

        // Check cooldown period
        if (
          rule.lastTriggered &&
          Date.now() - rule.lastTriggered < rule.cooldownPeriod
        ) {
          return;
        }

        let shouldTrigger = false;
        let message = "";

        switch (rule.id) {
          case "high-error-rate":
            const errorRate = service.errorCount / (service.requestCount || 1);
            shouldTrigger = errorRate > rule.threshold;
            message = `High error rate detected: ${(errorRate * 100).toFixed(2)}%`;
            break;

          case "high-response-time":
            shouldTrigger = service.averageResponseTime > rule.threshold;
            message = `High response time detected: ${service.averageResponseTime.toFixed(2)}ms`;
            break;

          case "service-down":
            shouldTrigger = service.circuitBreakerState === "OPEN";
            message = "Service is down - circuit breaker is open";
            break;

          case "high-memory-usage":
            shouldTrigger = service.memoryUsage > rule.threshold;
            message = `High memory usage detected: ${(service.memoryUsage * 100).toFixed(2)}%`;
            break;

          case "circuit-breaker-open":
            shouldTrigger = service.circuitBreakerState === "OPEN";
            message = "Circuit breaker is open";
            break;
        }

        if (shouldTrigger) {
          this.triggerAlert(rule, service.serviceName, message);
          rule.lastTriggered = Date.now();
        }
      });
    });
  }

  private triggerAlert(
    rule: AlertRule,
    serviceName: string,
    message: string
  ): void {
    const alert: Alert = {
      id: `${rule.id}-${serviceName}-${Date.now()}`,
      ruleId: rule.id,
      serviceName,
      message,
      severity: rule.severity,
      timestamp: Date.now(),
      resolved: false,
    };

    this.alerts.push(alert);

    // Publish alert event
    this.eventBusService.publish({
      eventId: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventType: "alert.triggered",
      eventVersion: "1.0.0",
      timestamp: new Date(),
      source: "monitoring-service",
      data: {
        alert,
        rule,
        serviceName,
      },
    });

    this.logger.warn(
      `Alert triggered: ${rule.name} for ${serviceName} - ${message}`
    );
  }

  // Public API methods
  getServiceMetrics(serviceName?: string): ServiceMetrics | ServiceMetrics[] {
    if (serviceName) {
      return this.serviceMetrics.get(serviceName) || null;
    }
    return Array.from(this.serviceMetrics.values());
  }

  getSystemMetrics(): SystemMetrics[] {
    return [...this.systemMetrics];
  }

  getServiceHistory(serviceName: string, limit?: number): ServiceMetrics[] {
    const history = this.metricsHistory.get(serviceName) || [];
    return limit ? history.slice(-limit) : history;
  }

  getAlerts(
    serviceName?: string,
    severity?: string,
    resolved?: boolean
  ): Alert[] {
    let filteredAlerts = [...this.alerts];

    if (serviceName) {
      filteredAlerts = filteredAlerts.filter(
        (a) => a.serviceName === serviceName
      );
    }

    if (severity) {
      filteredAlerts = filteredAlerts.filter((a) => a.severity === severity);
    }

    if (resolved !== undefined) {
      filteredAlerts = filteredAlerts.filter((a) => a.resolved === resolved);
    }

    return filteredAlerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  getAlertRules(): AlertRule[] {
    return Array.from(this.alertRules.values());
  }

  createAlertRule(rule: Omit<AlertRule, "id">): AlertRule {
    const newRule: AlertRule = {
      ...rule,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    this.alertRules.set(newRule.id, newRule);
    this.logger.log(`Created new alert rule: ${newRule.name}`);

    return newRule;
  }

  updateAlertRule(
    ruleId: string,
    updates: Partial<AlertRule>
  ): AlertRule | null {
    const rule = this.alertRules.get(ruleId);
    if (!rule) return null;

    const updatedRule = { ...rule, ...updates };
    this.alertRules.set(ruleId, updatedRule);
    this.logger.log(`Updated alert rule: ${updatedRule.name}`);

    return updatedRule;
  }

  deleteAlertRule(ruleId: string): boolean {
    const deleted = this.alertRules.delete(ruleId);
    if (deleted) {
      this.logger.log(`Deleted alert rule: ${ruleId}`);
    }
    return deleted;
  }

  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (!alert) return false;

    alert.resolved = true;
    alert.resolvedAt = Date.now();

    this.eventBusService.publish({
      eventId: `alert-resolved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventType: "alert.resolved",
      eventVersion: "1.0.0",
      timestamp: new Date(),
      source: "monitoring-service",
      data: { alert },
    });
    this.logger.log(`Resolved alert: ${alertId}`);

    return true;
  }

  getMetricsSummary(): any {
    const services = Array.from(this.serviceMetrics.values());
    const systemMetrics = this.systemMetrics[this.systemMetrics.length - 1];
    const activeAlerts = this.alerts.filter((a) => !a.resolved);

    return {
      services: {
        total: services.length,
        healthy: services.filter((s) => s.circuitBreakerState === "CLOSED")
          .length,
        unhealthy: services.filter((s) => s.circuitBreakerState === "OPEN")
          .length,
      },
      system: systemMetrics,
      alerts: {
        total: this.alerts.length,
        active: activeAlerts.length,
        bySeverity: {
          CRITICAL: activeAlerts.filter((a) => a.severity === "CRITICAL")
            .length,
          HIGH: activeAlerts.filter((a) => a.severity === "HIGH").length,
          MEDIUM: activeAlerts.filter((a) => a.severity === "MEDIUM").length,
          LOW: activeAlerts.filter((a) => a.severity === "LOW").length,
        },
      },
      performance: {
        averageResponseTime:
          services.reduce((sum, s) => sum + s.averageResponseTime, 0) /
          services.length,
        totalRequests: services.reduce((sum, s) => sum + s.requestCount, 0),
        totalErrors: services.reduce((sum, s) => sum + s.errorCount, 0),
        errorRate:
          services.reduce((sum, s) => sum + s.errorCount, 0) /
          services.reduce((sum, s) => sum + s.requestCount, 1),
      },
    };
  }

  // Health check method
  isHealthy(): boolean {
    const services = Array.from(this.serviceMetrics.values());
    const criticalAlerts = this.alerts.filter(
      (a) => !a.resolved && a.severity === "CRITICAL"
    );

    return services.length > 0 && criticalAlerts.length === 0;
  }
}
