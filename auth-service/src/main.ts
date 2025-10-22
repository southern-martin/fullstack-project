import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "@shared/infrastructure/filters/http-exception.filter";
import { TransformInterceptor } from "@shared/infrastructure/interceptors/transform.interceptor";
import { WinstonLoggerService, LoggingInterceptor } from "@shared/infrastructure/logging";

async function bootstrap() {
  // Create logger instance
  const logger = new WinstonLoggerService();
  logger.setContext('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: logger, // Use Winston logger for NestJS
  });

  // Get logger service from DI container
  const appLogger = app.get(WinstonLoggerService);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Global exception filter - Standardizes all error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global logging interceptor - Request/response tracking with correlation IDs
  app.useGlobalInterceptors(new LoggingInterceptor(appLogger));

  // Global transform interceptor - Wraps all successful responses
  app.useGlobalInterceptors(new TransformInterceptor());

  // Set global prefix
  app.setGlobalPrefix("api/v1");

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`🚀 Auth Service is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/v1/auth/health`);
  logger.log(`✅ API Standards: Global Exception Filter & Transform Interceptor enabled`);
  logger.log(`📝 Structured Logging: Winston with JSON format enabled`);
}

bootstrap();








