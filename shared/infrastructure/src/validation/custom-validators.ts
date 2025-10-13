import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

/**
 * Custom Validators
 *
 * Custom validation decorators for common validation scenarios.
 */

/**
 * Is Not Empty String validator
 */
export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isNotEmptyString",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === "string" && value.trim().length > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be empty`;
        },
      },
    });
  };
}

/**
 * Is Strong Password validator
 */
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isStrongPassword",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") return false;

          const hasMinLength = value.length >= 8;
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumbers = /\d/.test(value);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

          return (
            hasMinLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be at least 8 characters long and contain uppercase, lowercase, number, and special character`;
        },
      },
    });
  };
}

/**
 * Is Valid Phone Number validator
 */
export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidPhoneNumber",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") return false;

          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid phone number`;
        },
      },
    });
  };
}

/**
 * Is Valid URL validator
 */
export function IsValidUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidUrl",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") return false;

          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid URL`;
        },
      },
    });
  };
}

/**
 * Is Valid Date String validator
 */
export function IsValidDateString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidDateString",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") return false;

          const date = new Date(value);
          return date instanceof Date && !isNaN(date.getTime());
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid date string`;
        },
      },
    });
  };
}

/**
 * Is Valid UUID validator
 */
export function IsValidUuid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidUuid",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") return false;

          const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          return uuidRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid UUID`;
        },
      },
    });
  };
}

/**
 * Is In Range validator for numbers
 */
export function IsInRange(
  min: number,
  max: number,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isInRange",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [min, max],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [minValue, maxValue] = args.constraints;
          const numValue = Number(value);

          return (
            !isNaN(numValue) && numValue >= minValue && numValue <= maxValue
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [minValue, maxValue] = args.constraints;
          return `${args.property} must be between ${minValue} and ${maxValue}`;
        },
      },
    });
  };
}

/**
 * Is Array Length validator
 */
export function IsArrayLength(
  min: number,
  max?: number,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isArrayLength",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [min, max],
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) return false;

          const [minLength, maxLength] = args.constraints;

          if (value.length < minLength) return false;
          if (maxLength && value.length > maxLength) return false;

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [minLength, maxLength] = args.constraints;
          if (maxLength) {
            return `${args.property} must contain between ${minLength} and ${maxLength} items`;
          }
          return `${args.property} must contain at least ${minLength} items`;
        },
      },
    });
  };
}

/**
 * Is Not Empty Array validator
 */
export function IsNotEmptyArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isNotEmptyArray",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Array.isArray(value) && value.length > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be empty`;
        },
      },
    });
  };
}

/**
 * Is Valid Enum validator
 */
export function IsValidEnum(
  enumObject: any,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidEnum",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumObject],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [enumObj] = args.constraints;
          return Object.values(enumObj).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          const [enumObj] = args.constraints;
          const validValues = Object.values(enumObj).join(", ");
          return `${args.property} must be one of: ${validValues}`;
        },
      },
    });
  };
}

/**
 * Is Future Date validator
 */
export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isFutureDate",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") return false;

          const date = new Date(value);
          if (!(date instanceof Date && !isNaN(date.getTime()))) return false;

          return date > new Date();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a future date`;
        },
      },
    });
  };
}

/**
 * Is Past Date validator
 */
export function IsPastDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isPastDate",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") return false;

          const date = new Date(value);
          if (!(date instanceof Date && !isNaN(date.getTime()))) return false;

          return date < new Date();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a past date`;
        },
      },
    });
  };
}
