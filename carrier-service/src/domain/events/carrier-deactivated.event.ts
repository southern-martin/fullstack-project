import { DomainEvent } from "@fullstack-project/shared-infrastructure";
import { Carrier } from "../entities/carrier.entity";

/**
 * Carrier Deactivated Event
 * Triggered when a carrier is deactivated
 * Used for: Disable shipping integrations, notifications, analytics
 */
export class CarrierDeactivatedEvent extends DomainEvent {
  constructor(public readonly carrier: Carrier) {
    super("CarrierDeactivated");
  }

  getEventData(): Record<string, any> {
    return {
      carrierId: this.carrier.id,
      name: this.carrier.name,
      contactEmail: this.carrier.contactEmail,
      deactivatedAt: new Date().toISOString(),
    };
  }
}
