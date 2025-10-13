import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { PriceCalculation } from '../../domain/entities/price-calculation.entity';
import { PriceCalculationRepositoryInterface } from '../../domain/repositories/price-calculation.repository.interface';
import { PaginationDto } from '../../../../shared/dto';

/**
 * PriceCalculationTypeOrmRepository
 * 
 * This class provides the concrete TypeORM implementation for the PriceCalculationRepositoryInterface.
 * It handles all database operations for price calculation entities.
 */
@Injectable()
export class PriceCalculationTypeOrmRepository implements PriceCalculationRepositoryInterface {
  constructor(
    @InjectRepository(PriceCalculation)
    private readonly priceCalculationRepository: Repository<PriceCalculation>
  ) {}

  async create(priceCalculation: PriceCalculation): Promise<PriceCalculation> {
    return await this.priceCalculationRepository.save(priceCalculation);
  }

  async findById(id: number): Promise<PriceCalculation | null> {
    return await this.priceCalculationRepository.findOne({ where: { id } });
  }

  async findByRequestId(requestId: string): Promise<PriceCalculation | null> {
    return await this.priceCalculationRepository.findOne({ 
      where: { requestId } 
    });
  }

  async findAll(paginationDto: PaginationDto): Promise<{ priceCalculations: PriceCalculation[]; total: number }> {
    const [priceCalculations, total] = await this.priceCalculationRepository.findAndCount({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { calculatedAt: 'DESC' },
    });

    return { priceCalculations, total };
  }

  async findByCustomerId(customerId: number, paginationDto: PaginationDto): Promise<{ priceCalculations: PriceCalculation[]; total: number }> {
    const queryBuilder = this.priceCalculationRepository.createQueryBuilder('calc');
    
    queryBuilder.where('calc.inputData->>"$.customerId" = :customerId', { customerId });

    const [priceCalculations, total] = await queryBuilder
      .skip((paginationDto.page - 1) * paginationDto.limit)
      .take(paginationDto.limit)
      .orderBy('calc.calculatedAt', 'DESC')
      .getManyAndCount();

    return { priceCalculations, total };
  }

  async findByDateRange(startDate: Date, endDate: Date, paginationDto: PaginationDto): Promise<{ priceCalculations: PriceCalculation[]; total: number }> {
    const [priceCalculations, total] = await this.priceCalculationRepository.findAndCount({
      where: {
        calculatedAt: Between(startDate, endDate)
      },
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { calculatedAt: 'DESC' },
    });

    return { priceCalculations, total };
  }

  async search(searchTerm: string, paginationDto: PaginationDto): Promise<{ priceCalculations: PriceCalculation[]; total: number }> {
    const queryBuilder = this.priceCalculationRepository.createQueryBuilder('calc');
    
    queryBuilder.where(
      '(calc.requestId LIKE :searchTerm OR calc.inputData->>"$.customerId" LIKE :searchTerm OR calc.inputData->>"$.productId" LIKE :searchTerm)',
      { searchTerm: `%${searchTerm}%` }
    );

    const [priceCalculations, total] = await queryBuilder
      .skip((paginationDto.page - 1) * paginationDto.limit)
      .take(paginationDto.limit)
      .orderBy('calc.calculatedAt', 'DESC')
      .getManyAndCount();

    return { priceCalculations, total };
  }

  async update(id: number, priceCalculation: Partial<PriceCalculation>): Promise<PriceCalculation> {
    await this.priceCalculationRepository.update(id, priceCalculation);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.priceCalculationRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.priceCalculationRepository.count();
  }

  async countByCustomerId(customerId: number): Promise<number> {
    return await this.priceCalculationRepository
      .createQueryBuilder('calc')
      .where('calc.inputData->>"$.customerId" = :customerId', { customerId })
      .getCount();
  }

  async countCached(): Promise<number> {
    return await this.priceCalculationRepository.count({
      where: { isCached: true }
    });
  }

  async findByPriceRange(minPrice: number, maxPrice: number, paginationDto: PaginationDto): Promise<{ priceCalculations: PriceCalculation[]; total: number }> {
    const [priceCalculations, total] = await this.priceCalculationRepository.findAndCount({
      where: {
        basePrice: Between(minPrice, maxPrice)
      },
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { calculatedAt: 'DESC' },
    });

    return { priceCalculations, total };
  }

  async getStatistics(startDate: Date, endDate: Date): Promise<{
    totalCalculations: number;
    averageBasePrice: number;
    averageFinalPrice: number;
    averageDiscount: number;
    averageMarkup: number;
    averageCalculationTime: number;
    cacheHitRate: number;
  }> {
    const queryBuilder = this.priceCalculationRepository.createQueryBuilder('calc');
    
    queryBuilder
      .where('calc.calculatedAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .select([
        'COUNT(*) as totalCalculations',
        'AVG(calc.basePrice) as averageBasePrice',
        'AVG(calc.finalPrice) as averageFinalPrice',
        'AVG(calc.totalDiscount) as averageDiscount',
        'AVG(calc.totalMarkup) as averageMarkup',
        'AVG(calc.calculationTimeMs) as averageCalculationTime',
        'SUM(CASE WHEN calc.isCached = true THEN 1 ELSE 0 END) / COUNT(*) * 100 as cacheHitRate'
      ]);

    const result = await queryBuilder.getRawOne();

    return {
      totalCalculations: parseInt(result.totalCalculations) || 0,
      averageBasePrice: parseFloat(result.averageBasePrice) || 0,
      averageFinalPrice: parseFloat(result.averageFinalPrice) || 0,
      averageDiscount: parseFloat(result.averageDiscount) || 0,
      averageMarkup: parseFloat(result.averageMarkup) || 0,
      averageCalculationTime: parseFloat(result.averageCalculationTime) || 0,
      cacheHitRate: parseFloat(result.cacheHitRate) || 0,
    };
  }

  async deleteOldRecords(olderThan: Date): Promise<number> {
    const result = await this.priceCalculationRepository
      .createQueryBuilder()
      .delete()
      .where('calculatedAt < :olderThan', { olderThan })
      .execute();

    return result.affected || 0;
  }
}
