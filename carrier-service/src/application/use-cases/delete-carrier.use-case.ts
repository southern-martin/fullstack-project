import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CarrierRepositoryInterface } from '../../domain/repositories/carrier.repository.interface';
import { CarrierDomainService } from '../../domain/services/carrier.domain.service';

/**
 * Delete Carrier Use Case
 * Application service that orchestrates the carrier deletion process
 * Follows Clean Architecture principles
 */
@Injectable()
export class DeleteCarrierUseCase {
  constructor(
    private readonly carrierRepository: CarrierRepositoryInterface,
    private readonly carrierDomainService: CarrierDomainService,
  ) {}

  /**
   * Executes the delete carrier use case
   * @param id - Carrier ID
   */
  async execute(id: number): Promise<void> {
    // 1. Find existing carrier
    const existingCarrier = await this.carrierRepository.findById(id);
    if (!existingCarrier) {
      throw new NotFoundException('Carrier not found');
    }

    // 2. Check if carrier can be deleted (business rule)
    // Note: In a real application, you would check for related shipments
    // For now, we'll assume we can delete if no active shipments
    const hasAnyShipments = false; // This would come from a shipment service
    
    if (!this.carrierDomainService.canDeleteCarrier(existingCarrier, hasAnyShipments)) {
      throw new BadRequestException('Cannot delete carrier with existing shipments');
    }

    // 3. Delete carrier from repository
    await this.carrierRepository.delete(id);
  }
}
