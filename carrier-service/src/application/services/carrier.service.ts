import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Carrier } from "../../domain/entities/carrier.entity";
import { CarrierRepositoryInterface } from "../../domain/repositories/carrier.repository.interface";
import { CarrierResponseDto } from "../dto/carrier-response.dto";
import { CreateCarrierDto } from "../dto/create-carrier.dto";
import { UpdateCarrierDto } from "../dto/update-carrier.dto";

@Injectable()
export class CarrierService {
  constructor(
    @Inject("CarrierRepositoryInterface")
    private readonly carrierRepository: CarrierRepositoryInterface
  ) {}

  async create(
    createCarrierDto: CreateCarrierDto
  ): Promise<CarrierResponseDto> {
    // Check if name already exists
    const existingCarrier = await this.carrierRepository.findByName(
      createCarrierDto.name
    );
    if (existingCarrier) {
      throw new ConflictException("Carrier name already exists");
    }

    const carrier = new Carrier();
    carrier.name = createCarrierDto.name;
    carrier.description = createCarrierDto.description;
    carrier.isActive = createCarrierDto.isActive ?? true;
    carrier.contactEmail = createCarrierDto.contactEmail;
    carrier.contactPhone = createCarrierDto.contactPhone;
    carrier.metadata = createCarrierDto.metadata;

    const savedCarrier = await this.carrierRepository.create(carrier);
    return plainToClass(CarrierResponseDto, savedCarrier, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ carriers: CarrierResponseDto[]; total: number }> {
    const { carriers, total } = await this.carrierRepository.findAll(
      page,
      limit,
      search
    );
    const carrierDtos = carriers.map((carrier) =>
      plainToClass(CarrierResponseDto, carrier, {
        excludeExtraneousValues: true,
      })
    );
    return { carriers: carrierDtos, total };
  }

  async findById(id: number): Promise<CarrierResponseDto> {
    const carrier = await this.carrierRepository.findById(id);
    if (!carrier) {
      throw new NotFoundException("Carrier not found");
    }
    return plainToClass(CarrierResponseDto, carrier, {
      excludeExtraneousValues: true,
    });
  }

  async findByName(name: string): Promise<CarrierResponseDto> {
    const carrier = await this.carrierRepository.findByName(name);
    if (!carrier) {
      throw new NotFoundException("Carrier not found");
    }
    return plainToClass(CarrierResponseDto, carrier, {
      excludeExtraneousValues: true,
    });
  }

  async findActive(): Promise<CarrierResponseDto[]> {
    const carriers = await this.carrierRepository.findActive();
    return carriers.map((carrier) =>
      plainToClass(CarrierResponseDto, carrier, {
        excludeExtraneousValues: true,
      })
    );
  }

  async update(
    id: number,
    updateCarrierDto: UpdateCarrierDto
  ): Promise<CarrierResponseDto> {
    const carrier = await this.carrierRepository.findById(id);
    if (!carrier) {
      throw new NotFoundException("Carrier not found");
    }

    // Check if name is being changed and if it already exists
    if (updateCarrierDto.name && updateCarrierDto.name !== carrier.name) {
      const existingCarrier = await this.carrierRepository.findByName(
        updateCarrierDto.name
      );
      if (existingCarrier) {
        throw new ConflictException("Carrier name already exists");
      }
    }

    // Prepare update data
    const updateData: Partial<Carrier> = {};

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

    const updatedCarrier = await this.carrierRepository.update(id, updateData);
    return plainToClass(CarrierResponseDto, updatedCarrier, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: number): Promise<void> {
    const carrier = await this.carrierRepository.findById(id);
    if (!carrier) {
      throw new NotFoundException("Carrier not found");
    }
    await this.carrierRepository.delete(id);
  }

  async getCount(): Promise<{ count: number }> {
    const count = await this.carrierRepository.count();
    return { count };
  }
}







