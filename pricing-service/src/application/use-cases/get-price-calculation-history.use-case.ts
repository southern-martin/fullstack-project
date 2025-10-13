import { Injectable } from "@nestjs/common";
import { PriceCalculationRepositoryInterface } from "../../domain/repositories/price-calculation.repository.interface";
import { PriceCalculationResponseDto } from "../dto/price-calculation-response.dto";

/**
 * Get Price Calculation History Use Case
 * Application service that orchestrates price calculation history retrieval
 * Follows Clean Architecture principles
 */
@Injectable()
export class GetPriceCalculationHistoryUseCase {
  constructor(
    private readonly priceCalculationRepository: PriceCalculationRepositoryInterface
  ) {}

  /**
   * Gets price calculation history with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @param search - Search term
   * @returns Price calculations and pagination info
   */
  async execute(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    priceCalculations: PriceCalculationResponseDto[];
    total: number;
  }> {
    const { priceCalculations, total } =
      await this.priceCalculationRepository.findAll(page, limit, search);

    return {
      priceCalculations: priceCalculations.map((calculation) =>
        this.mapToResponseDto(calculation)
      ),
      total,
    };
  }

  /**
   * Gets price calculation count
   * @returns Price calculation count
   */
  async getCount(): Promise<{ count: number }> {
    const count = await this.priceCalculationRepository.count();
    return { count };
  }

  /**
   * Maps price calculation entity to response DTO
   * @param calculation - Price calculation entity
   * @returns Price calculation response DTO
   */
  private mapToResponseDto(calculation: any): PriceCalculationResponseDto {
    return {
      id: calculation.id,
      requestId: calculation.requestId,
      request: calculation.request,
      calculation: calculation.calculation,
      appliedRules: calculation.appliedRules,
      createdAt: calculation.createdAt,
    };
  }
}
