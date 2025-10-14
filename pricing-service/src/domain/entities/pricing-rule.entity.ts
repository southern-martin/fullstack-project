export class PricingRule {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;
  isActive: boolean;
  conditions: {
    carrierId?: number;
    serviceType?: string;
    weightRange?: {
      min: number;
      max: number;
    };
    distanceRange?: {
      min: number;
      max: number;
    };
    originCountry?: string;
    destinationCountry?: string;
    customerType?: string;
  };
  pricing: {
    baseRate: number;
    currency: string;
    perKgRate?: number;
    perKmRate?: number;
    minimumCharge?: number;
    maximumCharge?: number;
    surcharges?: Array<{
      type: string;
      amount?: number;
      percentage?: number;
    }>;
    discounts?: Array<{
      type: string;
      amount?: number;
      percentage?: number;
    }>;
  };
  priority: number;
  validFrom?: Date;
  validTo?: Date;

  constructor(data: Partial<PricingRule> = {}) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.name = data.name || "";
    this.description = data.description;
    this.isActive = data.isActive ?? true;
    this.conditions = data.conditions || {};
    this.pricing = data.pricing || { baseRate: 0, currency: "USD" };
    this.priority = data.priority ?? 0;
    this.validFrom = data.validFrom;
    this.validTo = data.validTo;
  }

  get isCurrentlyValid(): boolean {
    const now = new Date();
    const validFrom = this.validFrom ? new Date(this.validFrom) : null;
    const validTo = this.validTo ? new Date(this.validTo) : null;

    if (validFrom && now < validFrom) return false;
    if (validTo && now > validTo) return false;
    return true;
  }

  get displayName(): string {
    return this.name;
  }
}
