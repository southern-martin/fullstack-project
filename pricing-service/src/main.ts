import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@shared/infrastructure/filters/http-exception.filter';
import { TransformInterceptor } from '@shared/infrastructure/interceptors/transform.interceptor';
import { LoggingInterceptor } from '@shared/infrastructure/logging/logging.interceptor';
import { WinstonLoggerService } from '@shared/infrastructure/logging/winston-logger.service';
import { AppModule } from './app.module';

async function bootstrap() {
  // ✅ Create app without logger option (prevents scoped provider issues)
  const app = await NestFactory.create(AppModule);

  // ✅ Direct instantiation of WinstonLoggerService for bootstrap context
  const logger = new WinstonLoggerService();
  logger.setContext('Bootstrap');

  // Validate required environment variables
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL environment variable is required');
  }

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
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
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger/OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('Pricing Service API')
    .setDescription(
      'Pricing Management Service - Clean Architecture Microservice\n\n' +
        'Manages pricing rules, calculations, and pricing strategies.',
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
    .addTag('pricing', 'Pricing management endpoints')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3006;
  await app.listen(port);

  logger.log(`🚀 Pricing Service is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
  logger.log(`📝 Structured Logging: Enabled (Winston + Correlation IDs)`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start Pricing Service:', err);
  process.exit(1);
});
