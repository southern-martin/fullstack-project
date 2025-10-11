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
import { CreateCustomerDto } from "../application/dto/create-customer.dto";
import { CustomerResponseDto } from "../application/dto/customer-response.dto";
import { UpdateCustomerDto } from "../application/dto/update-customer.dto";
import { CustomerService } from "../application/services/customer.service";

@Controller("customers")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCustomerDto: CreateCustomerDto
  ): Promise<CustomerResponseDto> {
    return await this.customerService.create(createCustomerDto);
  }

  @Get()
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{ customers: CustomerResponseDto[]; total: number }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return await this.customerService.findAll(pageNum, limitNum, search);
  }

  @Get("active")
  async findActive(): Promise<CustomerResponseDto[]> {
    return await this.customerService.findActive();
  }

  @Get("count")
  async getCount(): Promise<{ count: number }> {
    return await this.customerService.getCount();
  }

  @Get("email/:email")
  async findByEmail(
    @Param("email") email: string
  ): Promise<CustomerResponseDto> {
    return await this.customerService.findByEmail(email);
  }

  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<CustomerResponseDto> {
    return await this.customerService.findById(id);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto
  ): Promise<CustomerResponseDto> {
    return await this.customerService.update(id, updateCustomerDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.customerService.delete(id);
  }
}
