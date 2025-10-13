import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrier } from '../../domain/entities/carrier.entity';
import { CarrierRepositoryInterface } from '../../domain/repositories/carrier.repository.interface';

@Injectable()
export class CarrierTypeOrmRepository implements CarrierRepositoryInterface {
  constructor(
    @InjectRepository(Carrier)
    private readonly carrierRepository: Repository<Carrier>,
  ) {}

  async findAll(): Promise<Carrier[]> {
    return this.carrierRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findById(id: number): Promise<Carrier | null> {
    return this.carrierRepository.findOne({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Carrier | null> {
    return this.carrierRepository.findOne({
      where: { metadata: { code } } as any,
    });
  }

  async create(carrier: Partial<Carrier>): Promise<Carrier> {
    const newCarrier = this.carrierRepository.create(carrier);
    return this.carrierRepository.save(newCarrier);
  }

  async update(id: number, carrier: Partial<Carrier>): Promise<Carrier> {
    await this.carrierRepository.update(id, carrier);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.carrierRepository.delete(id);
  }

  async findActive(): Promise<Carrier[]> {
    return this.carrierRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async count(): Promise<number> {
    return this.carrierRepository.count();
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ carriers: Carrier[]; total: number }> {
    const queryBuilder = this.carrierRepository.createQueryBuilder('carrier');

    if (search) {
      queryBuilder.where(
        'carrier.name ILIKE :search OR carrier.description ILIKE :search OR carrier.contactEmail ILIKE :search',
        { search: `%${search}%` }
      );
    }

    const [carriers, total] = await queryBuilder
      .orderBy('carrier.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { carriers, total };
  }
}
