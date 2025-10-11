import { BaseEventClass } from "../interfaces/event.interface";

/**
 * User Created Event
 */
export class UserCreatedEvent extends BaseEventClass {
  constructor(
    public readonly data: {
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
    },
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    super("user.created", "1.0.0", "user-service", correlationId, metadata);
  }
}

/**
 * User Updated Event
 */
export class UserUpdatedEvent extends BaseEventClass {
  constructor(
    public readonly data: {
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
      updatedFields: string[];
    },
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    super("user.updated", "1.0.0", "user-service", correlationId, metadata);
  }
}

/**
 * User Deleted Event
 */
export class UserDeletedEvent extends BaseEventClass {
  constructor(
    public readonly data: {
      userId: number;
      email: string;
    },
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    super("user.deleted", "1.0.0", "user-service", correlationId, metadata);
  }
}

/**
 * User Logged In Event
 */
export class UserLoggedInEvent extends BaseEventClass {
  constructor(
    public readonly data: {
      userId: number;
      email: string;
      loginTime: Date;
      ipAddress?: string;
    },
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    super("user.logged-in", "1.0.0", "auth-service", correlationId, metadata);
  }
}

/**
 * User Logged Out Event
 */
export class UserLoggedOutEvent extends BaseEventClass {
  constructor(
    public readonly data: {
      userId: number;
      email: string;
      logoutTime: Date;
    },
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    super("user.logged-out", "1.0.0", "auth-service", correlationId, metadata);
  }
}
