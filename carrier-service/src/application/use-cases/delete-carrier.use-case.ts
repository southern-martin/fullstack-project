import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";
import { CarrierDeletedEvent } from "../../domain/events/carrier-deleted.event";
import { IEventBus } from "../../domain/events/event-bus.interface";
import { CarrierRepositoryInterface } from "../../domain/repositories/carrier.repository.interface";
import { CarrierDomainService } from "../../domain/services/carrier.domain.service";

/**
 * Delete Carrier Use Case
 * Application service that orchestrates the carrier deletion process
 * Follows Clean Architecture principles
 */
@Injectable()
export class DeleteCarrierUseCase {
  private readonly logger = new WinstonLoggerService();

  constructor(
    @Inject("CarrierRepositoryInterface")
    private readonly carrierRepository: CarrierRepositoryInterface,
    private readonly carrierDomainService: CarrierDomainService,
    @Inject("IEventBus")
    private readonly eventBus: IEventBus
  ) {
    this.logger.setContext(DeleteCarrierUseCase.name);
  }

  /**
   * Executes the delete carrier use case
   * @param id - Carrier ID
   */
  async execute(id: number): Promise<void> {
    try {
      this.logger.log("Deleting carrier", { carrierId: id });

      // 1. Find existing carrier
      const existingCarrier = await this.carrierRepository.findById(id);
      if (!existingCarrier) {
        this.logger.warn("Carrier not found", { carrierId: id });
        throw new NotFoundException("Carrier not found");
      }

      // 2. Check if carrier can be deleted (business rule)
      // Note: In a real application, you would check for related shipments
      // For now, we'll assume we can delete if no active shipments
      const hasAnyShipments = false; // This would come from a shipment service

      if (
        !this.carrierDomainService.canDeleteCarrier(
          existingCarrier,
          hasAnyShipments
        )
      ) {
        this.logger.warn("Cannot delete carrier with existing shipments", {
          carrierId: id,
        });
        throw new BadRequestException(
          "Cannot delete carrier with existing shipments"
        );
      }

      // 3. Delete carrier from repository
      await this.carrierRepository.delete(id);

      this.logger.log("Carrier deleted successfully", {
        carrierId: id,
        name: existingCarrier.name,
      });

      // 4. Publish CarrierDeletedEvent
      await this.eventBus.publish(new CarrierDeletedEvent(existingCarrier));
      this.logger.debug("CarrierDeletedEvent published", { carrierId: id });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(
          `Failed to delete carrier ${id}: ${error.message}`,
          error.stack
        );
      }
      throw error;
    }
  }
}
