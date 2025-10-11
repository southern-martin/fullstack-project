import { Injectable, Logger } from "@nestjs/common";
import { EventBusService } from "./event-bus.service";

export interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  serviceName: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags: Record<string, string>;
  logs: TraceLog[];
  status: "SUCCESS" | "ERROR" | "TIMEOUT";
  error?: string;
}

export interface TraceLog {
  timestamp: number;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR";
  message: string;
  fields: Record<string, any>;
}

export interface DistributedTrace {
  traceId: string;
  spans: TraceContext[];
  startTime: number;
  endTime: number;
  duration: number;
  serviceCount: number;
  errorCount: number;
  status: "SUCCESS" | "PARTIAL" | "FAILED";
}

export interface PerformanceMetrics {
  serviceName: string;
  operation: string;
  timestamp: number;
  p50: number;
  p95: number;
  p99: number;
  min: number;
  max: number;
  avg: number;
  count: number;
  errorRate: number;
}

export interface ServiceDependency {
  from: string;
  to: string;
  operation: string;
  callCount: number;
  errorCount: number;
  avgResponseTime: number;
  lastCall: number;
}

@Injectable()
export class ObservabilityService {
  private readonly logger = new Logger(ObservabilityService.name);
  private readonly activeTraces = new Map<string, TraceContext>();
  private readonly completedTraces = new Map<string, DistributedTrace>();
  private readonly performanceMetrics = new Map<string, PerformanceMetrics[]>();
  private readonly serviceDependencies = new Map<string, ServiceDependency>();

  private readonly MAX_TRACES = 10000;
  private readonly MAX_PERFORMANCE_HISTORY = 1000;
  private readonly TRACE_RETENTION_TIME = 24 * 60 * 60 * 1000; // 24 hours

  constructor(private readonly eventBusService: EventBusService) {
    this.startTraceCleanup();
    this.startPerformanceCollection();
  }

  private startTraceCleanup(): void {
    setInterval(() => {
      this.cleanupOldTraces();
    }, 60000); // Cleanup every minute

    this.logger.log("Started trace cleanup process");
  }

  private startPerformanceCollection(): void {
    setInterval(() => {
      this.collectPerformanceMetrics();
    }, 30000); // Collect every 30 seconds

    this.logger.log("Started performance metrics collection");
  }

  private cleanupOldTraces(): void {
    const cutoffTime = Date.now() - this.TRACE_RETENTION_TIME;

    // Cleanup completed traces
    for (const [traceId, trace] of this.completedTraces.entries()) {
      if (trace.endTime < cutoffTime) {
        this.completedTraces.delete(traceId);
      }
    }

    // Cleanup performance metrics
    for (const [key, metrics] of this.performanceMetrics.entries()) {
      const filteredMetrics = metrics.filter((m) => m.timestamp > cutoffTime);
      if (filteredMetrics.length === 0) {
        this.performanceMetrics.delete(key);
      } else {
        this.performanceMetrics.set(key, filteredMetrics);
      }
    }

    this.logger.debug(`Cleaned up old traces and metrics`);
  }

  private collectPerformanceMetrics(): void {
    // Collect performance metrics from active traces
    const serviceOperations = new Map<string, number[]>();
    const serviceErrors = new Map<string, number>();

    // Process completed traces to extract performance data
    for (const trace of this.completedTraces.values()) {
      for (const span of trace.spans) {
        const key = `${span.serviceName}:${span.operation}`;

        if (!serviceOperations.has(key)) {
          serviceOperations.set(key, []);
          serviceErrors.set(key, 0);
        }

        if (span.duration) {
          serviceOperations.get(key)!.push(span.duration);
        }

        if (span.status === "ERROR") {
          serviceErrors.set(key, serviceErrors.get(key)! + 1);
        }
      }
    }

    // Calculate performance metrics
    for (const [key, durations] of serviceOperations.entries()) {
      if (durations.length === 0) continue;

      const sortedDurations = durations.sort((a, b) => a - b);
      const errorCount = serviceErrors.get(key) || 0;
      const totalCount = durations.length;

      const metrics: PerformanceMetrics = {
        serviceName: key.split(":")[0],
        operation: key.split(":")[1],
        timestamp: Date.now(),
        p50: this.calculatePercentile(sortedDurations, 50),
        p95: this.calculatePercentile(sortedDurations, 95),
        p99: this.calculatePercentile(sortedDurations, 99),
        min: sortedDurations[0],
        max: sortedDurations[sortedDurations.length - 1],
        avg: durations.reduce((sum, d) => sum + d, 0) / durations.length,
        count: totalCount,
        errorRate: errorCount / totalCount,
      };

      const historyKey = `${metrics.serviceName}:${metrics.operation}`;
      if (!this.performanceMetrics.has(historyKey)) {
        this.performanceMetrics.set(historyKey, []);
      }

      const history = this.performanceMetrics.get(historyKey)!;
      history.push(metrics);

      // Keep only last MAX_PERFORMANCE_HISTORY entries
      if (history.length > this.MAX_PERFORMANCE_HISTORY) {
        history.splice(0, history.length - this.MAX_PERFORMANCE_HISTORY);
      }
    }
  }

