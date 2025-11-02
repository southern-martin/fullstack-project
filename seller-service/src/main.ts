import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  WinstonLoggerService,
  LoggingInterceptor,
  HttpExceptionFilter,
  TransformInterceptor,
} from '@fullstack-project/shared-infrastructure';

async function bootstrap() {
  // Create Winston logger instance
  const logger = new WinstonLoggerService();
  logger.setContext('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Set service name for Winston
  process.env.SERVICE_NAME = 'seller-service';

  // Validate required environment variables
  if (!process.env.CORS_ORIGIN) {
    throw new Error('CORS_ORIGIN environment variable is required');
  }

  // Global exception filter for standardized error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global validation pipe (HttpExceptionFilter handles error formatting)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN.split(','),
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Global logging interceptor for request/response tracking
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  // Global interceptor for standardized success responses
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Seller Service API')
    .setDescription('Seller Management Service - Microservice')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('sellers', 'Seller management endpoints')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3010;
  await app.listen(port);

  logger.log(`🚀 Seller Service is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`, 'Bootstrap');
  logger.log(`✅ Structured logging: Winston JSON format enabled`, 'Bootstrap');
  logger.log(`✅ Request/Response logging with correlation IDs enabled`, 'Bootstrap');
}
bootstrap();
