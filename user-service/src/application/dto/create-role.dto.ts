import { IsString, IsOptional, IsBoolean, IsArray, MinLength, MaxLength, IsNumber, ArrayNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds?: number[];

  @IsOptional()
  metadata?: Record<string, any>;
}








