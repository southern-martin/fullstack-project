import { PaginationDto } from "@shared/infrastructure";
import { Carrier } from "../entities/carrier.entity";

export interface CarrierRepositoryInterface {
  create(carrier: Carrier): Promise<Carrier>;
  findById(id: number): Promise<Carrier | null>;
  findByName(name: string): Promise<Carrier | null>;
  findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ carriers: Carrier[]; total: number }>;
  search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ carriers: Carrier[]; total: number }>;
  update(id: number, carrier: Partial<Carrier>): Promise<Carrier>;
  delete(id: number): Promise<void>;
  findActive(): Promise<Carrier[]>;
  count(): Promise<number>;
  countActive(): Promise<number>;
  findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ carriers: Carrier[]; total: number }>;
}