  private calculatePercentile(
    sortedArray: number[],
    percentile: number
  ): number {
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
  }

  // Trace management methods
  startTrace(
    traceId: string,
    serviceName: string,
    operation: string,
    parentSpanId?: string
  ): TraceContext {
    const spanId = this.generateSpanId();

    const trace: TraceContext = {
      traceId,
      spanId,
      parentSpanId,
      serviceName,
      operation,
      startTime: Date.now(),
      tags: {},
      logs: [],
      status: "SUCCESS",
    };

    this.activeTraces.set(spanId, trace);

    this.logger.debug(
      `Started trace: ${traceId}, span: ${spanId}, service: ${serviceName}, operation: ${operation}`
    );

    return trace;
  }

  addTraceLog(
    spanId: string,
    level: "DEBUG" | "INFO" | "WARN" | "ERROR",
    message: string,
    fields: Record<string, any> = {}
  ): void {
    const trace = this.activeTraces.get(spanId);
    if (!trace) return;

    const log: TraceLog = {
      timestamp: Date.now(),
      level,
      message,
      fields,
    };

    trace.logs.push(log);

    this.logger.debug(`Added log to trace ${spanId}: ${message}`);
  }

  addTraceTag(spanId: string, key: string, value: string): void {
    const trace = this.activeTraces.get(spanId);
    if (!trace) return;

    trace.tags[key] = value;
  }

  finishTrace(
    spanId: string,
    status: "SUCCESS" | "ERROR" | "TIMEOUT" = "SUCCESS",
    error?: string
  ): void {
    const trace = this.activeTraces.get(spanId);
    if (!trace) return;

    trace.endTime = Date.now();
    trace.duration = trace.endTime - trace.startTime;
    trace.status = status;
    if (error) {
      trace.error = error;
    }

    this.activeTraces.delete(spanId);

    // Add to completed traces
    this.addToCompletedTraces(trace);

    // Update service dependencies
    this.updateServiceDependencies(trace);

    this.logger.debug(
      `Finished trace: ${trace.traceId}, span: ${spanId}, duration: ${trace.duration}ms, status: ${status}`
    );
  }

  private addToCompletedTraces(trace: TraceContext): void {
    let distributedTrace = this.completedTraces.get(trace.traceId);

    if (!distributedTrace) {
      distributedTrace = {
        traceId: trace.traceId,
        spans: [],
        startTime: trace.startTime,
        endTime: trace.endTime!,
        duration: trace.duration!,
        serviceCount: 0,
        errorCount: 0,
        status: "SUCCESS",
      };
      this.completedTraces.set(trace.traceId, distributedTrace);
    }

    distributedTrace.spans.push(trace);
    distributedTrace.serviceCount = new Set(
      distributedTrace.spans.map((s) => s.serviceName)
    ).size;
    distributedTrace.errorCount = distributedTrace.spans.filter(
      (s) => s.status === "ERROR"
    ).length;
    distributedTrace.endTime = Math.max(
      distributedTrace.endTime,
      trace.endTime!
    );
    distributedTrace.duration =
      distributedTrace.endTime - distributedTrace.startTime;

    if (distributedTrace.errorCount > 0) {
      distributedTrace.status =
        distributedTrace.errorCount === distributedTrace.spans.length
          ? "FAILED"
          : "PARTIAL";
    }

    // Publish trace completion event
    this.eventBusService.publish({
      eventId: `trace-${trace.traceId}-${Date.now()}`,
      eventType: "trace.completed",
      eventVersion: "1.0.0",
      timestamp: new Date(),
      source: "observability-service",
      data: {
        traceId: trace.traceId,
        distributedTrace,
      },
    });
  }

