import { PriceCalculation } from "../entities/price-calculation.entity";

export interface PriceCalculationRepositoryInterface {
  create(priceCalculation: PriceCalculation): Promise<PriceCalculation>;
  findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ priceCalculations: PriceCalculation[]; total: number }>;
  findById(id: number): Promise<PriceCalculation | null>;
  findByRequestId(requestId: string): Promise<PriceCalculation | null>;
  findByCustomerId(customerId: number): Promise<PriceCalculation[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<PriceCalculation[]>;
  update(
    id: number,
    priceCalculation: Partial<PriceCalculation>
  ): Promise<PriceCalculation>;
  delete(id: number): Promise<void>;
  count(): Promise<number>;
}




