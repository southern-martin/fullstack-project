import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CarrierRepositoryInterface } from '../../domain/repositories/carrier.repository.interface';
import { CarrierDomainService } from '../../domain/services/carrier.domain.service';
import { CarrierUpdatedEvent } from '../../domain/events/carrier-updated.event';
import { UpdateCarrierDto } from '../dto/update-carrier.dto';
import { CarrierResponseDto } from '../dto/carrier-response.dto';
import { EventBusService } from '../../../../shared/services/event-bus.service';

/**
 * UpdateCarrierUseCase
 * 
 * This use case handles updating existing carriers.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
@Injectable()
export class UpdateCarrierUseCase {
  constructor(
    private readonly carrierRepository: CarrierRepositoryInterface,
    private readonly carrierDomainService: CarrierDomainService,
    private readonly eventBusService: EventBusService,
  ) {}

  /**
   * Executes the update carrier use case.
   * @param id The ID of the carrier to update.
   * @param updateCarrierDto The data for updating the carrier.
   * @returns Updated carrier response.
   */
  async execute(id: number, updateCarrierDto: UpdateCarrierDto): Promise<CarrierResponseDto> {
    // 1. Find existing carrier
    const existingCarrier = await this.carrierRepository.findById(id);
    if (!existingCarrier) {
      throw new NotFoundException('Carrier not found');
    }

    // 2. Validate update data using domain service
    const validation = this.carrierDomainService.validateCarrierUpdateData(updateCarrierDto);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    // 3. If code is being changed, check for conflict
    if (updateCarrierDto.metadata?.code && 
        updateCarrierDto.metadata.code !== existingCarrier.metadata?.code) {
      const carrierWithSameCode = await this.carrierRepository.findByCode(updateCarrierDto.metadata.code);
      if (carrierWithSameCode) {
        throw new ConflictException('Carrier code already exists');
      }
    }

    // 4. Normalize update data
    const normalizedData = this.carrierDomainService.normalizeCarrierData(updateCarrierDto);

    // 5. Update carrier in repository
    const updatedCarrier = await this.carrierRepository.update(id, normalizedData);

    // 6. Publish domain event
    const carrierUpdatedEvent = new CarrierUpdatedEvent(
      updatedCarrier.id,
      updatedCarrier.name,
      updatedCarrier.metadata?.code,
      new Date(),
    );
    await this.eventBusService.publish(carrierUpdatedEvent);

    // 7. Return response
    return CarrierResponseDto.fromDomain(updatedCarrier);
  }
}
