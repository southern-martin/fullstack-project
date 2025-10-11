import * as bcrypt from "bcrypt";

export class Password {
  private readonly hashedValue: string;

  constructor(password: string, isHashed: boolean = false) {
    if (isHashed) {
      this.hashedValue = password;
    } else {
      this.validatePassword(password);
      this.hashedValue = this.hashPassword(password);
    }
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    if (!/(?=.*[a-z])/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter");
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter");
    }

    if (!/(?=.*\d)/.test(password)) {
      throw new Error("Password must contain at least one number");
    }
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.hashedValue);
  }

  getHashedValue(): string {
    return this.hashedValue;
  }

  equals(other: Password): boolean {
    return this.hashedValue === other.hashedValue;
  }
}








