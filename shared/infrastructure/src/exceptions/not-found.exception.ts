import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Not Found Exception
 *
 * Custom exception for handling resource not found errors.
 * This is a specialized exception for 404 errors with additional context.
 */
export class NotFoundException extends HttpException {
  constructor(
    message: string,
    public readonly resource?: string,
    public readonly identifier?: string | number,
    public readonly searchCriteria?: Record<string, any>
  ) {
    super(
      {
        message,
        resource,
        identifier,
        searchCriteria,
        statusCode: HttpStatus.NOT_FOUND,
        error: "Not Found",
      },
      HttpStatus.NOT_FOUND
    );
  }

  /**
   * Creates a NotFoundException for a specific resource
   */
  static forResource(
    resource: string, 
    identifier?: string | number,
    searchCriteria?: Record<string, any>
  ): NotFoundException {
    const message = identifier 
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    
    return new NotFoundException(message, resource, identifier, searchCriteria);
  }

  /**
   * Creates a NotFoundException for a user
   */
  static forUser(userId: string | number): NotFoundException {
    return NotFoundException.forResource('User', userId);
  }

  /**
   * Creates a NotFoundException for a customer
   */
  static forCustomer(customerId: string | number): NotFoundException {
    return NotFoundException.forResource('Customer', customerId);
  }

  /**
   * Creates a NotFoundException for a carrier
   */
  static forCarrier(carrierId: string | number): NotFoundException {
    return NotFoundException.forResource('Carrier', carrierId);
  }

  /**
   * Creates a NotFoundException for a pricing rule
   */
  static forPricingRule(ruleId: string | number): NotFoundException {
    return NotFoundException.forResource('Pricing Rule', ruleId);
  }

  /**
   * Creates a NotFoundException for a role
   */
  static forRole(roleId: string | number): NotFoundException {
    return NotFoundException.forResource('Role', roleId);
  }

  /**
   * Creates a NotFoundException for a translation
   */
  static forTranslation(translationId: string | number): NotFoundException {
    return NotFoundException.forResource('Translation', translationId);
  }

  /**
   * Creates a NotFoundException for a language
   */
  static forLanguage(languageId: string | number): NotFoundException {
    return NotFoundException.forResource('Language', languageId);
  }

  /**
   * Get the resource name
   */
  getResource(): string | undefined {
    return this.resource;
  }

  /**
   * Get the identifier that was not found
   */
  getIdentifier(): string | number | undefined {
    return this.identifier;
  }

  /**
   * Get the search criteria used
   */
  getSearchCriteria(): Record<string, any> | undefined {
    return this.searchCriteria;
  }

  /**
   * Check if this is for a specific resource type
   */
  isForResource(resource: string): boolean {
    return this.resource?.toLowerCase() === resource.toLowerCase();
  }
}
