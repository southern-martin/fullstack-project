import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { Role } from "./role.entity";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ["roles"],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ["roles"],
    });
  }

  async create(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isActive?: boolean;
    isEmailVerified?: boolean;
    roleIds?: number[];
  }): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = this.userRepository.create({
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      isActive: userData.isActive ?? true,
      isEmailVerified: userData.isEmailVerified ?? false,
    });

    // Assign roles if provided
    if (userData.roleIds && userData.roleIds.length > 0) {
      const roles = await this.roleRepository.findByIds(userData.roleIds);
      user.roles = roles;
    }

    return this.userRepository.save(user);
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    });
  }

  async getDefaultRoles(): Promise<Role[]> {
    return this.roleRepository.find({
      where: { name: "user" },
    });
  }

  async createDefaultRoles(): Promise<void> {
    const existingRoles = await this.roleRepository.find();

    if (existingRoles.length === 0) {
      const defaultRoles = [
        {
          name: "user",
          description: "Regular user",
          permissions: ["read:own"],
          isActive: true,
        },
        {
          name: "admin",
          description: "Administrator",
          permissions: ["read:all", "write:all", "delete:all", "users.manage"],
          isActive: true,
        },
        {
          name: "super_admin",
          description: "Super Administrator",
          permissions: ["*"],
          isActive: true,
        },
      ];

      for (const roleData of defaultRoles) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
      }
    }
  }
}








