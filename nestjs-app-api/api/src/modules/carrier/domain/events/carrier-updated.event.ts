import { DomainEvent } from "../../../../shared/kernel/domain-event";

export class CarrierUpdatedEvent extends DomainEvent {
  constructor(
    public readonly carrierId: number,
    public readonly name: string,
    public readonly code?: string,
    public readonly updatedAt?: Date
  ) {
    super();
  }
}
