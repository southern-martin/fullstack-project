import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { HttpExceptionFilter } from "@shared/infrastructure/filters/http-exception.filter";
import { TransformInterceptor } from "@shared/infrastructure/interceptors/transform.interceptor";
import {
  LoggingInterceptor,
  WinstonLoggerService,
} from "@shared/infrastructure/logging";
import { AppModule } from "./app.module";

async function bootstrap() {
  // Create the NestJS app (use default logger for NestJS internal logging)
  const app = await NestFactory.create(AppModule);

  // Create Winston logger instance for application logging
  const logger = new WinstonLoggerService();
  logger.setContext("Bootstrap");

  logger.log("NestFactory.create() completed");

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

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global logging interceptor (creates its own logger instance)
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  // Global transform interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Set global prefix
  app.setGlobalPrefix("api/v1");

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`🚀 Auth Service is running on: http://localhost:${port}`);
  logger.log(
    `📚 API Documentation: http://localhost:${port}/api/v1/auth/health`
  );
  logger.log(`✅ Structured Logging: Winston JSON format enabled`);
  logger.log(`✅ Request/Response logging with correlation IDs enabled`);
}

bootstrap().catch((err) => {
  console.error("========== BOOTSTRAP ERROR ==========");
  console.error(err);
  console.error("=====================================");
  process.exit(1);
});
