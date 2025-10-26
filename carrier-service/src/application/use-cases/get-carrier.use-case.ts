import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";
import { CarrierRepositoryInterface } from "../../domain/repositories/carrier.repository.interface";
import { CarrierResponseDto } from "../dto/carrier-response.dto";

/**
 * Get Carrier Use Case
 * Application service that orchestrates the carrier retrieval process
 * Follows Clean Architecture principles
 */
@Injectable()
export class GetCarrierUseCase {
  private readonly logger = new WinstonLoggerService();

  constructor(
    @Inject("CarrierRepositoryInterface")
    private readonly carrierRepository: CarrierRepositoryInterface
  ) {
    this.logger.setContext(GetCarrierUseCase.name);
  }

  /**
   * Executes the get carrier by ID use case
   * @param id - Carrier ID
   * @returns Carrier response
   */
  async executeById(id: number): Promise<CarrierResponseDto> {
    try {
      this.logger.debug("Getting carrier by ID", { carrierId: id });

      const carrier = await this.carrierRepository.findById(id);
      if (!carrier) {
        this.logger.warn("Carrier not found", { carrierId: id });
        throw new NotFoundException("Carrier not found");
      }

      this.logger.debug("Carrier found", {
        carrierId: carrier.id,
        name: carrier.name,
      });

      return this.mapToResponseDto(carrier);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(
          `Failed to get carrier by ID: ${error.message}`,
          error.stack
        );
      }
      throw error;
    }
  }

  /**
   * Executes the get carrier by name use case
   * @param name - Carrier name
   * @returns Carrier response
   */
  async executeByName(name: string): Promise<CarrierResponseDto> {
    try {
      this.logger.debug("Getting carrier by name", { name });

      const carrier = await this.carrierRepository.findByName(name);
      if (!carrier) {
        this.logger.warn("Carrier not found with name", { name });
        throw new NotFoundException("Carrier not found");
      }

      this.logger.debug("Carrier found", {
        carrierId: carrier.id,
        name: carrier.name,
      });

      return this.mapToResponseDto(carrier);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(
          `Failed to get carrier by name: ${error.message}`,
          error.stack
        );
      }
      throw error;
    }
  }

  /**
   * Executes the get all carriers use case
   * @param page - Page number
   * @param limit - Items per page
   * @param search - Search term
   * @returns Carriers and pagination info
   */
  async executeAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    carriers: CarrierResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      this.logger.debug("Getting all carriers", { page, limit, search });

      const { carriers, total } = await this.carrierRepository.findPaginated(
        page,
        limit,
        search
      );
      const totalPages = Math.ceil(total / limit);

      this.logger.debug("Retrieved carriers", {
        total,
        returned: carriers.length,
        page,
        totalPages,
      });

      return {
        carriers: carriers.map((carrier) => this.mapToResponseDto(carrier)),
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get all carriers: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Executes the get active carriers use case
   * @returns Active carriers
   */
  async executeActive(): Promise<CarrierResponseDto[]> {
    try {
      this.logger.debug("Getting active carriers");

      const carriers = await this.carrierRepository.findActive();

      this.logger.debug("Retrieved active carriers", {
        count: carriers.length,
      });

      return carriers.map((carrier) => this.mapToResponseDto(carrier));
    } catch (error) {
      this.logger.error(
        `Failed to get active carriers: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Executes the get carrier count use case
   * @returns Carrier count
   */
  async executeCount(): Promise<{ count: number }> {
    try {
      this.logger.debug("Getting carrier count");

      const count = await this.carrierRepository.count();

      this.logger.debug("Retrieved carrier count", { count });

      return { count };
    } catch (error) {
      this.logger.error(
        `Failed to get carrier count: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Maps carrier entity to response DTO
   * @param carrier - Carrier entity
   * @returns Carrier response DTO
   */
  private mapToResponseDto(carrier: any): CarrierResponseDto {
    return {
      id: carrier.id,
      name: carrier.name,
      description: carrier.description,
      isActive: carrier.isActive,
      contactEmail: carrier.contactEmail,
      contactPhone: carrier.contactPhone,
      metadata: carrier.metadata,
      createdAt: carrier.createdAt,
      updatedAt: carrier.updatedAt,
    };
  }
}
