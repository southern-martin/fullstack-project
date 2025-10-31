import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SellerTypeOrmEntity, SellerStatus, VerificationStatus } from '../entities/seller.entity';

export interface ISellerRepository {
  create(sellerData: Partial<SellerTypeOrmEntity>): Promise<SellerTypeOrmEntity>;
  findById(id: number): Promise<SellerTypeOrmEntity | null>;
  findByUserId(userId: number): Promise<SellerTypeOrmEntity | null>;
  findAll(filters?: SellerFilters): Promise<SellerTypeOrmEntity[]>;
  update(id: number, data: Partial<SellerTypeOrmEntity>): Promise<SellerTypeOrmEntity>;
  delete(id: number): Promise<boolean>;
  findByStatus(status: SellerStatus): Promise<SellerTypeOrmEntity[]>;
  findPendingVerification(): Promise<SellerTypeOrmEntity[]>;
  count(filters?: SellerFilters): Promise<number>;
}

export interface SellerFilters {
  status?: SellerStatus;
  verificationStatus?: VerificationStatus;
  minRating?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class SellerRepository implements ISellerRepository {
  constructor(private readonly repository: Repository<SellerTypeOrmEntity>) {}

  async create(sellerData: Partial<SellerTypeOrmEntity>): Promise<SellerTypeOrmEntity> {
    const seller = this.repository.create(sellerData);
    return await this.repository.save(seller);
  }

  async findById(id: number): Promise<SellerTypeOrmEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: number): Promise<SellerTypeOrmEntity | null> {
    return await this.repository.findOne({ where: { userId } });
  }

  async findAll(filters?: SellerFilters): Promise<SellerTypeOrmEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('seller');

    if (filters) {
      if (filters.status) {
        queryBuilder.andWhere('seller.status = :status', { status: filters.status });
      }

      if (filters.verificationStatus) {
        queryBuilder.andWhere('seller.verificationStatus = :verificationStatus', {
          verificationStatus: filters.verificationStatus,
        });
      }

      if (filters.minRating) {
        queryBuilder.andWhere('seller.rating >= :minRating', { minRating: filters.minRating });
      }

      if (filters.search) {
        queryBuilder.andWhere(
          '(seller.businessName LIKE :search OR seller.businessEmail LIKE :search)',
          { search: `%${filters.search}%` },
        );
      }

      if (filters.limit) {
        queryBuilder.take(filters.limit);
      }

      if (filters.offset) {
        queryBuilder.skip(filters.offset);
      }
    }

    queryBuilder.orderBy('seller.createdAt', 'DESC');
    return await queryBuilder.getMany();
  }

  async update(id: number, data: Partial<SellerTypeOrmEntity>): Promise<SellerTypeOrmEntity> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Seller with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async findByStatus(status: SellerStatus): Promise<SellerTypeOrmEntity[]> {
    return await this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingVerification(): Promise<SellerTypeOrmEntity[]> {
    return await this.repository.find({
      where: { verificationStatus: VerificationStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  async count(filters?: SellerFilters): Promise<number> {
    const queryBuilder = this.repository.createQueryBuilder('seller');

    if (filters) {
      if (filters.status) {
        queryBuilder.andWhere('seller.status = :status', { status: filters.status });
      }

      if (filters.verificationStatus) {
        queryBuilder.andWhere('seller.verificationStatus = :verificationStatus', {
          verificationStatus: filters.verificationStatus,
        });
      }

      if (filters.minRating) {
        queryBuilder.andWhere('seller.rating >= :minRating', { minRating: filters.minRating });
      }

      if (filters.search) {
        queryBuilder.andWhere(
          '(seller.businessName LIKE :search OR seller.businessEmail LIKE :search)',
          { search: `%${filters.search}%` },
        );
      }
    }

    return await queryBuilder.getCount();
  }
}
