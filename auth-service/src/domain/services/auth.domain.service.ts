import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import { UserRepositoryInterface } from "../repositories/user.repository.interface";
import { USER_REPOSITORY_TOKEN } from "../tokens/repository.tokens";
import { Email } from "../value-objects/email.vo";

export interface AuthDomainServiceInterface {
  validateUser(email: Email, plainTextPassword: string): Promise<User | null>;
  canUserLogin(user: User): boolean;
  updateUserLastLogin(user: User): Promise<User>;
}

@Injectable()
export class AuthDomainService implements AuthDomainServiceInterface {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async validateUser(
    email: Email,
    plainTextPassword: string
  ): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    // Compare the plain text password with the stored hash
    const isPasswordValid = await bcrypt.compare(
      plainTextPassword,
      user.password
    );

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  canUserLogin(user: User): boolean {
    return user.canLogin();
  }

  async updateUserLastLogin(user: User): Promise<User> {
    user.updateLastLogin();
    return this.userRepository.save(user);
  }
}
