/**
 * Value Objects Index
 *
 * Centralized exports for all value objects in the domain layer.
 * Makes importing value objects cleaner and more organized.
 */

export { Email } from './email.value-object';
export { PhoneNumber } from './phone-number.value-object';
export { UserPreferences } from './user-preferences.value-object';

// Re-export the ValueObject interface for convenience
export type { ValueObject } from '../interfaces/value-object.interface';
