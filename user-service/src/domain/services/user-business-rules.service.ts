import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.value-object';

/**
 * User Business Rules Service
 *
 * Focused service for user business logic and rules.
 * Follows Single Responsibility Principle - only handles business rules.
 *
 * Business Rules:
 * - Determines user eligibility for actions
 * - Calculates business metrics
 * - Applies domain-specific constraints
 */
export class UserBusinessRulesService {
  /**
   * Determines if user can be deactivated
   * @returns Whether user can be deactivated
   */
  canDeactivateUser(user: User, hasActiveSessions: boolean): boolean {
    // Cannot deactivate user with active sessions
    if (hasActiveSessions) {
      return false;
    }

    // Cannot deactivate if user has critical pending tasks
    if (this.hasCriticalPendingTasks(user)) {
      return false;
    }

    // Admin users require special approval
    if (this.isAdmin(user)) {
      return false; // Must be handled by another admin
    }

    return true;
  }

  /**
   * Determines if user can be deleted
   * @returns Whether user can be deleted
   */
  canDeleteUser(user: User, hasAnyData: boolean): boolean {
    // Cannot delete user with associated data
    if (hasAnyData) {
      return false;
    }

    // Cannot delete admin users (require special handling)
    if (this.isAdmin(user)) {
      return false;
    }

    // Cannot delete recently active users
    const daysSinceLastLogin = this.getDaysSinceLastLogin(user);
    if (daysSinceLastLogin < 30) {
      return false;
    }

    return true;
  }

  /**
   * Determines if user is eligible for premium status
   * @returns Whether user qualifies for premium
   */
  isEligibleForPremiumStatus(user: User, totalActivity: number): boolean {
    const age = this.calculateAge(user.dateOfBirth);

    // Business rule: Premium status requires age >= 18 and >= 10 activities
    if (age < 18) {
      return false;
    }

    if (totalActivity < 10) {
      return false;
    }

    // Additional business rules
    if (!user.emailVerified) {
      return false;
    }

    // Must have been active within last 90 days
    const daysSinceLastLogin = this.getDaysSinceLastLogin(user);
    if (daysSinceLastLogin > 90) {
      return false;
    }

    return true;
  }

  /**
   * Determines if user needs email verification
   * @returns Whether email verification is required
   */
  needsEmailVerification(user: User): boolean {
    if (user.emailVerified) {
      return false;
    }

    // If email is from business domain, verification is optional
    try {
      const emailObj = new Email(user.email);
      if (emailObj.isBusinessEmail()) {
        return false;
      }
    } catch {
      // Invalid email already handled in validation
      return true;
    }

    return true;
  }

  /**
   * Determines if user account is matured
   * @returns Whether account is considered matured
   */
  isAccountMatured(user: User): boolean {
    const daysSinceCreation = this.getDaysSinceCreation(user);

    // Account is matured after 7 days
    return daysSinceCreation >= 7;
  }

  /**
   * Determines if user can change email
   * @returns Whether user can change email
   */
  canChangeEmail(user: User): boolean {
    // Cannot change email too frequently
    const daysSinceLastEmailChange = this.getDaysSinceLastEmailChange(user);
    if (daysSinceLastEmailChange < 30) {
      return false;
    }

    // Cannot change email if pending verification
    if (this.hasPendingEmailChange(user)) {
      return false;
    }

    return true;
  }

  /**
   * Determines if user can reset password
   * @returns Whether password reset is allowed
   */
  canResetPassword(user: User): boolean {
    // Cannot reset password if recent reset occurred
    const daysSinceLastPasswordReset = this.getDaysSinceLastPasswordReset(user);
    if (daysSinceLastPasswordReset < 1) {
      return false;
    }

    // Cannot reset if account is locked
    if (this.isAccountLocked(user)) {
      return false;
    }

    return true;
  }

  /**
   * Determines if user account should be flagged for review
   * @returns Whether account needs review
   */
  requiresReview(user: User): boolean {
    // Flag accounts with multiple failed login attempts
    if (this.hasMultipleFailedLogins(user)) {
      return true;
    }

    // Flag accounts with suspicious activity
    if (this.hasSuspiciousActivity(user)) {
      return true;
    }

    // Flag accounts that were created but never verified
    if (this.needsEmailVerification(user) && this.getDaysSinceCreation(user) > 30) {
      return true;
    }

    return false;
  }

