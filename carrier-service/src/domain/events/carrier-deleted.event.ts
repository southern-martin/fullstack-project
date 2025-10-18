import { DomainEvent } from "@fullstack-project/shared-infrastructure";
import { Carrier } from "../entities/carrier.entity";

/**
 * Carrier Deleted Event
 * Triggered when a carrier is deleted
 * Used for: Cleanup operations, analytics, audit logs, cascade deletions
 */
export class CarrierDeletedEvent extends DomainEvent {
  constructor(public readonly carrier: Carrier) {
    super("CarrierDeleted");
  }

  getEventData(): Record<string, any> {
    return {
      carrierId: this.carrier.id,
      name: this.carrier.name,
      deletedAt: new Date().toISOString(),
    };
  }
}
