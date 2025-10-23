import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { HttpExceptionFilter } from "@shared/infrastructure/filters/http-exception.filter";
import { TransformInterceptor } from "@shared/infrastructure/interceptors/transform.interceptor";
import { LoggingInterceptor } from "@shared/infrastructure/logging/logging.interceptor";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";
import { AppModule } from "./app.module";

async function bootstrap() {
  // ✅ Create app without logger option (fix for scoped provider issue)
  const app = await NestFactory.create(AppModule);

  // ✅ Direct instantiation for bootstrap logger (cannot use app.get() for scoped providers)
  const logger = new WinstonLoggerService();
  logger.setContext("Bootstrap");

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  // Global exception filter (API Standards)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global logging interceptor (Correlation IDs + Request/Response logging)
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  // Global transform interceptor (API Standards)
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Global prefix
  app.setGlobalPrefix("api/v1");

  const port = process.env.PORT || 3004;
  await app.listen(port);

  logger.log(`🚀 Customer Service is running on: http://localhost:${port}`);
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
