import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

/**
 * Password Service
 * Application service responsible for password hashing and verification
 * Encapsulates password security concerns
 */
@Injectable()
export class PasswordService {
  private readonly saltRounds = 10;

  /**
   * Hash a plain text password
   * @param plainPassword - The plain text password to hash
   * @returns Hashed password
   */
  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  /**
   * Verify a plain text password against a hash
   * @param plainPassword - The plain text password to verify
   * @param hashedPassword - The hashed password to compare against
   * @returns True if password matches, false otherwise
   */
  async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Check if a password needs rehashing (e.g., if salt rounds changed)
   * @param hashedPassword - The hashed password to check
   * @returns True if rehashing is needed, false otherwise
   */
  needsRehash(hashedPassword: string): boolean {
    try {
      const rounds = bcrypt.getRounds(hashedPassword);
      return rounds !== this.saltRounds;
    } catch (error) {
      // Invalid hash format
      return true;
    }
  }
}
