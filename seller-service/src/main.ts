import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonLoggerService, LoggingInterceptor } from '@fullstack-project/shared-infrastructure';

async function bootstrap() {
  // Create Winston logger instance
  const logger = new WinstonLoggerService();
  logger.setContext('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger, // Use Winston logger for NestJS
  });

  // Set service name for Winston
  process.env.SERVICE_NAME = 'seller-service';

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Global logging interceptor for request/response tracking
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  const port = process.env.PORT || 3010;
  await app.listen(port);

  logger.log(`🚀 Seller Service is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`📚 API Docs: http://localhost:${port}/api/v1`, 'Bootstrap');
  logger.log(`🔍 Structured logging enabled with correlation IDs`, 'Bootstrap');
}
bootstrap();
