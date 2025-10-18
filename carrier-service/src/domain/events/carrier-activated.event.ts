import { DomainEvent } from "@fullstack-project/shared-infrastructure";
import { Carrier } from "../entities/carrier.entity";

/**
 * Carrier Activated Event
 * Triggered when a carrier is activated
 * Used for: Enable shipping integrations, notifications, analytics
 */
export class CarrierActivatedEvent extends DomainEvent {
  constructor(public readonly carrier: Carrier) {
    super("CarrierActivated");
  }

  getEventData(): Record<string, any> {
    return {
      carrierId: this.carrier.id,
      name: this.carrier.name,
      contactEmail: this.carrier.contactEmail,
      activatedAt: new Date().toISOString(),
    };
  }
}
