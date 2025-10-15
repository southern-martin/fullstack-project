import { PaginationDto } from "@shared/infrastructure";
import { PriceCalculation } from "../entities/price-calculation.entity";

export interface PriceCalculationRepositoryInterface {
  create(priceCalculation: PriceCalculation): Promise<PriceCalculation>;
  findById(id: number): Promise<PriceCalculation | null>;
  findByRequestId(requestId: string): Promise<PriceCalculation | null>;
  findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ priceCalculations: PriceCalculation[]; total: number }>;
  search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ priceCalculations: PriceCalculation[]; total: number }>;
  update(
    id: number,
    priceCalculation: Partial<PriceCalculation>
  ): Promise<PriceCalculation>;
  delete(id: number): Promise<void>;
  findByCustomerId(customerId: number): Promise<PriceCalculation[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<PriceCalculation[]>;
  count(): Promise<number>;
  findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ priceCalculations: PriceCalculation[]; total: number }>;
}
