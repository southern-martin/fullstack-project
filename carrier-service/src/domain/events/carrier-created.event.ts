import { DomainEvent } from "@fullstack-project/shared-infrastructure";
import { Carrier } from "../entities/carrier.entity";

/**
 * Carrier Created Event
 * Triggered when a new carrier is created
 * Used for: Logistics integration, analytics, notification service, audit logs
 */
export class CarrierCreatedEvent extends DomainEvent {
  constructor(public readonly carrier: Carrier) {
    super("CarrierCreated");
  }

  getEventData(): Record<string, any> {
    return {
      carrierId: this.carrier.id,
      name: this.carrier.name,
      description: this.carrier.description,
      isActive: this.carrier.isActive,
      contactEmail: this.carrier.contactEmail,
      contactPhone: this.carrier.contactPhone,
      metadata: this.carrier.metadata,
      createdAt: this.carrier.createdAt,
    };
  }
}
