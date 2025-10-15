import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export class RegisterRequestDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
  })
  password: string;

  @IsString({ message: "First name must be a string" })
  @IsNotEmpty({ message: "First name is required" })
  @MinLength(2, { message: "First name must be at least 2 characters long" })
  firstName: string;

  @IsString({ message: "Last name must be a string" })
  @IsNotEmpty({ message: "Last name is required" })
  @MinLength(2, { message: "Last name must be at least 2 characters long" })
  lastName: string;

  @IsOptional()
  @IsString({ message: "Phone must be a string" })
  phone?: string;

  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive?: boolean = true;

  @IsOptional()
  @IsBoolean({ message: "isEmailVerified must be a boolean" })
  isEmailVerified?: boolean = true; // Set to true for development

  @IsOptional()
  @IsArray({ message: "roleIds must be an array" })
  @IsInt({ each: true, message: "Each role ID must be an integer" })
  roleIds?: number[];
}
