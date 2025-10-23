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

  const port = process.env.PORT || 3003;
  await app.listen(port);

  logger.log(`🚀 User Service is running on: http://localhost:${port}`);
  logger.log(`� API Documentation: http://localhost:${port}/api/v1/health`);
  logger.log(`✅ Structured Logging: Winston JSON format enabled`);
  logger.log(`✅ Request/Response logging with correlation IDs enabled`);
}

bootstrap().catch((err) => {
  console.error("========== BOOTSTRAP ERROR ==========");
  console.error(err);
  console.error("=====================================");
  process.exit(1);
});
