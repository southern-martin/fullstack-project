import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
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

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle("Auth Service API")
    .setDescription("Authentication and Authorization Service - Clean Architecture Microservice")
    .setVersion("1.0")
    .addTag("auth", "Authentication endpoints")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`🚀 Auth Service is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`✅ Structured Logging: Winston JSON format enabled`);
  logger.log(`✅ Request/Response logging with correlation IDs enabled`);
}

bootstrap().catch((err) => {
  // Use Winston logger for bootstrap errors instead of console.error
  const errorLogger = new WinstonLoggerService();
  errorLogger.setContext("Bootstrap");
  errorLogger.error("========== BOOTSTRAP ERROR ==========");
  errorLogger.error(err.stack || err.message || err);
  errorLogger.error("=====================================");
  process.exit(1);
});
