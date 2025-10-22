// Register tsconfig paths for module resolution
import "tsconfig-paths/register";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "@shared/infrastructure/filters/http-exception.filter";
import { TransformInterceptor } from "@shared/infrastructure/interceptors/transform.interceptor";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";
import { LoggingInterceptor } from "@shared/infrastructure/logging/logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Set up Winston logger
  const logger = app.get(WinstonLoggerService);
  app.useLogger(logger);

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

  // Global logging interceptor (Correlation IDs + Request/Response logging)
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  // Global transform interceptor - Wraps all successful responses
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global prefix
  app.setGlobalPrefix("api/v1");

  const port = process.env.PORT || 3007;
  await app.listen(port);

  logger.log(
    `🚀 Translation Service is running on: http://localhost:${port}/api/v1`,
    "Bootstrap"
  );
  logger.log(`📊 Health check: http://localhost:${port}/api/v1/health`, "Bootstrap");
  logger.log(`✅ API Standards: Global Exception Filter & Transform Interceptor enabled`, "Bootstrap");
  logger.log(`📝 Structured Logging: Enabled (Winston + Correlation IDs)`, "Bootstrap");
}

bootstrap();







