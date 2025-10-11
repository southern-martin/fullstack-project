import { Carrier } from "../entities/carrier.entity";

export interface CarrierRepositoryInterface {
  create(carrier: Carrier): Promise<Carrier>;
  findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ carriers: Carrier[]; total: number }>;
  findById(id: number): Promise<Carrier | null>;
  findByName(name: string): Promise<Carrier | null>;
  findActive(): Promise<Carrier[]>;
  update(id: number, carrier: Partial<Carrier>): Promise<Carrier>;
  delete(id: number): Promise<void>;
  count(): Promise<number>;
}







