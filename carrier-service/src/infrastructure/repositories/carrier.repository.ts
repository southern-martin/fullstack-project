import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Carrier } from "../../domain/entities/carrier.entity";
import { CarrierRepositoryInterface } from "../../domain/repositories/carrier.repository.interface";

@Injectable()
export class CarrierRepository implements CarrierRepositoryInterface {
  constructor(
    @InjectRepository(Carrier)
    private readonly carrierRepository: Repository<Carrier>
  ) {}

  async create(carrier: Carrier): Promise<Carrier> {
    return await this.carrierRepository.save(carrier);
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ carriers: Carrier[]; total: number }> {
    const queryBuilder = this.carrierRepository.createQueryBuilder("carrier");

    if (search) {
      queryBuilder.where(
        "carrier.name LIKE :search OR carrier.description LIKE :search OR carrier.contactEmail LIKE :search",
        { search: `%${search}%` }
      );
    }

    const [carriers, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("carrier.createdAt", "DESC")
      .getManyAndCount();

    return { carriers, total };
  }

  async findById(id: number): Promise<Carrier | null> {
    return await this.carrierRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Carrier | null> {
    return await this.carrierRepository.findOne({ where: { name } });
  }

  async findActive(): Promise<Carrier[]> {
    return await this.carrierRepository.find({ where: { isActive: true } });
  }

  async update(id: number, carrier: Partial<Carrier>): Promise<Carrier> {
    await this.carrierRepository.update(id, carrier);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.carrierRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.carrierRepository.count();
  }
}







