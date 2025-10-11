import { Expose } from "class-transformer";

export class CustomerResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;

  @Expose()
  isActive: boolean;

  @Expose()
  dateOfBirth: Date;

  @Expose()
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Expose()
  preferences: {
    company?: string;
    industry?: string;
    preferredContact?: string;
    newsletter?: boolean;
  };

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}







