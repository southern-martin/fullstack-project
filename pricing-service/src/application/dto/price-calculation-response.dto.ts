import { Expose } from "class-transformer";

export class PriceCalculationResponseDto {
  @Expose()
  id: number;

  @Expose()
  requestId: string;

  @Expose()
  request: {
    carrierId: number;
    serviceType: string;
    weight: number;
    distance?: number;
    originCountry: string;
    destinationCountry: string;
    customerType?: string;
    customerId?: number;
  };

  @Expose()
  calculation: {
    baseRate: number;
    weightRate: number;
    distanceRate?: number;
    surcharges: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
    discounts: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
    subtotal: number;
    total: number;
    currency: string;
  };

  @Expose()
  appliedRules: Array<{
    ruleId: number;
    ruleName: string;
    priority: number;
  }>;

  @Expose()
  calculatedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}




