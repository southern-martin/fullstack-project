import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerRepositoryInterface } from "../../domain/repositories/customer.repository.interface";
import { CreateCustomerDto } from "../dto/create-customer.dto";
import { CustomerResponseDto } from "../dto/customer-response.dto";
import { UpdateCustomerDto } from "../dto/update-customer.dto";

@Injectable()
export class CustomerService {
  constructor(
    @Inject("CustomerRepositoryInterface")
    private readonly customerRepository: CustomerRepositoryInterface
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto
  ): Promise<CustomerResponseDto> {
    // Check if email already exists
    const existingCustomer = await this.customerRepository.findByEmail(
      createCustomerDto.email
    );
    if (existingCustomer) {
      throw new ConflictException("Email already exists");
    }

    const customer = new Customer();
    customer.email = createCustomerDto.email;
    customer.firstName = createCustomerDto.firstName;
    customer.lastName = createCustomerDto.lastName;
    customer.phone = createCustomerDto.phone;
    customer.isActive = createCustomerDto.isActive ?? true;
    customer.dateOfBirth = createCustomerDto.dateOfBirth
      ? new Date(createCustomerDto.dateOfBirth)
      : null;
    customer.address = createCustomerDto.address;
    customer.preferences = createCustomerDto.preferences;

    const savedCustomer = await this.customerRepository.create(customer);
    return plainToClass(CustomerResponseDto, savedCustomer, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ customers: CustomerResponseDto[]; total: number }> {
    const { customers, total } = await this.customerRepository.findAll(
      page,
      limit,
      search
    );
    const customerDtos = customers.map((customer) =>
      plainToClass(CustomerResponseDto, customer, {
        excludeExtraneousValues: true,
      })
    );
    return { customers: customerDtos, total };
  }

  async findById(id: number): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }
    return plainToClass(CustomerResponseDto, customer, {
      excludeExtraneousValues: true,
    });
  }

  async findByEmail(email: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }
    return plainToClass(CustomerResponseDto, customer, {
      excludeExtraneousValues: true,
    });
  }

  async findActive(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.findActive();
    return customers.map((customer) =>
      plainToClass(CustomerResponseDto, customer, {
        excludeExtraneousValues: true,
      })
    );
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    // Check if email is being changed and if it already exists
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.customerRepository.findByEmail(
        updateCustomerDto.email
      );
      if (existingCustomer) {
        throw new ConflictException("Email already exists");
      }
    }

    // Prepare update data
    const updateData: Partial<Customer> = {};

    if (updateCustomerDto.email !== undefined)
      updateData.email = updateCustomerDto.email;
    if (updateCustomerDto.firstName !== undefined)
      updateData.firstName = updateCustomerDto.firstName;
    if (updateCustomerDto.lastName !== undefined)
      updateData.lastName = updateCustomerDto.lastName;
    if (updateCustomerDto.phone !== undefined)
      updateData.phone = updateCustomerDto.phone;
    if (updateCustomerDto.isActive !== undefined)
      updateData.isActive = updateCustomerDto.isActive;
    if (updateCustomerDto.address !== undefined)
      updateData.address = updateCustomerDto.address;
    if (updateCustomerDto.preferences !== undefined)
      updateData.preferences = updateCustomerDto.preferences;

    // Convert dateOfBirth string to Date if provided
    if (updateCustomerDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateCustomerDto.dateOfBirth);
    }

    const updatedCustomer = await this.customerRepository.update(
      id,
      updateData
    );
    return plainToClass(CustomerResponseDto, updatedCustomer, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: number): Promise<void> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }
    await this.customerRepository.delete(id);
  }

  async getCount(): Promise<{ count: number }> {
    const count = await this.customerRepository.count();
    return { count };
  }
}

