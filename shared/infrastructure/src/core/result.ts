/**
 * Result Class
 * 
 * This class provides a way to handle success and error results
 * in a functional programming style, following Clean Architecture principles.
 */
export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: string | null;
  private _value: T | null;

  private constructor(isSuccess: boolean, error: string | null, value: T | null) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result needs to contain an error message');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get the value of an error result. Use errorValue instead.');
    }
    return this._value as T;
  }

  public getErrorValue(): string {
    return this.error as string;
  }

  public static ok<U>(value: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error, null);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok(null);
  }

  /**
   * Maps the value if the result is successful
   */
  public map<U>(fn: (value: T) => U): Result<U> {
    if (this.isFailure) {
      return Result.fail<U>(this.error!);
    }
    try {
      return Result.ok<U>(fn(this._value!));
    } catch (error) {
      return Result.fail<U>(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Chains another operation if the result is successful
   */
  public flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    if (this.isFailure) {
      return Result.fail<U>(this.error!);
    }
    return fn(this._value!);
  }

  /**
   * Executes a function if the result is successful
   */
  public onSuccess(fn: (value: T) => void): Result<T> {
    if (this.isSuccess) {
      fn(this._value!);
    }
    return this;
  }

  /**
   * Executes a function if the result is a failure
   */
  public onFailure(fn: (error: string) => void): Result<T> {
    if (this.isFailure) {
      fn(this.error!);
    }
    return this;
  }
}
