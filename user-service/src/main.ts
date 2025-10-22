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

  // Global exception filter for standardized error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global logging interceptor for request/response tracking
  app.useGlobalInterceptors(new LoggingInterceptor(appLogger));

  // Global interceptor for standardized success responses
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix("api/v1");

  const port = process.env.PORT || 3003;
  await app.listen(port);

  logger.log(`🚀 User Service is running on: http://localhost:${port}/api/v1`);
  logger.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
  logger.log(`📝 Structured Logging: Winston with JSON format enabled`);
}

bootstrap();
