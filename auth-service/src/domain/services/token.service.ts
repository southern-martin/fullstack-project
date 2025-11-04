import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { TokenValidationResult } from '../interfaces/validation.interface';

/**
 * JWT Token Payload Interface
 */
export interface JwtPayload {
  sub: number; // Subject (user ID)
  email: string;
  iss: string; // Issuer
  iat?: number; // Issued at
  exp?: number; // Expiration
  roles: string[];
  permissions: string[];
  sessionId?: string;
  type?: 'access' | 'refresh' | 'reset' | 'verification';
}

  /**
   * Token Generation Options
   */
  export interface TokenOptions {
    expiresIn?: number | string;
    issuer?: string;
    audience?: string;
    subject?: string;
    sessionId?: string;
    type?: 'access' | 'refresh' | 'reset' | 'verification';
  }

/**
 * Token Service
 * Handles JWT token generation, validation, and management
 * Follows Clean Architecture principles
 */
@Injectable()
export class TokenService {
  /**
   * Default token expiration times (in seconds)
   */
  private readonly defaultExpiration = {
    access: 3600, // 1 hour
    refresh: 86400 * 7, // 7 days
    reset: 3600, // 1 hour
    verification: 86400, // 24 hours
  };

  /**
   * Default issuer for tokens
   */
  private readonly defaultIssuer = 'auth-service';

  /**
   * Generates JWT payload for user
   * @param user - User entity
   * @param options - Token generation options
   * @returns JWT payload
   */
  generatePayload(user: User, options: TokenOptions = {}): JwtPayload {
    const payload: JwtPayload = {
      sub: user.id!,
      email: user.email,
      iss: options.issuer || this.defaultIssuer,
      roles: user.roles?.map(role => role.name) || [],
      permissions: this.getUserPermissions(user),
      sessionId: options.sessionId,
      type: options.type || 'access',
    };

    return payload;
  }

  /**
   * Validates JWT token structure and basic integrity
   * @param token - JWT token string
   * @returns Token validation result
   */
  validateTokenStructure(token: string): TokenValidationResult {
    try {
      if (!token) {
        return {
          isValid: false,
          error: 'Token is required',
        };
      }

      // Basic JWT structure validation
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {
          isValid: false,
          error: 'Invalid token structure',
        };
      }

      // Decode header and payload (without verification)
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());

      // Basic header validation
      if (header.alg !== 'HS256' && header.alg !== 'RS256') {
        return {
          isValid: false,
          error: 'Unsupported token algorithm',
        };
      }

      // Basic payload validation
      if (!payload.sub || !payload.email) {
        return {
          isValid: false,
          error: 'Invalid token payload',
        };
      }

      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return {
          isValid: false,
          error: 'Token has expired',
          expiresAt: new Date(payload.exp * 1000),
        };
      }

      return {
        isValid: true,
        userId: payload.sub,
        email: payload.email,
        roles: payload.roles || [],
        permissions: payload.permissions || [],
        expiresAt: payload.exp ? new Date(payload.exp * 1000) : undefined,
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Token parsing failed',
      };
    }
  }

  /**
   * Gets token expiration time based on type
   * @param type - Token type
   * @param customExpiration - Custom expiration time
   * @returns Expiration time in seconds
   */
  getTokenExpiration(type: 'access' | 'refresh' | 'reset' | 'verification' = 'access', customExpiration?: number): number {
    return customExpiration || this.defaultExpiration[type];
  }

  /**
   * Checks if token is refresh token
   * @param payload - JWT payload
   * @returns True if token is refresh token
   */
  isRefreshToken(payload: JwtPayload): boolean {
    return payload.type === 'refresh';
  }

  /**
   * Checks if token is access token
   * @param payload - JWT payload
   * @returns True if token is access token
   */
  isAccessToken(payload: JwtPayload): boolean {
    return payload.type === 'access' || !payload.type;
  }

  /**
   * Checks if token is reset token
   * @param payload - JWT payload
   * @returns True if token is reset token
   */
  isResetToken(payload: JwtPayload): boolean {
    return payload.type === 'reset';
  }

  /**
   * Checks if token is verification token
   * @param payload - JWT payload
   * @returns True if token is verification token
   */
  isVerificationToken(payload: JwtPayload): boolean {
    return payload.type === 'verification';
  }

  /**
   * Gets user permissions from roles
   * @param user - User entity
   * @returns Array of permissions
   */
  private getUserPermissions(user: User): string[] {
    const permissions = new Set<string>();

    user.roles?.forEach(role => {
      role.permissions?.forEach(permission => {
        permissions.add(permission);
      });
    });

    return Array.from(permissions);
  }

  /**
   * Generates token options for different token types
   * @param type - Token type
   * @param user - User entity
   * @param sessionId - Session ID
   * @returns Token options
   */
  getTokenOptions(type: 'access' | 'refresh' | 'reset' | 'verification', user: User, sessionId?: string): TokenOptions {
    return {
      expiresIn: this.getTokenExpiration(type),
      issuer: this.defaultIssuer,
      sessionId,
      type,
    };
  }

  /**
   * Validates token issuer
   * @param issuer - Token issuer
   * @returns True if issuer is valid
   */
  isValidIssuer(issuer: string): boolean {
    return issuer === this.defaultIssuer;
  }

  /**
   * Checks if user has required permissions from token
   * @param payload - JWT payload
   * @param requiredPermissions - Required permissions
   * @returns True if user has required permissions
   */
  hasPermissions(payload: JwtPayload, requiredPermissions: string[]): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const userPermissions = payload.permissions || [];
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  }

  /**
   * Checks if user has required roles from token
   * @param payload - JWT payload
   * @param requiredRoles - Required roles
   * @returns True if user has required roles
   */
  hasRoles(payload: JwtPayload, requiredRoles: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const userRoles = payload.roles || [];
    return requiredRoles.some(role => userRoles.includes(role));
  }

  /**
   * Gets token type from payload
   * @param payload - JWT payload
   * @returns Token type
   */
  getTokenType(payload: JwtPayload): 'access' | 'refresh' | 'reset' | 'verification' {
    return payload.type || 'access';
  }

  /**
   * Checks if token should be refreshed
   * @param payload - JWT payload
   * @param refreshThreshold - Refresh threshold in seconds (default 5 minutes)
   * @returns True if token should be refreshed
   */
  shouldRefreshToken(payload: JwtPayload, refreshThreshold: number = 300): boolean {
    if (!payload.exp) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - now;

    return timeUntilExpiry <= refreshThreshold;
  }
}
