import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserResponseDto } from "../../application/dtos/user-response.dto";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { USER_REPOSITORY_TOKEN } from "../../domain/tokens/repository.tokens";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET", "your-secret-key"),
    });
  }

  async validate(payload: any): Promise<UserResponseDto> {
    try {
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
