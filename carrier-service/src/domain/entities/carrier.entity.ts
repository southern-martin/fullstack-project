export class Carrier {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;
  isActive: boolean;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: {
    code?: string;
    website?: string;
    trackingUrl?: string;
    serviceTypes?: string[];
    coverage?: string[];
    pricing?: {
      baseRate?: number;
      currency?: string;
      perKgRate?: number;
    };
  };

  constructor(data: Partial<Carrier> = {}) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.name = data.name || "";
    this.description = data.description;
    this.isActive = data.isActive ?? true;
    this.contactEmail = data.contactEmail;
    this.contactPhone = data.contactPhone;
    this.metadata = data.metadata;
  }

  get displayName(): string {
    return this.name;
  }

  get isContactable(): boolean {
    return !!(this.contactEmail || this.contactPhone);
  }
}
