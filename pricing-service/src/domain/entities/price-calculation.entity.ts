export class PriceCalculation {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  requestId: string;
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
  appliedRules?: Array<{
    ruleId: number;
    ruleName: string;
    priority: number;
  }>;
  calculatedAt?: Date;

  constructor(data: Partial<PriceCalculation> = {}) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.requestId = data.requestId || "";
    this.request = data.request || {
      carrierId: 0,
      serviceType: "",
      weight: 0,
      originCountry: "",
      destinationCountry: "",
    };
    this.calculation = data.calculation || {
      baseRate: 0,
      weightRate: 0,
      surcharges: [],
      discounts: [],
      subtotal: 0,
      total: 0,
      currency: "USD",
    };
    this.appliedRules = data.appliedRules;
    this.calculatedAt = data.calculatedAt;
  }

  get totalAmount(): number {
    return this.calculation.total;
  }

  get currency(): string {
    return this.calculation.currency;
  }
}