  private updateServiceDependencies(trace: TraceContext): void {
    if (!trace.parentSpanId) return;

    const parentTrace = this.completedTraces
      .get(trace.traceId)
      ?.spans.find((s) => s.spanId === trace.parentSpanId);
    if (!parentTrace) return;

    const dependencyKey = `${parentTrace.serviceName}->${trace.serviceName}:${trace.operation}`;
    const existing = this.serviceDependencies.get(dependencyKey);

    if (existing) {
      existing.callCount++;
      if (trace.status === "ERROR") {
        existing.errorCount++;
      }
      existing.avgResponseTime =
        (existing.avgResponseTime * (existing.callCount - 1) +
          (trace.duration || 0)) /
        existing.callCount;
      existing.lastCall = Date.now();
    } else {
      this.serviceDependencies.set(dependencyKey, {
        from: parentTrace.serviceName,
        to: trace.serviceName,
        operation: trace.operation,
        callCount: 1,
        errorCount: trace.status === "ERROR" ? 1 : 0,
        avgResponseTime: trace.duration || 0,
        lastCall: Date.now(),
      });
    }
  }

  private generateSpanId(): string {
    return Math.random().toString(36).substr(2, 16);
  }

  // Public API methods
  getTrace(traceId: string): DistributedTrace | null {
    return this.completedTraces.get(traceId) || null;
  }

  getTraces(
    serviceName?: string,
    operation?: string,
    limit: number = 100
  ): DistributedTrace[] {
    let traces = Array.from(this.completedTraces.values());

    if (serviceName) {
      traces = traces.filter((t) =>
        t.spans.some((s) => s.serviceName === serviceName)
      );
    }

    if (operation) {
      traces = traces.filter((t) =>
        t.spans.some((s) => s.operation === operation)
      );
    }

    return traces.sort((a, b) => b.startTime - a.startTime).slice(0, limit);
  }

  getActiveTraces(): TraceContext[] {
    return Array.from(this.activeTraces.values());
  }

  getPerformanceMetrics(
    serviceName?: string,
    operation?: string
  ): PerformanceMetrics[] {
    if (serviceName && operation) {
      return this.performanceMetrics.get(`${serviceName}:${operation}`) || [];
    }

    if (serviceName) {
      const metrics: PerformanceMetrics[] = [];
      for (const [key, values] of this.performanceMetrics.entries()) {
        if (key.startsWith(`${serviceName}:`)) {
          metrics.push(...values);
        }
      }
      return metrics;
    }

    const allMetrics: PerformanceMetrics[] = [];
    for (const values of this.performanceMetrics.values()) {
      allMetrics.push(...values);
    }
    return allMetrics;
  }

  getServiceDependencies(): ServiceDependency[] {
    return Array.from(this.serviceDependencies.values());
  }

  getServiceTopology(): any {
    const dependencies = this.getServiceDependencies();
    const services = new Set<string>();

    dependencies.forEach((dep) => {
      services.add(dep.from);
      services.add(dep.to);
    });

    return {
      services: Array.from(services),
      dependencies: dependencies.map((dep) => ({
        from: dep.from,
        to: dep.to,
        operation: dep.operation,
        callCount: dep.callCount,
        errorRate: dep.errorCount / dep.callCount,
        avgResponseTime: dep.avgResponseTime,
        lastCall: dep.lastCall,
      })),
    };
  }

  getObservabilitySummary(): any {
    const traces = Array.from(this.completedTraces.values());
    const activeTraces = this.getActiveTraces();
    const dependencies = this.getServiceDependencies();

    const totalSpans = traces.reduce((sum, t) => sum + t.spans.length, 0);
    const errorSpans = traces.reduce((sum, t) => sum + t.errorCount, 0);
    const avgTraceDuration =
      traces.length > 0
        ? traces.reduce((sum, t) => sum + t.duration, 0) / traces.length
        : 0;

    return {
      traces: {
        total: traces.length,
        active: activeTraces.length,
        totalSpans,
        errorSpans,
        errorRate: totalSpans > 0 ? errorSpans / totalSpans : 0,
        avgDuration: avgTraceDuration,
      },
      services: {
        total: new Set(traces.flatMap((t) => t.spans.map((s) => s.serviceName)))
          .size,
        dependencies: dependencies.length,
      },
      performance: {
        metricsCollected: Array.from(this.performanceMetrics.values()).reduce(
          (sum, metrics) => sum + metrics.length,
          0
        ),
        servicesTracked: this.performanceMetrics.size,
      },
    };
  }

  // Health check method
  isHealthy(): boolean {
    const activeTraces = this.getActiveTraces();
    const recentErrors = Array.from(this.completedTraces.values())
      .filter((t) => t.endTime > Date.now() - 300000) // Last 5 minutes
      .reduce((sum, t) => sum + t.errorCount, 0);

    return activeTraces.length < 1000 && recentErrors < 100; // Reasonable thresholds
  }
}
