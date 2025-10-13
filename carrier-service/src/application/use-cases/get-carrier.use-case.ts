import { Injectable, NotFoundException } from '@nestjs/common';
import { CarrierRepositoryInterface } from '../../domain/repositories/carrier.repository.interface';
import { CarrierResponseDto } from '../dto/carrier-response.dto';

/**
 * Get Carrier Use Case
 * Application service that orchestrates the carrier retrieval process
 * Follows Clean Architecture principles
 */
@Injectable()
export class GetCarrierUseCase {
  constructor(
    private readonly carrierRepository: CarrierRepositoryInterface,
  ) {}

  /**
   * Executes the get carrier by ID use case
   * @param id - Carrier ID
   * @returns Carrier response
   */
  async executeById(id: number): Promise<CarrierResponseDto> {
    const carrier = await this.carrierRepository.findById(id);
    if (!carrier) {
      throw new NotFoundException('Carrier not found');
    }

    return this.mapToResponseDto(carrier);
  }

  /**
   * Executes the get carrier by name use case
   * @param name - Carrier name
   * @returns Carrier response
   */
  async executeByName(name: string): Promise<CarrierResponseDto> {
    const carrier = await this.carrierRepository.findByName(name);
    if (!carrier) {
      throw new NotFoundException('Carrier not found');
    }

    return this.mapToResponseDto(carrier);
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
  ): Promise<{ carriers: CarrierResponseDto[]; total: number }> {
    const { carriers, total } = await this.carrierRepository.findAll(page, limit, search);
    
    return {
      carriers: carriers.map(carrier => this.mapToResponseDto(carrier)),
      total,
    };
  }

  /**
   * Executes the get active carriers use case
   * @returns Active carriers
   */
  async executeActive(): Promise<CarrierResponseDto[]> {
    const carriers = await this.carrierRepository.findActive();
    return carriers.map(carrier => this.mapToResponseDto(carrier));
  }

  /**
   * Executes the get carrier count use case
   * @returns Carrier count
   */
  async executeCount(): Promise<{ count: number }> {
    const count = await this.carrierRepository.count();
    return { count };
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
