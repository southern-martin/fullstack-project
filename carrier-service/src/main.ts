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

  // Global exception filter (API Standards)
  app.useGlobalFilters(new HttpExceptionFilter());

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

  const port = process.env.PORT || 3005;
  await app.listen(port);

  console.log(
    `🚀 Carrier Service is running on: http://localhost:${port}/api/v1`
  );
  console.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
  console.log(`✅ API Standards: Enabled (HttpExceptionFilter + TransformInterceptor)`);
}

bootstrap();







