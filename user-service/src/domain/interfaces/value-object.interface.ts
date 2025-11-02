/**
 * Value Object Interface
 *
 * Base interface for all value objects in the domain layer.
 * Follows Domain-Driven Design patterns.
 *
 * Value Objects are:
 * - Immutable after creation
 * - Validated before creation
 * - Equality based on value, not reference
 * - Have no identity separate from their value
 */
export interface ValueObject {
  /**
   * Convert to string representation
   */
  toString(): string;

  /**
   * Convert to JSON representation
   */
  toJSON(): string | object;

  /**
   * Check equality with another value object
   */
  equals(other: ValueObject): boolean;
}
