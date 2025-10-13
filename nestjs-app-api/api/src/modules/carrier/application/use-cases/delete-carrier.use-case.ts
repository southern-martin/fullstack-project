import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CarrierRepositoryInterface } from '../../domain/repositories/carrier.repository.interface';
import { CarrierDomainService } from '../../domain/services/carrier.domain.service';
import { CarrierDeletedEvent } from '../../domain/events/carrier-deleted.event';
import { EventBusService } from '../../../../shared/services/event-bus.service';

/**
 * DeleteCarrierUseCase
 * 
 * This use case handles deleting carriers.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
@Injectable()
export class DeleteCarrierUseCase {
  constructor(
    private readonly carrierRepository: CarrierRepositoryInterface,
    private readonly carrierDomainService: CarrierDomainService,
    private readonly eventBusService: EventBusService,
  ) {}

  /**
   * Executes the delete carrier use case.
   * @param id The ID of the carrier to delete.
   * @throws NotFoundException if the carrier is not found.
   * @throws BadRequestException if the carrier cannot be deleted due to business rules.
   */
  async execute(id: number): Promise<void> {
    // 1. Find existing carrier
    const existingCarrier = await this.carrierRepository.findById(id);
    if (!existingCarrier) {
      throw new NotFoundException('Carrier not found');
    }

    // 2. Check for active shipments (placeholder - would need actual shipment service)
    const hasActiveShipments = false; // TODO: Implement actual check with shipment service

    // 3. Apply business rules for deletion
    if (!this.carrierDomainService.canDeleteCarrier(existingCarrier, hasActiveShipments)) {
      throw new BadRequestException(
        'Cannot delete carrier with active shipments or default status'
      );
    }

    // 4. Delete carrier from repository
    await this.carrierRepository.delete(id);

    // 5. Publish domain event
    const carrierDeletedEvent = new CarrierDeletedEvent(
      existingCarrier.id,
      existingCarrier.name,
      existingCarrier.metadata?.code,
      new Date(),
    );
    await this.eventBusService.publish(carrierDeletedEvent);
  }
}
