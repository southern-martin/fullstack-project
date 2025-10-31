import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: number; // User ID
  email: string;
  iss: string; // Issuer
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

/**
 * Utility service to decode JWT tokens from Authorization header
 * This is used when Kong Gateway validates JWT but doesn't extract claims to headers
 */
@Injectable()
export class JwtDecoder {
  constructor(private configService: ConfigService) {}

  /**
   * Extract and decode JWT token from Authorization header
   * @param authHeader Authorization header value (e.g., "Bearer <token>")
   * @returns Decoded JWT payload
   */
  decodeToken(authHeader: string | undefined): JwtPayload {
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    // Extract token from "Bearer <token>" format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const token = parts[1];

    try {
      // Decode JWT payload (middle part of token)
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) {
        throw new UnauthorizedException('Invalid token format');
      }

      // Base64 decode
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const payload: JwtPayload = JSON.parse(payloadJson);

      // Verify token hasn't expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new UnauthorizedException('Token has expired');
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to decode token');
    }
  }

  /**
   * Extract user ID from JWT token in Authorization header
   * @param authHeader Authorization header value
   * @returns User ID from 'sub' claim
   */
  getUserId(authHeader: string | undefined): number {
    const payload = this.decodeToken(authHeader);
    return payload.sub;
  }

  /**
   * Extract user email from JWT token
   * @param authHeader Authorization header value
   * @returns User email
   */
  getUserEmail(authHeader: string | undefined): string {
    const payload = this.decodeToken(authHeader);
    return payload.email;
  }

  /**
   * Extract user roles from JWT token
   * @param authHeader Authorization header value
   * @returns Array of user roles
   */
  getUserRoles(authHeader: string | undefined): string[] {
    const payload = this.decodeToken(authHeader);
    return payload.roles || [];
  }

  /**
   * Check if user has a specific role
   * @param authHeader Authorization header value
   * @param role Role to check
   * @returns true if user has the role
   */
  hasRole(authHeader: string | undefined, role: string): boolean {
    const roles = this.getUserRoles(authHeader);
    return roles.includes(role);
  }
}
