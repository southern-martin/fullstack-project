import { Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';

/**
 * CustomerDomainService
 * 
 * This service encapsulates the core business logic and rules related to customers.
 * It operates on Customer entities and ensures that business rules are enforced
 * independently of application-specific concerns (like data storage or UI).
 */
@Injectable()
export class CustomerDomainService {
  
  /**
   * Validates customer creation data against business rules.
   * @param customerData Partial customer data for creation.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateCustomerCreationData(customerData: Partial<Customer>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Email validation
    if (!customerData.email || !this.isValidEmail(customerData.email)) {
      errors.push('Valid email address is required');
    }

    // Name validation
    if (!customerData.firstName || customerData.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (!customerData.lastName || customerData.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    if (customerData.firstName && customerData.firstName.length > 50) {
      errors.push('First name must not exceed 50 characters');
    }

    if (customerData.lastName && customerData.lastName.length > 50) {
      errors.push('Last name must not exceed 50 characters');
    }

    // Phone validation (optional)
    if (customerData.phone && !this.isValidPhone(customerData.phone)) {
      errors.push('Phone number must be in valid format');
    }

    // Date of birth validation
    if (customerData.dateOfBirth && !this.isValidDateOfBirth(customerData.dateOfBirth)) {
      errors.push('Date of birth must be a valid date and customer must be at least 13 years old');
    }

    // Address validation (optional)
    if (customerData.address && !this.isValidAddress(customerData.address)) {
      errors.push('Address must contain all required fields: street, city, state, zipCode, country');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates customer update data against business rules.
   * @param updateData Partial customer data for update.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateCustomerUpdateData(updateData: Partial<Customer>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Email validation
    if (updateData.email !== undefined && !this.isValidEmail(updateData.email)) {
      errors.push('Valid email address is required');
    }

    // Name validation
    if (updateData.firstName !== undefined) {
      if (!updateData.firstName || updateData.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters');
      }
      if (updateData.firstName.length > 50) {
        errors.push('First name must not exceed 50 characters');
      }
    }

    if (updateData.lastName !== undefined) {
      if (!updateData.lastName || updateData.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters');
      }
      if (updateData.lastName.length > 50) {
        errors.push('Last name must not exceed 50 characters');
      }
    }

    // Phone validation
    if (updateData.phone !== undefined && updateData.phone && !this.isValidPhone(updateData.phone)) {
      errors.push('Phone number must be in valid format');
    }

    // Date of birth validation
    if (updateData.dateOfBirth !== undefined && updateData.dateOfBirth && !this.isValidDateOfBirth(updateData.dateOfBirth)) {
      errors.push('Date of birth must be a valid date and customer must be at least 13 years old');
    }

    // Address validation
    if (updateData.address !== undefined && updateData.address && !this.isValidAddress(updateData.address)) {
      errors.push('Address must contain all required fields: street, city, state, zipCode, country');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Normalizes customer data for consistent storage.
   * @param customerData Raw customer data.
   * @returns Normalized customer data.
   */
  normalizeCustomerData(customerData: Partial<Customer>): Partial<Customer> {
    const normalized = { ...customerData };

    // Normalize email
    if (normalized.email) {
      normalized.email = normalized.email.toLowerCase().trim();
    }

    // Normalize names
    if (normalized.firstName) {
      normalized.firstName = this.capitalizeFirstLetter(normalized.firstName.trim());
    }

    if (normalized.lastName) {
      normalized.lastName = this.capitalizeFirstLetter(normalized.lastName.trim());
    }

    // Normalize phone
    if (normalized.phone) {
      normalized.phone = this.normalizePhone(normalized.phone);
    }

    // Normalize address
    if (normalized.address) {
      normalized.address = this.normalizeAddress(normalized.address);
    }

    return normalized;
  }

  /**
   * Determines if a customer can be deleted based on business rules.
   * @param customer The customer entity.
   * @returns True if the customer can be deleted, false otherwise.
   */
  canDeleteCustomer(customer: Customer): boolean {
    // Business rule: Cannot delete active customers with recent activity
    // This is a placeholder - in a real application, you might check for:
    // - Recent orders
    // - Active subscriptions
    // - Pending payments
    // - etc.
    
    if (customer.isActive) {
      // For now, allow deletion of active customers
      // In a real application, you might have more complex rules
      return true;
    }

    return true;
  }

  /**
   * Determines if a customer can be edited based on business rules.
   * @param customer The customer entity.
   * @returns True if the customer can be edited, false otherwise.
   */
  canEditCustomer(customer: Customer): boolean {
    // Business rule: Can edit any customer
    // In a real application, you might have restrictions like:
    // - Cannot edit customers with pending orders
    // - Cannot edit customers in certain states
    // - etc.
    
    return true;
  }

  /**
   * Calculates customer lifetime value based on business rules.
   * @param customer The customer entity.
   * @param totalOrders Total number of orders.
   * @param totalSpent Total amount spent.
   * @returns Customer lifetime value score.
   */
  calculateCustomerLifetimeValue(
    customer: Customer,
    totalOrders: number = 0,
    totalSpent: number = 0
  ): number {
    let score = 0;

    // Base score for being active
    if (customer.isActive) {
      score += 10;
    }

    // Score based on total orders
    score += Math.min(30, totalOrders * 2);

    // Score based on total spent (assuming amounts in dollars)
    score += Math.min(40, Math.floor(totalSpent / 100));

    // Bonus for having complete profile
    if (customer.phone && customer.address && customer.dateOfBirth) {
      score += 20;
    }

    return Math.min(100, score); // Cap score at 100
  }

  // --- Private Helper Methods for Validation ---

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Check if it's a valid phone number (7-15 digits)
    return digits.length >= 7 && digits.length <= 15;
  }

  private isValidDateOfBirth(dateOfBirth: Date): boolean {
    if (!dateOfBirth) return false;
    
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate()) 
      ? age - 1 
      : age;
    
    // Must be at least 13 years old
    return actualAge >= 13;
  }

  private isValidAddress(address: any): boolean {
    if (!address || typeof address !== 'object') return false;
    
    const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
    return requiredFields.every(field => 
      address[field] && 
      typeof address[field] === 'string' && 
      address[field].trim().length > 0
    );
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private normalizePhone(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    
    // Return original if not a standard US number
    return phone;
  }

  private normalizeAddress(address: any): any {
    if (!address || typeof address !== 'object') return address;
    
    return {
      street: address.street?.trim() || '',
      city: this.capitalizeFirstLetter(address.city?.trim() || ''),
      state: address.state?.toUpperCase().trim() || '',
      zipCode: address.zipCode?.trim() || '',
      country: this.capitalizeFirstLetter(address.country?.trim() || ''),
    };
  }
}
