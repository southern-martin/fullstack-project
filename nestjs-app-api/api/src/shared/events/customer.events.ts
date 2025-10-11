import { BaseEventClass } from "../interfaces/event.interface";

/**
 * Customer Created Event
 */
export class CustomerCreatedEvent extends BaseEventClass {
  constructor(
    public readonly data: {
      customerId: number;
      firstName: string;
      lastName: string;
      email: string;
      userId?: number;
    },
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    super(
      "customer.created",
      "1.0.0",
      "customer-service",
      correlationId,
      metadata
    );
  }
}

/**
 * Customer Updated Event
 */
export class CustomerUpdatedEvent extends BaseEventClass {
  constructor(
    public readonly data: {
      customerId: number;
      firstName: string;
      lastName: string;
      email: string;
      updatedFields: string[];
    },
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    super(
      "customer.updated",
      "1.0.0",
      "customer-service",
      correlationId,
      metadata
    );
  }
}

/**
 * Customer Deleted Event
 */
export class CustomerDeletedEvent extends BaseEventClass {
  constructor(
    public readonly data: {
      customerId: number;
      firstName: string;
      lastName: string;
      email: string;
    },
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    super(
      "customer.deleted",
      "1.0.0",
      "customer-service",
      correlationId,
      metadata
    );
  }
}
