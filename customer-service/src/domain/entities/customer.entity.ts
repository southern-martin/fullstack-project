export class Customer {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    company?: string;
    industry?: string;
    preferredContact?: string;
    newsletter?: boolean;
  };

  constructor(data: Partial<Customer> = {}) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.email = data.email || "";
    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.phone = data.phone;
    this.isActive = data.isActive ?? true;
    this.dateOfBirth = data.dateOfBirth;
    this.address = data.address;
    this.preferences = data.preferences;
  }

  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}
