import { Expose } from "class-transformer";

export class CarrierResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  isActive: boolean;

  @Expose()
  contactEmail: string;

  @Expose()
  contactPhone: string;

  @Expose()
  metadata: {
    code?: string;
    website?: string;
    trackingUrl?: string;
    serviceTypes?: string[];
    coverage?: string[];
    pricing?: {
      baseRate?: number;
      currency?: string;
      perKgRate?: number;
    };
  };

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}




