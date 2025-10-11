import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PriceCalculation } from "../../domain/entities/price-calculation.entity";
import { PriceCalculationRepositoryInterface } from "../../domain/repositories/price-calculation.repository.interface";

@Injectable()
export class PriceCalculationRepository
  implements PriceCalculationRepositoryInterface
{
  constructor(
    @InjectRepository(PriceCalculation)
    private readonly priceCalculationRepository: Repository<PriceCalculation>
  ) {}

  async create(priceCalculation: PriceCalculation): Promise<PriceCalculation> {
    return await this.priceCalculationRepository.save(priceCalculation);
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ priceCalculations: PriceCalculation[]; total: number }> {
    const queryBuilder =
      this.priceCalculationRepository.createQueryBuilder("calc");

    if (search) {
      queryBuilder.where(
        "calc.requestId LIKE :search OR calc.request->>'$.serviceType' LIKE :search",
        { search: `%${search}%` }
      );
    }

    const [priceCalculations, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("calc.calculatedAt", "DESC")
      .getManyAndCount();

    return { priceCalculations, total };
  }

  async findById(id: number): Promise<PriceCalculation | null> {
    return await this.priceCalculationRepository.findOne({ where: { id } });
  }

  async findByRequestId(requestId: string): Promise<PriceCalculation | null> {
    return await this.priceCalculationRepository.findOne({
      where: { requestId },
    });
  }

  async findByCustomerId(customerId: number): Promise<PriceCalculation[]> {
    return await this.priceCalculationRepository
      .createQueryBuilder("calc")
      .where("calc.request->>'$.customerId' = :customerId", { customerId })
      .orderBy("calc.calculatedAt", "DESC")
      .getMany();
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<PriceCalculation[]> {
    return await this.priceCalculationRepository
      .createQueryBuilder("calc")
      .where("calc.calculatedAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .orderBy("calc.calculatedAt", "DESC")
      .getMany();
  }

  async update(
    id: number,
    priceCalculation: Partial<PriceCalculation>
  ): Promise<PriceCalculation> {
    await this.priceCalculationRepository.update(id, priceCalculation);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.priceCalculationRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.priceCalculationRepository.count();
  }
}

