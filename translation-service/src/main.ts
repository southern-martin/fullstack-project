// Register tsconfig paths for module resolution
import "tsconfig-paths/register";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { HttpExceptionFilter } from "@shared/infrastructure/filters/http-exception.filter";
import { TransformInterceptor } from "@shared/infrastructure/interceptors/transform.interceptor";
import { LoggingInterceptor } from "@shared/infrastructure/logging/logging.interceptor";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";
import { AppModule } from "./app.module";

async function bootstrap() {
  // ✅ Create app without logger option (prevents scoped provider issues)
  const app = await NestFactory.create(AppModule);

  // ✅ Direct instantiation of WinstonLoggerService for bootstrap context
  const logger = new WinstonLoggerService();
  logger.setContext("Bootstrap");

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

  logger.log(`🚀 Translation Service is running on: http://localhost:${port}`);
  logger.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
  logger.log(
    `✅ API Standards: Global Exception Filter & Transform Interceptor enabled`
  );
  logger.log(`📝 Structured Logging: Enabled (Winston + Correlation IDs)`);
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start Translation Service:", err);
  process.exit(1);
});
