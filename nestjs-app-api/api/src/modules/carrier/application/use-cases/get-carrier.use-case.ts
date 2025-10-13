import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CarrierRepositoryInterface } from '../../domain/repositories/carrier.repository.interface';
import { CarrierResponseDto } from '../dto/carrier-response.dto';

/**
 * GetCarrierUseCase
 * 
 * This use case handles retrieving carrier information.
 * It orchestrates the domain logic and persistence (repository).
 */
@Injectable()
export class GetCarrierUseCase {
  constructor(
    private readonly carrierRepository: CarrierRepositoryInterface,
  ) {}

  /**
   * Retrieves a carrier by its ID.
   * @param id The ID of the carrier.
   * @returns The carrier response DTO.
   * @throws NotFoundException if the carrier is not found.
   */
  async getById(id: number): Promise<CarrierResponseDto> {
    const carrier = await this.carrierRepository.findById(id);
    if (!carrier) {
      throw new NotFoundException('Carrier not found');
    }
    return CarrierResponseDto.fromDomain(carrier);
  }

  /**
   * Retrieves a carrier by its code.
   * @param code The code of the carrier.
   * @returns The carrier response DTO.
   * @throws NotFoundException if the carrier is not found.
   */
  async getByCode(code: string): Promise<CarrierResponseDto> {
    const carrier = await this.carrierRepository.findByCode(code);
    if (!carrier) {
      throw new NotFoundException('Carrier not found');
    }
    return CarrierResponseDto.fromDomain(carrier);
  }

  /**
   * Retrieves all carriers.
   * @returns A list of carrier response DTOs.
   */
  async getAll(): Promise<CarrierResponseDto[]> {
    const carriers = await this.carrierRepository.findAll();
    return carriers.map(carrier => CarrierResponseDto.fromDomain(carrier));
  }

  /**
   * Retrieves all active carriers.
   * @returns A list of active carrier response DTOs.
   */
  async getActive(): Promise<CarrierResponseDto[]> {
    const carriers = await this.carrierRepository.findActive();
    return carriers.map(carrier => CarrierResponseDto.fromDomain(carrier));
  }

  /**
   * Retrieves carriers with pagination and search.
   * @param page Page number (1-based).
   * @param limit Number of items per page.
   * @param search Optional search term.
   * @returns Paginated carriers response.
   */
  async getPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ carriers: CarrierResponseDto[]; total: number; page: number; limit: number }> {
    const result = await this.carrierRepository.findPaginated(page, limit, search);
    
    return {
      carriers: result.carriers.map(carrier => CarrierResponseDto.fromDomain(carrier)),
      total: result.total,
      page,
      limit,
    };
  }

  /**
   * Retrieves the total count of carriers.
   * @returns An object containing the total count.
   */
  async getCount(): Promise<{ count: number }> {
    const count = await this.carrierRepository.count();
    return { count };
  }
}
