import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { EventBusService } from "../../../../shared/services/event-bus.service";
import { Carrier } from "../../domain/entities/carrier.entity";
import { CarrierCreatedEvent } from "../../domain/events/carrier-created.event";
import { CarrierRepositoryInterface } from "../../domain/repositories/carrier.repository.interface";
import { CarrierDomainService } from "../../domain/services/carrier.domain.service";
import { CarrierResponseDto } from "../dto/carrier-response.dto";
import { CreateCarrierDto } from "../dto/create-carrier.dto";

/**
 * CreateCarrierUseCase
 *
 * This use case handles the creation of new carriers.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
@Injectable()
export class CreateCarrierUseCase {
  constructor(
    private readonly carrierRepository: CarrierRepositoryInterface,
    private readonly carrierDomainService: CarrierDomainService,
    private readonly eventBusService: EventBusService
  ) {}

  /**
   * Executes the create carrier use case.
   * @param createCarrierDto The data for creating the carrier.
   * @returns Created carrier response.
   */
  async execute(
    createCarrierDto: CreateCarrierDto
  ): Promise<CarrierResponseDto> {
    // 1. Validate input using domain service
    const validation =
      this.carrierDomainService.validateCarrierCreationData(createCarrierDto);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 2. Check if carrier with same code already exists (if code is provided)
    if (createCarrierDto.metadata?.code) {
      const existingCarrier = await this.carrierRepository.findByCode(
        createCarrierDto.metadata.code
      );
      if (existingCarrier) {
        throw new ConflictException(
          `Carrier with code ${createCarrierDto.metadata.code} already exists`
        );
      }
    }

    // 3. Normalize carrier data
    const normalizedData =
      this.carrierDomainService.normalizeCarrierData(createCarrierDto);

    // 4. Create carrier entity
    const carrier = new Carrier();
    carrier.name = normalizedData.name!;
    carrier.description = normalizedData.description;
    carrier.contactEmail = normalizedData.contactEmail;
    carrier.contactPhone = normalizedData.contactPhone;
    carrier.isActive = normalizedData.isActive ?? true;
    carrier.metadata = normalizedData.metadata || {};

    // 5. Save carrier in repository
    const savedCarrier = await this.carrierRepository.create(carrier);

    // 6. Publish domain event
    const carrierCreatedEvent = new CarrierCreatedEvent(
      savedCarrier.id,
      savedCarrier.name,
      savedCarrier.metadata?.code,
      new Date()
    );
    await this.eventBusService.publish(carrierCreatedEvent);

    // 7. Return response
    return CarrierResponseDto.fromDomain(savedCarrier);
  }
}
