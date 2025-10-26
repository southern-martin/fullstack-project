import { Injectable, Logger } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { IEventBus } from "../../domain/events/event-bus.interface";

/**
 * Redis Event Bus
 * Implements event publishing using Redis Pub/Sub
 * Uses shared Redis instance for cross-service communication
 */
@Injectable()
export class RedisEventBus implements IEventBus {
  private readonly logger = new Logger(RedisEventBus.name);
  private readonly client: RedisClientType;
  private readonly channel = "customer-service-events";
  private isConnected = false;

  constructor() {
    const redisHost = process.env.REDIS_HOST || "localhost";
    const redisPort = parseInt(process.env.REDIS_PORT || "6379");
    const redisPassword = process.env.REDIS_PASSWORD;

    const config: any = {
      socket: {
        host: redisHost,
        port: redisPort,
      },
    };

    // Only add password if it's actually set
    if (redisPassword) {
      config.password = redisPassword;
    }

    this.client = createClient(config) as RedisClientType;

    this.initialize();
  }

  /**
   * Initialize Redis connection
   */
  private async initialize(): Promise<void> {
    try {
      this.client.on("error", (err) => {
        this.logger.error("Redis Client Error:", err);
        this.isConnected = false;
      });

      this.client.on("connect", () => {
        this.logger.log("Redis Client Connected");
        this.isConnected = true;
      });

      this.client.on("ready", () => {
        this.logger.log("Redis Client Ready");
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (error) {
      this.logger.error("Failed to connect to Redis:", error);
      this.isConnected = false;
    }
  }

  /**
   * Publish a single domain event
   * @param event - The domain event to publish
   */
  async publish(event: any): Promise<void> {
    try {
      if (!this.isConnected) {
        this.logger.warn(
          "Redis not connected, attempting to reconnect before publishing"
        );
        await this.initialize();
      }

      const eventData = {
        eventType: event.eventType || event.constructor.name,
        eventId: event.eventId,
        occurredOn: event.occurredOn,
        data: event.getEventData ? event.getEventData() : event,
        metadata: event.getEventMetadata ? event.getEventMetadata() : {},
      };

      const message = JSON.stringify(eventData);

      // Publish to Redis channel
      await this.client.publish(this.channel, message);

      this.logger.log(
        `Published event: ${eventData.eventType} (ID: ${eventData.eventId})`
      );

      // Also store in Redis with expiration for event sourcing/debugging
      const eventKey = `${process.env.REDIS_KEY_PREFIX || "customer"}:events:${
        eventData.eventType
      }:${eventData.eventId}`;
      await this.client.setEx(eventKey, 86400, message); // 24 hour TTL
    } catch (error) {
      this.logger.error("Failed to publish event:", error);
      // Don't throw - event publishing failures shouldn't break the main flow
      // In production, you might want to add retry logic or dead letter queue
    }
  }

  /**
   * Publish multiple domain events
   * @param events - Array of domain events to publish
   */
  async publishAll(events: any[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  /**
   * Close Redis connection
   * Should be called on application shutdown
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.quit();
      this.isConnected = false;
      this.logger.log("Redis Client Disconnected");
    } catch (error) {
      this.logger.error("Error disconnecting Redis:", error);
    }
  }
}
