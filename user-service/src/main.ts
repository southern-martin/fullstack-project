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
  // ✅ Create app without logger option (fix for scoped provider issue)
  const app = await NestFactory.create(AppModule);

  // ✅ Direct instantiation for bootstrap logger (cannot use app.get() for scoped providers)
  const logger = new WinstonLoggerService();
  logger.setContext("Bootstrap");

  // Global exception filter for standardized error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global logging interceptor for request/response tracking
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

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

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle("User Service API")
    .setDescription("User Management Service - Clean Architecture Microservice")
    .setVersion("1.0")
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
    .addTag("users", "User management endpoints")
    .addTag("roles", "Role management endpoints")
    .addTag("permissions", "Permission management endpoints")
    .addTag("profiles", "User profile endpoints")
    .addTag("health", "Health check endpoints")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3003;
  await app.listen(port);

  logger.log(`🚀 User Service is running on: http://localhost:${port}`);
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
