import { IsString, IsOptional, IsBoolean, IsArray, MinLength, MaxLength, IsNumber } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds?: number[];

  @IsOptional()
  metadata?: Record<string, any>;
}








