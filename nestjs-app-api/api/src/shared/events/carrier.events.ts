import { BaseEventClass } from "../interfaces/event.interface";

/**
 * Carrier Created Event
 */
export class CarrierCreatedEvent extends BaseEventClass {
  constructor(
    public readonly data: {
      carrierId: number;
      name: string;
      code: string;
      isActive: boolean;
    },
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    super(
      "carrier.created",
      "1.0.0",
      "carrier-service",
      correlationId,
      metadata
    );
  }
}

/**
 * Carrier Updated Event
 */
export class CarrierUpdatedEvent extends BaseEventClass {
  constructor(
    public readonly data: {
      carrierId: number;
      name: string;
      code: string;
      isActive: boolean;
      updatedFields: string[];
    },
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    super(
      "carrier.updated",
      "1.0.0",
      "carrier-service",
      correlationId,
      metadata
    );
  }
}

/**
 * Carrier Deleted Event
 */
export class CarrierDeletedEvent extends BaseEventClass {
  constructor(
    public readonly data: {
      carrierId: number;
      name: string;
      code: string;
    },
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    super(
      "carrier.deleted",
      "1.0.0",
      "carrier-service",
      correlationId,
      metadata
    );
  }
}

/**
 * Carrier Status Changed Event
 */
export class CarrierStatusChangedEvent extends BaseEventClass {
  constructor(
    public readonly data: {
      carrierId: number;
      name: string;
      code: string;
      previousStatus: boolean;
      newStatus: boolean;
    },
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    super(
      "carrier.status-changed",
      "1.0.0",
      "carrier-service",
      correlationId,
      metadata
    );
  }
}
