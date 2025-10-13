import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';
import { AuthDomainService } from '../../domain/services/auth.domain.service';
import { AuthResponseDto } from '../dto/auth-response.dto';

/**
 * RefreshTokenUseCase
 * 
 * This use case handles JWT token refresh.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly authDomainService: AuthDomainService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Executes the refresh token use case.
   * @param token The current JWT token.
   * @returns New authentication response with refreshed JWT token.
   */
  async execute(token: string): Promise<AuthResponseDto> {
    try {
      // 1. Verify and decode the current token
      const decoded = this.jwtService.verify(token);
      
      if (!decoded.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      // 2. Find user by ID
      const user = await this.userRepository.findById(decoded.sub);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // 3. Validate user authentication status
      const userValidation = this.authDomainService.validateUserAuthentication(user);
      if (!userValidation.isValid) {
        throw new UnauthorizedException(userValidation.errors.join(', '));
      }

      // 4. Generate new JWT token
      const payload = this.authDomainService.generateJwtPayload(user);
      const accessToken = this.jwtService.sign(payload);

      // 5. Return response
      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          roles: user.roles?.map(role => ({
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: role.permissions || [],
          })) || [],
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
