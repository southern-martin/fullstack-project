import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CarrierActivatedEvent,
  CarrierDeactivatedEvent,
  CarrierUpdatedEvent,
} from "../../domain/events";
import { IEventBus } from "../../domain/events/event-bus.interface";
import { CarrierRepositoryInterface } from "../../domain/repositories/carrier.repository.interface";
import { CarrierDomainService } from "../../domain/services/carrier.domain.service";
import { CarrierResponseDto } from "../dto/carrier-response.dto";
import { UpdateCarrierDto } from "../dto/update-carrier.dto";

/**
 * Update Carrier Use Case
 * Application service that orchestrates the carrier update process
 * Follows Clean Architecture principles
 */
@Injectable()
export class UpdateCarrierUseCase {
  constructor(
    @Inject("CarrierRepositoryInterface")
    private readonly carrierRepository: CarrierRepositoryInterface,
    private readonly carrierDomainService: CarrierDomainService,
    @Inject("IEventBus")
    private readonly eventBus: IEventBus
  ) {}

  /**
   * Executes the update carrier use case
   * @param id - Carrier ID
   * @param updateCarrierDto - Update data
   * @returns Updated carrier response
   */
  async execute(
    id: number,
    updateCarrierDto: UpdateCarrierDto
  ): Promise<CarrierResponseDto> {
    // 1. Find existing carrier
    const existingCarrier = await this.carrierRepository.findById(id);
    if (!existingCarrier) {
      throw new NotFoundException("Carrier not found");
    }

    // 2. Validate update data using domain service
    const validation =
      this.carrierDomainService.validateCarrierUpdateData(updateCarrierDto);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 3. Check if name is being changed and if it already exists
    if (
      updateCarrierDto.name &&
      updateCarrierDto.name !== existingCarrier.name
    ) {
      const carrierWithSameName = await this.carrierRepository.findByName(
        updateCarrierDto.name
      );
      if (carrierWithSameName) {
        throw new ConflictException("Carrier name already exists");
      }
    }

    // 4. Validate metadata if provided
    if (updateCarrierDto.metadata !== undefined) {
      const metadataValidation = this.carrierDomainService.validateMetadata(
        updateCarrierDto.metadata
      );
      if (!metadataValidation.isValid) {
        throw new BadRequestException(metadataValidation.errors.join(", "));
      }
    }

    // 5. Prepare update data and track status change
    const updateData: Partial<any> = {};
    const previousData = { ...existingCarrier };
    const isStatusChanging =
      updateCarrierDto.isActive !== undefined &&
      updateCarrierDto.isActive !== existingCarrier.isActive;

    if (updateCarrierDto.name !== undefined)
      updateData.name = updateCarrierDto.name;
    if (updateCarrierDto.description !== undefined)
      updateData.description = updateCarrierDto.description;
    if (updateCarrierDto.isActive !== undefined)
      updateData.isActive = updateCarrierDto.isActive;
    if (updateCarrierDto.contactEmail !== undefined)
      updateData.contactEmail = updateCarrierDto.contactEmail;
    if (updateCarrierDto.contactPhone !== undefined)
      updateData.contactPhone = updateCarrierDto.contactPhone;
    if (updateCarrierDto.metadata !== undefined)
      updateData.metadata = updateCarrierDto.metadata;

    // 6. Update carrier in repository
    const updatedCarrier = await this.carrierRepository.update(id, updateData);

    // 7. Publish CarrierUpdatedEvent
    await this.eventBus.publish(
      new CarrierUpdatedEvent(updatedCarrier, previousData)
    );

    // 8. Publish activation/deactivation events if status changed
    if (isStatusChanging) {
      if (updateCarrierDto.isActive) {
        await this.eventBus.publish(new CarrierActivatedEvent(updatedCarrier));
      } else {
        await this.eventBus.publish(
          new CarrierDeactivatedEvent(updatedCarrier)
        );
      }
    }

    // 9. Return response
    return this.mapToResponseDto(updatedCarrier);
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
