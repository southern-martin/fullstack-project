import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { USER_REPOSITORY_TOKEN } from "../../domain/tokens/repository.tokens";
import { UserResponseDto } from "../dto/user-response.dto";

export interface ValidateTokenUseCaseInterface {
  execute(token: string): Promise<UserResponseDto>;
}

@Injectable()
export class ValidateTokenUseCase implements ValidateTokenUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService
  ) {}

  async execute(token: string): Promise<UserResponseDto> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      if (!user.isActive) {
        throw new UnauthorizedException("User account is inactive");
      }

      return new UserResponseDto(user);
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
