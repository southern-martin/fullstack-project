import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { plainToClass } from "class-transformer";
import { User } from "../../domain/entities/user.entity";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { AssignRolesDto } from "../dto/assign-roles.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject("UserRepositoryInterface")
    private readonly userRepository: UserRepositoryInterface,
    @Inject("RoleRepositoryInterface")
    private readonly roleRepository: RoleRepositoryInterface
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email
    );
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user entity
    const user = new User();
    user.email = createUserDto.email;
    user.password = hashedPassword;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.phone = createUserDto.phone;
    user.isActive = createUserDto.isActive ?? true;
    user.isEmailVerified = createUserDto.isEmailVerified ?? false;
    user.dateOfBirth = createUserDto.dateOfBirth
      ? new Date(createUserDto.dateOfBirth)
      : null;
    user.address = createUserDto.address;
    user.preferences = createUserDto.preferences;

    // Assign roles if provided
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const roles = await this.roleRepository.findAll();
      user.roles = roles.filter((role) =>
        createUserDto.roleIds.includes(role.id)
      );
    }

    const savedUser = await this.userRepository.create(user);
    return plainToClass(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ users: UserResponseDto[]; total: number }> {
    const { users, total } = await this.userRepository.findPaginated(
      page,
      limit,
      search
    );
    const userDtos = users.map((user) =>
      plainToClass(UserResponseDto, user, { excludeExtraneousValues: true })
    );
    return { users: userDtos, total };
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findActive(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findActive();
    return users.map((user) =>
      plainToClass(UserResponseDto, user, { excludeExtraneousValues: true })
    );
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if email is being changed and if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateUserDto.email
      );
      if (existingUser) {
        throw new ConflictException("Email already exists");
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Prepare update data
    const updateData: Partial<User> = {};

    // Copy properties from DTO to update data
    if (updateUserDto.email !== undefined)
      updateData.email = updateUserDto.email;
    if (updateUserDto.password !== undefined)
      updateData.password = updateUserDto.password;
    if (updateUserDto.firstName !== undefined)
      updateData.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName !== undefined)
      updateData.lastName = updateUserDto.lastName;
    if (updateUserDto.phone !== undefined)
      updateData.phone = updateUserDto.phone;
    if (updateUserDto.isActive !== undefined)
      updateData.isActive = updateUserDto.isActive;
    if (updateUserDto.isEmailVerified !== undefined)
      updateData.isEmailVerified = updateUserDto.isEmailVerified;
    if (updateUserDto.address !== undefined)
      updateData.address = updateUserDto.address;
    if (updateUserDto.preferences !== undefined)
      updateData.preferences = updateUserDto.preferences;

    // Convert dateOfBirth string to Date if provided
    if (updateUserDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateUserDto.dateOfBirth);
    }

    // Handle role updates
    if (updateUserDto.roleIds) {
      const roles = await this.roleRepository.findAll();
      const userRoles = roles.filter((role) =>
        updateUserDto.roleIds.includes(role.id)
      );
      updateData.roles = userRoles;
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    return plainToClass(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async assignRoles(
    id: number,
    assignRolesDto: AssignRolesDto
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const roles = await this.roleRepository.findAll();
    const userRoles = roles.filter((role) =>
      assignRolesDto.roleIds.includes(role.id)
    );

    if (userRoles.length !== assignRolesDto.roleIds.length) {
      throw new BadRequestException("One or more role IDs are invalid");
    }

    user.roles = userRoles;
    const updatedUser = await this.userRepository.update(id, {
      roles: userRoles,
    });
    return plainToClass(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    await this.userRepository.delete(id);
  }

  async getCount(): Promise<number> {
    const { total } = await this.userRepository.findPaginated(1, 1);
    return total;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }

  async findByRole(roleName: string): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    const usersWithRole = users.filter((user) => user.hasRole(roleName));
    return usersWithRole.map((user) =>
      plainToClass(UserResponseDto, user, { excludeExtraneousValues: true })
    );
  }
}
