import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { CarrierRepositoryInterface } from '../../domain/repositories/carrier.repository.interface';
import { CarrierDomainService } from '../../domain/services/carrier.domain.service';
import { CreateCarrierDto } from '../dtos/create-carrier.dto';
import { CarrierResponseDto } from '../dtos/carrier-response.dto';

/**
 * Create Carrier Use Case
 * Application service that orchestrates the carrier creation process
 * Follows Clean Architecture principles
 */
@Injectable()
export class CreateCarrierUseCase {
  constructor(
    private readonly carrierRepository: CarrierRepositoryInterface,
    private readonly carrierDomainService: CarrierDomainService,
  ) {}

  /**
   * Executes the create carrier use case
   * @param createCarrierDto - Carrier creation data
   * @returns Created carrier response
   */
  async execute(createCarrierDto: CreateCarrierDto): Promise<CarrierResponseDto> {
    // 1. Validate input using domain service
    const validation = this.carrierDomainService.validateCarrierCreationData(createCarrierDto);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    // 2. Check if carrier name already exists
    const existingCarrier = await this.carrierRepository.findByName(createCarrierDto.name);
    if (existingCarrier) {
      throw new ConflictException('Carrier name already exists');
    }

    // 3. Validate metadata if provided
    if (createCarrierDto.metadata) {
      const metadataValidation = this.carrierDomainService.validateMetadata(createCarrierDto.metadata);
      if (!metadataValidation.isValid) {
        throw new BadRequestException(metadataValidation.errors.join(', '));
      }
    }

    // 4. Create carrier entity
    const carrier = {
      name: createCarrierDto.name,
      description: createCarrierDto.description,
      isActive: createCarrierDto.isActive ?? true,
      contactEmail: createCarrierDto.contactEmail,
      contactPhone: createCarrierDto.contactPhone,
      metadata: createCarrierDto.metadata,
    };

    // 5. Save carrier in repository
    const savedCarrier = await this.carrierRepository.create(carrier);

    // 6. Return response
    return this.mapToResponseDto(savedCarrier);
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
