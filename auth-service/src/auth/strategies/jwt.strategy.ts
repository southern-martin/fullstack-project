import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../../user/user.service";
import { UserResponseDto } from "../dto/user-response.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET", "your-secret-key"),
    });
  }

  async validate(payload: any): Promise<UserResponseDto> {
    try {
      const user = await this.userService.findById(payload.sub);
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


