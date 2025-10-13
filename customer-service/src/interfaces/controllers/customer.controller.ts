import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateCustomerDto } from "../../application/dto/create-customer.dto";
import { CustomerResponseDto } from "../../application/dto/customer-response.dto";
import { UpdateCustomerDto } from "../../application/dto/update-customer.dto";
import { CreateCustomerUseCase } from "../../application/use-cases/create-customer.use-case";
import { DeleteCustomerUseCase } from "../../application/use-cases/delete-customer.use-case";
import { GetCustomerUseCase } from "../../application/use-cases/get-customer.use-case";
import { UpdateCustomerUseCase } from "../../application/use-cases/update-customer.use-case";

/**
 * Customer Controller
 * Interface adapter for HTTP requests
 * Follows Clean Architecture principles
 */
@Controller("customers")
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase
  ) {}

  /**
   * Create customer endpoint
   * POST /customers
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCustomerDto: CreateCustomerDto
  ): Promise<CustomerResponseDto> {
    return this.createCustomerUseCase.execute(createCustomerDto);
  }

  /**
   * Get all customers endpoint
   * GET /customers
   */
  @Get()
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{
    customers: CustomerResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.getCustomerUseCase.executeAll(pageNum, limitNum, search);
  }

  /**
   * Get active customers endpoint
   * GET /customers/active
   */
  @Get("active")
  async findActive(): Promise<CustomerResponseDto[]> {
    return this.getCustomerUseCase.executeActive();
  }

  /**
   * Get customer count endpoint
   * GET /customers/count
   */
  @Get("count")
  async getCount(): Promise<{ count: number }> {
    return this.getCustomerUseCase.executeCount();
  }

  /**
   * Get customer by email endpoint
   * GET /customers/email/:email
   */
  @Get("email/:email")
  async findByEmail(
    @Param("email") email: string
  ): Promise<CustomerResponseDto> {
    return this.getCustomerUseCase.executeByEmail(email);
  }

  /**
   * Get customer by ID endpoint
   * GET /customers/:id
   */
  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<CustomerResponseDto> {
    return this.getCustomerUseCase.executeById(id);
  }

  /**
   * Update customer endpoint
   * PATCH /customers/:id
   */
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto
  ): Promise<CustomerResponseDto> {
    return this.updateCustomerUseCase.execute(id, updateCustomerDto);
  }

  /**
   * Delete customer endpoint
   * DELETE /customers/:id
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.deleteCustomerUseCase.execute(id);
  }
}
