import { Injectable } from "@nestjs/common";
import { Customer } from "../entities/customer.entity";

/**
 * Domain service for customer business logic
 * Contains pure business rules without infrastructure concerns
 */
@Injectable()
export class CustomerDomainService {
  /**
   * Validates customer creation data
   * Business rule: All required fields must be present and valid
   */
  validateCustomerCreationData(customerData: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    address?: any;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Email validation
    if (!customerData.email || !this.isValidEmail(customerData.email)) {
      errors.push("Valid email is required");
    }

    // Name validation
    if (!customerData.firstName || customerData.firstName.trim().length < 2) {
      errors.push("First name must be at least 2 characters");
    }

    if (!customerData.lastName || customerData.lastName.trim().length < 2) {
      errors.push("Last name must be at least 2 characters");
    }

    // Phone validation (optional)
    if (customerData.phone && !this.isValidPhone(customerData.phone)) {
      errors.push("Phone number format is invalid");
    }

    // Date of birth validation (optional)
    if (
      customerData.dateOfBirth &&
      !this.isValidDateOfBirth(customerData.dateOfBirth)
    ) {
      errors.push(
        "Date of birth must be a valid date and customer must be at least 13 years old"
      );
    }

    // Address validation (optional)
    if (customerData.address && !this.isValidAddress(customerData.address)) {
      errors.push("Address format is invalid");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates customer update data
   * Business rule: Cannot update certain fields after creation
   */
  validateCustomerUpdateData(updateData: Partial<Customer>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Email validation
    if (
      updateData.email !== undefined &&
      !this.isValidEmail(updateData.email)
    ) {
      errors.push("Email format is invalid");
    }

    // Name validation
    if (
      updateData.firstName !== undefined &&
      updateData.firstName.trim().length < 2
    ) {
      errors.push("First name must be at least 2 characters");
    }

    if (
      updateData.lastName !== undefined &&
      updateData.lastName.trim().length < 2
    ) {
      errors.push("Last name must be at least 2 characters");
    }

    // Phone validation
    if (
      updateData.phone !== undefined &&
      !this.isValidPhone(updateData.phone)
    ) {
      errors.push("Phone number format is invalid");
    }

    // Date of birth validation
    if (
      updateData.dateOfBirth &&
      !this.isValidDateOfBirth(updateData.dateOfBirth.toString())
    ) {
      errors.push(
        "Date of birth must be a valid date and customer must be at least 13 years old"
      );
    }

    // Address validation
    if (updateData.address && !this.isValidAddress(updateData.address)) {
      errors.push("Address format is invalid");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Determines if customer can be deactivated
   * Business rule: Cannot deactivate customer if they have active orders
   */
  canDeactivateCustomer(customer: Customer, hasActiveOrders: boolean): boolean {
    if (!hasActiveOrders) {
      return true;
    }

    // Business rule: Cannot deactivate customer with active orders
    return false;
  }

  /**
   * Determines if customer can be deleted
   * Business rule: Cannot delete customer if they have any orders
   */
  canDeleteCustomer(customer: Customer, hasAnyOrders: boolean): boolean {
    if (!hasAnyOrders) {
      return true;
    }

    // Business rule: Cannot delete customer with orders
    return false;
  }

  /**
   * Calculates customer age
   * Business rule: Age calculated from date of birth
   */
  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Determines if customer is eligible for premium status
   * Business rule: Premium status based on age and activity
   */
  isEligibleForPremiumStatus(customer: Customer, totalOrders: number): boolean {
    const age = customer.dateOfBirth
      ? this.calculateAge(customer.dateOfBirth)
      : 0;

    // Business rule: Premium status requires age >= 18 and >= 10 orders
    return age >= 18 && totalOrders >= 10;
  }

  /**
   * Validates customer preferences
   * Business rule: Preferences must be valid JSON and within size limits
   */
  validatePreferences(preferences: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (preferences === null || preferences === undefined) {
      return { isValid: true, errors: [] };
    }

    try {
      const preferencesString = JSON.stringify(preferences);
      if (preferencesString.length > 2000) {
        errors.push("Preferences must not exceed 2000 characters");
      }
    } catch (error) {
      errors.push("Preferences must be valid JSON");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Determines customer display name
   * Business rule: Display name is first name + last name
   */
  getCustomerDisplayName(customer: Customer): string {
    return `${customer.firstName} ${customer.lastName}`.trim();
  }

  /**
   * Determines if customer needs email verification
   * Business rule: All new customers need email verification
   */
  needsEmailVerification(customer: Customer): boolean {
    return !customer.isEmailVerified;
  }

  // Private helper methods

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  }

  private isValidDateOfBirth(dateOfBirth: string): boolean {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    // Check if date is valid
    if (isNaN(birthDate.getTime())) {
      return false;
    }

    // Check if date is not in the future
    if (birthDate > today) {
      return false;
    }

    // Check if customer is at least 13 years old
    const age = this.calculateAge(birthDate);
    return age >= 13;
  }

  private isValidAddress(address: any): boolean {
    if (!address || typeof address !== "object") {
      return false;
    }

    // Basic address validation
    const requiredFields = ["street", "city", "country"];
    return requiredFields.every(
      (field) =>
        address[field] &&
        typeof address[field] === "string" &&
        address[field].trim().length > 0
    );
  }
}
