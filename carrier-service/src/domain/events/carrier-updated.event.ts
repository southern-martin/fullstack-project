import { DomainEvent } from "@fullstack-project/shared-infrastructure";
import { Carrier } from "../entities/carrier.entity";

/**
 * Carrier Updated Event
 * Triggered when a carrier's information is updated
 * Used for: Sync with external systems, analytics, audit logs, cache invalidation
 */
export class CarrierUpdatedEvent extends DomainEvent {
  constructor(
    public readonly carrier: Carrier,
    public readonly previousData?: Partial<Carrier>
  ) {
    super("CarrierUpdated");
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
      updatedAt: this.carrier.updatedAt,
      previousData: this.previousData,
    };
  }
}
