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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
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
@ApiTags("customers")
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
  @ApiOperation({ summary: "Create a new customer" })
  @ApiResponse({
    status: 201,
    description: "Customer successfully created",
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ApiResponse({ status: 409, description: "Customer already exists" })
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
  @ApiOperation({ summary: "Get all customers with pagination" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of customers with pagination" })
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
  @ApiOperation({ summary: "Get all active customers" })
  @ApiResponse({
    status: 200,
    description: "List of active customers",
    type: [CustomerResponseDto],
  })
  async findActive(): Promise<CustomerResponseDto[]> {
    return this.getCustomerUseCase.executeActive();
  }

  /**
   * Get customer count endpoint
   * GET /customers/count
   */
  @Get("count")
  @ApiOperation({ summary: "Get total customer count" })
  @ApiResponse({ status: 200, description: "Total number of customers" })
  async getCount(): Promise<{ count: number }> {
    return this.getCustomerUseCase.executeCount();
  }

  /**
   * Get customer by email endpoint
   * GET /customers/email/:email
   */
  @Get("email/:email")
  @ApiOperation({ summary: "Get customer by email" })
  @ApiResponse({
    status: 200,
    description: "Customer found",
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: "Customer not found" })
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
  @ApiOperation({ summary: "Get customer by ID" })
  @ApiResponse({
    status: 200,
    description: "Customer found",
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: "Customer not found" })
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
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update customer by ID" })
  @ApiResponse({
    status: 200,
    description: "Customer successfully updated",
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: "Customer not found" })
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
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete customer by ID" })
  @ApiResponse({ status: 204, description: "Customer successfully deleted" })
  @ApiResponse({ status: 404, description: "Customer not found" })
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.deleteCustomerUseCase.execute(id);
  }
}
