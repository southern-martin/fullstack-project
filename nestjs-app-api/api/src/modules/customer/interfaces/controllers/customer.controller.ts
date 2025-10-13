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
} from '@nestjs/common';
import { PaginatedResponseDto, PaginationDto } from '../../../../shared/dto';
import { CreateCustomerDto } from '../../application/dto/create-customer.dto';
import { CustomerResponseDto } from '../../application/dto/customer-response.dto';
import { UpdateCustomerDto } from '../../application/dto/update-customer.dto';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { GetCustomerUseCase } from '../../application/use-cases/get-customer.use-case';
import { UpdateCustomerUseCase } from '../../application/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from '../../application/use-cases/delete-customer.use-case';

/**
 * CustomerController
 * 
 * This controller serves as the HTTP interface for customer-related operations.
 * It delegates business logic to use cases and handles HTTP-specific concerns.
 */
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
    return this.createCustomerUseCase.execute(createCustomerDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<PaginatedResponseDto<CustomerResponseDto>> {
    const result = await this.getCustomerUseCase.getAll(paginationDto);
    return {
      data: result.customers,
      total: result.total,
      page: paginationDto.page,
      limit: paginationDto.limit,
    };
  }

  @Get('active')
  async findActive(): Promise<CustomerResponseDto[]> {
    return this.getCustomerUseCase.getActive();
  }

  @Get('search')
  async search(
    @Query('q') searchTerm: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<CustomerResponseDto>> {
    const result = await this.getCustomerUseCase.search(searchTerm, paginationDto);
    return {
      data: result.customers,
      total: result.total,
      page: paginationDto.page,
      limit: paginationDto.limit,
    };
  }

  @Get('count')
  async getCount(): Promise<{ count: number }> {
    return this.getCustomerUseCase.getCount();
  }

  @Get('count/active')
  async getActiveCount(): Promise<{ count: number }> {
    return this.getCustomerUseCase.getActiveCount();
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<CustomerResponseDto> {
    return this.getCustomerUseCase.getByEmail(email);
  }

  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<CustomerResponseDto[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.getCustomerUseCase.getByDateRange(start, end);
  }

  @Get('location')
  async findByLocation(
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('country') country?: string,
  ): Promise<CustomerResponseDto[]> {
    return this.getCustomerUseCase.getByLocation({ city, state, country });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CustomerResponseDto> {
    return this.getCustomerUseCase.getById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.updateCustomerUseCase.execute(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.deleteCustomerUseCase.execute(id);
  }
}
