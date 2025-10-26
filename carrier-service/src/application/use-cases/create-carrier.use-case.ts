import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";
import { Carrier } from "../../domain/entities/carrier.entity";
import { CarrierCreatedEvent } from "../../domain/events/carrier-created.event";
import { IEventBus } from "../../domain/events/event-bus.interface";
import { CarrierRepositoryInterface } from "../../domain/repositories/carrier.repository.interface";
import { CarrierDomainService } from "../../domain/services/carrier.domain.service";
import { CarrierResponseDto } from "../dto/carrier-response.dto";
import { CreateCarrierDto } from "../dto/create-carrier.dto";

/**
 * Create Carrier Use Case
 * Application service that orchestrates the carrier creation process
 * Follows Clean Architecture principles
 */
@Injectable()
export class CreateCarrierUseCase {
  private readonly logger = new WinstonLoggerService();

  constructor(
    @Inject("CarrierRepositoryInterface")
    private readonly carrierRepository: CarrierRepositoryInterface,
    private readonly carrierDomainService: CarrierDomainService,
    @Inject("IEventBus")
    private readonly eventBus: IEventBus
  ) {
    this.logger.setContext(CreateCarrierUseCase.name);
  }

  /**
   * Executes the create carrier use case
   * @param createCarrierDto - Carrier creation data
   * @returns Created carrier response
   */
  async execute(
    createCarrierDto: CreateCarrierDto
  ): Promise<CarrierResponseDto> {
    try {
      this.logger.log("Creating new carrier", {
        name: createCarrierDto.name,
        hasContactEmail: !!createCarrierDto.contactEmail,
        hasContactPhone: !!createCarrierDto.contactPhone,
        hasMetadata: !!createCarrierDto.metadata,
      });

      // 1. Validate input using domain service
      const validation =
        this.carrierDomainService.validateCarrierCreationData(createCarrierDto);
      if (!validation.isValid) {
        this.logger.warn("Carrier validation failed", {
          errors: validation.errors,
        });
        throw new BadRequestException(validation.errors.join(", "));
      }

      // 2. Check if carrier name already exists
      const existingCarrier = await this.carrierRepository.findByName(
        createCarrierDto.name
      );
      if (existingCarrier) {
        this.logger.warn("Carrier name already exists", {
          name: createCarrierDto.name,
          existingCarrierId: existingCarrier.id,
        });
        throw new ConflictException("Carrier name already exists");
      }

      // 3. Validate metadata if provided
      if (createCarrierDto.metadata) {
        const metadataValidation = this.carrierDomainService.validateMetadata(
          createCarrierDto.metadata
        );
        if (!metadataValidation.isValid) {
          this.logger.warn("Carrier metadata validation failed", {
            errors: metadataValidation.errors,
          });
          throw new BadRequestException(metadataValidation.errors.join(", "));
        }
      }

      // 4. Create carrier entity
      const carrier = new Carrier({
        name: createCarrierDto.name,
        description: createCarrierDto.description,
        isActive: createCarrierDto.isActive ?? true,
        contactEmail: createCarrierDto.contactEmail,
        contactPhone: createCarrierDto.contactPhone,
        metadata: createCarrierDto.metadata,
      });

      // 5. Save carrier in repository
      const savedCarrier = await this.carrierRepository.create(carrier);

      this.logger.log("Carrier created successfully", {
        carrierId: savedCarrier.id,
        name: savedCarrier.name,
      });

      // 6. Publish CarrierCreatedEvent
      await this.eventBus.publish(new CarrierCreatedEvent(savedCarrier));
      this.logger.debug("CarrierCreatedEvent published", {
        carrierId: savedCarrier.id,
      });

      // 7. Return response
      return this.mapToResponseDto(savedCarrier);
    } catch (error) {
      this.logger.error(
        `Failed to create carrier: ${error.message}`,
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
