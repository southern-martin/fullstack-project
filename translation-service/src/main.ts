// Register tsconfig paths for module resolution
import "tsconfig-paths/register";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "@shared/infrastructure/filters/http-exception.filter";
import { TransformInterceptor } from "@shared/infrastructure/interceptors/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // Global transform interceptor - Wraps all successful responses
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global prefix
  app.setGlobalPrefix("api/v1");

  const port = process.env.PORT || 3007;
  await app.listen(port);

  console.log(
    `🚀 Translation Service is running on: http://localhost:${port}/api/v1`
  );
  console.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
  console.log(`✅ API Standards: Global Exception Filter & Transform Interceptor enabled`);
}

bootstrap();







