import { Inject, Injectable } from "@nestjs/common";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";
import { PriceCalculationRepositoryInterface } from "../../domain/repositories/price-calculation.repository.interface";
import { PriceCalculationResponseDto } from "../dto/price-calculation-response.dto";

/**
 * Get Price Calculation History Use Case
 * Application service that orchestrates price calculation history retrieval
 * Follows Clean Architecture principles
 */
@Injectable()
export class GetPriceCalculationHistoryUseCase {
  private readonly logger = new WinstonLoggerService();

  constructor(
    @Inject("PriceCalculationRepositoryInterface")
    private readonly priceCalculationRepository: PriceCalculationRepositoryInterface
  ) {
    this.logger.setContext(GetPriceCalculationHistoryUseCase.name);
  }

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
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      this.logger.debug("Getting price calculation history", {
        page,
        limit,
        search,
      });

      const { priceCalculations, total } =
        await this.priceCalculationRepository.findPaginated(
          page,
          limit,
          search
        );
      const totalPages = Math.ceil(total / limit);

      this.logger.debug("Retrieved price calculation history", {
        total,
        returned: priceCalculations.length,
        page,
        totalPages,
      });

      return {
        priceCalculations: priceCalculations.map((calculation) =>
          this.mapToResponseDto(calculation)
        ),
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get price calculation history: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Gets price calculation count
   * @returns Price calculation count
   */
  async getCount(): Promise<{ count: number }> {
    try {
      this.logger.debug("Getting price calculation count");

      const count = await this.priceCalculationRepository.count();

      this.logger.debug("Retrieved price calculation count", { count });

      return { count };
    } catch (error) {
      this.logger.error(
        `Failed to get price calculation count: ${error.message}`,
        error.stack
      );
      throw error;
    }
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
      calculatedAt: calculation.calculatedAt,
      createdAt: calculation.createdAt,
      updatedAt: calculation.updatedAt,
    };
  }
}
