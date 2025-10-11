import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from "@nestjs/common";
import { Response } from "express";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let validationErrors: any = {};

    if (typeof exceptionResponse === "object" && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;

      if (responseObj.message && Array.isArray(responseObj.message)) {
        // Handle class-validator errors
        responseObj.message.forEach((error: any) => {
          if (error.constraints) {
            const field = error.property;
            const messages = Object.values(error.constraints);
            validationErrors[field] = messages[0]; // Take the first error message
          }
        });
      } else if (responseObj.message) {
        // Handle single error message
        validationErrors.general = responseObj.message;
      }
    }

    response.status(status).json({
      statusCode: status,
      message: "Validation failed",
      errors: validationErrors,
      timestamp: new Date().toISOString(),
    });
  }
}

