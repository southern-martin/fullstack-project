import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateCustomerUseCase } from '../create-customer.use-case';
import { CustomerDomainService } from '../../../domain/services/customer.domain.service';
import { CustomerRepositoryInterface } from '../../../domain/repositories/customer.repository.interface';
import { IEventBus } from '../../../domain/events/event-bus.interface';
import { CreateCustomerDto } from '../../dto/create-customer.dto';
import { Customer } from '../../../domain/entities/customer.entity';
import { CustomerCreatedEvent } from '../../../domain/events/customer-created.event';

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let customerRepository: jest.Mocked<CustomerRepositoryInterface>;
  let customerDomainService: CustomerDomainService;
  let eventBus: jest.Mocked<IEventBus>;

  const mockCustomerRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockEventBus = {
    publish: jest.fn(),
    subscribe: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCustomerUseCase,
        CustomerDomainService,
        {
          provide: 'CustomerRepositoryInterface',
          useValue: mockCustomerRepository,
        },
        {
          provide: 'IEventBus',
          useValue: mockEventBus,
        },
      ],
    }).compile();

    useCase = module.get<CreateCustomerUseCase>(CreateCustomerUseCase);
    customerRepository = module.get('CustomerRepositoryInterface');
    customerDomainService = module.get<CustomerDomainService>(
      CustomerDomainService
    );
    eventBus = module.get('IEventBus');

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const validCreateCustomerDto: CreateCustomerDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      isActive: true,
      dateOfBirth: '1990-01-01',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'USA',
      },
      preferences: {
        company: 'Acme Corp',
        industry: 'Technology',
        newsletter: true,
      },
    };

    it('should successfully create a customer', async () => {
      // Arrange
      const savedCustomer = new Customer({
        id: 123,
        ...validCreateCustomerDto,
        dateOfBirth: new Date(validCreateCustomerDto.dateOfBirth!),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.create.mockResolvedValue(savedCustomer);
      eventBus.publish.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(validCreateCustomerDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe(validCreateCustomerDto.email.toLowerCase());
      expect(result.firstName).toBe(validCreateCustomerDto.firstName);
      expect(result.lastName).toBe(validCreateCustomerDto.lastName);
      expect(customerRepository.findByEmail).toHaveBeenCalledWith(
        validCreateCustomerDto.email
      );
      expect(customerRepository.create).toHaveBeenCalled();
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.any(CustomerCreatedEvent)
      );
    });

    it('should convert email to lowercase', async () => {
      // Arrange
      const dtoWithUppercaseEmail = {
        ...validCreateCustomerDto,
        email: 'TEST@EXAMPLE.COM',
      };

      const savedCustomer = new Customer({
        id: 123,
        ...dtoWithUppercaseEmail,
        email: dtoWithUppercaseEmail.email.toLowerCase(),
        dateOfBirth: new Date(validCreateCustomerDto.dateOfBirth!),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.create.mockResolvedValue(savedCustomer);
      eventBus.publish.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(dtoWithUppercaseEmail);

      // Assert
      expect(result.email).toBe('test@example.com');
    });

    it('should throw BadRequestException for invalid customer data', async () => {
      // Arrange
      const invalidDto: CreateCustomerDto = {
        email: 'invalid-email',
        firstName: 'J',
        lastName: 'D',
      };

      // Act & Assert
      await expect(useCase.execute(invalidDto)).rejects.toThrow(
        BadRequestException
      );
      expect(customerRepository.findByEmail).not.toHaveBeenCalled();
      expect(customerRepository.create).not.toHaveBeenCalled();
      expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      const existingCustomer = new Customer({
        id: 456,
        email: validCreateCustomerDto.email,
        firstName: 'Jane',
        lastName: 'Smith',
      });

      customerRepository.findByEmail.mockResolvedValue(existingCustomer);

      // Act & Assert
      await expect(useCase.execute(validCreateCustomerDto)).rejects.toThrow(
        ConflictException
      );
      await expect(useCase.execute(validCreateCustomerDto)).rejects.toThrow(
        'Email already exists'
      );
      expect(customerRepository.findByEmail).toHaveBeenCalledWith(
        validCreateCustomerDto.email
      );
      expect(customerRepository.create).not.toHaveBeenCalled();
      expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid preferences', async () => {
      // Arrange
      const dtoWithInvalidPreferences = {
        ...validCreateCustomerDto,
        preferences: {
          company: 'x'.repeat(2001), // Exceeds size limit
        },
      } as CreateCustomerDto;

      customerRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(
        useCase.execute(dtoWithInvalidPreferences)
      ).rejects.toThrow(BadRequestException);
      expect(customerRepository.create).not.toHaveBeenCalled();
      expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('should handle customer creation without optional fields', async () => {
      // Arrange
      const minimalDto: CreateCustomerDto = {
        email: 'minimal@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const savedCustomer = new Customer({
        id: 789,
        email: 'minimal@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.create.mockResolvedValue(savedCustomer);
      eventBus.publish.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(minimalDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe(minimalDto.email);
      expect(result.phone).toBeUndefined();
      expect(result.dateOfBirth).toBeUndefined();
      expect(result.address).toBeUndefined();
      expect(result.preferences).toBeUndefined();
    });

    it('should set isActive to true by default', async () => {
      // Arrange
      const dtoWithoutIsActive: CreateCustomerDto = {
        email: 'default@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const savedCustomer = new Customer({
        id: 999,
        email: dtoWithoutIsActive.email,
        firstName: dtoWithoutIsActive.firstName,
        lastName: dtoWithoutIsActive.lastName,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.create.mockResolvedValue(savedCustomer);
      eventBus.publish.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(dtoWithoutIsActive);

      // Assert
      expect(result.isActive).toBe(true);
    });

    it('should publish CustomerCreatedEvent after successful creation', async () => {
      // Arrange
      const savedCustomer = new Customer({
        id: 123,
        ...validCreateCustomerDto,
        dateOfBirth: new Date(validCreateCustomerDto.dateOfBirth!),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.create.mockResolvedValue(savedCustomer);
      eventBus.publish.mockResolvedValue(undefined);

      // Act
      await useCase.execute(validCreateCustomerDto);

      // Assert
      expect(eventBus.publish).toHaveBeenCalledTimes(1);
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: savedCustomer,
        })
      );
    });

    it('should convert dateOfBirth string to Date object', async () => {
      // Arrange
      const savedCustomer = new Customer({
        id: 123,
        ...validCreateCustomerDto,
        dateOfBirth: new Date(validCreateCustomerDto.dateOfBirth!),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.create.mockResolvedValue(savedCustomer);
      eventBus.publish.mockResolvedValue(undefined);

      // Act
      await useCase.execute(validCreateCustomerDto);

      // Assert
      const createCall = customerRepository.create.mock.calls[0][0];
      expect(createCall.dateOfBirth).toBeInstanceOf(Date);
    });

    it('should return fullName in response DTO', async () => {
      // Arrange
      const savedCustomer = new Customer({
        id: 123,
        ...validCreateCustomerDto,
        dateOfBirth: new Date(validCreateCustomerDto.dateOfBirth!),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.create.mockResolvedValue(savedCustomer);
      eventBus.publish.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(validCreateCustomerDto);

      // Assert
      expect(result.fullName).toBe('John Doe');
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      customerRepository.findByEmail.mockRejectedValue(
        new Error('Database connection error')
      );

      // Act & Assert
      await expect(useCase.execute(validCreateCustomerDto)).rejects.toThrow(
        'Database connection error'
      );
      expect(customerRepository.create).not.toHaveBeenCalled();
      expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('should handle event bus errors gracefully', async () => {
      // Arrange
      const savedCustomer = new Customer({
        id: 123,
        ...validCreateCustomerDto,
        dateOfBirth: new Date(validCreateCustomerDto.dateOfBirth!),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.create.mockResolvedValue(savedCustomer);
      eventBus.publish.mockRejectedValue(new Error('Event bus error'));

      // Act & Assert
      await expect(useCase.execute(validCreateCustomerDto)).rejects.toThrow(
        'Event bus error'
      );
    });

    it('should validate all required fields are present', async () => {
      // Arrange
      const missingFieldsDto = {
        email: 'test@example.com',
        // Missing firstName and lastName
      } as CreateCustomerDto;

      // Act & Assert
      await expect(useCase.execute(missingFieldsDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
