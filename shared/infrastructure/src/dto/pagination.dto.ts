import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

/**
 * Pagination DTO
 *
 * Standardized pagination parameters for all services.
 */
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  search?: string;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  sortOrder?: "asc" | "desc" = "asc";

  /**
   * Get the offset for database queries
   */
  getOffset(): number {
    return ((this.page || 1) - 1) * (this.limit || 10);
  }

  /**
   * Get the limit for database queries
   */
  getLimit(): number {
    return this.limit || 10;
  }

  /**
   * Get the page number
   */
  getPage(): number {
    return this.page || 1;
  }

  /**
   * Get the search term
   */
  getSearch(): string | undefined {
    return this.search;
  }

  /**
   * Get the sort field
   */
  getSortBy(): string | undefined {
    return this.sortBy;
  }

  /**
   * Get the sort order
   */
  getSortOrder(): "asc" | "desc" {
    return this.sortOrder || "asc";
  }

  /**
   * Check if search is provided
   */
  hasSearch(): boolean {
    return !!this.search && this.search.trim().length > 0;
  }

  /**
   * Check if sorting is provided
   */
  hasSorting(): boolean {
    return !!this.sortBy && this.sortBy.trim().length > 0;
  }

  /**
   * Get normalized search term (trimmed and lowercased)
   */
  getNormalizedSearch(): string | undefined {
    return this.search?.trim().toLowerCase();
  }

  /**
   * Create a copy with different parameters
   */
  clone(overrides: Partial<PaginationDto> = {}): PaginationDto {
    const cloned = new PaginationDto();
    cloned.page = overrides.page ?? this.page;
    cloned.limit = overrides.limit ?? this.limit;
    cloned.search = overrides.search ?? this.search;
    cloned.sortBy = overrides.sortBy ?? this.sortBy;
    cloned.sortOrder = overrides.sortOrder ?? this.sortOrder;
    return cloned;
  }
}
