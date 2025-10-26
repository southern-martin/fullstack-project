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
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterRequestDto {
  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
    required: true,
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    description:
      "User password (minimum 8 characters, must contain uppercase, lowercase, and number)",
    example: "SecurePass123!",
    minLength: 8,
    required: true,
  })
  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
  })
  password: string;

  @ApiProperty({
    description: "User first name",
    example: "John",
    minLength: 2,
    required: true,
  })
  @IsString({ message: "First name must be a string" })
  @IsNotEmpty({ message: "First name is required" })
  @MinLength(2, { message: "First name must be at least 2 characters long" })
  firstName: string;

  @ApiProperty({
    description: "User last name",
    example: "Doe",
    minLength: 2,
    required: true,
  })
  @IsString({ message: "Last name must be a string" })
  @IsNotEmpty({ message: "Last name is required" })
  @MinLength(2, { message: "Last name must be at least 2 characters long" })
  lastName: string;

  @ApiPropertyOptional({
    description: "User phone number",
    example: "+1234567890",
  })
  @IsOptional()
  @IsString({ message: "Phone must be a string" })
  phone?: string;

  @ApiPropertyOptional({
    description: "User account active status",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive?: boolean = true;

  @ApiPropertyOptional({
    description: "Email verification status",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: "isEmailVerified must be a boolean" })
  isEmailVerified?: boolean = true; // Set to true for development

  @ApiPropertyOptional({
    description: "Array of role IDs to assign to the user",
    example: [1, 2],
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: "roleIds must be an array" })
  @IsInt({ each: true, message: "Each role ID must be an integer" })
  roleIds?: number[];
}
