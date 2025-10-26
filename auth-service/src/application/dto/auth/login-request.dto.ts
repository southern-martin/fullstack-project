import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestDto {
  @ApiProperty({
    description: "User email address",
    example: "admin@example.com",
    required: true,
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    description: "User password (minimum 6 characters)",
    example: "Admin123!",
    minLength: 6,
    required: true,
  })
  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;
}








