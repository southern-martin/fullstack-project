import { Expose } from "class-transformer";

export class PricingRuleResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  isActive: boolean;

  @Expose()
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

  @Expose()
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

  @Expose()
  priority: number;

  @Expose()
  validFrom: Date;

  @Expose()
  validTo: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
