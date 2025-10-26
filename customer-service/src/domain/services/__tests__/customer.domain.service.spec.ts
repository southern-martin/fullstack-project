import { Test, TestingModule } from '@nestjs/testing';
import { CustomerDomainService } from '../customer.domain.service';
import { Customer } from '../../entities/customer.entity';

describe('CustomerDomainService', () => {
  let service: CustomerDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerDomainService],
    }).compile();

    service = module.get<CustomerDomainService>(CustomerDomainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateCustomerCreationData', () => {
    it('should validate correct customer data', () => {
      const validData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          country: 'USA',
        },
      };

      const result = service.validateCustomerCreationData(validData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = service.validateCustomerCreationData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid email is required');
    });

    it('should fail validation for missing email', () => {
      const invalidData = {
        email: '',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = service.validateCustomerCreationData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid email is required');
    });

    it('should fail validation for short first name', () => {
      const invalidData = {
        email: 'test@example.com',
        firstName: 'J',
        lastName: 'Doe',
      };

      const result = service.validateCustomerCreationData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'First name must be at least 2 characters'
      );
    });

    it('should fail validation for short last name', () => {
      const invalidData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'D',
      };

      const result = service.validateCustomerCreationData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Last name must be at least 2 characters'
      );
    });

    it('should fail validation for invalid phone format', () => {
      const invalidData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: 'abc',
      };

      const result = service.validateCustomerCreationData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Phone number format is invalid');
    });

    it('should fail validation for invalid date of birth', () => {
      const invalidData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: 'invalid-date',
      };

      const result = service.validateCustomerCreationData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Date of birth must be a valid date and customer must be at least 13 years old'
      );
    });

    it('should fail validation for future date of birth', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const invalidData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: futureDate.toISOString(),
      };

      const result = service.validateCustomerCreationData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Date of birth must be a valid date and customer must be at least 13 years old'
      );
    });

    it('should fail validation for customer under 13 years old', () => {
      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 10);

      const invalidData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: recentDate.toISOString(),
      };

      const result = service.validateCustomerCreationData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Date of birth must be a valid date and customer must be at least 13 years old'
      );
    });

    it('should fail validation for invalid address', () => {
      const invalidData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        address: {
          street: '123 Main St',
          // missing city and country
        },
      };

      const result = service.validateCustomerCreationData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Address format is invalid');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const invalidData = {
        email: 'invalid-email',
        firstName: 'J',
        lastName: '',
        phone: 'abc',
      };

      const result = service.validateCustomerCreationData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateCustomerUpdateData', () => {
    it('should validate correct update data', () => {
      const validUpdateData: Partial<Customer> = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+9876543210',
      };

      const result = service.validateCustomerUpdateData(validUpdateData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for invalid email in update', () => {
      const invalidUpdateData: Partial<Customer> = {
        email: 'invalid-email',
      };

      const result = service.validateCustomerUpdateData(invalidUpdateData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email format is invalid');
    });

    it('should fail validation for short first name in update', () => {
      const invalidUpdateData: Partial<Customer> = {
        firstName: 'J',
      };

      const result = service.validateCustomerUpdateData(invalidUpdateData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'First name must be at least 2 characters'
      );
    });

    it('should allow empty update data', () => {
      const emptyUpdateData: Partial<Customer> = {};

      const result = service.validateCustomerUpdateData(emptyUpdateData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('canDeactivateCustomer', () => {
    let mockCustomer: Customer;

    beforeEach(() => {
      mockCustomer = new Customer({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('should allow deactivation when customer has no active orders', () => {
      const result = service.canDeactivateCustomer(mockCustomer, false);

      expect(result).toBe(true);
    });

    it('should not allow deactivation when customer has active orders', () => {
      const result = service.canDeactivateCustomer(mockCustomer, true);

      expect(result).toBe(false);
    });
  });

  describe('canDeleteCustomer', () => {
    let mockCustomer: Customer;

    beforeEach(() => {
      mockCustomer = new Customer({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('should allow deletion when customer has no orders', () => {
      const result = service.canDeleteCustomer(mockCustomer, false);

      expect(result).toBe(true);
    });

    it('should not allow deletion when customer has any orders', () => {
      const result = service.canDeleteCustomer(mockCustomer, true);

      expect(result).toBe(false);
    });
  });

  describe('calculateAge', () => {
    it('should calculate correct age', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);

      const age = service.calculateAge(birthDate);

      expect(age).toBe(25);
    });

    it('should handle birthday not yet occurred this year', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      birthDate.setMonth(birthDate.getMonth() + 2); // Birthday is 2 months in the future

      const age = service.calculateAge(birthDate);

      expect(age).toBe(24); // Should be 24 since birthday hasn't occurred yet
    });

    it('should calculate age correctly for exactly 18 years old', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 18);

      const age = service.calculateAge(birthDate);

      expect(age).toBe(18);
    });
  });

  describe('isEligibleForPremiumStatus', () => {
    it('should return true for eligible customer (age >= 18, orders >= 10)', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);

      const customer = new Customer({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: birthDate,
      });

      const result = service.isEligibleForPremiumStatus(customer, 15);

      expect(result).toBe(true);
    });

    it('should return false for customer under 18', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 16);

      const customer = new Customer({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: birthDate,
      });

      const result = service.isEligibleForPremiumStatus(customer, 15);

      expect(result).toBe(false);
    });

    it('should return false for customer with less than 10 orders', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);

      const customer = new Customer({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: birthDate,
      });

      const result = service.isEligibleForPremiumStatus(customer, 5);

      expect(result).toBe(false);
    });

    it('should return false for customer without date of birth', () => {
      const customer = new Customer({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      const result = service.isEligibleForPremiumStatus(customer, 15);

      expect(result).toBe(false);
    });

    it('should return true for customer exactly 18 with exactly 10 orders', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 18);

      const customer = new Customer({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: birthDate,
      });

      const result = service.isEligibleForPremiumStatus(customer, 10);

      expect(result).toBe(true);
    });
  });

  describe('validatePreferences', () => {
    it('should validate null preferences', () => {
      const result = service.validatePreferences(null);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate undefined preferences', () => {
      const result = service.validatePreferences(undefined);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate valid preferences object', () => {
      const validPreferences = {
        theme: 'dark',
        notifications: true,
        language: 'en',
      };

      const result = service.validatePreferences(validPreferences);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for preferences exceeding size limit', () => {
      const largePreferences = {
        data: 'x'.repeat(2001),
      };

      const result = service.validatePreferences(largePreferences);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Preferences must not exceed 2000 characters'
      );
    });
  });

  describe('getCustomerDisplayName', () => {
    it('should return correct display name', () => {
      const customer = new Customer({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      const displayName = service.getCustomerDisplayName(customer);

      expect(displayName).toBe('John Doe');
    });

    it('should handle extra spaces', () => {
      const customer = new Customer({
        email: 'test@example.com',
        firstName: '  John  ',
        lastName: '  Doe  ',
      });

      const displayName = service.getCustomerDisplayName(customer);

      expect(displayName).toContain('John');
      expect(displayName).toContain('Doe');
    });
  });

  describe('needsEmailVerification', () => {
    it('should return true for all customers', () => {
      const customer = new Customer({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      const result = service.needsEmailVerification(customer);

      expect(result).toBe(true);
    });
  });
});
