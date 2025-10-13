/**
 * API Response DTO
 * 
 * Standardized response format for all API endpoints.
 */
export class ApiResponseDto<T = any> {
  public readonly data: T;
  public readonly message: string;
  public readonly statusCode: number;
  public readonly timestamp: string;
  public readonly success: boolean;

  constructor(
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    success: boolean = true
  ) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.success = success;
  }

  /**
   * Create a successful response
   */
  static success<T>(data: T, message?: string): ApiResponseDto<T> {
    return new ApiResponseDto(data, message || 'Success', 200, true);
  }

  /**
   * Create a created response (201)
   */
  static created<T>(data: T, message?: string): ApiResponseDto<T> {
    return new ApiResponseDto(data, message || 'Created successfully', 201, true);
  }

  /**
   * Create a no content response (204)
   */
  static noContent(message?: string): ApiResponseDto<null> {
    return new ApiResponseDto(null, message || 'No content', 204, true);
  }

  /**
   * Create a paginated response
   */
  static paginated<T>(
    data: T[],
    pagination: PaginationInfo,
    message?: string
  ): ApiResponseDto<PaginatedData<T>> {
    const paginatedData: PaginatedData<T> = {
      items: data,
      pagination
    };
    return new ApiResponseDto(paginatedData, message || 'Success', 200, true);
  }

  /**
   * Convert to JSON
   */
  toJSON(): string {
    return JSON.stringify(this);
  }

  /**
   * Get response metadata
   */
  getMetadata(): ResponseMetadata {
    return {
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      success: this.success
    };
  }
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated data structure
 */
export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationInfo;
}

/**
 * Response metadata
 */
export interface ResponseMetadata {
  message: string;
  statusCode: number;
  timestamp: string;
  success: boolean;
}