  /**
   * Calculates user's account health score
   * @returns Health score (0-100)
   */
  calculateAccountHealth(user: User): number {
    let score = 50; // Base score

    // Email verification (+20)
    if (user.emailVerified) {
      score += 20;
    }

    // Recent activity (+15)
    const daysSinceLastLogin = this.getDaysSinceLastLogin(user);
    if (daysSinceLastLogin <= 7) {
      score += 15;
    } else if (daysSinceLastLogin <= 30) {
      score += 10;
    }

    // Account age (+10)
    const daysSinceCreation = this.getDaysSinceCreation(user);
    if (daysSinceCreation >= 365) {
      score += 10;
    } else if (daysSinceCreation >= 90) {
      score += 5;
    }

    // Profile completion (+5)
    if (this.isProfileComplete(user)) {
      score += 5;
    }

    return Math.min(100, score);
  }

  /**
   * Determines user's risk level
   * @returns Risk level (low, medium, high, critical)
   */
  getRiskLevel(user: User): 'low' | 'medium' | 'high' | 'critical' {
    let riskScore = 0;

    // Unverified email (+20)
    if (!user.emailVerified) {
      riskScore += 20;
    }

    // Inactive for long time (+15)
    const daysSinceLastLogin = this.getDaysSinceLastLogin(user);
    if (daysSinceLastLogin > 180) {
      riskScore += 15;
    } else if (daysSinceLastLogin > 90) {
      riskScore += 10;
    }

    // Multiple failed logins (+25)
    if (this.hasMultipleFailedLogins(user)) {
      riskScore += 25;
    }

    // Suspicious activity (+30)
    if (this.hasSuspiciousActivity(user)) {
      riskScore += 30;
    }

    // Recently created (+10)
    if (this.getDaysSinceCreation(user) < 7) {
      riskScore += 10;
    }

    if (riskScore >= 50) return 'critical';
    if (riskScore >= 35) return 'high';
    if (riskScore >= 20) return 'medium';
    return 'low';
  }

  /**
   * Private helper methods
   */

  private isAdmin(user: User): boolean {
    return this.hasRole(user, 'admin') || this.hasRole(user, 'super_admin');
  }

  private hasRole(user: User, roleName: string): boolean {
    return user.roles?.some((role) => role.name === roleName && role.isActive) || false;
  }

  private calculateAge(dateOfBirth: Date): number {
    if (!dateOfBirth) return 0;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  private getDaysSinceLastLogin(user: User): number {
    if (!user.lastLoginAt) return 999;

    const now = new Date();
    const lastLogin = new Date(user.lastLoginAt);
    const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getDaysSinceCreation(user: User): number {
    const now = new Date();
    const created = new Date(user.createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getDaysSinceLastEmailChange(user: User): number {
    if (!user.passwordChangedAt) return 999;

    const now = new Date();
    const lastChange = new Date(user.passwordChangedAt);
    const diffTime = Math.abs(now.getTime() - lastChange.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getDaysSinceLastPasswordReset(user: User): number {
    // This would typically come from a separate field tracking password resets
    // For now, using passwordChangedAt as proxy
    return this.getDaysSinceLastEmailChange(user);
  }

  private hasCriticalPendingTasks(user: User): boolean {
    // This would typically check user's tasks/assignments
    // For now, returning false as placeholder
    return false;
  }

  private hasPendingEmailChange(user: User): boolean {
    // This would typically check for pending email verification requests
    // For now, returning false as placeholder
    return false;
  }

  private isAccountLocked(user: User): boolean {
    // This would typically check account lock status
    // For now, returning false as placeholder
    return false;
  }

  private hasMultipleFailedLogins(user: User): boolean {
    // This would typically check failed login attempts
    // For now, returning false as placeholder
    return false;
  }

  private hasSuspiciousActivity(user: User): boolean {
    // This would typically check for suspicious patterns
    // For now, returning false as placeholder
    return false;
  }

  private isProfileComplete(user: User): boolean {
    // Check if user has completed profile
    return !!(user.firstName && user.lastName && user.email && user.phone && user.address);
  }
}
